/**
 * services/api.js
 * Client for the Research Agent API (OpenAPI v0.1.0).
 * Base URL: VITE_API_BASE_URL or production default below.
 */

import axios from 'axios'

// ─── Config ───────────────────────────────────────────────────────────────────
export const DEFAULT_API_BASE_URL = 'https://ai-report-gen.onrender.com'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  timeout: 120_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ─── Errors ───────────────────────────────────────────────────────────────────
function formatValidationDetail(detail) {
  if (!detail) return null
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail
      .map((d) => {
        if (d && typeof d === 'object' && 'msg' in d) {
          const loc = Array.isArray(d.loc) ? d.loc.filter(Boolean).join('.') : ''
          return loc ? `${loc}: ${d.msg}` : d.msg
        }
        return String(d)
      })
      .filter(Boolean)
      .join('; ')
  }
  if (typeof detail === 'object') return JSON.stringify(detail)
  return String(detail)
}

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const raw = error.response?.data?.detail
    const formatted = formatValidationDetail(raw)
    const message =
      formatted ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.'

    return Promise.reject(new Error(message))
  },
)

// ─── Status helpers (API uses e.g. "researching" → "complete") ───────────────
const TERMINAL_SUCCESS = new Set(['complete', 'completed', 'done', 'success', 'succeeded'])
const TERMINAL_FAILURE = new Set(['failed', 'error', 'cancelled', 'canceled'])

function isTerminalSuccess(status) {
  return TERMINAL_SUCCESS.has(String(status || '').toLowerCase())
}

function isTerminalFailure(status) {
  return TERMINAL_FAILURE.has(String(status || '').toLowerCase())
}

function extractMarkdownFromQueryResponse(body) {
  const r = body?.result
  if (r && typeof r === 'object' && typeof r.markdown === 'string' && r.markdown.trim()) {
    return r.markdown
  }
  return null
}

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    let timeoutId
    const onAbort = () => {
      clearTimeout(timeoutId)
      signal?.removeEventListener('abort', onAbort)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    timeoutId = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    if (signal) {
      if (signal.aborted) {
        clearTimeout(timeoutId)
        reject(new DOMException('Aborted', 'AbortError'))
        return
      }
      signal.addEventListener('abort', onAbort)
    }
  })
}

const POLL_INTERVAL_MS = 2_500
const MAX_JOB_WAIT_MS = 15 * 60 * 1_000

/**
 * POST /query then poll GET /status/{job_id} until markdown is available or the job fails.
 * @param {string} query
 * @param {{ signal?: AbortSignal, onProgress?: (p: { jobId: string, status: string }) => void }} [options]
 * @returns {Promise<{ content: string, jobId: string }>}
 */
export async function runResearchQuery(query, options = {}) {
  const { signal, onProgress } = options

  const { data: initial } = await apiClient.post('/query', { query }, { signal })
  const jobId = initial?.job_id
  if (!jobId) throw new Error('No job ID returned from the server.')

  onProgress?.({ jobId, status: initial.status || 'queued' })

  if (initial.error) throw new Error(initial.error)

  const st0 = String(initial.status || '').toLowerCase()
  if (isTerminalFailure(st0)) {
    throw new Error(initial.error || 'Research job failed.')
  }

  let markdown = extractMarkdownFromQueryResponse(initial)
  if (markdown) return { content: markdown, jobId }

  if (isTerminalSuccess(st0)) {
    markdown = await fetchMarkdownFromReport(jobId, signal)
    if (markdown) return { content: markdown, jobId }
    throw new Error('Research completed but no report content was returned.')
  }

  const started = Date.now()

  while (true) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    await delay(POLL_INTERVAL_MS, signal)

    const { data: s } = await apiClient.get(`/status/${jobId}`, { signal })

    onProgress?.({ jobId, status: s.status || '…' })

    if (s.error) throw new Error(s.error)

    const st = String(s.status || '').toLowerCase()
    if (isTerminalFailure(st)) {
      throw new Error(s.error || 'Research job failed.')
    }

    markdown = extractMarkdownFromQueryResponse(s)
    if (markdown) return { content: markdown, jobId }

    if (isTerminalSuccess(st)) {
      markdown = await fetchMarkdownFromReport(jobId, signal)
      if (markdown) return { content: markdown, jobId }
      throw new Error('Research completed but no report content was returned.')
    }

    if (Date.now() - started > MAX_JOB_WAIT_MS) {
      throw new Error('Research is taking longer than expected. Please try again later.')
    }
  }
}

/**
 * GET /report/{job_id} — returns JSON { status, markdown } while or after processing.
 */
export async function fetchMarkdownFromReport(jobId, signal) {
  const { data } = await apiClient.get(`/report/${jobId}`, { signal })
  if (typeof data === 'string' && data.trim()) return data
  if (data && typeof data.markdown === 'string' && data.markdown.trim()) {
    return data.markdown
  }
  return null
}

export default apiClient
