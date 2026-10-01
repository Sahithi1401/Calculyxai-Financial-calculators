// Central SEO helpers for Calculyx AI.
// Produces the TanStack Router head() shape: { meta, links, scripts }.

export const SITE = {
  url: "https://calculyxai.online",
  name: "Calculyx AI",
  tagline: "AI Financial Intelligence Platform",
  logo: "https://calculyxai.online/icon-512.png",
  ogImage:
    "https://storage.googleapis.com/gpt-engineer-file-uploads/Zcyf67suT1X8dViAUyZ1AtzEANT2/social-images/social-1784106017880-WhatsApp_Image_2026-07-11_at_13.44.35.webp",
  publisher: "Calculyx AI",
  locale: "en_US",
} as const;

export type Crumb = { name: string; path: string };

export function absUrl(path: string): string {
  if (!path) return SITE.url;
  if (path.startsWith("http")) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absUrl(c.path),
    })),
  };
}

export function faqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function howToSchema(name: string, steps: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s })),
  };
}

export function softwareAppSchema(opts: {
  name: string;
  description: string;
  url: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: opts.name,
    applicationCategory: opts.category ?? "FinanceApplication",
    operatingSystem: "Web",
    url: opts.url,
    description: opts.description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: SITE.name },
  };
}

// --- Per-calculator SEO copy (unique titles + descriptions) ------------------
export type CalcSeo = {
  title: string;
  description: string;
  keywords: string;
  steps: string[];
  faqs: Array<{ q: string; a: string }>;
  /** Real-time data page — emit freshness signals and daily changefreq. */
  live?: boolean;
};

