import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { LegalLayout, ContactBlock } from "@/components/finflow/legal-layout";

export const Route = createFileRoute("/disclaimer")({
  head: () =>
    pageHead({
      title: "Financial Disclaimer — Calculyx AI",
      description:
        "Calculyx AI is educational only and never investment, tax or legal advice. Read the limits of our calculators and market data before making decisions.",
      path: "/disclaimer",
      crumbs: [{ name: "Home", path: "/" }, { name: "Financial Disclaimer", path: "/disclaimer" }],
    }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <LegalLayout
      crumbs={[{ name: "Home", path: "/" }, { name: "Financial Disclaimer", path: "/disclaimer" }]}
      title={<>Financial <span className="font-serif italic text-primary">Disclaimer</span></>}
      intro={
        <div className="flex items-start gap-3 rounded-2xl border border-sheen glass p-5 text-sm">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <p>
            Calculyx AI is an <strong>educational financial intelligence platform</strong>.
            All calculators, AI responses, reports, and news summaries are provided
            for <strong>informational purposes only</strong> — not financial, tax, legal,
            accounting, brokerage, or investment advice.
          </p>
        </div>
      }
    >
      <h2>Not advice</h2>
      <p>Calculyx AI does <strong>not</strong> provide:</p>
      <ul>
        <li>Investment advice</li>
        <li>Financial advice</li>
        <li>Tax advice</li>
        <li>Legal advice</li>
        <li>Accounting advice</li>
        <li>Brokerage services</li>
      </ul>

      <h2>AI-generated responses</h2>
      <p>Outputs from the Calculyx AI copilot and stock analysis engine:</p>
      <ul>
        <li>May contain factual errors or "hallucinations".</li>
        <li>May be based on outdated market or regulatory information.</li>
        <li>Are generated automatically by large language models.</li>
        <li>Should <strong>not</strong> be relied upon as the sole basis for any financial decision.</li>
      </ul>
      <p>
        Independently verify any figure, formula, or claim before acting on it. See our{" "}
        <a href="/ai-disclaimer" className="text-primary underline underline-offset-4">AI Disclaimer</a>.
      </p>

      <h2>Consult a licensed professional</h2>
      <p>
        Before making any financial decision — investing, taking a loan, buying property,
        remitting funds internationally, choosing insurance, filing taxes, or planning
        retirement — consult a licensed advisor in your jurisdiction.
      </p>

      <h2>Asset-specific warnings</h2>

      <h3>Stocks</h3>
      <p>
        Stock prices are volatile and past performance does not guarantee future returns.
        You can lose the entire capital you invest.
      </p>

      <h3>ETFs</h3>
      <p>
        ETFs are subject to market risk, tracking error, and liquidity risk. Read the
        offer document before investing.
      </p>

      <h3>Mutual funds</h3>
      <p>
        Mutual fund investments are subject to market risks. Read all scheme-related
        documents carefully before investing.
      </p>

      <h3>Cryptocurrency</h3>
      <p>
        Crypto assets are highly volatile, largely unregulated, and can lose value
        rapidly. Regulatory status varies by country.
      </p>

      <h3>Forex</h3>
      <p>
        Forex trading carries a high level of risk and is not suitable for every
        investor. Leverage magnifies losses as well as gains.
      </p>

      <h3>Real estate</h3>
      <p>
        Real estate prices, rental yields, and taxes vary widely by location and time.
        Legal costs, stamp duty, and maintenance may not be reflected in calculator
        outputs.
      </p>

      <h3>Retirement planning</h3>
      <p>
        Retirement projections rely on assumptions about inflation, returns, and life
        expectancy that will not exactly match reality. Review your plan regularly.
      </p>

      <h3>Taxes</h3>
      <p>
        Tax calculators are estimates based on published slabs and rules. They do not
        replace advice from a licensed tax professional and may not reflect the latest
        regulations.
      </p>

      <h3>Loans</h3>
      <p>
        EMI and loan-affordability numbers exclude processing fees, insurance, taxes,
        and prepayment penalties that individual lenders may impose.
      </p>

      <h3>Insurance</h3>
      <p>
        Insurance premiums, coverage, and exclusions vary by insurer. Always read the
        policy wording before purchasing.
      </p>

      <h2>Market data</h2>
      <p>
        Quotes, fundamentals, and news come from third-party providers and may be
        delayed, incomplete, or interrupted. See the{" "}
        <a href="/market-data" className="text-primary underline underline-offset-4">Market Data Disclaimer</a>.
      </p>

      <h2>No fiduciary relationship</h2>
      <p>
        Using Calculyx AI does not create a client, fiduciary, or advisory relationship
        between you and us. We are not a bank, broker, RIA, IFA, tax preparer, or law
        firm.
      </p>

      <h2>Third-party links</h2>
      <p>
        Where we link to banks, brokers, exchanges, or other websites, we are not
        responsible for their content, pricing, or terms.
      </p>

      <ContactBlock />
    </LegalLayout>
  );
}
