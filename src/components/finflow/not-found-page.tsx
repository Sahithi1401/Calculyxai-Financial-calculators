import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Compass, LifeBuoy, Search } from "lucide-react";
import { FinFlowLogo } from "@/components/finflow/logo";
import { SemanticSearch } from "@/components/finflow/semantic-search";
import { CALC_BY_SLUG } from "@/lib/finflow/registry";

const POPULAR = ["sip", "home-loan", "income-tax", "gst", "mortgage", "fd"] as const;

const DESTINATIONS = [
  { to: "/", label: "Home", desc: "Start from the top" },
  { to: "/calculators", label: "All calculators", desc: "27 precision tools" },
  { to: "/stocks", label: "Stocks", desc: "Live market intelligence" },
  { to: "/ai", label: "AI Assistant", desc: "Ask a finance question" },
] as const;

const REPORT_MAILTO =
  "mailto:balaji04@calculyxai.online?subject=Broken%20link%20on%20Calculyx%20AI&body=I%20hit%20a%20404%20on%20this%20page%3A%20";

/**
 * Branded 404. Used both by the root `notFoundComponent` (unmatched URLs,
 * which already return HTTP 404) and by the addressable `/404` route.
 */
export function NotFoundPage() {
  // notFoundComponent cannot contribute to head(), so set robots here.
  useEffect(() => {
    const existing = document.querySelector('meta[name="robots"][data-nf="1"]');
    if (existing) return;
    const m = document.createElement("meta");
    m.setAttribute("name", "robots");
    m.setAttribute("content", "noindex, follow");
    m.setAttribute("data-nf", "1");
    document.head.appendChild(m);
    const prevTitle = document.title;
    document.title = "Page not found (404) — Calculyx AI";
    return () => {
      m.remove();
      document.title = prevTitle;
    };
  }, []);

  const href =
    typeof window !== "undefined"
      ? REPORT_MAILTO + encodeURIComponent(window.location.href)
      : REPORT_MAILTO;

  return (
    <div className="relative min-h-screen overflow-hidden bg-page-gradient">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-18%] h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 py-16 sm:px-6 sm:py-24">
        <Link to="/" aria-label="Calculyx AI home" className="inline-flex">
          <FinFlowLogo className="h-8 w-auto text-foreground" />
        </Link>

        <div className="mt-10 font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
          Error 404
        </div>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          This page doesn&apos;t <span className="font-serif italic text-primary">compute</span>.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          The URL is stale, mistyped, or the module was retired. Nothing is broken with your
          account — let&apos;s get you to the number you were after.
        </p>

        {/* Search */}
        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur-md">
          <Search className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span className="text-sm text-muted-foreground">
            Search guides, calculators, tax rules and stocks:
          </span>
          <SemanticSearch />
        </div>

        {/* Popular calculators */}
        <h2 className="mt-12 font-mono text-[10px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
          Most used calculators
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR.map((slug) => {
            const c = CALC_BY_SLUG[slug];
            if (!c) return null;
            const Icon = c.icon;
            return (
              <Link
                key={slug}
                to="/calc/$type"
                params={{ type: slug }}
                className="group flex items-start gap-3 rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur-md transition hover:border-primary/40"
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${c.accent} text-white`}>
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium group-hover:text-primary">{c.name}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{c.tagline}</span>
                </span>
              </Link>
            );
          })}
        </div>

        {/* Destinations */}
        <h2 className="mt-12 font-mono text-[10px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
          Or head somewhere else
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {DESTINATIONS.map((d) => (
            <Link
              key={d.to}
              to={d.to as "/"}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/40 px-4 py-3.5 backdrop-blur-md transition hover:border-primary/40"
            >
              <span>
                <span className="block text-sm font-medium group-hover:text-primary">{d.label}</span>
                <span className="block text-xs text-muted-foreground">{d.desc}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-border/60 pt-6 text-sm">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 text-muted-foreground transition hover:text-primary"
          >
            <Compass className="h-4 w-4" aria-hidden /> Read the FAQ
          </Link>
          <a
            href={href}
            className="inline-flex items-center gap-2 text-muted-foreground transition hover:text-primary"
          >
            <LifeBuoy className="h-4 w-4" aria-hidden /> Report a broken link
          </a>
        </div>
      </div>
    </div>
  );
}
