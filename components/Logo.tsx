import PixelDog from './PixelDog';

export default function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-ink bg-doge shadow-[2px_2px_0_rgba(26,20,9,0.85)]">
        <PixelDog
          palette={{ fur: '#1a1409', furLight: '#4a4030', accent: '#cf3f2b', bg: 'transparent' }}
          className="h-7 w-7"
        />
      </span>
      <span className={`font-display text-xl leading-none ${inverted ? 'text-paper' : 'text-ink'}`}>
        DOGINAL DOGS
        <span className="block text-[0.6rem] tracking-[0.35em] text-doge-deep">TRADING CARD GAME</span>
      </span>
    </span>
  );
}
