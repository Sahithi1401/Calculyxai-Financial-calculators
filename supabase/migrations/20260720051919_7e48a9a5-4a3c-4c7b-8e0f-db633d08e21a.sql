
-- =========================================================
-- Institutional Data Pipeline — cache tables (public data)
-- =========================================================

CREATE TABLE IF NOT EXISTS public.stock_snapshots (
  symbol           text PRIMARY KEY,
  exchange         text,
  name             text,
  currency         text,
  price            numeric,
  change_abs       numeric,
  change_pct       numeric,
  day_high         numeric,
  day_low          numeric,
  open             numeric,
  prev_close       numeric,
  week52_high      numeric,
  week52_low       numeric,
  market_cap       numeric,
  volume           numeric,
  avg_volume       numeric,
  source           text,
  fetched_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.stock_snapshots TO anon, authenticated;
GRANT ALL    ON public.stock_snapshots TO service_role;
ALTER TABLE public.stock_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stock_snapshots_public_read" ON public.stock_snapshots
  FOR SELECT TO anon, authenticated USING (true);

-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.stock_fundamentals (
  symbol            text PRIMARY KEY,
  as_of             date,
  revenue           numeric,
  revenue_growth    numeric,
  gross_margin      numeric,
  operating_margin  numeric,
  net_margin        numeric,
  eps               numeric,
  eps_growth        numeric,
  pe_ratio          numeric,
  peg_ratio         numeric,
  pb_ratio          numeric,
  ps_ratio          numeric,
  ev_ebitda         numeric,
  dividend_yield    numeric,
  payout_ratio      numeric,
  debt_to_equity    numeric,
  current_ratio     numeric,
  quick_ratio       numeric,
  interest_coverage numeric,
  roe               numeric,
  roa               numeric,
  roic              numeric,
  fcf               numeric,
  fcf_yield         numeric,
  beta              numeric,
  sector            text,
  industry          text,
  employees         integer,
  provider          text,
  raw               jsonb NOT NULL DEFAULT '{}'::jsonb,
  fetched_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.stock_fundamentals TO anon, authenticated;
GRANT ALL    ON public.stock_fundamentals TO service_role;
ALTER TABLE public.stock_fundamentals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stock_fundamentals_public_read" ON public.stock_fundamentals
  FOR SELECT TO anon, authenticated USING (true);

-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.stock_scores (
  symbol         text PRIMARY KEY,
  score_health   numeric,
  score_growth   numeric,
  score_value    numeric,
  score_risk     numeric,
  score_momentum numeric,
  score_overall  numeric,
  grade          text,
  drivers        jsonb NOT NULL DEFAULT '{}'::jsonb,
  version        text NOT NULL DEFAULT 'v1',
  computed_at    timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.stock_scores TO anon, authenticated;
GRANT ALL    ON public.stock_scores TO service_role;
ALTER TABLE public.stock_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stock_scores_public_read" ON public.stock_scores
  FOR SELECT TO anon, authenticated USING (true);

-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.sec_documents (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol       text NOT NULL,
  cik          text,
  form_type    text,
  filing_date  date,
  accession_no text,
  title        text,
  section      text,
  url          text,
  content      text,
  token_count  integer,
  metadata     jsonb NOT NULL DEFAULT '{}'::jsonb,
  fetched_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sec_documents_symbol_idx  ON public.sec_documents(symbol);
CREATE INDEX IF NOT EXISTS sec_documents_filing_idx  ON public.sec_documents(filing_date DESC);

GRANT SELECT ON public.sec_documents TO anon, authenticated;
GRANT ALL    ON public.sec_documents TO service_role;
ALTER TABLE public.sec_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sec_documents_public_read" ON public.sec_documents
  FOR SELECT TO anon, authenticated USING (true);

-- ---------------------------------------------------------
-- updated_at triggers

CREATE TRIGGER stock_snapshots_touch     BEFORE UPDATE ON public.stock_snapshots     FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER stock_fundamentals_touch  BEFORE UPDATE ON public.stock_fundamentals  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER stock_scores_touch        BEFORE UPDATE ON public.stock_scores        FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER sec_documents_touch       BEFORE UPDATE ON public.sec_documents       FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
