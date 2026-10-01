import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight, ArrowDownRight, Activity, TrendingUp, TrendingDown, Flame, Trophy,
  Layers, Gauge, LineChart, PieChart, Percent, ShieldCheck, Sparkles, Search,
  Filter, ChevronDown, Newspaper, Brain, Calculator, Target, ArrowRight,
} from "lucide-react";
import { Aurora, GridBackdrop, MeshOrbs, ParticleField } from "@/components/finflow/home/backgrounds";
import { Reveal } from "@/components/finflow/home/primitives";
import type { StockQuote } from "@/lib/finflow/stocks.functions";
import { cn } from "@/lib/utils";

/* ---------------- Deterministic PRNG (SSR-safe) ---------------- */
function seeded(seed: number) {
  let s = seed || 1;
  return () => { s = (s * 1664525 + 1013904223) % 2 ** 32; return s / 2 ** 32; };
}
function hashSeed(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h) || 1;
}

/* ---------------- Sparkline (SSR-safe) ---------------- */
export function Sparkline({ seed, up = true, className = "" }: { seed: number; up?: boolean; className?: string }) {
  const rand = seeded(seed);
  const pts = Array.from({ length: 24 }, () => rand() * 28 + 6);
  // bias last point up/down for the "trend"
  pts[pts.length - 1] = up ? Math.max(...pts) - 2 : Math.min(...pts) + 2;
  const d = pts.map((y, i) => `${i === 0 ? "M" : "L"}${(i / (pts.length - 1)) * 100},${40 - y}`).join(" ");
  const stroke = up ? "oklch(0.72 0.17 155 / 0.9)" : "oklch(0.65 0.22 25 / 0.9)";
  const fill = up ? "oklch(0.72 0.17 155 / 0.14)" : "oklch(0.65 0.22 25 / 0.14)";
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className={cn("h-full w-full", className)}>
      <path d={`${d} L100,40 L0,40 Z`} fill={fill} stroke="none" />
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ============================================================
   HERO
============================================================ */
export function StocksHero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-14 sm:pt-40 sm:pb-28">
      <Aurora className="opacity-80" />
      <GridBackdrop />
      <MeshOrbs />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 dark:border-border/60 bg-foreground/[0.04] dark:bg-card/60 px-3 py-1.5 backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.24em] text-muted-foreground sm:text-[10px] sm:tracking-[0.28em]">
              Live · Institutional Intelligence
            </span>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:mt-6 sm:text-6xl md:text-7xl">
            Stock market <span className="font-serif italic text-primary">intelligence</span>.
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
            <span className="text-foreground/90">Analyze. Track. Compare. Invest.</span> AI-powered stock intelligence with
            real-time data, portfolio insights, and financial analytics — India, US, and Global.
          </p>
        </Reveal>



        <Reveal delay={240}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#markets" className="cta-glow inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">
              Explore Markets <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#watchlist" className="inline-flex items-center gap-2 rounded-full border border-foreground/10 dark:border-border/60 bg-foreground/[0.03] dark:bg-card/40 px-6 py-3 text-sm font-medium hover:bg-foreground/[0.06] dark:bg-card/70 transition">
              <Activity className="h-4 w-4" /> Live Watchlist
            </a>
            <Link to="/ai" className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-6 py-3 text-sm font-medium text-primary hover:bg-primary/20 transition">
              <Brain className="h-4 w-4" /> AI Stock Advisor
            </Link>
          </div>
        </Reveal>

        {/* Floating stat pills */}
        <Reveal delay={320}>
          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { k: "Live Tickers", v: "100+" },
              { k: "Markets Covered", v: "IN · US · Global" },
              { k: "AI Analyses", v: "Bull / Bear / Hold" },
              { k: "Calculators", v: "27 Modules" },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl border-sheen glass px-5 py-4">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{s.k}</div>
                <div className="mt-1 font-display text-xl tracking-tight">{s.v}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   LIVE MARKET OVERVIEW — index cards
