/**
 * components/Loader.jsx
 * Animated skeleton + status messages shown during AI generation.
 * Cycles through messages to keep the user engaged during the wait.
 */

import React, { useState, useEffect } from 'react'

// ─── Loading messages that cycle every few seconds ───────────────────────────
const MESSAGES = [
  'Analyzing your research topic…',
  'Gathering relevant information…',
  'Structuring the research framework…',
  'Synthesizing key insights…',
  'Drafting comprehensive sections…',
  'Reviewing and refining content…',
  'Almost ready — finalizing your paper…',
]

// ─── Skeleton line widths (visual variety) ────────────────────────────────────
const SKELETON_LINES = [
  ['w-2/5', 'mb-6'], // h2 heading
  ['w-full', 'mb-2'],
  ['w-full', 'mb-2'],
  ['w-4/5', 'mb-6'],
  ['w-1/3', 'mb-4'], // h3 heading
  ['w-full', 'mb-2'],
  ['w-full', 'mb-2'],
  ['w-3/4', 'mb-6'],
  ['w-2/5', 'mb-4'], // h2 heading
  ['w-full', 'mb-2'],
  ['w-full', 'mb-2'],
  ['w-5/6', 'mb-2'],
  ['w-full', 'mb-2'],
  ['w-2/3', 'mb-6'],
]

// ─── Component ────────────────────────────────────────────────────────────────
const Loader = () => {
  const [msgIndex, setMsgIndex] = useState(0)

  // Cycle through loading messages every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="w-full max-w-3xl mx-auto animate-fade-up">
      {/* ── Status Bar ──────────────────────────────────────── */}
      <div className="mb-8 flex items-center gap-4 p-4 bg-amber-400/5 border border-amber-400/15 rounded-xl">
        {/* Pulsing dot */}
        <div className="relative flex-shrink-0">
          <div className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
          <div className="absolute inset-0 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping opacity-60" />
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p
            key={msgIndex}
            className="text-amber-400/90 font-body text-sm font-medium truncate animate-fade-up"
          >
            {MESSAGES[msgIndex]}
          </p>
          <p className="text-ink-600 text-xs font-mono mt-0.5">
            This may take up to a minute
          </p>
        </div>

        {/* Spinner */}
        <div className="flex-shrink-0">
          <svg
            className="animate-spin text-amber-400/50"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* ── Skeleton Paper ──────────────────────────────────── */}
      <div className="bg-ink-900/40 border border-ink-800/60 rounded-2xl p-8 space-y-1">
        {/* Mock document header */}
        <div className="skeleton h-3 w-20 rounded-full mb-2 opacity-60" />
        <div className="skeleton h-7 w-3/4 rounded-md mb-1" />
        <div className="skeleton h-7 w-1/2 rounded-md mb-8" />

        {/* Mock body lines */}
        {SKELETON_LINES.map(([ width, spacing ], i) => (
          <div
            key={i}
            className={`skeleton h-3.5 ${width} ${spacing} rounded-full`}
            style={{ opacity: 0.5 - i * 0.01, animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </section>
  )
}

export default Loader
