/**
 * components/Header.jsx
 * Top navigation bar with logo, title, and theme badge.
 * Stays minimal — keeps focus on the content below.
 */

import React from 'react'

// ─── Icon: Quill / Research ───────────────────────────────────────────────────
const ResearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M8 12h8M12 8v8" />
  </svg>
)

const SparkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
)

// ─── Component ────────────────────────────────────────────────────────────────
const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphism bar */}
      <div
        className="border-b border-ink-800/60 backdrop-blur-md"
        style={{ background: 'rgba(40,35,30,0.75)' }}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo + Name */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-ink-950 shadow-lg shadow-amber-500/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/>
              </svg>
            </div>
            <span className="font-display font-semibold text-ink-100 tracking-tight text-[15px]">
              AI Research Agent
            </span>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-1.5 text-amber-400 bg-amber-400/8 border border-amber-400/20 rounded-full px-3 py-1">
            <SparkIcon />
            <span className="font-mono text-[11px] font-medium tracking-wider uppercase">
              AI Powered
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
