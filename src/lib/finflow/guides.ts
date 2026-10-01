// Teacher-style guides for every Calculyx AI calculator.
// Each guide: what it does, when to use it, inputs, formula, worked example, tips.

export type GuideKind = "calc" | "investing";

export interface Guide {
  slug: string;
  kind: GuideKind;
  name: string;
  category: string;
  tagline: string;
  whatItDoes: string;
  whenToUse: string[];
  inputs: { label: string; help: string }[];
  formula?: string;
  example: {
    setup: string;
    steps: string[];
    result: string;
  };
  tips: string[];
  linkTo: string; // route path, or /investing-calculators for investing tab
  investingTab?: string;
}

const G = (g: Guide): Guide => g;

// ---------- Core calculators (map to /calc/$type) ----------
const CORE: Guide[] = [
  G({
    slug: "currency", kind: "calc", name: "Currency Converter", category: "Currency",
    tagline: "Live FX across INR, USD, AED and 30+ currencies.",
    whatItDoes: "Converts an amount from one currency to another using live mid-market rates and shows a 30-day trend for context.",
    whenToUse: ["Comparing salary offers across countries", "Sending remittances or planning travel", "Pricing invoices in a foreign currency"],
    inputs: [
      { label: "From / To currency", help: "Choose the source and target currency codes (INR, USD, AED, EUR…)." },
      { label: "Amount", help: "The number of units in the source currency." },
    ],
    formula: "Converted = Amount × MidMarketRate(From → To)",
    example: {
      setup: "Convert ₹1,00,000 to USD at 83.20 INR/USD.",
      steps: ["1 USD = 83.20 INR ⇒ 1 INR = 1 / 83.20 USD", "Converted = 100000 × (1 / 83.20)"],
      result: "≈ $1,201.92 (before bank margin of 1–3%).",
    },
    tips: [
      "Interbank rates ≠ bank rates. Expect a 1–3% spread on retail conversions.",
      "For remittances, compare Wise/Revolut against your bank — the difference over ₹5L is often ₹8–15k.",
    ],
    linkTo: "/calc/currency",
  }),
  G({
    slug: "mortgage", kind: "calc", name: "Mortgage Calculator", category: "Loans",
    tagline: "Monthly payment, total interest and full amortisation.",
    whatItDoes: "Computes the fixed monthly payment and full amortisation schedule for a mortgage on reducing-balance interest.",
    whenToUse: ["Deciding tenure trade-offs (15 vs 20 vs 30 years)", "Checking affordability before house-hunting", "Comparing offers from multiple banks"],
    inputs: [
      { label: "Principal", help: "Loan amount after down payment." },
      { label: "Annual rate (%)", help: "Fixed or effective floating rate quoted by the lender." },
      { label: "Tenure (years)", help: "Loan duration; longer tenure = lower EMI but far more interest." },
    ],
    formula: "EMI = P × r × (1 + r)^n / ((1 + r)^n − 1),  r = annual / 12 / 100, n = years × 12",
    example: {
      setup: "P = $300,000, rate = 7% p.a., tenure = 30 years.",
      steps: ["r = 7 / 12 / 100 = 0.005833", "n = 360", "EMI ≈ 300000 × 0.005833 × (1.005833^360) / (1.005833^360 − 1)"],
      result: "EMI ≈ $1,995.91 · Total interest ≈ $418,527.",
    },
    tips: [
      "Extra principal payments in early years slash total interest — a $200/month prepay on the example above saves ~$120k.",
      "Compare APR (all-in cost) not just the headline rate; origination fees and PMI can add 0.5–1%.",
    ],
    linkTo: "/calc/mortgage",
  }),
  G({
    slug: "home-loan", kind: "calc", name: "Home Loan EMI", category: "Loans",
    tagline: "India-first EMI with prepayment and step-up options.",
    whatItDoes: "Calculates monthly EMI for an Indian home loan and models the impact of prepayments and step-up EMIs on tenure and interest.",
    whenToUse: ["Choosing tenure between 15 and 30 years", "Modelling a yearly bonus prepayment", "Deciding between fixed and floating rates"],
    inputs: [
      { label: "Loan amount", help: "Sanctioned amount after margin/down payment (usually 80–90% of property value)." },
      { label: "Interest rate", help: "Floating rate linked to repo (typically repo + 2.0–2.5% for salaried)." },
      { label: "Tenure", help: "Maximum 30 years or until borrower's age 70, whichever is earlier." },
    ],
    formula: "EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)",
    example: {
      setup: "₹50,00,000 loan at 8.5% for 20 years.",
      steps: ["r = 8.5 / 12 / 100 ≈ 0.007083", "n = 240", "EMI ≈ 50,00,000 × 0.007083 × 1.007083^240 / (1.007083^240 − 1)"],
      result: "EMI ≈ ₹43,391 · Total interest ≈ ₹54.13 lakh.",
    },
    tips: [
      "Under Section 24, interest up to ₹2 lakh/year on self-occupied property is tax deductible.",
      "One extra EMI per year cuts a 20-year loan to roughly 17 years.",
    ],
    linkTo: "/calc/home-loan",
  }),
  G({
    slug: "income-tax", kind: "calc", name: "Income Tax", category: "Tax",
    tagline: "IN (new regime), USA federal, UAE — one interface.",
    whatItDoes: "Applies the slab-based tax rates for your chosen country and shows effective tax rate plus take-home.",
    whenToUse: ["Comparing new vs old regime in India", "Estimating US federal tax on a bonus", "Modelling relocation to UAE (0% personal income tax)"],
    inputs: [
      { label: "Country", help: "IN, US, UAE. Slabs and rebates auto-load." },
      { label: "Gross annual income", help: "CTC/gross before any deductions." },
      { label: "Filing status (US)", help: "Single, MFJ, MFS, HoH — changes bracket thresholds." },
    ],
    formula: "Tax = Σ (slab_income × slab_rate). Effective rate = Tax / Gross.",
    example: {
      setup: "India, new regime, ₹15,00,000 gross salary FY 2025-26.",
      steps: ["0–3L: 0", "3–7L: 4L × 5% = ₹20,000", "7–10L: 3L × 10% = ₹30,000", "10–12L: 2L × 15% = ₹30,000", "12–15L: 3L × 20% = ₹60,000"],
      result: "Tax ≈ ₹1,40,000 + 4% cess = ₹1,45,600. Effective rate ≈ 9.7%.",
    },
    tips: [
      "Standard deduction of ₹75,000 applies to salaried in the new regime — the calculator auto-applies it.",
      "The US calculator uses federal brackets only; add state tax (0–13.3%) separately.",
    ],
    linkTo: "/calc/income-tax",
  }),
  G({
    slug: "gst", kind: "calc", name: "GST Calculator", category: "Tax",
    tagline: "Inclusive / exclusive with CGST + SGST split.",
    whatItDoes: "Adds GST to a base amount or extracts GST from a total, and splits into CGST + SGST (intra-state) or IGST (inter-state).",
    whenToUse: ["Preparing invoices", "Reconciling a bill's inclusive price", "Comparing intra vs inter-state pricing"],
    inputs: [
      { label: "Amount", help: "Either the base (exclusive) or the total (inclusive), depending on mode." },
      { label: "GST rate", help: "0, 5, 12, 18 or 28% depending on HSN code." },
      { label: "Mode", help: "Add GST to base, or Remove GST from total." },
    ],
    formula: "Inclusive: GST = Total × rate / (100 + rate).  Exclusive: GST = Base × rate / 100.",
    example: {
      setup: "Total invoice ₹11,800 inclusive of 18% GST.",
      steps: ["GST = 11800 × 18 / 118 = ₹1,800", "Base = 11800 − 1800 = ₹10,000", "CGST = SGST = ₹900 each"],
      result: "Base ₹10,000 · CGST ₹900 · SGST ₹900 · Total ₹11,800.",
    },
    tips: [
      "Use IGST for inter-state (across two state GSTINs); CGST+SGST for intra-state.",
      "Rounding: GST portals accept ₹0.50 rounding — align invoices to avoid mismatch.",
    ],
    linkTo: "/calc/gst",
  }),
  G({
    slug: "salary", kind: "calc", name: "Salary Take-Home", category: "Tax",
    tagline: "Net pay after tax and statutory deductions.",
    whatItDoes: "Breaks CTC into fixed, variable, retirals and taxes to show monthly and yearly in-hand pay.",
    whenToUse: ["Comparing two offers with different CTC structures", "Understanding why in-hand ≠ CTC", "Planning ELSS, PPF, NPS contributions"],
    inputs: [
      { label: "CTC", help: "Company's total annual cost including employer PF and gratuity." },
      { label: "Basic %", help: "Basic salary as % of CTC (usually 40–50%). Drives PF and HRA." },
      { label: "Regime", help: "New regime (default, higher slabs, no exemptions) or old (with 80C/HRA)." },
    ],
    formula: "In-hand = Gross − (Income tax + EPF + Prof tax). Gross = CTC − Employer PF − Gratuity.",
    example: {
      setup: "CTC ₹18,00,000, basic 45%, new regime.",
      steps: ["Basic = 8,10,000 · Employer PF = 12% of basic = 97,200", "Gross ≈ 17,00,000 · Tax ≈ ₹1,72,000", "EPF (employee) = 97,200"],
      result: "Take-home ≈ ₹1,19,000/month (₹14.3L/year).",
    },
    tips: [
      "HRA exemption is only usable in the old regime — model both regimes before choosing.",
      "Employer-side EPF is capped at ₹1,800/month if wages > ₹15k unless you opt for full PF.",
    ],
    linkTo: "/calc/salary",
  }),
  G({
    slug: "sip", kind: "calc", name: "SIP Calculator", category: "Investment",
    tagline: "Wealth from monthly systematic investing.",
    whatItDoes: "Projects the future value of a monthly SIP over a chosen horizon at an assumed CAGR, plus inflation-adjusted value.",
    whenToUse: ["Setting monthly SIP amount for a goal (education, retirement)", "Comparing SIP vs lumpsum", "Stress-testing return assumptions"],
    inputs: [
      { label: "Monthly investment (P)", help: "The auto-debit amount, e.g. ₹10,000 or $500." },
      { label: "Expected return (%)", help: "Long-run CAGR: 11–13% for Indian equity, 8–9% for US equity." },
      { label: "Duration (years)", help: "Investment horizon; longer = compounding advantage grows non-linearly." },
    ],
    formula: "FV = P × ((1 + r)^n − 1) / r × (1 + r),  r = annual / 12 / 100, n = years × 12",
    example: {
      setup: "₹10,000/month for 10 years at 12% p.a.",
      steps: ["r = 0.01, n = 120", "FV = 10000 × ((1.01^120 − 1) / 0.01) × 1.01"],
      result: "FV ≈ ₹23.23 lakh on ₹12 lakh invested (~₹11.23L gains).",
    },
    tips: [
      "A 10% annual step-up in SIP typically boosts FV by 60–80% over 20 years.",
      "Long-term equity gains > ₹1.25L/year are taxed at 12.5% in India (LTCG post-2024).",
    ],
    linkTo: "/calc/sip",
  }),
  G({
    slug: "fd", kind: "calc", name: "FD Calculator", category: "Investment",
    tagline: "Fixed deposit maturity with quarterly compounding.",
    whatItDoes: "Computes maturity value of a bank/NBFC FD using quarterly compounding (Indian standard).",
    whenToUse: ["Choosing between banks", "Ladders (staggering FDs across tenures)", "Comparing FD vs debt mutual funds"],
    inputs: [
      { label: "Principal", help: "The amount deposited today." },
      { label: "Interest rate", help: "Annual rate — check senior citizen +0.5% bonus." },
      { label: "Tenure", help: "Months or years. Premature withdrawal usually loses 1% penalty." },
    ],
    formula: "Maturity = P × (1 + r / 4)^(4t),  r = rate / 100, t = years.",
    example: {
      setup: "₹5,00,000 at 7.5% for 5 years.",
      steps: ["Quarterly r = 0.075 / 4 = 0.01875", "Periods = 20", "M = 500000 × 1.01875^20"],
      result: "Maturity ≈ ₹7,24,975 (₹2.25L interest).",
    },
    tips: [
      "FD interest is fully taxable at your slab rate; DSP short-duration debt funds can be more tax-efficient at 30%+ slabs.",
      "TDS kicks in at ₹40k/year (₹50k for seniors); submit 15G/H if income is below limit.",
    ],
    linkTo: "/calc/fd",
  }),
  G({
    slug: "compound-interest", kind: "calc", name: "Compound Interest", category: "Investment",
    tagline: "The eighth wonder — visualised.",
    whatItDoes: "Compounds a principal over any frequency (annual, quarterly, monthly, daily) and shows the interest-on-interest curve.",
    whenToUse: ["Teaching compounding to a beginner", "Comparing 10 vs 20 vs 30-year horizons", "Modelling recurring PPF/EPF contributions"],
    inputs: [
      { label: "Principal", help: "Initial lump sum." },
      { label: "Rate", help: "Annual interest rate." },
      { label: "Frequency", help: "Times per year interest is compounded." },
    ],
    formula: "A = P × (1 + r / n)^(n × t)",
    example: {
      setup: "₹1,00,000 at 10% p.a. for 20 years, compounded annually.",
      steps: ["A = 100000 × 1.10^20", "1.10^20 ≈ 6.7275"],
      result: "≈ ₹6,72,750 (6.7× the original).",
    },
    tips: [
      "Doubling time ≈ 72 / rate (Rule of 72). At 12%, money doubles every 6 years.",
      "Continuous compounding: A = P × e^(rt); it caps only ~0.5% above monthly at typical rates.",
    ],
    linkTo: "/calc/compound-interest",
  }),
  G({
    slug: "inflation", kind: "calc", name: "Inflation Impact", category: "Planning",
    tagline: "What ₹1 today is worth tomorrow.",
    whatItDoes: "Erodes a future amount by inflation to give today's-money equivalent, or projects today's amount forward.",
    whenToUse: ["Setting retirement targets in today's rupees", "Sizing an emergency fund realistically", "Comparing salary offers across countries"],
    inputs: [
      { label: "Amount", help: "Today's amount, or the future value you want to normalise." },
      { label: "Inflation rate", help: "5–6% is the long-run India base case; 3% for US/EU." },
      { label: "Years", help: "How far ahead (or behind) to project." },
    ],
    formula: "Future = Present × (1 + i)^t.  Present = Future / (1 + i)^t.",
    example: {
      setup: "₹50,000/month lifestyle today, 25 years to retirement, 6% inflation.",
      steps: ["Multiplier = 1.06^25 ≈ 4.29"],
      result: "You'd need ~₹2.15 lakh/month at retirement to maintain the same lifestyle.",
    },
    tips: [
      "Real return = Nominal − Inflation. A 12% mutual fund at 6% inflation gives ~6% real.",
      "Healthcare inflates faster (7–10% in India); use a category-specific rate for retirement medical costs.",
    ],
    linkTo: "/calc/inflation",
  }),
  G({
    slug: "retirement", kind: "calc", name: "Retirement Planner", category: "Planning",
    tagline: "Corpus and monthly SIP to retire comfortably.",
    whatItDoes: "Estimates the retirement corpus you need and the monthly SIP required to reach it.",
    whenToUse: ["First-time retirement planning", "Course-correcting mid-career", "Comparing early retirement (FIRE) scenarios"],
    inputs: [
      { label: "Current age / retirement age", help: "Years to accumulate." },
      { label: "Monthly expenses today", help: "In current rupees; will be inflated automatically." },
      { label: "Post-retirement years", help: "Life expectancy minus retirement age (25–30 years is safe)." },
      { label: "Return pre & post retirement", help: "12% pre, 7% post is a standard India base case." },
    ],
    formula: "Corpus = Monthly expenses × 12 × ((1 − (1 + r_real)^-N) / r_real), r_real = (1+r_post)/(1+inf) − 1",
    example: {
      setup: "Age 30 → 60, ₹50k/month today, 6% inflation, 12% pre, 7% post, 30 post-retirement years.",
      steps: ["Monthly at 60 ≈ ₹2.87L", "Real return post = (1.07/1.06 − 1) ≈ 0.94%", "Corpus ≈ ₹9.1 crore"],
      result: "SIP needed ≈ ₹26,000/month for 30 years at 12%.",
    },
    tips: [
      "Split corpus into buckets: 3 years cash, 5 years debt, rest in equity — cushions sequence-of-returns risk.",
      "NPS Tier-I gives extra ₹50k/year 80CCD(1B) deduction under old regime.",
    ],
    linkTo: "/calc/retirement",
  }),
  G({
    slug: "property", kind: "calc", name: "Property Cost Breakdown", category: "Real Estate",
    tagline: "EMI + stamp duty + registration + taxes + insurance.",
    whatItDoes: "Rolls up all one-time and recurring costs of buying property so the sticker price stops surprising you.",
    whenToUse: ["Budgeting for a home purchase", "Comparing under-construction vs ready-to-move", "Rent-vs-buy analysis"],
    inputs: [
      { label: "Property price", help: "Agreement value (not carpet-area rate)." },
      { label: "Down payment %", help: "20% is typical for salaried; below 20% may attract PMI/higher rate." },
      { label: "Location", help: "Drives stamp duty (5–8%) and registration (1%)." },
    ],
    formula: "Total = Price + Stamp duty + Registration + GST (if under-construction) + Legal + Interior + Recurring (maintenance + property tax).",
    example: {
      setup: "₹80 lakh flat in Bengaluru, 20% down, 20-year loan at 8.5%.",
      steps: ["Down payment ₹16L", "Stamp + reg ≈ ₹4.8L (6%)", "Legal + reg + interiors ≈ ₹4L", "EMI on ₹64L ≈ ₹55,500"],
      result: "Cash to close ≈ ₹25L; annual carrying cost (EMI + maintenance + tax) ≈ ₹7.2 lakh.",
    },
    tips: [
      "Under-construction property attracts 5% GST (1% for affordable); ready-to-move doesn't.",
      "Property tax = 0.5–1.5% of guidance value annually — often forgotten in budgeting.",
    ],
    linkTo: "/calc/property",
  }),
];

