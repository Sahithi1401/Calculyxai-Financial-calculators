import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Sparkles, TrendingUp, TrendingDown, ShieldCheck, AlertTriangle, Newspaper, LineChart as LineIcon, Calculator, FileDown, FileSpreadsheet, Zap, Brain } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell } from "recharts";
import { toast } from "sonner";
import { Navbar } from "@/components/finflow/navbar";
import { Footer } from "@/components/finflow/footer";
import { getStockDetail, getStockCandles, getStockNews, getAnalystRatings, getEarnings } from "@/lib/finflow/stock-detail.functions";
import { IntelligencePanel } from "@/components/finflow/stocks/intelligence-panel";
import { AnalystBriefPanel } from "@/components/finflow/stocks/analyst-brief-panel";
import { getStockAiInsights } from "@/lib/finflow/stock-ai.functions";
import { getStockPrediction } from "@/lib/finflow/stock-prediction.functions";
import { getCatalogEntry } from "@/lib/finflow/stocks-catalog";
import { sip, lumpsum, profitLoss, dividend, stockAverage, positionSize, calcBrokerage, BROKERS_IN, BROKERS_US, type BrokerId } from "@/lib/finflow/investing-calcs";
import { SITE } from "@/lib/seo";
import { exportStockPdf, exportStockXlsx, runAll15, exportAll15Pdf, exportAll15Xlsx, exportPredictionPdf } from "@/lib/finflow/stock-exports";

