import { createFileRoute } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { LegalLayout, ContactBlock } from "@/components/finflow/legal-layout";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { MARKET_DATA_FAQS, faqSchema, datasetSchema, SITE } from "@/lib/seo";

const URL = "https://calculyxai.online/market-data";
const TITLE = "Live Market Data — Sources, Freshness & Disclaimer";
const DESC = "Where Calculyx AI's live stock quotes and fundamentals come from, how often today's data refreshes, and what limits apply before you trade.";

export const Route = createFileRoute("/market-data")({
  head: () => {
    const now = new Date().toISOString();
    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESC },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESC },
        { property: "og:type", content: "article" },
        { property: "og:url", content: URL },
        { property: "og:image", content: SITE.ogImage },
        { property: "og:updated_time", content: now },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: SITE.ogImage },
      ],
      links: [{ rel: "canonical", href: URL }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(faqSchema(MARKET_DATA_FAQS)),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            datasetSchema({
              name: "Calculyx AI Live Market Data",
              description: "Aggregated live stock quotes, fundamentals and news for Indian, US and global markets.",
              url: URL,
              dateModified: now,
            }),
          ),
        },
      ],
    };
  },
  component: MarketDataPage,
});

function MarketDataPage() {
  return (
    <LegalLayout
      crumbs={[{ name: "Home", path: "/" }, { name: "Market Data", path: "/market-data" }]}
      title={<>Market Data <span className="font-serif italic text-primary">Disclaimer</span></>}
      intro={
        <div className="flex items-start gap-3 rounded-2xl border border-sheen glass p-5 text-sm">
          <Activity className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>
            Market prices, fundamentals, and news displayed on Calculyx AI come from
            third-party providers. This data is provided <strong>"as-is"</strong> and is
            not guaranteed to be accurate, timely, or complete.
          </p>
        </div>
      }
    >
      <h2>Third-party sources</h2>
      <p>
        Calculyx AI displays market data supplied by external providers, including — but
        not limited to — global market data APIs, Indian market data feeds, and other
        public sources. Any brand names shown for individual quotes remain the property
        of their respective owners.
      </p>

      <h2>Data may be limited</h2>
      <p>Quotes, fundamentals, historical charts, and news feeds may be:</p>
      <ul>
        <li><strong>Delayed</strong> — often by 15 minutes or more; sometimes end-of-day.</li>
        <li><strong>Incomplete</strong> — missing sessions, corporate actions, or specific instruments.</li>
        <li><strong>Unavailable</strong> — when a provider is rate-limited, degraded, or down.</li>
        <li><strong>Interrupted</strong> — due to API outages, network issues, or maintenance.</li>
      </ul>

      <h2>No guarantee</h2>
      <p>Calculyx AI does not guarantee the:</p>
      <ul>
        <li>Accuracy of any price, fundamental, or news item.</li>
        <li>Timeliness of quotes or updates.</li>
        <li>Completeness of coverage for any market, sector, or instrument.</li>
      </ul>

      <h2>Not for trading decisions</h2>
      <p>
        Data displayed on Calculyx AI is intended for educational and informational use.
        It should <strong>not</strong> be used as the sole source for executing trades,
        placing orders, or making investment decisions. Always confirm prices and
        fundamentals with your broker, exchange, or a licensed data vendor before
        transacting.
      </p>

      <h2>Third-party trademarks</h2>
      <p>
        Ticker symbols, exchange names, index names, and company names are the trademarks
        of their respective owners. Their appearance on Calculyx AI does not imply
        endorsement or affiliation.
      </p>

      <h2 id="faq">Market data FAQ</h2>
      <div className="not-prose">
        <Accordion type="single" collapsible className="rounded-2xl border border-sheen glass divide-y divide-border/40">
          {MARKET_DATA_FAQS.map((f, i) => (
            <AccordionItem key={i} value={`md-faq-${i}`} className="border-0 px-5">
              <AccordionTrigger className="text-left text-base font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <ContactBlock />
    </LegalLayout>
  );
}