export const CALC_SEO: Record<string, CalcSeo> = {
  currency: {
    title: "Live Currency Converter — Today's INR, USD, EUR, GBP Rates",
    description:
      "Real-time currency converter with today's live INR, USD, EUR, GBP, AED and 30+ forex rates. Mid-market prices, historical trends and fee comparison.",
    keywords: "live currency converter, real-time forex rates, today USD to INR, EUR GBP live rate",
    live: true,
    steps: [
      "Choose the currency you want to convert from.",
      "Choose the target currency you want to convert to.",
      "Enter the amount and view the live converted value with mid-market rate.",
    ],
    faqs: [
      { q: "How often are the currency rates updated?", a: "Live mid-market rates refresh every few minutes from major FX data providers, so you always see today's price." },
      { q: "What is today's live USD to INR rate?", a: "The USD/INR pair updates in real time on the converter — enter 1 USD to see the current mid-market rate right now." },
      { q: "Are these rates the same as my bank gives?", a: "No. We show interbank mid-market rates; banks and wallets typically add a 0.5%–3% spread plus fixed fees on top." },
      { q: "Which currencies are supported?", a: "INR, USD, EUR, GBP, AED, SGD, JPY, AUD, CAD, CHF and 25+ additional currencies covering all major and emerging markets." },
      { q: "Can I see historical exchange rate trends?", a: "Yes — a 30-day sparkline shows recent movement, and you can toggle longer horizons to spot trends before converting." },
    ],
  },
  mortgage: {
    title: "Mortgage Calculator — Payment & Amortization",
    description:
      "Free mortgage calculator with monthly payment, total interest, amortization schedule and prepayment scenarios for USA, India and UAE home loans.",
    keywords: "mortgage calculator, home loan calculator, EMI, amortization schedule",
    steps: [
      "Enter the home price and down-payment percentage.",
      "Enter the loan term in years and annual interest rate.",
      "View monthly payment, total interest paid and the full amortization schedule.",
    ],
    faqs: [
      { q: "How is my monthly mortgage payment calculated?", a: "Using the standard amortization formula P × r × (1+r)^n / ((1+r)^n − 1), where P is principal, r is monthly rate and n is the number of months." },
      { q: "What is included in the total interest?", a: "The sum of every interest component across all monthly payments — the amortization schedule shows exactly how much interest each payment pays." },
      { q: "Does the calculator account for prepayments?", a: "Yes. Add a lump-sum or recurring prepayment to see how much interest you save and how many months earlier you finish." },
      { q: "How does it differ from a home loan EMI calculator?", a: "Same math — 'mortgage' is the term used in the US/UK, 'EMI' in India and UAE. Use the Home Loan EMI calculator for INR defaults." },
    ],
  },
  "home-loan": {
    title: "Home Loan EMI Calculator — India, USA, UAE",
    description:
      "Home loan EMI calculator with amortization schedule, prepayment savings and bank rate comparison for India, USA and UAE lenders.",
    keywords: "home loan EMI, housing loan calculator, amortization, prepayment savings",
    steps: [
      "Enter the loan amount, interest rate and tenure.",
      "Optionally add prepayments to see interest savings.",
      "Compare EMI, total interest and payoff date across banks.",
    ],
    faqs: [
      { q: "How is home loan EMI calculated?", a: "EMI = P × r × (1+r)^n / ((1+r)^n − 1), where r is the monthly rate and n is the tenure in months." },
      { q: "Which banks are included in the comparison?", a: "SBI, HDFC, ICICI, Axis, Kotak and other major Indian lenders plus leading US and UAE banks with their current published rates." },
      { q: "How much can I save with prepayments?", a: "A single yearly prepayment equal to one EMI can cut a 20-year loan by 3–4 years — the calculator quantifies your exact savings." },
      { q: "Is stamp duty included?", a: "No — use the Property Cost Calculator to include stamp duty, registration and taxes on top of the EMI." },
    ],
  },
  "income-tax": {
    title: "Income Tax Calculator — India, USA, UAE",
    description:
      "Income tax calculator for India new regime, USA federal brackets and UAE 0% personal tax. Estimate net take-home pay by country.",
    keywords: "income tax calculator, new tax regime, USA federal tax, UAE tax",
    steps: [
      "Select your country and financial year.",
      "Enter annual gross income and eligible deductions.",
      "View slab-wise tax, effective rate and net take-home pay.",
    ],
    faqs: [
      { q: "Which tax regime does the India calculator use?", a: "The new tax regime slabs for FY 2024–25 and later, with the standard deduction applied automatically." },
      { q: "Does it include state taxes in the US?", a: "The USA calculator computes federal tax only — state tax varies by state and is not included in the default view." },
      { q: "Why does the UAE calculator show zero tax?", a: "The UAE has no personal income tax on salaries. The 9% corporate tax applies only to business profits above AED 375,000." },
      { q: "What is the effective tax rate?", a: "Total tax divided by gross income — it is always lower than your top marginal slab because earlier slabs are taxed at lower rates." },
    ],
  },
  gst: {
    title: "GST Calculator — Inclusive, Exclusive & CGST/SGST Split",
    description:
      "GST calculator with inclusive and exclusive modes, CGST + SGST split and IGST for interstate supply. Supports 0%, 5%, 12%, 18% and 28% slabs.",
    keywords: "GST calculator, CGST SGST IGST, inclusive exclusive GST, tax slab",
    steps: [
      "Choose inclusive or exclusive GST mode.",
      "Enter the amount and applicable GST rate.",
      "View base value, GST amount and the CGST/SGST split.",
    ],
    faqs: [
      { q: "What is the difference between inclusive and exclusive GST?", a: "Exclusive means the amount is pre-tax and GST is added on top. Inclusive means the amount already contains GST and we back it out." },
      { q: "When does CGST + SGST apply vs IGST?", a: "CGST + SGST applies to intra-state supply (buyer and seller in the same state). IGST applies to inter-state supply." },
      { q: "Which slab should I use?", a: "Most services fall under 18%; essentials use 5%; luxury and sin goods use 28%. Check the official CBIC HSN/SAC list for your product." },
      { q: "Is the calculation correct for reverse charge?", a: "Yes — the math is identical. Enter the invoice value and applicable rate; reverse charge only changes who deposits the tax to government." },
    ],
  },
  salary: {
    title: "Salary Take-Home Calculator — Net Pay",
    description:
      "Salary take-home calculator estimating net monthly pay after income tax, PF/EPF, ESI and statutory deductions for India, USA and UAE.",
    keywords: "salary calculator, take home pay, net salary, CTC to in-hand",
    steps: [
      "Enter your annual CTC or gross salary.",
      "Add standard deductions like PF, ESI or 401(k).",
      "View monthly take-home pay and full salary breakdown.",
    ],
    faqs: [
      { q: "What is the difference between CTC and take-home?", a: "CTC includes employer PF, gratuity and benefits. Take-home is the net cash you receive after income tax and employee-side deductions." },
      { q: "Is PF (12%) subtracted from my salary?", a: "Yes — 12% of basic goes to employee PF and is deducted from your monthly pay. The employer contributes another 12% separately." },
      { q: "Does it include HRA exemption?", a: "The India calculator applies the new-regime standard deduction. HRA exemption (old regime) will be added in a future update." },
      { q: "Why is my take-home lower than my offer letter suggests?", a: "Because CTC counts employer costs. Income tax, PF, professional tax and ESI trim the number to your actual bank credit." },
    ],
  },
  sip: {
    title: "SIP Calculator — Mutual Fund Returns & Wealth Projection",
    description:
      "SIP calculator projects mutual fund wealth with monthly investment, expected return and tenure. Includes step-up SIP and inflation-adjusted returns.",
    keywords: "SIP calculator, mutual fund returns, step-up SIP, systematic investment",
    steps: [
      "Enter monthly SIP amount.",
      "Enter expected annual return and investment horizon in years.",
      "View future value, total invested and wealth gained.",
    ],
    faqs: [
      { q: "How is SIP return calculated?", a: "Using the future-value-of-annuity formula: FV = P × [((1+r)^n − 1) / r] × (1+r), where P is monthly SIP, r is monthly rate and n is total months." },
      { q: "What return should I assume?", a: "Equity mutual funds have historically returned 11–14% CAGR over long horizons; hybrid funds 8–10%; debt funds 6–8%. Use conservative assumptions." },
      { q: "What is a step-up SIP?", a: "A SIP where you increase the monthly amount annually (typically by 5–10%) to match salary growth — it dramatically boosts the final corpus." },
      { q: "Is SIP better than lumpsum?", a: "SIP averages your cost across market cycles and removes the need to time the market. Lumpsum can outperform in a rising market but carries higher timing risk." },
      { q: "How does SIP link to retirement planning?", a: "Your retirement corpus is the future value of your monthly SIP — use the Retirement Planner to work backwards from your goal." },
    ],
  },
  fd: {
    title: "FD Calculator — Fixed Deposit Maturity & Interest",
    description:
      "Fixed deposit calculator with quarterly compounding, cumulative and non-cumulative modes, and TDS estimate for India and UAE banks.",
    keywords: "FD calculator, fixed deposit maturity, quarterly compounding, TDS",
    steps: [
      "Enter deposit amount, interest rate and tenure.",
      "Choose cumulative or interest-payout mode.",
      "View maturity value, total interest and effective yield.",
    ],
    faqs: [
      { q: "How often does FD interest compound?", a: "Most Indian banks compound quarterly. The calculator uses A = P × (1 + r/4)^(4t) for cumulative FDs." },
      { q: "What is the difference between cumulative and non-cumulative FD?", a: "Cumulative reinvests interest and pays a lump sum at maturity. Non-cumulative pays interest monthly, quarterly or yearly to your account." },
      { q: "Is TDS deducted on FD interest?", a: "Yes — banks deduct 10% TDS if interest exceeds ₹40,000/year (₹50,000 for seniors). The calculator estimates the deduction." },
      { q: "Is my FD safer than mutual funds?", a: "FDs give capital protection and up to ₹5 lakh DICGC insurance, but returns rarely beat inflation. Equity mutual funds carry risk but higher long-term returns." },
    ],
  },
  "compound-interest": {
    title: "Compound Interest Calculator — Daily, Monthly, Annual",
    description:
      "Compound interest calculator with daily, monthly, quarterly and annual compounding. Visualise year-by-year growth with a chart.",
    keywords: "compound interest calculator, CAGR, wealth growth, compounding frequency",
    steps: [
      "Enter principal, annual interest rate and time period.",
      "Choose compounding frequency (daily, monthly, yearly).",
      "View future value and year-on-year growth chart.",
    ],
    faqs: [
      { q: "What is the compound interest formula?", a: "A = P × (1 + r/n)^(n×t), where P is principal, r is annual rate, n is compounding frequency per year and t is years." },
      { q: "Which compounding frequency gives the best return?", a: "Daily compounding beats monthly, which beats yearly — but the difference is small at typical rates. Time horizon matters far more than frequency." },
      { q: "Is CAGR the same as compound interest?", a: "CAGR is the compound annual growth rate — the constant rate that would grow your principal to the final value. It is derived from the same formula." },
      { q: "How is this different from SIP?", a: "Compound interest assumes a single lumpsum. SIP adds monthly contributions on top of compounding — use the SIP calculator for that scenario." },
    ],
  },
  inflation: {
    title: "Inflation Calculator — Future Value & Real Return",
    description:
      "Inflation calculator shows the future purchasing power of money using historical CPI. Estimate real returns adjusted for inflation.",
    keywords: "inflation calculator, real return, purchasing power, CPI",
    steps: [
      "Enter today's amount and average inflation rate.",
      "Enter the number of years in the future.",
      "View future purchasing power and inflation-adjusted value.",
    ],
    faqs: [
      { q: "What inflation rate should I use?", a: "India's long-run CPI averages ~6%; the US around 3%. Use a conservative 5–7% for India and 2.5–3.5% for US planning." },
      { q: "What is real return?", a: "Real return ≈ nominal return − inflation. A 12% mutual fund return with 6% inflation gives ~6% real growth in purchasing power." },
      { q: "Why is inflation called a silent killer of wealth?", a: "Because ₹1 crore today buys roughly ₹31 lakh worth of goods in 20 years at 6% inflation — savings lose real value without investment." },
      { q: "How does inflation affect retirement planning?", a: "Retirement corpus must be inflation-adjusted — the Retirement Planner factors expected inflation into required corpus and monthly SIP." },
    ],
  },
  retirement: {
    title: "Retirement Calculator — Corpus & Monthly SIP",
    description:
      "Retirement planning calculator estimating corpus, monthly SIP required and post-retirement withdrawal plan with inflation adjustment.",
    keywords: "retirement calculator, retirement corpus, FIRE, monthly SIP required",
    steps: [
      "Enter current age, retirement age and life expectancy.",
      "Add current savings, monthly expenses and expected inflation.",
      "View required corpus and monthly SIP to reach the goal.",
    ],
    faqs: [
      { q: "How much retirement corpus do I need?", a: "Roughly 25–30× your annual expenses at retirement, inflation-adjusted. The calculator projects your exact number from current expenses and inflation." },
      { q: "What is the 4% withdrawal rule?", a: "A rule that lets you withdraw 4% of your corpus in year one and inflation-adjust each year — historically the corpus lasts 30+ years." },
      { q: "How does inflation change my target corpus?", a: "At 6% inflation, expenses of ₹50,000/month today become ~₹1.6 lakh/month in 20 years — corpus scales up accordingly." },
      { q: "Should I use SIP or lumpsum for retirement?", a: "SIP is the practical route for salaried investors. Use the SIP Calculator to size the monthly investment needed to hit your retirement corpus." },
      { q: "What is FIRE?", a: "Financial Independence, Retire Early — building 25× annual expenses so passive income covers your lifestyle, often decades before traditional retirement." },
    ],
  },
  property: {
    title: "Property Cost Calculator — EMI & Stamp Duty",
    description:
      "Full property cost breakdown with EMI, stamp duty, registration, GST, property tax and insurance for buyers in India, USA and UAE.",
    keywords: "property calculator, stamp duty, home buying cost, real estate calculator",
    steps: [
      "Enter property price, down payment and loan terms.",
      "Add stamp duty, registration and GST for your state.",
      "View total buying cost and monthly cash outflow.",
    ],
    faqs: [
      { q: "What is included in total property cost?", a: "Sticker price plus stamp duty, registration, GST (on under-construction), brokerage, legal fees and initial maintenance corpus." },
      { q: "How much is stamp duty in India?", a: "Typically 4–7% of property value depending on the state — Maharashtra 5%, Karnataka 5%, Delhi 6%. Women buyers often get a 1% discount." },
      { q: "Is GST applicable on all property purchases?", a: "GST (1% affordable / 5% others) applies only to under-construction property. Ready-to-move-in units with a completion certificate are GST-exempt." },
      { q: "Does the calculator include home loan EMI?", a: "Yes. Use the linked Home Loan EMI Calculator to size the monthly EMI, then this tool wraps it with all one-time and recurring costs." },
    ],
  },
};

