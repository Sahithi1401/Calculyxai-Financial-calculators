import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircleQuestion } from "lucide-react";
import { Navbar } from "@/components/finflow/navbar";
import { Footer } from "@/components/finflow/footer";
import { Breadcrumbs } from "@/components/finflow/breadcrumbs";
import { SupportPromise } from "@/components/finflow/support-promise";
import { StickyMobileCta } from "@/components/finflow/sticky-cta";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_GROUPS, ALL_FAQS } from "@/lib/finflow/faq-data";
import { faqSchema, pageHead } from "@/lib/seo";

const CRUMBS = [{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }];

export const Route = createFileRoute("/faq")({
  head: () =>
    pageHead({
      title: "Frequently Asked Questions — Calculyx AI",
      description:
        "Answers on pricing, calculator accuracy, live market data sources, the AI assistant, privacy and account deletion — 28 questions about how Calculyx AI works.",
      path: "/faq",
      keywords: "calculyx ai faq, financial calculator accuracy, market data sources, ai finance assistant, is calculyx free",
      crumbs: CRUMBS,
      schemas: [faqSchema(ALL_FAQS)],
    }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="bg-page-gradient min-h-screen">
      <Navbar />
      <main className="pt-20 pb-24 sm:pt-24 md:pb-16">
        <Breadcrumbs items={CRUMBS} className="pt-4" />

        <header className="mx-auto max-w-3xl px-5 pt-8 sm:px-6 sm:pt-12">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <MessageCircleQuestion className="h-4 w-4" aria-hidden /> Help centre
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Frequently asked <span className="font-serif italic text-primary">questions</span>
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Everything about pricing, accuracy, data sources, the AI assistant and your privacy.
            Still stuck? <Link to="/contact" className="text-primary underline underline-offset-4">Send us a message</Link>.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {FAQ_GROUPS.map((g) => (
              <a
                key={g.id}
                href={`#${g.id}`}
                className="rounded-full border border-border/60 bg-card/40 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur transition hover:border-primary/40 hover:text-foreground"
              >
                {g.title}
              </a>
            ))}
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-5 sm:px-6">
          {FAQ_GROUPS.map((group) => (
            <section key={group.id} id={group.id} className="mt-12 scroll-mt-28">
              <h2 className="font-display text-2xl font-semibold tracking-tight">{group.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{group.blurb}</p>
              <Accordion type="single" collapsible className="mt-5 space-y-2">
                {group.items.map((f, i) => (
                  <AccordionItem
                    key={f.q}
                    value={`${group.id}-${i}`}
                    className="rounded-xl border border-border/60 bg-card/50 px-4 backdrop-blur-md"
                  >
                    <AccordionTrigger className="text-left text-[15px] font-medium hover:no-underline">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}

          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            <SupportPromise />
            <div className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-md">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Still deciding?
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Read four worked scenarios with real numbers, or open a calculator and try it yourself.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/case-studies"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-[12px] font-bold uppercase tracking-[0.16em] text-primary-foreground"
                >
                  Case studies <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
                <Link
                  to="/calculators"
                  className="inline-flex min-h-11 items-center rounded-xl border border-border/70 px-4 text-[12px] font-medium"
                >
                  Try the calculators
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <StickyMobileCta />
    </div>
  );
}
