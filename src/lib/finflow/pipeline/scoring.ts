// Pure, deterministic scoring engine — no network, no secrets, client-safe.
// Every score is 0–100 with cited drivers. Missing metrics degrade gracefully.

import type { Fundamentals, Quote, ScoreBucket, ScoreDriver, StockScores } from "./types";

const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

/** Map a metric onto 0..100 with a linear ramp between `bad` and `good`. */
function ramp(value: number | undefined, bad: number, good: number): number | null {
  if (value == null || !Number.isFinite(value)) return null;
  if (bad === good) return value >= good ? 100 : 0;
  const t = (value - bad) / (good - bad);
  return clamp(t * 100);
}

/** Inverted ramp: lower is better (e.g. debt/equity). */
function rampInv(value: number | undefined, good: number, bad: number): number | null {
  if (value == null || !Number.isFinite(value)) return null;
  return ramp(-value, -bad, -good);
}

/** Weighted average of driver points; renormalizes when some drivers are missing. */
function weightedAverage(
  entries: Array<{ label: string; weight: number; value: number | undefined; points: number | null; citation: string }>,
): ScoreBucket {
  const drivers: ScoreDriver[] = [];
  const missing: string[] = [];
  let numerator = 0;
  let denominator = 0;
  for (const e of entries) {
    if (e.points == null || e.value == null) {
      missing.push(e.label);
      continue;
    }
    drivers.push({ label: e.label, weight: e.weight, value: e.value, points: Math.round(e.points), citation: e.citation });
    numerator += e.points * e.weight;
    denominator += e.weight;
  }
  const score = denominator > 0 ? Math.round(numerator / denominator) : 0;
  return { score, drivers, missing };
}

// ---------- Buckets ------------------------------------------------------

function scoreHealth(f: Fundamentals): ScoreBucket {
  return weightedAverage([
    { label: "Current Ratio",     weight: 0.20, value: f.currentRatio,     points: ramp(f.currentRatio, 0.8, 2.5),        citation: "Current ratio ≥ 2 signals ample short-term liquidity." },
    { label: "Debt / Equity",     weight: 0.25, value: f.debtToEquity,     points: rampInv(f.debtToEquity, 0.3, 2.0),     citation: "D/E under 1 is conservative; over 2 is leveraged." },
    { label: "Interest Coverage", weight: 0.20, value: f.interestCoverage, points: ramp(f.interestCoverage, 1.5, 10),     citation: "EBIT / interest ≥ 5× is healthy." },
    { label: "Operating Margin",  weight: 0.20, value: f.operatingMargin,  points: ramp(f.operatingMargin, 0, 0.25),      citation: "Operating margin ≥ 15% indicates pricing power." },
    { label: "Free Cash Flow",    weight: 0.15, value: f.fcf,              points: f.fcf != null ? (f.fcf > 0 ? 90 : 20) : null, citation: "Positive free cash flow funds growth without dilution." },
  ]);
}

function scoreGrowth(f: Fundamentals): ScoreBucket {
  return weightedAverage([
    { label: "Revenue Growth (YoY)", weight: 0.35, value: f.revenueGrowth, points: ramp(f.revenueGrowth, 0, 0.25), citation: "Revenue growth ≥ 20% qualifies as high-growth." },
    { label: "EPS Growth (YoY)",     weight: 0.30, value: f.epsGrowth,     points: ramp(f.epsGrowth,     0, 0.25), citation: "EPS growth ≥ 20% shows expanding profitability." },
    { label: "ROE",                  weight: 0.20, value: f.roe,           points: ramp(f.roe, 0.05, 0.25),        citation: "ROE ≥ 15% signals efficient equity use." },
    { label: "ROIC",                 weight: 0.15, value: f.roic,          points: ramp(f.roic, 0.05, 0.20),       citation: "ROIC > WACC creates shareholder value." },
  ]);
}

function scoreValue(f: Fundamentals): ScoreBucket {
  return weightedAverage([
    { label: "P/E Ratio",     weight: 0.25, value: f.peRatio,       points: rampInv(f.peRatio, 12, 45),      citation: "P/E under 20 is reasonable for most sectors." },
    { label: "PEG Ratio",     weight: 0.25, value: f.pegRatio,      points: rampInv(f.pegRatio, 1, 3),       citation: "PEG < 1 = growth cheaper than average." },
    { label: "P/B Ratio",     weight: 0.15, value: f.pbRatio,       points: rampInv(f.pbRatio, 1, 6),        citation: "P/B under 3 avoids paying for goodwill." },
    { label: "EV / EBITDA",   weight: 0.20, value: f.evEbitda,      points: rampInv(f.evEbitda, 8, 25),      citation: "EV/EBITDA under 15 is typical fair value." },
    { label: "FCF Yield",     weight: 0.15, value: f.fcfYield,      points: ramp(f.fcfYield, 0.02, 0.08),    citation: "FCF yield ≥ 5% is attractive vs bonds." },
  ]);
}

