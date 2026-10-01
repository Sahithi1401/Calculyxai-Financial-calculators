import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/finflow/navbar";
import { Breadcrumbs } from "@/components/finflow/breadcrumbs";
import { ShareButtons } from "@/components/finflow/share-buttons";
import { Footer } from "@/components/finflow/footer";
import { NewsSection } from "@/components/finflow/news-section";
import { useState } from "react";
import { useCountry } from "@/lib/finflow/country-store";
import { StickyMobileCta } from "@/components/finflow/sticky-cta";

export const Route = createFileRoute("/news")({
  head: () =>
    pageHead({
      title: "AI Financial News Digest — Calculyx AI",
      description:
        "Today's India, US, UAE and global market headlines summarised by AI in seconds, with sentiment tags and the sectors each story is most likely to move.",
      path: "/news",
      crumbs: [{ name: "Home", path: "/" }, { name: "Market News", path: "/news" }],
    }),
  component: NewsPage,
});

function NewsPage() {
  const [country] = useCountry();
  const initial = country === "IN" ? "India" : country === "US" ? "USA" : country === "AE" ? "UAE" : "Global";
  const [region, setRegion] = useState<"India" | "USA" | "UAE" | "Global">(initial as "India" | "USA" | "UAE" | "Global");

  return (
    <div className="bg-page-gradient min-h-screen">
      <Navbar />
      <main className="pt-24 pb-24 md:pb-0">
        <Breadcrumbs
          items={[{ name: "Home", path: "/" }, { name: "Market News", path: "/news" }]}
          className="pt-4"
        />
        <div className="mx-auto max-w-7xl px-6 pt-8">
          <div className="text-sm font-medium text-primary">Daily digest</div>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
            Financial <span className="font-serif italic text-primary">news</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">AI-summarised, region-filtered, auto-refreshed every 10 minutes.</p>
          <div className="mt-6 inline-flex rounded-full border bg-card/70 backdrop-blur p-1 shadow-soft">
            {(["Global", "India", "USA", "UAE"] as const).map((r) => (
              <button key={r} onClick={() => setRegion(r)}
                className={`rounded-full px-4 py-1.5 text-sm transition ${region === r ? "bg-primary text-primary-foreground shadow-elegant" : "text-muted-foreground hover:text-foreground"}`}>
                {r}
              </button>
            ))}
          </div>
          <ShareButtons
            title={`${region} financial news digest — Calculyx AI`}
            url="https://calculyxai.online/news"
            text={`Today's AI-summarised ${region} market headlines on Calculyx AI —`}
            label="Share this digest"
            className="mt-5"
          />
        </div>
        <NewsSection region={region} />

      </main>
      <Footer />
      <StickyMobileCta />
    </div>
  );
}
