import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { CALCULATORS } from "@/lib/finflow/registry";

export function CalculatorsGrid({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return CALCULATORS;
    return CALCULATORS.filter((c) =>
      c.name.toLowerCase().includes(s) || c.tagline.toLowerCase().includes(s) || c.category.toLowerCase().includes(s),
    );
  }, [q]);

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-32">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end sm:gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-primary" /></span>
            Calculators
            <span className="text-xs font-normal text-muted-foreground">· {filtered.length} modules</span>
          </div>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Every financial answer, <span className="font-serif italic text-primary">in one search.</span>
          </h2>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search calculators…"
            className="h-11 w-full rounded-full border border-border/60 bg-card/40 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {(() => {
        const shown = filtered.slice(0, compact ? 8 : filtered.length);
        const groups = shown.reduce<Record<string, typeof shown>>((acc, c) => {
          (acc[c.category] ||= []).push(c);
          return acc;
        }, {});
        let running = 0;
        return Object.entries(groups).map(([category, items]) => (
          <div key={category} className="mt-10 sm:mt-14">
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground/90 sm:text-2xl">
              {category}
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((c) => {
                const idx = running++;
                const Icon = c.icon;
                const num = String(idx + 1).padStart(2, "0");
                return (
                  <motion.div
                    key={c.slug}
                    initial={{ y: 24, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link to="/calc/$type" params={{ type: c.slug }} className="group block h-full">
                      <div className="relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-6 transition-all duration-500 hover:border-primary/30 hover:bg-card/60">
                        <div className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${c.accent} opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-[0.12]`} aria-hidden />
                        <div className="relative flex items-start justify-between">
                          <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${c.accent} bg-opacity-10 ring-1 ring-border/60 transition-transform duration-500 group-hover:scale-[1.08]`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/70">
                            {num} / {String(CALCULATORS.length).padStart(2, "0")}
                          </span>
                        </div>
                        <div className="relative mt-6 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                          {c.category}
                        </div>
                        <h3 className="relative mt-2 font-display text-[1.55rem] leading-tight tracking-[-0.025em]"
                            style={{ fontVariationSettings: '"opsz" 40, "SOFT" 30' }}>
                          {c.name}
                        </h3>
                        <p className="relative mt-2 text-[13.5px] leading-relaxed text-muted-foreground line-clamp-2">{c.tagline}</p>
                        <div className="relative mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/70">Open module</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ));
      })()}

      {compact && (
        <div className="mt-12 text-center">
          <Link
            to="/calculators"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-foreground/80 transition hover:bg-card/70 hover:text-foreground"
          >
            View all 12 calculators <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
}
