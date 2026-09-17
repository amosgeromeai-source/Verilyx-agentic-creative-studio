import { useEffect, useState } from 'react';
import { scoreTone } from '@/utils';

const TONE_STROKE: Record<string, string> = {
  emerald: '#34d399',
  cyan: '#22d3ee',
  amber: '#fbbf24',
  slate: '#475569',
};

const TONE_TEXT: Record<string, string> = {
  emerald: 'text-emerald-300',
  cyan: 'text-cyan-300',
  amber: 'text-amber-300',
  slate: 'text-slate-400',
};

interface QualityScoreProps {
  score: number | null;
  size?: number;
  label?: string;
  /** Shown under the ring, e.g. "reported by the workflow". */
  caption?: string;
}

/** Circular score indicator with an eased sweep on mount. */
export function QualityScore({
  score,
  size = 132,
  label = 'Final Quality Score',
  caption,
}: QualityScoreProps) {
  const [progress, setProgress] = useState(0);
  const tone = scoreTone(score);
  const stroke = TONE_STROKE[tone];
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (score === null) {
      setProgress(0);
      return;
    }
    const frame = window.requestAnimationFrame(() => setProgress(score));
    return () => window.cancelAnimationFrame(frame);
  }, [score]);

  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="6"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)',
              filter: `drop-shadow(0 0 8px ${stroke}55)`,
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {score === null ? (
            <span className="text-[13px] text-slate-500">Not reported</span>
          ) : (
            <>
              <span
                className={`text-[30px] font-semibold leading-none tracking-tight tabular-nums ${TONE_TEXT[tone]}`}
              >
                {score}
              </span>
              <span className="mt-1 text-[11.5px] text-slate-500">/ 100</span>
            </>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-[12px] font-medium uppercase tracking-widest2 text-slate-400">
        {label}
      </p>
      {caption && <p className="mt-1.5 text-center text-[12px] text-slate-600">{caption}</p>}
    </div>
  );
}

/** Compact inline score pill used inside the revision timeline. */
export function ScorePill({ score, muted = false }: { score: number | null; muted?: boolean }) {
  const tone = muted ? 'slate' : scoreTone(score);
  return (
    <span
      className="inline-flex h-16 w-16 flex-none items-center justify-center rounded-2xl border text-[22px] font-semibold tabular-nums"
      style={{
        borderColor: `${TONE_STROKE[tone]}44`,
        backgroundColor: `${TONE_STROKE[tone]}12`,
        color: TONE_STROKE[tone],
      }}
    >
      {score ?? '—'}
    </span>
  );
}
