// Clean, premium SVG flag glyphs for India, US and a globe mark.
// Rendered as inline SVG so they're crisp at any size and theme-aware.

import { useId, type SVGProps, type ReactNode } from "react";

type FlagCode = "IN" | "US" | "GLOBAL";

function Base({ children, className, size = 16, rounded = true, ...rest }: SVGProps<SVGSVGElement> & { size?: number; rounded?: boolean; children: ReactNode }) {
  const r = rounded ? 3 : 0;
  const clipId = useId();
  return (
    <svg
      viewBox="0 0 24 16"
      width={size * 1.5}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width="24" height="16" rx={r} ry={r} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>{children}</g>
      <rect x="0.25" y="0.25" width="23.5" height="15.5" rx={r} ry={r} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="0.5" />
    </svg>
  );
}

function IndiaFlag(props: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Base {...props}>
      <rect x="0" y="0" width="24" height="5.33" fill="#FF9933" />
      <rect x="0" y="5.33" width="24" height="5.34" fill="#FFFFFF" />
      <rect x="0" y="10.67" width="24" height="5.33" fill="#138808" />
      <g transform="translate(12 8)">
        <circle r="1.7" fill="none" stroke="#000080" strokeWidth="0.35" />
        <circle r="0.35" fill="#000080" />
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={i} x1="0" y1="0" x2="0" y2="-1.7" stroke="#000080" strokeWidth="0.15" transform={`rotate(${i * 15})`} />
        ))}
      </g>
    </Base>
  );
}

function USFlag(props: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Base {...props}>
      {Array.from({ length: 13 }).map((_, i) => (
        <rect key={i} x="0" y={i * (16 / 13)} width="24" height={16 / 13} fill={i % 2 === 0 ? "#B22234" : "#FFFFFF"} />
      ))}
      <rect x="0" y="0" width="10" height={(16 / 13) * 7} fill="#3C3B6E" />
      <g fill="#FFFFFF">
        {Array.from({ length: 9 }).flatMap((_, row) =>
          Array.from({ length: row % 2 === 0 ? 6 : 5 }).map((_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={0.8 + col * 1.55 + (row % 2 === 0 ? 0 : 0.78)}
              cy={0.75 + row * (((16 / 13) * 7 - 1.4) / 8)}
              r="0.35"
            />
          ))
        )}
      </g>
    </Base>
  );
}

function GlobalFlag({ size = 16, className }: { size?: number; className?: string }) {
  const clipId = useId();
  const gradId = useId();
  return (
    <svg
      viewBox="0 0 24 16"
      width={size * 1.5}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width="24" height="16" rx="3" ry="3" />
        </clipPath>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f2f6b" />
          <stop offset="100%" stopColor="#1a6fd6" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="24" height="16" fill={`url(#${gradId})`} />
        <g transform="translate(12 8)" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="0.5">
          <circle r="5" />
          <ellipse rx="5" ry="2" />
          <ellipse rx="2.4" ry="5" />
          <ellipse rx="4" ry="5" />
          <line x1="-5" y1="0" x2="5" y2="0" />
        </g>
      </g>
      <rect x="0.25" y="0.25" width="23.5" height="15.5" rx="3" ry="3" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="0.5" />
    </svg>
  );
}

export function Flag({ code, size = 16, className }: { code: FlagCode; size?: number; className?: string }) {
  if (code === "IN") return <IndiaFlag size={size} className={className} />;
  if (code === "US") return <USFlag size={size} className={className} />;
  return <GlobalFlag size={size} className={className} />;
}
