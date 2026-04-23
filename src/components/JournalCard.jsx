import { useEffect, useState, useRef } from 'react'
import { fmtSol, fmtUsd, fmtDuration, fmtAge, shortAddr } from '../utils/solana'
import { FLAG_LABEL } from '../utils/patterns'
import WashiTape from './decorations/WashiTape'
import Stamp from './decorations/Stamp'
import {
  HappyFace, SadFace, SkullDoodle, FireDoodle,
  WobblyCircle, Underline,
} from './decorations/Doodles'

// pseudo-random per id, stable across renders
function seedRand(id) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return () => {
    h = (h * 9301 + 49297) % 233280
    return h / 233280
  }
}

export default function JournalCard({ position, flags, journalText, isGenerating, onRegenerate, index = 0 }) {
  const r = seedRand(position.id)
  const rotation = (r() - 0.5) * 1.6   // -0.8 to +0.8 deg
  const paperKind = ['paper-lined', 'paper-graph', 'paper-blank'][Math.floor(r() * 3)]
  const totalPnl = position.realized_pnl_sol + position.unrealized_pnl_sol
  const isWin = totalPnl > 0.05
  const isBig = Math.abs(totalPnl) > 5
  const isLoss = totalPnl < -0.05
  const isRekt = totalPnl < -3
  const peakX = position.peak_price_during_hold && position.entry.price
    ? position.peak_price_during_hold / position.entry.price : null
  const exitX = position.exits.length && position.entry.price
    ? avgExit(position.exits) / position.entry.price : null

  // letter-by-letter "writing" animation for journal text
  const [reveal, setReveal] = useState(journalText ? journalText.length : 0)
  const lastTextRef = useRef(journalText)
  useEffect(() => {
    if (!journalText) { setReveal(0); return }
    if (journalText === lastTextRef.current) return
    lastTextRef.current = journalText
    setReveal(0)
    let i = 0
    const id = setInterval(() => {
      i += 2
      setReveal(Math.min(i, journalText.length))
      if (i >= journalText.length) clearInterval(id)
    }, 18)
    return () => clearInterval(id)
  }, [journalText])

  return (
    <article
      className={`notebook-card ${paperKind} fade-up page-fold relative max-w-[640px] w-full`}
      style={{
        '--rot': `${rotation}deg`,
        transform: `rotate(${rotation}deg)`,
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* corner decorations */}
      {isWin && (
        <div className="absolute -top-2 -right-2 z-10">
          <Stamp kind={isBig ? 'win' : 'win'} className="text-[18px]">
            {isBig ? '+W' : 'W'}
          </Stamp>
        </div>
      )}
      {isLoss && (
        <div className="absolute -top-3 -right-1 z-10">
          <Stamp kind={isRekt ? 'rekt' : 'loss'} className="text-[18px]">
            {isRekt ? 'REKT' : 'LOSS'}
          </Stamp>
        </div>
      )}
      {/* random washi tape on some cards */}
      {r() > 0.55 && (
        <WashiTape
          color={['pink', 'blue', 'green', 'yellow'][Math.floor(r() * 4)]}
          className="left-[18%] -top-3"
          style={{ transform: `rotate(${(r() - 0.5) * 14}deg)` }}
        />
      )}

      {/* Header row: token + date */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="hand-title text-[42px] ink-graphite leading-none">
            ${position.token.symbol}
          </h3>
          <span className="print-hand ink-pencil text-[16px]">
            {position.token.name}
          </span>
        </div>
        <div className="text-right">
          <p className="typewriter ink-pencil text-[12px]">
            {new Date(position.entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </p>
          <p className="hand-write ink-pencil text-[13px] italic">
            held {fmtDuration(position.hold_duration_ms)}
          </p>
        </div>
      </div>

      {/* underline scribble below title */}
      <div className="-mt-1 mb-3 w-[60%]">
        <Underline className="w-full h-3 ink-blue opacity-70" />
      </div>

      {/* Trade stats — like a hand-tallied table */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4">
        <Row label="entry mc" value={fmtUsd(position.entry.marketcap)} />
        <Row label="size" value={`${fmtSol(position.entry.sol_spent)} (${position.position_size_pct.toFixed(0)}%)`}
             accent={position.position_size_pct > 25 ? 'red' : position.position_size_pct < 10 ? 'green' : 'graphite'} />
        <Row label="age @ buy" value={fmtAge(position.token.age_at_entry_ms)}
             accent={position.token.age_at_entry_ms != null && position.token.age_at_entry_ms < 24 * 3600 * 1000 ? 'red' : 'graphite'} />
        <Row label="exits" value={position.exits.length === 0 ? 'none yet' : `${position.exits.length}x`}
             accent={position.exits.length === 0 && position.still_holding ? 'red' : position.exits.length >= 2 ? 'green' : 'graphite'} />
        {peakX != null && peakX > 1.2 && (
          <Row label="peak" value={`${peakX.toFixed(1)}x`} accent="green" />
        )}
        {exitX != null && (
          <Row label="avg exit" value={`${exitX.toFixed(2)}x`}
               accent={exitX > 1 ? 'green' : 'red'} />
        )}
      </div>

      {/* Big PnL line — wobbly circle around the number */}
      <div className="flex items-center gap-4 mb-5 mt-2 flex-wrap">
        <div className="relative">
          <div className="hand-title text-[60px] leading-none px-3 py-1" style={{
            color: isWin ? '#2D8659' : isLoss ? '#C23B22' : '#2B2B2B',
          }}>
            {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)}
          </div>
          <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none">
            <WobblyCircle
              className="w-full h-full"
              color={isWin ? '#2D8659' : isLoss ? '#C23B22' : '#2B2B2B'}
              strokeWidth={2.4}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="print-hand ink-pencil text-[15px]">SOL</span>
          <span className="hand-write text-[15px] italic ink-pencil">
            {position.realized_pnl_sol !== 0 && `realized ${position.realized_pnl_sol >= 0 ? '+' : ''}${position.realized_pnl_sol.toFixed(2)}`}
            {position.unrealized_pnl_sol !== 0 && (position.realized_pnl_sol !== 0 ? ' · ' : '') +
              `unrealized ${position.unrealized_pnl_sol >= 0 ? '+' : ''}${position.unrealized_pnl_sol.toFixed(2)}`}
          </span>
        </div>
        {/* margin doodle */}
        <div className="ml-auto">
          {isWin && isBig && <FireDoodle className="w-10 h-12 ink-red" />}
          {isWin && !isBig && <HappyFace className="w-10 h-10 ink-green" />}
          {isLoss && !isRekt && <SadFace className="w-10 h-10 ink-red" />}
          {isRekt && <SkullDoodle className="w-10 h-12 ink-graphite" />}
        </div>
      </div>

      {/* Pattern flag chips */}
      {(flags.red.length > 0 || flags.green.length > 0) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {flags.red.map(f => (
            <span key={f} className="print-hand text-[13px] px-2 py-0.5 ink-red rotate-[-1deg]"
                  style={{ background: 'rgba(194, 59, 34, 0.10)', borderRadius: '4px' }}>
              ⚠ {FLAG_LABEL[f] || f}
            </span>
          ))}
          {flags.green.map(f => (
            <span key={f} className="print-hand text-[13px] px-2 py-0.5 ink-green rotate-[1deg]"
                  style={{ background: 'rgba(45, 134, 89, 0.10)', borderRadius: '4px' }}>
              ✓ {FLAG_LABEL[f] || f}
            </span>
          ))}
        </div>
      )}

      {/* The journal entry — handwritten, animated */}
      <div className="relative pl-4 border-l-2 border-[#1A3A7E]/30 py-1">
        <div className="absolute -left-[10px] top-2 print-hand ink-blue text-[22px]">"</div>
        {isGenerating ? (
          <p className="hand-write ink-pencil text-[19px] italic leading-relaxed">
            <span className="opacity-60">writing this entry...</span>
            <span className="ml-2 inline-block animate-pulse">✎</span>
          </p>
        ) : journalText ? (
          <p className="hand-write text-[20px] leading-[1.5] ink-graphite jitter">
            {journalText.slice(0, reveal)}
            {reveal < journalText.length && <span className="inline-block ml-0.5 animate-pulse ink-pencil">|</span>}
          </p>
        ) : (
          <p className="hand-write ink-pencil text-[18px] italic leading-relaxed">
            (no entry yet — add an anthropic key in settings to generate)
          </p>
        )}
      </div>

      {/* Mint footer */}
      <div className="mt-4 pt-3 flex items-center justify-between border-t border-dashed border-[#A8C5E8] gap-3">
        <span className="typewriter ink-pencil text-[11px] truncate">
          {shortAddr(position.token.mint, 6, 6)}
        </span>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="print-hand ink-pencil text-[13px] underline underline-offset-2 decoration-wavy decoration-[#C23B22] hover:ink-red"
            title="regenerate this entry"
          >
            ↻ rewrite
          </button>
        )}
      </div>
    </article>
  )
}

function Row({ label, value, accent = 'graphite' }) {
  const inkClass = { red: 'ink-red', green: 'ink-green', blue: 'ink-blue', graphite: 'ink-graphite' }[accent]
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="print-hand ink-pencil text-[14px]">{label}</span>
      <span className={`typewriter text-[15px] ${inkClass}`}>{value}</span>
    </div>
  )
}

function avgExit(exits) {
  const total = exits.reduce((s, e) => s + e.sol_received, 0)
  if (total === 0) return 0
  return exits.reduce((s, e) => s + e.sol_received * e.price, 0) / total
}
