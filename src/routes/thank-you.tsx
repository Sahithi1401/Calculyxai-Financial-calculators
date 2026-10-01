import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CheckCircle2, Share2 } from "lucide-react";
import { Navbar } from "@/components/finflow/navbar";
import { Footer } from "@/components/finflow/footer";
import { SupportPromise } from "@/components/finflow/support-promise";
import { pageHead } from "@/lib/seo";

type Source = "newsletter" | "contact" | "signup" | "generic";

const COPY: Record<Source, { kicker: string; title: string; body: string; next: string }> = {
  newsletter: {
    kicker: "Subscribed",
    title: "You're on the list",
    body: "Your email is confirmed for the weekly Calculyx AI digest — market moves, new calculators and product updates. A welcome email is on its way; check spam if it hasn't landed in a few minutes.",
    next: "While you wait, run a calculation.",
  },
  contact: {
    kicker: "Message sent",
    title: "Your message reached us",
    body: "Thanks for writing in. Your message has been delivered to the Calculyx AI inbox and we reply to every email within one business day.",
    next: "Meanwhile, here's where most people start.",
  },
  signup: {
    kicker: "Account created",
    title: "Welcome to Calculyx AI",
    body: "Your account is ready. If email confirmation is pending, click the link we just sent to unlock saved reports, PDF exports and the portfolio tracker.",
    next: "Three things worth doing first.",
  },
  generic: {
    kicker: "All done",
    title: "Thank you",
    body: "That went through. Here's what to do next on Calculyx AI.",
    next: "Popular next steps.",
  },
};

const NEXT_CALCS = [
  { to: "/calc/sip", name: "SIP Calculator", desc: "Project mutual fund wealth from a monthly investment." },
  { to: "/calc/home-loan", name: "Home Loan EMI", desc: "EMI, amortisation and prepayment savings by bank." },
  { to: "/calc/income-tax", name: "Income Tax", desc: "India new regime, US federal brackets and UAE nil tax." },
] as const;

export const Route = createFileRoute("/thank-you")({
  validateSearch: (search: Record<string, unknown>) => ({
    source: (typeof search.source === "string" ? search.source : "generic") as Source,
  }),
  head: () =>
    pageHead({
      title: "Thank You — Calculyx AI",
      description:
        "Your submission went through. Here's what happens next, when to expect a reply, and three calculators worth trying while you wait.",
      path: "/thank-you",
      noindex: true,
    }),
  component: ThankYouPage,
});

function ThankYouPage() {
  const { source } = Route.useSearch();
  const copy = COPY[source as Source] ?? COPY.generic;

  return (
    <div className="bg-page-gradient min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-6">
          <div className="rounded-3xl border border-primary/25 bg-primary/[0.05] p-6 sm:p-10">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
              <CheckCircle2 className="h-4 w-4" aria-hidden /> {copy.kicker}
            </div>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{copy.body}</p>
            <SupportPromise variant="inline" className="mt-6" />
          </div>

          <h2 className="mt-12 font-display text-2xl font-semibold tracking-tight">{copy.next}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {NEXT_CALCS.map((c) => (
              <Link
                key={c.to}
                to={c.to as "/"}
                className="group rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur-md transition hover:border-primary/40"
              >
                <div className="text-sm font-medium group-hover:text-primary">{c.name}</div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{c.desc}</p>
              </Link>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              to="/case-studies"
              className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/40 px-4 py-4 backdrop-blur-md transition hover:border-primary/40"
            >
              <span className="flex items-center gap-2.5 text-sm">
                <BookOpen className="h-4 w-4 text-primary" aria-hidden /> Read the worked case studies
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden />
            </Link>
            <a
              href="https://www.linkedin.com/company/calculyxai/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/40 px-4 py-4 backdrop-blur-md transition hover:border-primary/40"
            >
              <span className="flex items-center gap-2.5 text-sm">
                <Share2 className="h-4 w-4 text-primary" aria-hidden /> Follow us on LinkedIn
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden />
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/calculators"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[12px] font-bold uppercase tracking-[0.18em] text-primary-foreground"
            >
              Try the calculators <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <Link
              to="/faq"
              className="inline-flex min-h-11 items-center rounded-xl border border-border/70 px-5 text-[12px] font-medium"
            >
              Read the FAQ
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
