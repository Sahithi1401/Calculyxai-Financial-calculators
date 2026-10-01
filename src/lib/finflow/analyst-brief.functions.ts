import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callGroq } from "./groq.server";
import type { StockScores } from "./pipeline/types";

export type AnalystBrief = {
  symbol: string;
  thesis: string;
  bull: string[];
  bear: string[];
  verdict: "Constructive" | "Neutral" | "Cautious";
  citations: { label: string; source: string }[];
  generatedAt: string;
};

const cache = new Map<string, { at: number; data: AnalystBrief }>();
const TTL = 6 * 60 * 60 * 1000;

function topDrivers(s: StockScores) {
  const buckets = [s.health, s.growth, s.value, s.risk, s.momentum];
  const flat = buckets.flatMap((b) => b.drivers);
  return flat.sort((a, b) => b.points - a.points).slice(0, 6);
}

export const getAnalystBrief = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ symbol: z.string().min(1).max(20).regex(/^[A-Za-z0-9.\-^]+$/) }).parse(d),
  )
  .handler(async ({ data }): Promise<AnalystBrief> => {
    const sym = data.symbol.toUpperCase();
    const hit = cache.get(sym);
    if (hit && Date.now() - hit.at < TTL) return hit.data;

    const { getStockIntelligence } = await import("./pipeline/orchestrator.server");
    const intel = await getStockIntelligence(sym);
    if (!intel.scores) {
      const empty: AnalystBrief = {
        symbol: sym,
        thesis: `Insufficient structured data to underwrite a thesis for ${sym}. Await full fundamentals coverage.`,
        bull: [],
        bear: [],
        verdict: "Neutral",
        citations: [],
        generatedAt: new Date().toISOString(),
      };
      return empty;
    }

    const s = intel.scores;
    const drivers = topDrivers(s);
    const evidence = drivers.map((d) => `- ${d.label}: ${d.points}/100 (${d.citation})`).join("\n");

    const prompt = `You are a sell-side equity analyst writing an evidence-backed brief. You may ONLY reference the numbers in the evidence block. Never invent a metric or a price target.

Return valid JSON with keys:
- thesis (2-3 sentences summarising the position, plain English)
- bull (array of 3 short bullets, each explicitly citing a driver by name)
- bear (array of 3 short bullets, each explicitly citing a driver by name)
- verdict ("Constructive" | "Neutral" | "Cautious", based on overall score ${s.overall}/100)

Symbol: ${sym}
Overall: ${s.overall}/100 · Grade ${s.grade}
Health ${s.health.score} · Growth ${s.growth.score} · Value ${s.value.score} · Risk ${s.risk.score} · Momentum ${s.momentum.score}

EVIDENCE:
${evidence}
`;

    let parsed: Omit<AnalystBrief, "symbol" | "citations" | "generatedAt">;
    try {
      const raw = await callGroq(
        [
          { role: "system", content: "You are a rigorous equity analyst. Cite only supplied evidence. Return valid JSON only." },
          { role: "user", content: prompt },
        ],
        { json: true, temperature: 0.3 },
      );
      const obj = JSON.parse(raw);
      parsed = {
        thesis: String(obj.thesis ?? "").slice(0, 800),
        bull: Array.isArray(obj.bull) ? obj.bull.slice(0, 4).map((x: unknown) => String(x).slice(0, 200)) : [],
        bear: Array.isArray(obj.bear) ? obj.bear.slice(0, 4).map((x: unknown) => String(x).slice(0, 200)) : [],
        verdict: (["Constructive", "Neutral", "Cautious"] as const).includes(obj.verdict) ? obj.verdict : (s.overall >= 65 ? "Constructive" : s.overall >= 45 ? "Neutral" : "Cautious"),
      };
    } catch {
      parsed = {
        thesis: `${sym} scores ${s.overall}/100 (grade ${s.grade}). Detailed AI narrative is temporarily unavailable — the underlying scoring drivers are shown below.`,
        bull: drivers.filter((d) => d.points >= 60).slice(0, 3).map((d) => `${d.label} contributes ${d.points}/100 — ${d.citation}`),
        bear: drivers.filter((d) => d.points < 40).slice(0, 3).map((d) => `${d.label} at ${d.points}/100 — ${d.citation}`),
        verdict: s.overall >= 65 ? "Constructive" : s.overall >= 45 ? "Neutral" : "Cautious",
      };
    }

    const brief: AnalystBrief = {
      symbol: sym,
      ...parsed,
      citations: drivers.map((d) => ({ label: d.label, source: d.citation })),
      generatedAt: new Date().toISOString(),
    };
    cache.set(sym, { at: Date.now(), data: brief });
    return brief;
  });