function scoreRisk(f: Fundamentals, q: Quote | null): ScoreBucket {
  const drawdown =
    q?.week52High && q?.price && q.week52High > 0
      ? (q.week52High - q.price) / q.week52High
      : undefined;
  return weightedAverage([
    { label: "Beta",              weight: 0.30, value: f.beta,          points: rampInv(f.beta, 0.8, 2.0),          citation: "Beta near 1 = market-like volatility." },
    { label: "Debt / Equity",     weight: 0.25, value: f.debtToEquity,  points: rampInv(f.debtToEquity, 0.3, 2.5),  citation: "High leverage amplifies downside." },
    { label: "Quick Ratio",       weight: 0.15, value: f.quickRatio,    points: ramp(f.quickRatio, 0.5, 1.5),       citation: "Quick ratio ≥ 1 = solvent without inventory." },
    { label: "Payout Ratio",      weight: 0.10, value: f.payoutRatio,   points: rampInv(f.payoutRatio, 0.5, 1.2),   citation: "Payout ratio > 100% is unsustainable." },
    { label: "Drawdown from 52w", weight: 0.20, value: drawdown,        points: rampInv(drawdown, 0.05, 0.5),       citation: "Deep drawdowns can signal deteriorating fundamentals." },
  ]);
}

function scoreMomentum(q: Quote | null): ScoreBucket {
  if (!q) return { score: 0, drivers: [], missing: ["price"] };
  const from52wLow =
    q.week52Low && q.week52Low > 0 ? (q.price - q.week52Low) / q.week52Low : undefined;
  const to52wHigh =
    q.week52High && q.week52High > 0 ? (q.week52High - q.price) / q.week52High : undefined;
  const relVolume =
    q.avgVolume && q.avgVolume > 0 && q.volume != null ? q.volume / q.avgVolume : undefined;
  return weightedAverage([
    { label: "Above 52w Low",   weight: 0.35, value: from52wLow,   points: ramp(from52wLow, 0, 0.5),         citation: "Price extended above 52-week low = uptrend." },
    { label: "Room to 52w High",weight: 0.25, value: to52wHigh,    points: rampInv(to52wHigh, 0.05, 0.4),    citation: "Trading near highs signals continued strength." },
    { label: "Daily Change",    weight: 0.15, value: q.changePct,  points: ramp(q.changePct, -3, 3),         citation: "Recent-session change captures near-term flow." },
    { label: "Relative Volume", weight: 0.25, value: relVolume,    points: ramp(relVolume, 0.7, 2),          citation: "Volume > average confirms conviction behind the move." },
  ]);
}

// ---------- Public ------------------------------------------------------

const WEIGHTS = { health: 0.25, growth: 0.20, value: 0.20, risk: 0.20, momentum: 0.15 };

function grade(overall: number): StockScores["grade"] {
  if (overall >= 90) return "A+";
  if (overall >= 80) return "A";
  if (overall >= 72) return "B+";
  if (overall >= 64) return "B";
  if (overall >= 56) return "C+";
  if (overall >= 48) return "C";
  if (overall >= 35) return "D";
  return "F";
}

export function computeScores(
  symbol: string,
  fundamentals: Fundamentals | null,
  quote: Quote | null,
): StockScores {
  const f: Fundamentals = fundamentals ?? { symbol, provider: "yahoo" };
  const health   = scoreHealth(f);
  const growth   = scoreGrowth(f);
  const value    = scoreValue(f);
  const risk     = scoreRisk(f, quote);
  const momentum = scoreMomentum(quote);

  const overall = Math.round(
    health.score   * WEIGHTS.health   +
    growth.score   * WEIGHTS.growth   +
    value.score    * WEIGHTS.value    +
    risk.score     * WEIGHTS.risk     +
    momentum.score * WEIGHTS.momentum,
  );

  return {
    symbol,
    overall,
    grade: grade(overall),
    health, growth, value, risk, momentum,
    version: "v1",
    computedAt: new Date().toISOString(),
  };
}
