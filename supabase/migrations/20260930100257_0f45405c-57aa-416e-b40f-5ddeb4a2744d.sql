DROP POLICY IF EXISTS "stock_snapshots_public_read" ON public.stock_snapshots;
DROP POLICY IF EXISTS "sec_documents_public_read" ON public.sec_documents;
DROP POLICY IF EXISTS "stock_scores_public_read" ON public.stock_scores;
DROP POLICY IF EXISTS "stock_fundamentals_public_read" ON public.stock_fundamentals;
DROP POLICY IF EXISTS "kb_documents_public_read" ON public.kb_documents;

REVOKE SELECT ON public.stock_snapshots, public.sec_documents, public.stock_scores, public.stock_fundamentals, public.kb_documents FROM anon, authenticated;
GRANT ALL ON public.stock_snapshots, public.sec_documents, public.stock_scores, public.stock_fundamentals, public.kb_documents TO service_role;

REVOKE EXECUTE ON FUNCTION public.match_kb_documents(vector, integer, text, double precision) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.match_kb_documents(vector, integer, text, double precision) TO service_role;