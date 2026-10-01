import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE = "https://calculyxai.online";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const children = ["pages", "calculators", "stocks"];
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...children.map(
            (c) =>
              `  <sitemap><loc>${BASE}/sitemap-${c}.xml</loc></sitemap>`,
          ),
          `</sitemapindex>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
