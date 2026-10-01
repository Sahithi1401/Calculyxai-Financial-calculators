import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, ContactBlock } from "@/components/finflow/legal-layout";

export const Route = createFileRoute("/acceptable-use")({
  head: () =>
    pageHead({
      title: "Acceptable Use Policy — Calculyx AI",
      description:
        "Know exactly what is allowed on Calculyx AI: fair-use limits, scraping and abuse rules, API etiquette, and what happens if an account breaks them.",
      path: "/acceptable-use",
      crumbs: [{ name: "Home", path: "/" }, { name: "Acceptable Use Policy", path: "/acceptable-use" }],
    }),
  component: AcceptableUsePage,
});

function AcceptableUsePage() {
  return (
    <LegalLayout
      crumbs={[{ name: "Home", path: "/" }, { name: "Acceptable Use Policy", path: "/acceptable-use" }]}
      title={<>Acceptable Use <span className="font-serif italic text-primary">Policy</span></>}
    >
      <p>
        This Acceptable Use Policy ("AUP") governs how you use Calculyx AI. It
        supplements our <a href="/terms" className="text-primary underline underline-offset-4">Terms & Conditions</a>. By using the Service you agree not to:
      </p>

      <h2>Prohibited activities</h2>
      <ul>
        <li><strong>Abuse the platform</strong> — harassing other users, staff, or third parties.</li>
        <li><strong>Prompt injection</strong> — attempting to override, bypass, or manipulate the AI's system instructions.</li>
        <li><strong>Extract system prompts</strong> — trying to reveal hidden prompts, guardrails, or internal instructions.</li>
        <li><strong>Reverse engineer</strong> — decompiling, disassembling, or otherwise attempting to derive source code or model weights.</li>
        <li><strong>Automated scraping</strong> — crawling, scraping, or bulk-downloading content or API responses.</li>
        <li><strong>DDoS / rate abuse</strong> — flooding the Service or its APIs with requests designed to degrade availability.</li>
        <li><strong>Spam</strong> — using contact forms, newsletter, or AI features to send spam or unsolicited marketing.</li>
        <li><strong>Malware</strong> — uploading, linking to, or distributing viruses, worms, or malicious code.</li>
        <li><strong>API abuse</strong> — reselling API responses, sharing keys, or circumventing rate limits.</li>
        <li><strong>Illegal activities</strong> — anything that violates applicable law in your jurisdiction or ours.</li>
        <li><strong>Financial abuse</strong> — using the platform to facilitate fraud, money laundering, market manipulation, or unlicensed advisory services.</li>
        <li><strong>Impersonation</strong> — pretending to be another person, brand, or entity.</li>
        <li><strong>Circumventing security</strong> — probing, scanning, or testing the vulnerability of the Service without written permission.</li>
      </ul>

      <h2>AI-specific rules</h2>
      <ul>
        <li>Do not attempt to make the AI produce medical, legal, or political advocacy content — the AI is scoped to financial topics only. See the <a href="/ai-usage" className="text-primary underline underline-offset-4">AI Usage Policy</a>.</li>
        <li>Do not attempt to extract personal data about other users through prompts.</li>
        <li>Do not use AI outputs to create investment advisory services without proper licensing.</li>
      </ul>

      <h2>Enforcement</h2>
      <p>
        We reserve the right — at our sole discretion and without notice — to:
      </p>
      <ul>
        <li>Rate-limit, throttle, or block abusive traffic.</li>
        <li>Suspend or terminate accounts.</li>
        <li>Remove content that violates this policy.</li>
        <li>Cooperate with law-enforcement authorities where required.</li>
      </ul>

      <h2>Reporting abuse</h2>
      <p>
        If you notice abuse or a security issue, please report it to us at the address
        below. See also our <a href="/security" className="text-primary underline underline-offset-4">Security Statement</a>.
      </p>

      <ContactBlock label="Contact for abuse reports" />
    </LegalLayout>
  );
}
