import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, ContactBlock, LEGAL_EMAIL } from "@/components/finflow/legal-layout";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageHead({
      title: "Privacy Policy — Calculyx AI",
      description:
        "Exactly what Calculyx AI collects, why we collect it, how long we keep it, and how to export or delete your account data — GDPR-inspired and plain English.",
      path: "/privacy",
      crumbs: [{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy" }],
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalLayout
      crumbs={[{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy" }]}
      title={<>Privacy <span className="font-serif italic text-primary">Policy</span></>}
    >
      <p>
        Calculyx AI ("we", "us", "our") is committed to protecting your privacy. This
        GDPR-inspired policy explains what we collect, why we collect it, how we use it,
        and the rights you have. This page is maintained by the Calculyx AI team and is
        not an independent legal certification.
      </p>

      <h2>1. Data controller</h2>
      <p>
        The controller of your personal data is <strong>Calculyx AI</strong>, based in
        Visakhapatnam, India. For any privacy request, contact{" "}
        <a href={`mailto:${LEGAL_EMAIL}`} className="text-primary underline underline-offset-4">{LEGAL_EMAIL}</a>.
      </p>

      <h2>2. Information we collect</h2>
      <ul>
        <li><strong>Email addresses</strong> — when you subscribe to the newsletter, sign up, or contact us.</li>
        <li><strong>Contact form submissions</strong> — your name, email, subject, and message.</li>
        <li><strong>Newsletter subscriptions</strong> — email, source of signup, and opt-in timestamp.</li>
        <li><strong>Authentication data</strong> — hashed credentials or OAuth identifiers, when you create an account.</li>
        <li><strong>Usage analytics</strong> — aggregated, anonymised information about which pages and calculators are used.</li>
        <li><strong>Cookies & local storage</strong> — for authentication, preferences, and calculator caching (see <a href="/cookies" className="text-primary underline underline-offset-4">Cookie Policy</a>).</li>
        <li><strong>Device & browser information</strong> — user-agent, screen size, timezone.</li>
        <li><strong>Log data</strong> — IP address, request timestamps, and error traces for security and reliability.</li>
      </ul>

      <h2>3. How we use your information</h2>
      <ul>
        <li>To operate and improve the Service (calculators, AI copilot, stocks).</li>
        <li>To send transactional and newsletter emails via <strong>Resend</strong>.</li>
        <li>Product analytics — to understand which features are used and how to improve them.</li>
        <li>Customer support — replying to your questions and bug reports.</li>
        <li>Security monitoring — detecting abuse, prompt-injection attempts, and unauthorised access.</li>
        <li>Fraud and misuse prevention.</li>
        <li>Complying with legal obligations.</li>
      </ul>

      <h2>4. Legal bases (GDPR)</h2>
      <ul>
        <li><strong>Consent</strong> — newsletter subscriptions and optional cookies.</li>
        <li><strong>Performance of a contract</strong> — providing calculators, AI, and account features you request.</li>
        <li><strong>Legitimate interests</strong> — security monitoring, product analytics, service improvement.</li>
        <li><strong>Legal obligation</strong> — responding to lawful requests from authorities.</li>
      </ul>

      <h2>5. Third-party services</h2>
      <p>
        We rely on trusted service providers that process limited data on our behalf to
        deliver the Service:
      </p>
      <ul>
        <li><strong>Groq</strong> — AI inference (LLM) for the AI copilot and stock analysis.</li>
        <li><strong>Finnhub</strong> — global market data (quotes, fundamentals, news).</li>
        <li><strong>Indian market data provider</strong> — Indian stock quotes, indices, and corporate data.</li>
        <li><strong>Resend</strong> — transactional and newsletter email delivery.</li>
        <li><strong>Vercel / Cloudflare</strong> — hosting, edge functions, and CDN.</li>
        <li><strong>Supabase</strong> — managed database and authentication.</li>
      </ul>
      <p>
        Each provider processes only the minimum data required for its function (e.g. your
        email for Resend; your prompt for Groq). We do not sell your personal data to any
        third party.
      </p>

      <h2>6. Cookies</h2>
      <p>See our dedicated <a href="/cookies" className="text-primary underline underline-offset-4">Cookie Policy</a>. In short:</p>
      <ul>
        <li><strong>Essential cookies</strong> — authentication, session, CSRF.</li>
        <li><strong>Preference cookies</strong> — theme, country, currency.</li>
        <li><strong>Analytics cookies</strong> — aggregated usage stats (only where used and disclosed).</li>
      </ul>

      <h2>7. Data storage & international transfers</h2>
      <p>
        Data is stored with our managed backend and hosting providers, which may operate
        data centres outside your country. All data in transit is encrypted via TLS. Data
        at rest is encrypted using industry-standard mechanisms provided by the underlying
        platforms. Access to production data is limited to the app owner.
      </p>

      <h2>8. Retention</h2>
      <ul>
        <li>Account data — retained while your account is active and up to 30 days after deletion for backups.</li>
        <li>Newsletter subscribers — retained until you unsubscribe.</li>
        <li>Contact form messages — retained up to 24 months for support history.</li>
        <li>Logs — typically 30–90 days.</li>
      </ul>

      <h2>9. Your rights</h2>
      <p>Under the GDPR and similar laws you have the right to:</p>
      <ul>
        <li><strong>Access</strong> — request a copy of your personal data.</li>
        <li><strong>Correction</strong> — ask us to correct inaccurate data.</li>
        <li><strong>Deletion</strong> — request erasure of your data ("right to be forgotten").</li>
        <li><strong>Data portability</strong> — receive your data in a machine-readable format.</li>
        <li><strong>Withdraw consent</strong> — for newsletter or optional processing at any time.</li>
        <li><strong>Object</strong> — to processing based on legitimate interests.</li>
        <li><strong>Lodge a complaint</strong> — with your local data protection authority.</li>
      </ul>
      <p>
        To exercise any right, email <a href={`mailto:${LEGAL_EMAIL}`} className="text-primary underline underline-offset-4">{LEGAL_EMAIL}</a>. We aim to respond within 30 days.
      </p>

      <h2>10. Security</h2>
      <p>
        We use TLS, hashed credentials, rate limiting, input validation, monitoring, and
        least-privilege access to protect your data. See our{" "}
        <a href="/security" className="text-primary underline underline-offset-4">Security Statement</a>. No system is 100% secure — we cannot guarantee absolute security.
      </p>

      <h2>11. Children's privacy</h2>
      <p>
        Calculyx AI is not intended for children under 16. We do not knowingly collect
        personal data from children. If you believe a child has provided us with personal
        data, please contact us and we will delete it.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update this policy as the product evolves. Material changes will be
        reflected on this page with a new "Last updated" date.
      </p>

      <ContactBlock label="13. Contact for privacy requests" />
    </LegalLayout>
  );
}
