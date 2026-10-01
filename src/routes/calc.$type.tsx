import { createFileRoute, notFound, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Navbar } from "@/components/finflow/navbar";
import { Footer } from "@/components/finflow/footer";
import { CALC_BY_SLUG, type CalcSlug } from "@/lib/finflow/registry";
import { CurrencyCalc } from "@/components/finflow/calcs/currency-calc";
import { EmiCalc } from "@/components/finflow/calcs/emi-calc";
import { SipCalc } from "@/components/finflow/calcs/sip-calc";
import { FdCalc } from "@/components/finflow/calcs/fd-calc";
import { SimpleCalc } from "@/components/finflow/calcs/simple-calc";
import { PropertyCalc } from "@/components/finflow/calcs/property-calc";
import { HomeLoanEngine } from "@/components/finflow/calcs/home-loan-engine";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShareButtons } from "@/components/finflow/share-buttons";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { StickyMobileCta } from "@/components/finflow/sticky-cta";
import { NextStepCard } from "@/components/finflow/next-step";
import {
  CALC_SEO, RELATED_CALCS, breadcrumbSchema, howToSchema,
  softwareAppSchema, faqSchema, datasetSchema, SITE,
} from "@/lib/seo";


const VALID: CalcSlug[] = ["currency", "mortgage", "home-loan", "income-tax", "gst", "salary", "sip", "fd", "compound-interest", "inflation", "retirement", "property"];

const ANON_USAGE_KEY = "calcyx.anonCalcUsed";

export const Route = createFileRoute("/calc/$type")({
  beforeLoad: ({ params }) => {
    if (!VALID.includes(params.type as CalcSlug)) throw notFound();
  },
  head: ({ params }) => {
    const meta = CALC_BY_SLUG[params.type as CalcSlug];
    const name = meta?.name ?? "Calculator";
    const seo = CALC_SEO[params.type];
    const fallback = {
      title: `${name} — Calculyx AI`,
      description: meta?.tagline ?? "Free financial calculator by Calculyx AI.",
      keywords: `${name.toLowerCase()}, calculator, finance`,
      steps: ["Enter your inputs.", "Review the calculation.", "Export or share the result."],
      faqs: [] as Array<{ q: string; a: string }>,
      live: false,
    };
    const s = seo ?? fallback;
    const url = `${SITE.url}/calc/${params.type}`;
    const nowIso = new Date().toISOString();
    const scripts: Array<{ type: string; children: string }> = [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          softwareAppSchema({ name: `${name} — Calculyx AI`, description: s.description, url }),
        ),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(howToSchema(`How to use the ${name}`, s.steps)),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Calculators", path: "/calculators" },
            { name, path: `/calc/${params.type}` },
          ]),
        ),
      },
    ];
    if (s.faqs && s.faqs.length > 0) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify(faqSchema(s.faqs)),
      });
    }
    if (s.live) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify(
          datasetSchema({ name: s.title, description: s.description, url, dateModified: nowIso }),
        ),
      });
    }
    const metaTags: Array<Record<string, string>> = [
      { title: s.title },
      { name: "description", content: s.description },
      { name: "keywords", content: s.keywords },
      { property: "og:title", content: s.title },
      { property: "og:description", content: s.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: SITE.ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: s.title },
      { name: "twitter:description", content: s.description },
      { name: "twitter:image", content: SITE.ogImage },
    ];
    if (s.live) {
      metaTags.push({ property: "og:updated_time", content: nowIso });
    }
    return {
      meta: metaTags,
      links: [{ rel: "canonical", href: url }],
      scripts,
    };
  },

  component: CalcPage,
});

