import { fmtSol } from '../../utils/solana'
import StickyNote from '../decorations/StickyNote'
import WashiTape from '../decorations/WashiTape'
import { Squiggle, Underline, HappyFace, SadFace } from '../decorations/Doodles'

export default function HealthCheckView({ positions }) {
  const stillHolding = positions.filter(p => p.still_holding)
  const concentratedRisk = stillHolding.reduce((s, p) => s + p.position_size_pct, 0)
  const oversized = positions.filter(p => p.position_size_pct > 25).length
  const topblasted = positions.filter(p => p.token.age_at_entry_ms != null && p.token.age_at_entry_ms < 24 * 3600 * 1000 && p.entry.marketcap > 1_000_000).length
  const totalPnl = positions.reduce((s, p) => s + p.realized_pnl_sol + p.unrealized_pnl_sol, 0)
  const unrealizedExposure = stillHolding.reduce((s, p) => s + p.entry.sol_spent, 0)

  // Behavioral score 0-100
  let score = 75
  score -= oversized * 10
  score -= topblasted * 6
  if (totalPnl < 0) score -= Math.min(20, Math.abs(totalPnl))
  if (totalPnl > 0) score += Math.min(15, totalPnl)
  score = Math.max(0, Math.min(100, Math.round(score)))

  const verdict =
    score >= 75 ? { txt: 'actually disciplined. weird.', color: 'ink-green', face: 'happy' } :
    score >= 50 ? { txt: 'mid. some good habits, some bad ones.', color: 'ink-graphite', face: 'happy' } :
    score >= 30 ? { txt: 'rough. you know what you\'re doing wrong.', color: 'ink-red', face: 'sad' } :
                  { txt: 'see a financial therapist.', color: 'ink-red', face: 'sad' }

  return (
    <div>
      <header className="mb-10 ink-bleed">
        <h2 className="hand-title text-[64px] ink-graphite leading-none">health check.</h2>
        <p className="hand-write ink-pencil text-[18px] italic mt-1">
          the part of the journal where you're honest with yourself.
        </p>
        <Squiggle className="mt-3 w-56 h-3 ink-blue" />
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="notebook-card paper-graph p-8 rotate-[-0.7deg] relative">
          <WashiTape color="blue" className="-top-3 right-[10%] rotate-3" />
          <h3 className="hand-title text-[34px] ink-graphite">behavior score</h3>
          <div className="w-32 mb-4"><Underline className="w-full h-3 ink-red" /></div>

          <div className="flex items-end gap-4">
            <span className="hand-title text-[120px] leading-none ink-graphite">{score}</span>
            <span className="hand-title text-[40px] ink-pencil mb-3">/100</span>
            <div className="ml-auto mb-2">
              {verdict.face === 'happy'
                ? <HappyFace className="w-14 h-14 ink-green" />
                : <SadFace className="w-14 h-14 ink-red" />}
            </div>
          </div>
          <p className={`hand-write text-[20px] italic mt-4 ${verdict.color}`}>{verdict.txt}</p>
        </div>

        <div className="space-y-4">
          <div className="notebook-card paper-lined p-6 rotate-[0.6deg]">
            <h4 className="print-hand ink-pencil text-[14px] uppercase tracking-widest">exposure</h4>
            <p className="hand-write text-[20px] ink-graphite mt-1">
              still holding{' '}
              <span className="hand-title text-[32px] ink-blue">{stillHolding.length}</span>{' '}
              positions worth{' '}
              <span className="typewriter ink-graphite">{fmtSol(unrealizedExposure)}</span>{' '}
              of original entries.
            </p>
            {concentratedRisk > 50 && (
              <p className="mt-2 hand-write ink-red text-[18px] italic">
                that's a heavy bag. trim something.
              </p>
            )}
          </div>

          <div className="notebook-card paper-blank p-6 rotate-[-0.4deg]">
            <h4 className="print-hand ink-pencil text-[14px] uppercase tracking-widest">tendencies</h4>
            <ul className="mt-2 space-y-2 hand-write text-[18px]">
              <li>
                <span className="ink-pencil">oversized positions:</span>{' '}
                <span className={oversized > 0 ? 'ink-red' : 'ink-green'}>
                  {oversized}
                </span>
              </li>
              <li>
                <span className="ink-pencil">topblasts:</span>{' '}
                <span className={topblasted > 0 ? 'ink-red' : 'ink-green'}>
                  {topblasted}
                </span>
              </li>
              <li>
                <span className="ink-pencil">net pnl:</span>{' '}
                <span className={totalPnl >= 0 ? 'ink-green' : 'ink-red'}>
                  {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)} SOL
                </span>
              </li>
            </ul>
          </div>

          <StickyNote rotate={-3} className="max-w-[280px]">
            <p className="text-[16px] leading-snug">
              prescription: trade smaller, wait for dips, take partial profits.
            </p>
            <p className="mt-2 text-[13px] italic ink-pencil">— management</p>
          </StickyNote>
        </div>
      </div>
    </div>
  )
}
