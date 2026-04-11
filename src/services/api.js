/**
 * services/api.js
 * Centralized API layer for communicating with the research backend.
 * All network calls go through here — easy to swap base URL or add auth headers.
 */

import axios from 'axios'

// ─── Axios Instance ──────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 120_000, // 2 minutes — AI generation can be slow
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ─── Request Interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Attach auth token if available (e.g. future JWT support)
    const token = localStorage.getItem('auth_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// ─── Response Interceptor ────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize error messages for the UI
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.'

    return Promise.reject(new Error(message))
  },
)

// ─── Research API ─────────────────────────────────────────────────────────────

/**
 * Generate a research paper for a given topic.
 * @param {string} topic - The research topic submitted by the user.
 * @returns {Promise<{ content: string }>} Markdown-formatted research content.
 */
export const generateResearch = async (topic) => {
  const response = await apiClient.post('/api/research', { topic })
  return response.data
}

export default apiClient
