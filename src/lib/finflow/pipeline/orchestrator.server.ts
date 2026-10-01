// Orchestrator — merges providers with a graceful fallback chain and
// caches results in Supabase. SERVER-ONLY.

import type { Fundamentals, Quote, StockIntelligence } from "./types";
import {
  alphaVantageFundamentals,
  finnhubFundamentals,
  finnhubQuote,
  fmpFundamentals,
  fmpQuote,
} from "./providers.server";
import { computeScores } from "./scoring";

const SNAPSHOT_TTL_MS      = 60 * 1000;         // 60s
const FUNDAMENTALS_TTL_MS  = 6 * 60 * 60 * 1000; // 6h
const SCORES_TTL_MS        = 6 * 60 * 60 * 1000; // 6h

function mergeFundamentals(list: Array<Fundamentals | null>): Fundamentals | null {
  const valid = list.filter((f): f is Fundamentals => !!f);
  if (!valid.length) return null;
  const base: Fundamentals = { symbol: valid[0].symbol, provider: valid[0].provider };
  for (const f of valid) {
    for (const [k, v] of Object.entries(f)) {
      if (v == null) continue;
      const key = k as keyof Fundamentals;
      if ((base as Record<string, unknown>)[key] == null) {
        (base as Record<string, unknown>)[key] = v;
      }
    }
  }
  return base;
}

async function fetchQuote(symbol: string): Promise<Quote | null> {
  // Prefer FMP (richest), fall back to Finnhub.
  const fmp = await fmpQuote(symbol);
  if (fmp) return fmp;
  return await finnhubQuote(symbol);
}

async function fetchFundamentals(symbol: string): Promise<Fundamentals | null> {
  const [fmp, fh, av] = await Promise.all([
    fmpFundamentals(symbol),
    finnhubFundamentals(symbol),
    alphaVantageFundamentals(symbol),
  ]);
  return mergeFundamentals([fmp, fh, av]);
}

// ---------- Cache layer via supabaseAdmin -------------------------------

async function readCachedQuote(symbol: string): Promise<Quote | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("stock_snapshots")
    .select("*")
    .eq("symbol", symbol)
    .maybeSingle();
  if (!data) return null;
  const fetched = new Date(data.fetched_at).getTime();
  if (Date.now() - fetched > SNAPSHOT_TTL_MS) return null;
  return {
    symbol: data.symbol,
    name: data.name ?? undefined,
    exchange: data.exchange ?? undefined,
    currency: data.currency ?? undefined,
    price: Number(data.price ?? 0),
    changeAbs: data.change_abs != null ? Number(data.change_abs) : undefined,
    changePct: data.change_pct != null ? Number(data.change_pct) : undefined,
    dayHigh: data.day_high != null ? Number(data.day_high) : undefined,
    dayLow: data.day_low != null ? Number(data.day_low) : undefined,
    open: data.open != null ? Number(data.open) : undefined,
    prevClose: data.prev_close != null ? Number(data.prev_close) : undefined,
    week52High: data.week52_high != null ? Number(data.week52_high) : undefined,
    week52Low: data.week52_low != null ? Number(data.week52_low) : undefined,
    marketCap: data.market_cap != null ? Number(data.market_cap) : undefined,
    volume: data.volume != null ? Number(data.volume) : undefined,
    avgVolume: data.avg_volume != null ? Number(data.avg_volume) : undefined,
    source: (data.source as Quote["source"]) ?? "fmp",
    fetchedAt: data.fetched_at,
  };
}

async function writeQuote(q: Quote): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("stock_snapshots").upsert({
    symbol: q.symbol,
    name: q.name,
    exchange: q.exchange,
    currency: q.currency,
    price: q.price,
    change_abs: q.changeAbs,
    change_pct: q.changePct,
    day_high: q.dayHigh,
    day_low: q.dayLow,
    open: q.open,
    prev_close: q.prevClose,
    week52_high: q.week52High,
    week52_low: q.week52Low,
    market_cap: q.marketCap,
    volume: q.volume,
    avg_volume: q.avgVolume,
    source: q.source,
    fetched_at: q.fetchedAt,
  });
}

