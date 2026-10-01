import type { ReactNode } from "react";
import { Navbar } from "@/components/finflow/navbar";
import { Footer } from "@/components/finflow/footer";
import { Breadcrumbs } from "@/components/finflow/breadcrumbs";
import type { Crumb } from "@/lib/seo";

interface LegalLayoutProps {
  kicker?: string;
  title: ReactNode;
  updated?: string;
  intro?: ReactNode;
  crumbs?: Crumb[];
  children: ReactNode;
}

/**
 * Shared visual shell for all legal / policy pages so terms, privacy,
 * disclaimer, cookies, ai-usage, security, etc. all feel like one system.
 */
export function LegalLayout({
  kicker = "Legal",
  title,
  updated = "November 17, 2026",
  intro,
  crumbs,
  children,
}: LegalLayoutProps) {
  return (
    <div className="bg-page-gradient min-h-screen">
      <Navbar />
      <main className="pt-24">
        {crumbs && crumbs.length > 0 && (
          <Breadcrumbs items={crumbs} className="max-w-3xl px-6 pt-4" />
        )}
        <article className="mx-auto max-w-3xl px-6 py-12">
          <div className="text-sm font-medium text-primary">{kicker}</div>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>
          {intro && <div className="mt-6">{intro}</div>}

          <div
            className="prose prose-slate mt-8 max-w-none text-[15px] leading-7 text-foreground/90
              [&>h2]:mt-10 [&>h2]:font-display [&>h2]:text-2xl [&>h2]:font-semibold
              [&>h3]:mt-6 [&>h3]:font-display [&>h3]:text-lg [&>h3]:font-semibold
              [&>p]:mt-3 [&>ul]:mt-3 [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mt-1
              [&>ol]:mt-3 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol>li]:mt-1"
          >
            {children}
          </div>
        </article>
        <Footer />
      </main>
    </div>
  );
}

export const LEGAL_EMAIL = "balaji04@calculyxai.online";
export const LEGAL_LOCATION = "Visakhapatnam, Andhra Pradesh, India";

export function ContactBlock({ label = "Contact" }: { label?: string }) {
  return (
    <>
      <h2>{label}</h2>
      <p>
        For questions about this page, write to{" "}
        <a
          href={`mailto:${LEGAL_EMAIL}`}
          className="text-primary underline underline-offset-4"
        >
          {LEGAL_EMAIL}
        </a>
        .
      </p>
      <p>
        <strong>Calculyx AI</strong>
        <br />
        {LEGAL_LOCATION}
      </p>
    </>
  );
}
