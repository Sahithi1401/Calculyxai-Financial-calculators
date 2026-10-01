import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { cagr } from "@/lib/finflow/investing-calcs";

export default defineTool({
  name: "calculate_cagr",
  title: "Calculate CAGR (Compound Annual Growth Rate)",
  description:
    "Compute the Compound Annual Growth Rate (CAGR) between a start value and an end value over a given number of years, along with the total multiplier.",
  inputSchema: {
    start: z.number().positive().describe("Starting value / initial investment."),
    end: z.number().positive().describe("Ending value / final amount."),
    years: z.number().positive().describe("Duration in years between start and end."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ start, end, years }) => {
    const r = cagr({ start, end, years });
    return {
      content: [
        {
          type: "text",
          text: `CAGR: ${r.cagr.toFixed(2)}% over ${years} year(s)\nMultiplier: ${r.multiplier.toFixed(2)}x`,
        },
      ],
      structuredContent: r,
    };
  },
});
