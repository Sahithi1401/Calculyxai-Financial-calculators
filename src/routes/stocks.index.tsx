import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, RefreshCw, Search, FileDown, FileSpreadsheet, Brain, Activity } from "lucide-react";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/finflow/navbar";
import { Breadcrumbs } from "@/components/finflow/breadcrumbs";
import { Footer } from "@/components/finflow/footer";
import { listTopStocks, type StockQuote, META_BY_SYMBOL } from "@/lib/finflow/stocks.functions";
import { getCatalogEntry } from "@/lib/finflow/stocks-catalog";
import { exportTopStocksPdf, exportTopStocksXlsx } from "@/lib/finflow/stock-exports";
import { Flag } from "@/components/finflow/flag";
import { toast } from "sonner";
import { StickyMobileCta } from "@/components/finflow/sticky-cta";
import {
  StocksHero, MarketOverview, TopMovers, SectorHeatmap, Screener,
  CalculatorsBento, AiInsightsPreview, PortfolioTeaser, MarketNewsTeaser, StocksFaq, Sparkline,
} from "@/components/finflow/stocks/stocks-sections";

const CANONICAL = "https://calculyxai.online/stocks";

export const Route = createFileRoute("/stocks/")({
  head: () => {
    const nowIso = new Date().toISOString();
    return {
    meta: [
      { title: "Live Stock Market Today — Nifty 50 & US AI Analysis" },
      { name: "description", content: "Today's live Nifty 50 and US large-cap quotes, sector heatmap, AI stock analysis, portfolio analytics and 27 investing calculators." },
      { name: "keywords", content: "live stock market, today stock prices, real-time stocks, Nifty 50 live, US stocks live, stock screener, AI stock analysis, portfolio tracker" },
      { property: "og:title", content: "Live Stock Market Today — Nifty 50 & US AI Analysis" },
      { property: "og:description", content: "Live quotes, AI analysis, screener, sector heatmap and portfolio analytics for India, US and Global markets." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/Zcyf67suT1X8dViAUyZ1AtzEANT2/social-images/social-1784106017880-WhatsApp_Image_2026-07-11_at_13.44.35.webp" },
      { property: "og:updated_time", content: nowIso },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/Zcyf67suT1X8dViAUyZ1AtzEANT2/social-images/social-1784106017880-WhatsApp_Image_2026-07-11_at_13.44.35.webp" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://calculyxai.online" },
            { "@type": "ListItem", position: 2, name: "Stocks", item: CANONICAL },
          ],
        }),
      },
      {

        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "How often are stock prices updated?", acceptedAnswer: { "@type": "Answer", text: "Live quotes auto-refresh every 60 seconds with a manual refresh available on every list." } },
            { "@type": "Question", name: "Which markets are covered?", acceptedAnswer: { "@type": "Answer", text: "India (Nifty 50 + BSE), US large & mid caps, and a curated Global blend covering FX, commodities, and crypto benchmarks." } },
            { "@type": "Question", name: "What is Calculyx AI stock analysis?", acceptedAnswer: { "@type": "Answer", text: "AI-powered bull / bear thesis, financial health, technical trend, valuation, and long-term outlook — with confidence scoring." } },
            { "@type": "Question", name: "Can I export analysis?", acceptedAnswer: { "@type": "Answer", text: "Yes. Every stock and portfolio report exports as a branded PDF and Excel with one click." } },
          ],
        }),
      },
    ],
    };
  },
  component: StocksPage,
});

function StocksPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pb-24 md:pb-0">
        <Breadcrumbs
          items={[{ name: "Home", path: "/" }, { name: "Stocks", path: "/stocks" }]}
          className="pt-24 sm:pt-28"
        />
        <StocksHero />
        <MarketOverview />
        <LiveWatchlist />
        <TopMoversLive />
        <SectorHeatmap />
        <Screener stocks={useAllStocksSample()} />
        <AiInsightsPreview />
        <CalculatorsBento />
        <PortfolioTeaser />
        <MarketNewsTeaser />
        <StocksFaq />
      </main>
      <Footer />
      <StickyMobileCta />
    </div>
  );
}

