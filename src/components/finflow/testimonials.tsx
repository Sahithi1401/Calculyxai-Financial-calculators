import { motion } from "framer-motion";
import { Star, ExternalLink } from "lucide-react";
import {
  REVIEWS,
  ENABLE_AGGREGATE_RATING_SCHEMA,
  LEAVE_REVIEW_URL,
  verifiedReviews,
} from "@/lib/finflow/reviews";

const TRUST = [
  { label: "Calculations run", value: "2.4M+" },
  { label: "Countries supported", value: "3" },
  { label: "Live currency pairs", value: "150+" },
  { label: "Uptime", value: "99.98%" },
];

/**
 * Reviews are sourced from src/lib/finflow/reviews.ts.
 * Paste real reviews there — this component renders whatever is in REVIEWS.
 * AggregateRating JSON-LD is emitted only when ENABLE_AGGREGATE_RATING_SCHEMA
 * is true AND at least one verified review exists.
 */
export function TrustAndTestimonials() {
  const list = REVIEWS.slice(0, 3);
  const showSchemaNote = !ENABLE_AGGREGATE_RATING_SCHEMA || verifiedReviews().length === 0;

  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.label} className="rounded-2xl border bg-card p-6">
              <div className="font-display text-3xl font-semibold tracking-tight text-gradient sm:text-4xl">{t.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{t.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Reviews
          </div>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            <span className="font-serif italic text-primary">Built</span> for professionals
            <br />
            across three continents.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {list.map((r, i) => (
            <motion.figure
              key={`${r.name}-${r.date}`}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col rounded-2xl border bg-card p-6 shadow-soft"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
                  {Array.from({ length: r.rating }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-warning text-warning" aria-hidden />
                  ))}
                </div>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  {r.source}
                </span>
              </div>
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed">“{r.text}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                {r.avatar ? (
                  <img src={r.avatar} alt="" width={36} height={36} loading="lazy" className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 font-mono text-xs text-primary">
                    {r.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{r.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {r.role} · {r.location}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <a
            href={LEAVE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border/70 bg-card/60 px-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-foreground/85 transition hover:border-primary/40 hover:text-primary"
          >
            Leave a review <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
          {showSchemaNote && (
            <p className="max-w-md text-[11px] leading-relaxed text-muted-foreground">
              Entries marked “Placeholder” are illustrative and are not attributed to real people.
              Aggregate rating markup stays disabled until verified reviews are published.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