============================================================ */
type IndexCard = { symbol: string; name: string; value: number; delta: number; region: string };
const MARKET_INDICES: IndexCard[] = [
  { symbol: "NIFTY", name: "Nifty 50", value: 24_812, delta: 0.42, region: "IN" },
  { symbol: "SENSEX", name: "BSE Sensex", value: 81_450, delta: 0.36, region: "IN" },
  { symbol: "NASDAQ", name: "Nasdaq", value: 19_874, delta: 0.68, region: "US" },
  { symbol: "S&P 500", name: "S&P 500", value: 5_812, delta: 0.29, region: "US" },
  { symbol: "DOW", name: "Dow Jones", value: 42_615, delta: -0.12, region: "US" },
  { symbol: "RUT", name: "Russell 2000", value: 2_318, delta: -0.24, region: "US" },
  { symbol: "GOLD", name: "Gold / oz", value: 2_685, delta: 0.51, region: "COMM" },
  { symbol: "SILVER", name: "Silver / oz", value: 31.42, delta: -0.18, region: "COMM" },
  { symbol: "BTC", name: "Bitcoin", value: 96_820, delta: 1.24, region: "CRYPTO" },
  { symbol: "ETH", name: "Ethereum", value: 3_412, delta: 0.87, region: "CRYPTO" },
  { symbol: "USDINR", name: "USD / INR", value: 84.32, delta: -0.05, region: "FX" },
  { symbol: "EURUSD", name: "EUR / USD", value: 1.086, delta: 0.11, region: "FX" },
  { symbol: "AEDINR", name: "AED / INR", value: 22.94, delta: -0.02, region: "FX" },
];

