import PixelDog from '@/components/PixelDog';
import { SOCIAL_LINKS } from '@/components/icons';

const POSTS = [
  {
    handle: '@packleader_kai',
    platform: 'X',
    text: 'Pulled a LASER-EYE ALPHA DOGE from my first binder. Hands are still shaking. WOW.',
    palette: { fur: '#e8a33d', furLight: '#f7e3bd', accent: '#cf3f2b', bg: 'transparent' },
  },
  {
    handle: '@miso_moonpack',
    platform: 'Instagram',
    text: 'Bark Arena night at our LGS was PACKED. Went 3-1 with mono Moon Pack howl combo 🌙',
    palette: { fur: '#8a93a6', furLight: '#e9edf2', accent: '#4d5fb8', bg: 'transparent' },
  },
  {
    handle: '@bone_collector',
    platform: 'Reddit',
    text: 'Full art gallery thread: every Volume 01 legend ranked by floof. You are not ready for Grand Floof.',
    palette: { fur: '#dcc39a', furLight: '#f7efe0', accent: '#c2452f', bg: 'transparent' },
  },
];

export default function Community() {
  return (
    <section className="border-y-[3px] border-ink bg-sand">
      <div className="dots mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-center font-display text-5xl uppercase leading-none sm:text-6xl">
          Join the Community
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-ink-soft">
          Millions of borks strong. Share your pulls, find your pack, and never miss a drop.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {SOCIAL_LINKS.map(({ name, href, Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md border-2 border-ink bg-paper px-4 py-2 font-display uppercase shadow-[3px_3px_0_rgba(26,20,9,0.85)] transition-transform hover:-translate-y-0.5"
            >
              <Icon className="h-4 w-4 fill-ink" />
              {name}
            </a>
          ))}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {POSTS.map((post) => (
            <div
              key={post.handle}
              className="rounded-xl border-[3px] border-ink bg-paper p-5 shadow-[4px_4px_0_rgba(26,20,9,0.85)]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-cream">
                  <PixelDog palette={post.palette} className="h-8 w-8" />
                </span>
                <div>
                  <p className="font-display text-sm uppercase">{post.handle}</p>
                  <p className="text-xs text-ink-soft">via {post.platform}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-ink">{post.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
