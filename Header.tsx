import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { PERSONAL_WEBSITE_URL } from '@/config';
import { useScrollSpy } from '@/hooks';

const NAV_LINKS = [
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'about', label: 'About' },
];

const NAV_IDS = NAV_LINKS.map((link) => link.id);

interface HeaderProps {
  /** Landing shows anchor nav; app hides it during processing/results. */
  variant?: 'landing' | 'app';
  onCreateClick: () => void;
  /** Label for the right-hand CTA. */
  ctaLabel?: string;
  /** Hidden while a run is in flight so the run can't be cancelled by accident. */
  showCta?: boolean;
}

export function Header({
  variant = 'landing',
  onCreateClick,
  ctaLabel,
  showCta = true,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useScrollSpy(variant === 'landing' ? NAV_IDS : []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (variant !== 'landing') setMenuOpen(false);
  }, [variant]);

  const label = ctaLabel ?? 'Create Production';

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/[0.07] bg-ink-950/80 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="rounded-lg transition-opacity hover:opacity-85"
          aria-label="Verilyx home"
        >
          <Logo />
        </a>

        {variant === 'landing' && (
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  activeSection === link.id
                    ? 'text-slate-100'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <a
            href={PERSONAL_WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-quiet hidden px-3 py-2 text-sm sm:inline-flex"
          >
            My Website
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          {showCta && (
            <button
              type="button"
              onClick={onCreateClick}
              className="btn-primary hidden sm:inline-flex"
            >
              {label}
            </button>
          )}

          {variant === 'landing' && (
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="btn-ghost px-2.5 py-2 md:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          )}
          {variant !== 'landing' && showCta && (
            <button type="button" onClick={onCreateClick} className="btn-ghost px-3 py-2 sm:hidden">
              {label}
            </button>
          )}
        </div>
      </div>

      {variant === 'landing' && menuOpen && (
        <div className="border-t border-white/[0.07] bg-ink-950/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-6" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-slate-100"
              >
                {link.label}
              </a>
            ))}
            <div className="divider my-2" />
            <a
              href={PERSONAL_WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-2 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-slate-100"
            >
              My Website
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onCreateClick();
              }}
              className="btn-primary mt-2 w-full"
            >
              {label}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
