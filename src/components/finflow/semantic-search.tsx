import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Loader2, CornerDownLeft, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useServerFn } from "@tanstack/react-start";
import { semanticSearch } from "@/lib/finflow/rag/rag.functions";
import { useCountry } from "@/lib/finflow/country-store";

type Result = { title: string; url: string | null; source: string; snippet: string; similarity: number };

export function SemanticSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [country] = useCountry();
  const navigate = useNavigate();
  const search = useServerFn(semanticSearch);
  const reqRef = useRef(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const id = ++reqRef.current;
    const t = setTimeout(async () => {
      try {
        const res = await search({ data: { query: q, country } });
        if (reqRef.current === id) {
          setResults(res.results);
          setActive(0);
        }
      } catch {
        if (reqRef.current === id) setResults([]);
      } finally {
        if (reqRef.current === id) setLoading(false);
      }
    }, 320);
    return () => clearTimeout(t);
  }, [query, country, search]);

  const go = useMemo(
    () => (r: Result | undefined) => {
      if (!r) return;
      setOpen(false);
      setQuery("");
      if (r.url) {
        if (r.url.startsWith("http")) window.open(r.url, "_blank", "noopener");
        else navigate({ to: r.url });
      } else {
        navigate({ to: "/ai" });
      }
    },
    [navigate],
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search Calculyx"
        className="hidden items-center gap-2 rounded-full border border-border/60 bg-foreground/[0.03] px-3 py-1.5 text-[12px] text-muted-foreground transition hover:border-primary/50 hover:text-foreground sm:inline-flex"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search</span>
        <kbd className="rounded border border-border/60 bg-background/60 px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
      </button>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search Calculyx"
        className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-white/5 hover:text-foreground sm:hidden"
      >
        <Search className="h-3.5 w-3.5" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl gap-0 overflow-hidden p-0">
          <DialogTitle className="sr-only">Semantic search</DialogTitle>
          <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
            {loading ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
            ) : (
              <Sparkles className="h-4 w-4 shrink-0 text-primary" />
            )}
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
                if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
                if (e.key === "Enter") { e.preventDefault(); go(results[active]); }
              }}
              placeholder="Ask anything — “how is SIP taxed?”, “EMI for 50L”…"
              className="w-full bg-transparent text-[15px] placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="max-h-[55vh] overflow-y-auto p-2">
            {query.trim().length < 2 && (
              <p className="px-3 py-6 text-center text-[13px] text-muted-foreground">
                Semantic search across guides, calculators, tax rules and stocks.
              </p>
            )}
            {query.trim().length >= 2 && !loading && results.length === 0 && (
              <p className="px-3 py-6 text-center text-[13px] text-muted-foreground">No matches. Try rephrasing.</p>
            )}
            {results.map((r, i) => (
              <button
                key={`${r.title}-${i}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r)}
                className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  i === active ? "bg-primary/10" : "hover:bg-muted/60"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-medium text-foreground">{r.title}</div>
                  <div className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-muted-foreground">{r.snippet}</div>
                </div>
                <span className="mt-1 shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {r.source}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-border/60 px-4 py-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <CornerDownLeft className="h-3 w-3" /> to open
            </span>
            <span>Powered by Calculyx retrieval</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
