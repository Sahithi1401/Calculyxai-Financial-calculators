import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_my_holdings",
  title: "List my Calculyx holdings",
  description:
    "List the signed-in Calculyx user's individual investment holdings (stocks, ETFs, mutual funds, crypto, gold, FDs, bonds, EPF, PPF, NPS). Returns symbol, name, asset class, quantity, average cost, and currency.",
  inputSchema: {
    assetClass: z
      .enum(["stock", "etf", "mutual_fund", "crypto", "gold", "fd", "bond", "epf", "ppf", "nps"])
      .optional()
      .describe("Optional: filter by a single asset class."),
    limit: z.number().int().min(1).max(200).optional().describe("Optional: max rows to return (default 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: false },
  handler: async ({ assetClass, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("holdings")
      .select("id, asset_class, symbol, name, quantity, avg_cost, currency, purchase_date")
      .eq("user_id", ctx.getUserId())
      .order("updated_at", { ascending: false })
      .limit(limit ?? 50);
    if (assetClass) query = query.eq("asset_class", assetClass);
    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text", text: `Failed to load holdings: ${error.message}` }], isError: true };
    }
    const rows = data ?? [];
    if (rows.length === 0) {
      return { content: [{ type: "text", text: "No holdings found for the requested filter." }], structuredContent: { rows: [] } };
    }
    const lines = rows.map(
      (h) =>
        `• ${h.name}${h.symbol ? ` (${h.symbol})` : ""} — ${h.asset_class} · qty ${h.quantity} @ avg ${h.avg_cost} ${h.currency}`,
    );
    return {
      content: [{ type: "text", text: `Found ${rows.length} holding(s):\n${lines.join("\n")}` }],
      structuredContent: { rows },
    };
  },
});