export const Route = createFileRoute("/stocks/$symbol")({
  validateSearch: (search: Record<string, unknown>): { ai?: "report" } =>
    search.ai === "report" ? { ai: "report" } : {},
  head: ({ params }) => {
    const cat = getCatalogEntry(params.symbol);
    const name = cat?.name ?? params.symbol;
    const sym = params.symbol.toUpperCase();
    const url = `https://calculyxai.online/stocks/${sym}`;
    const nowIso = new Date().toISOString();
    const title = `${name} (${sym}) — Live Price & AI Analysis Today`;
    const desc = `Track today's live ${sym} share price with an AI bull and bear thesis, financial-health scoring, latest news and 15 investing calculators for ${name}.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:updated_time", content: nowIso },
        { property: "article:modified_time", content: nowIso },
        { property: "og:site_name", content: SITE.name },
        { property: "og:image", content: SITE.ogImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: SITE.ogImage },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            name: `${name} (${sym})`,
            identifier: sym,
            category: cat?.sector ?? "Equity",
            provider: { "@type": "Organization", name: "Calculyx AI", url: "https://calculyxai.online" },
            url,
            dateModified: nowIso,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: `${name} (${sym}) live quote`,
            description: `Real-time quote, fundamentals and AI analysis for ${name} (${sym}).`,
            url,
            dateModified: nowIso,
            variableMeasured: ["Last price", "Change", "Volume", "Market cap"],
            creator: { "@type": "Organization", name: "Calculyx AI", url: "https://calculyxai.online" },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://calculyxai.online/" },
              { "@type": "ListItem", position: 2, name: "Stocks", item: "https://calculyxai.online/stocks" },
              { "@type": "ListItem", position: 3, name: `${name} (${sym})`, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: StockDetailPage,
});

function StockDetailPage() {
  const { symbol } = Route.useParams();
  const upperSymbol = symbol.toUpperCase();

  const detail = useQuery({
    queryKey: ["stock-detail", upperSymbol],
    queryFn: () => getStockDetail({ data: { symbol: upperSymbol } }),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const [range, setRange] = useState<"1M" | "6M" | "1Y" | "5Y">("1Y");
  const candles = useQuery({
    queryKey: ["stock-candles", upperSymbol, range],
    queryFn: () => getStockCandles({ data: { symbol: upperSymbol, range } }),
    staleTime: 5 * 60_000,
  });

  const news = useQuery({
    queryKey: ["stock-news", upperSymbol],
    queryFn: () => getStockNews({ data: { symbol: upperSymbol } }),
    staleTime: 30 * 60_000,
  });

  const analyst = useQuery({
    queryKey: ["stock-analyst", upperSymbol],
    queryFn: () => getAnalystRatings({ data: { symbol: upperSymbol } }),
    staleTime: 6 * 60 * 60_000,
  });

  const earnings = useQuery({
    queryKey: ["stock-earnings", upperSymbol],
    queryFn: () => getEarnings({ data: { symbol: upperSymbol } }),
    staleTime: 6 * 60 * 60_000,
  });

  const ai = useQuery({
    enabled: !!detail.data && (detail.data.price ?? 0) > 0,
    queryKey: ["stock-ai", upperSymbol, detail.data?.pe, detail.data?.roe],
    queryFn: () => getStockAiInsights({
      data: {
        symbol: upperSymbol,
        name: detail.data!.name,
        sector: detail.data!.sector,
        price: detail.data!.price,
        pe: detail.data!.pe,
        roe: detail.data!.roe,
      },
    }),
    staleTime: 6 * 60 * 60_000,
  });

  const d = detail.data;
  const up = (d?.change ?? 0) >= 0;
  const currency = d?.currency ?? "USD";
  const fmt = (v?: number) => v == null ? "—" : currency === "INR"
    ? `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
    : `$${v.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  const fmtBig = (v?: number) => {
    if (v == null) return "—";
    if (currency === "INR") {
      if (v >= 1e7) return `₹${(v / 1e7).toFixed(2)} Cr`;
      if (v >= 1e5) return `₹${(v / 1e5).toFixed(2)} L`;
      return `₹${v.toLocaleString("en-IN")}`;
    }
    if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
    if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
    if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
    return `$${v.toLocaleString("en-US")}`;
  };

  const handleAiAnalysis = useCallback(async () => {
    if (!d) return;
    const closes = candles.data?.candles?.map((c) => c.c).filter((n) => Number.isFinite(n) && n > 0) ?? [];
    if (closes.length < 10) {
      toast.error("Not enough price history to run the AI prediction. Load the 1Y chart first.");
      return;
    }
    try {
      toast.loading("Generating Groq AI analysis…", { id: "ai-report" });
      const prediction = await getStockPrediction({
        data: {
          symbol: upperSymbol,
          name: d.name,
          sector: d.sector,
          currency: d.currency,
          price: d.price,
          pe: d.pe,
          roe: d.roe,
          divYield: d.divYield,
          weekHigh52: d.weekHigh52,
          weekLow52: d.weekLow52,
          closes,
        },
      });
      await exportPredictionPdf({
        symbol: upperSymbol,
        name: d.name,
        currency: d.currency,
        price: d.price,
        region: d.region,
        sector: d.sector,
        prediction,
      });
      toast.success("AI analysis report downloaded", { id: "ai-report" });
    } catch (e) {
      console.error(e);
      toast.error("AI analysis failed. Please try again.", { id: "ai-report" });
    }
  }, [candles.data?.candles, d, upperSymbol]);


  return (
    <div className="bg-page-gradient min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <Link to="/stocks" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to live stocks
          </Link>

          {/* HEADER */}
          <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6 rounded-3xl border border-border/60 bg-card/30 p-6 sm:flex sm:flex-wrap sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <LogoBox symbol={upperSymbol} name={d?.name ?? upperSymbol} domain={d?.logoDomain} />
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {d?.region === "IN" ? "🇮🇳 NSE" : "🇺🇸 US"} · {d?.sector ?? "—"} · {upperSymbol}
                </div>
                <h1 className="mt-1 truncate font-display text-2xl font-semibold tracking-tight sm:text-4xl">
                  {d?.name ?? upperSymbol}
                </h1>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-3xl font-semibold tabular-nums">
                {detail.isLoading ? "…" : fmt(d?.price)}
              </div>
              <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${up ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {up ? "+" : ""}{fmt(d?.change)} · {(d?.changePercent ?? 0).toFixed(2)}%
              </div>
            </div>
          </div>

          <IntelligencePanel symbol={upperSymbol} />
          <AnalystBriefPanel symbol={upperSymbol} />



          {d && d.price === 0 && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <div className="font-semibold">Live data temporarily unavailable for {upperSymbol}</div>
                <div className="mt-0.5 text-xs text-amber-200/80">Our upstream market-data provider didn't return a quote for this ticker just now. Prices, chart, and AI analysis will populate as soon as the feed recovers — refresh in a minute or try another symbol from the <Link to="/stocks" className="underline">live stocks list</Link>.</div>
              </div>
            </div>
          )}

          {/* ACTION TOOLBAR */}
          <StockActions
            disabled={!d || d.price === 0}
            onExportPdf={() => d && exportStockPdf({ detail: d, candles: candles.data?.candles, news: news.data, analyst: analyst.data, earnings: earnings.data })}
            onExportXlsx={() => d && exportStockXlsx({ detail: d, candles: candles.data?.candles, news: news.data, analyst: analyst.data, earnings: earnings.data })}
            onAnalyzeAll={() => {
              if (!d) return;
              const meta = {
                symbol: upperSymbol,
                name: d.name,
                currency: d.currency,
                price: d.price,
                assumedReturn: getCatalogEntry(upperSymbol)?.assumedReturn ?? 12,
                divYield: d.divYield,
                isIndian: d.region === "IN",
              };
              const bundle = runAll15(meta);
              exportAll15Pdf(bundle);
              exportAll15Xlsx(bundle);
            }}
            onAiReport={handleAiAnalysis}
            calculatorLink={{ pathname: "/investing-calculators", search: { c: "sip", symbol: upperSymbol } }}
          />



          {/* QUICK STATS */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            <QuickStat label="Open" value={fmt(d?.open)} />
            <QuickStat label="Prev close" value={fmt(d?.prevClose)} />
            <QuickStat label="Day high" value={fmt(d?.high)} />
            <QuickStat label="Day low" value={fmt(d?.low)} />
            <QuickStat label="52w high" value={fmt(d?.weekHigh52)} />
            <QuickStat label="52w low" value={fmt(d?.weekLow52)} />
            <QuickStat label="P/E" value={d?.pe ? d.pe.toFixed(1) : "—"} />
            <QuickStat label="Market cap" value={fmtBig(d?.marketCap)} />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* CHART + AI */}
            <div className="lg:col-span-2 space-y-6">
              <Section icon={<LineIcon className="h-4 w-4" />} title="Price chart">
                <div className="mb-3 flex gap-1">
                  {(["1M", "6M", "1Y", "5Y"] as const).map((r) => (
                    <button key={r} onClick={() => setRange(r)}
                      className={`rounded-full px-3 py-1 text-xs font-mono ${range === r ? "bg-primary text-primary-foreground" : "border border-border/60 bg-card/30 hover:bg-card/60"}`}>
                      {r}
                    </button>
                  ))}
                </div>
                <div className="h-64 w-full">
                  {candles.isLoading ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading chart…</div>
                  ) : (candles.data?.candles.length ?? 0) === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Chart data unavailable for this ticker.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={candles.data!.candles}>
                        <defs>
                          <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis dataKey="t" tickFormatter={(t) => new Date(t).toLocaleDateString(undefined, { month: "short", day: range === "5Y" ? undefined : "numeric", year: range === "5Y" ? "2-digit" : undefined })}
                          stroke="rgba(255,255,255,0.4)" fontSize={10} />
                        <YAxis domain={["auto", "auto"]} stroke="rgba(255,255,255,0.4)" fontSize={10} tickFormatter={(v) => currency === "INR" ? `₹${v}` : `$${v}`} />
                        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                          labelFormatter={(t) => new Date(t as number).toLocaleDateString()} formatter={(v) => fmt(v as number)} />
                        <Area dataKey="c" stroke="hsl(var(--primary))" fill="url(#priceGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Section>

              <Section icon={<Sparkles className="h-4 w-4 text-primary" />} title="AI analysis" eyebrow="Powered by Groq · Llama 3.3 70B">
                <details className="group mb-4 rounded-xl border border-border/60 bg-card/40 px-4 py-2.5 text-[11px] text-muted-foreground backdrop-blur-sm transition-colors hover:bg-card/60">
                  <summary className="flex cursor-pointer select-none items-center justify-between gap-2 font-medium text-foreground/85">
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary/80" />
                      What gets sent to the AI?
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70 transition-transform group-open:rotate-180">▾</span>
                  </summary>
                  <div className="mt-3 space-y-2 leading-relaxed">
                    <p>
                      When you view this page or click <strong className="text-foreground/90">AI analysis</strong>, we send the following public market context to our AI provider (<strong className="text-foreground/90">Groq</strong>, running Llama&nbsp;3.3&nbsp;70B) via our server:
                    </p>
                    <ul className="ml-4 list-disc space-y-0.5">
                      <li>Ticker, company name, sector, and currency</li>
                      <li>Current price, 52-week high/low, P/E, ROE, dividend yield</li>
                      <li>Recent closing prices used to compute moving averages, RSI, momentum and volatility</li>
                    </ul>
                    <p>
                      We do <strong className="text-foreground/90">not</strong> send your account email, watchlist, portfolio holdings, or any personal financial data. Groq processes the prompt only to generate this report and does not use it to train models. The response is cached for ~1 hour and rendered below; nothing here is investment advice — see our{" "}
                      <Link to="/privacy" className="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary">Privacy Policy</Link> and{" "}
                      <Link to="/disclaimer" className="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary">disclaimer</Link>.
                    </p>
                  </div>
                </details>

                {!d || d.price === 0 ? (
                  <div className="rounded-xl border border-border/50 bg-card/40 px-4 py-6 text-center text-sm text-muted-foreground">
                    AI analysis will run once live price data is available for this ticker.
                  </div>
                ) : ai.isLoading ? (
                  <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/40 px-4 py-6 text-sm text-muted-foreground">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    Generating AI insights…
                  </div>
                ) : ai.data ? (
                  <div className="space-y-5">
                    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/70 via-card/40 to-card/70 p-5 shadow-[0_1px_0_0_hsl(var(--foreground)/0.04)_inset,0_10px_30px_-20px_hsl(var(--primary)/0.35)]">
                      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
                      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Thesis</div>
                      <p className="text-pretty text-[15px] leading-relaxed text-foreground/90">{ai.data.summary}</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <CaseBox icon={<TrendingUp className="h-4 w-4" />} title="Bull case" tint="emerald" items={ai.data.bullCase} />
                      <CaseBox icon={<TrendingDown className="h-4 w-4" />} title="Bear case" tint="red" items={ai.data.bearCase} />
                    </div>
                    <CaseBox icon={<AlertTriangle className="h-4 w-4" />} title="Key risks" tint="amber" items={ai.data.risks} />
                    {ai.data.valuation && (
                      <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-primary/[0.06] p-4 text-sm shadow-[0_1px_0_0_hsl(var(--primary)/0.15)_inset]">
                        <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
                        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-primary/80">
                          <Sparkles className="h-3 w-3" /> Valuation view
                        </div>
                        <div className="mt-1.5 text-pretty leading-relaxed text-foreground/90">{ai.data.valuation}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-border/50 bg-card/40 px-4 py-6 text-center text-sm text-muted-foreground">Insights unavailable.</div>
                )}
                <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3 w-3 text-primary/70" /> AI-generated</span>
                  <span>Not financial advice</span>
                </div>
              </Section>


              <Section icon={<Newspaper className="h-4 w-4" />} title="Latest news">
                {news.isLoading ? (
                  <div className="text-sm text-muted-foreground">Loading news…</div>
                ) : (news.data?.length ?? 0) === 0 ? (
                  <div className="text-sm text-muted-foreground">No news items available.</div>
                ) : (
                  <ul className="divide-y divide-white/5">
                    {news.data!.map((n) => (
                      <li key={n.id} className="py-3">
                        <a href={n.url} target="_blank" rel="noreferrer" className="group block">
                          <div className="text-sm font-medium group-hover:text-primary">{n.headline}</div>
                          <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{n.source} · {new Date(n.ts).toLocaleDateString()}</div>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
            </div>

            {/* SIDEBAR: Health + ratings + earnings */}
            <div className="space-y-6">
              <Section icon={<ShieldCheck className="h-4 w-4" />} title="Financial health">
                <HealthScore score={d?.healthScore ?? 0} />
                <ul className="mt-3 space-y-1 text-xs text-foreground/80">
                  {(d?.healthNotes ?? []).map((n, i) => <li key={i}>• {n}</li>)}
                </ul>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <MetricRow label="ROE" value={d?.roe ? `${d.roe.toFixed(1)}%` : "—"} />
                  <MetricRow label="D/E" value={d?.debtToEquity != null ? d.debtToEquity.toFixed(2) : "—"} />
                  <MetricRow label="Rev growth" value={d?.revenueGrowth != null ? `${d.revenueGrowth.toFixed(1)}%` : "—"} />
                  <MetricRow label="Profit growth" value={d?.profitGrowth != null ? `${d.profitGrowth.toFixed(1)}%` : "—"} />
                  <MetricRow label="Div yield" value={d?.divYield ? `${d.divYield.toFixed(2)}%` : "—"} />
                  <MetricRow label="Beta" value={d?.beta ? d.beta.toFixed(2) : "—"} />
                </div>
              </Section>

              <Section title="Analyst ratings">
                {(analyst.data?.length ?? 0) === 0 ? (
                  <div className="text-sm text-muted-foreground">Not available for this ticker.</div>
                ) : (
                  <RatingsChart data={analyst.data!} />
                )}
              </Section>

              <Section title="Earnings history">
                {(earnings.data?.length ?? 0) === 0 ? (
                  <div className="text-sm text-muted-foreground">Not available.</div>
                ) : (
                  <ul className="space-y-1 text-xs">
                    {earnings.data!.map((e, i) => (
                      <li key={i} className="flex items-center justify-between font-mono">
                        <span className="text-muted-foreground">{e.period}</span>
                        <span>Est {e.estimate ?? "—"} → Act {e.actual ?? "—"}</span>
                        <span className={e.surprise && e.surprise >= 0 ? "text-emerald-400" : "text-red-400"}>
                          {e.surprise != null ? `${e.surprise >= 0 ? "+" : ""}${e.surprise.toFixed(2)}` : "—"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
            </div>
          </div>

          {/* CALCULATORS STRIP */}
          <div className="mt-10">
            <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <Calculator className="h-4 w-4 text-primary" /> Investment calculators for {upperSymbol}
            </div>
            <StockCalculators price={d?.price ?? 100} symbol={upperSymbol} name={d?.name ?? upperSymbol} currency={currency} assumedReturn={getCatalogEntry(upperSymbol)?.assumedReturn ?? 12} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// -------- helpers --------

function Section({ icon, title, eyebrow, children }: { icon?: React.ReactNode; title: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <motion.section initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/30 p-5 shadow-[0_1px_0_0_hsl(var(--foreground)/0.03)_inset]">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 font-display text-[15px] font-semibold tracking-tight text-balance">
          {icon}<span>{title}</span>
        </div>
        {eyebrow && (
          <span className="hidden sm:inline-flex font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </span>
        )}
      </div>
      {children}
    </motion.section>
  );
}


function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/30 px-3 py-2">
      <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-mono text-sm tabular-nums">{value}</div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/40 bg-card/30 px-2 py-1.5">
      <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-mono tabular-nums text-foreground/90">{value}</div>
    </div>
  );
}

function CaseBox({ icon, title, tint, items }: { icon: React.ReactNode; title: string; tint: "emerald" | "red" | "amber"; items: string[] }) {
  const tints = {
    emerald: "border-emerald-500/25 bg-emerald-500/[0.06] text-emerald-300 shadow-[0_1px_0_0_hsl(160_84%_50%/0.08)_inset]",
    red: "border-red-500/25 bg-red-500/[0.06] text-red-300 shadow-[0_1px_0_0_hsl(0_84%_60%/0.08)_inset]",
    amber: "border-amber-500/25 bg-amber-500/[0.06] text-amber-300 shadow-[0_1px_0_0_hsl(38_92%_50%/0.08)_inset]",
  }[tint];
  return (
    <div className={`rounded-xl border p-4 ${tints}`}>
      <div className="mb-2.5 flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em]">
        {icon}
        <span>{title}</span>
      </div>
      <ul className="space-y-1.5 text-[13px] leading-relaxed text-foreground/90">
        {items.length === 0 ? <li className="text-muted-foreground">—</li> : items.map((it, i) => (
          <li key={i} className="flex gap-2 text-pretty">
            <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


function HealthScore({ score }: { score: number }) {
  const color = score >= 75 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400";
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="42" strokeWidth="10" fill="none" stroke="rgba(255,255,255,0.08)" />
          <circle cx="50" cy="50" r="42" strokeWidth="10" fill="none" stroke="currentColor" strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 264} 264`} className={color} />
        </svg>
        <div className={`absolute inset-0 grid place-items-center font-mono text-lg font-bold ${color}`}>{score}</div>
      </div>
      <div>
        <div className="text-sm font-semibold">{score >= 75 ? "Strong" : score >= 50 ? "Fair" : "Weak"}</div>
        <div className="text-xs text-muted-foreground">Score is a heuristic based on growth, leverage, and returns.</div>
      </div>
    </div>
  );
}

