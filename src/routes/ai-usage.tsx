import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, ContactBlock } from "@/components/finflow/legal-layout";

export const Route = createFileRoute("/ai-usage")({
  head: () =>
    pageHead({
      title: "AI Usage Policy — Calculyx AI",
      description:
        "See what the Calculyx AI copilot will and will not answer: finance-only scope, safety guardrails, prompt logging, and how your chat data is handled.",
      path: "/ai-usage",
      crumbs: [{ name: "Home", path: "/" }, { name: "AI Usage Policy", path: "/ai-usage" }],
    }),
  component: AIUsagePage,
});

function AIUsagePage() {
  return (
    <LegalLayout
      crumbs={[{ name: "Home", path: "/" }, { name: "AI Usage Policy", path: "/ai-usage" }]}
      title={<>AI Usage <span className="font-serif italic text-primary">Policy</span></>}
    >
      <p>
        The Calculyx AI copilot is a <strong>financial-only assistant</strong>. It is
        designed to help you understand markets, run calculations, and think through
        personal-finance decisions. This policy explains what it can and cannot do,
        and how you're expected to use it.
      </p>

      <h2>Allowed uses</h2>
      <ul>
        <li><strong>Financial education</strong> — concepts, definitions, how instruments work.</li>
        <li><strong>Investment research</strong> — analysing tickers, fundamentals, and news you provide.</li>
        <li><strong>Budgeting</strong> — planning cashflow, savings, and goal-based investing.</li>
        <li><strong>Taxes</strong> — general educational information about tax concepts (not filing advice).</li>
        <li><strong>Retirement planning</strong> — assumptions, projections, withdrawal strategies.</li>
        <li><strong>Financial calculations</strong> — EMI, SIP, currency, mortgage, portfolio math.</li>
        <li><strong>Market understanding</strong> — indices, sectors, macroeconomic concepts.</li>
      </ul>

      <h2>Not allowed / out of scope</h2>
      <p>The AI will refuse or redirect requests about:</p>
      <ul>
        <li>Medical advice or diagnosis.</li>
        <li>Legal advice or specific case guidance.</li>
        <li>Political campaigning, endorsements, or partisan content.</li>
        <li>Hate speech, harassment, or content that demeans a protected group.</li>
        <li>Illegal activities of any kind.</li>
        <li>Hacking, malware creation, or evading security controls.</li>
        <li>Prompt-injection attempts — including instructions to ignore its guardrails or reveal system prompts.</li>
        <li>Personal advice about specific regulated decisions where a licensed professional is required.</li>
      </ul>

      <h2>Guardrails</h2>
      <p>To keep responses safe and on-topic, the AI:</p>
      <ul>
        <li>Applies input filters that block prompt-injection patterns and off-topic requests.</li>
        <li>Uses probabilistic and hedging language ("typically", "range", "estimate") for uncertain outputs.</li>
        <li>Adds explicit "not financial advice" reminders on regulated topics.</li>
        <li>Refuses to reveal internal system prompts or bypass its safety configuration.</li>
      </ul>

      <h2>Your responsibilities</h2>
      <ul>
        <li>Do not submit sensitive personal or financial identifiers (account numbers, government IDs, brokerage credentials, OTPs) into the AI.</li>
        <li>Do not rely on AI output as the sole basis for a financial decision — see the <a href="/ai-disclaimer" className="text-primary underline underline-offset-4">AI Disclaimer</a>.</li>
        <li>Do not misuse the AI to produce content that violates the <a href="/acceptable-use" className="text-primary underline underline-offset-4">Acceptable Use Policy</a>.</li>
      </ul>

      <h2>Feedback</h2>
      <p>
        If the AI responds unsafely, off-topic, or in an obviously incorrect way, please
        tell us so we can improve the guardrails.
      </p>

      <ContactBlock />
    </LegalLayout>
  );
}
