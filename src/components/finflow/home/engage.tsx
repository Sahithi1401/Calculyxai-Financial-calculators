import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, RotateCcw, Check } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Instant mini-calculator                                             */
/* ------------------------------------------------------------------ */

type Mode = "sip" | "emi";

const fmt = (n: number) =>
  "₹" + (n >= 1e7 ? (n / 1e7).toFixed(2) + " Cr" : n >= 1e5 ? (n / 1e5).toFixed(2) + " L" : Math.round(n).toLocaleString("en-IN"));

function Range({
  label, value, min, max, step, onChange, display,
}: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <div className="flex items-baseline justify-between text-[13px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-semibold text-foreground tabular-nums">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="calc-range mt-2 w-full"
        style={{ ["--pct" as string]: `${pct}%` }}
      />
    </label>
  );
}

export function QuickCalc() {
  const [mode, setMode] = useState<Mode>("sip");
  const [sipAmt, setSipAmt] = useState(10000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(15);
  const [loan, setLoan] = useState(5000000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanYears, setLoanYears] = useState(20);

  const sip = useMemo(() => {
    const r = sipRate / 12 / 100, n = sipYears * 12;
    const fv = sipAmt * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = sipAmt * n;
    return { fv, invested, gain: fv - invested };
  }, [sipAmt, sipRate, sipYears]);

  const emi = useMemo(() => {
    const r = loanRate / 12 / 100, n = loanYears * 12;
    const e = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return { emi: e, total: e * n, interest: e * n - loan };
  }, [loan, loanRate, loanYears]);

  const share = mode === "sip" ? sip.invested / sip.fv : loan / emi.total;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24" aria-labelledby="quick-calc-heading">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" aria-hidden /> Try it — no sign-up needed
        </div>
        <h2 id="quick-calc-heading" className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
          Get an answer in <span className="font-serif italic text-primary">five seconds</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Drag the sliders. The result updates instantly.
        </p>
      </div>

      <div className="mt-10 grid gap-6 rounded-3xl border border-sheen glass p-5 shadow-elegant sm:p-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <div role="tablist" aria-label="Calculator type" className="inline-flex rounded-full border border-border/60 bg-background/40 p-1">
            {([["sip", "SIP returns"], ["emi", "Loan EMI"]] as const).map(([m, l]) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={`min-h-10 rounded-full px-5 text-sm font-medium transition ${mode === m ? "bg-primary text-primary-foreground shadow-elegant" : "text-muted-foreground hover:text-foreground"}`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="mt-7 space-y-6">
            {mode === "sip" ? (
              <>
                <Range label="Monthly investment" value={sipAmt} min={500} max={100000} step={500} onChange={setSipAmt} display={fmt(sipAmt)} />
                <Range label="Expected return (p.a.)" value={sipRate} min={4} max={20} step={0.5} onChange={setSipRate} display={`${sipRate}%`} />
                <Range label="Time period" value={sipYears} min={1} max={40} step={1} onChange={setSipYears} display={`${sipYears} yrs`} />
              </>
            ) : (
              <>
                <Range label="Loan amount" value={loan} min={100000} max={20000000} step={100000} onChange={setLoan} display={fmt(loan)} />
                <Range label="Interest rate (p.a.)" value={loanRate} min={5} max={16} step={0.1} onChange={setLoanRate} display={`${loanRate.toFixed(1)}%`} />
                <Range label="Tenure" value={loanYears} min={1} max={30} step={1} onChange={setLoanYears} display={`${loanYears} yrs`} />
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-background/40 p-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              {mode === "sip" ? "Estimated wealth" : "Monthly EMI"}
            </div>
            <div className="mt-2 font-display text-4xl font-semibold tabular-nums text-primary sm:text-5xl" aria-live="polite">
              {fmt(mode === "sip" ? sip.fv : emi.emi)}
            </div>
            <div className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary/50 transition-all duration-300" style={{ width: `${Math.min(100, share * 100)}%` }} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="flex items-center gap-1.5 text-muted-foreground"><span className="h-2 w-2 rounded-full bg-primary/50" />{mode === "sip" ? "Invested" : "Principal"}</dt>
                <dd className="mt-1 font-mono font-semibold tabular-nums">{fmt(mode === "sip" ? sip.invested : loan)}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-muted-foreground"><span className="h-2 w-2 rounded-full bg-muted-foreground/40" />{mode === "sip" ? "Returns" : "Total interest"}</dt>
                <dd className="mt-1 font-mono font-semibold tabular-nums">{fmt(mode === "sip" ? sip.gain : emi.interest)}</dd>
              </div>
            </dl>
          </div>
          <Link
            to="/calc/$type"
            params={{ type: mode === "sip" ? "sip" : "home-loan" }}
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:brightness-110 active:scale-[0.98]"
          >
            See full breakdown & chart <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* "What should I calculate?" quiz                                      */
/* ------------------------------------------------------------------ */

type Goal = "grow" | "buy" | "tax" | "retire";
type Pick = { slug: string; name: string; why: string };

const GOALS: Array<{ id: Goal; label: string; hint: string }> = [
  { id: "grow", label: "Grow my savings", hint: "SIP, FD, compounding" },
  { id: "buy", label: "Buy a home or car", hint: "Loans, EMI, property" },
  { id: "tax", label: "Understand my tax & salary", hint: "Income tax, GST, take-home" },
  { id: "retire", label: "Plan retirement", hint: "Corpus, inflation" },
];

const RESULTS: Record<Goal, Record<"short" | "long", Pick[]>> = {
  grow: {
    short: [
      { slug: "fd", name: "FD Calculator", why: "Safe, predictable returns for under 5 years." },
      { slug: "compound-interest", name: "Compound Interest", why: "See how a lumpsum grows." },
      { slug: "inflation", name: "Inflation Impact", why: "Check you're beating inflation." },
    ],
    long: [
      { slug: "sip", name: "SIP Calculator", why: "Monthly investing is the best long-term engine." },
      { slug: "compound-interest", name: "Compound Interest", why: "Visualise decades of compounding." },
      { slug: "inflation", name: "Inflation Impact", why: "Convert future wealth into today's money." },
    ],
  },
  buy: {
    short: [
      { slug: "home-loan", name: "Home Loan EMI", why: "Know your monthly payment before you apply." },
      { slug: "property", name: "Property Cost Breakdown", why: "Stamp duty, taxes and hidden costs." },
      { slug: "salary", name: "Salary Take-Home", why: "Make sure the EMI fits your net pay." },
    ],
    long: [
      { slug: "home-loan", name: "Home Loan EMI", why: "Compare tenures and total interest." },
      { slug: "sip", name: "SIP Calculator", why: "Build your down payment first." },
      { slug: "property", name: "Property Cost Breakdown", why: "Full cost of owning, not just the EMI." },
    ],
  },
  tax: {
    short: [
      { slug: "income-tax", name: "Income Tax", why: "Your tax under the current regime." },
      { slug: "salary", name: "Salary Take-Home", why: "What actually lands in your account." },
      { slug: "gst", name: "GST Calculator", why: "Inclusive / exclusive split in one tap." },
    ],
    long: [
      { slug: "income-tax", name: "Income Tax", why: "Plan deductions for the year ahead." },
      { slug: "salary", name: "Salary Take-Home", why: "Evaluate a raise or new offer." },
      { slug: "sip", name: "SIP Calculator", why: "Tax-saving ELSS investing." },
    ],
  },
  retire: {
    short: [
      { slug: "retirement", name: "Retirement Planner", why: "The corpus you need, starting now." },
      { slug: "fd", name: "FD Calculator", why: "Low-risk income for near-term retirement." },
      { slug: "inflation", name: "Inflation Impact", why: "Future cost of your lifestyle." },
    ],
    long: [
      { slug: "retirement", name: "Retirement Planner", why: "Size your target corpus." },
      { slug: "sip", name: "SIP Calculator", why: "The monthly SIP that gets you there." },
      { slug: "inflation", name: "Inflation Impact", why: "Why starting early matters." },
    ],
  },
};

export function CalcFinder() {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [horizon, setHorizon] = useState<"short" | "long" | null>(null);
  const step = !goal ? 1 : !horizon ? 2 : 3;
  const picks = goal && horizon ? RESULTS[goal][horizon] : [];

  return (
    <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 sm:pb-24" aria-labelledby="finder-heading">
      <div className="rounded-3xl border border-sheen glass p-6 shadow-elegant sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-primary">Not sure where to start?</div>
            <h2 id="finder-heading" className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              What should I <span className="font-serif italic text-primary">calculate?</span>
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-1.5" aria-label={`Step ${step} of 3`}>
            {[1, 2, 3].map((s) => (
              <span key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s <= step ? "w-6 bg-primary" : "w-3 bg-muted"}`} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground">What's your main goal right now?</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className="group min-h-16 rounded-2xl border border-border/60 bg-background/40 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/50"
                >
                  <div className="font-medium text-foreground group-hover:text-primary">{g.label}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{g.hint}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground">When do you need this money or decision?</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {([["short", "Within 5 years"], ["long", "5+ years from now"]] as const).map(([h, l]) => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className="min-h-16 rounded-2xl border border-border/60 bg-background/40 p-4 text-left font-medium transition hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground">Here's your personal starting kit:</p>
            <ol className="mt-4 space-y-3">
              {picks.map((p, i) => (
                <li key={p.slug}>
                  <Link
                    to="/calc/$type"
                    params={{ type: p.slug }}
                    className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-background/40 p-4 transition hover:border-primary/50"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 font-mono text-sm font-semibold text-primary">
                      {i === 0 ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-foreground group-hover:text-primary">{p.name}</span>
                      <span className="block text-xs text-muted-foreground">{p.why}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        )}

        {step > 1 && (
          <button
            onClick={() => { setGoal(null); setHorizon(null); }}
            className="mt-5 inline-flex min-h-10 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Start over
          </button>
        )}
      </div>
    </section>
  );
}