function RatingsChart({ data }: { data: Array<{ buy: number; hold: number; sell: number; strongBuy: number; strongSell: number; period: string }> }) {
  const rows = data.map((r) => ({
    period: r.period.slice(0, 7),
    Buy: r.strongBuy + r.buy,
    Hold: r.hold,
    Sell: r.sell + r.strongSell,
  }));
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="period" stroke="rgba(255,255,255,0.4)" fontSize={10} />
          <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
          <Bar dataKey="Buy" stackId="a" fill="#10b981" />
          <Bar dataKey="Hold" stackId="a" fill="#94a3b8" />
          <Bar dataKey="Sell" stackId="a" fill="#ef4444">
            {rows.map((_, i) => <Cell key={i} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function LogoBox({ symbol, name, domain }: { symbol: string; name: string; domain?: string }) {
  const token = import.meta.env.VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY as string | undefined;
  const [stage, setStage] = useState<"primary" | "fallback" | "initials">("primary");
  const ticker = symbol.replace(/\.(NS|BO)$/i, "");
  const catDomain = getCatalogEntry(symbol)?.logoDomain;
  const useDomain = domain || catDomain;
  const primary = useDomain
    ? `https://img.logo.dev/${useDomain}?token=${token}&size=128&format=png&fallback=404`
    : `https://img.logo.dev/ticker/${encodeURIComponent(ticker)}?token=${token}&size=128&format=png&fallback=404`;
  const fallback = useDomain
    ? `https://img.logo.dev/ticker/${encodeURIComponent(ticker)}?token=${token}&size=128&format=png&fallback=404`
    : null;
  const initials = name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  if (!token || stage === "initials") {
    return <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-border/60 bg-card/60 font-mono text-lg font-semibold">{initials || ticker.slice(0, 2)}</div>;
  }
  const src = stage === "primary" ? primary : (fallback ?? primary);
  return <img key={src} src={src} alt={`${name} logo`} width={64} height={64}
    onError={() => setStage((s) => (s === "primary" && fallback ? "fallback" : "initials"))}
    className="h-16 w-16 shrink-0 rounded-2xl border border-border/60 bg-white object-contain p-1.5" />;
}

function StockActions({ disabled, onExportPdf, onExportXlsx, onAnalyzeAll, onAiReport, calculatorLink }: {
  disabled: boolean;
  onExportPdf: () => void;
  onExportXlsx: () => void;
  onAnalyzeAll: () => void;
  onAiReport: () => void | Promise<void>;
  calculatorLink: { pathname: string; search: Record<string, string> };
}) {
  const [busy, setBusy] = useState(false);
  const handle = async (fn: () => void | Promise<void>) => {
    setBusy(true);
    try { await fn(); } finally { setTimeout(() => setBusy(false), 400); }
  };
  const baseCls =
    "group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:transition-transform hover:[&_svg]:scale-110";
  const premiumCls =
    baseCls +
    " bg-gradient-to-b from-primary to-primary/85 text-primary-foreground border border-primary/50 shadow-[0_1px_0_0_hsl(var(--primary-foreground)/0.25)_inset,0_10px_28px_-12px_hsl(var(--primary)/0.7)] hover:shadow-[0_1px_0_0_hsl(var(--primary-foreground)/0.3)_inset,0_16px_36px_-14px_hsl(var(--primary)/0.9)]";
  const glassCls =
    baseCls +
    " border border-border/70 bg-card/50 text-foreground backdrop-blur-sm hover:bg-card/80 hover:border-border";
  const tintedCls =
    baseCls +
    " border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary/50";

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-card/30 p-2 shadow-[0_1px_0_0_hsl(var(--foreground)/0.03)_inset]">
      <button disabled={disabled || busy} onClick={() => handle(onAiReport)} className={premiumCls}>
        <Brain /> <span>AI analysis</span>
      </button>
      <button disabled={disabled || busy} onClick={() => handle(onAnalyzeAll)} className={glassCls}>
        <Zap className="text-primary" /> <span>Analyze all 15 calculators</span>
      </button>
      <button disabled={disabled || busy} onClick={() => handle(onExportPdf)} className={glassCls}>
        <FileDown /> <span>Export (PDF)</span>
      </button>
      <button disabled={disabled || busy} onClick={() => handle(onExportXlsx)} className={glassCls}>
        <FileSpreadsheet /> <span>Export (Excel)</span>
      </button>
      <Link to={calculatorLink.pathname} search={calculatorLink.search as never} className={`ml-auto ${tintedCls}`}>
        <Calculator /> <span>Open in 15 calculators</span>
        <ArrowUpRight className="ml-0.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </div>
  );
}



// -------- stock-page embedded calculators --------

function StockCalculators({ price, symbol, name, currency, assumedReturn }: { price: number; symbol: string; name: string; currency: string; assumedReturn: number }) {
  const [tab, setTab] = useState<"sip" | "lumpsum" | "pl" | "dividend" | "brokerage" | "average" | "position">("sip");
  const tabs = [
    { id: "sip" as const, label: "SIP" },
    { id: "lumpsum" as const, label: "Lumpsum" },
    { id: "pl" as const, label: "Profit/Loss" },
    { id: "dividend" as const, label: "Dividend" },
    { id: "brokerage" as const, label: "Brokerage" },
    { id: "average" as const, label: "Average" },
    { id: "position" as const, label: "Position size" },
  ];
  return (
    <div className="rounded-3xl border border-border/60 bg-card/30 p-6">
      <div className="flex flex-wrap gap-1 border-b border-border/40 pb-3">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${tab === t.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
        <Link to="/investing-calculators" className="ml-auto inline-flex items-center gap-1 self-center text-xs text-primary hover:underline">
          All 15 calculators <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="mt-5">
        {tab === "sip" && <SipMini rate={assumedReturn} currency={currency} />}
        {tab === "lumpsum" && <LumpsumMini rate={assumedReturn} currency={currency} name={name} />}
        {tab === "pl" && <ProfitLossMini price={price} currency={currency} />}
        {tab === "dividend" && <DividendMini price={price} currency={currency} />}
        {tab === "brokerage" && <BrokerageMini price={price} currency={currency} symbol={symbol} />}
        {tab === "average" && <AverageMini currency={currency} />}
        {tab === "position" && <PositionMini price={price} currency={currency} />}
      </div>
    </div>
  );
}

function useFmt(currency: string) {
  return (v: number) => currency === "INR" ? `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` : `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
function NumberField({ value, onChange, step = 1 }: { value: number; onChange: (v: number) => void; step?: number }) {
  const [text, setText] = useState<string>(String(value));
  useEffect(() => { setText((prev) => (Number(prev) === value ? prev : String(value))); }, [value]);
  return <input type="number" inputMode="decimal" value={text} step={step}
    onFocus={(e) => e.target.select()}
    onChange={(e) => { const v = e.target.value; setText(v); if (v === "" || v === "-") { onChange(0); return; } const n = Number(v); if (!Number.isNaN(n)) onChange(n); }}
    onBlur={() => { if (text === "" || text === "-") setText("0"); }}
    className="w-full rounded-lg border border-border/60 bg-card/40 px-3 py-2 font-mono text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20" />;
}
function SelectField<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: Array<{ value: T; label: string }> }) {
  return <select value={value} onChange={(e) => onChange(e.target.value as T)}
    className="w-full rounded-lg border border-border/60 bg-card px-3 py-2 font-mono text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20">
    {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>;
}
function Result({ label, value, tone }: { label: string; value: string; tone?: "up" | "down" | "primary" }) {
  const c = tone === "up" ? "text-emerald-400" : tone === "down" ? "text-red-400" : tone === "primary" ? "text-primary" : "text-foreground";
  return (
    <div className="rounded-xl border border-border/50 bg-card/40 p-3">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-1 font-mono text-lg font-semibold tabular-nums ${c}`}>{value}</div>
    </div>
  );
}

function SipMini({ rate, currency }: { rate: number; currency: string }) {
  const fmt = useFmt(currency);
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(10);
  const [r, setR] = useState(rate);
  const res = useMemo(() => sip({ monthly, rate: r, years }), [monthly, r, years]);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-3">
        <Field label="Monthly investment"><NumberField value={monthly} step={500} onChange={setMonthly} /></Field>
        <Field label="Years"><NumberField value={years} onChange={setYears} /></Field>
        <Field label="Expected return (% p.a.)"><NumberField value={r} step={0.5} onChange={setR} /></Field>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <Result label="Future value" value={fmt(res.futureValue)} tone="primary" />
        <Result label="Invested" value={fmt(res.invested)} />
        <Result label="Gains" value={fmt(res.gains)} tone="up" />
      </div>
    </div>
  );
}

