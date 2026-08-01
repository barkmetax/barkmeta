import type { DogPalette } from '@/lib/cards';

const GRID = [
  '................',
  '.oo..........oo.',
  '.ofo........ofo.',
  '.offo......offo.',
  '.offfoooooofffo.',
  '.offffffffffffo.',
  'offffffffffffffo',
  'offllffffffllffo',
  'offeffffffffeffo',
  'offffffffffffffo',
  'offffllllllffffo',
  'offffllnnllffffo',
  '.offfllllllfffo.',
  '..offllllllffo..',
  '..oooooooooooo..',
  '................',
];

export type DogVariant = 'base' | 'bandana' | 'cap' | 'laser';

function buildGrid(variant: DogVariant): string[] {
  const rows = [...GRID];
  if (variant === 'bandana') {
    rows[12] = rows[12].replace(/[fl]/g, 'a');
    rows[13] = rows[13].replace(/[fl]/g, 'a');
  }
  if (variant === 'cap') {
    rows[5] = rows[5].replace(/f/g, 'a');
    rows[6] = 'oaaaaaaaaaaaaaao';
  }
  return rows;
}

export default function PixelDog({
  palette,
  variant = 'base',
  className,
}: {
  palette: DogPalette;
  variant?: DogVariant;
  className?: string;
}) {
  const rows = buildGrid(variant);
  const laser = variant === 'laser';
  const colors: Record<string, string> = {
    o: '#1a1409',
    f: palette.fur,
    l: palette.furLight,
    n: '#1a1409',
    a: palette.accent,
    e: laser ? '#ff2d2d' : '#1a1409',
  };

  const rects: React.ReactNode[] = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.') continue;
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={colors[ch]} />);
      if (ch === 'e' && laser) {
        rects.push(
          <rect key={`glow-${x}-${y}`} x={x - 0.5} y={y - 0.5} width={2} height={2} fill="#ff2d2d" opacity={0.35} />,
        );
      }
    }
  });

  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      shapeRendering="crispEdges"
      role="img"
      aria-label="Pixel art dog"
    >
      {rects}
    </svg>
  );
}
