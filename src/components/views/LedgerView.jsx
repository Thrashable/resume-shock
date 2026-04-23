import JournalCard from '../JournalCard'
import { Underline } from '../decorations/Doodles'

export default function LedgerView({ positions, flags, journals, regenerating, onRegenerate }) {
  const sorted = [...positions].sort((a, b) => b.entry.timestamp - a.entry.timestamp)
  return (
    <div>
      <header className="mb-8 ink-bleed">
        <h2 className="hand-title text-[64px] ink-graphite leading-none">the ledger.</h2>
        <p className="hand-write ink-pencil text-[18px] italic mt-1">
          everything. in order. no skipping the bad ones.
        </p>
        <div className="w-72 mt-3"><Underline className="w-full h-3 ink-red" /></div>
      </header>

      <div className="space-y-14">
        {sorted.map((p, i) => (
          <div key={p.id} className={i % 2 === 0 ? 'flex justify-start' : 'flex justify-end'}>
            <JournalCard
              index={i}
              position={p}
              flags={flags[p.id] || { red: [], green: [] }}
              journalText={journals[p.id]}
              isGenerating={regenerating[p.id]}
              onRegenerate={() => onRegenerate(p.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
