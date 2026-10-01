// Server-only: builds, embeds and upserts the knowledge base.
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { buildCorpus } from "./corpus.server";
import { chunkText, estimateTokens, sha256 } from "./chunk.server";
import { embedTexts } from "./embed.server";
import { EMBEDDING_MODEL } from "./config";

export type IngestResult = {
  documents: number;
  chunks: number;
  embedded: number;
  skipped: number;
  removed: number;
  model: string;
};

export async function ingestKnowledgeBase(force = false): Promise<IngestResult> {
  const docs = buildCorpus();

  type Row = {
    source: string;
    source_id: string;
    chunk_index: number;
    title: string;
    url: string | null;
    country: string | null;
    content: string;
    content_hash: string;
    token_count: number;
    metadata: Record<string, unknown>;
  };

  const rows: Row[] = [];
  for (const doc of docs) {
    const chunks = chunkText(doc.content);
    for (let i = 0; i < chunks.length; i++) {
      const content = chunks[i];
      rows.push({
        source: doc.source,
        source_id: doc.source_id,
        chunk_index: i,
        title: doc.title,
        url: doc.url,
        country: doc.country,
        content,
        content_hash: await sha256(`${EMBEDDING_MODEL}::${content}`),
        token_count: estimateTokens(content),
        metadata: doc.metadata,
      });
    }
  }

  // Existing hashes → skip unchanged chunks.
  const existing = new Map<string, string>();
  if (!force) {
    const { data } = await supabaseAdmin
      .from("kb_documents")
      .select("source_id, chunk_index, content_hash");
    for (const r of data ?? []) {
      existing.set(`${r.source_id}#${r.chunk_index}`, r.content_hash as string);
    }
  }

  const todo = rows.filter(
    (r) => force || existing.get(`${r.source_id}#${r.chunk_index}`) !== r.content_hash,
  );

  let embedded = 0;
  const BATCH = 40;
  for (let i = 0; i < todo.length; i += BATCH) {
    const slice = todo.slice(i, i + BATCH);
    const vectors = await embedTexts(slice.map((r) => `${r.title}\n${r.content}`));
    const payload = slice.map((r, idx) => ({
      ...r,
      embedding: JSON.stringify(vectors[idx]),
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabaseAdmin
      .from("kb_documents")
      // deno-lint-ignore no-explicit-any
      .upsert(payload as never, { onConflict: "source_id,chunk_index" });
    if (error) throw new Error(`kb_documents upsert failed: ${error.message}`);
    embedded += slice.length;
  }

  // Drop chunks that no longer exist in the corpus.
  const keep = new Set(rows.map((r) => `${r.source_id}#${r.chunk_index}`));
  let removed = 0;
  const { data: all } = await supabaseAdmin
    .from("kb_documents")
    .select("id, source_id, chunk_index");
  const stale = (all ?? []).filter((r) => !keep.has(`${r.source_id}#${r.chunk_index}`));
  if (stale.length) {
    const { error } = await supabaseAdmin
      .from("kb_documents")
      .delete()
      .in("id", stale.map((r) => r.id as string));
    if (!error) removed = stale.length;
  }

  return {
    documents: docs.length,
    chunks: rows.length,
    embedded,
    skipped: rows.length - todo.length,
    removed,
    model: EMBEDDING_MODEL,
  };
}
