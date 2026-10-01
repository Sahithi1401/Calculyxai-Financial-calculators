/**
 * PremiumBackdrop — fixed, ultra-subtle grid + aurora overlay that gives every
 * page the same cinematic depth as the upgraded home hero. Sits above the
 * animated gradient background but below all page content.
 */
export function PremiumBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Blueprint grid with radial mask for center-weighted focus */}
      <div
        className="absolute inset-0 opacity-[0.55] dark:opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(from var(--foreground) l c h / 0.07) 1px, transparent 1px), linear-gradient(90deg, oklch(from var(--foreground) l c h / 0.07) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 90%)",
        }}
      />
      {/* Soft mint aurora — signal, not decoration */}
      <div
        className="absolute -top-40 -left-24 h-[38rem] w-[38rem] rounded-full blur-[120px] opacity-30 dark:opacity-20"
        style={{ background: "radial-gradient(circle, oklch(from var(--primary) l c h / 0.45), transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 -right-32 h-[34rem] w-[34rem] rounded-full blur-[120px] opacity-25 dark:opacity-18"
        style={{ background: "radial-gradient(circle, oklch(0.72 0.12 190 / 0.4), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 left-1/4 h-[36rem] w-[36rem] rounded-full blur-[120px] opacity-25 dark:opacity-18"
        style={{ background: "radial-gradient(circle, oklch(from var(--primary) l c h / 0.3), transparent 70%)" }}
      />
      {/* Subtle grain */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(oklch(1 0 0 / 0.6) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 50%, transparent 55%, oklch(from var(--background) l c h / 0.55) 100%)",
        }}
      />
    </div>
  );
}
