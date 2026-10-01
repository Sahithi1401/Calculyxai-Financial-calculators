import { Clock, Zap } from "lucide-react";

export const SUPPORT_PROMISES = [
  { icon: Clock, label: "Email support answered within 1 business day" },
  { icon: Zap, label: "AI assistant responds in under 3 seconds" },
] as const;

/**
 * Small trust badge stating our support commitment. Used on /contact,
 * /thank-you and in the footer.
 */
export function SupportPromise({
  className = "",
  variant = "card",
}: {
  className?: string;
  variant?: "card" | "inline";
}) {
  if (variant === "inline") {
    return (
      <ul className={`flex flex-col gap-1.5 text-xs text-muted-foreground ${className}`}>
        {SUPPORT_PROMISES.map((p) => (
          <li key={p.label} className="flex items-center gap-2">
            <p.icon className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
            <span>{p.label}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-primary/25 bg-primary/[0.06] p-4 ${className}`}
    >
      <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
        Our response promise
      </div>
      <ul className="mt-3 space-y-2">
        {SUPPORT_PROMISES.map((p) => (
          <li key={p.label} className="flex items-start gap-2.5 text-sm text-foreground/90">
            <p.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>{p.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
