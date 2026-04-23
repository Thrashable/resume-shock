import JournalCard from '../JournalCard'
import { SkullDoodle, Underline } from '../decorations/Doodles'

export default function HallOfShameView({ positions, flags, journals, regenerating, onRegenerate }) {
  const ranked = [...positions]
    .map(p => ({ p, total: p.realized_pnl_sol + p.unrealized_pnl_sol }))
    .filter(({ total }) => total < 0)
    .sort((a, b) => a.total - b.total)
    .slice(0, 5)

  return (
    <div>
      <header className="mb-10 ink-bleed relative">
        <div className="absolute -top-1 left-[280px] hidden md:block -rotate-12">
          <SkullDoodle className="w-14 h-16 ink-red" />
        </div>
        <h2 className="hand-title text-[64px] ink-red leading-none">
          ✗ hall of shame.
        </h2>
        <p className="hand-write ink-pencil text-[18px] italic mt-1">
          do not look at this with company. do not look at this sober.
        </p>
        <div className="w-72 mt-3"><Underline className="w-full h-3 ink-red" /></div>
      </header>

      {ranked.length === 0 && (
        <div className="notebook-card paper-blank p-8 rotate-[1deg]">
          <p className="hand-write text-[22px] ink-pencil italic">
            no losses. either you're lying to yourself or actually printing.
          </p>
        </div>
      )}

      <div className="space-y-12">
        {ranked.map(({ p, total }, i) => (
          <div key={p.id} className="relative">
            <div className="absolute -left-3 top-2 hand-title text-[60px] ink-red opacity-80 z-10 rotate-12">
              −{i + 1}
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
              <p className="mt-2 ml-6 hand-write ink-red text-[16px] italic rotate-[-0.6deg]">
                lesson cost: <span className="scratched">{(-total).toFixed(2)} SOL</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
