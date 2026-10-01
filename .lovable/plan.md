# RAG for Calculyx AI

Verified: the Lovable AI gateway embeddings endpoint works (`google/gemini-embedding-2`, 3072 dims). No Edge Function fallback needed. One model for ingest + query, pinned in a config constant.

## Phase A — Vector infrastructure
- Migration: enable `pgvector`; create `kb_documents` (source, source_id, chunk_index, title, url, country, content, content_hash, token_count, `embedding vector(3072)`, metadata, updated_at) with a unique key on (source_id, chunk_index).
- HNSW index on `embedding::halfvec(3072)` cosine (pgvector caps plain vector index at 2000 dims).
- RLS: public read; INSERT/UPDATE/DELETE denied to anon/authenticated via restrictive policies (same pattern as the stock cache tables); service_role full access.
- `match_kb_documents(query_embedding, match_count, filter_country, min_similarity)` returning rows + similarity.

## Phase B — Ingestion
- `src/lib/finflow/rag/corpus.server.ts` builds documents from guides, tax-rules, tax-tips, calculator registry + SEO copy, banks, countries, stocks catalog.
- `chunk.server.ts`: ~500-token chunks with overlap; SHA-256 content hash to skip unchanged chunks.
- `embed.server.ts`: gateway embeddings, batched (<=100 inputs), retry on 429/5xx.
- `ingest.functions.ts`: admin-only server fn (`has_role(admin)` check) that re-indexes; run once to populate.

## Phase C — Retrieval + grounded assistant
- `retrieve.server.ts`: `retrieveContext(query, { country, k })` — embed query (short in-memory TTL cache), call `match_kb_documents`, return title/url/similarity/content.
- `askFinFlowAi`: retrieve for the last user turn, inject numbered sources into the system prompt, instruct inline `[n]` citations, keep every existing guardrail, live-price enrichment and disclaimer. Returns `sources[]`. Any embedding/RPC failure falls back to the current non-RAG path.
- `src/routes/ai.tsx`: compact Sources list under grounded answers; inline `[n]` becomes a link to the matching source.

## Phase D — Features
1. Grounded assistant + citations (Phase C).
2. Semantic ⌘K search — cmdk palette, debounced, server-side embed, deep-links to calculator/guide/stock.
3. "Explain this result" — per-calculator action posting inputs + result + country to a server fn that retrieves rules/guides and returns a grounded cited explanation; optional, spinner, non-blocking.
4. Dashboard insights feed — server fn joining the user's `saved_calculations` (RLS-scoped via `requireSupabaseAuth`) with retrieved guidance for 3–5 cited suggestions.

## Quality rules
- Finance-only scope + injection defenses unchanged; never fabricate a source — with no relevant hit, answer generally and say no internal source was found.
- All secrets and retrieval stay server-side; each phase leaves the app buildable.

## Technical notes
- Model constant: `google/gemini-embedding-2`, dim 3072, cosine, halfvec-indexed.
- Similarity floor 0.5 default, k=6 for chat, k=4 for explain.
