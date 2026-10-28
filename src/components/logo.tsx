// Stubby himself: a short, chunky link with eyes.
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 40 28" aria-hidden="true">
      <rect x="1.5" y="1.5" width="37" height="25" rx="12.5" className="fill-tomato stroke-ink" strokeWidth="3" />
      <circle cx="15" cy="13" r="2.6" className="fill-ink" />
      <circle cx="25" cy="13" r="2.6" className="fill-ink" />
      <path d="M16 19.5 q4 3 8 0" className="stroke-ink" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
