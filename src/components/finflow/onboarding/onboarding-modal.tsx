import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { X, ArrowRight, ArrowLeft, Sparkles, Calculator, LineChart, Brain, LayoutDashboard, Check } from "lucide-react";
import { cn } from "@/lib/utils";

import homeShot from "@/assets/onboarding/home.jpg.asset.json";
import calcShot from "@/assets/onboarding/calculators.jpg.asset.json";
import aiShot from "@/assets/onboarding/ai.jpg.asset.json";
import stocksShot from "@/assets/onboarding/stocks.jpg.asset.json";
import dashShot from "@/assets/onboarding/dashboard.jpg.asset.json";

const STORAGE_KEY = "calculyx.onboarding.v1";

type Slide = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  cta: { label: string; to: string };
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string; // tailwind gradient stops
};

const SLIDES: Slide[] = [
  {
    eyebrow: "Welcome",
    title: "Meet Calculyx AI",
    body: "Your premium financial intelligence workspace — 27+ calculators, live markets, and an AI advisor tuned for personal finance.",
    bullets: ["Real bank rates across IN, US, UAE", "AI insights on every calculation", "PDF & Excel reports in one click"],
    cta: { label: "Start the tour", to: "/" },
    image: homeShot.url,
    icon: Sparkles,
    accent: "from-primary/70 via-primary/30 to-transparent",
  },
  {
    eyebrow: "Step 01",
    title: "27+ premium calculators",
    body: "From SIP and EMI to Home Loan, Mortgage, FD, GST, Salary, Retirement and Currency — every calculator ships with sensitivity, comparison and AI commentary.",
    bullets: ["Home Loan Engine with live bank rates", "SIP, FD, Compound & Retirement", "Country-aware tax rules"],
    cta: { label: "Open calculators", to: "/calculators" },
    image: calcShot.url,
    icon: Calculator,
    accent: "from-emerald-400/60 via-teal-500/25 to-transparent",
  },
  {
    eyebrow: "Step 02",
    title: "AI financial advisor",
    body: "Ask anything about your money in natural language. Calculyx AI grounds answers in your saved calculations, portfolio, and current market data.",
    bullets: ["Grounded on your own numbers", "Bull & bear case for every stock", "Guardrails against bad advice"],
    cta: { label: "Try the AI", to: "/ai" },
    image: aiShot.url,
    icon: Brain,
    accent: "from-fuchsia-500/60 via-violet-500/25 to-transparent",
  },
  {
    eyebrow: "Step 03",
    title: "Live markets & stocks",
    body: "Track top-50 stocks across India and the US with predictive AI, technicals and news — all in one calm, focused surface.",
    bullets: ["Realtime prices & charts", "AI predictions with confidence bands", "News that actually matters"],
    cta: { label: "Explore stocks", to: "/stocks" },
    image: stocksShot.url,
    icon: LineChart,
    accent: "from-cyan-400/60 via-sky-500/25 to-transparent",
  },
  {
    eyebrow: "Step 04",
    title: "Your dashboard",
    body: "Save every calculation, favourite calculators, share reports and pick up exactly where you left off — across every device.",
    bullets: ["Sync across devices", "Shareable report links", "Portfolio & net worth panels"],
    cta: { label: "Open dashboard", to: "/dashboard" },
    image: dashShot.url,
    icon: LayoutDashboard,
    accent: "from-amber-400/60 via-orange-500/25 to-transparent",
  },
];

