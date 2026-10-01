CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE public.kb_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  source_id text NOT NULL,
  chunk_index integer NOT NULL DEFAULT 0,
  title text NOT NULL,
  url text,
  country text,
  content text NOT NULL,
  content_hash text NOT NULL,
  token_count integer,
  embedding vector(3072) NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_id, chunk_index)
);

GRANT SELECT ON public.kb_documents TO anon, authenticated;
GRANT ALL ON public.kb_documents TO service_role;

ALTER TABLE public.kb_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "kb_documents_public_read" ON public.kb_documents FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Deny client inserts" ON public.kb_documents AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "Deny client updates" ON public.kb_documents AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Deny client deletes" ON public.kb_documents AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false);

CREATE INDEX kb_documents_embedding_idx ON public.kb_documents USING hnsw ((embedding::halfvec(3072)) halfvec_cosine_ops);
CREATE INDEX kb_documents_source_idx ON public.kb_documents (source);
CREATE INDEX kb_documents_country_idx ON public.kb_documents (country);

CREATE TRIGGER kb_documents_touch BEFORE UPDATE ON public.kb_documents FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.match_kb_documents(
  query_embedding vector(3072),
  match_count int DEFAULT 6,
  filter_country text DEFAULT NULL,
  min_similarity float DEFAULT 0.5
)
RETURNS TABLE (
  id uuid,
  source text,
  source_id text,
  title text,
  url text,
  country text,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  SELECT d.id, d.source, d.source_id, d.title, d.url, d.country, d.content, d.metadata,
         1 - (d.embedding::halfvec(3072) <=> query_embedding::halfvec(3072)) AS similarity
  FROM public.kb_documents d
  WHERE (filter_country IS NULL OR d.country IS NULL OR d.country = filter_country)
    AND 1 - (d.embedding::halfvec(3072) <=> query_embedding::halfvec(3072)) >= min_similarity
  ORDER BY d.embedding::halfvec(3072) <=> query_embedding::halfvec(3072)
  LIMIT match_count;
$$;

GRANT EXECUTE ON FUNCTION public.match_kb_documents(vector, int, text, float) TO anon, authenticated, service_role;