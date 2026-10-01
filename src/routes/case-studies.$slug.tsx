import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Info, Quote } from "lucide-react";
import { Navbar } from "@/components/finflow/navbar";
import { Footer } from "@/components/finflow/footer";
import { Breadcrumbs } from "@/components/finflow/breadcrumbs";
import { ShareButtons } from "@/components/finflow/share-buttons";
import { StickyMobileCta } from "@/components/finflow/sticky-cta";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CASE_STUDIES, CASE_STUDY_BY_SLUG, ILLUSTRATIVE_NOTICE,
} from "@/lib/finflow/case-studies";
import { faqSchema, pageHead, SITE } from "@/lib/seo";

type LiveMode = "emi" | "inflation" | "gst";

const LIVE_BY_SLUG: Record<string, { mode: LiveMode; label: string }> = {
  "bengaluru-engineer-rent-vs-buy": { mode: "emi", label: "Live EMI on the ₹85 lakh loan" },
  "us-couple-mortgage-refinance": { mode: "emi", label: "Live payment on the refinance" },
  "dubai-nri-retirement-corpus": { mode: "inflation", label: "Live inflation-adjusted expenses" },
  "small-business-gst-cash-flow": { mode: "gst", label: "Live GST split on an invoice" },
};

export const Route = createFileRoute("/case-studies/$slug")({
  beforeLoad: ({ params }) => {
    if (!CASE_STUDY_BY_SLUG[params.slug]) throw notFound();
  },
  head: ({ params }) => {
    const c = CASE_STUDY_BY_SLUG[params.slug];
    if (!c) {
      return pageHead({
        title: "Case Study Not Found — Calculyx AI",
        description: "This case study is unavailable. Browse all Calculyx AI worked scenarios instead.",
        path: `/case-studies/${params.slug}`,
        noindex: true,
      });
    }
    const path = `/case-studies/${c.slug}`;
    const crumbs = [
      { name: "Home", path: "/" },
      { name: "Case Studies", path: "/case-studies" },
      { name: c.short, path },
    ];
    return pageHead({
      title: c.seoTitle,
      description: c.seoDescription,
      path,
      ogType: "article",
      crumbs,
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: c.title,
          description: c.seoDescription,
          about: c.short,
          url: `${SITE.url}${path}`,
          author: { "@type": "Organization", name: SITE.name, url: SITE.url },
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
          isAccessibleForFree: true,
          disambiguatingDescription: ILLUSTRATIVE_NOTICE,
        },
        faqSchema(c.faqs),
      ],
    });
  },
  component: CaseStudyPage,
  notFoundComponent: () => (
    <div className="bg-page-gradient min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pt-32 pb-24 text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Case study not found</h1>
        <p className="mt-3 text-muted-foreground">That study may have been renamed. Browse them all instead.</p>
        <Link to="/case-studies" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-[12px] font-bold uppercase tracking-[0.18em] text-primary-foreground">
          All case studies
        </Link>
      </main>
      <Footer />
    </div>
  ),
});

