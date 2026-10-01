export type Faq = { q: string; a: string };
export type FaqGroup = { id: string; title: string; blurb: string; items: Faq[] };

/**
 * Canonical FAQ content for /faq. Grouped into sections and rendered with the
 * accordion component. Also feeds the FAQPage JSON-LD on that route.
 */
export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    blurb: "What Calculyx AI is and how to use it in the first five minutes.",
    items: [
      {
        q: "What is Calculyx AI?",
        a: "Calculyx AI is an AI financial intelligence platform. It combines live market data, proprietary stock scoring, portfolio tracking and 27 precision calculators for loans, taxes, SIPs and retirement across India, the USA and the UAE.",
      },
      {
        q: "Do I need an account to use the calculators?",
        a: "You can run your first calculation without an account. Creating a free account unlocks unlimited calculations, saved reports, PDF exports, the portfolio tracker and personalised AI insights.",
      },
      {
        q: "How do I create an account?",
        a: "Open Sign In, choose email and password, a magic link, Google, or phone OTP. Confirmation takes under 30 seconds and no credit card is required.",
      },
      {
        q: "Which countries does Calculyx AI support?",
        a: "India, the United States and the United Arab Emirates are first-class: tax slabs, currency, stamp duty and statutory deductions all switch with the country selector in the navbar. Currency conversion covers 150+ pairs globally.",
      },
      {
        q: "Can I use Calculyx AI on my phone?",
        a: "Yes. Every page, chart and calculator is responsive and works on phones, tablets and desktops. You can add the site to your home screen as a progressive web app.",
      },
    ],
  },
  {
    id: "calculators",
    title: "Calculators & Accuracy",
    blurb: "The maths behind every result and how far you should trust it.",
    items: [
      {
        q: "How accurate are the calculators?",
        a: "Every calculator uses the standard published formula for its domain — amortisation for EMI, future value of annuity for SIP, statutory slab tables for income tax. Results are accurate to the assumptions you enter, but they are estimates, not quotes from a lender or a tax filing.",
      },
      {
        q: "Which formulas do you use for loan EMI?",
        a: "EMI = P x r x (1+r)^n / ((1+r)^n - 1), where P is principal, r is the monthly interest rate and n is the tenure in months. The amortisation schedule shows the principal and interest split for every instalment.",
      },
      {
        q: "Are Indian income tax slabs up to date?",
        a: "The India calculator uses the new regime slabs for the current financial year with the standard deduction applied automatically. Slabs are reviewed after each Union Budget.",
      },
      {
        q: "Can I export a report?",
        a: "Yes. Saved calculations can be exported as a branded PDF report or a multi-sheet Excel workbook that includes your inputs, results, breakdown tables and assumptions.",
      },
      {
        q: "Why does my bank quote a different EMI?",
        a: "Banks add processing fees, insurance premiums and sometimes a different day-count convention. Use our number for planning and comparison, then confirm the final figure in your sanction letter.",
      },
      {
        q: "Can I save and revisit a calculation?",
        a: "Signed-in users get a report ID for every saved calculation. Reports live in your dashboard and can be reopened, re-run with new inputs, exported or shared through a public link.",
      },
    ],
  },
  {
    id: "market-data",
    title: "Live Market Data",
    blurb: "Where the numbers come from and how fresh they are.",
    items: [
      {
        q: "Where does your market data come from?",
        a: "We aggregate licensed and public feeds including Financial Modeling Prep, Finnhub, Alpha Vantage, SEC EDGAR filings and NSE/BSE public data. The source is attributed on the market data page and in every export.",
      },
      {
        q: "Is the stock data real time?",
        a: "US quotes are typically delayed by up to 15 minutes on our data tier. Indian quotes are near real time, usually within one to two minutes. Fundamentals refresh daily after market close.",
      },
      {
        q: "How often do currency rates update?",
        a: "Mid-market foreign exchange rates refresh every few minutes during market hours. These are interbank rates — your bank or wallet will add a spread of roughly 0.5% to 3%.",
      },
      {
        q: "Can I use this data to trade?",
        a: "No. Data on Calculyx AI is provided for education and research. Confirm any price with your broker or a licensed market data vendor before placing an order.",
      },
      {
        q: "What happens if a data provider goes down?",
        a: "We fall back to a cached snapshot or an alternate provider, and the affected view is flagged with the source status and the timestamp of the last successful refresh.",
      },
    ],
  },
  {
    id: "ai",
    title: "AI Assistant",
    blurb: "How the assistant reasons, what it can see and what it will not do.",
    items: [
      {
        q: "How fast does the AI assistant respond?",
        a: "Answers typically begin streaming in under three seconds. Long multi-step analyses of a stock or portfolio can take a few seconds longer while structured data is retrieved.",
      },
      {
        q: "Does the AI make up numbers?",
        a: "It is constrained to read structured data — live quotes, fundamentals, your saved calculations and our retrieval index of guides and tax rules — and to cite what it used. It is instructed never to invent a figure it cannot source.",
      },
      {
        q: "Which model powers the assistant?",
        a: "Responses are generated through the Groq inference API using an open-weight large language model, wrapped in our own retrieval, guardrail and citation layer.",
      },
      {
        q: "Is the AI giving me investment advice?",
        a: "No. The assistant is a research tool. It produces educational analysis, bull and bear cases and scenario maths. It is not a registered adviser and nothing it says is a recommendation to buy or sell.",
      },
      {
        q: "Can the AI see my portfolio?",
        a: "Only when you are signed in and only your own holdings, through row-level security. Signed-out sessions get generic answers with no access to any account data.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    blurb: "What we store, what leaves our servers and how to delete it.",
    items: [
      {
        q: "Is my financial data private?",
        a: "Yes. Saved calculations, portfolios and profile data are protected by row-level security so only your authenticated session can read them. We never sell personal data.",
      },
      {
        q: "What gets sent to the AI provider?",
        a: "Only the text of your prompt plus the specific structured context needed to answer it. We do not send your email, password, payment details or full account history, and we do not allow the provider to train on your data.",
      },
      {
        q: "How do I delete my account and data?",
        a: "Email the address on our contact page from your registered address and ask for deletion. Account records are removed within 30 days, with backups aging out on the same schedule.",
      },
      {
        q: "Do you use tracking or advertising cookies?",
        a: "No. We set only strictly necessary cookies for authentication plus preference storage for theme, country and currency. There are no advertising or cross-site tracking pixels.",
      },
      {
        q: "Are you GDPR and DPDP compliant?",
        a: "We follow GDPR and India's DPDP principles: lawful basis for each processing purpose, data minimisation, and rights of access, correction, portability, objection and erasure. See the privacy policy for the full detail.",
      },
    ],
  },
  {
    id: "pricing",
    title: "Pricing",
    blurb: "What costs money today and what never will.",
    items: [
      {
        q: "Is Calculyx AI free?",
        a: "Yes. All 27 calculators, live market data, stock analysis, the portfolio tracker and the AI assistant are free to use with an account. No credit card is required to sign up.",
      },
      {
        q: "Are there usage limits?",
        a: "Fair-use limits apply to AI generation and report exports so one account cannot exhaust shared capacity. Normal personal use never hits them.",
      },
      {
        q: "Will there be a paid plan?",
        a: "A premium tier is planned for higher AI throughput, deeper historical data and team features. Everything free today stays free.",
      },
      {
        q: "Do you sell my data to fund the free tier?",
        a: "No. We do not sell or rent personal data, and we do not run advertising on the platform.",
      },
    ],
  },
];

export const ALL_FAQS: Faq[] = FAQ_GROUPS.flatMap((g) => g.items);

/** Short objection-handling FAQ shown on the homepage. */
export const HOME_FAQS: Faq[] = [
  {
    q: "Is Calculyx AI free?",
    a: "Yes — every calculator, live market view, stock analysis and the AI assistant are free with an account. No credit card required.",
  },
  {
    q: "How accurate are the results?",
    a: "Each tool uses the standard published formula for its domain and country-specific slab tables. Results are precise to your inputs, but treat them as planning estimates rather than a lender quote or a tax filing.",
  },
  {
    q: "Where does the market data come from?",
    a: "Licensed and public feeds — Financial Modeling Prep, Finnhub, Alpha Vantage, SEC EDGAR and NSE/BSE — with the source and refresh time shown on every view.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Saved calculations and portfolios are protected by row-level security, only your prompt text reaches the AI provider, and we never sell personal data.",
  },
  {
    q: "Do I need an account?",
    a: "Your first calculation is free without one. An account unlocks unlimited runs, saved reports, PDF exports and portfolio tracking.",
  },
];
