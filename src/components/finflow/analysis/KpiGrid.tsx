import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Kpi } from "@/lib/finflow/analysis/types";

const toneClass: Record<NonNullable<Kpi["tone"]>, string> = {
  primary: "text-gradient",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  neutral: "text-foreground",
};

const toneGlow: Record<NonNullable<Kpi["tone"]>, string> = {
  primary: "from-primary/25 via-primary/10",
  success: "from-success/25 via-success/10",
  warning: "from-warning/25 via-warning/10",
  destructive: "from-destructive/25 via-destructive/10",
  neutral: "from-white/10 via-white/5",
};

/**
 * Animated count-up over the numeric portion of a KPI value, while preserving
 * the currency symbol / suffix / % sign that surrounds the number.
 */
function AnimatedValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState<string>(value);
  const lastValueRef = useRef<string>("");

  useEffect(() => {
    if (lastValueRef.current === value) return;
    lastValueRef.current = value;
    const match = value.match(/-?[\d,\.]+/);
    const numStrRaw = match?.[0];
    const target = numStrRaw ? Number(numStrRaw.replace(/,/g, "")) : NaN;
    if (!numStrRaw || !Number.isFinite(target) || !inView) {
      setDisplay(value);
      return;
    }
    const decimals = (numStrRaw.split(".")[1] || "").length;
    const groupSep = numStrRaw.includes(",");
    const mv = { current: 0 };
    const start = performance.now();
    const duration = 1000;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = mv.current + (target - mv.current) * eased;
      const n = Number(v.toFixed(decimals));
      const numStr = groupSep
        ? n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        : n.toFixed(decimals);
      setDisplay(value.replace(numStrRaw, numStr));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return <span ref={ref}>{display}</span>;
}

export function KpiGrid({ kpis }: { kpis: Kpi[] }) {
  if (!kpis.length) return null;
  const [hero, ...rest] = kpis;
  const heroTone = hero.tone ?? "primary";
  return (
    <div className="grid gap-3 lg:grid-cols-4">
      {/* Hero KPI — spans 2 cols on lg */}
      <motion.div
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="group relative min-w-0 overflow-hidden rounded-2xl border-sheen glass p-6 lg:col-span-2 lg:row-span-1"
      >
        <div
          aria-hidden
          className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br ${toneGlow[heroTone]} to-transparent blur-3xl opacity-70 transition-opacity duration-700 group-hover:opacity-100`}
        />
        <div className="relative flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          Headline result · {hero.label}
        </div>
        <div className={`relative mt-3 font-mono text-4xl font-semibold leading-tight tracking-tight tabular-nums break-words sm:text-5xl ${toneClass[heroTone]}`}>
          {hero.value}
        </div>
        {hero.sub && <div className="relative mt-2 text-sm text-muted-foreground">{hero.sub}</div>}
      </motion.div>

      {rest.map((k, i) => {
        const tone = k.tone ?? "neutral";
        return (
          <motion.div
            key={`${k.label}-${i}`}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.08 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="group relative min-w-0 overflow-hidden rounded-2xl border-sheen glass p-5 transition-all duration-500 hover:-translate-y-0.5"
          >
            <div
              aria-hidden
              className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${toneGlow[tone]} to-transparent blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
            />
            <div className="relative truncate font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              {k.label}
            </div>
            <div className={`relative mt-2 font-mono text-2xl font-semibold leading-tight tracking-tight tabular-nums break-words sm:text-[26px] ${toneClass[tone]}`}>
              {k.value}
            </div>
            {k.sub && <div className="relative mt-1 truncate text-xs text-muted-foreground">{k.sub}</div>}
          </motion.div>
        );
      })}
    </div>
  );
}
