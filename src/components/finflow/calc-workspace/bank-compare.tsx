import { motion } from "framer-motion";
import { useMemo } from "react";
import { Sparkles, TrendingDown } from "lucide-react";
import { calcEmi } from "@/lib/finflow/calculators";
import { formatMoney, type Country } from "@/lib/finflow/countries";

type Bank = { name: string; rate: number; processing: string; note?: string };

const BANKS: Record<Country, Bank[]> = {
  IN: [
    { name: "SBI",       rate: 8.50, processing: "0.35% + GST", note: "Public sector" },
    { name: "HDFC Bank", rate: 8.60, processing: "0.50% + GST" },
    { name: "ICICI",     rate: 8.75, processing: "0.50% + GST" },
    { name: "Axis Bank", rate: 8.75, processing: "0.50% + GST" },
    { name: "Kotak",     rate: 8.85, processing: "0.50% + GST" },
    { name: "LIC HFL",   rate: 8.50, processing: "₹10,000 flat", note: "Housing finance" },
  ],
  US: [
    { name: "Chase",             rate: 6.75, processing: "1.0% origination" },
    { name: "Bank of America",   rate: 6.65, processing: "0.75% origination" },
    { name: "Wells Fargo",       rate: 6.80, processing: "1.0% origination" },
    { name: "US Bank",           rate: 6.90, processing: "1.0% origination" },
    { name: "Rocket Mortgage",   rate: 6.60, processing: "0.5% origination", note: "Online-first" },
  ],
  AE: [
    { name: "Emirates NBD",   rate: 4.49, processing: "1.0% of loan" },
    { name: "ADCB",           rate: 4.75, processing: "1.0% of loan" },
    { name: "Mashreq",        rate: 4.99, processing: "1.0% of loan" },
    { name: "FAB",            rate: 4.65, processing: "0.75% of loan" },
    { name: "Dubai Islamic",  rate: 4.85, processing: "1.0% of loan", note: "Islamic finance" },
  ],
};

export function BankCompare({
  principal,
  years,
  country,
}: {
  principal: number;
  years: number;
  country: Country;
}) {
  const rows = useMemo(() => {
    const banks = BANKS[country] ?? BANKS.IN;
    const computed = banks.map((b) => {
      const r = calcEmi({ principal, annualRate: b.rate, years });
      return { ...b, emi: r.emi, total: r.total, interest: r.interest };
    });
    const minEmi = Math.min(...computed.map((c) => c.emi));
    return computed
      .map((c) => ({ ...c, recommended: c.emi === minEmi }))
      .sort((a, b) => a.emi - b.emi);
  }, [principal, years, country]);

  const best = rows[0];
  const worst = rows[rows.length - 1];
  const savings = worst.total - best.total;

  return (
    <motion.div
      initial={{ y: 12, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border-sheen glass p-5 sm:p-6"
    >
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-gradient-to-br from-primary/25 to-transparent blur-3xl" />

      <div className="relative flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">Bank comparison</div>
          <div className="mt-1 font-display text-xl font-semibold tracking-tight sm:text-2xl">
            Same loan · <span className="font-serif italic text-primary">different banks</span>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs text-success">
          <TrendingDown className="h-3.5 w-3.5" />
          Save up to <span className="font-mono font-semibold tabular-nums">{formatMoney(savings, country)}</span> over tenure
        </div>
      </div>

      <div className="relative mt-5 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-foreground/10 dark:border-border/60 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <th className="py-2 pr-4 text-left">Bank</th>
              <th className="py-2 pr-4 text-right">Rate</th>
              <th className="py-2 pr-4 text-right">Monthly EMI</th>
              <th className="py-2 pr-4 text-right">Total interest</th>
              <th className="py-2 pr-4 text-right">Total payable</th>
              <th className="py-2 pr-4 text-left">Processing</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.name}
                className={`border-b border-foreground/5 dark:border-border/40 transition-colors ${
                  r.recommended ? "bg-primary/[0.06]" : "hover:bg-foreground/[0.03] dark:bg-card/40"
                }`}
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{r.name}</span>
                    {r.recommended && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-primary">
                        <Sparkles className="h-2.5 w-2.5" /> AI pick
                      </span>
                    )}
                  </div>
                  {r.note && <div className="mt-0.5 text-[11px] text-muted-foreground">{r.note}</div>}
                </td>
                <td className="py-3 pr-4 text-right font-mono tabular-nums">{r.rate.toFixed(2)}%</td>
                <td className="py-3 pr-4 text-right font-mono tabular-nums">{formatMoney(r.emi, country)}</td>
                <td className="py-3 pr-4 text-right font-mono tabular-nums text-warning">{formatMoney(r.interest, country)}</td>
                <td className="py-3 pr-4 text-right font-mono tabular-nums">{formatMoney(r.total, country)}</td>
                <td className="py-3 pr-4 text-left text-xs text-muted-foreground">{r.processing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="relative mt-4 text-[11px] text-muted-foreground">
        Rates are indicative benchmarks refreshed periodically. Actual offers depend on credit score, income, and lender policy.
      </div>
    </motion.div>
  );
}
