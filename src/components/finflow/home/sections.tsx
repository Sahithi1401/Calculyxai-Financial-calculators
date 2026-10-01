import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight, TrendingUp, TrendingDown, LineChart, Wallet, Home, Landmark, Calculator, PieChart, BarChart3,
  Sparkles, Newspaper, Globe, ShieldCheck, Rocket, Brain, Building2, Coins, FileText, Target, Zap, Check, X,
} from "lucide-react";
import { listLiveStocks } from "@/lib/finflow/stocks.functions";
import { Marquee, AnimatedCounter, Reveal, MagneticButton } from "./primitives";
import { Aurora, GridBackdrop, MeshOrbs, ParticleField } from "./backgrounds";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ============================================================
   SECTION: Live market ticker
============================================================ */
const TICKER_STATIC = [
  { s: "NIFTY 50", v: "24,812.35", c: 0.42 },
  { s: "SENSEX", v: "81,204.11", c: 0.31 },
  { s: "NASDAQ", v: "20,341.89", c: -0.18 },
  { s: "S&P 500", v: "5,911.24", c: 0.24 },
  { s: "BTC/USD", v: "112,438", c: 1.87 },
  { s: "ETH/USD", v: "4,281.7", c: 0.93 },
  { s: "GOLD", v: "2,684.20", c: 0.55 },
  { s: "USD/INR", v: "84.12", c: -0.11 },
  { s: "AED/INR", v: "22.91", c: 0.08 },
  { s: "EUR/USD", v: "1.0837", c: -0.23 },
];

