import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Info } from "lucide-react";
import { Navbar } from "@/components/finflow/navbar";
import { Footer } from "@/components/finflow/footer";
import { Breadcrumbs } from "@/components/finflow/breadcrumbs";
import { StickyMobileCta } from "@/components/finflow/sticky-cta";
import { CASE_STUDIES, ILLUSTRATIVE_NOTICE } from "@/lib/finflow/case-studies";
import { pageHead, SITE } from "@/lib/seo";

const CRUMBS = [{ name: "Home", path: "/" }, { name: "Case Studies", path: "/case-studies" }];

export const Route = createFileRoute("/case-studies/")({
  head: () =>
    pageHead({
      title: "Financial Case Studies — Worked Examples",
      description:
        "Four illustrative scenarios worked end to end: Bengaluru rent vs buy, a US mortgage refinance, an NRI retirement corpus in Dubai, and small-business GST cash flow.",
      path: "/case-studies",
      keywords: "financial case studies, rent vs buy example, mortgage refinance break-even, NRI retirement corpus, GST cash flow",
      crumbs: CRUMBS,
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Calculyx AI case studies",
          itemListElement: CASE_STUDIES.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.title,
            url: `${SITE.url}/case-studies/${c.slug}`,
          })),
        },
      ],
    }),
  component: CaseStudiesIndex,
});

function CaseStudiesIndex() {
  return (
    <div className="bg-page-gradient min-h-screen">
      <Navbar />
      <main className="pt-20 pb-24 sm:pt-24 md:pb-16">
        <Breadcrumbs items={CRUMBS} className="pt-4" />

        <header className="mx-auto max-w-4xl px-5 pt-8 sm:px-6 sm:pt-12">
          <div className="text-sm font-medium text-primary">Worked examples</div>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Case <span className="font-serif italic text-primary">studies</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Four decisions taken apart with the same calculators you can open right now —
            situation, what was calculated, the actual numbers, and the outcome.
          </p>
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-warning/25 bg-warning/5 p-3.5 text-xs leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
            <span>{ILLUSTRATIVE_NOTICE}</span>
          </div>
        </header>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 px-5 sm:px-6 md:grid-cols-2">
          {CASE_STUDIES.map((c) => (
            <Link
              key={c.slug}
              to="/case-studies/$slug"
              params={{ slug: c.slug }}
              className="group flex flex-col rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-md transition hover:border-primary/40"
            >
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span aria-hidden>{c.flag}</span>
                <span>{c.location}</span>
                <span aria-hidden>·</span>
                <span>{c.readMinutes} min</span>
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight group-hover:text-primary">
                {c.short}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{c.summary}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {c.metrics.slice(0, 2).map((m) => (
                  <div key={m.label} className="rounded-xl border border-border/50 bg-foreground/[0.03] p-2.5">
                    <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">{m.label}</div>
                    <div className="mt-0.5 font-mono text-sm tabular-nums text-primary">{m.value}</div>
                  </div>
                ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-primary">
                Read study <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-4xl px-5 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/25 bg-primary/[0.06] p-6">
            <div>
              <div className="font-display text-lg font-semibold tracking-tight">Run your own numbers</div>
              <p className="mt-1 text-sm text-muted-foreground">Every study above uses free calculators. No account needed for your first run.</p>
            </div>
            <Link
              to="/calculators"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[12px] font-bold uppercase tracking-[0.18em] text-primary-foreground"
            >
              Try the calculators <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <StickyMobileCta />
    </div>
  );
}
