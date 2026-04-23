import { useEffect, useState } from 'react'
import { generateEntry } from '../utils/anthropic'
import { getAnthropicKey, getJournalEntry, setJournalEntry } from '../utils/storage'
import { shortAddr } from '../utils/solana'
import WashiTape from './decorations/WashiTape'
import { CoffeeStain, Squiggle } from './decorations/Doodles'
import TodayView from './views/TodayView'
import LedgerView from './views/LedgerView'
import PatternsView from './views/PatternsView'
import HallOfFameView from './views/HallOfFameView'
import HallOfShameView from './views/HallOfShameView'
import HealthCheckView from './views/HealthCheckView'

const TABS = [
  { id: 'today',     label: 'today',          color: '#C23B22' },
  { id: 'ledger',    label: 'the ledger',     color: '#1A3A7E' },
  { id: 'patterns',  label: 'patterns noticed', color: '#2D8659' },
  { id: 'fame',      label: 'hall of fame',   color: '#C8A951' },
  { id: 'shame',     label: 'hall of shame',  color: '#C23B22' },
  { id: 'health',    label: 'health check',   color: '#4A4A4A' },
]

export default function Notebook({ data, onReset, fromMock }) {
  const [tab, setTab] = useState('today')
  const [journals, setJournals] = useState({})
  const [regenerating, setRegenerating] = useState({})
  const [error, setError] = useState('')
  const apiKey = getAnthropicKey()

  // Hydrate journal entries from cache + mock fallback
  useEffect(() => {
    const initial = {}
    for (const p of data.positions) {
      const cached = getJournalEntry(data.wallet, p.id)
      if (cached) initial[p.id] = cached
      else if (data.journal?.[p.id]) initial[p.id] = data.journal[p.id]  // mock fallback
    }
    setJournals(initial)
  }, [data])

  // Auto-generate missing entries (one at a time, slow, on Anthropic key)
  useEffect(() => {
    if (!apiKey) return
    let cancelled = false
    async function run() {
      for (const p of data.positions) {
        if (cancelled) return
        if (journals[p.id]) continue
        setRegenerating(r => ({ ...r, [p.id]: true }))
        try {
          const text = await generateEntry({
            apiKey,
            position: p,
            flags: data.flags[p.id] || { red: [], green: [] },
          })
          if (cancelled) return
          setJournals(j => ({ ...j, [p.id]: text }))
          setJournalEntry(data.wallet, p.id, text)
        } catch (err) {
          setError(`anthropic: ${err.message}`)
        } finally {
          setRegenerating(r => ({ ...r, [p.id]: false }))
        }
      }
    }
    run()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, apiKey])

  const handleRegenerate = async (id) => {
    if (!apiKey) {
      setError('add an anthropic key in landing settings to (re)generate entries')
      return
    }
    const p = data.positions.find(x => x.id === id)
    if (!p) return
    setRegenerating(r => ({ ...r, [id]: true }))
    try {
      const text = await generateEntry({
        apiKey,
        position: p,
        flags: data.flags[id] || { red: [], green: [] },
      })
      setJournals(j => ({ ...j, [id]: text }))
      setJournalEntry(data.wallet, id, text)
    } catch (err) {
      setError(`anthropic: ${err.message}`)
    } finally {
      setRegenerating(r => ({ ...r, [id]: false }))
    }
  }

  const viewProps = {
    positions: data.positions,
    flags: data.flags,
    journals,
    regenerating,
    onRegenerate: handleRegenerate,
  }

  return (
    <div className="relative min-h-screen w-full pt-6 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">

      {/* Coffee stain in corner */}
      <div className="pointer-events-none absolute -top-10 right-[5%] w-[200px] opacity-50 rotate-[8deg]">
        <CoffeeStain />
      </div>

      {/* Notebook header bar */}
      <header className="relative pb-6 mb-8 flex items-end justify-between flex-wrap gap-4 border-b-2 border-[#A8C5E8]/60 border-dashed">
        <div className="relative">
          <WashiTape color="pink" className="-top-2 left-[40%] -rotate-3" />
          <h1 className="hand-title text-[42px] ink-graphite leading-none">degen diary</h1>
          <p className="print-hand ink-pencil text-[14px] mt-1">
            wallet: <span className="typewriter ink-blue">{shortAddr(data.wallet, 6, 6)}</span>
            {fromMock && <span className="ml-2 ink-red italic">(demo data)</span>}
            {data.fromCache && <span className="ml-2 ink-pencil italic">(cached)</span>}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {!apiKey && (
            <span className="hand-write ink-red text-[14px] italic max-w-[260px]">
              no anthropic key — entries will use canned text. add a key from the landing page to get ai-generated journal entries.
            </span>
          )}
          <button
            onClick={onReset}
            className="ink-button ink-button-red text-[18px]"
          >
            new wallet
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-4 px-4 py-2 rotate-[-0.4deg]" style={{ background: 'rgba(194, 59, 34, 0.08)' }}>
          <span className="hand-write ink-red text-[16px] italic">! {error}</span>
          <button onClick={() => setError('')} className="ml-3 print-hand ink-pencil text-[12px] underline">dismiss</button>
        </div>
      )}

      {/* Layout: tabs on left, content on right */}
      <div className="grid grid-cols-12 gap-6 lg:gap-10 relative">
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <nav className="sticky top-6">
            <div className="mb-4 print-hand ink-pencil text-[12px] uppercase tracking-widest">
              ── sections ──
            </div>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`notebook-tab ${tab === t.id ? 'active' : ''}`}
                style={tab === t.id ? { boxShadow: `inset 4px 0 0 ${t.color}, 2px 2px 6px rgba(60, 40, 10, 0.18)` } : undefined}
              >
                <span style={{ color: tab === t.id ? t.color : undefined }}>
                  {t.label}
                </span>
              </button>
            ))}
            <div className="mt-6 hidden md:block">
              <Squiggle className="w-32 h-3 ink-pencil opacity-50" />
              <p className="mt-2 print-hand ink-pencil text-[12px] italic">
                page {Object.keys(journals).length}/{data.positions.length} written
              </p>
            </div>
          </nav>
        </aside>

        <main className="col-span-12 md:col-span-9 lg:col-span-10 pl-2 md:pl-6 border-l-0 md:border-l-2 md:border-[#A8C5E8]/60">
          {tab === 'today'    && <TodayView    {...viewProps} />}
          {tab === 'ledger'   && <LedgerView   {...viewProps} />}
          {tab === 'patterns' && <PatternsView positions={data.positions} flags={data.flags} />}
          {tab === 'fame'     && <HallOfFameView  {...viewProps} />}
          {tab === 'shame'    && <HallOfShameView {...viewProps} />}
          {tab === 'health'   && <HealthCheckView positions={data.positions} />}
        </main>
      </div>
    </div>
  )
}
