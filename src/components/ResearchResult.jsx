/**
 * components/ResearchResult.jsx
 * Renders the AI-generated research paper in a polished, readable format.
 * Provides copy-to-clipboard, PDF download, and back navigation.
 */

import React, { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import apiClient from '../services/api'

// ─── Icons ────────────────────────────────────────────────────────────────────
const CopyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)
const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)
const ArrowLeftIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)
const PrintIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
)

const SourcesIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400/90 shrink-0">
    <circle cx="12" cy="12" r="2.5" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" />
  </svg>
)

// ─── API `sources_used` slugs → readable labels ───────────────────────────────
const SOURCE_LABELS = {
  hackernews: 'Hacker News',
  hacker_news: 'Hacker News',
  youtube: 'YouTube',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  reddit: 'Reddit',
  rss: 'RSS',
  google_news: 'Google News',
  google_linkedin: 'LinkedIn (web)',
  podcasts: 'Podcasts',
  arxiv: 'arXiv',
}

function formatSourceLabel(slug) {
  const key = String(slug).toLowerCase().replace(/-/g, '_')
  if (SOURCE_LABELS[key]) return SOURCE_LABELS[key]
  return String(slug)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatReportTimestamp(iso) {
  if (!iso || typeof iso !== 'string') return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

// ─── Sources strip (API `sources_used`) ───────────────────────────────────────
const SourcesUsedStrip = ({ sources }) => {
  if (!sources?.length) return null
  return (
    <div className="mt-6 pt-6 border-t border-ink-800/50">
      <div className="flex items-center gap-2 mb-3.5">
        <SourcesIcon />
        <span className="text-ink-500 font-mono text-[11px] uppercase tracking-widest">
          Sources analyzed
        </span>
        <span className="text-ink-800 font-mono text-xs tabular-nums">
          ({sources.length})
        </span>
      </div>
      <ul className="flex flex-wrap gap-2" role="list" aria-label="Data sources used for this report">
        {sources.map((raw) => {
          const key = String(raw)
          const label = formatSourceLabel(raw)
          return (
            <li key={key}>
              <span
                className="
                  inline-flex items-center gap-2 rounded-lg px-3 py-2
                  bg-gradient-to-br from-ink-800/90 to-ink-900/80
                  border border-ink-700/70 border-l-2 border-l-amber-500/70
                  text-ink-200 text-[13px] font-body leading-none
                  shadow-sm shadow-black/20
                "
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70 shrink-0" aria-hidden />
                {label}
              </span>
            </li>
          )
        })}
      </ul>
      <p className="text-ink-700 text-[11px] font-mono mt-3 leading-relaxed">
        Signals were gathered across these channels for this run.
      </p>
    </div>
  )
}

// ─── Action Button ─────────────────────────────────────────────────────────────
const ActionButton = ({ onClick, icon, label, variant = 'ghost' }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 text-xs font-medium font-body px-3.5 py-2 rounded-lg
      transition-all duration-200 border
      ${variant === 'primary'
        ? 'bg-amber-400/10 border-amber-400/30 text-amber-400 hover:bg-amber-400/20 hover:border-amber-400/50'
        : 'bg-ink-800/60 border-ink-700/60 text-ink-400 hover:bg-ink-700/60 hover:text-ink-200 hover:border-ink-600'
      }
    `}
  >
    {icon}
    {label}
  </button>
)

// ─── Component ────────────────────────────────────────────────────────────────
const ResearchResult = ({ content, topic, jobId, sourcesUsed, generatedAt, onBack }) => {
  const [copied, setCopied] = useState(false)
  const paperRef = useRef(null)

  // ── Copy to clipboard ────────────────────────────────────────
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = content
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  // ── Download as .md file (server export when jobId is available) ─
  const handleDownloadMd = async () => {
    const fallbackName = `${topic.slice(0, 50).replace(/[^a-z0-9]/gi, '_').toLowerCase()}_research.md`

    if (jobId) {
      try {
        const res = await apiClient.get(`/report/${jobId}/download`, { responseType: 'blob' })
        const blob = res.data instanceof Blob ? res.data : new Blob([res.data], { type: 'text/markdown;charset=utf-8' })
        const cd = res.headers['content-disposition']
        let filename = fallbackName
        const match = typeof cd === 'string' && cd.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i)
        if (match) {
          try {
            filename = decodeURIComponent(match[1].replace(/"/g, ''))
          } catch {
            filename = match[1].replace(/"/g, '')
          }
        }
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
        return
      } catch {
        // Fall through to client-side export
      }
    }

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fallbackName
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Print / Save as PDF: only #research-pdf-root is visible (@media print in index.css)
  const handlePrint = () => {
    window.print()
  }

  // ── Word count ───────────────────────────────────────────────
  const wordCount = content.trim().split(/\s+/).length
  const reportDateLabel = formatReportTimestamp(generatedAt)

  return (
    <section className="w-full max-w-3xl mx-auto animate-fade-up">
      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-ink-500 hover:text-ink-200 text-sm font-medium transition-colors duration-200 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform duration-200">
            <ArrowLeftIcon />
          </span>
          New Research
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <ActionButton
            onClick={handleCopy}
            icon={copied ? <CheckIcon /> : <CopyIcon />}
            label={copied ? 'Copied!' : 'Copy'}
            variant={copied ? 'primary' : 'ghost'}
          />
          <ActionButton
            onClick={handleDownloadMd}
            icon={<DownloadIcon />}
            label="Download .md"
          />
          <ActionButton
            onClick={handlePrint}
            icon={<PrintIcon />}
            label="Save PDF"
          />
        </div>
      </div>

      {/* ── Paper Card (this subtree is the only content included when printing to PDF) ─ */}
      <div
        id="research-pdf-root"
        ref={paperRef}
        className="research-pdf-root bg-ink-900/50 border border-ink-800/80 rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
      >
        {/* Document Header (screen only — PDF is markdown body from API) */}
        <div className="print:hidden px-8 pt-8 pb-6 border-b border-ink-800/60">
          <div className="flex items-center gap-2 text-ink-600 font-mono text-[11px] uppercase tracking-widest mb-3">
            <span className="w-4 h-px bg-amber-400/40" />
            Research Paper
            <span className="w-4 h-px bg-amber-400/40" />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink-50 leading-snug">
            {topic}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-ink-600 text-xs font-mono">
            <span>~{wordCount.toLocaleString()} words</span>
            <span className="text-ink-800 hidden sm:inline">·</span>
            <span>Generated by AI Research Agent</span>
            <span className="text-ink-800 hidden sm:inline">·</span>
            <span title={generatedAt || undefined}>
              {reportDateLabel ||
                new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <SourcesUsedStrip sources={sourcesUsed} />
        </div>

        {/* Research Content */}
        <div className="px-8 py-8">
          <div className="research-prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer (screen only — not part of saved PDF) */}
        <div className="print:hidden px-8 py-5 border-t border-ink-800/60 flex items-center justify-between">
          <span className="text-ink-700 text-xs font-mono">
            AI-generated content · Verify with primary sources
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-ink-600 hover:text-amber-400 text-xs font-mono transition-colors duration-200"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? 'Copied' : 'Copy all'}
          </button>
        </div>
      </div>

      {/* ── Bottom CTA ──────────────────────────────────────── */}
      <div className="mt-8 text-center">
        <button
          onClick={onBack}
          className="btn-primary inline-flex items-center gap-2.5 text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Generate Another Research
        </button>
      </div>
    </section>
  )
}

export default ResearchResult
