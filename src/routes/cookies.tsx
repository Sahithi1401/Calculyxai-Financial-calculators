import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, ContactBlock } from "@/components/finflow/legal-layout";

export const Route = createFileRoute("/cookies")({
  head: () =>
    pageHead({
      title: "Cookie Policy — Calculyx AI",
      description:
        "See every cookie and local-storage key Calculyx AI sets, why each one exists, how long it lasts, and the exact steps to disable or clear them today.",
      path: "/cookies",
      crumbs: [{ name: "Home", path: "/" }, { name: "Cookie Policy", path: "/cookies" }],
    }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <LegalLayout
      crumbs={[{ name: "Home", path: "/" }, { name: "Cookie Policy", path: "/cookies" }]}
      title={<>Cookie <span className="font-serif italic text-primary">Policy</span></>}
    >
      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files a website places on your device to remember information
        between visits. "Local storage" is a similar browser feature that lets us store
        preferences and cached data on your device. Together we refer to them as "cookies"
        below.
      </p>

      <h2>Why we use cookies</h2>
      <p>Calculyx AI uses a small number of cookies so the app can:</p>
      <ul>
        <li>Keep you signed in.</li>
        <li>Remember your country, currency, and light/dark theme.</li>
        <li>Cache calculator inputs on your device for faster re-use.</li>
        <li>Understand — in aggregate — which features are used, so we can improve them.</li>
        <li>Detect and prevent abuse or fraud.</li>
      </ul>

      <h2>Cookie categories</h2>
      <ul>
        <li><strong>Strictly necessary</strong> — authentication, session, CSRF protection. These cannot be disabled without breaking the app.</li>
        <li><strong>Preference</strong> — theme, country, currency, saved calculator inputs.</li>
        <li><strong>Analytics</strong> — aggregated, anonymised usage metrics (only where deployed and disclosed).</li>
        <li><strong>Marketing</strong> — <em>we do not use marketing or advertising cookies.</em></li>
      </ul>

      <h2>What we do NOT use</h2>
      <ul>
        <li>Third-party advertising cookies.</li>
        <li>Cross-site tracking pixels.</li>
        <li>Social-network re-marketing tags.</li>
      </ul>

      <h2>Managing cookies</h2>
      <p>You are always in control:</p>
      <ul>
        <li><strong>Browser controls</strong> — every major browser lets you view, block, or delete cookies. Search your browser's help centre for "manage cookies".</li>
        <li><strong>Clearing storage</strong> — clearing cookies and local storage for this site will sign you out and reset your preferences.</li>
        <li><strong>Signing out</strong> — signing out invalidates your session token.</li>
        <li><strong>Do Not Track</strong> — we respect browser DNT signals where technically feasible.</li>
      </ul>

      <h2>Changes</h2>
      <p>
        If we add new categories of cookies (for example, analytics or third-party
        integrations), we will update this page before enabling them.
      </p>

      <ContactBlock />
    </LegalLayout>
  );
}