function CaseStudyPage() {
  const { slug } = Route.useParams();
  const c = CASE_STUDY_BY_SLUG[slug];
  if (!c) return null;
  const live = LIVE_BY_SLUG[slug] ?? { mode: "emi" as LiveMode, label: "Live calculator" };
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Case Studies", path: "/case-studies" },
    { name: c.short, path: `/case-studies/${c.slug}` },
  ];
  const others = CASE_STUDIES.filter((o) => o.slug !== c.slug).slice(0, 3);

  return (
    <div className="bg-page-gradient min-h-screen">
      <Navbar />
      <main className="pt-20 pb-24 sm:pt-24 md:pb-16">
        <Breadcrumbs items={crumbs} className="pt-4" />

        <article className="mx-auto max-w-3xl px-5 pt-8 sm:px-6 sm:pt-12">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span aria-hidden>{c.flag}</span>
            <span>{c.location}</span>
            <span aria-hidden>·</span>
            <span>{c.persona}</span>
            <span aria-hidden>·</span>
            <span>{c.readMinutes} min read</span>
          </div>

          <h1 className="mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">
            {c.title}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{c.summary}</p>

          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-warning/25 bg-warning/5 p-3.5 text-xs leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
            <span>{ILLUSTRATIVE_NOTICE}</span>
          </div>

          {/* Headline metrics */}
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {c.metrics.map((m) => (
              <div key={m.label} className="rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur-md">
                <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">{m.label}</div>
                <div className="mt-1 font-mono text-lg tabular-nums text-primary">{m.value}</div>
                {m.note && <div className="mt-1 text-[11px] leading-snug text-muted-foreground">{m.note}</div>}
              </div>
            ))}
          </div>

          <Section title="Situation">
            {c.situation.map((p) => (
              <p key={p} className="mt-3 text-[15px] leading-7 text-foreground/90">{p}</p>
            ))}
          </Section>

          <Section title="What they calculated">
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {c.calculated.map((t) => (
                <Link
                  key={t.tool}
                  to={t.path as "/"}
                  className="group rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur-md transition hover:border-primary/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium group-hover:text-primary">{t.tool}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{t.why}</p>
                </Link>
              ))}
            </div>

            <h3 className="mt-8 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Inputs used
            </h3>
            <dl className="mt-3 grid gap-x-6 gap-y-2 rounded-2xl border border-border/60 bg-card/30 p-4 backdrop-blur-md sm:grid-cols-2">
              {c.inputs.map((i) => (
                <div key={i.label} className="flex items-baseline justify-between gap-3 border-b border-border/40 py-1.5 last:border-0">
                  <dt className="text-xs text-muted-foreground">{i.label}</dt>
                  <dd className="font-mono text-xs tabular-nums text-foreground/90">{i.value}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section title="The numbers">
            <ul className="mt-4 space-y-2.5">
              {c.numbers.map((n) => (
                <li key={n} className="flex gap-3 text-[15px] leading-7 text-foreground/90">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>{n}</span>
                </li>
              ))}
            </ul>

            {/* Embedded live calculator */}
            <div className="mt-7 rounded-2xl border border-primary/25 bg-primary/[0.05] p-5">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
                {live.label}
              </div>
              <MiniCalc mode={live.mode} slug={c.slug} />
            </div>
          </Section>

          <Section title="Outcome">
            {c.outcome.map((p) => (
              <p key={p} className="mt-3 text-[15px] leading-7 text-foreground/90">{p}</p>
            ))}
          </Section>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/25 bg-primary/[0.06] p-6">
            <div>
              <div className="font-display text-lg font-semibold tracking-tight">Run the same calculation</div>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">{c.cta.blurb}</p>
            </div>
            <Link
              to={c.cta.path as "/"}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[12px] font-bold uppercase tracking-[0.18em] text-primary-foreground"
            >
              {c.cta.label} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>

          {c.faqs.length > 0 && (
            <Section title="Questions this raises">
              <Accordion type="single" collapsible className="mt-4 space-y-2">
                {c.faqs.map((f, i) => (
                  <AccordionItem key={f.q} value={`f${i}`} className="rounded-xl border border-border/60 bg-card/50 px-4 backdrop-blur-md">
                    <AccordionTrigger className="text-left text-[15px] font-medium hover:no-underline">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Section>
          )}

          <div className="mt-10">
            <ShareButtons
              title={c.seoTitle}
              url={`${SITE.url}/case-studies/${c.slug}`}
              text={`A worked ${c.short} case study on Calculyx AI —`}
              label="Share this case study"
            />
          </div>

          <Section title="More case studies">
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  to="/case-studies/$slug"
                  params={{ slug: o.slug }}
                  className="group rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur-md transition hover:border-primary/40"
                >
                  <span className="text-xs text-muted-foreground" aria-hidden>{o.flag}</span>
                  <div className="mt-1 text-sm font-medium group-hover:text-primary">{o.short}</div>
                </Link>
              ))}
            </div>
          </Section>

          <p className="mt-10 flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
            <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
            No quote on this page is attributed to a real individual. Figures are modelled with the
            public Calculyx AI calculators using the inputs listed above.
          </p>
        </article>
      </main>
      <Footer />
      <StickyMobileCta />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

/* ---------------- Embedded live mini calculators ---------------- */

const PRESETS: Record<string, { a: number; b: number; c: number }> = {
  "bengaluru-engineer-rent-vs-buy": { a: 8500000, b: 8.6, c: 20 },
  "us-couple-mortgage-refinance": { a: 420000, b: 5.9, c: 25 },
  "dubai-nri-retirement-corpus": { a: 90000, b: 6, c: 19 },
  "small-business-gst-cash-flow": { a: 100000, b: 18, c: 0 },
};

function MiniCalc({ mode, slug }: { mode: LiveMode; slug: string }) {
  const p = PRESETS[slug] ?? { a: 1000000, b: 8, c: 20 };
  const [a, setA] = useState(p.a);
  const [b, setB] = useState(p.b);
  const [cVal, setCVal] = useState(p.c);

  const result = useMemo(() => {
    if (mode === "emi") {
      const r = b / 100 / 12;
      const n = cVal * 12;
      if (!r || !n) return { main: "—", sub: "" };
      const emi = (a * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const total = emi * n;
      return {
        main: fmt(emi),
        sub: `Total paid ${fmt(total)} · Total interest ${fmt(total - a)}`,
      };
    }
    if (mode === "inflation") {
      const fv = a * Math.pow(1 + b / 100, cVal);
      return { main: fmt(fv), sub: `${fmt(a)} today, inflated at ${b}% for ${cVal} years` };
    }
    const base = a;
    const gst = (base * b) / 100;
    return { main: fmt(base + gst), sub: `GST ${fmt(gst)} · CGST ${fmt(gst / 2)} · SGST ${fmt(gst / 2)}` };
  }, [a, b, cVal, mode]);

  const labels =
    mode === "emi"
      ? ["Loan amount", "Interest rate (%)", "Tenure (years)"]
      : mode === "inflation"
        ? ["Monthly expenses today", "Inflation (%)", "Years"]
        : ["Invoice value (excl. GST)", "GST rate (%)", ""];

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label={labels[0]} value={a} onChange={setA} step={1000} />
        <Field label={labels[1]} value={b} onChange={setB} step={0.1} />
        {labels[2] && <Field label={labels[2]} value={cVal} onChange={setCVal} step={1} />}
      </div>
      <div className="rounded-xl border border-border/60 bg-background/50 p-4 sm:min-w-[200px]">
        <div className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground">
          {mode === "emi" ? "Monthly payment" : mode === "inflation" ? "Future value" : "Invoice total"}
        </div>
        <div className="mt-1 font-mono text-2xl tabular-nums text-primary">{result.main}</div>
        <div className="mt-1 text-[11px] leading-snug text-muted-foreground">{result.sub}</div>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, step,
}: { label: string; value: number; onChange: (v: number) => void; step: number }) {
  const id = `mini-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="block font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        type="number"
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 min-h-11 w-full rounded-xl border border-border/60 bg-background/50 px-3 font-mono text-sm tabular-nums outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function fmt(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}
