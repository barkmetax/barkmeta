export interface NewsArticle {
  slug: string;
  title: string;
  category: 'EVENT' | 'PRODUCT' | 'COMMUNITY';
  date: string;
  excerpt: string;
  body: string[];
}

export const NEWS: NewsArticle[] = [
  {
    slug: 'doginal-dogs-tcg-at-doge-day-2026',
    title: 'Doginal Dogs TCG is Coming to Doge Day 2026',
    category: 'EVENT',
    date: '2026-07-21',
    excerpt:
      'Meet the team, play learn-to-play demos, and pull exclusive convention promos at the biggest dog-powered gathering of the year.',
    body: [
      'The pack is going on tour. Doginal Dogs TCG will have a full booth at Doge Day 2026, featuring open play tables, learn-to-play demos hosted by our judges, and artist signings with the pixel artists behind Volume 01: Legends of the Pack.',
      'Every attendee who completes a demo game walks away with an exclusive convention promo card — a foil-stamped Treatkeeper Tato that will never be reprinted.',
      'We will also be running side events all weekend, including a 64-player Legends Cup with a full playset of Volume 01 on the line. Registration opens at the booth each morning at 10am, and seats are first come, first served.',
      'Bring your deck, bring your dog (photos count), and come say wow.',
    ],
  },
  {
    slug: 'season-1-rewards-revealed',
    title: 'Season 1 Rewards Revealed',
    category: 'EVENT',
    date: '2026-07-08',
    excerpt:
      'Ranked play arrives with exclusive foil promos, alt-art staples, and the Golden Bone trophy for regional champions.',
    body: [
      'Competitive season 1 officially kicks off next month, and today we are revealing what is on the line. Every player who completes ten ranked matches in the app earns the season 1 participation promo: an alt-art Zoomies! with kinetic foil treatment.',
      'Players who reach Alpha rank receive the full Season 1 foil set — four alt-art faction staples, one for each of the great packs.',
      'Regional champions take home the Golden Bone: a die-cast trophy card, individually numbered, that doubles as a tournament-legal Gate. Only 32 will ever exist.',
      'Season 1 standings will be tracked live in the Doginal Dogs TCG app. Ranked matches can be logged at any certified store event.',
    ],
  },
  {
    slug: 'bark-arenas-launching-soon',
    title: 'Bark Arenas are Launching Soon',
    category: 'EVENT',
    date: '2026-06-19',
    excerpt:
      'Our flagship organized-play program brings weekly tournaments, exclusive prizing, and pack-vs-pack rivalries to your local game store.',
    body: [
      'Bark Arenas are the heart of Doginal Dogs organized play: weekly in-store tournaments where your results feed your pack’s regional standing. Pick a faction, rep your pack, and every win pushes your pack up the leaderboard.',
      'Each Bark Arena night features Swiss rounds, promo prizing for all participants, and a rotating spotlight format — from Volume 01 Sealed to Legends Draft.',
      'Stores can apply for the Bark Arena kit through the Store Portal starting today. Kits include promo packs, a playmat for the season winner, and pack-standing scorecards.',
      'The first Bark Arena season begins this fall in over 200 stores across the USA. Find one near you with the Store Locator.',
    ],
  },
];

export function getArticle(slug: string): NewsArticle | undefined {
  return NEWS.find((a) => a.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
