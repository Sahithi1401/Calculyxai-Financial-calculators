// Server-only embedding client for the Lovable AI gateway.
import {
  EMBEDDING_MODEL,
  EMBEDDING_ENDPOINT,
  EMBEDDING_BATCH_SIZE,
} from "./config";

async function embedBatch(inputs: string[]): Promise<number[][]> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY not configured");

  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(EMBEDDING_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
      body: JSON.stringify({ model: EMBEDDING_MODEL, input: inputs }),
    });

    if (res.ok) {
      const json = (await res.json()) as {
        data: Array<{ index: number; embedding: number[] }>;
      };
      const out: number[][] = new Array(inputs.length);
      for (const row of json.data) out[row.index] = row.embedding;
      return out;
    }

    const body = await res.text().catch(() => "");
    lastErr = new Error(`Embeddings failed (${res.status}): ${body.slice(0, 300)}`);
    // Only 429 / 5xx are retryable.
    if (res.status !== 429 && res.status < 500) break;
    await new Promise((r) => setTimeout(r, 800 * (attempt + 1) + Math.random() * 400));
  }
  throw lastErr instanceof Error ? lastErr : new Error("Embeddings failed");
}

/** Embed many texts, batched to the provider's per-request item cap. */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  const out: number[][] = [];
  for (let i = 0; i < texts.length; i += EMBEDDING_BATCH_SIZE) {
    const slice = texts.slice(i, i + EMBEDDING_BATCH_SIZE);
    out.push(...(await embedBatch(slice)));
  }
  return out;
}

// --- Short-lived query embedding cache (cuts cost on repeated queries) ---
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_MAX = 200;
const cache = new Map<string, { at: number; vec: number[] }>();

export async function embedQuery(text: string): Promise<number[]> {
  const key = text.trim().toLowerCase().slice(0, 500);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.vec;

  const [vec] = await embedBatch([text]);
  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value as string);
  cache.set(key, { at: Date.now(), vec });
  return vec;
}