async function readCachedFundamentals(symbol: string): Promise<Fundamentals | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("stock_fundamentals")
    .select("*")
    .eq("symbol", symbol)
    .maybeSingle();
  if (!data) return null;
  const fetched = new Date(data.fetched_at).getTime();
  if (Date.now() - fetched > FUNDAMENTALS_TTL_MS) return null;
  return {
    symbol: data.symbol,
    asOf: data.as_of ?? undefined,
    revenue: data.revenue != null ? Number(data.revenue) : undefined,
    revenueGrowth: data.revenue_growth != null ? Number(data.revenue_growth) : undefined,
    grossMargin: data.gross_margin != null ? Number(data.gross_margin) : undefined,
    operatingMargin: data.operating_margin != null ? Number(data.operating_margin) : undefined,
    netMargin: data.net_margin != null ? Number(data.net_margin) : undefined,
    eps: data.eps != null ? Number(data.eps) : undefined,
    epsGrowth: data.eps_growth != null ? Number(data.eps_growth) : undefined,
    peRatio: data.pe_ratio != null ? Number(data.pe_ratio) : undefined,
    pegRatio: data.peg_ratio != null ? Number(data.peg_ratio) : undefined,
    pbRatio: data.pb_ratio != null ? Number(data.pb_ratio) : undefined,
    psRatio: data.ps_ratio != null ? Number(data.ps_ratio) : undefined,
    evEbitda: data.ev_ebitda != null ? Number(data.ev_ebitda) : undefined,
    dividendYield: data.dividend_yield != null ? Number(data.dividend_yield) : undefined,
    payoutRatio: data.payout_ratio != null ? Number(data.payout_ratio) : undefined,
    debtToEquity: data.debt_to_equity != null ? Number(data.debt_to_equity) : undefined,
    currentRatio: data.current_ratio != null ? Number(data.current_ratio) : undefined,
    quickRatio: data.quick_ratio != null ? Number(data.quick_ratio) : undefined,
    interestCoverage: data.interest_coverage != null ? Number(data.interest_coverage) : undefined,
    roe: data.roe != null ? Number(data.roe) : undefined,
    roa: data.roa != null ? Number(data.roa) : undefined,
    roic: data.roic != null ? Number(data.roic) : undefined,
    fcf: data.fcf != null ? Number(data.fcf) : undefined,
    fcfYield: data.fcf_yield != null ? Number(data.fcf_yield) : undefined,
    beta: data.beta != null ? Number(data.beta) : undefined,
    sector: data.sector ?? undefined,
    industry: data.industry ?? undefined,
    employees: data.employees ?? undefined,
    provider: (data.provider as Fundamentals["provider"]) ?? "fmp",
  };
}

async function writeFundamentals(f: Fundamentals): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("stock_fundamentals").upsert({
    symbol: f.symbol,
    as_of: f.asOf,
    revenue: f.revenue,
    revenue_growth: f.revenueGrowth,
    gross_margin: f.grossMargin,
    operating_margin: f.operatingMargin,
    net_margin: f.netMargin,
    eps: f.eps,
    eps_growth: f.epsGrowth,
    pe_ratio: f.peRatio,
    peg_ratio: f.pegRatio,
    pb_ratio: f.pbRatio,
    ps_ratio: f.psRatio,
    ev_ebitda: f.evEbitda,
    dividend_yield: f.dividendYield,
    payout_ratio: f.payoutRatio,
    debt_to_equity: f.debtToEquity,
    current_ratio: f.currentRatio,
    quick_ratio: f.quickRatio,
    interest_coverage: f.interestCoverage,
    roe: f.roe,
    roa: f.roa,
    roic: f.roic,
    fcf: f.fcf,
    fcf_yield: f.fcfYield,
    beta: f.beta,
    sector: f.sector,
    industry: f.industry,
    employees: f.employees,
    provider: f.provider,
    fetched_at: new Date().toISOString(),
  });
}

async function writeScores(s: ReturnType<typeof computeScores>): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("stock_scores").upsert({
    symbol: s.symbol,
    score_health:   s.health.score,
    score_growth:   s.growth.score,
    score_value:    s.value.score,
    score_risk:     s.risk.score,
    score_momentum: s.momentum.score,
    score_overall:  s.overall,
    grade: s.grade,
    drivers: {
      health: s.health, growth: s.growth, value: s.value, risk: s.risk, momentum: s.momentum,
    },
    version: s.version,
    computed_at: s.computedAt,
  });
}

// ---------- Public entry ------------------------------------------------

export async function getStockIntelligence(symbolInput: string): Promise<StockIntelligence> {
  const symbol = symbolInput.trim().toUpperCase();
  const warnings: string[] = [];

  // Quote — cache first
  let quote = await readCachedQuote(symbol);
  if (!quote) {
    quote = await fetchQuote(symbol);
    if (quote) {
      try { await writeQuote(quote); } catch { warnings.push("quote-cache-write-failed"); }
    } else {
      warnings.push("no-quote-available");
    }
  }

  // Fundamentals
  let fundamentals = await readCachedFundamentals(symbol);
  if (!fundamentals) {
    fundamentals = await fetchFundamentals(symbol);
    if (fundamentals) {
      try { await writeFundamentals(fundamentals); } catch { warnings.push("fundamentals-cache-write-failed"); }
    } else {
      warnings.push("no-fundamentals-available");
    }
  }

  // Scoring — always compute (degrades on missing data)
  const scores = computeScores(symbol, fundamentals, quote);
  try { await writeScores(scores); } catch { warnings.push("scores-cache-write-failed"); }

  return { quote, fundamentals, scores, warnings };
}

export const _internals = { SNAPSHOT_TTL_MS, FUNDAMENTALS_TTL_MS, SCORES_TTL_MS };
