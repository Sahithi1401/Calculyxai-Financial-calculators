// Server-only retrieval helper shared by every RAG feature.
import { embedQuery } from "./embed.server";
import { RETRIEVAL_DEFAULTS, type RetrievedChunk } from "./config";

/**
 * Embed the query and pull the most similar knowledge-base chunks.
 * Never throws — retrieval failures degrade to an empty list so callers
 * can fall back to a non-RAG answer.
 */
export async function retrieveContext(
  query: string,
  opts: { country?: string | null; k?: number; minSimilarity?: number } = {},
): Promise<RetrievedChunk[]> {
  const text = query.trim();
  if (!text) return [];

  try {
    const embedding = await embedQuery(text.slice(0, 4000));
    // Knowledge base is server-only (no public RLS read), so query via the service client.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.rpc("match_kb_documents", {
      query_embedding: JSON.stringify(embedding),
      match_count: opts.k ?? RETRIEVAL_DEFAULTS.chatK,
      ...(opts.country ? { filter_country: opts.country } : {}),
      min_similarity: opts.minSimilarity ?? RETRIEVAL_DEFAULTS.minSimilarity,
    });
    if (error) {
      console.error("[rag] match_kb_documents failed:", error.message);
      return [];
    }
    return (data ?? []) as unknown as RetrievedChunk[];
  } catch (e) {
    console.error("[rag] retrieval failed:", e instanceof Error ? e.message : e);
    return [];
  }
}

/** Render retrieved chunks as a numbered source block for prompt injection. */
export function formatSources(chunks: RetrievedChunk[]): string {
  return chunks
    .map(
      (c, i) =>
        `[${i + 1}] ${c.title}${c.url ? ` (${c.url})` : ""}\n${c.content.slice(0, 1600)}`,
    )
    .join("\n\n");
}
