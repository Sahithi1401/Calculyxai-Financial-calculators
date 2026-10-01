import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, ContactBlock, LEGAL_EMAIL } from "@/components/finflow/legal-layout";

export const Route = createFileRoute("/terms")({
  head: () =>
    pageHead({
      title: "Terms & Conditions — Calculyx AI",
      description:
        "The plain-language terms for using Calculyx AI calculators, market data and AI copilot: your rights, our limits of liability, billing, and account rules.",
      path: "/terms",
      crumbs: [{ name: "Home", path: "/" }, { name: "Terms & Conditions", path: "/terms" }],
    }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalLayout
      crumbs={[{ name: "Home", path: "/" }, { name: "Terms & Conditions", path: "/terms" }]}
      title={<>Terms & <span className="font-serif italic text-primary">Conditions</span></>}
    >
      <p>
        These Terms & Conditions ("Terms") govern your access to and use of Calculyx AI
        (the "Service"), operated from Visakhapatnam, India. By using the Service you
        agree to these Terms.
      </p>

      <h2>1. Acceptance of terms</h2>
      <p>
        By accessing, browsing, or using Calculyx AI in any form — website, calculators,
        AI copilot, PDF/Excel exports, or newsletter — you accept these Terms and our{" "}
        <a href="/privacy" className="text-primary underline underline-offset-4">Privacy Policy</a>,{" "}
        <a href="/disclaimer" className="text-primary underline underline-offset-4">Financial Disclaimer</a>,{" "}
        <a href="/acceptable-use" className="text-primary underline underline-offset-4">Acceptable Use Policy</a>,{" "}
        and <a href="/cookies" className="text-primary underline underline-offset-4">Cookie Policy</a>. If you do not agree, do not use the Service.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years old (or the age of majority in your jurisdiction) to
        use Calculyx AI. If you are using the Service on behalf of an organization, you
        represent that you are authorised to bind that organization to these Terms.
      </p>

      <h2>3. User accounts</h2>
      <ul>
        <li>Accounts are optional for most calculators, but required for saving reports, watchlists, and portfolios.</li>
        <li>You are responsible for keeping your credentials confidential and for all activity under your account.</li>
        <li>Notify us immediately at <a href={`mailto:${LEGAL_EMAIL}`} className="text-primary underline underline-offset-4">{LEGAL_EMAIL}</a> if you suspect unauthorized access.</li>
      </ul>

      <h2>4. Acceptable use</h2>
      <p>
        Your use of the Service is subject to our{" "}
        <a href="/acceptable-use" className="text-primary underline underline-offset-4">Acceptable Use Policy</a>. You agree not to abuse the Service, attempt prompt injection,
        scrape data at scale, reverse engineer the platform, or use it for illegal activity.
      </p>

      <h2>5. Intellectual property</h2>
      <p>
        The Calculyx AI brand, logo, interface, calculators, prompts, code, and content are
        owned by us and protected by copyright and other laws. See our{" "}
        <a href="/copyright" className="text-primary underline underline-offset-4">Copyright Policy</a>. You retain ownership of inputs you submit and grant us a limited
        licence to process them solely to operate the Service on your behalf.
      </p>

      <h2>6. AI-generated content</h2>
      <p>
        Portions of the Service use large language models to produce analysis, summaries,
        and reports. AI-generated content is <strong>informational only</strong>, may be
        incomplete or incorrect, and should not be relied upon as the sole basis for any
        financial decision. See the <a href="/ai-disclaimer" className="text-primary underline underline-offset-4">AI Disclaimer</a>.
      </p>

      <h2>7. Market data providers</h2>
      <p>
        Quotes, fundamentals, charts, and news are supplied by third-party market data
        providers (including public feeds for US, Indian, and global markets). Data may be
        delayed, incomplete, or inaccurate. See our{" "}
        <a href="/market-data" className="text-primary underline underline-offset-4">Market Data Disclaimer</a>.
      </p>

      <h2>8. Third-party APIs & services</h2>
      <p>
        Calculyx AI integrates with third-party services including Groq (AI inference),
        Finnhub, Indian market data providers, Resend (transactional email), and Vercel/Cloudflare
        (hosting). Their availability, accuracy, and policies are outside our control.
      </p>

      <h2>9. Service availability</h2>
      <p>
        The Service is offered on an <strong>"as-is" and "as-available"</strong> basis. We
        do not guarantee uninterrupted, error-free, or secure access. Features may be
        added, changed, or removed without notice.
      </p>

      <h2>10. No financial or professional advice</h2>
      <p>
        Calculyx AI is an educational platform. Nothing on the Service — including AI
        responses, calculator outputs, watchlist analytics, or news summaries — constitutes
        investment, financial, tax, legal, accounting, brokerage, or fiduciary advice.
        Always consult a licensed professional in your jurisdiction before acting on any
        information you obtain here.
      </p>

      <h2>11. User responsibilities & data accuracy</h2>
      <ul>
        <li>You are responsible for the accuracy of inputs you enter into calculators.</li>
        <li>You are responsible for verifying figures with your bank, broker, tax authority, or advisor before making a decision.</li>
        <li>You remain solely responsible for your financial decisions and their outcomes.</li>
      </ul>

      <h2>12. API downtime & data interruption</h2>
      <p>
        Because the Service depends on external market data and AI APIs, temporary outages,
        rate limits, delays, or stale data are expected from time to time. We will make
        reasonable efforts to restore service but assume no liability for downtime.
      </p>

      <h2>13. Modification of services</h2>
      <p>
        We may modify, suspend, or discontinue any part of the Service at any time, with or
        without notice. We may also update these Terms — continued use after changes take
        effect constitutes acceptance of the revised Terms.
      </p>

      <h2>14. Suspension or termination</h2>
      <p>
        We may suspend or terminate your access at our discretion, including for violations
        of these Terms or the Acceptable Use Policy, suspected abuse, or legal reasons.
      </p>

      <h2>15. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, Calculyx AI, its founders, and contributors
        will not be liable for any indirect, incidental, special, consequential, or punitive
        damages, or for financial losses, lost profits, or lost data arising out of or in
        connection with your use of — or inability to use — the Service. Our total aggregate
        liability will not exceed the amount you paid us (if any) in the 12 months preceding
        the claim, or INR 1,000, whichever is greater.
      </p>

      <h2>16. Indemnity</h2>
      <p>
        You agree to indemnify and hold harmless Calculyx AI from any claim arising out of
        your misuse of the Service, violation of these Terms, or infringement of any
        third-party right.
      </p>

      <h2>17. Governing law</h2>
      <p>
        These Terms are governed by the laws of India, and any disputes shall be subject to
        the exclusive jurisdiction of the courts of Visakhapatnam, Andhra Pradesh, India.
      </p>

      <h2>18. Severability</h2>
      <p>
        If any provision of these Terms is held unenforceable, the remaining provisions
        remain in full force and effect.
      </p>

      <ContactBlock label="19. Contact" />
    </LegalLayout>
  );
}
