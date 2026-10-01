import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceDot, CartesianGrid } from "recharts";
import { Zap } from "lucide-react";
import { calcEmi } from "@/lib/finflow/calculators";
import { formatMoney, type Country } from "@/lib/finflow/countries";

type Mode = "rate" | "tenure";

export function SensitivityCard({
  principal,
  rate,
  years,
  country,
}: {
  principal: number;
  rate: number;
  years: number;
  country: Country;
}) {
  const [mode, setMode] = useState<Mode>("rate");

  const data = useMemo(() => {
    if (mode === "rate") {
      const points: { x: number; emi: number; total: number }[] = [];
      for (let r = Math.max(1, rate - 3); r <= rate + 3; r += 0.25) {
        const c = calcEmi({ principal, annualRate: r, years });
        points.push({ x: Number(r.toFixed(2)), emi: c.emi, total: c.total });
      }
      return points;
    }
    const points: { x: number; emi: number; total: number }[] = [];
    const minY = Math.max(2, years - 10);
    const maxY = years + 10;
    for (let y = minY; y <= maxY; y++) {
      const c = calcEmi({ principal, annualRate: rate, years: y });
      points.push({ x: y, emi: c.emi, total: c.total });
    }
    return points;
  }, [mode, principal, rate, years]);

  const currentX = mode === "rate" ? Number(rate.toFixed(2)) : years;
  const currentPoint = data.find((d) => d.x === currentX) ?? data[Math.floor(data.length / 2)];

  return (
    <motion.div
      initial={{ y: 12, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border-sheen glass p-5 sm:p-6"
    >
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-gradient-to-br from-warning/20 to-transparent blur-3xl" />

      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
            <Zap className="h-3 w-3 text-warning" />
            What-if simulator
          </div>
          <div className="mt-1 font-display text-xl font-semibold tracking-tight sm:text-2xl">
            Sensitivity to <span className="font-serif italic text-primary">{mode === "rate" ? "interest rate" : "tenure"}</span>
          </div>
        </div>
        <div className="inline-flex rounded-full border border-foreground/10 dark:border-border/60 bg-foreground/[0.03] dark:bg-card/40 p-1 text-xs">
          <button
            onClick={() => setMode("rate")}
            className={`rounded-full px-3 py-1 font-medium transition ${mode === "rate" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Rate
          </button>
          <button
            onClick={() => setMode("tenure")}
            className={`rounded-full px-3 py-1 font-medium transition ${mode === "tenure" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Tenure
          </button>
        </div>
      </div>

      <div className="relative mt-5 h-64">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
            <defs>
              <linearGradient id="sens-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="oklch(0.72 0.18 262)" />
                <stop offset="100%" stopColor="oklch(0.7 0.22 320)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
            <XAxis
              dataKey="x"
              fontSize={11}
              stroke="oklch(0.65 0.02 260)"
              tickFormatter={(v) => (mode === "rate" ? `${v}%` : `${v}y`)}
            />
            <YAxis
              fontSize={11}
              stroke="oklch(0.65 0.02 260)"
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              width={44}
            />
            <Tooltip
              formatter={(v: number) => formatMoney(v, country)}
              labelFormatter={(l) => (mode === "rate" ? `Rate ${l}%` : `Tenure ${l} years`)}
              contentStyle={{ background: "oklch(0.14 0.014 260)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 12, color: "oklch(0.98 0 0)" }}
              labelStyle={{ color: "oklch(0.98 0 0)" }}
              itemStyle={{ color: "oklch(0.98 0 0)" }}
            />

            <Line type="monotone" dataKey="emi" stroke="url(#sens-line)" strokeWidth={2.5} dot={false} />
            {currentPoint && (
              <ReferenceDot x={currentPoint.x} y={currentPoint.emi} r={5} fill="oklch(0.72 0.18 262)" stroke="white" strokeWidth={2} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="relative mt-3 grid grid-cols-3 gap-2 text-xs">
        <MiniStat label="Best case EMI" value={formatMoney(Math.min(...data.map((d) => d.emi)), country)} tone="success" />
        <MiniStat label={`At current ${mode === "rate" ? rate + "%" : years + "y"}`} value={formatMoney(currentPoint.emi, country)} tone="primary" />
        <MiniStat label="Worst case EMI" value={formatMoney(Math.max(...data.map((d) => d.emi)), country)} tone="warning" />
      </div>
    </motion.div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: "success" | "primary" | "warning" }) {
  const cls = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-gradient";
  return (
    <div className="rounded-xl border border-foreground/10 dark:border-border/60 bg-foreground/[0.02] dark:bg-card/30 p-2.5">
      <div className="truncate font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className={`mt-1 font-mono text-sm font-semibold tabular-nums ${cls}`}>{value}</div>
    </div>
  );
}
