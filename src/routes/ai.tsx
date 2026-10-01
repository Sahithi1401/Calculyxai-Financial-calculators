import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User as UserIcon, ArrowLeft, Copy, Check, RefreshCw, TrendingUp, Home, Wallet, LineChart, Square, Mic, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/finflow/navbar";
import { CalculyxMark } from "@/components/finflow/calculyx-mark";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { askFinFlowAi } from "@/lib/finflow/ai.functions";
import { useCountry } from "@/lib/finflow/country-store";
import { useMicTranscription } from "@/lib/finflow/use-mic-transcription";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/ai")({
  head: () =>
    pageHead({
      title: "AI Financial Assistant Chat — Calculyx AI",
      description:
        "Ask a finance-tuned AI copilot about mortgages, SIPs, taxes and market moves. Answers are grounded in Calculyx data with citations you can check yourself.",
      path: "/ai",
      crumbs: [{ name: "Home", path: "/" }, { name: "AI Assistant", path: "/ai" }],
    }),
  component: AiPage,
});

type Source = { n: number; title: string; url: string | null; similarity: number };
type Msg = { role: "user" | "assistant"; content: string; sources?: Source[] };

const SUGGESTION_GROUPS: { icon: React.ComponentType<{ className?: string }>; label: string; prompts: string[] }[] = [
  {
    icon: Home,
    label: "Mortgage",
    prompts: [
      "How do I choose between a 15-year and 30-year mortgage?",
      "What's the total cost of owning a 1 Cr flat in Mumbai?",
    ],
  },
  {
    icon: TrendingUp,
    label: "Investing",
    prompts: [
      "Explain SIP vs lump sum with a concrete example.",
      "Compare 6% FD vs 12% mutual fund SIP over 10 years.",
    ],
  },
  {
    icon: Wallet,
    label: "Taxes",
    prompts: [
      "How is capital gains tax calculated in India?",
      "New vs old tax regime for a 15L salary — which wins?",
    ],
  },
  {
    icon: LineChart,
    label: "Retirement",
    prompts: [
      "How much do I need to retire at 55 in the US?",
      "Design a 25-year retirement corpus plan.",
    ],
  },
];

