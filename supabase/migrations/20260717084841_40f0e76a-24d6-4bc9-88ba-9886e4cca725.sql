-- Fix: SUPA_rls_policy_always_true + holding_prices_no_write_policy
-- Scope SELECT to the caller's own holdings and explicitly deny client writes.

DROP POLICY IF EXISTS "authenticated can read prices" ON public.holding_prices;

CREATE POLICY "read prices for own holdings"
  ON public.holding_prices
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.holdings h
      WHERE h.user_id = auth.uid()
        AND h.asset_class = holding_prices.asset_class
        AND h.symbol = holding_prices.symbol
    )
  );

-- Explicit RESTRICTIVE deny for client writes. Backend uses service_role,
-- which bypasses RLS, so cache refreshes continue to work.
CREATE POLICY "no client inserts"
  ON public.holding_prices
  AS RESTRICTIVE
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "no client updates"
  ON public.holding_prices
  AS RESTRICTIVE
  FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "no client deletes"
  ON public.holding_prices
  AS RESTRICTIVE
  FOR DELETE
  TO anon, authenticated
  USING (false);

-- Belt-and-suspenders at the grant layer.
REVOKE INSERT, UPDATE, DELETE ON public.holding_prices FROM anon, authenticated;
GRANT ALL ON public.holding_prices TO service_role;
