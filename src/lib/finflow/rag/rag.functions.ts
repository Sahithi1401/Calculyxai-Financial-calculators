import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type RagSource = { n: number; title: string; url: string | null; similarity: number };

/** Admin-only: rebuild / refresh the knowledge base embeddings. */
export const reindexKnowledgeBase = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ force: z.boolean().optional() }).parse(d ?? {}))
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error || !isAdmin) throw new Error("Forbidden");

    const { ingestKnowledgeBase } = await import("./ingest.server");
    return await ingestKnowledgeBase(data.force ?? false);
  });

/** Semantic site search — powers the ⌘K palette. Public (KB content is public). */
export const semanticSearch = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        query: z.string().min(2).max(200),
        country: z.enum(["IN", "US", "AE"]).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { retrieveContext } = await import("./retrieve.server");
    const chunks = await retrieveContext(data.query, {
      country: data.country ?? null,
      k: 8,
      minSimilarity: 0.35,
    });

    // De-duplicate by source_id so one guide doesn't fill the palette.
    const seen = new Set<string>();
    const results: Array<{
      title: string;
      url: string | null;
      source: string;
      snippet: string;
      similarity: number;
    }> = [];
    for (const c of chunks) {
      if (seen.has(c.source_id)) continue;
      seen.add(c.source_id);
      results.push({
        title: c.title,
        url: c.url,
        source: c.source,
        snippet: c.content.replace(/\s+/g, " ").slice(0, 140),
        similarity: c.similarity,
      });
    }
    return { results };
  });

/**
 * "Explain this result" — grounded, plain-English explanation of a calculator output.
 * Signed-in only (uses the AI provider).
 */
export const explainResult = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        slug: z.string().min(1).max(60),
        title: z.string().min(1).max(160),
        country: z.enum(["IN", "US", "AE"]).optional(),
        brief: z.string().min(10).max(4000),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { retrieveContext, formatSources } = await import("./retrieve.server");
    const { callGroq } = await import("../groq.server");
    const { AI_OUTPUT_DISCLAIMER } = await import("../ai-guardrails");

    const chunks = await retrieveContext(`${data.title} ${data.slug} explain result`, {
      country: data.country ?? null,
      k: 5,
      minSimilarity: 0.35,
    });

    const grounding = chunks.length
      ? `Knowledge base excerpts you may cite with [n]:\n\n${formatSources(chunks)}`
      : "No knowledge base excerpts available — answer from general finance knowledge and do not cite.";

    const reply = await callGroq(
      [
        {
          role: "system",
          content: `You are Calculyx AI explaining a financial calculator result to a non-expert.
Write 4 short sections with markdown headings: "What this means", "How it was calculated", "What drives it most", "What to do next".
Be numerate and concrete, reuse the exact numbers given, bold key figures, keep the whole answer under 280 words.
Cite knowledge base excerpts inline as [1], [2] only when you actually used them. No financial advice.`,
        },
        {
          role: "user",
          content: `${grounding}\n\nCalculator: ${data.title} (${data.slug}). Jurisdiction: ${data.country ?? "IN"}.\n\nResult summary:\n${data.brief}`,
        },
      ],
      { temperature: 0.4 },
    );

    const sources: RagSource[] = chunks.map((c, i) => ({
      n: i + 1,
      title: c.title,
      url: c.url,
      similarity: c.similarity,
    }));

    return { explanation: `${reply}\n\n${AI_OUTPUT_DISCLAIMER}`, sources };
  });

/** Personalized insights feed for the dashboard — grounded in the KB + the user's own data. */
export const personalizedInsights = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ country: z.enum(["IN", "US", "AE"]).optional() }).parse(d ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const [{ data: calcs }, { data: holdings }, { data: nw }] = await Promise.all([
      supabase
        .from("saved_calculations")
        .select("calculator_type, name, summary, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("holdings")
        .select("asset_class, symbol, name, quantity, avg_cost, currency")
        .eq("user_id", userId)
        .limit(25),
      supabase
        .from("net_worth_entries")
        .select("kind, category, label, amount, currency")
        .eq("user_id", userId)
        .limit(40),
    ]);

    const hasData = !!(calcs?.length || holdings?.length || nw?.length);
    if (!hasData) {
      return { insights: [] as Array<{ title: string; body: string; tag: string; href?: string }>, sources: [] as RagSource[], empty: true as const };
    }

    const profile = [
      calcs?.length
        ? `Recent calculations: ${calcs.map((c) => `${c.calculator_type} (${c.name})`).join("; ")}`
        : "",
      holdings?.length
        ? `Holdings: ${holdings.map((h) => `${h.symbol ?? h.name} ${h.quantity}@${h.avg_cost} ${h.currency} [${h.asset_class}]`).join("; ")}`
        : "",
      nw?.length
        ? `Net worth entries: ${nw.map((e) => `${e.kind}/${e.category} ${e.label} ${e.amount} ${e.currency}`).join("; ")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n")
      .slice(0, 5000);

    const { retrieveContext, formatSources } = await import("./retrieve.server");
    const { callGroq } = await import("../groq.server");

    const chunks = await retrieveContext(profile.slice(0, 1200), {
      country: data.country ?? null,
      k: 6,
      minSimilarity: 0.3,
    });

    const grounding = chunks.length ? formatSources(chunks) : "None available.";

    const raw = await callGroq(
      [
        {
          role: "system",
          content: `You are Calculyx AI generating a personalized financial insights feed.
Return STRICT JSON: {"insights":[{"title":string,"body":string,"tag":string}]} with 3 to 5 items.
title <= 60 chars. body <= 320 chars, concrete, uses the user's own numbers where possible, may cite excerpts as [1].
tag is one of: "Portfolio", "Tax", "Savings", "Debt", "Retirement", "Risk".
No financial advice, no fabricated data.`,
        },
        {
          role: "user",
          content: `Jurisdiction: ${data.country ?? "IN"}.\n\nUser data:\n${profile}\n\nKnowledge base excerpts:\n${grounding}`,
        },
      ],
      { json: true, temperature: 0.5 },
    );

    let insights: Array<{ title: string; body: string; tag: string }> = [];
    try {
      const parsed = JSON.parse(raw) as { insights?: Array<{ title?: string; body?: string; tag?: string }> };
      insights = (parsed.insights ?? [])
        .filter((i) => i.title && i.body)
        .slice(0, 5)
        .map((i) => ({ title: String(i.title), body: String(i.body), tag: String(i.tag ?? "Insight") }));
    } catch {
      insights = [];
    }

    const sources: RagSource[] = chunks.map((c, i) => ({
      n: i + 1,
      title: c.title,
      url: c.url,
      similarity: c.similarity,
    }));

    return { insights, sources, empty: false as const };
  });
