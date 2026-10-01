import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, X } from "lucide-react";

type Variant = "default" | "calculator";

const DISMISS_KEY = "calcyx.stickyCtaDismissed";

/**
 * Sticky bottom CTA for phones (<768px). Appears once the user scrolls past
 * the hero, hides while the footer is on screen, respects the iPhone safe
 * area and can be dismissed for the session.
 *
 * Pages that render it must also add `pb-24 md:pb-0` (or `sticky-cta-pad`)
 * so the bar never covers form inputs.
 */
export function StickyMobileCta({
  variant = "default",
  to,
  label,
  secondaryLabel,
  secondaryTo,
}: {
  variant?: Variant;
  to?: string;
  label?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Reset visibility on route change.
  useEffect(() => {
    setVisible(false);
  }, [pathname]);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const onScroll = () => {
      const past = window.scrollY > Math.min(520, window.innerHeight * 0.6);
      const footer = document.querySelector("footer");
      let footerVisible = false;
      if (footer) {
        const r = footer.getBoundingClientRect();
        footerVisible = r.top < window.innerHeight - 40;
      }
      setVisible(past && !footerVisible);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [dismissed]);

  if (dismissed) return null;

  const isCalc = variant === "calculator";
  const primaryTo = to ?? (isCalc ? "/auth" : "/auth");
  const primaryLabel = label ?? (isCalc ? "Save this calculation" : "Start Free");
  const secondLabel = secondaryLabel ?? (isCalc ? "Get PDF report" : "Explore Markets");
  const secondTo = secondaryTo ?? (isCalc ? "/dashboard" : "/stocks");

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 md:hidden transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-3 mb-2 flex items-center gap-2 rounded-2xl border border-border/70 bg-background/85 p-2 shadow-elegant backdrop-blur-xl">
        <Link
          to={primaryTo as "/"}
          className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-[12px] font-bold uppercase tracking-[0.16em] text-primary-foreground transition active:scale-[0.98]"
        >
          {primaryLabel}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
        <Link
          to={secondTo as "/"}
          className="flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-border/70 px-3 text-[12px] font-medium text-foreground/85"
        >
          {secondLabel}
        </Link>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => {
            try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch { /* ignore */ }
            setDismissed(true);
          }}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-muted-foreground"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