/**
 * Sibling calculators to link on each calc page for internal linking / topical
 * clusters. Every slug carries at least three descriptive links.
 */
export const RELATED_CALCS: Record<string, Array<{ slug: string; label: string; blurb: string }>> = {
  sip: [
    { slug: "retirement", label: "Retirement Corpus Planner", blurb: "Size the corpus your SIP is building towards." },
    { slug: "compound-interest", label: "Compound Interest Calculator", blurb: "See the compounding engine behind SIP growth." },
    { slug: "fd", label: "Fixed Deposit Calculator", blurb: "Compare guaranteed FD returns against SIP projections." },
    { slug: "inflation", label: "Inflation Impact Calculator", blurb: "Convert your SIP corpus into real purchasing power." },
  ],
  retirement: [
    { slug: "sip", label: "SIP Calculator", blurb: "Work out the monthly SIP that funds your retirement." },
    { slug: "compound-interest", label: "Compound Interest Calculator", blurb: "Model lumpsum growth alongside your corpus." },
    { slug: "inflation", label: "Inflation Impact Calculator", blurb: "Inflate today's expenses to retirement-day costs." },
    { slug: "fd", label: "Fixed Deposit Calculator", blurb: "Plan the low-risk sleeve of your retirement pot." },
  ],
  "compound-interest": [
    { slug: "sip", label: "SIP Calculator", blurb: "Add monthly contributions on top of compounding." },
    { slug: "fd", label: "Fixed Deposit Calculator", blurb: "Apply quarterly compounding to a bank deposit." },
    { slug: "inflation", label: "Inflation Impact Calculator", blurb: "Turn nominal growth into real returns." },
    { slug: "retirement", label: "Retirement Corpus Planner", blurb: "Point your compounded wealth at a goal." },
  ],
  fd: [
    { slug: "compound-interest", label: "Compound Interest Calculator", blurb: "Change compounding frequency and compare yields." },
    { slug: "sip", label: "SIP Calculator", blurb: "See how equity SIPs stack up against FD returns." },
    { slug: "inflation", label: "Inflation Impact Calculator", blurb: "Check whether your FD beats inflation." },
    { slug: "income-tax", label: "Income Tax Calculator", blurb: "Estimate tax owed on your FD interest income." },
  ],
  "home-loan": [
    { slug: "mortgage", label: "Mortgage Calculator", blurb: "Run the same loan with US/UK mortgage defaults." },
    { slug: "property", label: "Property Cost Calculator", blurb: "Add stamp duty, registration and GST to the EMI." },
    { slug: "income-tax", label: "Income Tax Calculator", blurb: "Check the tax impact of home-loan deductions." },
    { slug: "salary", label: "Salary Take-Home Calculator", blurb: "Confirm the EMI fits your monthly net pay." },
  ],
  mortgage: [
    { slug: "home-loan", label: "Home Loan EMI Calculator", blurb: "Switch to INR defaults and Indian bank rates." },
    { slug: "property", label: "Property Cost Calculator", blurb: "Wrap the mortgage in total buying costs." },
    { slug: "compound-interest", label: "Compound Interest Calculator", blurb: "Compare paying down debt versus investing." },
    { slug: "inflation", label: "Inflation Impact Calculator", blurb: "See how inflation erodes a fixed EMI." },
  ],
  property: [
    { slug: "home-loan", label: "Home Loan EMI Calculator", blurb: "Size the monthly EMI on your property loan." },
    { slug: "mortgage", label: "Mortgage Calculator", blurb: "Model the same purchase as a US-style mortgage." },
    { slug: "gst", label: "GST Calculator", blurb: "Compute GST on under-construction property." },
    { slug: "income-tax", label: "Income Tax Calculator", blurb: "Factor property income and deductions into tax." },
  ],
  "income-tax": [
    { slug: "salary", label: "Salary Take-Home Calculator", blurb: "Turn your tax bill into monthly in-hand pay." },
    { slug: "gst", label: "GST Calculator", blurb: "Handle indirect tax on goods and services." },
    { slug: "home-loan", label: "Home Loan EMI Calculator", blurb: "Model interest that may be tax deductible." },
    { slug: "retirement", label: "Retirement Corpus Planner", blurb: "Plan tax-efficient long-term savings." },
  ],
  salary: [
    { slug: "income-tax", label: "Income Tax Calculator", blurb: "See the slab-wise tax behind your deductions." },
    { slug: "gst", label: "GST Calculator", blurb: "Calculate GST if you invoice as a consultant." },
    { slug: "sip", label: "SIP Calculator", blurb: "Invest a slice of your take-home every month." },
    { slug: "home-loan", label: "Home Loan EMI Calculator", blurb: "Check what EMI your net salary supports." },
  ],
  gst: [
    { slug: "income-tax", label: "Income Tax Calculator", blurb: "Pair indirect tax with your direct tax bill." },
    { slug: "salary", label: "Salary Take-Home Calculator", blurb: "Compare salaried pay with consulting invoices." },
    { slug: "property", label: "Property Cost Calculator", blurb: "Apply GST rates to a property purchase." },
    { slug: "currency", label: "Currency Converter", blurb: "Convert foreign invoices before applying GST." },
  ],
  inflation: [
    { slug: "retirement", label: "Retirement Corpus Planner", blurb: "Build an inflation-adjusted retirement target." },
    { slug: "compound-interest", label: "Compound Interest Calculator", blurb: "Compare nominal growth with real growth." },
    { slug: "sip", label: "SIP Calculator", blurb: "Out-run inflation with a monthly SIP." },
    { slug: "fd", label: "Fixed Deposit Calculator", blurb: "Test whether FD rates beat CPI." },
  ],
  currency: [
    { slug: "sip", label: "SIP Calculator", blurb: "Plan investments once funds are converted." },
    { slug: "fd", label: "Fixed Deposit Calculator", blurb: "Park converted funds in a deposit." },
    { slug: "gst", label: "GST Calculator", blurb: "Apply GST to converted invoice values." },
    { slug: "income-tax", label: "Income Tax Calculator", blurb: "Estimate tax on foreign-currency income." },
  ],
};


