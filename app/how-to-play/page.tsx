import type { Metadata } from 'next';
import Link from 'next/link';
import PixelDog from '@/components/PixelDog';
import { FACTIONS } from '@/lib/cards';
import type { Faction } from '@/lib/cards';

export const metadata: Metadata = {
  title: 'How to Play — Doginal Dogs TCG',
  description:
    'Learn the Doginal Dogs Trading Card Game: lead your pack with an Alpha, power up through your Gate, and win with cunning, tactics, and the will of the pack.',
};

const STEPS = [
  {
    title: '1 · Choose your Alpha',
    text: 'Your Alpha defines your pack — its faction, its ability, and its starting power. The Alpha stays in play the whole game and levels up as your pack scores.',
  },
  {
    title: '2 · Open your Gate',
    text: 'Your Gate is your engine. Each turn it generates Treats — the resource you spend to summon Pack dogs and play Tactics. Some Gates have powerful abilities of their own.',
  },
  {
    title: '3 · Build the board',
    text: 'Summon Pack dogs to the field. Each has a Treat cost and a Power value. Position matters: front-row dogs guard your Alpha, back-row dogs enable combos.',
  },
  {
    title: '4 · Battle & howl',
    text: 'Attack with your dogs, respond with Tactics, and trigger faction howls — chain abilities that reward committing to a single pack. Combat is simultaneous-reveal, so bluffing wins games.',
  },
  {
    title: '5 · Claim the Golden Bone',
    text: 'Reduce your rival Alpha’s resolve to zero, or control the Golden Bone at the end of round eight. First pack to do either takes the match.',
  },
];

const FACTION_DOGS: Record<Faction, { fur: string; furLight: string; accent: string; bg: string }> = {
  'Moon Pack': { fur: '#3a3548', furLight: '#8f87a8', accent: '#4d5fb8', bg: 'transparent' },
  'Bone Legion': { fur: '#7a4a26', furLight: '#d9b38a', accent: '#c2452f', bg: 'transparent' },
  'Shibe Order': { fur: '#e8a33d', furLight: '#f7e3bd', accent: '#b97a14', bg: 'transparent' },
  'Storm Tails': { fur: '#4e7d78', furLight: '#bfe0dc', accent: '#2e8c85', bg: 'transparent' },
};

export default function HowToPlayPage() {
  return (
    <div>
      <section className="dots border-b-[3px] border-ink">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h1 className="font-display text-6xl uppercase leading-none sm:text-7xl">How to Play</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            Every player leads a unique pack, guided by an <strong>Alpha</strong> and empowered through a{' '}
            <strong>Gate</strong>. Victory belongs to those who master cunning, tactics, and the unbreakable
            will of the pack.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-display text-4xl uppercase sm:text-5xl">The Flow of the Game</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="rounded-xl border-[3px] border-ink bg-paper p-6 shadow-[4px_4px_0_rgba(26,20,9,0.85)]"
            >
              <h3 className="font-display text-2xl uppercase text-bark">{step.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{step.text}</p>
            </div>
          ))}
          <div className="flex flex-col items-center justify-center rounded-xl border-[3px] border-dashed border-ink/40 p-6 text-center">
            <PixelDog
              palette={{ fur: '#e8a33d', furLight: '#f7e3bd', accent: '#cf3f2b', bg: 'transparent' }}
              className="h-16 w-16"
            />
            <p className="mt-3 font-display text-xl uppercase text-ink-soft">Full rulebook ships in every binder</p>
          </div>
        </div>
      </section>

      <section className="border-y-[3px] border-ink bg-sand">
        <div className="dots mx-auto max-w-7xl px-4 py-14">
          <h2 className="font-display text-4xl uppercase sm:text-5xl">The Four Great Packs</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(FACTIONS) as Faction[]).map((name) => (
              <div
                key={name}
                className="rounded-xl border-[3px] border-ink bg-paper p-5 text-center shadow-[4px_4px_0_rgba(26,20,9,0.85)]"
              >
                <div
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-ink"
                  style={{ background: `${FACTIONS[name].color}33` }}
                >
                  <PixelDog palette={FACTION_DOGS[name]} className="h-14 w-14" />
                </div>
                <h3 className="mt-3 font-display text-2xl uppercase" style={{ color: FACTIONS[name].color }}>
                  {name}
                </h3>
                <p className="mt-1 text-sm text-ink-soft">{FACTIONS[name].blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 text-center">
        <h2 className="font-display text-4xl uppercase sm:text-5xl">Ready to run with the pack?</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/cards"
            className="rounded-md border-2 border-ink bg-paper px-6 py-2.5 font-display text-lg uppercase shadow-[3px_3px_0_rgba(26,20,9,0.85)] transition-transform hover:-translate-y-0.5"
          >
            Browse the Cards
          </Link>
          <Link
            href="/store-locator"
            className="rounded-md border-2 border-ink bg-doge px-6 py-2.5 font-display text-lg uppercase shadow-[3px_3px_0_rgba(26,20,9,0.85)] transition-transform hover:-translate-y-0.5"
          >
            Find a Store Event
          </Link>
        </div>
      </section>
    </div>
  );
}
