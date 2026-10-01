import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useCountry } from "@/lib/finflow/country-store";
import { COUNTRIES } from "@/lib/finflow/countries";
import type { AnalysisPayload } from "@/lib/finflow/analysis/types";
import type { AnalysisInsights } from "@/lib/finflow/analysis/insights.functions";
import { analyzeCalculation } from "@/lib/finflow/analysis/insights.functions";
import { saveCalculation } from "@/lib/finflow/analysis/calculations.functions";
import { AnalysisActions, type SavedState } from "./analysis/AnalysisActions";
import { KpiGrid } from "./analysis/KpiGrid";
import { BreakdownTableView } from "./analysis/BreakdownTableView";
import { ComparisonTable } from "./analysis/ComparisonTable";
import { AiInsightsPanel } from "./analysis/AiInsightsPanel";
import { AssumptionsPanel } from "./analysis/AssumptionsPanel";
import { DisclaimerBanner } from "./analysis/DisclaimerBanner";
import { BankCompare } from "./calc-workspace/bank-compare";
import { SensitivityCard } from "./calc-workspace/sensitivity";
import { ExplainPanel } from "./rag/explain-panel";

export function CalcShell({
  title, tagline, children, accent, icon: Icon,
  saveType, saveInputs, saveResults, saveName,
  analysisPayload, chartNodeIds,
  loanSim,
}: {
  title: string; tagline: string; children: ReactNode; accent: string;
  icon: React.ComponentType<{ className?: string }>;
  saveType?: string;
  saveInputs?: Record<string, unknown>;
  saveResults?: Record<string, unknown>;
  saveName?: string;
  /** When provided, replaces the simple Save button with the full analysis actions bar
   *  AND renders KPI hero + breakdown + comparison + AI + assumptions + disclaimer below children. */
  analysisPayload?: AnalysisPayload;
  chartNodeIds?: string[];
  /** When provided, adds a What-If simulator + Bank comparison to loan calculators. */
  loanSim?: { principal: number; rate: number; years: number };
}) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [saved, setSaved] = useState<SavedState | null>(null);
  const [insights, setInsights] = useState<AnalysisInsights | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const analyze = useServerFn(analyzeCalculation);
  const saveFn = useServerFn(saveCalculation);
  const navigate = useNavigate();
  const [country] = useCountry();
  const c = COUNTRIES[country];

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
  }, []);

  // Auto-save calculation history for signed-in users (debounced upsert, one row per session).
  const autoSavedIdRef = useRef<string | null>(null);
  const lastPayloadRef = useRef<string>("");
  useEffect(() => {
    if (!signedIn || !saveType || !saveResults || Object.keys(saveResults).length === 0) return;
    const payload = JSON.stringify({ i: saveInputs ?? {}, r: saveResults });
    if (payload === lastPayloadRef.current) return;
    const timer = setTimeout(async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return;
      const existingId = autoSavedIdRef.current;
      if (existingId) {
        const { error } = await supabase.from("saved_calculations").update({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          inputs: (saveInputs ?? {}) as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          results: saveResults as any,
          updated_at: new Date().toISOString(),
        }).eq("id", existingId).eq("user_id", user.id);
        if (!error) lastPayloadRef.current = payload;
      } else {
        const { data, error } = await supabase.from("saved_calculations").insert({
          user_id: user.id,
          calculator_type: saveType,
          name: saveName ?? title,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          inputs: (saveInputs ?? {}) as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          results: saveResults as any,
        }).select("id").single();
        if (!error && data) {
          autoSavedIdRef.current = data.id;
          lastPayloadRef.current = payload;
        }
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [signedIn, saveType, saveName, title, saveInputs, saveResults]);

  async function legacySave() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Sign in to save calculations"); return; }
    const { error } = await supabase.from("saved_calculations").insert({
      user_id: user.id,
      calculator_type: saveType!,
      name: saveName ?? title,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      inputs: (saveInputs ?? {}) as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      results: (saveResults ?? {}) as any,
    });
    if (error) toast.error(error.message); else toast.success("Saved to dashboard");
  }

  async function ensureSaved(): Promise<SavedState | null> {
    if (!analysisPayload) return null;
    if (saved) return saved;
    if (signedIn === false) {
      toast.error("Sign in to save this report");
      navigate({ to: "/auth" });
      return null;
    }
    setSaving(true);
    try {
      const row = await saveFn({
        data: {
          calculatorType: analysisPayload.slug,
          name: analysisPayload.title,
          country: analysisPayload.country,
          inputs: analysisPayload.raw.inputs,
          results: analysisPayload.raw.results,
          summary: {
            kpis: analysisPayload.kpis.map((k) => ({ label: k.label, value: k.value, tone: k.tone })),
            country: analysisPayload.country,
            subtitle: analysisPayload.subtitle,
          },
        },
      });
      const s: SavedState = {
        id: row.id,
        reportId: row.report_id ?? "",
        shareSlug: row.share_slug ?? null,
        isPublic: !!row.is_public,
      };
      setSaved(s);
      toast.success("Saved to your dashboard");
      return s;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function runAi() {
    if (!analysisPayload || aiLoading) return;
    if (signedIn === false) {
      toast.error("Sign in to use AI Insights");
      navigate({ to: "/auth" });
      return;
    }
    setAiError(null);
    setAiLoading(true);
    try {
      const s = await ensureSaved();
      const res = await analyze({
        data: {
          calculatorType: analysisPayload.slug,
          country: analysisPayload.country,
          brief: analysisPayload.aiBrief,
          saveToId: s?.id,
        },
      });
      setInsights(res);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "AI failed");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="bg-page-gradient min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-32 pt-4 sm:pb-24 sm:pt-6">
        <div className="flex items-center justify-between gap-3">
          <Link to="/calculators" className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 dark:border-border/60 bg-foreground/[0.04] dark:bg-card/60 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground hover:bg-foreground/[0.07] dark:bg-white/[0.07] transition print:hidden">
            <ArrowLeft className="h-3 w-3" /> All calculators
          </Link>
          <div className="hidden items-center gap-2 sm:flex print:hidden">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 dark:border-border/60 bg-foreground/[0.03] dark:bg-card/40 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              <span className="text-sm leading-none">{c.flag}</span> {c.name}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 dark:border-border/60 bg-foreground/[0.03] dark:bg-card/40 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {c.symbol} {c.currency}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Live
            </span>
          </div>
        </div>

        {/* Premium hero card */}
        <motion.div
          initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-5 overflow-hidden rounded-3xl border-sheen glass p-5 sm:mt-6 sm:p-8"
        >
          <div aria-hidden className={`pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-gradient-to-br ${accent} opacity-[0.18] blur-3xl`} />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div className="flex items-start gap-4 sm:gap-5 min-w-0">
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-elegant ring-1 ring-white/15 sm:h-16 sm:w-16`}>
                <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 font-mono text-[9.5px] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:text-[10px] sm:tracking-[0.26em]">
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                    AI Financial Workspace
                  </span>
                  {saved?.reportId && <span className="text-muted-foreground/70">· Report {saved.reportId}</span>}
                </div>
                <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                  {title.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="font-serif italic text-primary">{title.split(" ").slice(-1)[0]}</span>
                </h1>
                <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">{tagline}</p>
              </div>
            </div>
            <div className={`shrink-0 ${analysisPayload ? "hidden sm:block" : ""}`}>

              {analysisPayload ? (
                <AnalysisActions
                  payload={analysisPayload}
                  chartNodeIds={chartNodeIds ?? []}
                  insights={insights}
                  saved={saved}
                  onSaved={setSaved}
                  signedIn={signedIn}
                  saving={saving}
                  aiLoading={aiLoading}
                  onRunAi={runAi}
                  onEnsureSaved={ensureSaved}
                />
              ) : saveType ? (
                <Button variant="outline" size="sm" onClick={legacySave} className="rounded-full">
                  <Bookmark className="mr-1 h-3.5 w-3.5" /> Save
                </Button>
              ) : null}
            </div>
          </div>
        </motion.div>

        {analysisPayload && (
          <>
            <Section id="results" eyebrow="01 · Results">
              <KpiGrid kpis={analysisPayload.kpis} />
            </Section>
            <Section id="explain" eyebrow="Explain this result">
              <ExplainPanel payload={analysisPayload} signedIn={signedIn} />
            </Section>
          </>
        )}

        <Section id="inputs" eyebrow="02 · Inputs & Visualisation">
          {children}
        </Section>

        {loanSim && (
          <>
            <Section id="what-if" eyebrow="What-If Simulator">
              <SensitivityCard principal={loanSim.principal} rate={loanSim.rate} years={loanSim.years} country={country} />
            </Section>
            <Section id="banks" eyebrow="Bank Comparison">
              <BankCompare principal={loanSim.principal} years={loanSim.years} country={country} />
            </Section>
          </>
        )}

        {analysisPayload && (
          <>
            {analysisPayload.comparison && (
              <Section id="comparison" eyebrow="03 · Scenario comparison">
                <ComparisonTable block={analysisPayload.comparison} />
              </Section>
            )}
            {analysisPayload.breakdown && (
              <Section id="breakdown" eyebrow={analysisPayload.comparison ? "04 · Detailed breakdown" : "03 · Detailed breakdown"}>
                <BreakdownTableView table={analysisPayload.breakdown} />
              </Section>
            )}
            <Section id="ai" eyebrow="AI Intelligence">
              <AiInsightsPanel
                insights={insights}
                loading={aiLoading}
                error={aiError}
                hasRun={!!insights}
                onRun={runAi}
              />
            </Section>
            {analysisPayload.assumptions?.length ? (
              <Section id="assumptions" eyebrow="Assumptions" compact>
                <AssumptionsPanel items={analysisPayload.assumptions} />
              </Section>
            ) : null}
            <Section id="disclaimer" compact>
              <DisclaimerBanner />
            </Section>
          </>
        )}
      </div>

      {/* Sticky mobile action rail */}
      {analysisPayload && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-foreground/10 dark:border-border/60 bg-black/40 px-3 py-2.5 backdrop-blur-xl sm:hidden print:hidden">
          <AnalysisActions
            payload={analysisPayload}
            chartNodeIds={chartNodeIds ?? []}
            insights={insights}
            saved={saved}
            onSaved={setSaved}
            signedIn={signedIn}
            saving={saving}
            aiLoading={aiLoading}
            onRunAi={runAi}
            onEnsureSaved={ensureSaved}
          />
        </div>
      )}
    </div>
  );
}

function Section({ id, eyebrow, children, compact }: { id?: string; eyebrow?: string; children: ReactNode; compact?: boolean }) {
  return (
    <section id={id} className={compact ? "mt-6" : "mt-10"}>
      {eyebrow && (
        <div className="mb-3 flex items-center gap-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          <span className="h-px w-6 bg-gradient-to-r from-primary/60 to-transparent" />
          {eyebrow}
        </div>
      )}
      {children}
    </section>
  );
}


export function StatCard({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "primary" | "success" | "warning" | "destructive" }) {
  const tones: Record<string, string> = {
    primary: "text-gradient",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
  };
  return (
    <div className="group relative min-w-0 overflow-hidden rounded-2xl border-sheen glass p-5 transition-all duration-500 hover:-translate-y-0.5">
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative truncate font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{label}</div>
      <div className={`relative mt-2 font-mono text-xl font-semibold leading-tight tracking-tight tabular-nums break-words sm:text-2xl ${tone ? tones[tone] : ""}`}>
        {value}
      </div>
      {sub && <div className="relative mt-1 truncate text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}


export function InputRow({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="mt-1.5">{children}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function NumberInput({
  value, onChange, prefix, suffix, step = 1, min, max,
}: {
  value: number; onChange: (n: number) => void; prefix?: string; suffix?: string; step?: number; min?: number; max?: number;
}) {
  const [text, setText] = useState<string>(Number.isFinite(value) ? String(value) : "");
  const focused = useRef(false);

  // Sync from parent when not actively editing.
  useEffect(() => {
    if (!focused.current) {
      setText(Number.isFinite(value) ? String(value) : "");
    }
  }, [value]);

  return (
    <div className="flex items-center rounded-xl border border-foreground/10 dark:border-border/60 bg-foreground/[0.03] dark:bg-card/40 transition focus-within:border-primary/50 focus-within:bg-foreground/[0.05] dark:bg-card/60 focus-within:ring-2 focus-within:ring-primary/25 focus-within:shadow-[0_0_0_1px_oklch(from_var(--primary)_l_c_h/0.25),0_8px_24px_-8px_oklch(from_var(--primary)_l_c_h/0.3)]">
      {prefix && <span className="pl-3 text-sm text-muted-foreground">{prefix}</span>}
      <input
        type="text"
        inputMode="decimal"
        value={text}
        step={step}
        onFocus={(e) => {
          focused.current = true;
          e.currentTarget.select();
        }}
        onBlur={() => {
          focused.current = false;
          if (text.trim() === "" || text === "-" || text === ".") {
            setText("0");
            onChange(0);
          }
        }}
        onChange={(e) => {
          const raw = e.target.value;
          // Allow empty, minus, and partial decimals during typing.
          if (raw === "" || raw === "-" || raw === "." || /^-?\d*\.?\d*$/.test(raw)) {
            setText(raw);
            const n = raw === "" || raw === "-" || raw === "." ? NaN : Number(raw);
            if (Number.isFinite(n)) {
              let clamped = n;
              if (typeof min === "number" && clamped < min) clamped = min;
              if (typeof max === "number" && clamped > max) clamped = max;
              onChange(clamped);
            }
          }
        }}
        className="w-full bg-transparent px-3 py-2.5 text-base font-medium focus:outline-none"
      />
      {suffix && <span className="pr-3 text-sm text-muted-foreground">{suffix}</span>}
    </div>
  );
}

/** Grouped glass card for a logical section of inputs (Property / Loan / Taxes / …). */
export function InputGroup({ label, description, children }: { label: string; description?: string; children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-sheen glass p-5">
      <div aria-hidden className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
      <div className="relative mb-4">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">{label}</div>
        {description && <div className="mt-1 text-xs text-muted-foreground/80">{description}</div>}
      </div>
      <div className="relative space-y-4">{children}</div>
    </div>
  );
}
