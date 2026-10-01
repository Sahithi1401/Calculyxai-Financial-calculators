/**
 * Animated Gradient Background — theme-adaptive.
 * Renders soft, slowly-drifting radial blobs behind app content.
 * Colors come from CSS variables so the same component looks right in light AND dark mode.
 */
export function AnimatedGradientBackground({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}
    >
      {/* base wash */}
      <div className="absolute inset-0 bg-background" />

      {/* animated blobs */}
      <div className="ag-blob ag-blob-1" />
      <div className="ag-blob ag-blob-2" />
      <div className="ag-blob ag-blob-3" />
      <div className="ag-blob ag-blob-4" />

      {/* subtle grain overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      {/* soft top/bottom fade so content reads clearly */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60" />
    </div>
  );
}
