import { ArrowUp, ArrowUpRight, Github } from 'lucide-react';
import { LogoMark } from './Logo';
import { BRAND, GITHUB_URL, PERSONAL_WEBSITE_URL } from '@/config';

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="border-t border-white/[0.06] px-5 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <LogoMark size={26} className="mt-0.5" />
          <div>
            <p className="text-[14px] font-medium text-slate-200">
              {BRAND.name} — {BRAND.tagline}
            </p>
            <p className="mt-1 text-[12.5px] text-slate-500">{BRAND.footerNote}</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-1" aria-label="Footer">
          <a
            href={PERSONAL_WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-quiet px-3 py-2 text-[13px]"
          >
            My Website
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-quiet px-3 py-2 text-[13px]"
          >
            <Github className="h-3.5 w-3.5" />
            GitHub
          </a>
          <button type="button" onClick={scrollToTop} className="btn-quiet px-3 py-2 text-[13px]">
            <ArrowUp className="h-3.5 w-3.5" />
            Back to Top
          </button>
        </nav>
      </div>

      <div className="mx-auto mt-8 max-w-6xl">
        <div className="divider" />
        <p className="mt-5 text-[11.5px] leading-relaxed text-slate-600">
          Output is AI-assisted and quality reviewed before release. Review production packages
          before use.
        </p>
      </div>
    </footer>
  );
}
