import { Fragment, useMemo } from 'react';
import { parseInline, parseRichText, type Block, type InlineToken } from '@/utils';

function Inline({ tokens }: { tokens: InlineToken[] }) {
  return (
    <>
      {tokens.map((token, index) => {
        switch (token.type) {
          case 'bold':
            return (
              <strong key={index} className="font-semibold text-slate-100">
                {token.value}
              </strong>
            );
          case 'italic':
            return (
              <em key={index} className="italic text-slate-300">
                {token.value}
              </em>
            );
          case 'code':
            return (
              <code
                key={index}
                className="rounded-md border border-white/10 bg-ink-900 px-1.5 py-0.5 font-mono text-[0.85em] text-cyan-200"
              >
                {token.value}
              </code>
            );
          default:
            return <Fragment key={index}>{token.value}</Fragment>;
        }
      })}
    </>
  );
}

const HEADING_CLASS: Record<1 | 2 | 3, string> = {
  1: 'mt-8 first:mt-0 text-[17px] font-semibold tracking-tight text-slate-50',
  2: 'mt-7 first:mt-0 text-[15px] font-semibold tracking-tight text-slate-100',
  3: 'mt-6 first:mt-0 text-[13px] font-semibold uppercase tracking-widest2 text-cyan-300/90',
};

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'heading':
      return (
        <h4 className={HEADING_CLASS[block.level]}>
          <Inline tokens={block.tokens} />
        </h4>
      );

    case 'paragraph':
      return (
        <p className="mt-3 first:mt-0 text-[15px] leading-[1.75] text-slate-300">
          <Inline tokens={block.tokens} />
        </p>
      );

    case 'field':
      return (
        <p className="mt-2.5 flex flex-col gap-x-3 gap-y-0.5 first:mt-0 sm:flex-row">
          <span className="flex-none pt-[3px] font-mono text-[11px] uppercase tracking-widest text-cyan-300/75 sm:w-28">
            {block.label}
          </span>
          <span className="min-w-0 flex-1 text-[15px] leading-[1.75] text-slate-300">
            <Inline tokens={block.tokens} />
          </span>
        </p>
      );

    case 'bullets':
      return (
        <ul className="mt-3 space-y-2">
          {block.items.map((tokens, index) => (
            <li key={index} className="flex gap-3 text-[15px] leading-[1.7] text-slate-300">
              <span
                aria-hidden="true"
                className="mt-[0.62rem] h-1.5 w-1.5 flex-none rounded-full bg-cyan-400/70"
              />
              <span>
                <Inline tokens={tokens} />
              </span>
            </li>
          ))}
        </ul>
      );

    case 'ordered':
      return (
        <ol className="mt-3 space-y-2">
          {block.items.map((tokens, index) => (
            <li key={index} className="flex gap-3 text-[15px] leading-[1.7] text-slate-300">
              <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-md border border-white/10 bg-white/[0.04] font-mono text-[11px] text-cyan-300">
                {block.start + index}
              </span>
              <span>
                <Inline tokens={tokens} />
              </span>
            </li>
          ))}
        </ol>
      );

    case 'quote':
      return (
        <blockquote className="mt-4 border-l-2 border-cyan-400/40 bg-white/[0.02] py-2 pl-4 text-[15px] italic leading-[1.7] text-slate-300">
          <Inline tokens={block.tokens} />
        </blockquote>
      );

    case 'code':
      return (
        <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-ink-950/80 p-4">
          <code className="font-mono text-[13px] leading-[1.7] text-slate-300">{block.value}</code>
        </pre>
      );

    case 'divider':
      return <div className="divider my-6" />;

    default:
      return null;
  }
}

interface RichTextProps {
  content: string | undefined | null;
  className?: string;
  emptyLabel?: string;
}

/** Renders long AI text as structured, readable content. */
export function RichText({ content, className = '', emptyLabel }: RichTextProps) {
  const blocks = useMemo(() => parseRichText(content), [content]);

  if (blocks.length === 0) {
    return (
      <p className={`text-[15px] italic text-slate-500 ${className}`}>
        {emptyLabel ?? 'The backend did not return content for this section.'}
      </p>
    );
  }

  return (
    <div className={className}>
      {blocks.map((block, index) => (
        <BlockView key={index} block={block} />
      ))}
    </div>
  );
}

/** Single-line inline markdown, for short strings like metadata values. */
export function InlineText({ content }: { content: string }) {
  return <Inline tokens={parseInline(content)} />;
}
