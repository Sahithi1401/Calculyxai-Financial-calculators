import { Link } from "@tanstack/react-router";
import { ArrowRight, Compass } from "lucide-react";

/** Prominent "what to do next" card shown right below every calculator result. */
export function NextStepCard({ next, rest }: { next?: { slug: string; label: string; blurb: string }; rest: Array<{ slug: string; label: string }> }) {
  if (!next) return null;
  return (
    <section className="mx-auto max-w-4xl px-4 pt-10" aria-labelledby="next-step-heading">
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-primary/5 p-6 shadow-elegant sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary">
              <Compass className="h-3.5 w-3.5" aria-hidden /> Your next step
            </div>
            <h2 id="next-step-heading" className="mt-2 font-display text-xl font-semibold tracking-tight sm:text-2xl">{next.label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{next.blurb}</p>
          </div>
          <Link
            to="/calc/$type"
            params={{ type: next.slug }}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 active:scale-[0.98]"
          >
            Continue <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        {rest.length > 0 && (
          <div className="relative mt-5 flex flex-wrap items-center gap-2 border-t border-border/40 pt-4 text-xs">
            <span className="text-muted-foreground">Also useful:</span>
            {rest.map((r) => (
              <Link key={r.slug} to="/calc/$type" params={{ type: r.slug }} className="rounded-full border border-border/60 px-3 py-1.5 text-foreground/85 transition hover:border-primary/50 hover:text-primary">
                {r.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
