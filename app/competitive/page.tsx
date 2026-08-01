import type { Metadata } from 'next';
import Link from 'next/link';
import PixelDog from '@/components/PixelDog';
import { FACTIONS } from '@/lib/cards';
import type { Faction } from '@/lib/cards';

export const metadata: Metadata = {
  title: 'Competitive — Doginal Dogs TCG',
  description:
    'Season 1 ranked play, Bark Arenas, regional championships, and the Golden Bone. See formats, rewards, and the live pack standings.',
};

const FORMATS = [
  {
    name: 'Legends Constructed',
    text: 'Bring a 40-card deck built around one Alpha and one Gate. The flagship ranked format.',
  },
  {
    name: 'Volume 01 Sealed',
    text: 'Six packs, thirty minutes, one deck. The great equalizer — beloved at Bark Arena nights.',
  },
  {
    name: 'Legends Draft',
    text: 'Pick, pass, and build across three pack rotations. Reads and adaptability win the day.',
  },
];

const STANDINGS: { faction: Faction; wins: number; points: number }[] = [
  { faction: 'Shibe Order', wins: 412, points: 1286 },
  { faction: 'Moon Pack', wins: 398, points: 1241 },
  { faction: 'Storm Tails', wins: 371, points: 1150 },
  { faction: 'Bone Legion', wins: 365, points: 1102 },
];

export default function CompetitivePage() {
  return (
    <div>
      <section className="border-b-[3px] border-ink bg-ink text-paper">
        <div className="dots-light mx-auto max-w-7xl px-4 py-14">
          <p className="font-display text-lg uppercase tracking-widest text-bark">Season 1</p>
          <h1 className="mt-1 font-display text-6xl uppercase leading-none text-doge sm:text-7xl">
            Competitive Play
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-paper/85">
            Rep your pack in ranked matches, climb from Pup to Alpha rank, and chase the Golden Bone at
            regionals. Every certified store event feeds the season standings.
          </p>
          <Link
            href="/store-locator"
            className="mt-6 inline-block rounded-md border-2 border-paper bg-doge px-6 py-2.5 font-display text-lg uppercase text-ink shadow-[3px_3px_0_rgba(255,252,242,0.35)] transition-transform hover:-translate-y-0.5"
          >
            Find a Ranked Event
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-display text-4xl uppercase sm:text-5xl">Formats</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {FORMATS.map((format) => (
            <div
              key={format.name}
              className="rounded-xl border-[3px] border-ink bg-paper p-6 shadow-[4px_4px_0_rgba(26,20,9,0.85)]"
            >
              <h3 className="font-display text-2xl uppercase text-bark">{format.name}</h3>
              <p className="mt-2 text-sm text-ink-soft">{format.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y-[3px] border-ink bg-sand">
        <div className="dots mx-auto max-w-7xl px-4 py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-4xl uppercase sm:text-5xl">Live Pack Standings</h2>
            <p className="text-sm text-ink-soft">Season 1 · updated weekly from certified events</p>
          </div>
          <div className="mt-8 overflow-x-auto rounded-xl border-[3px] border-ink bg-paper shadow-[4px_4px_0_rgba(26,20,9,0.85)]">
            <table className="w-full min-w-[32rem] text-left">
              <thead className="border-b-[3px] border-ink bg-ink font-display uppercase text-paper">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Pack</th>
                  <th className="px-4 py-3 text-right">Match Wins</th>
                  <th className="px-4 py-3 text-right">Season Points</th>
                </tr>
              </thead>
              <tbody>
                {STANDINGS.map((row, i) => (
                  <tr key={row.faction} className="border-b border-ink/10 last:border-0">
                    <td className="px-4 py-3 font-display text-2xl">{i + 1}</td>
                    <td className="px-4 py-3">
                      <span className="font-display text-xl uppercase" style={{ color: FACTIONS[row.faction].color }}>
                        {row.faction}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{row.wins}</td>
                    <td className="px-4 py-3 text-right font-semibold">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl uppercase sm:text-5xl">The Golden Bone</h2>
            <p className="mt-4 max-w-md text-ink-soft">
              Thirty-two regional champions each season take home the Golden Bone — a die-cast,
              individually numbered trophy card that doubles as a tournament-legal Gate. Win it, play it,
              flex it forever.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
              <li>🏆 Alpha rank: full Season 1 foil set</li>
              <li>🎴 10 ranked matches: alt-art Zoomies! promo</li>
              <li>🦴 Regional champion: the Golden Bone, 1 of 32</li>
            </ul>
          </div>
          <div className="flex justify-center">
            <div className="flex h-56 w-56 items-center justify-center rounded-full border-[3px] border-ink bg-doge shadow-[8px_8px_0_rgba(26,20,9,0.85)]">
              <PixelDog
                palette={{ fur: '#fffcf2', furLight: '#f4ecdb', accent: '#cf3f2b', bg: 'transparent' }}
                variant="laser"
                className="h-36 w-36"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
