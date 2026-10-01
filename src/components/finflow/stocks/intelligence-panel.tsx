import { useQuery } from "@tanstack/react-query";
import { getStockIntelligence } from "@/lib/finflow/intelligence.functions";
import type { ScoreBucket, StockScores } from "@/lib/finflow/pipeline/types";

const BUCKETS: Array<{ key: keyof Pick<StockScores, "health" | "growth" | "value" | "risk" | "momentum">; label: string; num: string }> = [
  { key: "health", label: "Health", num: "01" },
  { key: "growth", label: "Growth", num: "02" },
  { key: "value", label: "Value", num: "03" },
  { key: "risk", label: "Risk", num: "04" },
  { key: "momentum", label: "Momentum", num: "05" },
];

function tone(score: number) {
  if (score >= 75) return "text-success";
  if (score >= 55) return "text-primary";
  if (score >= 35) return "text-foreground/80";
  return "text-destructive";
}

function BucketCard({ label, num, bucket }: { label: string; num: string; bucket: ScoreBucket }) {
  return (
    <div className="bg-background/95 p-5">
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{num} · {label}</div>
        <div className={`font-mono text-2xl tabular-nums ${tone(bucket.score)}`}>{bucket.score}</div>
      </div>
      <div className="mt-3 h-1 w-full bg-border/60 overflow-hidden rounded-full">
        <div className={`h-full ${bucket.score >= 55 ? "bg-primary" : "bg-foreground/40"}`} style={{ width: `${bucket.score}%` }} />
      </div>
      <ul className="mt-3 space-y-1.5">
        {bucket.drivers.slice(0, 3).map((d) => (
          <li key={d.label} className="flex items-baseline justify-between gap-2 text-[11px]">
            <span className="text-muted-foreground truncate">{d.label}</span>
            <span className="font-mono tabular-nums text-foreground/80 shrink-0">{d.points}</span>
          </li>
        ))}
        {bucket.drivers.length === 0 && <li className="text-[11px] text-muted-foreground/70">No data available.</li>}
      </ul>
    </div>
  );
}

export function IntelligencePanel({ symbol }: { symbol: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["intelligence", symbol],
    queryFn: () => getStockIntelligence({ data: { symbol } }),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <section className="my-8 rounded-xl border border-border/70 bg-card/30 p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Loading intelligence pipeline…</div>
      </section>
    );
  }
  if (!data?.scores) return null;
  const s = data.scores;

  return (
    <section className="my-8">
      <div className="flex items-end justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Proprietary Scoring · v{s.version}</div>
          <h2 className="mt-2 font-display text-2xl tracking-tight">
            Institutional intelligence, <span className="italic" style={{ fontFamily: "var(--font-serif)" }}>evidence-backed</span>
          </h2>
        </div>
        <div className="text-right shrink-0">
          <div className={`font-mono text-5xl tabular-nums ${tone(s.overall)}`}>{s.overall}</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Grade · {s.grade}</div>
        </div>
      </div>
      <div className="mt-px grid grid-cols-1 gap-px overflow-hidden rounded-b-xl border border-t-0 border-border/70 bg-border/70 sm:grid-cols-2 lg:grid-cols-5">
        {BUCKETS.map((b) => <BucketCard key={b.key} label={b.label} num={b.num} bucket={s[b.key]} />)}
      </div>
      {data.warnings.length > 0 && (
        <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
          Notes · {data.warnings.join(" · ")}
        </div>
      )}
    </section>
  );
}
