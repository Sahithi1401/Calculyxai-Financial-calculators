import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { LegalLayout, ContactBlock } from "@/components/finflow/legal-layout";

export const Route = createFileRoute("/ai-disclaimer")({
  head: () =>
    pageHead({
      title: "AI Disclaimer — Calculyx AI",
      description:
        "Understand how our AI copilot reasons, where it can hallucinate, why outputs are probabilistic, and how to verify every number before you act on it.",
      path: "/ai-disclaimer",
      crumbs: [{ name: "Home", path: "/" }, { name: "AI Disclaimer", path: "/ai-disclaimer" }],
    }),
  component: AIDisclaimerPage,
});

function AIDisclaimerPage() {
  return (
    <LegalLayout
      crumbs={[{ name: "Home", path: "/" }, { name: "AI Disclaimer", path: "/ai-disclaimer" }]}
      title={<>AI <span className="font-serif italic text-primary">Disclaimer</span></>}
      intro={
        <div className="flex items-start gap-3 rounded-2xl border border-sheen glass p-5 text-sm">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>
            The Calculyx AI copilot uses large language models to generate financial
            insights. These outputs are <strong>probabilistic estimates</strong>, not deterministic
            answers, and must be independently verified before acting on them.
          </p>
        </div>
      }
    >
      <h2>AI is probabilistic</h2>
      <p>
        Large language models produce the "most likely" next word given your prompt. They
        do not reason like a human financial advisor and do not have access to your full
        personal circumstances. Two similar prompts can produce different answers.
      </p>

      <h2>AI can hallucinate</h2>
      <p>
        Models can confidently produce statements that are outdated, incomplete, or
        entirely fabricated — including invented statistics, ticker fundamentals, tax
        rules, or regulatory citations. Assume any specific number or quotation may be
        wrong until you verify it against a primary source.
      </p>

      <h2>AI should not replace professional judgement</h2>
      <p>
        AI outputs are <strong>not</strong> a substitute for a qualified financial advisor,
        chartered accountant, tax professional, or lawyer. Do not use AI responses as the
        sole basis for regulated decisions — investing, tax filing, insurance choice,
        loan-taking, or legal matters.
      </p>

      <h2>Verify outputs independently</h2>
      <ul>
        <li>Cross-check numbers against a bank, brokerage, or exchange website.</li>
        <li>Cross-check tax and regulatory statements against official government sources.</li>
        <li>Discuss high-stakes decisions with a licensed professional in your jurisdiction.</li>
      </ul>

      <h2>Confidence limitations</h2>
      <p>Even when the AI expresses "confidence" or attaches numeric scores:</p>
      <ul>
        <li>Confidence is a heuristic, not a statistical guarantee.</li>
        <li>High confidence does not imply correctness.</li>
        <li>The model does not know what it does not know.</li>
      </ul>
      <p>
        Wherever possible, Calculyx AI labels outputs with wording like "estimate",
        "typical range", "based on assumptions", or "may vary". Treat those signals as
        real constraints.
      </p>

      <h2>Scope</h2>
      <p>
        The AI copilot is scoped to financial topics — investing, budgeting, taxes,
        retirement, and market understanding. It will refuse or redirect requests
        outside of this scope. See the{" "}
        <a href="/ai-usage" className="text-primary underline underline-offset-4">AI Usage Policy</a>.
      </p>

      <h2>Data sent to the AI</h2>
      <p>
        Prompts and the minimum context needed to answer them (e.g. ticker fundamentals,
        calculator inputs) are sent to our AI provider (Groq) via our server-side
        gateway. We do not send your credentials, full watchlist, or portfolio unless
        directly relevant to the requested analysis. See the{" "}
        <a href="/privacy" className="text-primary underline underline-offset-4">Privacy Policy</a>.
      </p>

      <ContactBlock />
    </LegalLayout>
  );
}
