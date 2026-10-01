// Server-only: builds the Calculyx knowledge corpus from the app's own content.
import { GUIDES } from "../guides";
import { taxRulesFor } from "../tax-rules";
import { taxSavingTips } from "../tax-tips";
import { CALCULATORS } from "../registry";
import { CALC_SEO } from "@/lib/seo";
import { BANKS } from "../banks";
import { COUNTRIES, type Country } from "../countries";
import { CATALOG } from "../stocks-catalog";

export type CorpusDoc = {
  source: string;
  source_id: string;
  title: string;
  url: string | null;
  country: string | null;
  content: string;
  metadata: Record<string, unknown>;
};

const COUNTRY_KEYS: Country[] = ["IN", "US", "AE"];

export function buildCorpus(): CorpusDoc[] {
  const docs: CorpusDoc[] = [];

  // ---- Guides (teacher-style, one doc per calculator guide) ----
  for (const g of GUIDES) {
    const body = [
      `${g.name} — ${g.tagline}`,
      `Category: ${g.category}`,
      `What it does: ${g.whatItDoes}`,
      `When to use it: ${g.whenToUse.join("; ")}`,
      `Inputs: ${g.inputs.map((i) => `${i.label} — ${i.help}`).join(" | ")}`,
      g.formula ? `Formula: ${g.formula}` : "",
      `Worked example: ${g.example.setup} Steps: ${g.example.steps.join(" ")} Result: ${g.example.result}`,
      `Tips: ${g.tips.join(" ")}`,
    ]
      .filter(Boolean)
      .join("\n");

    docs.push({
      source: "guide",
      source_id: `guide:${g.slug}`,
      title: `${g.name} — how to use it`,
      url: g.investingTab ? `${g.linkTo}?c=${g.investingTab}` : g.linkTo,
      country: null,
      content: body,
      metadata: { slug: g.slug, kind: g.kind, category: g.category },
    });
  }

  // ---- Tax rules per country ----
  for (const c of COUNTRY_KEYS) {
    const r = taxRulesFor(c);
    const slabs = r.brackets
      .map(
        (b) =>
          `${b.from.toLocaleString()} to ${b.to === null ? "above" : b.to.toLocaleString()}: ${b.rate}%`,
      )
      .join("; ");
    docs.push({
      source: "tax-rule",
      source_id: `tax-rule:${c}`,
      title: r.regime,
      url: "/calc/income-tax",
      country: c,
      content: [
        `${r.regime} (currency ${r.currency}, effective from ${r.effectiveFrom}).`,
        `Income tax slabs: ${slabs}.`,
        r.standardDeduction
          ? `${r.standardDeduction.label}: ${r.standardDeduction.amount.toLocaleString()} ${r.currency}.`
          : "",
        `Notes: ${r.notes.join(" ")}`,
      ]
        .filter(Boolean)
        .join("\n"),
      metadata: { regime: r.regime, currency: r.currency },
    });

    // Tax-saving tips across representative income bands.
    const bands = c === "IN" ? [600000, 1200000, 2500000] : c === "US" ? [60000, 150000, 400000] : [200000, 600000];
    const seen = new Set<string>();
    const tips: string[] = [];
    for (const income of bands) {
      for (const t of taxSavingTips(c, income)) {
        if (seen.has(t.title)) continue;
        seen.add(t.title);
        tips.push(`${t.title}: ${t.detail}${t.potentialSavingLabel ? ` (${t.potentialSavingLabel})` : ""}`);
      }
    }
    if (tips.length) {
      docs.push({
        source: "tax-tip",
        source_id: `tax-tip:${c}`,
        title: `Tax-saving options — ${COUNTRIES[c].name}`,
        url: "/calc/income-tax",
        country: c,
        content: `Tax-saving ideas for ${COUNTRIES[c].name} (informational, not advice):\n${tips.join("\n")}`,
        metadata: { count: tips.length },
      });
    }
  }

  // ---- Calculator registry + SEO copy (steps, FAQs) ----
  for (const calc of CALCULATORS) {
    const seo = CALC_SEO[calc.slug];
    const parts = [
      `${calc.name} (${calc.category}) — ${calc.tagline}`,
      `Open it at /calc/${calc.slug} on Calculyx AI.`,
    ];
    if (seo) {
      parts.push(seo.description);
      if (seo.steps?.length) parts.push(`How to use: ${seo.steps.join(" ")}`);
      if (seo.faqs?.length)
        parts.push(`FAQs: ${seo.faqs.map((f) => `Q: ${f.q} A: ${f.a}`).join(" ")}`);
    }
    docs.push({
      source: "calculator",
      source_id: `calculator:${calc.slug}`,
      title: `${calc.name} calculator`,
      url: `/calc/${calc.slug}`,
      country: null,
      content: parts.join("\n"),
      metadata: { slug: calc.slug, category: calc.category },
    });
  }

  // ---- Banks (home loan rate reference) ----
  for (const c of COUNTRY_KEYS) {
    const list = BANKS.filter((b) => b.country === c);
    if (!list.length) continue;
    docs.push({
      source: "bank",
      source_id: `bank-rates:${c}`,
      title: `Home loan rates — ${COUNTRIES[c].name}`,
      url: "/calc/home-loan",
      country: c,
      content: [
        `Indicative home loan offers in ${COUNTRIES[c].name} tracked by Calculyx (rates change; verify with the lender):`,
        ...list.map(
          (b) =>
            `${b.name}: ${b.minRate}%–${b.maxRate}% p.a., processing fee ${b.processingFeePct}%${b.processingFeeCap ? ` (cap ${b.processingFeeCap})` : ""}, max tenure ${b.maxTenureYears} yrs, max LTV ${b.maxLtv}%, min credit score ${b.minCreditScore}. ${b.website}`,
        ),
      ].join("\n"),
      metadata: { banks: list.length },
    });
  }

  // ---- Countries / currency context ----
  docs.push({
    source: "country",
    source_id: "country:overview",
    title: "Supported countries and currencies",
    url: "/calculators",
    country: null,
    content: COUNTRY_KEYS.map(
      (c) =>
        `${COUNTRIES[c].name} (${c}): currency ${COUNTRIES[c].currency} (${COUNTRIES[c].symbol}), locale ${COUNTRIES[c].locale}.`,
    ).join("\n"),
    metadata: {},
  });

  // ---- Stocks catalog (grouped by sector to keep chunks meaningful) ----
  const bySector = new Map<string, typeof CATALOG>();
  for (const e of CATALOG) {
    const key = `${e.region}|${e.sector}`;
    const arr = bySector.get(key) ?? [];
    arr.push(e);
    bySector.set(key, arr);
  }
  for (const [key, entries] of bySector) {
    const [region, sector] = key.split("|");
    docs.push({
      source: "stock",
      source_id: `stocks:${region}:${sector}`,
      title: `${sector} stocks tracked (${region})`,
      url: "/stocks",
      country: region === "IN" ? "IN" : "US",
      content: [
        `Calculyx tracks these ${sector} companies in the ${region} market:`,
        ...entries.map(
          (e) =>
            `${e.symbol} — ${e.name} (${e.currency}), sector ${e.sector}, long-run assumed return used in calculators: ${e.assumedReturn}%.`,
        ),
      ].join("\n"),
      metadata: { region, sector, count: entries.length },
    });
  }

  return docs;
}
