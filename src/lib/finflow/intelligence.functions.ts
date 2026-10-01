import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { StockIntelligence } from "./pipeline/types";

const Input = z.object({
  symbol: z.string().min(1).max(20).regex(/^[A-Za-z0-9.\-^]+$/, "invalid symbol"),
});

export const getStockIntelligence = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => Input.parse(raw))
  .handler(async ({ data }): Promise<StockIntelligence> => {
    const { getStockIntelligence: run } = await import("./pipeline/orchestrator.server");
    return run(data.symbol);
  });
