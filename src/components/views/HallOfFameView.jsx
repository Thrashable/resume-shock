import JournalCard from '../JournalCard'
import { StarDoodle, Squiggle } from '../decorations/Doodles'

export default function HallOfFameView({ positions, flags, journals, regenerating, onRegenerate }) {
  const ranked = [...positions]
    .map(p => ({ p, total: p.realized_pnl_sol + p.unrealized_pnl_sol }))
    .filter(({ total }) => total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  return (
    <div>
      <header className="mb-10 ink-bleed relative">
        <div className="absolute -top-2 left-[300px] hidden md:block">
          <StarDoodle className="w-14 h-14 ink-gold" />
        </div>
        <h2 className="hand-title text-[64px] ink-gold leading-none" style={{ textShadow: '0 1px 0 rgba(0,0,0,0.05)' }}>
          ★ hall of fame.
        </h2>
        <p className="hand-write ink-pencil text-[18px] italic mt-1">
          the trades you brag about at parties. (gold pen only.)
        </p>
        <Squiggle className="mt-3 w-56 h-3 ink-gold" />
      </header>

      {ranked.length === 0 && (
        <div className="notebook-card paper-blank p-8 rotate-[-1deg]">
          <p className="hand-write text-[22px] ink-pencil italic">
            no winners yet. but they're coming. probably.
          </p>
        </div>
      )}

      <div className="space-y-12">
        {ranked.map(({ p }, i) => (
          <div key={p.id} className="relative">
            <div className="absolute -left-3 top-2 hand-title text-[60px] ink-gold opacity-80 z-10 -rotate-12">
              #{i + 1}
            </div>
            <div className="ml-12">
              <JournalCard
                index={i}
                position={p}
                flags={flags[p.id] || { red: [], green: [] }}
                journalText={journals[p.id]}
                isGenerating={regenerating[p.id]}
                onRegenerate={() => onRegenerate(p.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