function LumpsumMini({ rate, currency, name }: { rate: number; currency: string; name: string }) {
  const fmt = useFmt(currency);
  const [amount, setAmount] = useState(currency === "INR" ? 100000 : 10000);
  const [years, setYears] = useState(10);
  const [r, setR] = useState(rate);
  const res = useMemo(() => lumpsum({ principal: amount, rate: r, years }), [amount, r, years]);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-3">
        <div className="rounded-xl border border-border/50 bg-card/30 p-3 text-xs text-muted-foreground">
          Simulating a one-time investment in <span className="text-foreground font-medium">{name}</span>.
        </div>
        <Field label={`Investment amount`}><NumberField value={amount} step={1000} onChange={setAmount} /></Field>
        <Field label="Years"><NumberField value={years} onChange={setYears} /></Field>
        <Field label="Expected return (% p.a.)"><NumberField value={r} step={0.5} onChange={setR} /></Field>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <Result label="Future value" value={fmt(res.futureValue)} tone="primary" />
        <Result label="Invested" value={fmt(res.invested)} />
        <Result label="Gains" value={fmt(res.gains)} tone="up" />
      </div>
    </div>
  );
}

function ProfitLossMini({ price, currency }: { price: number; currency: string }) {
  const fmt = useFmt(currency);
  const [buy, setBuy] = useState(price);
  const [sell, setSell] = useState(price * 1.1);
  const [qty, setQty] = useState(10);
  const [taxRate, setTaxRate] = useState(currency === "INR" ? 12.5 : 15);
  const res = useMemo(() => profitLoss({ buy, sell, qty, taxRate }), [buy, sell, qty, taxRate]);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Buy price"><NumberField value={buy} step={0.5} onChange={setBuy} /></Field>
        <Field label="Sell price"><NumberField value={sell} step={0.5} onChange={setSell} /></Field>
        <Field label="Quantity"><NumberField value={qty} onChange={setQty} /></Field>
        <Field label="Cap-gains tax %"><NumberField value={taxRate} step={0.5} onChange={setTaxRate} /></Field>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <Result label="Gross P/L" value={fmt(res.gross)} tone={res.gross >= 0 ? "up" : "down"} />
        <Result label="Tax" value={fmt(res.tax)} />
        <Result label="Net P/L" value={fmt(res.net)} tone={res.net >= 0 ? "up" : "down"} />
        <Result label="ROI" value={`${res.roi.toFixed(2)}%`} tone={res.roi >= 0 ? "up" : "down"} />
      </div>
    </div>
  );
}