export function MarketOverview() {
  return (
    <section id="markets" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader
            eyebrow="Live market overview"
            title={<>Every market, <span className="font-serif italic text-primary">one glance</span>.</>}
            subtitle="Indices, commodities, currencies, and crypto — refreshed continuously with intelligent trend signals."
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {MARKET_INDICES.map((c, i) => (
              <IndexCard key={c.symbol} card={c} idx={i} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function IndexCard({ card, idx }: { card: IndexCard; idx: number }) {
  const up = card.delta >= 0;
  return (
    <motion.div
      initial={{ y: 12, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(idx * 0.03, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border-sheen glass p-4 transition-all duration-500 hover:-translate-y-1"
    >
      <div aria-hidden className={cn("pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100",
        up ? "bg-emerald-400/25" : "bg-red-500/25")} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{card.region}</div>
          <div className="mt-0.5 font-display text-sm font-semibold tracking-tight">{card.name}</div>
        </div>
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
          up ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400")}>
          {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {up ? "+" : ""}{card.delta.toFixed(2)}%
        </span>
      </div>
      <div className="relative mt-3 font-mono text-2xl font-semibold tabular-nums tracking-tight">
        {card.value.toLocaleString("en-US", { maximumFractionDigits: 2 })}
      </div>
      <div className="relative mt-2 h-9">
        <Sparkline seed={hashSeed(card.symbol)} up={up} />
      </div>
    </motion.div>
  );
}

/* ============================================================
   TOP MARKET MOVERS — Bento
============================================================ */
export function TopMovers({ stocks }: { stocks: StockQuote[] }) {
  const gainers = useMemo(() => [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5), [stocks]);
  const losers  = useMemo(() => [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5), [stocks]);
  const active  = useMemo(() => [...stocks].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 5), [stocks]);

  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader
            eyebrow="Top market movers"
            title={<>Where the smart money <span className="font-serif italic text-primary">is flowing</span>.</>}
            subtitle="Real-time gainers, losers, and volume leaders — surfaced from the live universe you're tracking."
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12">
            <MoverPanel title="Top Gainers" icon={TrendingUp} tone="up" list={gainers} className="lg:col-span-4" />
            <MoverPanel title="Top Losers" icon={TrendingDown} tone="down" list={losers} className="lg:col-span-4" />
            <MoverPanel title="Most Active" icon={Flame} tone="neutral" list={active} className="lg:col-span-4" />
            <MiniStatBento className="lg:col-span-12" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MoverPanel({ title, icon: Icon, tone, list, className }: {
  title: string; icon: React.ComponentType<{ className?: string }>; tone: "up" | "down" | "neutral";
  list: StockQuote[]; className?: string;
}) {
  const toneClass = tone === "up" ? "text-emerald-400" : tone === "down" ? "text-red-400" : "text-primary";
  return (
    <div className={cn("relative overflow-hidden rounded-3xl border-sheen glass p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("grid h-9 w-9 place-items-center rounded-xl bg-foreground/[0.04] dark:bg-card/60 ring-1 ring-border/60", toneClass)}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="font-display text-lg font-semibold tracking-tight">{title}</div>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Top 5</span>
      </div>
      <div className="mt-4 divide-y divide-white/5">
        {list.length === 0 && <div className="py-6 text-center text-xs text-muted-foreground">Waiting on data…</div>}
        {list.map((s) => {
          const up = s.changePercent >= 0;
          return (
            <Link
              key={s.symbol}
              to="/stocks/$symbol"
              params={{ symbol: s.symbol }}
              search={{} as never}
              className="group flex items-center justify-between gap-3 py-3 transition hover:bg-foreground/[0.02] dark:bg-card/30 rounded-lg px-2 -mx-2"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold tracking-wider">{s.symbol.replace(/\.(NS|BO)$/, "")}</span>
                  <span className="text-[10px] text-muted-foreground">{s.region === "US" ? "🇺🇸" : "🇮🇳"}</span>
                </div>
                <div className="truncate text-xs text-muted-foreground">{s.name}</div>
              </div>
              <div className="h-6 w-16 shrink-0">
                <Sparkline seed={hashSeed(s.symbol)} up={up} />
              </div>
              <div className="text-right">
                <div className="font-mono text-xs font-semibold tabular-nums">
                  {s.currency === "INR" ? "₹" : "$"}{s.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div className={cn("font-mono text-[11px] tabular-nums", up ? "text-emerald-400" : "text-red-400")}>
                  {up ? "+" : ""}{s.changePercent.toFixed(2)}%
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function MiniStatBento({ className }: { className?: string }) {
  const stats = [
    { i: Trophy, k: "52-Week Highs", v: 148, sub: "Across tracked tickers" },
    { i: Activity, k: "52-Week Lows", v: 62, sub: "Value zones emerging" },
    { i: Flame, k: "Trending Now", v: "AI · Semis · Gold", sub: "Momentum + volume" },
    { i: Layers, k: "High Volume", v: "23%", sub: "Vs. 30-day avg" },
  ];
  return (
    <div className={cn("grid grid-cols-2 gap-4 lg:grid-cols-4", className)}>
      {stats.map((s) => (
        <div key={s.k} className="group relative overflow-hidden rounded-2xl border-sheen glass p-5 transition hover:-translate-y-0.5">
          <div aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/15 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            <s.i className="h-3.5 w-3.5 text-primary" /> {s.k}
          </div>
          <div className="relative mt-2 font-display text-2xl font-semibold tracking-tight">{s.v}</div>
          <div className="relative mt-1 text-xs text-muted-foreground">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   SECTOR HEATMAP
============================================================ */
const SECTORS = [
  { name: "Technology", weight: 22, perf: 1.42 },
  { name: "Finance", weight: 18, perf: 0.58 },
  { name: "Healthcare", weight: 12, perf: -0.34 },
  { name: "Energy", weight: 9, perf: 1.87 },
  { name: "Consumer", weight: 11, perf: 0.22 },
  { name: "Automobile", weight: 7, perf: -0.92 },
  { name: "Pharma", weight: 8, perf: 0.71 },
  { name: "Utilities", weight: 6, perf: -0.18 },
  { name: "Industrials", weight: 5, perf: 0.44 },
  { name: "Materials", weight: 2, perf: -1.12 },
];

export function SectorHeatmap() {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader
            eyebrow="Sector heatmap"
            title={<>Where sectors are <span className="font-serif italic text-primary">moving</span>.</>}
            subtitle="Real-time performance colored by strength — click any sector to drill into constituents and AI analysis."
          />
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {SECTORS.map((s) => {
              const up = s.perf >= 0;
              const intensity = Math.min(Math.abs(s.perf) / 2, 1);
              const bg = up
                ? `oklch(0.72 0.17 155 / ${0.08 + intensity * 0.22})`
                : `oklch(0.65 0.22 25 / ${0.08 + intensity * 0.22})`;
              const size = s.weight >= 15 ? "row-span-2 col-span-2 min-h-[10rem]" : s.weight >= 8 ? "min-h-[8rem]" : "min-h-[6rem]";
              return (
                <div
                  key={s.name}
                  className={cn("relative overflow-hidden rounded-2xl border-sheen p-4 transition hover:-translate-y-0.5", size)}
                  style={{ background: bg }}
                >
                  <div className="font-display text-base font-semibold tracking-tight">{s.name}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Weight {s.weight}%</div>
                  <div className={cn("absolute bottom-3 right-4 font-mono text-lg font-semibold tabular-nums", up ? "text-emerald-400" : "text-red-400")}>
                    {up ? "+" : ""}{s.perf.toFixed(2)}%
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   SCREENER (client-side filter over live stocks)
============================================================ */
export function Screener({ stocks }: { stocks: StockQuote[] }) {
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [region, setRegion] = useState<"ALL" | "IN" | "US">("ALL");
  const [sort, setSort] = useState<"gain" | "loss" | "price">("gain");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let list = stocks.filter((s) => {
      if (region !== "ALL" && s.region !== region) return false;
      if (typeof minPrice === "number" && s.price < minPrice) return false;
      if (typeof maxPrice === "number" && s.price > maxPrice) return false;
      if (q.trim()) {
        const t = q.toLowerCase();
        if (!s.symbol.toLowerCase().includes(t) && !s.name.toLowerCase().includes(t)) return false;
      }
      return true;
    });
    if (sort === "gain") list = list.sort((a, b) => b.changePercent - a.changePercent);
    if (sort === "loss") list = list.sort((a, b) => a.changePercent - b.changePercent);
    if (sort === "price") list = list.sort((a, b) => b.price - a.price);
    return list.slice(0, 20);
  }, [stocks, region, minPrice, maxPrice, q, sort]);

  return (
    <section id="screener" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader
            eyebrow="Professional screener"
            title={<>Find your next <span className="font-serif italic text-primary">position</span>.</>}
            subtitle="Filter across region, price, and momentum. Results update instantly as you refine your thesis."
          />
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 overflow-hidden rounded-3xl border-sheen glass">
            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-3 border-b border-foreground/5 dark:border-border/40 p-5">
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Ticker or company…"
                  className="h-10 w-full rounded-full border border-foreground/10 dark:border-border/60 bg-foreground/[0.03] dark:bg-card/40 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <ChipSelect label="Market" value={region} onChange={(v) => setRegion(v as "ALL" | "IN" | "US")} options={[["ALL", "All"], ["IN", "🇮🇳 India"], ["US", "🇺🇸 US"]]} />
              <NumInput label="Min $" value={minPrice} onChange={setMinPrice} />
              <NumInput label="Max $" value={maxPrice} onChange={setMaxPrice} />
              <ChipSelect label="Sort" value={sort} onChange={(v) => setSort(v as "gain" | "loss" | "price")} options={[["gain", "Top gainers"], ["loss", "Top losers"], ["price", "Highest price"]]} />
              <div className="ml-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                <Filter className="h-3 w-3" /> {filtered.length} results
              </div>
            </div>

            {/* Result rows */}
            <div className="max-h-[520px] overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background/70 backdrop-blur">
                  <tr className="text-left font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    <th className="px-5 py-3">Symbol</th>
                    <th className="px-5 py-3">Company</th>
                    <th className="px-5 py-3 text-right">Price</th>
                    <th className="px-5 py-3 text-right">Change</th>
                    <th className="hidden px-5 py-3 md:table-cell">Trend</th>
                    <th className="px-5 py-3 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => {
                    const up = s.changePercent >= 0;
                    return (
                      <tr key={s.symbol} className="border-t border-foreground/5 dark:border-border/40 transition hover:bg-foreground/[0.02] dark:bg-card/30">
                        <td className="px-5 py-3 font-mono text-xs font-semibold">{s.symbol.replace(/\.(NS|BO)$/, "")}</td>
                        <td className="px-5 py-3 text-xs text-muted-foreground">{s.name}</td>
                        <td className="px-5 py-3 text-right font-mono text-xs tabular-nums">
                          {s.currency === "INR" ? "₹" : "$"}{s.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </td>
                        <td className={cn("px-5 py-3 text-right font-mono text-xs tabular-nums", up ? "text-emerald-400" : "text-red-400")}>
                          {up ? "+" : ""}{s.changePercent.toFixed(2)}%
                        </td>
                        <td className="hidden px-5 py-3 md:table-cell"><div className="h-6 w-24"><Sparkline seed={hashSeed(s.symbol)} up={up} /></div></td>
                        <td className="px-5 py-3 text-right">
                          <Link
                            to="/stocks/$symbol"
                            params={{ symbol: s.symbol }}
                            search={{} as never}
                            className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary hover:bg-primary/20 transition"
                          >
                            Analyze <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="px-5 py-10 text-center text-xs text-muted-foreground">No matches. Loosen your filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ChipSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-foreground/10 dark:border-border/60 bg-foreground/[0.03] dark:bg-card/40 px-3 py-1.5 text-xs">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-transparent pr-5 text-xs font-medium focus:outline-none"
        >
          {options.map(([v, l]) => <option key={v} value={v} className="bg-background">{l}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
      </div>
    </label>
  );
}

function NumInput({ label, value, onChange }: { label: string; value: number | ""; onChange: (v: number | "") => void }) {
  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-foreground/10 dark:border-border/60 bg-foreground/[0.03] dark:bg-card/40 px-3 py-1.5 text-xs">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-16 bg-transparent text-xs font-medium focus:outline-none"
        placeholder="—"
      />
    </label>
  );
}

/* ============================================================
   INVESTMENT CALCULATORS BENTO
============================================================ */
const CALC_CARDS: { slug: string; name: string; tag: string; icon: React.ComponentType<{ className?: string }>; span: string }[] = [
  { slug: "sip", name: "SIP", tag: "Systematic Investment", icon: LineChart, span: "sm:col-span-2 lg:col-span-2" },
  { slug: "compound-interest", name: "Compound", tag: "The 8th wonder", icon: TrendingUp, span: "" },
  { slug: "retirement", name: "Retirement", tag: "Freedom math", icon: ShieldCheck, span: "" },
  { slug: "fd", name: "Fixed Deposit", tag: "Safe returns", icon: Percent, span: "" },
  { slug: "inflation", name: "Inflation", tag: "Real value", icon: Gauge, span: "" },
  { slug: "mortgage", name: "Mortgage", tag: "Home financing", icon: PieChart, span: "sm:col-span-2 lg:col-span-2" },
  { slug: "home-loan", name: "Home Loan", tag: "EMI + tax", icon: Calculator, span: "" },
  { slug: "property", name: "Property", tag: "Cost of ownership", icon: Layers, span: "" },
];

export function CalculatorsBento() {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader
            eyebrow="Investment calculators"
            title={<>Every scenario, <span className="font-serif italic text-primary">modeled</span>.</>}
            subtitle="Feed live stock data into 27 financial calculators. Project SIPs on real returns, size retirement corpuses, and stress-test mortgages."
          />
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
            {CALC_CARDS.map((c) => (
              <Link
                key={c.slug}
                to="/calc/$type"
                params={{ type: c.slug }}
                search={{} as never}
                className={cn("group relative overflow-hidden rounded-2xl border-sheen glass p-5 transition-all duration-500 hover:-translate-y-1", c.span)}
              >
                <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative flex items-start justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/40 to-primary/10 ring-1 ring-border/60">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <div className="relative mt-6 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{c.tag}</div>
                <div className="relative mt-1 font-display text-xl font-semibold tracking-tight">{c.name}</div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/investing-calculators" className="inline-flex items-center gap-2 rounded-full border border-foreground/10 dark:border-border/60 bg-foreground/[0.03] dark:bg-card/40 px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-foreground/[0.06] dark:bg-card/70 transition">
              View all 27 calculators <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   AI INSIGHTS PREVIEW
============================================================ */
export function AiInsightsPreview() {
  const facets = [
    { i: ShieldCheck, k: "Company Health", v: "Strong" },
    { i: Gauge, k: "Valuation", v: "Fair" },
    { i: TrendingUp, k: "Growth", v: "Above avg" },
    { i: Target, k: "Investment Thesis", v: "12-mo view" },
  ];
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeader
              align="left"
              eyebrow="AI stock intelligence"
              title={<>Every ticker, <span className="font-serif italic text-primary">explained</span>.</>}
              subtitle="Company health, valuation, growth, risks, technical trend, fundamentals, sentiment, competitor comparison, and long-term outlook — with confidence levels."
            />
            <div className="mt-8 grid grid-cols-2 gap-3">
              {facets.map((f) => (
                <div key={f.k} className="rounded-2xl border-sheen glass p-4">
                  <div className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    <f.i className="h-3.5 w-3.5 text-primary" /> {f.k}
                  </div>
                  <div className="mt-1 font-display text-lg font-semibold tracking-tight">{f.v}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border-sheen glass p-6 sm:p-8">
              <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
              <div aria-hidden className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
              <div className="relative flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                <Brain className="h-3.5 w-3.5 text-primary" /> Calculyx AI · analyzing AAPL
              </div>
              <div className="relative mt-4 space-y-3">
                {[
                  { role: "user", text: "Is Apple a buy at current levels?" },
                  { role: "ai", text: "AAPL trades at a P/E of ~29x with services revenue accelerating. Balance sheet is fortress-class; free cash flow yield ≈ 4.1%. Rating: Constructive." },
                  { role: "user", text: "Compare to Microsoft on growth." },
                  { role: "ai", text: "MSFT posts higher revenue growth (Azure ~30%) but AAPL leads on capital returns and margin durability. Both are core holdings for different reasons." },
                ].map((m, i) => (
                  <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                      m.role === "user" ? "bg-primary text-primary-foreground" : "border border-foreground/10 dark:border-border/60 bg-foreground/[0.04] dark:bg-card/60")}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative mt-6 flex items-center justify-between border-t border-foreground/5 dark:border-border/40 pt-4">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-accent" /> Confidence · 82%
                </div>
                <Link to="/ai" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  Open AI advisor <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PORTFOLIO ANALYSIS TEASER
============================================================ */
export function PortfolioTeaser() {
  const kpis = [
    { k: "Portfolio Value", v: "$248,510" },
    { k: "Today's Gain", v: "+$1,842", tone: "up" as const },
    { k: "Overall Return", v: "+38.2%", tone: "up" as const },
    { k: "Risk Score", v: "Moderate" },
    { k: "Sharpe Ratio", v: "1.42" },
    { k: "Beta", v: "0.91" },
    { k: "Alpha", v: "+2.4%" },
    { k: "Diversification", v: "8.6 / 10" },
  ];
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader
            eyebrow="Portfolio intelligence"
            title={<>Know your <span className="font-serif italic text-primary">exposure</span>.</>}
            subtitle="Institutional-grade portfolio analytics — Sharpe, Beta, Alpha, sector concentration, and AI-driven rebalancing suggestions."
          />
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.k} className="rounded-2xl border-sheen glass p-5">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{k.k}</div>
                <div className={cn("mt-2 font-display text-2xl font-semibold tabular-nums tracking-tight",
                  k.tone === "up" && "text-emerald-400")}>{k.v}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary hover:bg-primary/20 transition">
              <PieChart className="h-4 w-4" /> Open your dashboard <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   MARKET NEWS TEASER
============================================================ */
export function MarketNewsTeaser() {
  const items = [
    { cat: "Earnings", head: "Nvidia beats on data-center revenue, guides higher", read: "3 min", tone: "up" },
    { cat: "Macro", head: "RBI holds rates as inflation eases into target band", read: "4 min", tone: "neutral" },
    { cat: "Commodities", head: "Gold breaks $2,700 as safe-haven bid returns", read: "2 min", tone: "up" },
  ];
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader
            eyebrow="Market news"
            title={<>Signal over <span className="font-serif italic text-primary">noise</span>.</>}
            subtitle="AI-summarized market news with sentiment scoring, impact tagging, and reading-time estimates."
          />
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {items.map((n) => (
              <Link key={n.head} to="/news" className="group relative overflow-hidden rounded-3xl border-sheen glass p-6 transition hover:-translate-y-1">
                <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative flex items-center justify-between font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Newspaper className="h-3 w-3 text-primary" /> {n.cat}</span>
                  <span>{n.read}</span>
                </div>
                <h3 className="relative mt-4 font-display text-lg font-semibold leading-snug tracking-tight">{n.head}</h3>
                <div className="relative mt-6 flex items-center justify-between">
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                    n.tone === "up" ? "bg-emerald-500/10 text-emerald-400"
                      : n.tone === "down" ? "bg-red-500/10 text-red-400"
                      : "bg-white/5 text-muted-foreground")}>
                    <Sparkles className="h-2.5 w-2.5" /> {n.tone === "up" ? "Bullish" : n.tone === "down" ? "Bearish" : "Neutral"}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   FAQ
============================================================ */
export function StocksFaq() {
  const faqs = [
    { q: "How often are stock prices updated?", a: "Live quotes auto-refresh every 60 seconds. Manual refresh is available on every list. Historical charts pull EOD data from our providers." },
    { q: "Which markets are covered?", a: "India (Nifty 50 + BSE), US (large & mid caps), and a curated Global blend covering FX, commodities, and crypto benchmarks." },
    { q: "What is Calculyx AI stock analysis?", a: "For any ticker we generate an AI-powered bull / bear thesis, financial health scorecard, technical trend read, valuation view, and long-term outlook — with confidence scoring." },
    { q: "Are the numbers advice?", a: "No. Every calculator, chart, and AI reply is informational. Verify with your broker or a qualified advisor before making financial decisions." },
    { q: "Can I export analysis?", a: "Yes. Every stock and portfolio report is exportable as a branded PDF and Excel with one click." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <SectionHeader
            eyebrow="Frequently asked"
            title={<>Straight <span className="font-serif italic text-primary">answers</span>.</>}
            subtitle="Everything you'd want to know about Calculyx AI stock intelligence."
          />
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-12 space-y-3">
            {faqs.map((f, i) => (
              <div key={f.q} className="overflow-hidden rounded-2xl border-sheen glass">
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-foreground/[0.02] dark:bg-card/30"
                >
                  <span className="font-display text-base font-semibold tracking-tight sm:text-lg">{f.q}</span>
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open === i && "rotate-180 text-primary")} />
                </button>
                {open === i && (
                  <div className="border-t border-foreground/5 dark:border-border/40 px-6 pb-5 pt-4 text-sm leading-relaxed text-muted-foreground">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   Shared header
============================================================ */
function SectionHeader({ eyebrow, title, subtitle, align = "center" }: {
  eyebrow: string; title: React.ReactNode; subtitle?: string; align?: "center" | "left";
}) {
  return (
    <div className={cn(align === "center" ? "text-center" : "text-left")}>
      <p className="font-grotesk text-[10.5px] font-semibold uppercase tracking-[0.32em] text-primary">{eyebrow}</p>
      <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
      {subtitle && <p className={cn("mt-4 text-muted-foreground", align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl")}>{subtitle}</p>}
    </div>
  );
}

/* ---------- reveal helper allowing className ---------- */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

// silence unused import warning if Reveal isn't referenced elsewhere
export const _refs = { useRef };
