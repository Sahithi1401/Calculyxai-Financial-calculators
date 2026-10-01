// Provider adapters — SERVER-ONLY. Never import from client code.
// Every fetcher returns partial data or null; the orchestrator merges.

import type { Fundamentals, Quote } from "./types";

const num = (v: unknown): number | undefined => {
  if (v == null) return undefined;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const nowIso = () => new Date().toISOString();

async function safeJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ================================================================
// Financial Modeling Prep
// ================================================================

export async function fmpQuote(symbol: string): Promise<Quote | null> {
  const key = process.env.FMP_API_KEY;
  if (!key) return null;
  const arr = await safeJson<Array<Record<string, unknown>>>(
    `https://financialmodelingprep.com/api/v3/quote/${encodeURIComponent(symbol)}?apikey=${key}`,
  );
  const q = arr?.[0];
  if (!q) return null;
  const price = num(q.price);
  if (price == null) return null;
  return {
    symbol,
    name: typeof q.name === "string" ? q.name : undefined,
    exchange: typeof q.exchange === "string" ? q.exchange : undefined,
    currency: typeof q.currency === "string" ? q.currency : undefined,
    price,
    changeAbs: num(q.change),
    changePct: num(q.changesPercentage),
    dayHigh: num(q.dayHigh),
    dayLow: num(q.dayLow),
    open: num(q.open),
    prevClose: num(q.previousClose),
    week52High: num(q.yearHigh),
    week52Low: num(q.yearLow),
    marketCap: num(q.marketCap),
    volume: num(q.volume),
    avgVolume: num(q.avgVolume),
    source: "fmp",
    fetchedAt: nowIso(),
  };
}

export async function fmpFundamentals(symbol: string): Promise<Fundamentals | null> {
  const key = process.env.FMP_API_KEY;
  if (!key) return null;
  const [profileArr, metricsArr, ratiosArr] = await Promise.all([
    safeJson<Array<Record<string, unknown>>>(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${key}`),
    safeJson<Array<Record<string, unknown>>>(`https://financialmodelingprep.com/api/v3/key-metrics-ttm/${symbol}?apikey=${key}`),
    safeJson<Array<Record<string, unknown>>>(`https://financialmodelingprep.com/api/v3/ratios-ttm/${symbol}?apikey=${key}`),
  ]);
  const p = profileArr?.[0] ?? {};
  const m = metricsArr?.[0] ?? {};
  const r = ratiosArr?.[0] ?? {};
  if (!Object.keys(p).length && !Object.keys(m).length && !Object.keys(r).length) return null;
  return {
    symbol,
    asOf: new Date().toISOString().slice(0, 10),
    revenue:          num(m.revenueTTM ?? m.revenuePerShareTTM),
    revenueGrowth:    num(r.revenueGrowthTTM),
    grossMargin:      num(r.grossProfitMarginTTM),
    operatingMargin:  num(r.operatingProfitMarginTTM),
    netMargin:        num(r.netProfitMarginTTM),
    eps:              num(m.netIncomePerShareTTM ?? p.eps),
    epsGrowth:        num(r.epsgrowthTTM),
    peRatio:          num(m.peRatioTTM ?? p.pe),
    pegRatio:         num(m.pegRatioTTM),
    pbRatio:          num(m.pbRatioTTM),
    psRatio:          num(m.priceToSalesRatioTTM),
    evEbitda:         num(m.enterpriseValueOverEBITDATTM),
    dividendYield:    num(m.dividendYieldTTM),
    payoutRatio:      num(r.payoutRatioTTM),
    debtToEquity:     num(r.debtEquityRatioTTM ?? m.debtToEquityTTM),
    currentRatio:     num(r.currentRatioTTM),
    quickRatio:       num(r.quickRatioTTM),
    interestCoverage: num(r.interestCoverageTTM),
    roe:              num(r.returnOnEquityTTM ?? m.roeTTM),
    roa:              num(r.returnOnAssetsTTM),
    roic:             num(m.roicTTM),
    fcf:              num(m.freeCashFlowPerShareTTM),
    fcfYield:         num(m.freeCashFlowYieldTTM),
    beta:             num(p.beta),
    sector:           typeof p.sector === "string" ? p.sector : undefined,
    industry:         typeof p.industry === "string" ? p.industry : undefined,
    employees:        num(p.fullTimeEmployees),
    provider: "fmp",
  };
}

// ================================================================
// Finnhub
// ================================================================

export async function finnhubQuote(symbol: string): Promise<Quote | null> {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) return null;
  const q = await safeJson<Record<string, unknown>>(
    `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`,
  );
  const price = num(q?.c);
  if (!q || price == null || price <= 0) return null;
  return {
    symbol,
    price,
    changeAbs: num(q.d),
    changePct: num(q.dp),
    dayHigh: num(q.h),
    dayLow: num(q.l),
    open: num(q.o),
    prevClose: num(q.pc),
    source: "finnhub",
    fetchedAt: nowIso(),
  };
}

export async function finnhubFundamentals(symbol: string): Promise<Fundamentals | null> {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) return null;
  const j = await safeJson<{ metric?: Record<string, unknown>; series?: unknown }>(
    `https://finnhub.io/api/v1/stock/metric?symbol=${encodeURIComponent(symbol)}&metric=all&token=${key}`,
  );
  const m = j?.metric;
  if (!m) return null;
  return {
    symbol,
    asOf: new Date().toISOString().slice(0, 10),
    revenueGrowth:    num(m.revenueGrowthTTMYoy) != null ? (num(m.revenueGrowthTTMYoy)! / 100) : undefined,
    grossMargin:      num(m.grossMarginTTM) != null ? (num(m.grossMarginTTM)! / 100) : undefined,
    operatingMargin:  num(m.operatingMarginTTM) != null ? (num(m.operatingMarginTTM)! / 100) : undefined,
    netMargin:        num(m.netProfitMarginTTM) != null ? (num(m.netProfitMarginTTM)! / 100) : undefined,
    eps:              num(m.epsInclExtraItemsTTM),
    epsGrowth:        num(m.epsGrowthTTMYoy) != null ? (num(m.epsGrowthTTMYoy)! / 100) : undefined,
    peRatio:          num(m.peTTM ?? m.peInclExtraTTM),
    pbRatio:          num(m.pbAnnual ?? m.pbQuarterly),
    psRatio:          num(m.psTTM),
    evEbitda:         num(m.currentEv_freeCashFlowTTM),
    dividendYield:    num(m.dividendYieldIndicatedAnnual) != null ? (num(m.dividendYieldIndicatedAnnual)! / 100) : undefined,
    debtToEquity:     num(m.totalDebt_totalEquityAnnual ?? m["longTermDebt/equityAnnual"]),
    currentRatio:     num(m.currentRatioAnnual),
    quickRatio:       num(m.quickRatioAnnual),
    roe:              num(m.roeTTM) != null ? (num(m.roeTTM)! / 100) : undefined,
    roa:              num(m.roaTTM) != null ? (num(m.roaTTM)! / 100) : undefined,
    beta:             num(m.beta),
    provider: "finnhub",
  };
}