function DividendMini({ price, currency }: { price: number; currency: string }) {
  const fmt = useFmt(currency);
  const [shares, setShares] = useState(100);
  const [dps, setDps] = useState(currency === "INR" ? 15 : 1);
  const res = useMemo(() => dividend({ shares, dps, priceForYield: price }), [shares, dps, price]);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-3">
        <Field label="Shares owned"><NumberField value={shares} onChange={setShares} /></Field>
        <Field label="Dividend per share (annual)"><NumberField value={dps} step={0.1} onChange={setDps} /></Field>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <Result label="Annual income" value={fmt(res.annual)} tone="primary" />
        <Result label="Monthly income" value={fmt(res.monthly)} />
        <Result label="Yield at current price" value={`${res.yieldPct.toFixed(2)}%`} tone="up" />
      </div>
    </div>
  );
}

function BrokerageMini({ price, currency, symbol }: { price: number; currency: string; symbol: string }) {
  const fmt = useFmt(currency);
  const isIndian = symbol.endsWith(".NS") || symbol.endsWith(".BO");
  const brokers = isIndian ? BROKERS_IN : BROKERS_US;
  const [broker, setBroker] = useState<BrokerId>(brokers[0].id);
  const [buy, setBuy] = useState(price);
  const [sell, setSell] = useState(price * 1.05);
  const [qty, setQty] = useState(10);
  const [tradeType, setTradeType] = useState<"intraday" | "delivery">("delivery");
  const res = useMemo(() => calcBrokerage({ broker, buyPrice: buy, sellPrice: sell, qty, tradeType, market: isIndian ? "IN" : "US" }), [broker, buy, sell, qty, tradeType, isIndian]);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Broker">
          <SelectField value={broker} onChange={setBroker} options={brokers.map((b) => ({ value: b.id, label: b.name }))} />
        </Field>
        <Field label="Trade type">
          <SelectField value={tradeType} onChange={setTradeType} options={[{ value: "delivery", label: "Delivery" }, { value: "intraday", label: "Intraday" }]} />
        </Field>
        <Field label="Buy price"><NumberField value={buy} step={0.5} onChange={setBuy} /></Field>
        <Field label="Sell price"><NumberField value={sell} step={0.5} onChange={setSell} /></Field>
        <Field label="Quantity"><NumberField value={qty} onChange={setQty} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Result label="Brokerage" value={fmt(res.brokerage)} />
        <Result label="Taxes/fees" value={fmt(res.totalCharges - res.brokerage)} />
        <Result label="Total charges" value={fmt(res.totalCharges)} />
        <Result label="Breakeven %" value={`${res.breakevenPct.toFixed(2)}%`} />
        <div className="col-span-2">
          <Result label="Net P/L" value={fmt(res.netPL)} tone={res.netPL >= 0 ? "up" : "down"} />
        </div>
      </div>
    </div>
  );
}

