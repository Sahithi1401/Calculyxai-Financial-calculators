import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "get_portfolio_summary",
  title: "Get my Calculyx portfolio summary",
  description:
    "Return the signed-in Calculyx user's overall portfolio: total value, total cost, unrealised gain, gain percentage, diversification score, risk band, and per-asset-class allocation. Uses live prices where available and RLS-scoped holdings.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data: holdings, error } = await supabase
      .from("holdings")
      .select("id, asset_class, symbol, name, quantity, avg_cost, currency, manual_price")
      .eq("user_id", ctx.getUserId());
    if (error) {
      return { content: [{ type: "text", text: `Failed to load holdings: ${error.message}` }], isError: true };
    }
    const rows = holdings ?? [];
    if (rows.length === 0) {
      return {
        content: [{ type: "text", text: "You don't have any holdings on Calculyx yet. Add some at https://calculyxai.online/dashboard." }],
        structuredContent: { holdingsCount: 0 },
      };
    }
    // Try to enrich with live prices for stock/etf entries via holding_prices table.
    const symbols = rows
      .map((h) => h.symbol)
      .filter((s): s is string => typeof s === "string" && s.length > 0);
    let priceBySymbol = new Map<string, number>();
    if (symbols.length > 0) {
      const { data: prices } = await supabase
        .from("holding_prices")
        .select("symbol, price")
        .in("symbol", symbols);
      priceBySymbol = new Map((prices ?? []).map((p) => [p.symbol as string, Number(p.price)]));
    }
    let totalValue = 0;
    let totalCost = 0;
    const alloc = new Map<string, number>();
    for (const h of rows) {
      const qty = Number(h.quantity ?? 0);
      const avg = Number(h.avg_cost ?? 0);
      const live =
        typeof h.manual_price === "number" && h.manual_price > 0
          ? Number(h.manual_price)
          : (h.symbol && priceBySymbol.get(h.symbol)) || avg;
      const value = qty * live;
      const cost = qty * avg;
      totalValue += value;
      totalCost += cost;
      alloc.set(h.asset_class, (alloc.get(h.asset_class) ?? 0) + value);
    }
    const totalGain = totalValue - totalCost;
    const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
    const allocation = Array.from(alloc.entries())
      .map(([asset_class, value]) => ({ asset_class, value, pct: totalValue > 0 ? (value / totalValue) * 100 : 0 }))
      .sort((a, b) => b.value - a.value);
    const hhi = allocation.reduce((s, a) => s + Math.pow(a.pct / 100, 2), 0);
    const diversificationScore = Math.max(0, Math.min(100, Math.round((1 - hhi) * 100)));
    const volatile = allocation
      .filter((a) => a.asset_class === "crypto" || a.asset_class === "stock")
      .reduce((s, a) => s + a.pct, 0);
    const maxPct = allocation[0]?.pct ?? 0;
    const riskBand =
      volatile > 70 || maxPct > 70 ? "High" : volatile < 30 && maxPct < 40 ? "Low" : "Moderate";

    const summary = {
      holdingsCount: rows.length,
      totalValue,
      totalCost,
      totalGain,
      totalGainPct,
      diversificationScore,
      riskBand,
      allocation,
    };
    const lines = [
      `Portfolio summary (${rows.length} holdings)`,
      `Total value: ${totalValue.toFixed(2)}`,
      `Total cost: ${totalCost.toFixed(2)}`,
      `Unrealised gain: ${totalGain.toFixed(2)} (${totalGainPct.toFixed(2)}%)`,
      `Diversification score: ${diversificationScore}/100 · Risk: ${riskBand}`,
      "Allocation:",
      ...allocation.map((a) => `  • ${a.asset_class}: ${a.pct.toFixed(1)}% (${a.value.toFixed(2)})`),
    ];
    return {
      content: [{ type: "text", text: lines.join("\n") }],
      structuredContent: summary,
    };
  },
});
