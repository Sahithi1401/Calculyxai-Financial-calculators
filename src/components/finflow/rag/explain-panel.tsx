import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { useServerFn } from "@tanstack/react-start";
import { explainResult, type RagSource } from "@/lib/finflow/rag/rag.functions";
import type { AnalysisPayload } from "@/lib/finflow/analysis/types";

export function ExplainPanel({ payload, signedIn }: { payload: AnalysisPayload; signedIn: boolean | null }) {
  const [text, setText] = useState<string | null>(null);
  const [sources, setSources] = useState<RagSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const explain = useServerFn(explainResult);

  const brief = [
    payload.subtitle ?? "",
    payload.kpis.map((k) => `${k.label}: ${k.value}${k.sub ? ` (${k.sub})` : ""}`).join("\n"),
    payload.aiBrief ?? "",
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 3500);

  async function run() {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const res = await explain({
        data: { slug: payload.slug, title: payload.title, country: payload.country, brief },
      });
      setText(res.explanation);
      setSources(res.sources);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Explanation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl border-sheen glass p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <BookOpen className="h-3 w-3 text-primary" /> Grounded explanation
          </div>
          <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
            Plain-English breakdown of this result, cited against the Calculyx knowledge base.
          </p>
        </div>
        <Button onClick={run} disabled={loading || signedIn === false} size="sm" className="rounded-full">
          {loading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="mr-1.5 h-3.5 w-3.5" />}
          {text ? "Re-explain" : "Explain this result"}
        </Button>
      </div>

      {signedIn === false && (
        <p className="mt-3 text-[13px] text-muted-foreground">Sign in to generate a grounded explanation.</p>
      )}
      {error && <p className="mt-3 text-[13px] text-destructive">{error}</p>}

      {text && (
        <div className="mt-4 border-t border-border/50 pt-4">
          <div className="markdown-body text-[14px] leading-relaxed text-foreground/90">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
          </div>
          {!!sources.length && (
            <div className="mt-4 rounded-xl border border-border/60 bg-card/50 p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Sources</p>
              <ul className="mt-2 space-y-1.5">
                {sources.map((s) => (
                  <li key={s.n} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                    <span className="mt-px font-mono text-[11px] text-primary">[{s.n}]</span>
                    {s.url ? (
                      <a href={s.url} className="underline-offset-2 hover:text-primary hover:underline">{s.title}</a>
                    ) : (
                      <span>{s.title}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