function AverageMini({ currency }: { currency: string }) {
  const fmt = useFmt(currency);
  const [lots, setLots] = useState([{ qty: 10, price: 400 }, { qty: 20, price: 350 }]);
  const res = useMemo(() => stockAverage(lots), [lots]);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        {lots.map((l, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <NumberField value={l.qty} onChange={(v) => setLots((prev) => prev.map((x, j) => j === i ? { ...x, qty: v } : x))} />
            <NumberField value={l.price} step={0.5} onChange={(v) => setLots((prev) => prev.map((x, j) => j === i ? { ...x, price: v } : x))} />
            <button onClick={() => setLots((prev) => prev.filter((_, j) => j !== i))} className="text-xs text-muted-foreground hover:text-red-400">✕</button>
          </div>
        ))}
        <button onClick={() => setLots((prev) => [...prev, { qty: 0, price: 0 }])}
          className="rounded-lg border border-dashed border-border/60 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">+ Add lot</button>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <Result label="Average cost" value={fmt(res.avg)} tone="primary" />
        <Result label="Total quantity" value={String(res.totalQty)} />
        <Result label="Total invested" value={fmt(res.totalCost)} />
      </div>
    </div>
  );
}

function PositionMini({ price, currency }: { price: number; currency: string }) {
  const fmt = useFmt(currency);
  const [portfolio, setPortfolio] = useState(currency === "INR" ? 1_000_000 : 100_000);
  const [risk, setRisk] = useState(2);
  const [stop, setStop] = useState(5);
  const [entry, setEntry] = useState(price);
  const res = useMemo(() => positionSize({ portfolio, riskPct: risk, stopLossPct: stop, entryPrice: entry }), [portfolio, risk, stop, entry]);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-3">
        <Field label="Portfolio size"><NumberField value={portfolio} step={10000} onChange={setPortfolio} /></Field>
        <Field label="Risk per trade (%)"><NumberField value={risk} step={0.25} onChange={setRisk} /></Field>
        <Field label="Stop-loss (%)"><NumberField value={stop} step={0.25} onChange={setStop} /></Field>
        <Field label="Entry price"><NumberField value={entry} step={0.5} onChange={setEntry} /></Field>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <Result label="Max quantity" value={String(res.qty)} tone="primary" />
        <Result label="Risk amount" value={fmt(res.riskAmount)} />
        <Result label="Capital deployed" value={fmt(res.capitalDeployed)} />
      </div>
    </div>
  );
}
