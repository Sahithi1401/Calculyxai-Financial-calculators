import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "get_stock_quote",
  title: "Get live stock quote",
  description:
    "Fetch the latest live quote for a stock symbol. Supports US tickers (e.g. AAPL, MSFT) and Indian NSE/BSE listings (e.g. RELIANCE.NS, TCS.BO). Returns price, change, day range, and previous close.",
  inputSchema: {
    symbol: z
      .string()
      .trim()
      .min(1)
      .max(24)
      .describe("Ticker symbol. Append .NS for NSE India or .BO for BSE India."),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: true },
  handler: async ({ symbol }) => {
    const { fetchQuotesForSymbols } = await import("@/lib/finflow/stocks.functions");
    try {
      const quotes = await fetchQuotesForSymbols({ data: { symbols: [symbol] } });
      const q = quotes[0];
      if (!q) {
        return {
          content: [{ type: "text", text: `No quote found for symbol "${symbol}".` }],
          isError: true,
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `${q.symbol} — ${q.name}\nPrice: ${q.price} ${q.currency} (${q.change >= 0 ? "+" : ""}${q.change.toFixed(2)}, ${q.changePercent.toFixed(2)}%)\nDay range: ${q.low} – ${q.high} | Open: ${q.open} | Prev close: ${q.prevClose}`,
          },
        ],
        structuredContent: q,
      };
    } catch (err) {
      return {
        content: [
          { type: "text", text: `Failed to fetch quote for "${symbol}": ${err instanceof Error ? err.message : String(err)}` },
        ],
        isError: true,
      };
    }
  },
});
