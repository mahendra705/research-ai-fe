/**
 * pages/Home.jsx
 * Main page that orchestrates the three states:
 *   idle → loading → result (or error)
 * Manages all API interaction and scroll behavior.
 */

import React, { useState, useRef, useEffect } from 'react'
import TopicInput      from '../components/TopicInput'
import Loader          from '../components/Loader'
import ResearchResult  from '../components/ResearchResult'
import { generateResearch } from '../services/api'

// ─── App States ───────────────────────────────────────────────────────────────
const STATE = {
  IDLE:    'idle',
  LOADING: 'loading',
  RESULT:  'result',
  ERROR:   'error',
}

// ─── Error Banner ─────────────────────────────────────────────────────────────
const ErrorBanner = ({ message, onRetry }) => (
  <div className="w-full max-w-3xl mx-auto animate-fade-up">
    <div className="bg-red-500/8 border border-red-500/25 rounded-2xl p-8 text-center">
      <div className="w-12 h-12 bg-red-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="font-display text-xl font-semibold text-ink-100 mb-2">
        Something went wrong
      </h3>
      <p className="text-ink-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 text-sm font-medium text-red-400 border border-red-400/30 bg-red-400/8 hover:bg-red-400/15 rounded-lg px-5 py-2.5 transition-all duration-200"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.95" />
        </svg>
        Try Again
      </button>
    </div>
  </div>
)

// ─── Component ────────────────────────────────────────────────────────────────
const Home = () => {
  const [appState, setAppState] = useState(STATE.IDLE)
  const [research, setResearch] = useState(null)   // { topic, content }
  const [errorMsg, setErrorMsg] = useState('')

  const resultRef  = useRef(null)
  const topInputRef = useRef(null)

  // Auto-scroll to result section when it appears
  useEffect(() => {
    if (appState === STATE.LOADING || appState === STATE.RESULT || appState === STATE.ERROR) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [appState])

  // ── Submit handler ──────────────────────────────────────────
  const handleSubmit = async (topic) => {
    setAppState(STATE.LOADING)
    setErrorMsg('')
    setResearch(null)

    try {
      const data = await generateResearch(topic)

      if (!data?.content) {
        throw new Error('No content returned from the server. Please try again.')
      }

      setResearch({ topic, content: data.content })
      setAppState(STATE.RESULT)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to generate research. Please check your connection and try again.')
      setAppState(STATE.ERROR)
    }
  }

  // ── Reset to idle (back button) ─────────────────────────────
  const handleReset = () => {
    setAppState(STATE.IDLE)
    setResearch(null)
    setErrorMsg('')
    setTimeout(() => {
      topInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  return (
    <main className="min-h-screen pt-14">
      {/* ── Hero / Input Section ────────────────────────────── */}
      <section
        ref={topInputRef}
        className={`
          flex flex-col items-center justify-center px-4 transition-all duration-500
          ${appState === STATE.IDLE
            ? 'min-h-[90vh] pb-24'
            : 'pt-16 pb-12 min-h-0'
          }
        `}
      >
        {/* Ambient glow */}
        <div
          className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-30"
          style={{
            background: 'radial-gradient(ellipse at center top, rgba(251,191,36,0.15) 0%, transparent 70%)',
          }}
        />

        <TopicInput
          onSubmit={handleSubmit}
          isLoading={appState === STATE.LOADING}
        />
      </section>

      {/* ── Dynamic Content Section ─────────────────────────── */}
      {appState !== STATE.IDLE && (
        <section
          ref={resultRef}
          className="px-4 pb-24 flex flex-col items-center"
        >
          {/* Divider */}
          <div className="w-full max-w-3xl mb-12 flex items-center gap-4">
            <div className="flex-1 h-px bg-ink-800" />
            <span className="text-ink-700 font-mono text-[11px] uppercase tracking-wider">
              {appState === STATE.LOADING ? 'Working' : appState === STATE.RESULT ? 'Result' : 'Error'}
            </span>
            <div className="flex-1 h-px bg-ink-800" />
          </div>

          {appState === STATE.LOADING && <Loader />}

          {appState === STATE.RESULT && research && (
            <ResearchResult
              content={research.content}
              topic={research.topic}
              onBack={handleReset}
            />
          )}

          {appState === STATE.ERROR && (
            <ErrorBanner message={errorMsg} onRetry={handleReset} />
          )}
        </section>
      )}

      {/* ── Idle footer ─────────────────────────────────────── */}
      {appState === STATE.IDLE && (
        <footer className="text-center pb-8 text-ink-700 text-xs font-mono">
          Built with AI · Powered by advanced language models
        </footer>
      )}
    </main>
  )
}

export default Home
