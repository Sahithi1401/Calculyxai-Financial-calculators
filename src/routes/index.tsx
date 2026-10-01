import { createFileRoute } from "@tanstack/react-router";
import { organizationSchema, webSiteSchema, SITE } from "@/lib/seo";
import { Navbar } from "@/components/finflow/navbar";
import { Footer } from "@/components/finflow/footer";
import { Hero } from "@/components/finflow/hero";
import { NewsSection } from "@/components/finflow/news-section";
import { StatusBar } from "@/components/finflow/status-bar";
import {
  LiveTicker, WhyCalculyx, HowItWorks, FaqSection, FinalCta,
} from "@/components/finflow/home/sections";
import { HOME_FAQS } from "@/lib/finflow/faq-data";
import { StickyMobileCta } from "@/components/finflow/sticky-cta";
import { QuickCalc, CalcFinder } from "@/components/finflow/home/engage";

const TITLE = "Calculyx AI — Financial Intelligence Platform";
const DESC =
  "Institutional-grade market data, proprietary stock scoring and AI analysis, plus 27 precision calculators for loans, SIPs and taxes across India, the US and UAE.";
const URL = "https://calculyxai.online/";
const IMG = "https://storage.googleapis.com/gpt-engineer-file-uploads/Zcyf67suT1X8dViAUyZ1AtzEANT2/social-images/social-1784106017880-WhatsApp_Image_2026-07-11_at_13.44.35.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "AI financial platform, financial intelligence platform, portfolio tracker, stock analysis, stock screener, real-time stocks, investment platform, financial dashboard, market intelligence, technical analysis, fundamental analysis, portfolio management, AI investment advisor, SIP calculator, FD calculator, EMI calculator, home loan calculator, income tax calculator, GST calculator, currency converter, retirement planner, wealth management, AI financial copilot" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:image", content: IMG },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: IMG },
      { property: "og:site_name", content: SITE.name },
      { property: "og:locale", content: SITE.locale },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(organizationSchema()) },
      { type: "application/ld+json", children: JSON.stringify(webSiteSchema()) },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: URL },
            { "@type": "ListItem", position: 2, name: "Stocks", item: `${URL}stocks` },
            { "@type": "ListItem", position: 3, name: "Calculators", item: `${URL}investing-calculators` },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: HOME_FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pb-24 md:pb-0">
        <Hero />
        <LiveTicker />
        <QuickCalc />
        <CalcFinder />
        <WhyCalculyx />
        <HowItWorks />
        <NewsSection limit={3} />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
      <StickyMobileCta />
      <StatusBar />
    </div>
  );
}
