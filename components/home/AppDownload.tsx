import PixelDog from '@/components/PixelDog';
import { AppleIcon, GooglePlayIcon, MapPinIcon, SearchIcon } from '@/components/icons';

export default function AppDownload() {
  return (
    <section id="app" className="border-t-[3px] border-ink bg-ink text-paper">
      <div className="dots-light mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <h2 className="font-display text-5xl uppercase leading-none text-doge sm:text-6xl">
            The Doginal Dogs TCG App
          </h2>
          <p className="mt-4 max-w-md text-paper/85">
            Find events near you, browse the full card gallery, and track your matches during tournaments —
            all from your pocket.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-paper/80">
            <li className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 fill-doge" /> Event finder with Bark Arena schedules
            </li>
            <li className="flex items-center gap-2">
              <SearchIcon className="h-4 w-4 fill-doge" /> Complete searchable card database
            </li>
            <li className="flex items-center gap-2">
              <span className="font-display text-doge">W</span> Live match tracking and season rankings
            </li>
          </ul>
          <div className="mt-7 flex flex-wrap gap-4">
            <a
              href="#app"
              className="flex items-center gap-3 rounded-lg border-2 border-paper bg-paper px-5 py-2.5 text-ink transition-transform hover:-translate-y-0.5"
            >
              <AppleIcon className="h-7 w-7 fill-ink" />
              <span className="text-left leading-tight">
                <span className="block text-[0.6rem] uppercase">Download on the</span>
                <span className="block font-display text-lg">App Store</span>
              </span>
            </a>
            <a
              href="#app"
              className="flex items-center gap-3 rounded-lg border-2 border-paper bg-paper px-5 py-2.5 text-ink transition-transform hover:-translate-y-0.5"
            >
              <GooglePlayIcon className="h-6 w-6 fill-ink" />
              <span className="text-left leading-tight">
                <span className="block text-[0.6rem] uppercase">Get it on</span>
                <span className="block font-display text-lg">Google Play</span>
              </span>
            </a>
          </div>
        </div>
        <div className="flex items-center justify-center gap-6">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`w-40 rounded-[2rem] border-[3px] border-paper bg-cream p-3 shadow-[6px_6px_0_rgba(255,252,242,0.25)] sm:w-48 ${
                i === 1 ? 'mt-12' : ''
              }`}
            >
              <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-ink/20" />
              <div
                className={`flex aspect-[9/16] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-ink p-3 ${
                  i === 0 ? 'bg-doge' : 'bg-moon'
                }`}
              >
                <PixelDog
                  palette={
                    i === 0
                      ? { fur: '#1a1409', furLight: '#4a4030', accent: '#cf3f2b', bg: 'transparent' }
                      : { fur: '#fffcf2', furLight: '#e9edf2', accent: '#e9a93d', bg: 'transparent' }
                  }
                  className="h-16 w-16"
                />
                <p
                  className={`text-center font-display text-sm uppercase leading-tight ${
                    i === 0 ? 'text-ink' : 'text-paper'
                  }`}
                >
                  {i === 0 ? 'Events near you' : 'Track your matches'}
                </p>
                <div className={`h-1.5 w-16 rounded-full ${i === 0 ? 'bg-ink/30' : 'bg-paper/40'}`} />
                <div className={`h-1.5 w-12 rounded-full ${i === 0 ? 'bg-ink/20' : 'bg-paper/25'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
