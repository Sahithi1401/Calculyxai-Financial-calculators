// Single source of truth for the RAG embedding model.
// The same model MUST be used for ingestion and query so dimensions match.

export const EMBEDDING_MODEL = "google/gemini-embedding-2";
export const EMBEDDING_DIM = 3072;
export const EMBEDDING_ENDPOINT = "https://ai.gateway.lovable.dev/v1/embeddings";

/** Max inputs per embeddings request for the Google embedding models. */
export const EMBEDDING_BATCH_SIZE = 50;

/** Default retrieval knobs. */
export const RETRIEVAL_DEFAULTS = {
  chatK: 6,
  explainK: 5,
  searchK: 8,
  minSimilarity: 0.5,
} as const;

export type RetrievedChunk = {
  id: string;
  source: string;
  source_id: string;
  title: string;
  url: string | null;
  country: string | null;
  content: string;
  similarity: number;
};
