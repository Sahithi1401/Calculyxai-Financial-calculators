import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { US_TOP_50, IN_TOP_50 } from "@/lib/finflow/stocks-catalog";

const BASE = "https://calculyxai.online";

export const Route = createFileRoute("/sitemap-stocks.xml")({
  server: {
    handlers: {
      GET: async () => {
        const all = [...US_TOP_50, ...IN_TOP_50];
        const rows = all.map(
          (s) =>
            `  <url><loc>${BASE}/stocks/${encodeURIComponent(s.symbol)}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>`,
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...rows,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
