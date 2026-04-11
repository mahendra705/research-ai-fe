/**
 * components/TopicInput.jsx
 * The hero input section — large textarea, examples, and submit button.
 * Handles all form state locally and calls parent onSubmit.
 */

import React, { useState, useRef } from 'react'

// ─── Example prompts ──────────────────────────────────────────────────────────
const EXAMPLES = [
  'Impact of AI on Healthcare',
  'Quantum Computing and Cryptography',
  'Climate Change Mitigation Strategies',
  'The Future of Remote Work',
  'Blockchain in Supply Chain Management',
  'Neural Plasticity and Learning',
]

const MAX_CHARS = 200

// ─── Icon ─────────────────────────────────────────────────────────────────────
const SendIcon = ({ spinning }) => spinning ? (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

// ─── Component ────────────────────────────────────────────────────────────────
const TopicInput = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('')
  const [error, setError]   = useState('')
  const textareaRef = useRef(null)

  const charCount  = topic.length
  const isOverLimit = charCount > MAX_CHARS
  const isEmpty    = topic.trim().length === 0

  // Handle textarea change
  const handleChange = (e) => {
    setTopic(e.target.value)
    if (error) setError('')
  }

  // Inject example into textarea
  const handleExample = (example) => {
    setTopic(example)
    setError('')
    textareaRef.current?.focus()
  }

  // Form submission
  const handleSubmit = (e) => {
    e?.preventDefault()

    if (isEmpty) {
      setError('Please enter a research topic to get started.')
      return
    }
    if (isOverLimit) {
      setError(`Topic must be under ${MAX_CHARS} characters.`)
      return
    }

    onSubmit(topic.trim())
  }

  // Allow Cmd/Ctrl + Enter to submit
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <section className="w-full max-w-3xl mx-auto">
      {/* ── Hero heading ─────────────────────────────────────── */}
      <div className="text-center mb-12 space-y-4">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 text-amber-400/80 font-mono text-xs uppercase tracking-[0.2em] mb-2">
          <span className="w-8 h-px bg-amber-400/40" />
          Powered by Advanced AI
          <span className="w-8 h-px bg-amber-400/40" />
        </div>

        <h1 className="font-display text-5xl md:text-6xl font-bold text-ink-50 leading-[1.1] tracking-tight animate-fade-up">
          Research,{' '}
          <span className="italic text-amber-400">Instant</span>
          <span className="text-ink-600">.</span>
        </h1>

        <p className="text-ink-400 text-lg max-w-xl mx-auto leading-relaxed animate-fade-up-delay-1">
          Generate detailed, professional research papers on any topic — 
          structured, cited, and ready to use.
        </p>
      </div>

      {/* ── Input Card ───────────────────────────────────────── */}
      <div className="animate-fade-up-delay-2 bg-ink-900/60 border border-ink-800/80 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 backdrop-blur-sm">
        <form onSubmit={handleSubmit}>
          <div className="p-6 pb-4">
            <label className="block text-ink-400 text-xs font-mono uppercase tracking-widest mb-3">
              Research Topic
            </label>
            <textarea
              ref={textareaRef}
              value={topic}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Impact of AI on Healthcare"
              rows={3}
              disabled={isLoading}
              className={`
                input-glow
                w-full bg-transparent resize-none
                font-body text-ink-100 text-[17px] leading-relaxed
                placeholder:text-ink-700
                border-none outline-none
                transition-colors duration-200
                disabled:opacity-50
              `}
              style={{ caretColor: '#fbbf24' }}
            />
          </div>

          {/* ── Footer bar ──────────────────────────────────── */}
          <div className="border-t border-ink-800/60 px-6 py-4 flex items-center justify-between gap-4">
            {/* Char counter */}
            <span className={`font-mono text-xs tabular-nums ${
              isOverLimit ? 'text-red-400' : charCount > MAX_CHARS * 0.8 ? 'text-amber-400' : 'text-ink-600'
            }`}>
              {charCount}/{MAX_CHARS}
            </span>

            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-ink-700 font-mono text-[11px]">
                ⌘ Enter to generate
              </span>
              <button
                type="submit"
                disabled={isLoading || isOverLimit || isEmpty}
                className="btn-primary flex items-center gap-2.5 text-sm"
              >
                <SendIcon spinning={isLoading} />
                {isLoading ? 'Generating…' : 'Generate Research'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ── Validation Error ────────────────────────────────── */}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-400 text-sm px-1 animate-fade-up">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
        </div>
      )}

      {/* ── Example Pills ───────────────────────────────────── */}
      <div className="mt-6 animate-fade-up-delay-3">
        <p className="text-ink-700 font-mono text-[11px] uppercase tracking-widest mb-3 text-center">
          Try an example
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => handleExample(ex)}
              disabled={isLoading}
              className="
                text-ink-500 text-xs font-body
                border border-ink-800 hover:border-ink-600
                bg-ink-900/40 hover:bg-ink-800/40
                hover:text-ink-300
                rounded-full px-3.5 py-1.5
                transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TopicInput