// ---------- Investing calculators (map to /investing-calculators?tab=slug) ----------
const INVEST: Guide[] = [
  G({
    slug: "invest-sip", kind: "investing", name: "SIP (Investing)", category: "Growth",
    tagline: "Same SIP math — with a live-stock context.",
    whatItDoes: "Runs the SIP formula with the currently-selected stock's assumed return and currency, so you can size a monthly investment against a specific ticker.",
    whenToUse: ["Sizing a monthly SIP into a specific mutual fund or ETF (VOO, N50)", "Comparing SIP into two tickers with different assumed returns"],
    inputs: [
      { label: "Monthly investment", help: "Amount debited each month." },
      { label: "Duration (years)", help: "Investment horizon." },
      { label: "Expected return", help: "Auto-seeded from stock's assumed CAGR." },
    ],
    formula: "FV = P × ((1 + r)^n − 1) / r × (1 + r)",
    example: { setup: "₹5,000/month × 15 years @ 12%", steps: ["r = 0.01, n = 180", "FV = 5000 × ((1.01^180 − 1) / 0.01) × 1.01"], result: "≈ ₹25.23 lakh on ₹9L invested." },
    tips: ["Use 10% as a conservative return, 12% as a base for Indian equity, 14% as a bull case."],
    linkTo: "/investing-calculators", investingTab: "sip",
  }),
  G({
    slug: "invest-lumpsum", kind: "investing", name: "Lumpsum", category: "Growth",
    tagline: "One-time investment compounded to a horizon.",
    whatItDoes: "Compounds a single upfront investment at the assumed CAGR for the chosen duration.",
    whenToUse: ["Deploying a bonus, ESOP proceeds or property sale", "Comparing lumpsum today vs SIP over the same period"],
    inputs: [
      { label: "Lumpsum amount", help: "One-time upfront." },
      { label: "Years", help: "Compounding horizon." },
      { label: "Expected return", help: "Annualised CAGR." },
    ],
    formula: "FV = P × (1 + r)^t",
    example: { setup: "₹5,00,000 lumpsum, 15 years, 12%", steps: ["1.12^15 ≈ 5.474", "FV = 500000 × 5.474"], result: "≈ ₹27.37 lakh." },
    tips: ["A bond-ladder buffer (~2 years' expenses) before deploying full lumpsum reduces regret if markets fall 30%."],
    linkTo: "/investing-calculators", investingTab: "lumpsum",
  }),
  G({
    slug: "invest-cagr", kind: "investing", name: "CAGR", category: "Analysis",
    tagline: "The one growth rate that matters.",
    whatItDoes: "Computes the compound annual growth rate that turned an initial value into a final value over N years.",
    whenToUse: ["Benchmarking a stock vs Nifty/S&P", "Evaluating a mutual fund's factsheet claim", "Checking your portfolio's real growth"],
    inputs: [
      { label: "Initial value", help: "Cost basis." },
      { label: "Final value", help: "Current or exit value." },
      { label: "Years", help: "Holding period." },
    ],
    formula: "CAGR = (Final / Initial)^(1 / t) − 1",
    example: { setup: "₹1L → ₹3L in 8 years.", steps: ["(3 / 1)^(1/8) − 1 = 1.147 − 1"], result: "CAGR ≈ 14.7%." },
    tips: ["CAGR hides volatility. Pair it with max drawdown to judge risk-adjusted return."],
    linkTo: "/investing-calculators", investingTab: "cagr",
  }),
  G({
    slug: "invest-dividend", kind: "investing", name: "Dividend", category: "Income",
    tagline: "Annual dividend income and yield-on-cost.",
    whatItDoes: "Estimates yearly dividend from a given position size and dividend yield, plus yield-on-cost as price appreciates.",
    whenToUse: ["Building an income portfolio (REITs, dividend ETFs)", "Comparing dividend vs growth stocks", "Retirement cash-flow planning"],
    inputs: [
      { label: "Shares × price", help: "Position value at current price." },
      { label: "Dividend yield %", help: "Auto-seeded from the stock's TTM yield." },
    ],
    formula: "Annual dividend = Shares × Price × Yield%. YoC = Annual dividend / Cost basis.",
    example: { setup: "500 shares of a REIT at $50, 6% yield.", steps: ["Position = $25,000", "Div = 25000 × 6%"], result: "$1,500/year (~$125/month)." },
    tips: ["Qualified US dividends: 0/15/20% federal. India: added to slab income."],
    linkTo: "/investing-calculators", investingTab: "dividend",
  }),
  G({
    slug: "invest-brokerage", kind: "investing", name: "Brokerage", category: "Costs",
    tagline: "Zerodha / Groww / Angel One / IBKR / Robinhood.",
    whatItDoes: "Estimates all-in trading costs (brokerage + STT/SEC + GST + exchange + stamp + DP) for the selected broker.",
    whenToUse: ["Before placing an intraday or F&O trade", "Comparing brokers at your typical order size", "Verifying a contract note"],
    inputs: [
      { label: "Broker", help: "Pick from 5 presets — each has its own fee schedule baked in." },
      { label: "Buy / Sell price × qty", help: "Trade legs." },
      { label: "Segment", help: "Equity delivery, intraday, F&O — very different tax stack." },
    ],
    formula: "Total charges = Brokerage + STT + Exchange tx + SEBI + Stamp + GST (18% on brokerage + tx).",
    example: { setup: "Intraday buy 100 @ ₹500, sell 100 @ ₹510 on Zerodha.", steps: ["Brokerage: 0.03% or ₹20/order = ₹20 per side", "STT on sell = 0.025% of 51,000 = ₹12.75", "Add GST + exchange + stamp"], result: "Net P&L ≈ ₹950 (₹1000 gross − ~₹50 charges)." },
    tips: ["Delivery trades: no STT on buy (only sell). F&O: STT is much heavier — 0.1% on sell for options."],
    linkTo: "/investing-calculators", investingTab: "brokerage",
  }),
  G({
    slug: "invest-average", kind: "investing", name: "Stock Average", category: "Analysis",
    tagline: "Break-even after averaging down.",
    whatItDoes: "Computes weighted-average cost across multiple buy lots and shows the price you need to break even.",
    whenToUse: ["Averaging down on a losing position", "Adding to a winner", "Reconciling a broker's average-cost display"],
    inputs: [
      { label: "Lots (qty × price)", help: "Add as many buys as needed." },
    ],
    formula: "Avg = Σ (qty × price) / Σ qty",
    example: { setup: "Buy 10 @ ₹100, then 20 @ ₹80.", steps: ["Cost = 10 × 100 + 20 × 80 = ₹2,600", "Qty = 30"], result: "Avg = ₹86.67. Break-even sell price = ₹86.67." },
    tips: ["Averaging down works only if the thesis is intact — otherwise it's throwing good money after bad."],
    linkTo: "/investing-calculators", investingTab: "average",
  }),
  G({
    slug: "invest-position", kind: "investing", name: "Position Size", category: "Risk",
    tagline: "How many shares should you actually buy?",
    whatItDoes: "Sizes a position so that the loss at your stop equals a fixed % of portfolio (typically 1–2%).",
    whenToUse: ["Every swing/positional entry", "Setting stops that respect risk budget", "Kelly-style sizing for high-conviction plays"],
    inputs: [
      { label: "Portfolio size", help: "Total capital across all positions." },
      { label: "Risk per trade %", help: "1% is the pro standard; 0.5% for beginners." },
      { label: "Entry / Stop", help: "Determines risk-per-share." },
    ],
    formula: "Qty = (Portfolio × Risk%) / (Entry − Stop)",
    example: { setup: "₹10,00,000 portfolio, 1% risk, entry ₹500, stop ₹480.", steps: ["Risk per share = ₹20", "Qty = 10,000 / 20"], result: "Buy 500 shares. Capital deployed = ₹2.5L." },
    tips: ["Never widen your stop after entry — resize instead. Widening is how small losses become account-killers."],
    linkTo: "/investing-calculators", investingTab: "position",
  }),
  G({
    slug: "invest-pl", kind: "investing", name: "Profit / Loss", category: "Analysis",
    tagline: "Realised P&L after all-in costs.",
    whatItDoes: "Nets buy/sell prices, quantity and total charges into a realised P&L number.",
    whenToUse: ["End-of-year tax bookkeeping", "Journaling every closed trade", "Comparing gross vs net returns"],
    inputs: [
      { label: "Buy / Sell price × qty", help: "The trade legs." },
      { label: "Total charges", help: "From the brokerage calc." },
    ],
    formula: "Net = (Sell − Buy) × Qty − Charges",
    example: { setup: "Buy 100 @ ₹500, sell 100 @ ₹550, ₹250 charges.", steps: ["Gross = 50 × 100 = ₹5,000"], result: "Net = ₹4,750 (~4.75% net ROI on ₹50k)." },
    tips: ["Short-term equity gains (<12 months): 20% India, ordinary income US. Long-term: 12.5% India, 0/15/20% US."],
    linkTo: "/investing-calculators", investingTab: "pl",
  }),
  G({
    slug: "invest-compare", kind: "investing", name: "CAGR vs FD / Gold / SIP", category: "Analysis",
    tagline: "Where would this stock's return rank?",
    whatItDoes: "Projects future value of a stock at its assumed CAGR against a Nifty SIP (12%), gold (9%) and FD (7%).",
    whenToUse: ["Deciding whether to hold, trim or rotate a single-stock bet", "Justifying an index-fund default to a first-time investor"],
    inputs: [
      { label: "Investment", help: "Amount deployed." },
      { label: "Years", help: "Comparison horizon." },
    ],
    formula: "FV_asset = P × (1 + r_asset)^t for each asset class.",
    example: { setup: "₹1L for 10 years across stock (18%), Nifty (12%), gold (9%), FD (7%).", steps: ["Stock: 100000 × 1.18^10 ≈ ₹5.23L", "Nifty: ≈ ₹3.11L", "Gold: ≈ ₹2.37L", "FD: ≈ ₹1.97L"], result: "Stock outperforms if its 18% assumption holds; halve it and Nifty wins." },
    tips: ["Sensitivity matters. Rerun with 12% stock CAGR — the ranking often flips."],
    linkTo: "/investing-calculators", investingTab: "compare",
  }),
  G({
    slug: "invest-fire", kind: "investing", name: "FIRE", category: "Planning",
    tagline: "Lean, regular and Fat FIRE numbers.",
    whatItDoes: "Multiplies annual expenses by 20× / 25× / 33× to give Lean, Regular and Fat FIRE targets using the 4% safe-withdrawal rule.",
    whenToUse: ["Setting a retire-early number", "Comparing lifestyle tiers", "Modelling geo-arbitrage (India lean-FIRE vs US regular)"],
    inputs: [
      { label: "Annual expenses today", help: "Excluding one-off big purchases (house, car)." },
    ],
    formula: "Lean FIRE = 20 × Expenses. FIRE = 25 × Expenses. Fat FIRE = 33 × Expenses.",
    example: { setup: "₹6L/year expenses.", steps: ["Lean = ₹1.2 Cr", "FIRE = ₹1.5 Cr", "Fat = ₹2 Cr"], result: "Aim for ₹1.5 Cr in inflation-adjusted rupees at retirement." },
    tips: ["The 4% rule was derived for a 30-year retirement on US data. For 40+ years or Indian equity, 3.25–3.5% is safer."],
    linkTo: "/investing-calculators", investingTab: "fire",
  }),
  G({
    slug: "invest-goal", kind: "investing", name: "Goal Planner", category: "Planning",
    tagline: "Monthly SIP needed for any goal.",
    whatItDoes: "Inverts the SIP formula: given target amount and horizon, tells you the monthly SIP required.",
    whenToUse: ["Child's college fund", "Down payment savings", "Any dated financial goal"],
    inputs: [
      { label: "Goal name & amount", help: "Target future value in today's rupees (auto-inflated)." },
      { label: "Years", help: "Time to goal." },
      { label: "Expected return", help: "12% equity, 8% hybrid, 6% debt." },
    ],
    formula: "P = FV × r / (((1 + r)^n − 1) × (1 + r))",
    example: { setup: "₹50L in 10 years at 12%.", steps: ["r = 0.01, n = 120", "P = 5000000 × 0.01 / ((1.01^120 − 1) × 1.01)"], result: "SIP ≈ ₹21,530/month." },
    tips: ["For goals < 5 years, prefer debt/hybrid funds — equity volatility can miss the deadline."],
    linkTo: "/investing-calculators", investingTab: "goal",
  }),
  G({
    slug: "invest-allocator", kind: "investing", name: "Portfolio Allocator", category: "Planning",
    tagline: "India / US / Gold / Bonds / Cash split.",
    whatItDoes: "Suggests a target allocation across India equity, US equity, gold, bonds and cash based on risk profile and horizon.",
    whenToUse: ["Structuring a new portfolio", "Annual review", "Age-based glide-path planning"],
    inputs: [
      { label: "Age / horizon", help: "Younger + longer = more equity." },
      { label: "Risk appetite", help: "Conservative / Balanced / Aggressive." },
    ],
    formula: "Rules of thumb: (110 − age)% in equity; split equity 60/40 India/US; 10% gold; rest in bonds/cash.",
    example: { setup: "Age 30, aggressive, 25-year horizon.", steps: ["Equity = 80%: India 48%, US 32%", "Gold 10%", "Bonds 8%, Cash 2%"], result: "Rebalance annually if any bucket drifts ±5%." },
    tips: ["Don't chase last year's winner. Rebalance forces buy-low, sell-high."],
    linkTo: "/investing-calculators", investingTab: "allocator",
  }),
  G({
    slug: "invest-rebalance", kind: "investing", name: "Rebalancing", category: "Planning",
    tagline: "Exact buy/sell to return to target %.",
    whatItDoes: "Compares your current bucket values to target percentages and outputs how much to buy or sell in each.",
    whenToUse: ["Annual portfolio review", "After a large single-asset move", "Post-inheritance / windfall integration"],
    inputs: [
      { label: "Asset rows", help: "Name + current value + target %." },
    ],
    formula: "Delta = TargetValue − CurrentValue = (Target% × Total) − Current.",
    example: { setup: "Total ₹20L. Equity 60% target (current 70% = ₹14L). Debt 40% target (current 30% = ₹6L).", steps: ["Target equity = ₹12L", "Sell ₹2L equity, buy ₹2L debt"], result: "Portfolio back at 60/40." },
    tips: ["Rebalance in tax-sheltered accounts first (NPS Tier-I, 401(k)) to avoid triggering LTCG."],
    linkTo: "/investing-calculators", investingTab: "rebalance",
  }),
  G({
    slug: "invest-swp", kind: "investing", name: "SWP", category: "Income",
    tagline: "Systematic Withdrawal Plan sustainability.",
    whatItDoes: "Models a monthly withdrawal from a lumpsum, telling you how long the corpus lasts at a given return.",
    whenToUse: ["Retirement income planning", "Sabbatical funding", "Trust / endowment payouts"],
    inputs: [
      { label: "Corpus", help: "Starting lumpsum." },
      { label: "Monthly withdrawal", help: "Amount taken out each month." },
      { label: "Expected return", help: "Post-tax annual return of the invested corpus." },
    ],
    formula: "Balance_next = Balance × (1 + r/12) − Withdrawal. Iterate until Balance ≤ 0.",
    example: { setup: "₹1 Cr corpus, ₹50k/month, 8% return.", steps: ["Monthly return ≈ ₹66,667", "Net drawdown ≈ ₹0"], result: "Corpus lasts >40 years (essentially perpetual at this ratio)." },
    tips: ["Rule of thumb: withdraw ≤ (return − inflation). Above that, corpus depletes."],
    linkTo: "/investing-calculators", investingTab: "swp",
  }),
  G({
    slug: "invest-dca", kind: "investing", name: "Dollar-Cost Averaging", category: "Analysis",
    tagline: "Simulate DCA into any stock/ETF.",
    whatItDoes: "Averages multiple buys at different prices and shows blended cost and current unrealised P&L.",
    whenToUse: ["Buying into a volatile stock over months", "ETF accumulation strategies", "Rolling into ESPP/RSU tranches"],
    inputs: [
      { label: "Purchase lots", help: "Add each buy: qty × price." },
      { label: "Current price", help: "Live from selected stock context." },
    ],
    formula: "Avg = Σ(qty × price) / Σqty. Unrealised = (Current − Avg) × Σqty.",
    example: { setup: "Buy 10 @ $100, 10 @ $90, 10 @ $110. Current $105.", steps: ["Cost = 3,000", "Avg = $100", "Unrealised = (105 − 100) × 30"], result: "Avg $100, unrealised +$150 (+5%)." },
    tips: ["DCA works best in choppy sideways markets; in strong uptrends, lumpsum wins more often."],
    linkTo: "/investing-calculators", investingTab: "dca",
  }),
];

export const GUIDES: Guide[] = [...CORE, ...INVEST];
export const GUIDES_BY_SLUG: Record<string, Guide> = Object.fromEntries(GUIDES.map(g => [g.slug, g]));
