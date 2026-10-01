// Server-only: naive but stable chunker (~500 tokens with overlap).
const CHARS_PER_TOKEN = 4;
const TARGET_TOKENS = 500;
const OVERLAP_TOKENS = 60;

const TARGET_CHARS = TARGET_TOKENS * CHARS_PER_TOKEN;
const OVERLAP_CHARS = OVERLAP_TOKENS * CHARS_PER_TOKEN;

export function chunkText(text: string): string[] {
  const clean = text.replace(/\r/g, "").trim();
  if (clean.length <= TARGET_CHARS) return [clean];

  const lines = clean.split("\n");
  const chunks: string[] = [];
  let buf = "";

  const flush = () => {
    if (!buf.trim()) return;
    chunks.push(buf.trim());
    buf = buf.slice(Math.max(0, buf.length - OVERLAP_CHARS));
  };

  for (const line of lines) {
    if (buf.length + line.length + 1 > TARGET_CHARS) flush();
    buf += (buf ? "\n" : "") + line;
  }
  if (buf.trim()) chunks.push(buf.trim());
  return chunks.filter((c) => c.length > 20);
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

export async function sha256(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
