import { Check, Copy, X } from 'lucide-react';
import { useCopy } from '@/hooks';

interface CopyButtonProps {
  /** Resolved lazily so large strings aren't rebuilt on every render. */
  getText: () => string;
  label?: string;
  className?: string;
  variant?: 'ghost' | 'quiet';
}

export function CopyButton({
  getText,
  label = 'Copy',
  className = '',
  variant = 'ghost',
}: CopyButtonProps) {
  const { state, copy } = useCopy();

  const base = variant === 'ghost' ? 'btn-ghost' : 'btn-quiet';
  const tone =
    state === 'copied'
      ? 'text-emerald-300 border-emerald-400/30'
      : state === 'failed'
        ? 'text-rose-300 border-rose-400/30'
        : '';

  return (
    <button
      type="button"
      onClick={() => void copy(getText())}
      className={`${base} ${tone} px-3 py-1.5 text-xs ${className}`}
      aria-live="polite"
    >
      {state === 'copied' ? (
        <Check className="h-3.5 w-3.5" />
      ) : state === 'failed' ? (
        <X className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : label}
    </button>
  );
}
