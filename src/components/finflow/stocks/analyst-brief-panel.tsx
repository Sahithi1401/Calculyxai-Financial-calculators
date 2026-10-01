import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { getAnalystBrief } from "@/lib/finflow/analyst-brief.functions";

const VERDICT_TONE: Record<string, string> = {
  Constructive: "text-success border-success/40 bg-success/10",
  Neutral: "text-foreground/80 border-border bg-foreground/[0.04]",
  Cautious: "text-destructive border-destructive/40 bg-destructive/10",
};

export function AnalystBriefPanel({ symbol }: { symbol: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["analyst-brief", symbol],
    queryFn: () => getAnalystBrief({ data: { symbol } }),
    staleTime: 30 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <section className="my-8 rounded-xl border border-border/70 bg-card/30 p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Underwriting evidence-backed brief…</div>
      </section>
    );
  }
  if (!data) return null;

  return (
    <section className="my-8">
      <div className="flex items-end justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            <Sparkles className="h-3 w-3" /> AI Analyst · Evidence-Backed
          </div>
          <h2 className="mt-2 font-display text-2xl tracking-tight">
            The <span className="italic" style={{ fontFamily: "var(--font-serif)" }}>underwritten</span> thesis
          </h2>
        </div>
        <span className={`shrink-0 rounded-md border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] ${VERDICT_TONE[data.verdict]}`}>
          {data.verdict}
        </span>
      </div>

      <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-foreground/90">{data.thesis}</p>

      <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border/70 bg-border/70 md:grid-cols-2">
        <div className="bg-background/95 p-5">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-success">
            <TrendingUp className="h-3 w-3" /> Bull case
          </div>
          <ul className="mt-3 space-y-2">
            {data.bull.length ? data.bull.map((b, i) => (
              <li key={i} className="text-[13px] leading-relaxed text-foreground/85">— {b}</li>
            )) : <li className="text-[13px] text-muted-foreground/70">No high-scoring drivers identified.</li>}
          </ul>
        </div>
        <div className="bg-background/95 p-5">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-destructive">
            <TrendingDown className="h-3 w-3" /> Bear case
          </div>
          <ul className="mt-3 space-y-2">
            {data.bear.length ? data.bear.map((b, i) => (
              <li key={i} className="text-[13px] leading-relaxed text-foreground/85">— {b}</li>
            )) : <li className="text-[13px] text-muted-foreground/70">No material weakness in scored drivers.</li>}
          </ul>
        </div>
      </div>

      {data.citations.length > 0 && (
        <details className="mt-4 group">
          <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground">
            Show evidence · {data.citations.length} driver{data.citations.length === 1 ? "" : "s"} cited
          </summary>
          <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {data.citations.map((c, i) => (
              <li key={i} className="rounded-md border border-border/50 bg-foreground/[0.02] px-3 py-2 text-[11px]">
                <span className="font-semibold text-foreground/90">{c.label}</span>
                <span className="text-muted-foreground"> · {c.source}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
        Educational content only · Not investment advice · Generated {new Date(data.generatedAt).toLocaleString()}
      </div>
    </section>
  );
}
