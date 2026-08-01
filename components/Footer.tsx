import Link from 'next/link';
import Logo from './Logo';
import { SOCIAL_LINKS, TwitchIcon } from './icons';

const FOOTER_LINKS = [
  { label: 'Doginal Dogs', href: 'https://doginaldogs.com' },
  { label: 'Contact Us', href: 'mailto:woof@doginaldogs.com' },
  { label: 'Retail', href: '/stores' },
  { label: 'Store Portal', href: '/stores#portal' },
  { label: 'Media Kit', href: '#' },
  { label: 'Terms & Conditions', href: '#' },
];

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-ink bg-ink text-paper">
      <div className="dots-light mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <Logo inverted />
          <nav className="grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-3">
            {FOOTER_LINKS.map((link) =>
              link.href.startsWith('/') ? (
                <Link key={link.label} href={link.href} className="text-sm text-paper/80 hover:text-doge">
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href} className="text-sm text-paper/80 hover:text-doge">
                  {link.label}
                </a>
              ),
            )}
          </nav>
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="text-paper/80 transition-colors hover:text-doge"
              >
                <Icon className="h-5 w-5 fill-current" />
              </a>
            ))}
            <a
              href="https://twitch.tv/doginaldogs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitch"
              className="text-paper/80 transition-colors hover:text-doge"
            >
              <TwitchIcon className="h-5 w-5 fill-current" />
            </a>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-paper/50">
          © 2026 Doginal Dogs. All rights reserved. Doginal Dogs TCG is a fan-built trading card game for the
          Doginal Dogs community.
        </p>
      </div>
    </footer>
  );
}
