import type { DogCard } from '@/lib/cards';
import { FACTIONS } from '@/lib/cards';
import PixelDog from './PixelDog';

const RARITY_COLORS: Record<string, string> = {
  Common: '#8a8272',
  Uncommon: '#2e8c85',
  Rare: '#4d5fb8',
  Legendary: '#e9a93d',
};

export default function TCGCard({ card, className }: { card: DogCard; className?: string }) {
  const factionColor = FACTIONS[card.faction].color;
  return (
    <div
      className={`relative aspect-[5/7] w-full select-none overflow-hidden rounded-xl border-[3px] border-ink bg-paper shadow-[4px_4px_0_rgba(26,20,9,0.85)] ${className ?? ''}`}
    >
      {/* Cost badge */}
      <div className="absolute left-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-paper font-display text-lg">
        {card.cost}
      </div>
      {/* Rarity gem */}
      <div
        className="absolute right-2 top-2 z-10 h-4 w-4 rotate-45 border-2 border-ink"
        style={{ background: RARITY_COLORS[card.rarity] }}
        title={card.rarity}
      />
      {/* Art */}
      <div
        className="flex h-[58%] items-end justify-center pt-6"
        style={{ background: `linear-gradient(180deg, ${card.palette.bg}, ${factionColor}33)` }}
      >
        <PixelDog palette={card.palette} variant={card.variant} className="h-[85%] w-auto" />
      </div>
      {/* Name bar */}
      <div className="border-y-2 border-ink px-2 py-1" style={{ background: factionColor }}>
        <p className="truncate font-display text-sm uppercase leading-tight text-paper">{card.name}</p>
        <p className="text-[9px] font-bold uppercase tracking-wider text-paper/80">
          {card.type} · {card.faction}
        </p>
      </div>
      {/* Flavor */}
      <div className="flex h-[27%] flex-col justify-between px-2 py-1.5">
        <p className="text-[10px] italic leading-snug text-ink-soft line-clamp-3">{card.flavor}</p>
        <div className="flex items-center justify-between">
          <p className="text-[8px] uppercase tracking-wider text-ink-soft">Art: {card.artist}</p>
          {card.power !== null && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink bg-bark font-display text-sm text-paper">
              {card.power}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
