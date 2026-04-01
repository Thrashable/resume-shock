import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { analyzeMatch } from '../utils/keywordMatcher'

function AnimatedGauge({ score }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" className="stroke-white/5 dark:stroke-white/5" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r={radius} fill="none"
          className="stroke-accent"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          style={{ filter: 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.4))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-display font-semibold text-gray-900 dark:text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}%
        </motion.span>
        <span className="text-xs text-gray-400 mt-0.5">match</span>
      </div>
    </div>
  )
}

function Tag({ text, variant, delay }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.2 }}
      className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${
        variant === 'found'
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
          : 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
      }`}
    >
      {text}
    </motion.span>
  )
}

export default function JobMatcher({ resumeData }) {
  const [jobDesc, setJobDesc] = useState('')
  const [result, setResult] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const textareaRef = useRef(null)

  const handleAnalyze = () => {
    if (!jobDesc.trim()) return
    setAnalyzing(true)
    // Small delay for visual effect
    setTimeout(() => {
      const match = analyzeMatch(jobDesc, resumeData)
      setResult(match)
      setAnalyzing(false)
    }, 600)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg text-gray-900 dark:text-white">Match My Resume</h3>
          <p className="text-xs text-gray-400">Paste a job description to see how well your resume matches</p>
        </div>
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          placeholder="Paste a job description here..."
          rows={5}
          className="w-full rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 resize-none transition-colors font-sans"
        />
        <button
          onClick={handleAnalyze}
          disabled={!jobDesc.trim() || analyzing}
          className={`mt-3 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            jobDesc.trim() && !analyzing
              ? 'bg-accent text-black hover:bg-accent-light cursor-pointer'
              : 'bg-white/10 text-gray-500 cursor-not-allowed'
          }`}
        >
          {analyzing ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing...
            </span>
          ) : 'Analyze Match'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 pt-4 border-t border-white/5"
          >
            <AnimatedGauge score={result.score} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Keywords Found ({result.found.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {result.found.map((kw, i) => (
                    <Tag key={kw} text={kw} variant="found" delay={0.3 + i * 0.03} />
                  ))}
                  {result.found.length === 0 && (
                    <p className="text-xs text-gray-500">No matching keywords found</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-orange-400 mb-2 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Missing Keywords ({result.missing.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {result.missing.map((kw, i) => (
                    <Tag key={kw} text={kw} variant="missing" delay={0.3 + i * 0.03} />
                  ))}
                  {result.missing.length === 0 && (
                    <p className="text-xs text-gray-500">Great — no important keywords missing!</p>
                  )}
                </div>
              </div>
            </div>

            {result.missing.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-xs text-gray-400 bg-white/5 rounded-lg px-4 py-3"
              >
                Consider incorporating the missing keywords into your resume to improve your match score for this role.
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
