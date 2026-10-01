import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { supabase } from "@/integrations/supabase/client";

import appCss from "../styles.css?url";
import interWoff2 from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
import frauncesWoff2 from "@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { PrismBackground } from "@/components/prism/PrismBackground";
import { PremiumBackdrop } from "@/components/finflow/premium-backdrop";

import { StatusShell, StatusButton } from "@/components/finflow/status-shell";
import { NotFoundPage } from "@/components/finflow/not-found-page";
import { RouteProgress } from "@/components/finflow/route-progress";
import { OnboardingModal } from "@/components/finflow/onboarding/onboarding-modal";
import { AlertTriangle } from "lucide-react";

function NotFoundComponent() {
  return <NotFoundPage />;
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "root" }); }, [error]);
  return (
    <StatusShell
      code="500"
      kicker="Something broke"
      title="A calculation didn't converge."
      description="An unexpected error occurred while loading this view. Our monitors were notified. You can retry or head back home."
      icon={<AlertTriangle className="h-10 w-10 text-primary" strokeWidth={1.5} />}
      actions={
        <>
          <StatusButton onClick={() => { router.invalidate(); reset(); }}>Try again</StatusButton>
          <StatusButton href="/" variant="ghost">Go home</StatusButton>
        </>
      }
    />
  );
}

function PendingComponent() {
  return (
    <div role="status" aria-live="polite" className="grid min-h-[70vh] place-items-center px-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-2 border-muted" />
          <div className="loader-ring absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary/40" />
          <div className="absolute inset-3 rounded-full bg-primary/10 blur-md" />
          <div className="absolute inset-0 grid place-items-center font-display text-lg font-semibold text-primary">C</div>
        </div>
        <p className="mt-6 font-display text-lg font-medium tracking-tight">Preparing your view</p>
        <p className="mt-1 text-sm text-muted-foreground">Crunching the latest numbers…</p>
        <div className="mt-5 h-1 w-48 overflow-hidden rounded-full bg-muted">
          <div className="loader-sweep h-full w-1/3 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}

// re-export for router
export { NotFoundComponent as __NotFoundComponent, ErrorComponent as __ErrorComponent, PendingComponent as __PendingComponent };


export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Calculyx AI — AI Financial Intelligence Platform" },
      { name: "description", content: "AI-powered financial intelligence: live stock analysis, portfolio tracking, market insights, and 27+ investing, loan, tax, SIP and retirement calculators." },
      { name: "keywords", content: "AI Financial Platform, Financial Intelligence, Financial Dashboard, Stock Analysis, Stock Screener, Portfolio Tracker, Investment Planner, Home Loan Calculator, Mortgage Calculator, EMI Calculator, Income Tax Calculator, GST Calculator, Salary Calculator, Currency Converter, Retirement Planner, SIP Calculator, FD Calculator, Compound Interest Calculator, Inflation Calculator, AI Financial Advisor, Technical Analysis, Fundamental Analysis, Stock Comparison, Portfolio Analytics" },
      { name: "author", content: "Calculyx AI" },
      { name: "publisher", content: "Calculyx AI" },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" },
      { name: "googlebot", content: "index,follow,max-image-preview:large,max-snippet:-1" },
      { name: "google-site-verification", content: "6Lmj_Dk-unmyQ6UTpYvZgqELy_BcvIrqEzYMoumOD1w" },
      { name: "msvalidate.01", content: "REPLACE_WITH_BING_VERIFICATION" },
      { name: "yandex-verification", content: "REPLACE_WITH_YANDEX_VERIFICATION" },
      { name: "application-name", content: "Calculyx AI" },
      { name: "apple-mobile-web-app-title", content: "Calculyx AI" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "theme-color", content: "#0b0d17" },
      { name: "format-detection", content: "telephone=no" },
      { httpEquiv: "content-language", content: "en" },
      { property: "og:site_name", content: "Calculyx AI" },
      { property: "og:title", content: "Calculyx AI | AI Financial Intelligence Platform" },
      { property: "og:description", content: "AI-powered stock analysis, portfolio tracking, real-time market insights, and 27+ financial calculators — mortgage, tax, SIP, FD, retirement, and more." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/Zcyf67suT1X8dViAUyZ1AtzEANT2/social-images/social-1784106017880-WhatsApp_Image_2026-07-11_at_13.44.35.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Calculyx AI | AI Financial Intelligence Platform" },
      { name: "twitter:description", content: "AI-powered stock analysis, portfolio tracking, market insights, and 27+ financial calculators." },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/Zcyf67suT1X8dViAUyZ1AtzEANT2/social-images/social-1784106017880-WhatsApp_Image_2026-07-11_at_13.44.35.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://vicqsyotbigtztnbnueb.supabase.co", crossOrigin: "anonymous" } as unknown as { rel: string },
      { rel: "dns-prefetch", href: "https://vicqsyotbigtztnbnueb.supabase.co" },
      { rel: "dns-prefetch", href: "https://api.groq.com" },
      { rel: "dns-prefetch", href: "https://finnhub.io" },
      { rel: "preload", as: "font", type: "font/woff2", href: frauncesWoff2, crossOrigin: "anonymous", fetchpriority: "high" } as unknown as { rel: string },
      { rel: "preload", as: "font", type: "font/woff2", href: interWoff2, crossOrigin: "anonymous" } as unknown as { rel: string },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", href: "/favicon.svg", sizes: "any" },
      { rel: "icon", type: "image/svg+xml", sizes: "32x32", href: "/favicon.svg" },
      { rel: "icon", type: "image/svg+xml", sizes: "16x16", href: "/favicon.svg" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],

    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Calculyx AI",
          url: "https://calculyxai.online",
          logo: "https://calculyxai.online/icon-512.png",
          description: "AI-powered financial intelligence platform for stock analysis, portfolio tracking, and investment planning.",
          foundingDate: "2025",
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "balaji04@calculyxai.online",
            availableLanguage: ["English"],
          },
          sameAs: [],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Calculyx AI",
          alternateName: "Calculyx",
          url: "https://calculyxai.online",
          inLanguage: "en",
          publisher: { "@type": "Organization", name: "Calculyx AI" },
          potentialAction: {
            "@type": "SearchAction",
            target: "https://calculyxai.online/calculators?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Calculyx AI",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web",
          url: "https://calculyxai.online",
          description: "AI financial intelligence platform: stock analysis, portfolio tracking, real-time market insights, and 27+ financial calculators (mortgage, tax, SIP, FD, retirement, and more).",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          featureList: [
            "AI stock analysis with bull and bear cases",
            "Live top-50 stocks for India and US",
            "Portfolio tracking and analytics",
            "Home loan, mortgage and EMI calculators",
            "Income tax, GST and salary calculators",
            "SIP, FD, lumpsum and compound interest calculators",
            "Retirement and inflation planning tools",
            "Currency converter with real-time rates",
            "AI-generated financial reports (PDF and Excel)",
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="relative min-h-screen">
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 bg-background" />
        <PrismBackground />
        <PremiumBackdrop />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
      if (event === "SIGNED_IN") {
        // Fire-and-forget: server-side idempotent (welcomed_at flag), safe for OAuth + email.
        import("@/lib/finflow/welcome.functions")
          .then((m) => m.sendWelcomeIfNew().catch(() => {}))
          .catch(() => {});
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouteProgress />
        <Outlet />
        <OnboardingModal />
        <Toaster position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
