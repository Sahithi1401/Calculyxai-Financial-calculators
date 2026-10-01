// Client-safe types for the institutional data pipeline.
// No secrets, no network — just shapes.

export type Provider = "fmp" | "finnhub" | "alphaVantage" | "yahoo";

export type Quote = {
  symbol: string;
  name?: string;
  exchange?: string;
  currency?: string;
  price: number;
  changeAbs?: number;
  changePct?: number;
  dayHigh?: number;
  dayLow?: number;
  open?: number;
  prevClose?: number;
  week52High?: number;
  week52Low?: number;
  marketCap?: number;
  volume?: number;
  avgVolume?: number;
  source: Provider;
  fetchedAt: string;
};

export type Fundamentals = {
  symbol: string;
  asOf?: string;
  revenue?: number;
  revenueGrowth?: number;
  grossMargin?: number;
  operatingMargin?: number;
  netMargin?: number;
  eps?: number;
  epsGrowth?: number;
  peRatio?: number;
  pegRatio?: number;
  pbRatio?: number;
  psRatio?: number;
  evEbitda?: number;
  dividendYield?: number;
  payoutRatio?: number;
  debtToEquity?: number;
  currentRatio?: number;
  quickRatio?: number;
  interestCoverage?: number;
  roe?: number;
  roa?: number;
  roic?: number;
  fcf?: number;
  fcfYield?: number;
  beta?: number;
  sector?: string;
  industry?: string;
  employees?: number;
  provider: Provider;
};

export type ScoreDriver = {
  label: string;
  weight: number;      // 0..1 contribution weight
  value: number;       // raw metric
  points: number;      // 0..100 contribution
  citation: string;    // human-readable
};

export type ScoreBucket = {
  score: number;               // 0..100
  drivers: ScoreDriver[];
  missing: string[];           // metrics that were unavailable
};

export type StockScores = {
  symbol: string;
  overall: number;
  grade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";
  health: ScoreBucket;
  growth: ScoreBucket;
  value: ScoreBucket;
  risk: ScoreBucket;
  momentum: ScoreBucket;
  version: string;
  computedAt: string;
};

export type StockIntelligence = {
  quote: Quote | null;
  fundamentals: Fundamentals | null;
  scores: StockScores | null;
  warnings: string[];
};
