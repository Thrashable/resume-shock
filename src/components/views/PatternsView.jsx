import { useEffect, useState } from 'react'
import { FLAG_LABEL } from '../../utils/patterns'
import WashiTape from '../decorations/WashiTape'
import { Squiggle, Underline, ArrowDoodle } from '../decorations/Doodles'

function Tally({ value, label }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let i = 0
    const target = value
    const id = setInterval(() => {
      i++
      const v = Math.round((i / 24) * target)
      setN(v)
      if (i >= 24) { setN(target); clearInterval(id) }
    }, 30)
    return () => clearInterval(id)
  }, [value])
  return (
    <div className="text-center px-4">
      <div className="hand-title text-[48px] ink-graphite leading-none">{n}</div>
      <div className="print-hand ink-pencil text-[14px] mt-1">{label}</div>
    </div>
  )
}

export default function PatternsView({ positions, flags }) {
  const total = positions.length
  const wins = positions.filter(p => (p.realized_pnl_sol + p.unrealized_pnl_sol) > 0).length
  const winRate = total > 0 ? (wins / total) * 100 : 0
  const totalPnl = positions.reduce((s, p) => s + p.realized_pnl_sol + p.unrealized_pnl_sol, 0)
  const grossWin = positions.reduce((s, p) => {
    const v = p.realized_pnl_sol + p.unrealized_pnl_sol
    return s + (v > 0 ? v : 0)
  }, 0)
  const grossLoss = positions.reduce((s, p) => {
    const v = p.realized_pnl_sol + p.unrealized_pnl_sol
    return s + (v < 0 ? Math.abs(v) : 0)
  }, 0)
  const profitFactor = grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? Infinity : 0
  const avgSize = total > 0 ? positions.reduce((s, p) => s + p.position_size_pct, 0) / total : 0

  // count flag occurrences
  const flagCounts = {}
  for (const id in flags) {
    for (const f of flags[id].red)   flagCounts[f] = (flagCounts[f] || 0) + 1
    for (const f of flags[id].green) flagCounts[f] = (flagCounts[f] || 0) + 1
  }
  const sortedFlags = Object.entries(flagCounts).sort(([, a], [, b]) => b - a)

  return (
    <div>
      <header className="mb-10 ink-bleed">
        <h2 className="hand-title text-[64px] ink-graphite leading-none">patterns noticed.</h2>
        <p className="hand-write ink-pencil text-[18px] italic mt-1">stuff you keep doing. the good and the embarrassing.</p>
        <Squiggle className="mt-3 w-56 h-3 ink-blue" />
      </header>

      {/* Top stats card */}
      <div className="notebook-card paper-graph rotate-[-0.5deg] mb-10 p-8 relative">
        <WashiTape color="green" className="-top-3 left-[10%] -rotate-3" />
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-dashed divide-[#A8C5E8]">
          <Tally value={total} label="trades" />
          <Tally value={Math.round(winRate)} label="win rate %" />
          <Tally value={Math.round(avgSize)} label="avg size %" />
          <Tally value={Math.round(totalPnl * 100) / 100} label="total SOL" />
        </div>
        <div className="mt-6 flex items-baseline justify-between">
          <span className="print-hand ink-pencil text-[15px]">profit factor</span>
          <span className="hand-title text-[32px] ink-graphite">
            {profitFactor === Infinity ? '∞' : profitFactor.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Flag tally — like a hand-counted list */}
      <div className="notebook-card paper-lined rotate-[0.4deg] p-8">
        <h3 className="hand-title text-[34px] ink-graphite mb-1">tallies</h3>
        <div className="w-40 mb-5"><Underline className="w-full h-3 ink-red" /></div>

        {sortedFlags.length === 0 && (
          <p className="hand-write ink-pencil italic">no patterns yet. trade more (or less).</p>
        )}

        <div className="space-y-3">
          {sortedFlags.map(([flag, count]) => {
            const isRed = ['topblasting', 'oversizing', 'bag_holding', 'paper_hands', 'fomo_wick', 'revenge_sizing', 'panic_dumping', 'chasing_exits'].includes(flag)
            const ink = isRed ? 'ink-red' : 'ink-green'
            return (
              <div key={flag} className="flex items-center gap-3">
                <span className={`print-hand text-[18px] ${ink} flex-1`}>
                  {isRed ? '⚠' : '✓'} {FLAG_LABEL[flag] || flag}
                </span>
                <span className="typewriter ink-pencil text-[14px]">
                  {'│'.repeat(Math.min(count, 12))}
                  {count > 12 && ` +${count - 12}`}
                </span>
                <span className={`hand-title text-[28px] ${ink} w-10 text-right`}>{count}</span>
              </div>
            )
          })}
        </div>

        {sortedFlags.find(([f]) => f === 'topblasting') && (
          <div className="mt-6 hand-write text-[19px] ink-graphite italic">
            <ArrowDoodle className="inline-block w-12 h-6 ink-red mr-2" />
            you topblasted{' '}
            <span className="highlighter">
              {flagCounts.topblasting} of your last {total} trades
            </span>
            . maybe wait for a dip next time.
          </div>
        )}
      </div>
    </div>
  )
}