function hasSeen(): boolean {
  try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
}
function markSeen() {
  try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* noop */ }
}

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);

  // First-time visitor: open on mount if not seen.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasSeen()) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  // Also open on SIGNED_IN for users who haven't seen it yet.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" && !hasSeen()) {
        setI(0);
        setOpen(true);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, i]);

  const slide = SLIDES[i];
  const isLast = i === SLIDES.length - 1;

  const close = () => { markSeen(); setOpen(false); };
  const next = () => { if (isLast) close(); else setI((v) => Math.min(SLIDES.length - 1, v + 1)); };
  const prev = () => setI((v) => Math.max(0, v - 1));

  const progress = useMemo(() => ((i + 1) / SLIDES.length) * 100, [i]);

  if (!open || typeof document === "undefined") return null;

  const Icon = slide.icon;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in" role="dialog" aria-modal="true" aria-label="Welcome to Calculyx AI">
      {/* Backdrop */}
      <button
        aria-label="Close onboarding"
        onClick={close}
        className="absolute inset-0 bg-background/70 backdrop-blur-xl"
      />

      {/* Card */}
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-background/95 to-background shadow-[0_40px_120px_-30px_rgba(0,0,0,0.6)] animate-scale-in">
        {/* Aurora accent per slide */}
        <div aria-hidden className={cn("pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full blur-3xl opacity-70 bg-gradient-to-b", slide.accent)} />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: "radial-gradient(hsl(var(--foreground)/0.6) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, #000, transparent 80%)",
        }} />

        {/* Close */}
        <button
          onClick={close}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-background/60 text-muted-foreground backdrop-blur hover:text-foreground hover:bg-background transition"
          aria-label="Skip tour"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Progress */}
        <div className="absolute left-0 right-0 top-0 h-[3px] bg-white/5">
          <div className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary/40 transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>

        <div className="relative grid gap-0 md:grid-cols-2">
          {/* Left: copy */}
          <div className="flex flex-col justify-between p-7 sm:p-10">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-primary/15 ring-1 ring-primary/30">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {slide.eyebrow}
              </div>

              <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">
                {slide.title}
              </h2>

              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                {slide.body}
              </p>

              <ul className="mt-6 space-y-2.5">
                {slide.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-foreground/85">
                    <span className="mt-[3px] grid h-4 w-4 shrink-0 place-items-center rounded-full bg-primary/15 ring-1 ring-primary/30">
                      <Check className="h-2.5 w-2.5 text-primary" strokeWidth={3} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Controls */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                {SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setI(idx)}
                    aria-label={`Go to step ${idx + 1}`}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      idx === i ? "w-8 bg-primary" : "w-3 bg-white/15 hover:bg-white/25"
                    )}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {i > 0 && (
                  <button
                    onClick={prev}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/80 backdrop-blur hover:bg-background hover:text-foreground transition"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                )}

                {isLast ? (
                  <Link
                    to={slide.cta.to}
                    onClick={close}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-foreground px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-background transition-transform hover:scale-[1.02]"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-primary/40 via-transparent to-primary/40 transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative">Get started</span>
                    <ArrowRight className="relative h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <button
                    onClick={next}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-foreground px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-background transition-transform hover:scale-[1.02]"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-primary/40 via-transparent to-primary/40 transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative">Next</span>
                    <ArrowRight className="relative h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={close}
              className="mt-4 self-start font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70 hover:text-foreground transition"
            >
              Skip tour →
            </button>
          </div>

          {/* Right: screenshot */}
          <div className="relative min-h-[280px] overflow-hidden border-t border-border/60 md:min-h-[520px] md:border-l md:border-t-0">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />
            <div className="relative flex h-full items-center justify-center p-6 sm:p-8">
              {/* Mac-window frame */}
              <div className="w-full max-w-lg overflow-hidden rounded-xl border border-border/60 bg-black/40 shadow-2xl shadow-black/50 ring-1 ring-white/5 transition-transform hover:-translate-y-1 duration-500">
                <div className="flex items-center gap-1.5 border-b border-border/40 bg-white/5 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                  <span className="ml-3 font-mono text-[10px] text-white/40">calculyxai.online{slide.cta.to === "/" ? "" : slide.cta.to}</span>
                </div>
                <img
                  key={slide.image}
                  src={slide.image}
                  alt={`Calculyx AI product screenshot: ${slide.title} — ${slide.body}`}
                  className="block h-full w-full object-cover animate-fade-in"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
