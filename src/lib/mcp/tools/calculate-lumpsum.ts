import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { lumpsum } from "@/lib/finflow/investing-calcs";

export default defineTool({
  name: "calculate_lumpsum",
  title: "Calculate lumpsum future value",
  description:
    "Compute the future value and gains of a one-time (lumpsum) investment compounded annually.",
  inputSchema: {
    principal: z.number().positive().describe("Initial one-time investment amount."),
    rate: z.number().min(0).max(60).describe("Expected annual return in percent."),
    years: z.number().positive().describe("Investment duration in years."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ principal, rate, years }) => {
    const r = lumpsum({ principal, rate, years });
    return {
      content: [
        {
          type: "text",
          text: `Lumpsum of ${principal} at ${rate}% p.a. for ${years} year(s)\nFuture value: ${r.futureValue.toFixed(2)}\nGains: ${r.gains.toFixed(2)}`,
        },
      ],
      structuredContent: r,
    };
  },
});
