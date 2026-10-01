import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeftRight, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCountry } from "@/lib/finflow/country-store";
import { COUNTRIES } from "@/lib/finflow/countries";
import { getExchangeRates } from "@/lib/finflow/exchange.functions";

const POPULAR = ["USD", "EUR", "GBP", "INR", "AED", "JPY", "AUD", "SGD"];

export function HeroConverter() {
  const [country] = useCountry();
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState(COUNTRIES[country].currency);
  const [amount, setAmount] = useState(1000);

  useEffect(() => { setTo(COUNTRIES[country].currency); }, [country]);

  const { data, isLoading } = useQuery({
    queryKey: ["rates", from],
    queryFn: () => getExchangeRates({ data: { base: from } }),
    staleTime: 5 * 60 * 1000,
  });

  const rate = data?.rates[to] ?? 0;
  const converted = amount * rate;

  return (
    <div className="relative mx-auto mt-10 w-full max-w-4xl sm:mt-14">
      {/* violet glow halo */}
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-primary/10 blur-2xl" aria-hidden />
      <div className="relative rounded-[2rem] p-[1px] bg-gradient-to-b from-white/10 to-transparent">
        <div className="relative overflow-hidden rounded-[calc(2rem-1px)] glass-strong p-5 sm:p-10">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.04] mix-blend-overlay" />

          <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
            {/* left: input + metrics */}
            <div className="space-y-5 min-w-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                    You send
                  </label>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                    </span>
                    Live
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <select
                    id="hero-currency-from"
                    aria-label="Convert from currency"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="shrink-0 bg-transparent font-display text-xl tracking-tight text-foreground/90 focus:outline-none sm:text-3xl"
                  >
                    {POPULAR.map((c) => <option key={c} value={c} className="bg-background">{c}</option>)}
                  </select>
                  <input
                    id="hero-currency-amount"
                    aria-label="Amount to convert"
                    type="number"
                    value={Number.isFinite(amount) ? amount : 0}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full min-w-0 flex-1 bg-transparent font-mono text-2xl font-medium tabular-nums tracking-tight focus:outline-none sm:text-5xl"
                  />
                </div>
                <div className="h-px w-full bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
              </div>


              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/60 bg-foreground/[0.03] p-3.5">
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Live rate</div>
                  <div className="mt-1 font-mono text-lg tabular-nums text-primary">
                    {isLoading ? "—" : rate.toFixed(4)}
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-foreground/[0.03] p-3.5">
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Inverse</div>
                  <div className="mt-1 font-mono text-lg tabular-nums text-foreground/85">
                    {rate ? (1 / rate).toFixed(4) : "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* right: result panel */}
            <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-primary/[0.06] p-5 sm:p-6 min-w-0">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl" aria-hidden />
              <div className="relative flex h-full flex-col justify-between gap-5 sm:gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
                      AI-optimized yield
                    </label>
                    <button
                      onClick={() => { const t = from; setFrom(to); setTo(t); }}
                      className="grid h-7 w-7 place-items-center rounded-full border border-border/60 text-muted-foreground transition hover:rotate-180 hover:bg-foreground/5"
                      aria-label="Swap"
                    >
                      <ArrowLeftRight className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="min-w-0 truncate font-mono text-3xl font-medium tabular-nums tracking-tight text-foreground sm:text-5xl">
                      {converted.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                    </span>
                    <select
                      id="hero-currency-to"
                      aria-label="Convert to currency"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="shrink-0 bg-transparent font-mono text-base font-medium text-muted-foreground focus:outline-none sm:text-lg"
                    >
                      {POPULAR.map((c) => <option key={c} value={c} className="bg-background">{c}</option>)}
                    </select>
                  </div>
                </div>


                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono text-[11px] tracking-wide">
                    <span className="text-muted-foreground uppercase tracking-[0.2em]">1 {from}</span>
                    <span className="text-foreground tabular-nums">= {rate.toFixed(4)} {to}</span>
                  </div>
                  <Link
                    to="/calc/$type"
                    params={{ type: "currency" }}
                    className="cta-glow group flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.24em]"
                  >
                    Open full converter
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 pb-16 pt-20 sm:pb-28 sm:pt-36">
      {/* subtle grid — no aurora, no floating tickers */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(oklch(from var(--foreground) l c h / 0.045) 1px, transparent 1px), linear-gradient(90deg, oklch(from var(--foreground) l c h / 0.045) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 60% 55% at 50% 25%, #000 30%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 55% at 50% 25%, #000 30%, transparent 90%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto flex w-fit items-center gap-2.5 rounded-full border border-border/70 bg-card/40 px-3 py-1.5 backdrop-blur-md">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-success/60 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Financial Intelligence · Live Data · v2.0
          </span>
        </div>

        <h1
          className="mt-5 text-center font-display text-[2.1rem] font-normal leading-[1.05] tracking-[-0.035em] sm:mt-10 sm:text-6xl md:text-7xl"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 0' }}
        >
          <span className="block">Professional Financial</span>
          <span
            className="block italic text-primary"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Intelligence, Powered by AI.
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-center text-[14px] leading-relaxed text-muted-foreground sm:mt-7 sm:text-lg">
          Analyze stocks, ETFs, mutual funds, loans, taxes, and real estate using
          institutional-grade financial data, proprietary scoring models, and AI-powered
          explanations backed by primary sources.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:mt-10 sm:gap-3">
          <Link
            to="/calculators"
            className="group inline-flex min-h-12 items-center gap-2 rounded-md bg-primary px-6 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-primary-foreground shadow-[0_0_0_1px_oklch(from_var(--primary)_l_c_h_/_0.4),0_10px_30px_-12px_oklch(from_var(--primary)_l_c_h_/_0.55)] transition hover:brightness-110 active:scale-[0.97]"
          >
            Try the calculators <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/stocks"
            className="inline-flex min-h-12 items-center gap-2 rounded-md border border-border bg-card/40 px-6 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-foreground/85 backdrop-blur-md transition hover:border-foreground/25 hover:bg-card/70 hover:text-foreground active:scale-[0.97]"
          >
            Explore markets
          </Link>
          <Link
            to="/ai"
            className="inline-flex min-h-12 items-center gap-2 rounded-md px-4 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground transition hover:text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" /> Ask the AI
          </Link>
        </div>

        <div className="mx-auto mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80 sm:mt-9">
          <span>Financial Modeling Prep</span>
          <span className="hidden sm:inline h-1 w-1 rounded-full bg-border" />
          <span>Finnhub</span>
          <span className="hidden sm:inline h-1 w-1 rounded-full bg-border" />
          <span>Alpha Vantage</span>
          <span className="hidden sm:inline h-1 w-1 rounded-full bg-border" />
          <span>SEC EDGAR</span>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-border/70 bg-border/70 sm:grid-cols-3">
          {[
            { k: "01", t: "Structured Data Pipeline", d: "FMP · Finnhub · Alpha Vantage · SEC filings — validated, normalized, cached." },
            { k: "02", t: "Proprietary Scoring", d: "Health · Growth · Risk · Valuation · Momentum. Deterministic, cited drivers." },
            { k: "03", t: "Evidence-Backed AI", d: "Never invents numbers. Reads structured JSON, cites filings and metrics." },
          ].map((p) => (
            <div key={p.k} className="group relative bg-background/95 p-6 transition hover:bg-background">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">{p.k}</div>
              <div className="mt-3 font-display text-lg tracking-tight">{p.t}</div>
              <div className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{p.d}</div>
            </div>
          ))}
        </div>

        <HeroConverter />
      </div>
    </section>
  );
}
