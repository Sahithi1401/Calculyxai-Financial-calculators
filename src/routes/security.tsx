import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { LegalLayout, ContactBlock } from "@/components/finflow/legal-layout";

export const Route = createFileRoute("/security")({
  head: () =>
    pageHead({
      title: "Security & Data Protection — Calculyx AI",
      description:
        "How we keep your financial data safe: TLS everywhere, encrypted storage, row-level access control, rate limiting, and how to report a vulnerability fast.",
      path: "/security",
      crumbs: [{ name: "Home", path: "/" }, { name: "Security", path: "/security" }],
    }),
  component: SecurityPage,
});

function SecurityPage() {
  return (
    <LegalLayout
      crumbs={[{ name: "Home", path: "/" }, { name: "Security", path: "/security" }]}
      title={<>Security <span className="font-serif italic text-primary">Statement</span></>}
      intro={
        <div className="flex items-start gap-3 rounded-2xl border border-sheen glass p-5 text-sm">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>
            Security is a shared responsibility. Calculyx AI applies industry-standard
            controls to protect the platform. We do not — and cannot — guarantee that any
            online service is 100% secure.
          </p>
        </div>
      }
    >
      <h2>Transport & storage</h2>
      <ul>
        <li><strong>HTTPS everywhere</strong> — all traffic to and from Calculyx AI is encrypted with TLS.</li>
        <li><strong>Encrypted at rest</strong> — data stored by our managed database and hosting providers is encrypted using platform-provided mechanisms.</li>
        <li><strong>Hashed credentials</strong> — passwords are hashed by the auth provider; we never store plaintext passwords.</li>
      </ul>

      <h2>Application controls</h2>
      <ul>
        <li><strong>Input validation</strong> — server-side validation with schema checks on every request.</li>
        <li><strong>Rate limiting</strong> — protection against brute-force, scraping, and API abuse.</li>
        <li><strong>Secure API handling</strong> — third-party API keys are held server-side and never exposed to the browser.</li>
        <li><strong>Row-level security</strong> — database policies restrict each user to only their own data.</li>
        <li><strong>Least-privilege access</strong> — production data access is limited to the app owner.</li>
      </ul>

      <h2>AI safety</h2>
      <ul>
        <li>Input guardrails block prompt-injection patterns and off-topic requests.</li>
        <li>Output guardrails add hedging language and "not financial advice" reminders on regulated topics.</li>
        <li>The AI runs behind a server-side gateway; user browsers never call model providers directly.</li>
      </ul>

      <h2>Monitoring & logging</h2>
      <ul>
        <li>Error and performance monitoring on both frontend and backend.</li>
        <li>Access and error logs are retained for a limited time to investigate incidents.</li>
        <li>Suspicious activity may trigger automatic throttling or account review.</li>
      </ul>

      <h2>Updates</h2>
      <p>
        We track our dependency graph and apply security updates on a regular cadence.
        Critical CVEs are patched as soon as reasonably possible.
      </p>

      <h2>Responsible disclosure</h2>
      <p>
        If you discover a security vulnerability, please report it privately to{" "}
        the address below rather than disclosing it publicly. We will acknowledge your
        report and work with you to resolve it in good faith. Please do not:
      </p>
      <ul>
        <li>Access data belonging to other users.</li>
        <li>Perform denial-of-service testing.</li>
        <li>Publicly disclose the issue before we've had a reasonable window to fix it.</li>
      </ul>

      <h2>Shared responsibility</h2>
      <p>You can help keep your account safe by:</p>
      <ul>
        <li>Using a strong, unique password.</li>
        <li>Signing out from devices you don't control.</li>
        <li>Never sharing OTPs, credentials, or API keys with anyone claiming to be Calculyx AI staff.</li>
      </ul>

      <p>
        <em>
          No online platform can be guaranteed 100% secure. Calculyx AI provides these
          controls on a reasonable-efforts basis and disclaims warranties as set out in
          the <a href="/terms" className="text-primary underline underline-offset-4">Terms & Conditions</a>.
        </em>
      </p>

      <ContactBlock label="Contact for security matters" />
    </LegalLayout>
  );
}