/** JSON-LD helper for live-data pages (currency, stocks, market-data) with freshness. */
export function datasetSchema(opts: {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished ?? "2025-01-01",
    dateModified: opts.dateModified ?? new Date().toISOString(),
    creator: { "@type": "Organization", name: SITE.name, url: SITE.url },
    license: `${SITE.url}/market-data`,
  };
}

/** FAQ content for the Market Data disclaimer page. */
export const MARKET_DATA_FAQS: Array<{ q: string; a: string }> = [
  { q: "How frequently is market data updated?", a: "Live quotes on Calculyx AI refresh every 60 seconds. Fundamentals refresh daily after market close." },
  { q: "Are the prices real-time?", a: "US quotes are typically 15-minute delayed under the free tier of our data vendors; Indian quotes are near-real-time within 1–2 minutes." },
  { q: "Where does the market data come from?", a: "We aggregate from licensed vendors including Finnhub, Yahoo Finance, and NSE/BSE public feeds — attributions appear in the footer of every export." },
  { q: "Can I use this data for trading decisions?", a: "No. Data is provided for education and research. Always confirm prices with your broker or a licensed data vendor before executing trades." },
  { q: "What happens if a data provider is down?", a: "We fall back to a cached snapshot or an alternate provider and flag the source status on the affected view." },
];


