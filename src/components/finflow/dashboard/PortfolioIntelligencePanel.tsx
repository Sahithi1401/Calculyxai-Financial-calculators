import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { getPortfolioIntelligence } from "@/lib/finflow/portfolio-intel.functions";

const VERDICT_TONE: Record<string, string> = {
  Constructive: "text-success border-success/40 bg-success/10",
  Neutral: "text-foreground/80 border-border bg-foreground/[0.04]",
  Cautious: "text-destructive border-destructive/40 bg-destructive/10",
};

function tone(score: number) {
  if (score >= 75) return "text-success";
  if (score >= 55) return "text-primary";
  if (score >= 35) return "text-foreground/80";
  return "text-destructive";
}

const BUCKET_NUM: Record<string, string> = { health: "01", growth: "02", value: "03", risk: "04", momentum: "05" };

export function PortfolioIntelligencePanel() {
  const { data, isLoading } = useQuery({
    queryKey: ["portfolio-intelligence"],
    queryFn: () => getPortfolioIntelligence(),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <section className="mb-8 rounded-xl border border-border/70 bg-card/30 p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Underwriting portfolio intelligence…
        </div>
      </section>
    );
  }
  if (!data) return null;

  return (
    <section className="mb-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            <Sparkles className="h-3 w-3" /> Portfolio Intelligence · Evidence-Backed
          </div>
          <h2 className="mt-2 font-display text-2xl tracking-tight">
            Your book, <span className="italic" style={{ fontFamily: "var(--font-serif)" }}>underwritten</span>
          </h2>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={`rounded-md border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] ${VERDICT_TONE[data.verdict]}`}>
            {data.verdict}
          </span>
          <div className="text-right">
            <div className={`font-mono text-5xl tabular-nums leading-none ${tone(data.overall)}`}>{data.overall}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Grade · {data.grade}</div>
          </div>
        </div>
      </div>

      {/* Buckets grid */}
      <div className="mt-px grid grid-cols-1 gap-px overflow-hidden rounded-b-xl border border-t-0 border-border/70 bg-border/70 sm:grid-cols-2 lg:grid-cols-5">
        {data.buckets.map((b) => (
          <div key={b.key} className="bg-background/95 p-5">
            <div className="flex items-baseline justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{BUCKET_NUM[b.key]} · {b.label}</div>
              <div className={`font-mono text-2xl tabular-nums ${tone(b.score)}`}>{b.score}</div>
            </div>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-border/60">
              <div className={`h-full ${b.score >= 55 ? "bg-primary" : "bg-foreground/40"}`} style={{ width: `${b.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Thesis */}
      <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-foreground/90">{data.thesis}</p>

      {/* Strengths / Risks */}
      <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border/70 bg-border/70 md:grid-cols-2">
        <div className="bg-background/95 p-5">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-success">
            <TrendingUp className="h-3 w-3" /> Strengths
          </div>
          <ul className="mt-3 space-y-2">
            {data.strengths.length ? data.strengths.map((s, i) => (
              <li key={i} className="text-[13px] leading-relaxed text-foreground/85">— {s}</li>
            )) : <li className="text-[13px] text-muted-foreground/70">No standout strengths.</li>}
          </ul>
        </div>
        <div className="bg-background/95 p-5">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-destructive">
            <TrendingDown className="h-3 w-3" /> Risks
          </div>
          <ul className="mt-3 space-y-2">
            {data.risks.length ? data.risks.map((r, i) => (
              <li key={i} className="text-[13px] leading-relaxed text-foreground/85">— {r}</li>
            )) : <li className="text-[13px] text-muted-foreground/70">No material weaknesses flagged.</li>}
          </ul>
        </div>
      </div>

      {/* Positions table */}
      {data.positions.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-xl border border-border/70">
          <div className="grid grid-cols-12 gap-2 border-b border-border/60 bg-foreground/[0.02] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <div className="col-span-2">Symbol</div>
            <div className="col-span-5">Name</div>
            <div className="col-span-2 text-right">Weight</div>
            <div className="col-span-2 text-right">Score</div>
            <div className="col-span-1 text-right">Grade</div>
          </div>
          {data.positions.map((p) => (
            <div key={p.symbol} className="grid grid-cols-12 gap-2 border-b border-border/40 px-4 py-2.5 text-[13px] last:border-0">
              <div className="col-span-2 font-mono font-semibold">{p.symbol}</div>
              <div className="col-span-5 truncate text-foreground/80">{p.name}</div>
              <div className="col-span-2 text-right font-mono tabular-nums text-muted-foreground">{Math.round(p.weight * 100)}%</div>
              <div className={`col-span-2 text-right font-mono tabular-nums ${tone(p.overall)}`}>{p.overall}</div>
              <div className="col-span-1 text-right font-mono text-muted-foreground">{p.grade}</div>
            </div>
          ))}
        </div>
      )}

      {/* Footer meta */}
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
        <span>Coverage · {data.coverage.pct}% of book scored</span>
        <span>Top position · {data.concentration.topName} at {data.concentration.topPct}%</span>
        <span>HHI · {data.concentration.hhi}</span>
        <span>Educational · not investment advice</span>
      </div>
    </section>
  );
}