function AiPage() {
  const navigate = useNavigate();
  const [country] = useCountry();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const mic = useMicTranscription(
    (text) => setInput((prev) => (prev ? prev + " " + text : text)),
    (msg) => toast.error(msg),
  );
  const [busy, setBusy] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const ask = useServerFn(askFinFlowAi);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [input]);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    if (!signedIn) { navigate({ to: "/auth" }); return; }
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await ask({ data: { messages: next, country } });
      setMessages([...next, { role: "assistant", content: res.reply, sources: res.sources }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI failed");
      setMessages(next);
    } finally { setBusy(false); }
  };

  const regenerate = async () => {
    if (busy || messages.length === 0) return;
    const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === "user");
    if (lastUserIdx === -1) return;
    const cutTo = messages.length - lastUserIdx;
    const trimmed = messages.slice(0, cutTo);
    setMessages(trimmed);
    setBusy(true);
    try {
      const res = await ask({ data: { messages: trimmed, country } });
      setMessages([...trimmed, { role: "assistant", content: res.reply, sources: res.sources }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI failed");
    } finally { setBusy(false); }
  };

  const copy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1400);
    } catch { toast.error("Copy failed"); }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="bg-page-gradient min-h-screen">
      <Navbar />

      {/* Ambient aurora backdrop */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-[#21DDED]/10 blur-[120px]" />
      </div>

      <main className="pt-16 pb-4 sm:pt-20 sm:pb-6">
        <div className="mx-auto flex h-[calc(100dvh-4.5rem)] max-w-4xl flex-col px-3 sm:h-[calc(100dvh-5.5rem)] sm:px-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 pb-3 pt-3 sm:pb-4 sm:pt-4">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <CalculyxMark className="h-10 w-10 sm:h-11 sm:w-11" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate font-display text-lg font-semibold tracking-tight sm:text-xl">
                  Calculyx <span className="italic text-primary" style={{ fontFamily: "var(--font-serif)" }}>AI</span>
                </h1>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  Online · Financial reasoning
                </div>
              </div>
            </div>
            {hasMessages && (
              <button
                onClick={() => setMessages([])}
                className="rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-[11px] font-medium text-muted-foreground backdrop-blur transition hover:border-primary/50 hover:text-foreground"
              >
                New chat
              </button>
            )}
          </div>

          {/* Chat area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto rounded-3xl border border-border/50 bg-card/40 p-4 shadow-inner backdrop-blur-md sm:p-8"
          >
            {!hasMessages && (
              <div className="grid h-full place-items-center">
                <div className="w-full max-w-2xl text-center">

                  <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                    How can I help with your{" "}
                    <span className="italic text-primary" style={{ fontFamily: "var(--font-serif)" }}>
                      finances
                    </span>
                    ?
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-[15px]">
                    Ask about mortgages, taxes, SIPs, retirement, or any calculation. Tuned for India, USA and UAE.
                  </p>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {SUGGESTION_GROUPS.map((g, gi) => (
                      <motion.div
                        key={g.label}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.08 * gi }}
                        className="group rounded-2xl border border-border/60 bg-card/60 p-4 text-left backdrop-blur transition hover:border-primary/60 hover:bg-card/80"
                      >
                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          <g.icon className="h-3.5 w-3.5 text-primary" />
                          {g.label}
                        </div>
                        <div className="mt-3 space-y-2">
                          {g.prompts.map((p) => (
                            <button
                              key={p}
                              onClick={() => send(p)}
                              className="block w-full text-left text-[13px] leading-snug text-foreground/85 transition hover:text-primary"
                            >
                              → {p}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {signedIn === false && (
                    <div className="mt-8 text-sm text-muted-foreground">
                      <Link to="/auth" className="text-primary hover:underline">
                        Sign in
                      </Link>{" "}
                      to start chatting with Calculyx AI.
                    </div>
                  )}
                </div>
              </div>
            )}

            {hasMessages && (
              <div className="space-y-6">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className={m.role === "user" ? "flex justify-end" : "flex gap-3 sm:gap-4"}
                  >
                    {m.role === "assistant" && (
                      <div className="relative mt-1 shrink-0">
                        <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-tr from-[#21DDED]/30 via-primary/30 to-[#274AB3]/30 blur-sm" />
                        <CalculyxMark className="h-8 w-8" />
                      </div>
                    )}

                    {m.role === "user" ? (
                      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground shadow-sm sm:text-[15px]">
                        <div className="whitespace-pre-wrap">{m.content}</div>
                      </div>
                    ) : (
                      <div className="group min-w-0 flex-1">
                        <div className="markdown-body min-w-0 text-[15px] leading-relaxed text-foreground/90">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                        </div>
                        {!!m.sources?.length && (
                          <div className="mt-3 rounded-xl border border-border/60 bg-card/50 p-3">
                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Sources</p>
                            <ul className="mt-2 space-y-1.5">
                              {m.sources.map((s) =>
                                s.url ? (
                                  <li key={s.n}>
                                    <a
                                      id={`src-${i}-${s.n}`}
                                      href={s.url}
                                      className="inline-flex items-start gap-2 text-[13px] text-muted-foreground transition hover:text-primary"
                                    >
                                      <span className="mt-px font-mono text-[11px] text-primary">[{s.n}]</span>
                                      <span className="underline-offset-2 hover:underline">{s.title}</span>
                                    </a>
                                  </li>
                                ) : (
                                  <li key={s.n} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                                    <span className="mt-px font-mono text-[11px] text-primary">[{s.n}]</span>
                                    <span>{s.title}</span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}

                        <div className="mt-2 flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                          <button
                            onClick={() => copy(m.content, i)}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            {copiedIdx === i ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {copiedIdx === i ? "Copied" : "Copy"}
                          </button>
                          {i === messages.length - 1 && (
                            <button
                              onClick={regenerate}
                              disabled={busy}
                              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
                            >
                              <RefreshCw className="h-3 w-3" /> Regenerate
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {m.role === "user" && (
                      <div className="ml-3 mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted">
                        <UserIcon className="h-4 w-4" />
                      </div>
                    )}
                  </motion.div>
                ))}

                <AnimatePresence>
                  {busy && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3"
                    >
                      <CalculyxMark className="h-8 w-8" />
                      <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <span className="inline-flex gap-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0ms" }} />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "120ms" }} />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "240ms" }} />
                        </span>
                        <span className="ml-1 bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground bg-[length:200%_100%] bg-clip-text text-transparent animate-[shimmer_2s_linear_infinite]">
                          Reasoning through the numbers…
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="mt-4"
          >
            <div className="relative rounded-3xl border border-border/60 bg-card/70 p-2 shadow-lg backdrop-blur-md transition focus-within:border-primary/60 focus-within:shadow-[0_0_0_4px_rgba(58,108,236,0.12)]">
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => (mic.state === "recording" ? mic.stop() : mic.start())}
                  disabled={busy || mic.state === "transcribing"}
                  aria-label={mic.state === "recording" ? "Stop recording" : "Record voice message"}
                  title={mic.state === "recording" ? "Stop & transcribe" : "Voice input"}
                  className={`ml-1 mb-1 grid h-9 w-9 shrink-0 place-items-center rounded-full transition ${
                    mic.state === "recording"
                      ? "bg-destructive text-destructive-foreground shadow-[0_0_0_4px_rgba(239,68,68,0.25)] animate-pulse"
                      : mic.state === "transcribing"
                        ? "bg-muted text-muted-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-primary"
                  }`}
                >
                  {mic.state === "transcribing" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder={signedIn === false ? "Sign in to chat with Calculyx AI…" : "Message Calculyx AI — Shift+Enter for newline"}
                  disabled={busy}
                  className="max-h-[200px] min-h-[40px] flex-1 resize-none bg-transparent px-1 py-2 text-[15px] leading-relaxed placeholder:text-muted-foreground focus:outline-none"
                />
                <Button
                  type="submit"
                  size="icon"
                  aria-label={busy ? "Stop response" : "Send message"}
                  disabled={busy || !input.trim()}
                  className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-tr from-primary to-[#21DDED] text-primary-foreground shadow-md transition-[transform,box-shadow,opacity] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:shadow-[0_0_20px_rgba(58,108,236,0.5)] active:scale-[0.96] disabled:opacity-40 disabled:shadow-none"
                >
                  {busy ? <Square className="h-4 w-4" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                </Button>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-muted-foreground">
              <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground">
                <ArrowLeft className="h-3 w-3" /> Back to home
              </Link>
              <span>Informational only · not financial advice</span>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