// --- Site-wide entity schemas -----------------------------------------------

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: { "@type": "ImageObject", url: SITE.logo, width: 512, height: 512 },
    description:
      "Calculyx AI is an AI financial intelligence platform for live market data, stock analysis and precision financial calculators across India, the USA and the UAE.",
    sameAs: [
      "https://www.linkedin.com/company/calculyxai/",
      "https://www.producthunt.com/products/calculyx-ai",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "balaji04@calculyxai.online",
        availableLanguage: ["English"],
      },
    ],
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.tagline,
    inLanguage: "en",
    publisher: { "@id": `${SITE.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/calculators?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Canonical head() builder — every route should use this so titles,
 * descriptions, canonical, OG/Twitter and BreadcrumbList stay consistent.
 */
export function pageHead(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  ogType?: string;
  image?: string;
  crumbs?: Crumb[];
  noindex?: boolean;
  schemas?: unknown[];
}) {
  const url = absUrl(opts.path);
  const image = opts.image ?? SITE.ogImage;
  const meta: Array<Record<string, string>> = [
    { title: opts.title },
    { name: "description", content: opts.description },
    { property: "og:title", content: opts.title },
    { property: "og:description", content: opts.description },
    { property: "og:type", content: opts.ogType ?? "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:site_name", content: SITE.name },
    { property: "og:locale", content: SITE.locale },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: opts.title },
    { name: "twitter:description", content: opts.description },
    { name: "twitter:image", content: image },
  ];
  if (opts.keywords) meta.push({ name: "keywords", content: opts.keywords });
  if (opts.noindex) meta.push({ name: "robots", content: "noindex, follow" });

  const schemas: unknown[] = [...(opts.schemas ?? [])];
  if (opts.crumbs && opts.crumbs.length > 0) schemas.push(breadcrumbSchema(opts.crumbs));

  return {
    meta,
    links: [{ rel: "canonical", href: url }],
    scripts: schemas.map((s) => ({
      type: "application/ld+json",
      children: JSON.stringify(s),
    })),
  };
}