// ================================================================
// Alpha Vantage
// ================================================================

export async function alphaVantageFundamentals(symbol: string): Promise<Fundamentals | null> {
  const key = process.env.ALPHA_VANTAGE_API_KEY;
  if (!key) return null;
  const j = await safeJson<Record<string, unknown>>(
    `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${encodeURIComponent(symbol)}&apikey=${key}`,
  );
  if (!j || !j.Symbol) return null;
  const pct = (v: unknown) => {
    const n = num(v);
    return n != null ? n : undefined;
  };
  return {
    symbol,
    asOf: new Date().toISOString().slice(0, 10),
    revenue:          num(j.RevenueTTM),
    revenueGrowth:    pct(j.QuarterlyRevenueGrowthYOY),
    grossMargin:      pct(j.GrossProfitTTM) != null && num(j.RevenueTTM)
                        ? (num(j.GrossProfitTTM)! / num(j.RevenueTTM)!)
                        : undefined,
    operatingMargin:  pct(j.OperatingMarginTTM),
    netMargin:        pct(j.ProfitMargin),
    eps:              num(j.EPS),
    epsGrowth:        pct(j.QuarterlyEarningsGrowthYOY),
    peRatio:          num(j.PERatio),
    pegRatio:         num(j.PEGRatio),
    pbRatio:          num(j.PriceToBookRatio),
    psRatio:          num(j.PriceToSalesRatioTTM),
    evEbitda:         num(j.EVToEBITDA),
    dividendYield:    num(j.DividendYield),
    payoutRatio:      num(j.PayoutRatio),
    roe:              num(j.ReturnOnEquityTTM),
    roa:              num(j.ReturnOnAssetsTTM),
    beta:             num(j.Beta),
    sector:           typeof j.Sector === "string" ? j.Sector : undefined,
    industry:         typeof j.Industry === "string" ? j.Industry : undefined,
    employees:        num(j.FullTimeEmployees),
    provider: "alphaVantage",
  };
}
