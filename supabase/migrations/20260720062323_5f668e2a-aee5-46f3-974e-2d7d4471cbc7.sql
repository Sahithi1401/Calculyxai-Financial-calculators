
-- Deny client writes to shared cache tables; service_role bypasses RLS.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['sec_documents','stock_fundamentals','stock_scores','stock_snapshots']
  LOOP
    EXECUTE format('REVOKE INSERT, UPDATE, DELETE ON public.%I FROM anon, authenticated', t);

    EXECUTE format('DROP POLICY IF EXISTS "Deny client inserts" ON public.%I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Deny client updates" ON public.%I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Deny client deletes" ON public.%I', t);

    EXECUTE format('CREATE POLICY "Deny client inserts" ON public.%I AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false)', t);
    EXECUTE format('CREATE POLICY "Deny client updates" ON public.%I AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false)', t);
    EXECUTE format('CREATE POLICY "Deny client deletes" ON public.%I AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false)', t);
  END LOOP;
END $$;