function CalcPage() {
  const { type } = Route.useParams();
  const slug = type as CalcSlug;
  const meta = CALC_BY_SLUG[slug];
  const seo = CALC_SEO[slug];
  const related = RELATED_CALCS[slug] ?? [];
  const navigate = useNavigate();
  const [gateChecked, setGateChecked] = useState(false);

  // Anonymous-user gate: allow 1 calculator visit for free, then require sign-in.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled) return;
      if (data.user) {
        setGateChecked(true);
        return;
      }
      const used = typeof window !== "undefined" && window.localStorage.getItem(ANON_USAGE_KEY) === "1";
      if (used) {
        toast.info("Sign in to keep using the calculators — your first calculation was free.");
        navigate({ to: "/auth", search: { redirect: `/calc/${slug}` } as never });
        return;
      }
      try { window.localStorage.setItem(ANON_USAGE_KEY, "1"); } catch { /* ignore */ }
      setGateChecked(true);
    })();
    return () => { cancelled = true; };
  }, [navigate, slug]);

  if (!gateChecked) {
    return (
      <>
        <Navbar />
        <main className="pt-28 pb-16 text-center text-sm text-muted-foreground">Loading calculator…</main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pb-24 md:pb-0">
        {/* Visible breadcrumb mirroring BreadcrumbList JSON-LD */}
        <nav
          aria-label="Breadcrumb"
          className="mx-auto max-w-6xl px-4 sm:px-6 pt-24 sm:pt-28 pb-0 text-xs text-muted-foreground"
        >
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li aria-hidden><ChevronRight className="h-3.5 w-3.5 opacity-60" /></li>
            <li><Link to="/calculators" className="hover:text-primary transition-colors">Calculators</Link></li>
            <li aria-hidden><ChevronRight className="h-3.5 w-3.5 opacity-60" /></li>
            <li className="text-foreground/90">{meta?.name ?? "Calculator"}</li>
          </ol>
        </nav>

        {slug === "currency" && <CurrencyCalc />}
        {slug === "mortgage" && <EmiCalc slug="mortgage" defaultRate={6.8} defaultYears={30} defaultPrincipal={400000} />}
        {slug === "home-loan" && <HomeLoanEngine />}
        {slug === "sip" && <SipCalc />}
        {slug === "fd" && <FdCalc />}
        {slug === "property" && <PropertyCalc />}
        {["compound-interest", "inflation", "retirement", "gst", "income-tax", "salary"].includes(slug) && <SimpleCalc slug={slug} />}

        <NextStepCard next={related[0]} rest={related.slice(1)} />

        {/* Visible FAQ accordion (mirrors FAQPage JSON-LD) */}
        {seo?.faqs && seo.faqs.length > 0 && (
          <section className="mx-auto max-w-4xl px-4 py-16" aria-labelledby="calc-faq-heading">
            <h2 id="calc-faq-heading" className="text-3xl font-serif italic tracking-tight text-foreground/95 mb-8">
              Frequently asked <span className="text-primary">questions</span>
            </h2>
            <Accordion type="single" collapsible className="rounded-2xl border border-sheen glass divide-y divide-border/40">
              {seo.faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-0 px-5">
                  <AccordionTrigger className="text-left text-base font-medium">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* Share the calculation */}
        <section className="mx-auto max-w-4xl px-4 pb-4">
          <ShareButtons
            title={`${meta?.name ?? "Calculator"} — Calculyx AI`}
            url={`${SITE.url}/calc/${slug}`}
            text={`I just ran the ${meta?.name ?? "financial"} on Calculyx AI —`}
            label="Share this calculator"
          />
        </section>

        {/* Related calculators for internal linking / topical clusters */}
        {related.length > 0 && (
          <section className="mx-auto max-w-4xl px-4 pb-20" aria-labelledby="related-calcs-heading">
            <h2 id="related-calcs-heading" className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">
              Related tools
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/calc/$type"
                  params={{ type: r.slug }}
                  className="group rounded-2xl border border-sheen glass p-4 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-foreground/95 group-hover:text-primary">
                      {r.label}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{r.blurb}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
      <StickyMobileCta variant="calculator" />
    </>
  );
}
