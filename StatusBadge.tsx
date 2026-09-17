import { AlertTriangle, CheckCircle2, RefreshCw, ShieldQuestion } from 'lucide-react';

export type BadgeKind = 'approved' | 'warnings' | 'revised' | 'review';

const STYLES: Record<BadgeKind, { className: string; icon: typeof CheckCircle2 }> = {
  approved: {
    className: 'border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-200',
    icon: CheckCircle2,
  },
  warnings: {
    className: 'border-amber-400/25 bg-amber-400/[0.08] text-amber-200',
    icon: AlertTriangle,
  },
  revised: {
    className: 'border-violet-400/25 bg-violet-400/[0.08] text-violet-200',
    icon: RefreshCw,
  },
  review: {
    className: 'border-cyan-400/25 bg-cyan-400/[0.08] text-cyan-200',
    icon: ShieldQuestion,
  },
};

interface StatusBadgeProps {
  kind: BadgeKind;
  label: string;
  className?: string;
}

export function StatusBadge({ kind, label, className = '' }: StatusBadgeProps) {
  const { className: tone, icon: Icon } = STYLES[kind];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest2 ${tone} ${className}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
