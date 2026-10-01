import type { CalcSlug } from "@/lib/finflow/registry";

export type CaseStudyMetric = { label: string; value: string; note?: string };

export type CaseStudy = {
  slug: string;
  title: string;
  /** Short label used in cards and breadcrumbs. */
  short: string;
  persona: string;
  location: string;
  country: "IN" | "US" | "AE";
  flag: string;
  summary: string;
  /** SEO */
  seoTitle: string;
  seoDescription: string;
  readMinutes: number;
  situation: string[];
  calculated: Array<{ tool: string; slug: CalcSlug | null; path: string; why: string }>;
  inputs: Array<{ label: string; value: string }>;
  metrics: CaseStudyMetric[];
  numbers: string[];
  outcome: string[];
  cta: { label: string; path: string; blurb: string };
  faqs: Array<{ q: string; a: string }>;
};

export const ILLUSTRATIVE_NOTICE =
  "Illustrative scenario. This is a composite worked example built to show how the calculators are used — it is not a real named customer and the quotes, names and outcomes are not attributed to any individual.";

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "bengaluru-engineer-rent-vs-buy",
    short: "Rent vs buy in Bengaluru",
    title: "A Bengaluru software engineer deciding between renting and buying",
    persona: "Software engineer, 31, dual income",
    location: "Bengaluru, India",
    country: "IN",
    flag: "🇮🇳",
    summary:
      "Paying ₹42,000 a month in rent while a ₹1.1 crore apartment tempts. Modelling the EMI, stamp duty and the opportunity cost of the down payment changes the answer.",
    seoTitle: "Rent vs Buy in Bengaluru — Worked Case Study",
    seoDescription:
      "An illustrative Bengaluru rent-versus-buy case study: ₹1.1 crore flat, 8.6% home loan EMI, 5% stamp duty and the SIP opportunity cost of the down payment, run end to end.",
    readMinutes: 6,
    situation: [
      "A 31-year-old engineer in Whitefield pays ₹42,000 a month in rent, rising about 7% a year at renewal.",
      "A 3BHK in the same micro-market is listed at ₹1.1 crore. Savings available for a down payment are ₹25 lakh.",
      "The obvious framing — 'rent is money down the drain' — ignores stamp duty, registration, maintenance and what the ₹25 lakh would earn if it stayed invested.",
    ],
    calculated: [
      { tool: "Home Loan EMI", slug: "home-loan", path: "/calc/home-loan", why: "Monthly outflow and total interest on the ₹86 lakh loan." },
      { tool: "Property Cost Breakdown", slug: "property", path: "/calc/property", why: "Stamp duty, registration, GST and one-time buying costs on top of the sticker price." },
      { tool: "SIP Calculator", slug: "sip", path: "/calc/sip", why: "What the ₹25 lakh down payment plus the EMI-minus-rent gap would compound to instead." },
      { tool: "Inflation Impact", slug: "inflation", path: "/calc/inflation", why: "Rent escalation at 7% a year over the same 20-year horizon." },
    ],
    inputs: [
      { label: "Property price", value: "₹1,10,00,000" },
      { label: "Down payment", value: "₹25,00,000 (22.7%)" },
      { label: "Loan amount", value: "₹85,00,000" },
      { label: "Interest rate", value: "8.6% p.a." },
      { label: "Tenure", value: "20 years" },
      { label: "Current rent", value: "₹42,000 / month, +7% p.a." },
      { label: "Stamp duty + registration", value: "5% + 1% (Karnataka)" },
      { label: "Assumed equity return", value: "11% CAGR" },
    ],
    metrics: [
      { label: "Monthly EMI", value: "₹74,300", note: "20 years @ 8.6%" },
      { label: "Total interest", value: "₹93.3 lakh", note: "Over full tenure" },
      { label: "One-time buying cost", value: "₹7.2 lakh", note: "Stamp duty, registration, legal" },
      { label: "Break-even vs renting", value: "Year 9", note: "Including 4% property appreciation" },
    ],
    numbers: [
      "The EMI on ₹85 lakh at 8.6% for 20 years is about ₹74,300 a month — ₹32,300 more than current rent in year one.",
      "Total interest over the tenure is roughly ₹93.3 lakh, so the ₹1.1 crore flat costs about ₹2.03 crore in nominal cash before maintenance.",
      "Stamp duty at 5%, registration at 1% and legal fees add about ₹7.2 lakh that is not recoverable at resale.",
      "Leaving ₹25 lakh invested at 11% and investing the ₹32,300 monthly gap grows to roughly ₹1.9 crore in 20 years.",
      "Rent at ₹42,000 escalating 7% a year totals about ₹2.06 crore over the same 20 years.",
      "With 4% annual property appreciation the buy case overtakes the rent-and-invest case around year nine.",
    ],
    outcome: [
      "Buying wins only if the flat is held past year nine and appreciation stays near 4% — well under the 8–10% the seller quoted.",
      "The decision flipped from a gut 'buy now' to a conditional 'buy if you will stay eight years or more'.",
      "The engineer increased the down payment to ₹32 lakh, cutting the EMI to about ₹68,100 and total interest by ₹7.6 lakh.",
      "A yearly prepayment of one EMI shortened the loan by roughly 3 years 4 months in the same model.",
    ],
    cta: { label: "Run the home loan model", path: "/calc/home-loan", blurb: "Enter your own price, rate and tenure to see the same break-even for your city." },
    faqs: [
      { q: "Is renting always cheaper in Indian metros?", a: "No. Rental yields in Bengaluru sit near 3–4%, so renting is usually cheaper in the early years, but a long holding period plus even modest appreciation reverses it. The break-even year is the number that matters." },
      { q: "Should stamp duty be counted as a sunk cost?", a: "Yes. Stamp duty and registration are not recovered at resale, so they should be added to the purchase side of the comparison, not treated as part of the asset value." },
    ],
  },
  {
    slug: "us-couple-mortgage-refinance",
    short: "US mortgage refinance",
    title: "A US couple deciding whether to refinance a 30-year mortgage",
    persona: "Dual-income household, 38 and 40",
    location: "Austin, United States",
    country: "US",
    flag: "🇺🇸",
    summary:
      "A $420,000 mortgage at 7.1% with 27 years left, and a 5.9% refinance offer carrying $9,400 in closing costs. The break-even month decides it.",
    seoTitle: "Mortgage Refinance Break-Even — Worked Case Study",
    seoDescription:
      "An illustrative US refinance case study: $420,000 at 7.1% versus a 5.9% offer with $9,400 closing costs, showing monthly savings, break-even month and lifetime interest.",
    readMinutes: 5,
    situation: [
      "A couple in Austin holds a $420,000 balance at 7.1% with 27 years remaining on the original 30-year term.",
      "Their lender offers a 5.9% refinance over a fresh 30-year term with $9,400 in closing costs rolled into the loan.",
      "The headline 'save $340 a month' hides two things: the term resets, and the closing costs must be earned back.",
    ],
    calculated: [
      { tool: "Mortgage Calculator", slug: "mortgage", path: "/calc/mortgage", why: "Payment and lifetime interest for the current loan and each refinance option." },
      { tool: "Compound Interest", slug: "compound-interest", path: "/calc/compound-interest", why: "What the monthly saving becomes if it is invested rather than spent." },
      { tool: "Inflation Impact", slug: "inflation", path: "/calc/inflation", why: "Real value of payments 20 years out at 3% US inflation." },
    ],
    inputs: [
      { label: "Current balance", value: "$420,000" },
      { label: "Current rate", value: "7.10%" },
      { label: "Remaining term", value: "27 years" },
      { label: "Offered rate", value: "5.90%" },
      { label: "New term options", value: "30 years or 25 years" },
      { label: "Closing costs", value: "$9,400" },
      { label: "Expected time in home", value: "9 years" },
    ],
    metrics: [
      { label: "Monthly saving", value: "$355", note: "30-year refinance" },
      { label: "Break-even", value: "Month 27", note: "Closing costs recovered" },
      { label: "Lifetime interest saved", value: "$61,800", note: "25-year refinance" },
      { label: "Term reset cost", value: "+3 years", note: "If 30-year option is taken" },
    ],
    numbers: [
      "Current payment on $420,000 at 7.1% over 27 remaining years is about $2,865 a month.",
      "Refinancing to 5.9% over a fresh 30 years gives about $2,510 — a $355 monthly saving, but three extra years of payments.",
      "Refinancing to 5.9% over 25 years gives about $2,687, saving $178 a month and finishing two years earlier.",
      "At $9,400 in closing costs, the 30-year option breaks even in month 27 and the 25-year option in month 53.",
      "Lifetime interest: $508,300 on the current loan, $483,600 on the 30-year refinance, $446,500 on the 25-year refinance.",
      "Investing the $355 saving at 7% for the nine years they expect to stay compounds to roughly $53,000.",
    ],
    outcome: [
      "The 25-year refinance was the better structure: it keeps the payoff date close to the original while capturing most of the rate drop.",
      "Because they expect to stay nine years, both options clear break-even comfortably — the decision was term discipline, not break-even risk.",
      "They chose the 25-year term and set up an automatic $175 extra principal payment, pulling payoff forward by a further 22 months.",
    ],
    cta: { label: "Compare your refinance", path: "/calc/mortgage", blurb: "Enter both scenarios side by side and read the break-even month directly off the schedule." },
    faqs: [
      { q: "What is a refinance break-even month?", a: "The month in which cumulative monthly savings equal the closing costs. Refinancing only pays if you keep the loan past that month." },
      { q: "Does resetting to a new 30-year term matter?", a: "Yes. A lower rate over a longer term can still increase total interest paid. Compare lifetime interest, not just the monthly payment." },
    ],
  },
  {
    slug: "dubai-nri-retirement-corpus",
    short: "NRI retirement corpus",
    title: "An NRI in Dubai sizing a retirement corpus for a return to India",
    persona: "Project manager, 36, tax-free salary",
    location: "Dubai, UAE",
    country: "AE",
    flag: "🇦🇪",
    summary:
      "AED 32,000 a month, zero income tax, and a plan to retire in Hyderabad at 55. Inflation in INR — not the AED salary — sets the target.",
    seoTitle: "NRI Retirement Corpus in Dubai — Worked Case Study",
    seoDescription:
      "An illustrative NRI retirement case study: AED income, INR retirement expenses at 6% inflation, the corpus required at 55 and the monthly SIP that gets there.",
    readMinutes: 6,
    situation: [
      "A 36-year-old project manager in Dubai earns AED 32,000 a month with no personal income tax and remits savings home.",
      "The plan is to retire in Hyderabad at 55, where today's equivalent lifestyle costs about ₹90,000 a month.",
      "The mistake being made: sizing the corpus against today's ₹90,000 rather than the inflated figure 19 years out.",
    ],
    calculated: [
      { tool: "Inflation Impact", slug: "inflation", path: "/calc/inflation", why: "What ₹90,000 a month becomes at 6% Indian inflation over 19 years." },
      { tool: "Retirement Planner", slug: "retirement", path: "/calc/retirement", why: "Corpus needed at 55 to fund 30 post-retirement years." },
      { tool: "SIP Calculator", slug: "sip", path: "/calc/sip", why: "Monthly investment needed to reach that corpus." },
      { tool: "Currency Converter", slug: "currency", path: "/calc/currency", why: "Converting the AED surplus into a stable INR remittance plan." },
    ],
    inputs: [
      { label: "Current age / retirement age", value: "36 / 55" },
      { label: "Post-retirement horizon", value: "30 years" },
      { label: "Today's monthly expenses", value: "₹90,000" },
      { label: "Assumed inflation", value: "6% p.a." },
      { label: "Existing corpus", value: "₹48,00,000" },
      { label: "Expected pre-retirement return", value: "11% CAGR" },
      { label: "Post-retirement return", value: "7% CAGR" },
      { label: "Monthly AED surplus", value: "AED 11,000" },
    ],
    metrics: [
      { label: "Expenses at 55", value: "₹2.72 lakh/mo", note: "₹90k inflated at 6% for 19 yrs" },
      { label: "Corpus required", value: "₹8.4 crore", note: "30-year drawdown at 7%" },
      { label: "Monthly SIP needed", value: "₹1.02 lakh", note: "After existing ₹48 lakh grows" },
      { label: "Surplus available", value: "≈ ₹2.5 lakh", note: "AED 11,000 at 22.7 INR/AED" },
    ],
    numbers: [
      "₹90,000 a month inflating at 6% for 19 years becomes about ₹2.72 lakh a month at age 55.",
      "Funding ₹2.72 lakh a month for 30 years, with the corpus earning 7% and expenses still inflating at 6%, needs roughly ₹8.4 crore.",
      "The existing ₹48 lakh compounding at 11% for 19 years reaches about ₹3.4 crore on its own.",
      "The gap of roughly ₹5 crore needs a monthly SIP near ₹1.02 lakh at 11% over 19 years.",
      "The AED 11,000 monthly surplus converts to roughly ₹2.5 lakh, so the plan is fundable with material headroom.",
      "A 5% annual step-up on the SIP reaches the same corpus with a starting contribution of about ₹72,000.",
    ],
    outcome: [
      "The target moved from a vague 'about ₹4 crore' to a defensible ₹8.4 crore once INR inflation was applied properly.",
      "A step-up SIP was chosen over a flat one, freeing roughly ₹30,000 a month of early-years cash flow.",
      "Currency risk was addressed by remitting on a fixed monthly schedule rather than timing the AED/INR rate.",
      "A review cadence was set: re-run the corpus every two years or whenever the retirement date moves.",
    ],
    cta: { label: "Size your retirement corpus", path: "/calc/retirement", blurb: "Enter your age, expenses and inflation assumption to get your own number." },
    faqs: [
      { q: "Should NRIs plan in AED or INR?", a: "Plan in the currency you will spend in. If retirement happens in India, the corpus and the inflation assumption must both be in INR." },
      { q: "Is 6% the right inflation number for India?", a: "India's long-run CPI has averaged near 6%. Lifestyle and healthcare inflation often run higher, so many planners stress-test at 7%." },
    ],
  },
  {
    slug: "small-business-gst-cash-flow",
    short: "GST & cash flow",
    title: "A small business owner modelling GST and monthly cash flow",
    persona: "Owner, 12-person services firm",
    location: "Pune, India",
    country: "IN",
    flag: "🇮🇳",
    summary:
      "₹68 lakh of annual billings at 18% GST. The business was profitable on paper and short of cash every quarter — the timing of GST payments explained why.",
    seoTitle: "GST & Cash Flow for a Small Business — Case Study",
    seoDescription:
      "An illustrative small-business case study: ₹68 lakh billings at 18% GST, input credit timing, working-capital gap and the salary and tax model behind the fix.",
    readMinutes: 5,
    situation: [
      "A 12-person services firm in Pune bills about ₹68 lakh a year, invoicing on 45-day terms.",
      "GST at 18% is collected on every invoice and deposited by the 20th of the following month, regardless of whether the client has paid.",
      "The result: a profitable P&L alongside a recurring cash squeeze in the first week of every quarter.",
    ],
    calculated: [
      { tool: "GST Calculator", slug: "gst", path: "/calc/gst", why: "Splitting inclusive versus exclusive quotes and the CGST/SGST components per invoice." },
      { tool: "Salary Take-Home", slug: "salary", path: "/calc/salary", why: "True monthly payroll outflow including employer PF and ESI." },
      { tool: "Income Tax", slug: "income-tax", path: "/calc/income-tax", why: "Advance tax instalments landing in the same weeks as GST." },
      { tool: "Compound Interest", slug: "compound-interest", path: "/calc/compound-interest", why: "Cost of funding the gap with an overdraft versus holding a buffer." },
    ],
    inputs: [
      { label: "Annual billings", value: "₹68,00,000" },
      { label: "GST rate", value: "18% (9% CGST + 9% SGST)" },
      { label: "Average client payment terms", value: "45 days" },
      { label: "Monthly payroll", value: "₹3,90,000" },
      { label: "Monthly input GST credit", value: "₹34,000" },
      { label: "Overdraft rate", value: "12% p.a." },
    ],
    metrics: [
      { label: "GST collected / yr", value: "₹12.24 lakh", note: "18% on ₹68 lakh" },
      { label: "Net GST payable / yr", value: "₹8.16 lakh", note: "After input credit" },
      { label: "Peak cash gap", value: "₹4.1 lakh", note: "Quarter-start week" },
      { label: "Overdraft cost avoided", value: "₹49,000 / yr", note: "By holding a buffer" },
    ],
    numbers: [
      "At 18%, annual GST collected is ₹12.24 lakh, split ₹6.12 lakh CGST and ₹6.12 lakh SGST on intra-state work.",
      "Input credit of ₹34,000 a month reduces the net annual liability to about ₹8.16 lakh.",
      "With 45-day terms, roughly ₹8.5 lakh of billed revenue is outstanding at any time while its GST is already due.",
      "Payroll of ₹3.9 lakh plus GST of ₹68,000 plus advance tax lands in the same seven-day window at each quarter start — a ₹4.1 lakh peak gap.",
      "Funding that gap on a 12% overdraft for an average 40 days each quarter costs about ₹49,000 a year.",
      "Ring-fencing GST collections into a separate account the day an invoice is paid removes the gap entirely.",
    ],
    outcome: [
      "GST stopped being treated as revenue: collections now move to a separate account on receipt.",
      "Client terms were shortened from 45 to 30 days on new contracts, with a 2% early-payment discount offered on the rest.",
      "The overdraft was retained as a facility but drawn only twice in the following year.",
      "Quarterly advance tax was estimated in advance with the income tax calculator instead of being discovered late.",
    ],
    cta: { label: "Model your GST", path: "/calc/gst", blurb: "Split any invoice into base value, CGST and SGST in seconds — inclusive or exclusive." },
    faqs: [
      { q: "Is GST payable before the client pays the invoice?", a: "For most services under the regular scheme, yes — liability arises on invoice date, so GST is deposited by the 20th of the following month regardless of collection." },
      { q: "How does input tax credit help cash flow?", a: "Credit on business purchases reduces the net GST you deposit. It helps the amount, not the timing, so a buffer is still needed." },
    ],
  },
];

export const CASE_STUDY_BY_SLUG: Record<string, CaseStudy> = Object.fromEntries(
  CASE_STUDIES.map((c) => [c.slug, c]),
);
