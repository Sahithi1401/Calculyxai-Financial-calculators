import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServerFn } from "@tanstack/react-start";
import { personalizedInsights, type RagSource } from "@/lib/finflow/rag/rag.functions";
import { useCountry } from "@/lib/finflow/country-store";

type Insight = { title: string; body: string; tag: string };

export function InsightsFeedPanel() {
  const [country] = useCountry();
  const [insights, setInsights] = useState<Insight[] | null>(null);
  const [sources, setSources] = useState<RagSource[]>([]);
  const [empty, setEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = useServerFn(personalizedInsights);

  async function generate() {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const res = await run({ data: { country } });
      setInsights(res.insights);
      setSources(res.sources);
      setEmpty(res.empty);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate insights");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-8 rounded-3xl border-sheen glass p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <Lightbulb className="h-3 w-3 text-primary" /> Personalized insights
          </div>
          <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-muted-foreground">
            Generated from your saved calculations, holdings and net worth — grounded in the Calculyx knowledge base.
          </p>
        </div>
        <Button onClick={generate} disabled={loading} size="sm" className="rounded-full">
          {loading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="mr-1.5 h-3.5 w-3.5" />}
          {insights ? "Refresh" : "Generate insights"}
        </Button>
      </div>

      {error && <p className="mt-3 text-[13px] text-destructive">{error}</p>}
      {empty && (
        <p className="mt-3 text-[13px] text-muted-foreground">
          Add holdings, net worth entries or run a calculator first — then insights will appear here.
        </p>
      )}

      {!!insights?.length && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {insights.map((i, idx) => (
            <motion.div
              key={i.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="rounded-2xl border border-border/60 bg-card/60 p-4"
            >
              <span className="inline-block rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                {i.tag}
              </span>
              <h3 className="mt-2.5 text-[15px] font-semibold tracking-tight">{i.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{i.body}</p>
            </motion.div>
          ))}
        </div>
      )}

      {!!sources.length && (
        <div className="mt-4 flex flex-wrap gap-2">
          {sources.map((s) => (
            <span key={s.n} className="rounded-full border border-border/60 bg-card/50 px-2.5 py-1 text-[11px] text-muted-foreground">
              [{s.n}] {s.title}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
