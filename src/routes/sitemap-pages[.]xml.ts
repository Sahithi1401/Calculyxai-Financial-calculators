import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE = "https://calculyxai.online";

type Entry = { path: string; priority: string; changefreq: string };

const ENTRIES: Entry[] = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/stocks", priority: "0.95", changefreq: "hourly" },
  { path: "/calculators", priority: "0.9", changefreq: "weekly" },
  { path: "/investing-calculators", priority: "0.9", changefreq: "weekly" },
  { path: "/ai", priority: "0.9", changefreq: "weekly" },
  { path: "/news", priority: "0.85", changefreq: "hourly" },
  { path: "/how-to-calculate-sip-returns", priority: "0.7", changefreq: "monthly" },
  { path: "/faq", priority: "0.8", changefreq: "monthly" },
  { path: "/case-studies", priority: "0.75", changefreq: "monthly" },
  { path: "/case-studies/bengaluru-engineer-rent-vs-buy", priority: "0.7", changefreq: "monthly" },
  { path: "/case-studies/us-couple-mortgage-refinance", priority: "0.7", changefreq: "monthly" },
  { path: "/case-studies/dubai-nri-retirement-corpus", priority: "0.7", changefreq: "monthly" },
  { path: "/case-studies/small-business-gst-cash-flow", priority: "0.7", changefreq: "monthly" },

  { path: "/about", priority: "0.6", changefreq: "monthly" },
  { path: "/contact", priority: "0.5", changefreq: "monthly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
  { path: "/disclaimer", priority: "0.3", changefreq: "yearly" },
  { path: "/cookies", priority: "0.3", changefreq: "yearly" },
  { path: "/acceptable-use", priority: "0.3", changefreq: "yearly" },
  { path: "/ai-disclaimer", priority: "0.3", changefreq: "yearly" },
  { path: "/ai-usage", priority: "0.3", changefreq: "yearly" },
  { path: "/copyright", priority: "0.3", changefreq: "yearly" },
  { path: "/market-data", priority: "0.4", changefreq: "monthly" },
  { path: "/security", priority: "0.3", changefreq: "yearly" },
];

export const Route = createFileRoute("/sitemap-pages.xml")({
  server: {
    handlers: {
      GET: async () => {
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...ENTRIES.map(
            (e) =>
              `  <url><loc>${BASE}${e.path}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
          ),
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
