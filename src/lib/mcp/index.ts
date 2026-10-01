import { auth, defineMcp } from "@lovable.dev/mcp-js";
import calculateSip from "./tools/calculate-sip";
import calculateLumpsum from "./tools/calculate-lumpsum";
import calculateCagr from "./tools/calculate-cagr";
import calculateFire from "./tools/calculate-fire";
import getStockQuote from "./tools/get-stock-quote";
import getPortfolioSummary from "./tools/get-portfolio-summary";
import listMyHoldings from "./tools/list-my-holdings";

// The OAuth issuer must be the direct Supabase host — the .lovable.cloud proxy
// form causes RFC 8414 issuer mismatch when mcp-js fetches discovery.
// import.meta.env.VITE_SUPABASE_PROJECT_ID is inlined by Vite at build time.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "calculyx-mcp",
  title: "Calculyx AI",
  version: "0.1.0",
  instructions:
    "Calculyx AI is an AI-powered personal finance and investing workspace. Use these tools to run investing calculators (SIP, lumpsum, CAGR, FIRE), fetch live stock quotes for US and Indian markets, and (for signed-in users) inspect their Calculyx portfolio and individual holdings. All monetary values are returned in the user's own currency; treat outputs as informational and probabilistic, not financial advice.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    calculateSip,
    calculateLumpsum,
    calculateCagr,
    calculateFire,
    getStockQuote,
    getPortfolioSummary,
    listMyHoldings,
  ],
});
