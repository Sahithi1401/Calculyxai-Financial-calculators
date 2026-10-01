import { pageHead } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, LineChart } from "lucide-react";
import { Navbar } from "@/components/finflow/navbar";
import { Breadcrumbs } from "@/components/finflow/breadcrumbs";
import { Footer } from "@/components/finflow/footer";
import { CalculatorsGrid } from "@/components/finflow/calculators-grid";
import { StickyMobileCta } from "@/components/finflow/sticky-cta";

export const Route = createFileRoute("/calculators")({
  head: () =>
    pageHead({
      title: "All 12 Financial Calculators — Calculyx AI",
      description:
        "Twelve precision calculators for currency, mortgage, home loan, SIP, FD, income tax, GST, salary, property, retirement, inflation and compound interest.",
      path: "/calculators",
      crumbs: [{ name: "Home", path: "/" }, { name: "Calculators", path: "/calculators" }],
    }),
  component: () => (
    <div className="bg-page-gradient min-h-screen">
      <Navbar />
      <main className="pt-20 pb-24 sm:pt-24 md:pb-0">
        <Breadcrumbs
          items={[{ name: "Home", path: "/" }, { name: "Calculators", path: "/calculators" }]}
          className="pt-4"
        />
        <div className="mx-auto max-w-7xl px-4 pt-8 text-center sm:px-6 sm:pt-12">
          <div className="text-sm font-medium text-primary">Full library</div>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            All <span className="font-serif italic text-primary">calculators</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[14px] text-muted-foreground sm:text-base">
            Pick a calculator to run precise, country-aware financial math. Every result is an estimate — verify with your bank before deciding.
          </p>
          <Link to="/investing-calculators" className="mx-auto mt-6 inline-flex max-w-full items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-4 py-2 text-[13px] font-medium text-primary hover:bg-primary/20 sm:text-sm">
            <LineChart className="h-4 w-4 shrink-0" /> <span className="truncate">Explore 15 investing calculators (SIP, CAGR, Brokerage, FIRE, SWP…)</span> <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
          </Link>
        </div>
        <CalculatorsGrid />
      </main>
      <Footer />
      <StickyMobileCta />
    </div>
  ),

});
