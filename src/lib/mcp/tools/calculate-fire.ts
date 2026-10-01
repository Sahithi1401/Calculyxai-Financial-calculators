import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fire } from "@/lib/finflow/investing-calcs";

export default defineTool({
  name: "calculate_fire",
  title: "Calculate FIRE number (retirement corpus)",
  description:
    "Compute the Financial Independence / Retire Early (FIRE) number — the corpus required to sustain a given annual expense at a safe withdrawal rate — along with Lean FIRE and Fat FIRE variants.",
  inputSchema: {
    annualExpense: z.number().positive().describe("Expected annual expense in retirement."),
    withdrawalRate: z
      .number()
      .min(1)
      .max(10)
      .optional()
      .describe("Safe withdrawal rate in percent (default 4)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ annualExpense, withdrawalRate }) => {
    const r = fire({ annualExpense, withdrawalRate });
    return {
      content: [
        {
          type: "text",
          text: `FIRE number: ${r.fireNumber.toFixed(0)}\nLean FIRE: ${r.leanFire.toFixed(0)}\nFat FIRE: ${r.fatFire.toFixed(0)}`,
        },
      ],
      structuredContent: r,
    };
  },
});
