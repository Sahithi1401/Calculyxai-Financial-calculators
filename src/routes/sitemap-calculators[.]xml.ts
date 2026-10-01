import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { CALCULATORS } from "@/lib/finflow/registry";
import { CALC_SEO } from "@/lib/seo";

const BASE = "https://calculyxai.online";

export const Route = createFileRoute("/sitemap-calculators.xml")({
  server: {
    handlers: {
      GET: async () => {
        const rows = CALCULATORS.map((c) => {
          const live = CALC_SEO[c.slug]?.live === true;
          const changefreq = live ? "daily" : "weekly";
          const priority = live ? "0.9" : "0.8";
          return `  <url><loc>${BASE}/calc/${c.slug}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
        });
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
