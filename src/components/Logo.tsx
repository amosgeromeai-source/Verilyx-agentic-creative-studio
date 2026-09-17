interface LogoProps {
  size?: number;
  className?: string;
}

/** Verilyx mark — a hexagon outline with a solid inner core. */
export function LogoMark({ size = 30, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="verilyx-mark" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <path
        d="M32 6.5 53.5 19v26L32 57.5 10.5 45V19L32 6.5Z"
        stroke="url(#verilyx-mark)"
        strokeWidth="3"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <path d="M32 22.5 42 28.5v11L32 45.5 22 39.5v-11L32 22.5Z" fill="url(#verilyx-mark)" />
    </svg>
  );
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={28} />
      <span className="text-[17px] font-semibold tracking-tight text-slate-50">Verilyx</span>
    </span>
  );
}
