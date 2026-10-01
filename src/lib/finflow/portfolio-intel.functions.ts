import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { StockScores } from "./pipeline/types";

export type PortfolioIntelligence = {
  overall: number;
  grade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";
  buckets: { key: "health" | "growth" | "value" | "risk" | "momentum"; label: string; score: number }[];
  coverage: { scoredValue: number; totalValue: number; pct: number };
  concentration: { topName: string; topPct: number; hhi: number };
  positions: {
    symbol: string;
    name: string;
    weight: number;   // 0..1 of scored portfolio
    overall: number;
    grade: string;
  }[];
  thesis: string;
  strengths: string[];
  risks: string[];
  verdict: "Constructive" | "Neutral" | "Cautious";
  generatedAt: string;
};

function toGrade(n: number): PortfolioIntelligence["grade"] {
  if (n >= 90) return "A+";
  if (n >= 80) return "A";
  if (n >= 72) return "B+";
  if (n >= 64) return "B";
  if (n >= 56) return "C+";
  if (n >= 48) return "C";
  if (n >= 38) return "D";
  return "F";
}

export const getPortfolioIntelligence = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PortfolioIntelligence | null> => {
    const { data: rows, error } = await context.supabase
      .from("holdings")
      .select("symbol, name, quantity, avg_cost, manual_price, asset_class")
      .in("asset_class", ["stock", "etf"]);
    if (error) throw new Error(error.message);
    if (!rows || rows.length === 0) return null;

    const positions = rows
      .filter((h) => h.symbol)
      .map((h) => {
        const qty = Number(h.quantity);
        const price = h.manual_price != null ? Number(h.manual_price) : Number(h.avg_cost);
        return { symbol: (h.symbol as string).toUpperCase(), name: h.name, value: qty * price };
      })
      .filter((p) => p.value > 0);

    if (positions.length === 0) return null;

    const totalValue = positions.reduce((s, p) => s + p.value, 0);

    const { getStockIntelligence } = await import("./pipeline/orchestrator.server");
    const results = await Promise.all(
      positions.map(async (p) => {
        try {
          const intel = await getStockIntelligence(p.symbol);
          return { ...p, scores: intel.scores };
        } catch {
          return { ...p, scores: null as StockScores | null };
        }
      }),
    );

    const scored = results.filter((r) => r.scores) as Array<typeof results[number] & { scores: StockScores }>;
    const scoredValue = scored.reduce((s, r) => s + r.value, 0);

    const bucketKeys = ["health", "growth", "value", "risk", "momentum"] as const;
    const buckets = bucketKeys.map((k) => {
      if (scoredValue === 0) return { key: k, label: k[0].toUpperCase() + k.slice(1), score: 0 };
      const weighted = scored.reduce((s, r) => s + r.scores[k].score * (r.value / scoredValue), 0);
      return { key: k, label: k[0].toUpperCase() + k.slice(1), score: Math.round(weighted) };
    });

    const overall =
      scoredValue === 0
        ? 0
        : Math.round(scored.reduce((s, r) => s + r.scores.overall * (r.value / scoredValue), 0));

    const sorted = [...positions].sort((a, b) => b.value - a.value);
    const top = sorted[0];
    const hhi = positions.reduce((s, p) => s + Math.pow(p.value / totalValue, 2), 0);
    const concentration = {
      topName: top.name,
      topPct: Math.round((top.value / totalValue) * 100),
      hhi: Number(hhi.toFixed(3)),
    };

    const positionsOut = scored
      .map((r) => ({
        symbol: r.symbol,
        name: r.name,
        weight: r.value / scoredValue,
        overall: r.scores.overall,
        grade: r.scores.grade,
      }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 8);

    // Groq-backed narrative — evidence only from the aggregates above.
    let thesis = "";
    let strengths: string[] = [];
    let risks: string[] = [];
    let verdict: PortfolioIntelligence["verdict"] = overall >= 65 ? "Constructive" : overall >= 45 ? "Neutral" : "Cautious";

    const evidenceLines = [
      `Overall weighted score: ${overall}/100 (grade ${toGrade(overall)})`,
      ...buckets.map((b) => `${b.label}: ${b.score}/100`),
      `Top holding: ${concentration.topName} at ${concentration.topPct}% of book`,
      `Concentration HHI: ${concentration.hhi} (0 = perfectly diversified, 1 = single-name)`,
      `Coverage: ${scored.length} of ${positions.length} positions scored (${Math.round((scoredValue / totalValue) * 100)}% of value)`,
      ...positionsOut.slice(0, 5).map((p) => `${p.symbol} · ${Math.round(p.weight * 100)}% weight · ${p.overall}/100 (${p.grade})`),
    ];

    try {
      const { callGroq } = await import("./groq.server");
      const raw = await callGroq(
        [
          {
            role: "system",
            content:
              "You are a rigorous portfolio strategist. Reference ONLY the supplied aggregate evidence. Never invent metrics, price targets, or macro claims. Return valid JSON only.",
          },
          {
            role: "user",
            content: `Return JSON with keys:
- thesis (2 sentences on the portfolio's current posture, plain English)
- strengths (array of 3 short bullets citing specific buckets or positions)
- risks (array of 3 short bullets citing concentration, weak buckets, or low-scoring positions)
- verdict ("Constructive" | "Neutral" | "Cautious")

EVIDENCE:
${evidenceLines.join("\n")}`,
          },
        ],
        { json: true, temperature: 0.3 },
      );
      const obj = JSON.parse(raw);
      thesis = String(obj.thesis ?? "").slice(0, 800);
      strengths = Array.isArray(obj.strengths) ? obj.strengths.slice(0, 4).map((x: unknown) => String(x).slice(0, 200)) : [];
      risks = Array.isArray(obj.risks) ? obj.risks.slice(0, 4).map((x: unknown) => String(x).slice(0, 200)) : [];
      if (["Constructive", "Neutral", "Cautious"].includes(obj.verdict)) verdict = obj.verdict;
    } catch {
      thesis = `Portfolio scores ${overall}/100 (grade ${toGrade(overall)}) on a weighted read of ${scored.length} scored position${scored.length === 1 ? "" : "s"}. Detailed AI narrative is temporarily unavailable — evidence is shown below.`;
      const strongest = [...buckets].sort((a, b) => b.score - a.score);
      strengths = strongest.slice(0, 2).map((b) => `${b.label} composite at ${b.score}/100`);
      risks = strongest.slice(-2).reverse().map((b) => `${b.label} composite at ${b.score}/100`);
      if (concentration.topPct >= 25) risks.unshift(`Concentration: ${concentration.topName} at ${concentration.topPct}% of book`);
    }

    return {
      overall,
      grade: toGrade(overall),
      buckets,
      coverage: { scoredValue, totalValue, pct: Math.round((scoredValue / totalValue) * 100) },
      concentration,
      positions: positionsOut,
      thesis,
      strengths,
      risks,
      verdict,
      generatedAt: new Date().toISOString(),
    };
  });