export function LiveTicker() {
  return (
    <section aria-label="Live markets" className="relative border-y border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="py-4">
        <Marquee speed={55}>
          {TICKER_STATIC.map((t) => (
            <div key={t.s} className="inline-flex items-center gap-3 whitespace-nowrap font-mono text-[13px]">
              <span className="font-semibold tracking-wide text-foreground/80">{t.s}</span>
              <span className="tabular-nums text-foreground">{t.v}</span>
              <span className={`inline-flex items-center gap-0.5 tabular-nums ${t.c >= 0 ? "text-success" : "text-destructive"}`}>
                {t.c >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {t.c >= 0 ? "+" : ""}{t.c.toFixed(2)}%
              </span>
              <span className="h-3 w-px bg-border" />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION: Trust bar
============================================================ */
export function TrustBar() {
  const items = [
    { icon: Globe, label: "India · USA · UAE" },
    { icon: ShieldCheck, label: "Enterprise-grade security" },
    { icon: Sparkles, label: "AI-powered insights" },
    { icon: LineChart, label: "Real-time market data" },
    { icon: Brain, label: "Fundamental + technical AI" },
    { icon: Rocket, label: "Built for 2026" },
  ];
  return (
    <section className="relative py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-center">
            <p className="font-grotesk text-[10.5px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
              Trusted financial intelligence
            </p>
            <h2 className="mt-3 font-display text-2xl tracking-tight sm:text-3xl">
              One <span className="font-serif italic text-primary">intelligent</span> workspace for global markets.
            </h2>
          </div>
        </Reveal>
        <div className="mt-8">
          <Marquee speed={38} className="[--gap:2rem]">
            {items.concat(items).map((it, i) => (
              <div key={i} className="inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-card/50 px-5 py-2.5 backdrop-blur-md">
                <it.icon className="h-3.5 w-3.5 text-primary" />
                <span className="font-grotesk text-xs font-medium tracking-wide text-foreground/85">{it.label}</span>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION: Why Calculyx AI (editorial split + dashboard mock)
============================================================ */
export function WhyCalculyx() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <Aurora className="opacity-60" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="font-grotesk text-[10.5px] font-medium uppercase tracking-[0.32em] text-primary">Why Calculyx AI</p>
              <h2 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
                Managing finances shouldn't require{" "}
                <span className="font-serif italic text-primary">switching</span> between ten websites.
              </h2>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                Calculyx AI unifies loans, stocks, portfolios, taxes, market intelligence, and AI insights into a single, elegant workspace — with narrative reports you can actually share.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-md">
                {[
                  { i: Home, t: "Loans & Mortgage" },
                  { i: LineChart, t: "Live Stocks" },
                  { i: Wallet, t: "Portfolio" },
                  { i: Landmark, t: "Taxes" },
                  { i: BarChart3, t: "Market Intel" },
                  { i: Sparkles, t: "AI Copilot" },
                ].map((f) => (
                  <div key={f.t} className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/50 px-3.5 py-2.5 backdrop-blur-md">
                    <f.i className="h-4 w-4 text-primary" />
                    <span className="font-grotesk text-sm">{f.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <DashboardMock />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function DashboardMock() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl" />
      <div className="relative rounded-[1.75rem] border border-border/60 bg-card/70 p-5 shadow-elegant backdrop-blur-xl">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="font-mono uppercase tracking-[0.24em] text-muted-foreground">Live · Portfolio</span>
          </div>
          <span className="font-mono text-muted-foreground">USD</span>
        </div>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="font-display text-4xl tracking-tight">$284,912</span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-success"><TrendingUp className="h-3.5 w-3.5" /> +2.14%</span>
        </div>
        <MiniChart />
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { l: "Stocks", v: "58%", c: "bg-primary" },
            { l: "MFs", v: "22%", c: "bg-[oklch(0.72_0.14_200)]" },
            { l: "Cash", v: "12%", c: "bg-[oklch(0.82_0.13_82)]" },
          ].map((x) => (
            <div key={x.l} className="rounded-lg border border-border/60 bg-background/40 p-2.5">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{x.l}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${x.c}`} />
                <span className="font-mono text-sm tabular-nums">{x.v}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Floating card */}
      <div className="absolute -bottom-6 -right-4 hidden w-56 rounded-2xl border border-border/60 bg-card/85 p-4 shadow-elegant backdrop-blur-xl sm:block animate-float">
        <div className="flex items-center gap-2 text-xs">
          <Brain className="h-3.5 w-3.5 text-primary" />
          <span className="font-grotesk uppercase tracking-[0.2em] text-muted-foreground">AI</span>
        </div>
        <p className="mt-2 text-sm leading-snug">Rebalance suggested: trim IT +4%, add pharma +3% for lower drawdown.</p>
      </div>
    </div>
  );
}

function MiniChart() {
  const pts = [8, 12, 10, 16, 14, 22, 20, 28, 24, 32, 30, 42, 38, 46];
  const max = Math.max(...pts), min = Math.min(...pts);
  const d = pts.map((y, i) => {
    const x = (i / (pts.length - 1)) * 100;
    const yy = 100 - ((y - min) / (max - min)) * 100;
    return `${i === 0 ? "M" : "L"}${x},${yy}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-4 h-24 w-full">
      <defs>
        <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(from var(--primary) l c h / 0.35)" />
          <stop offset="100%" stopColor="oklch(from var(--primary) l c h / 0)" />
        </linearGradient>
      </defs>
      <path d={`${d} L100,100 L0,100 Z`} fill="url(#fill)" />
      <path d={d} fill="none" stroke="oklch(from var(--primary) l c h / 0.9)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ============================================================
   SECTION: Our story timeline
============================================================ */
export function OurStory() {
  const steps = [
    { t: "Financial information is fragmented", d: "Users switch between 8+ apps just to see their money in one place." },
    { t: "Traditional calculators only return numbers", d: "No context, no comparison, no next step." },
    { t: "Investment analysis is complex", d: "Fundamentals, technicals, and macro rarely meet in one view." },
    { t: "Portfolio management is scattered", d: "Stocks, MFs, FDs, gold, crypto — different apps, no picture." },
    { t: "So we built the world's smartest AI Financial Intelligence Platform", d: "Every calculator, every stock, every insight — one workspace, one narrative." },
  ];
  return (
    <section className="relative py-24 sm:py-32">
      <GridBackdrop />
      <div className="relative mx-auto max-w-4xl px-6">
        <Reveal>
          <div className="text-center">
            <p className="font-grotesk text-[10.5px] font-medium uppercase tracking-[0.32em] text-primary">Why we built Calculyx AI</p>
            <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              A <span className="font-serif italic text-primary">mission</span> for smarter money.
            </h2>
          </div>
        </Reveal>
        <div className="relative mt-16">
          <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent sm:left-1/2" />
          <ol className="space-y-10">
            {steps.map((s, i) => (
              <Reveal key={s.t} delay={i * 80}>
                <li className="relative pl-10 sm:grid sm:grid-cols-2 sm:gap-10 sm:pl-0">
                  <span className="absolute left-0 top-1.5 h-6 w-6 rounded-full border border-primary/50 bg-background shadow-glow sm:left-1/2 sm:-translate-x-1/2">
                    <span className="absolute inset-1 rounded-full bg-primary" />
                  </span>
                  <div className={i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:col-start-2 sm:pl-12"}>
                    <h3 className="font-display text-xl tracking-tight">{s.t}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION: Everything you need — bento grid
============================================================ */
const BENTO: Array<{
  i: typeof Home;
  t: string;
  d: string;
  href: string;
  params?: { type: string };
  span?: string;
}> = [
  { i: Home, t: "Home Loan", d: "EMI, amortization, prepayment scenarios.", href: "/calc/$type", params: { type: "home-loan" }, span: "sm:col-span-2 sm:row-span-2" },
  { i: Landmark, t: "Mortgage", d: "US & UAE, taxes, insurance.", href: "/calculators" },
  { i: LineChart, t: "Live Stocks", d: "Top-50 India + US.", href: "/stocks" },
  { i: PieChart, t: "Portfolio Tracker", d: "Allocation & risk score.", href: "/dashboard" },
  { i: BarChart3, t: "Stock Analysis", d: "AI bull / bear cases.", href: "/stocks", span: "sm:col-span-2" },
  { i: TrendingUp, t: "Technical Indicators", d: "RSI, MACD, MA cross.", href: "/stocks" },
  { i: Calculator, t: "SIP Calculator", d: "Growth, XIRR, step-up.", href: "/calc/$type", params: { type: "sip" } },
  { i: Coins, t: "FD Calculator", d: "Compounded returns.", href: "/calc/$type", params: { type: "fd" } },
  { i: FileText, t: "Tax Calculator", d: "IN, US, UAE regimes.", href: "/calculators" },
  { i: Globe, t: "Currency Converter", d: "Live rates, 150+ pairs.", href: "/calc/$type", params: { type: "currency" } },
  { i: Building2, t: "Property Analysis", d: "Rental yield, ROI.", href: "/calc/$type", params: { type: "property" } },
  { i: Brain, t: "AI Copilot", d: "Chat with your money.", href: "/ai", span: "sm:col-span-2" },
  { i: FileText, t: "Financial Reports", d: "PDF + Excel exports.", href: "/stocks" },
  { i: Target, t: "Retirement Planning", d: "FIRE, SWP, corpus.", href: "/investing-calculators" },
  { i: Rocket, t: "Investment Planning", d: "Lumpsum, CAGR, goals.", href: "/investing-calculators" },
  { i: Wallet, t: "Wealth Dashboard", d: "Net worth at a glance.", href: "/dashboard" },
];

export function FeatureBento() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="max-w-3xl">
            <p className="font-grotesk text-[10.5px] font-medium uppercase tracking-[0.32em] text-primary">Everything you need</p>
            <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Sixteen tools. <span className="font-serif italic text-primary">One</span> intelligent workspace.
            </h2>
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {BENTO.map((b, i) => (
            <Reveal key={b.t} delay={i * 25}>
              <Link
                to={b.href as never}
                params={b.params as never}
                className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-card/80 hover:-translate-y-0.5 sm:p-5 ${b.span ?? ""}`}
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/15 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ background: "conic-gradient(from 120deg, transparent, oklch(from var(--primary) l c h / 0.25), transparent 40%)", mask: "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)", WebkitMask: "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)", WebkitMaskComposite: "xor", padding: 1 }} />
                <b.i className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                <div className="mt-6">
                  <h3 className="font-display text-lg tracking-tight">{b.t}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{b.d}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION: Market Intelligence — Top gainers/losers/active
============================================================ */
export function MarketIntelligence() {
  const { data } = useQuery({
    queryKey: ["home-live-stocks"],
    queryFn: () => listLiveStocks(),
    staleTime: 60_000,
  });
  const list = data ?? [];
  const gainers = [...list].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const losers = [...list].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  const active = [...list].slice(0, 5);
  const sectors = [
    { s: "IT", c: 1.24 }, { s: "Banking", c: 0.68 }, { s: "Pharma", c: -0.42 },
    { s: "Auto", c: 0.91 }, { s: "Energy", c: -0.31 }, { s: "FMCG", c: 0.22 },
    { s: "Metals", c: 1.75 }, { s: "Realty", c: -0.88 },
  ];
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <MeshOrbs className="opacity-40" />
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-grotesk text-[10.5px] font-medium uppercase tracking-[0.32em] text-primary">Real-time market intelligence</p>
              <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
                Markets, <span className="font-serif italic text-primary">decoded</span> live.
              </h2>
            </div>
            <Link to="/stocks" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.24em] backdrop-blur-md hover:bg-card/70">
              Open markets <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <StockPanel title="Top Gainers" items={gainers} tone="up" />
          <StockPanel title="Top Losers" items={losers} tone="down" />
          <StockPanel title="Most Active" items={active} />
        </div>
        <Reveal delay={120}>
          <div className="mt-6 rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-grotesk text-[10.5px] font-medium uppercase tracking-[0.28em] text-muted-foreground">Sector heatmap</span>
              <span className="font-mono text-[11px] text-muted-foreground">Today</span>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              {sectors.map((s) => (
                <div
                  key={s.s}
                  className="relative overflow-hidden rounded-lg border border-border/50 p-3 text-center"
                  style={{ background: `oklch(${s.c >= 0 ? "0.68 0.16 155" : "0.6 0.2 25"} / ${Math.min(Math.abs(s.c) / 2, 0.35)})` }}
                >
                  <div className="font-grotesk text-xs font-medium">{s.s}</div>
                  <div className={`mt-1 font-mono text-xs tabular-nums ${s.c >= 0 ? "text-success" : "text-destructive"}`}>
                    {s.c >= 0 ? "+" : ""}{s.c.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StockPanel({ title, items, tone }: { title: string; items: { symbol: string; name: string; price: number; changePercent: number; currency: string }[]; tone?: "up" | "down" }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg tracking-tight">{title}</h3>
        {tone === "up" && <TrendingUp className="h-4 w-4 text-success" />}
        {tone === "down" && <TrendingDown className="h-4 w-4 text-destructive" />}
      </div>
      <ul className="space-y-2">
        {(items.length ? items : Array.from({ length: 5 }).map(() => null)).map((it, i) => (
          <li key={i} className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-background/30 px-3 py-2">
            {it ? (
              <>
                <div className="min-w-0">
                  <div className="truncate font-mono text-sm font-medium">{it.symbol.replace(/\.NS|\.BO/, "")}</div>
                  <div className="truncate text-[11px] text-muted-foreground">{it.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm tabular-nums">{it.currency === "INR" ? "₹" : "$"}{it.price.toFixed(2)}</div>
                  <div className={`font-mono text-[11px] tabular-nums ${it.changePercent >= 0 ? "text-success" : "text-destructive"}`}>
                    {it.changePercent >= 0 ? "+" : ""}{it.changePercent.toFixed(2)}%
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="h-8 w-24 rounded animate-shimmer" />
                <div className="h-8 w-14 rounded animate-shimmer" />
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================
   SECTION: Stock analysis platform
============================================================ */
export function StockAnalysisSection() {
  const chips = ["Fundamentals", "Valuation", "Technicals", "Risk", "Sector", "Peers", "News", "AI Summary"];
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="font-grotesk text-[10.5px] font-medium uppercase tracking-[0.32em] text-primary">Stock analysis platform</p>
              <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl md:text-6xl">
                Not a screener. A <span className="font-serif italic text-primary">research analyst</span> in your browser.
              </h2>
              <p className="mt-6 max-w-xl text-muted-foreground">
                Every stock page ships with ratios, valuation, technicals, risk, sector comparison, news, and an AI summary — plus PDF & Excel reports you can share in one click.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <span key={c} className="rounded-full border border-border/60 bg-card/50 px-3 py-1.5 font-grotesk text-xs backdrop-blur-md">{c}</span>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <AnalystMock />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function AnalystMock() {
  return (
    <div className="relative rounded-[1.75rem] border border-border/60 bg-card/70 p-5 shadow-elegant backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">NSE · TCS</div>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="font-display text-3xl tracking-tight">₹4,182.30</span>
            <span className="text-sm font-medium text-success">+1.24%</span>
          </div>
        </div>
        <span className="rounded-full border border-success/40 bg-success/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-success">AI: Bullish</span>
      </div>
      <MiniChart />
      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
        {[
          { l: "P/E", v: "28.4" },
          { l: "ROE", v: "51%" },
          { l: "D/E", v: "0.09" },
          { l: "Div", v: "1.8%" },
        ].map((k) => (
          <div key={k.l} className="rounded-lg border border-border/50 bg-background/40 p-2.5">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{k.l}</div>
            <div className="mt-0.5 font-mono text-sm tabular-nums">{k.v}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-3">
        <div className="flex items-center gap-2 text-xs">
          <Brain className="h-3.5 w-3.5 text-primary" />
          <span className="font-grotesk uppercase tracking-[0.2em] text-primary">AI Summary</span>
        </div>
        <p className="mt-1.5 text-sm leading-snug">Strong ROE and dividend discipline; watch USD headwinds in Q3. Fair value ~ ₹4,450.</p>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION: Portfolio Intelligence
============================================================ */
export function PortfolioIntelligence() {
  const alloc = [
    { l: "Stocks", v: 58, c: "oklch(0.68 0.18 262)" },
    { l: "Mutual Funds", v: 22, c: "oklch(0.72 0.14 200)" },
    { l: "Gold / Crypto", v: 8, c: "oklch(0.82 0.13 82)" },
    { l: "Cash / FD", v: 12, c: "oklch(0.62 0.12 155)" },
  ];
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <Aurora className="opacity-50" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <Donut alloc={alloc} />
          </Reveal>
          <Reveal delay={100}>
            <div>
              <p className="font-grotesk text-[10.5px] font-medium uppercase tracking-[0.32em] text-primary">Portfolio intelligence</p>
              <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
                Your net worth, <span className="font-serif italic text-primary">alive</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">Track value, gain, diversification, sector allocation and portfolio health — with AI recommendations that read like an advisor's memo.</p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  { l: "Portfolio value", v: 284912, prefix: "$" },
                  { l: "Today's gain", v: 6120, prefix: "+$" },
                  { l: "Diversification", v: 82, suffix: "/100" },
                  { l: "Expected CAGR", v: 14, suffix: "%" },
                ].map((k) => (
                  <div key={k.l} className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
                    <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{k.l}</div>
                    <div className="mt-1.5 font-display text-2xl tracking-tight">
                      <AnimatedCounter value={k.v} prefix={k.prefix ?? ""} suffix={k.suffix ?? ""} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Donut({ alloc }: { alloc: { l: string; v: number; c: string }[] }) {
  const total = alloc.reduce((s, a) => s + a.v, 0);
  let acc = 0;
  const r = 42, C = 2 * Math.PI * r;
  return (
    <div className="relative mx-auto flex max-w-md items-center justify-center">
      <div className="pointer-events-none absolute inset-0 rounded-full bg-primary/10 blur-3xl" />
      <svg viewBox="0 0 100 100" className="relative h-72 w-72 -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="oklch(from var(--foreground) l c h / 0.08)" strokeWidth="12" />
        {alloc.map((a) => {
          const dash = (a.v / total) * C;
          const offset = -((acc / total) * C);
          acc += a.v;
          return (
            <circle key={a.l} cx="50" cy="50" r={r} fill="none" stroke={a.c} strokeWidth="12"
              strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={offset} strokeLinecap="butt" />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-grotesk text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Allocation</span>
        <span className="mt-1 font-display text-3xl tracking-tight">Healthy</span>
        <span className="mt-0.5 text-sm text-success">Risk: Moderate</span>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION: AI Copilot conversation
============================================================ */
export function AiCopilotSection() {
  return (
    <section className="relative py-24 sm:py-32">
      <GridBackdrop />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="font-grotesk text-[10.5px] font-medium uppercase tracking-[0.32em] text-primary">AI Financial Intelligence</p>
              <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl md:text-6xl">
                Chat with a <span className="font-serif italic text-primary">copilot</span> that reads your portfolio.
              </h2>
              <p className="mt-6 max-w-xl text-muted-foreground">
                Ask "should I buy this stock?" and get a full memo — fundamentals, valuation, risk, sector context, portfolio impact, and a clear recommendation.
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                {["Grounded in live prices & filings", "Country-aware for IN / US / UAE", "Portfolio-aware recommendations", "Every answer exports to PDF"].map((x) => (
                  <li key={x} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> <span>{x}</span></li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <ChatMock />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ChatMock() {
  const bubbles = [
    { who: "u", t: "Should I buy TCS at ₹4,180?" },
    { who: "ai", t: "Fundamentals: ROE 51%, D/E 0.09 — best-in-class." },
    { who: "ai", t: "Valuation: P/E 28.4 vs sector median 26 — slight premium." },
    { who: "ai", t: "Risk: 62% USD revenue — INR strengthening is a headwind." },
    { who: "ai", t: "Portfolio impact: adds 3.4% to IT weight (now 22%). Fine." },
    { who: "ai", t: "→ Accumulate on dips below ₹4,050. Not aggressive at ₹4,180." },
  ];
  return (
    <div className="relative rounded-[1.75rem] border border-border/60 bg-card/70 p-5 shadow-elegant backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-border/50 pb-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-primary"><Brain className="h-4 w-4" /></span>
        <div>
          <div className="font-display text-sm">Calculyx AI</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Copilot · online</div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {bubbles.map((b, i) => (
          <motion.div
            key={i}
            initial={{ y: 8, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: i * 0.12 }}
            className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-snug ${b.who === "u" ? "ml-auto bg-primary text-primary-foreground" : "bg-background/60 border border-border/50"}`}
          >
            {b.t}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SECTION: Dashboard showcase
============================================================ */
export function DashboardShowcase() {
  const widgets = [
    { l: "Net Worth", v: 284912, p: "$" },
    { l: "Investments", v: 194200, p: "$" },
    { l: "Loans", v: 42800, p: "-$" },
    { l: "Stocks", v: 168400, p: "$" },
    { l: "Mutual Funds", v: 42600, p: "$" },
    { l: "Cash", v: 32600, p: "$" },
    { l: "Taxes YTD", v: 18240, p: "$" },
    { l: "FX Exposure", v: 62, s: "%" },
    { l: "Goals on-track", v: 4, s: "/5" },
  ];
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="max-w-3xl">
            <p className="font-grotesk text-[10.5px] font-medium uppercase tracking-[0.32em] text-primary">Financial dashboard</p>
            <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl md:text-6xl">
              A Bloomberg-grade view of <span className="font-serif italic text-primary">everything you own</span>.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
            {widgets.map((w, i) => (
              <div key={w.l} className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md">
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{w.l}</div>
                <div className="mt-2 font-display text-3xl tracking-tight">
                  <AnimatedCounter value={w.v} prefix={w.p ?? ""} suffix={w.s ?? ""} />
                </div>
                <div className="mt-3 h-8">
                  <MiniLine seed={i + 1} />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MiniLine({ seed = 1 }: { seed?: number }) {
  // Deterministic PRNG so SSR and client render the same path (avoids hydration mismatch).
  let s = seed || 1;
  const rand = () => { s = (s * 1664525 + 1013904223) % 2 ** 32; return s / 2 ** 32; };
  const pts = Array.from({ length: 20 }, () => rand() * 30 + 10);
  const d = pts.map((y, i) => `${i === 0 ? "M" : "L"}${(i / (pts.length - 1)) * 100},${50 - y}`).join(" ");
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-full w-full">
      <path d={d} fill="none" stroke="oklch(from var(--primary) l c h / 0.8)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}


/* ============================================================
   SECTION: How it works
============================================================ */
export function HowItWorks() {
  const steps = [
    { i: Target, t: "Choose Tool", d: "Pick a calculator, stock, or dashboard." },
    { i: Calculator, t: "Enter Data", d: "Or auto-pull from live prices." },
    { i: Brain, t: "AI Analysis", d: "Fundamentals, risk, and next steps." },
    { i: FileText, t: "Professional Report", d: "PDF & Excel, one click." },
  ];
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-center">
            <p className="font-grotesk text-[10.5px] font-medium uppercase tracking-[0.32em] text-primary">How it works</p>
            <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">Four steps to <span className="font-serif italic text-primary">clarity</span>.</h2>
          </div>
        </Reveal>
        <div className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block" />
          {steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 100}>
              <div className="relative flex flex-col items-center text-center">
                <div className="relative grid h-16 w-16 place-items-center rounded-2xl border border-primary/40 bg-card/70 shadow-glow backdrop-blur-md">
                  <s.i className="h-6 w-6 text-primary" />
                  <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-primary font-mono text-[10px] font-bold text-primary-foreground">{i + 1}</span>
                </div>
                <h3 className="mt-4 font-display text-lg tracking-tight">{s.t}</h3>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION: Comparison table
============================================================ */
const COMPARISON = [
  "AI Insights", "Portfolio Analysis", "Stock Intelligence", "Real-time Market Data",
  "Investment Planning", "Technical Indicators", "Fundamental Analysis",
  "Professional Reports", "AI Recommendations", "Financial Dashboard",
];
export function ComparisonTable() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="text-center">
            <p className="font-grotesk text-[10.5px] font-medium uppercase tracking-[0.32em] text-primary">Why choose Calculyx AI</p>
            <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
              A calculator won't <span className="font-serif italic text-primary">think</span>. We do.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md">
            <div className="grid grid-cols-3 border-b border-border/60 bg-background/30">
              <div className="p-4 font-grotesk text-xs uppercase tracking-[0.24em] text-muted-foreground">Feature</div>
              <div className="p-4 text-center font-display text-sm">Traditional Calculator</div>
              <div className="p-4 text-center font-display text-sm text-gradient">Calculyx AI</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={row} className={`grid grid-cols-3 items-center ${i % 2 ? "bg-background/20" : ""}`}>
                <div className="p-4 text-sm">{row}</div>
                <div className="p-4 text-center"><X className="mx-auto h-4 w-4 text-muted-foreground/60" /></div>
                <div className="p-4 text-center"><Check className="mx-auto h-4 w-4 text-success" /></div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION: Stats
============================================================ */
export function StatsCounters() {
  const stats = [
    { v: 100, s: "+", l: "Financial calculations" },
    { v: 25, s: "+", l: "Financial tools" },
    { v: 1000, s: "+", l: "Stocks supported" },
    { v: 3, s: "", l: "Countries" },
    { v: 24, s: "/7", l: "Market intelligence" },
  ];
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-4 rounded-3xl border border-border/60 bg-card/60 p-8 backdrop-blur-md sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((st) => (
            <div key={st.l} className="text-center">
              <div className="font-display text-4xl tracking-tight text-gradient sm:text-5xl">
                <AnimatedCounter value={st.v} suffix={st.s} />
              </div>
              <div className="mt-2 font-grotesk text-xs uppercase tracking-[0.2em] text-muted-foreground">{st.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION: FAQ (15 SEO-focused Q&As)
============================================================ */
import { HOME_FAQS } from "@/lib/finflow/faq-data";

export const FAQS = [
  { q: "What is Calculyx AI?", a: "Calculyx AI is an AI-powered financial intelligence platform that combines live stock data, portfolio tracking, 15+ investing calculators, tax and loan tools, and AI insights into one workspace for India, USA, and UAE users." },
  { q: "Which stock markets are supported?", a: "We cover the NSE Top-50 (India) and US Top-50 (NASDAQ + NYSE) with live prices, fundamentals, technicals, and AI bull/bear cases. More markets are on the roadmap." },
  { q: "Is Calculyx AI free to use?", a: "Yes. Core calculators, live stocks, portfolio tracking, and AI insights are free. Premium features and higher AI usage are available on paid plans." },
  { q: "How accurate is the AI stock analysis?", a: "Our AI grounds every response in live prices, fundamentals, and public filings. It's a research assistant, not investment advice — always verify before trading." },
  { q: "Can I track my portfolio across stocks, mutual funds, and gold?", a: "Yes. The portfolio tracker supports stocks, ETFs, mutual funds, gold, crypto, FDs, bonds, EPF, PPF, and NPS with live valuations and allocation analytics." },
  { q: "Does Calculyx AI support Indian income tax calculation?", a: "Yes. Our tax calculator supports the Indian new and old regimes, US federal + state basics, and UAE VAT / salary calculations." },
  { q: "Which calculators are available?", a: "SIP, Lumpsum, CAGR, Dividend, Brokerage, FIRE, SWP, Goal Planner, Home Loan / Mortgage, FD, EMI, Compound Interest, Retirement, Currency Converter, Property Analysis, and Tax." },
  { q: "How is Calculyx AI different from a normal calculator?", a: "Traditional calculators return numbers. Calculyx AI returns narrative reports — assumptions, comparisons, risk, and next steps — with PDF and Excel export." },
  { q: "Can I export reports to PDF or Excel?", a: "Yes. Every stock page and calculator supports a one-click PDF report and a multi-sheet Excel workbook, including live price history." },
  { q: "Is my portfolio data private?", a: "Yes. Portfolio data is stored on encrypted infrastructure with row-level security. We never sell your data or use it to train third-party models." },
  { q: "Do you offer real-time price data?", a: "Yes. Prices are streamed from professional market data providers, updated live during market hours with graceful fallbacks after close." },
  { q: "Can I use Calculyx AI on mobile?", a: "The full platform is responsive and works on desktop, tablet, and mobile. A native app is on the roadmap." },
  { q: "Does the AI copilot understand my portfolio?", a: "Yes. When you're signed in, the AI copilot factors in your actual holdings, sector weights, and risk profile before giving recommendations." },
  { q: "Which currencies and FX pairs are supported?", a: "150+ currency pairs are supported for live conversion, including INR, USD, AED, EUR, GBP, JPY, SGD, and AUD." },
  { q: "How do I get started?", a: "Click Start Free, create an account, and you'll be inside the dashboard in under 30 seconds. No credit card required." },
];

export function FaqSection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <div className="text-center">
            <p className="font-grotesk text-[10.5px] font-medium uppercase tracking-[0.32em] text-primary">FAQ</p>
            <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">Answers, <span className="font-serif italic text-primary">upfront</span>.</h2>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <Accordion type="single" collapsible className="mt-12 space-y-2">
            {HOME_FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`i${i}`} className="rounded-xl border border-border/60 bg-card/50 px-4 backdrop-blur-md">
                <AccordionTrigger className="text-left font-display text-base tracking-tight hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-8 text-center">
            <Link
              to="/faq"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border/70 bg-card/40 px-5 font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] text-foreground/85 backdrop-blur-md transition hover:border-primary/40 hover:text-primary"
            >
              Read all 28 questions
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION: Final CTA
============================================================ */
export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <Aurora />
      <MeshOrbs className="opacity-70" />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <h2 className="font-display text-5xl leading-[0.98] tracking-tight sm:text-6xl md:text-7xl">
            Smarter financial decisions <span className="font-serif italic text-primary">start here</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Live stocks, AI insights, 25+ calculators, and a Bloomberg-grade dashboard. All in one workspace.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/auth" className="cta-glow inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.24em]">
              Start Free <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link to="/stocks" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.24em] backdrop-blur-md hover:bg-card/70">
              Explore Markets
            </Link>
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.24em] backdrop-blur-md hover:bg-card/70">
              Track Portfolio
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// avoid unused
void Tabs; void TabsContent; void TabsList; void TabsTrigger; void MagneticButton;
