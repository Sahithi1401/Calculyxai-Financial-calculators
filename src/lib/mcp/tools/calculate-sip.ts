import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { sip } from "@/lib/finflow/investing-calcs";

export default defineTool({
  name: "calculate_sip",
  title: "Calculate SIP (Systematic Investment Plan)",
  description:
    "Compute the future value, total invested amount, and estimated gains of a monthly Systematic Investment Plan (SIP) given a monthly contribution, expected annual return, and investment duration in years.",
  inputSchema: {
    monthly: z.number().positive().describe("Monthly contribution amount (in your currency, e.g. INR or USD)."),
    rate: z.number().min(0).max(60).describe("Expected annual return rate in percent (e.g. 12 for 12%)."),
    years: z.number().positive().describe("Investment duration in years."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ monthly, rate, years }) => {
    const r = sip({ monthly, rate, years });
    return {
      content: [
        {
          type: "text",
          text: `SIP over ${years} year(s) at ${rate}% p.a.\nInvested: ${r.invested.toFixed(2)}\nFuture value: ${r.futureValue.toFixed(2)}\nEstimated gains: ${r.gains.toFixed(2)}`,
        },
      ],
      structuredContent: r,
    };
  },
});