/* ============ Live Watchlist (top-50 grid, restyled) ============ */
function LiveWatchlist() {
  const [market, setMarket] = useState<"IN" | "US" | "GLOBAL">("IN");
  const [q, setQ] = useState("");
  const query = useQuery({
    queryKey: ["top-stocks", market],
    queryFn: () => listTopStocks({ data: { market } }),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const stocks = useMemo(() => {
    const data = query.data ?? [];
    if (!q.trim()) return data;
    const t = q.toLowerCase();
    return data.filter((s) => s.symbol.toLowerCase().includes(t) || s.name.toLowerCase().includes(t));
  }, [query.data, q]);

  return (
    <section id="watchlist" className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-6">
          <div>
            <p className="font-grotesk text-[10px] font-semibold uppercase tracking-[0.28em] text-primary sm:text-[10.5px] sm:tracking-[0.32em]">Live watchlist</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Top 50 live <span className="font-serif italic text-primary">stocks</span>.
            </h2>
            <p className="mt-3 max-w-xl text-[14px] text-muted-foreground sm:text-base">
              Real-time quotes across India, the US, and a Global blend. Click any stock for full AI analysis, financials, and calculators.
            </p>
          </div>


          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-full border border-border/60 bg-card/40 p-1">
              {(["IN", "US", "GLOBAL"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setMarket(r)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${market === r ? "bg-primary text-primary-foreground shadow-elegant" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Flag code={r} size={12} className="shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.15)]" />
                  {r === "IN" ? "India 50" : r === "US" ? "US 50" : "Global 50"}
                </button>
              ))}
            </div>
            <button
              onClick={() => query.refetch()}
              disabled={query.isFetching}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-2 text-xs hover:bg-card/70 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${query.isFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search symbol or name…"
              className="h-10 w-full rounded-full border border-border/60 bg-card/40 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            onClick={() => {
              if (!stocks.length) { toast.error("No stocks loaded yet"); return; }
              void exportTopStocksPdf(stocks, market === "IN" ? "India" : market === "US" ? "US" : "Global");
              toast.success("PDF downloaded");
            }}
            aria-label="Export watchlist as PDF"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-primary/40 bg-gradient-to-b from-primary/25 via-primary/15 to-primary/10 px-4 py-2 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-primary shadow-[0_1px_0_oklch(from_var(--primary)_l_c_h/0.4)_inset,0_8px_24px_-12px_oklch(from_var(--primary)_l_c_h/0.55)] transition hover:from-primary/35 hover:via-primary/25 hover:to-primary/15 hover:shadow-[0_1px_0_oklch(from_var(--primary)_l_c_h/0.55)_inset,0_10px_28px_-10px_oklch(from_var(--primary)_l_c_h/0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <span aria-hidden className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition group-hover:opacity-100" />
            <FileDown className="h-3.5 w-3.5" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => {
              if (!stocks.length) { toast.error("No stocks loaded yet"); return; }
              exportTopStocksXlsx(stocks, market === "IN" ? "India" : market === "US" ? "US" : "Global");
              toast.success("Excel downloaded");
            }}
            aria-label="Export watchlist as Excel"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-emerald-500/40 bg-gradient-to-b from-emerald-500/25 via-emerald-500/15 to-emerald-500/10 px-4 py-2 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-emerald-300 dark:text-emerald-300 shadow-[0_1px_0_rgb(52_211_153_/_0.4)_inset,0_8px_24px_-12px_rgb(16_185_129_/_0.55)] transition hover:from-emerald-500/35 hover:via-emerald-500/25 hover:to-emerald-500/15 hover:shadow-[0_1px_0_rgb(52_211_153_/_0.55)_inset,0_10px_28px_-10px_rgb(16_185_129_/_0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
          >
            <span aria-hidden className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition group-hover:opacity-100" />
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Export Excel</span>
          </button>
          <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground flex items-center gap-1">
            <Activity className="h-3 w-3 text-primary" /> Auto-refresh · 60s
          </span>
        </div>

        {query.isLoading && <div className="mt-10 text-center text-sm text-muted-foreground">Loading live quotes…</div>}
        {query.isError && (
          <div className="mt-10 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            Failed to load live quotes. Please try again.
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stocks.map((s, i) => (
            <StockCard key={s.symbol} stock={s} index={i} />
          ))}
        </div>

        {!query.isLoading && stocks.length === 0 && (
          <div className="mt-10 text-center text-sm text-muted-foreground">No stocks match your filters.</div>
        )}
      </div>
    </section>
  );
}

/* Live movers derived from IN top 50 */
function TopMoversLive() {
  const query = useQuery({
    queryKey: ["top-stocks", "IN"],
    queryFn: () => listTopStocks({ data: { market: "IN" } }),
    staleTime: 30_000,
  });
  return <TopMovers stocks={query.data ?? []} />;
}

/* Sample universe for screener — pulls all three markets */
function useAllStocksSample(): StockQuote[] {
  const inQ = useQuery({ queryKey: ["top-stocks", "IN"], queryFn: () => listTopStocks({ data: { market: "IN" } }), staleTime: 60_000 });
  const usQ = useQuery({ queryKey: ["top-stocks", "US"], queryFn: () => listTopStocks({ data: { market: "US" } }), staleTime: 60_000 });
  return useMemo(() => [...(inQ.data ?? []), ...(usQ.data ?? [])], [inQ.data, usQ.data]);
}

/* -------- Stock Card (premium restyle, with sparkline) -------- */
function StockCard({ stock, index }: { stock: StockQuote; index: number }) {
  const meta = META_BY_SYMBOL[stock.symbol];
  const assumedReturn = meta?.assumedReturn ?? 12;
  const up = stock.change >= 0;
  const fmt = (v: number) =>
    stock.currency === "INR"
      ? `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
      : `$${v.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.02, 0.4) }}
      className="group relative overflow-hidden rounded-2xl border-sheen glass p-5 transition-all duration-500 hover:-translate-y-1"
    >
      <div aria-hidden className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${up ? "bg-emerald-400/25" : "bg-red-500/25"}`} />

      <div className="relative">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <StockLogo symbol={stock.symbol} name={stock.name} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider text-muted-foreground">
                <Flag code={stock.region === "US" ? "US" : "IN"} size={10} className="shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.18)]" />
                {stock.symbol.replace(/\.(NS|BO)$/, "")}
              </div>
              <div className="mt-0.5 truncate font-display text-base font-semibold tracking-tight">{stock.name}</div>
            </div>
          </div>
          <div
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              up ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
            }`}
          >
            {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {stock.changePercent.toFixed(2)}%
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <div className="font-mono text-2xl font-semibold tabular-nums">{fmt(stock.price)}</div>
            <div className={`font-mono text-[11px] tabular-nums ${up ? "text-emerald-400" : "text-red-400"}`}>
              {up ? "+" : ""}{fmt(stock.change)} today
            </div>
          </div>
          <div className="h-10 w-24 shrink-0"><Sparkline seed={hash(stock.symbol)} up={up} /></div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <MiniStat label="Open" value={fmt(stock.open)} />
          <MiniStat label="Prev close" value={fmt(stock.prevClose)} />
          <MiniStat label="Day high" value={fmt(stock.high)} />
          <MiniStat label="Day low" value={fmt(stock.low)} />
        </div>

        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Assumed long-run return
          </div>
          <div className="mt-0.5 font-mono text-sm font-semibold text-primary">{assumedReturn}% p.a.</div>
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            to="/stocks/$symbol"
            params={{ symbol: stock.symbol }}
            search={{} as never}
            className="group relative flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-primary to-primary/85 px-4 py-2.5 text-xs font-semibold text-primary-foreground border border-primary/50 shadow-[0_1px_0_0_hsl(var(--primary-foreground)/0.25)_inset,0_10px_28px_-12px_hsl(var(--primary)/0.75)] transition-all duration-200 ease-out hover:shadow-[0_1px_0_0_hsl(var(--primary-foreground)/0.3)_inset,0_16px_38px_-14px_hsl(var(--primary)/0.95)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Brain className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
            <span className="tracking-wide">AI analysis</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            to="/calc/$type"
            params={{ type: "sip" }}
            search={{ symbol: stock.symbol, rate: assumedReturn } as never}
            className="group inline-flex items-center justify-center rounded-full border border-border/70 bg-card/50 px-4 py-2.5 text-xs font-semibold text-foreground backdrop-blur-sm transition-all duration-200 ease-out hover:bg-card/80 hover:border-primary/40 hover:text-primary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            title="Use in SIP calculator"
          >
            <span className="tracking-wide">SIP</span>
          </Link>
        </div>

      </div>
    </motion.div>
  );
}

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h) || 1;
}

/* Logo (unchanged) */
function StockLogo({ symbol, name }: { symbol: string; name: string }) {
  const token = import.meta.env.VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY as string | undefined;
  const [stage, setStage] = useState<"primary" | "fallback" | "initials">("primary");
  const upper = symbol.toUpperCase();
  const ticker = upper.replace(/\.(NS|BO)$/i, "");
  const domain = getCatalogEntry(upper)?.logoDomain;
  const initials = name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

  const primary = domain
    ? `https://img.logo.dev/${domain}?token=${token}&size=80&format=png&fallback=404`
    : `https://img.logo.dev/ticker/${encodeURIComponent(ticker)}?token=${token}&size=80&format=png&fallback=404`;
  const fallback = domain
    ? `https://img.logo.dev/ticker/${encodeURIComponent(ticker)}?token=${token}&size=80&format=png&fallback=404`
    : null;

  if (!token || stage === "initials") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-card/60 font-mono text-xs font-semibold text-foreground/80">
        {initials || ticker.slice(0, 2)}
      </div>
    );
  }

  const src = stage === "primary" ? primary : (fallback ?? primary);
  return (
    <img
      key={src}
      src={src}
      alt={`${name} stock logo`}
      width={40}
      height={40}
      loading="lazy"
      onError={() => setStage((s) => (s === "primary" && fallback ? "fallback" : "initials"))}
      className="h-10 w-10 shrink-0 rounded-lg border border-border/60 bg-white object-contain p-0.5"
    />
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-card/30 px-2 py-1.5">
      <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-mono text-xs tabular-nums text-foreground/90">{value}</div>
    </div>
  );
}
