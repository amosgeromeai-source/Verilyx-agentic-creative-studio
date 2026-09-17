import type { LucideIcon } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { RichText } from './RichText';
import { wordCount } from '@/utils';

interface ResultSectionProps {
  title: string;
  description?: string;
  content: string | undefined | null;
  icon?: LucideIcon;
  /** Rendered under the header, before the body — used for scores and badges. */
  aside?: React.ReactNode;
  emptyLabel?: string;
  /** Muted variant for superseded content such as the original review. */
  tone?: 'default' | 'muted';
}

/** Reusable presentation shell for one block of AI output. */
export function ResultSection({
  title,
  description,
  content,
  icon: Icon,
  aside,
  emptyLabel,
  tone = 'default',
}: ResultSectionProps) {
  const words = wordCount(content);
  const hasContent = typeof content === 'string' && content.trim().length > 0;

  return (
    <section
      className={`glass p-5 sm:p-7 ${tone === 'muted' ? 'border-white/[0.05] bg-white/[0.015]' : ''}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
              <Icon className="h-4 w-4 text-cyan-300" />
            </span>
          )}
          <div className="min-w-0">
            <h3 className="text-[16px] font-semibold tracking-tight text-slate-100">{title}</h3>
            {description && (
              <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{description}</p>
            )}
            {hasContent && (
              <p className="mt-1.5 font-mono text-[11px] tracking-wide text-slate-600">
                {words.toLocaleString()} words
              </p>
            )}
          </div>
        </div>

        {hasContent && <CopyButton getText={() => content} />}
      </header>

      {aside && <div className="mt-5">{aside}</div>}

      <div className="mt-5">
        <RichText content={content} emptyLabel={emptyLabel} />
      </div>
    </section>
  );
}
