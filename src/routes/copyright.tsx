import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, ContactBlock } from "@/components/finflow/legal-layout";

export const Route = createFileRoute("/copyright")({
  head: () =>
    pageHead({
      title: "Copyright & IP Policy — Calculyx AI",
      description:
        "Learn what you may reuse from Calculyx AI, how to credit our calculators and data, trademark rules, and how to file a fast takedown or licence request.",
      path: "/copyright",
      crumbs: [{ name: "Home", path: "/" }, { name: "Copyright Policy", path: "/copyright" }],
    }),
  component: CopyrightPage,
});

function CopyrightPage() {
  return (
    <LegalLayout
      crumbs={[{ name: "Home", path: "/" }, { name: "Copyright Policy", path: "/copyright" }]}
      title={<>Copyright <span className="font-serif italic text-primary">Policy</span></>}
    >
      <h2>Platform content</h2>
      <p>
        All content on Calculyx AI — including the brand, wordmark, logo, interface,
        calculator formulas as expressed here, prompts, prose, illustrations, and
        source code — is owned by Calculyx AI and protected by copyright, trademark,
        and other intellectual-property laws.
      </p>

      <h2>Third-party trademarks</h2>
      <p>
        Names of exchanges, indices, brokerages, banks, and listed companies (and
        their logos, ticker symbols, and index marks) remain the property of their
        respective owners. Their appearance on Calculyx AI does not imply
        endorsement, sponsorship, or affiliation.
      </p>

      <h2>Market data</h2>
      <p>
        Quotes, fundamentals, and news feeds are supplied by third-party providers
        and remain the property of those providers, subject to their own licence
        terms.
      </p>

      <h2>Permitted use</h2>
      <p>You may:</p>
      <ul>
        <li>View and use the Service for personal, non-commercial financial research.</li>
        <li>Share links to public Calculyx AI pages.</li>
        <li>Quote short excerpts with proper attribution to Calculyx AI.</li>
      </ul>

      <h2>Prohibited use</h2>
      <p>Without our prior written permission, you may not:</p>
      <ul>
        <li>Scrape, crawl, or bulk-download any part of the Service.</li>
        <li>Reproduce, republish, or distribute proprietary content.</li>
        <li>Use our brand, logo, or wordmark in a way that suggests endorsement.</li>
        <li>Reverse engineer or attempt to extract underlying prompts or models.</li>
      </ul>

      <h2>User submissions</h2>
      <p>
        You retain ownership of any inputs you submit (prompts, calculator inputs,
        contact messages). By submitting them, you grant us a non-exclusive, worldwide
        licence to process them solely to operate and improve the Service.
      </p>

      <h2>Reporting infringement</h2>
      <p>
        If you believe content on Calculyx AI infringes your copyright, please send a
        notice describing (a) the copyrighted work, (b) the allegedly infringing
        material and its URL, (c) your contact information, and (d) a good-faith
        statement that the use is not authorised.
      </p>

      <ContactBlock label="Contact for copyright matters" />
    </LegalLayout>
  );
}
