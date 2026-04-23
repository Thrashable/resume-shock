import JournalCard from '../JournalCard'
import { Squiggle, ArrowDoodle } from '../decorations/Doodles'

export default function TodayView({ positions, flags, journals, regenerating, onRegenerate }) {
  // Most recent 3
  const recent = [...positions].sort((a, b) => b.entry.timestamp - a.entry.timestamp).slice(0, 3)
  return (
    <div>
      <header className="mb-8 ink-bleed">
        <h2 className="hand-title text-[64px] ink-graphite leading-none">today.</h2>
        <p className="hand-write ink-pencil text-[18px] italic mt-1">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} — what's fresh.
        </p>
        <Squiggle className="mt-3 w-48 h-3 ink-red" />
      </header>

      {recent.length === 0 && (
        <p className="hand-write ink-pencil text-[20px] italic">
          nothing recent. wallet's been quiet. <ArrowDoodle className="inline-block w-12 h-6 ml-2 ink-blue" />
        </p>
      )}

      <div className="space-y-12">
        {recent.map((p, i) => (
          <JournalCard
            key={p.id}
            index={i}
            position={p}
            flags={flags[p.id] || { red: [], green: [] }}
            journalText={journals[p.id]}
            isGenerating={regenerating[p.id]}
            onRegenerate={() => onRegenerate(p.id)}
          />
        ))}
      </div>
    </div>
  )
}
