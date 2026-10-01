import React, { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Mail, Phone, ShieldCheck, Sparkles, TrendingUp, Lock, ChevronDown } from "lucide-react";
import gsap from "gsap";
import { FinFlowLogo } from "@/components/finflow/logo";
import { DIAL_CODES } from "@/lib/country-dial-codes";
import { cn } from "@/lib/utils";


const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

export type AuthMethod = "email" | "phone";
export type PhoneStage = "request" | "verify";

interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  testimonials?: Testimonial[];
  mode?: "signin" | "signup";
  method?: AuthMethod;
  phoneStage?: PhoneStage;
  loading?: boolean;
  termsAccepted?: boolean;
  onTermsChange?: (accepted: boolean) => void;
  onMethodChange?: (method: AuthMethod) => void;
  onEmailSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onPhoneRequest?: (e: React.FormEvent<HTMLFormElement>) => void;
  onPhoneVerify?: (e: React.FormEvent<HTMLFormElement>) => void;
  onPhoneReset?: () => void;
  onGoogleSignIn?: () => void;
  onResetPassword?: () => void;
  onCreateAccount?: () => void;
}

const FieldShell = ({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="group relative flex items-center rounded-xl border border-border/70 bg-card/60 backdrop-blur-sm transition-all focus-within:border-primary/70 focus-within:bg-card/90 focus-within:ring-2 focus-within:ring-primary/20 hover:border-border">
    {icon && <span className="pl-3.5 text-muted-foreground/70 group-focus-within:text-primary">{icon}</span>}
    {children}
  </div>
);

export const SignInPage: React.FC<SignInPageProps> = ({
  title,
  description,
  testimonials = [],
  mode = "signin",
  method = "email",
  phoneStage = "request",
  loading = false,
  termsAccepted = false,
  onTermsChange,
  onMethodChange,
  onEmailSubmit,
  onPhoneRequest,
  onPhoneVerify,
  onPhoneReset,
  onGoogleSignIn,
  onResetPassword,
  onCreateAccount,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [dial, setDial] = useState("+91");
  const canProceed = termsAccepted;


  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans text-foreground">
      {/* Ambient gradient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-[-10%] h-[38rem] w-[38rem] rounded-full bg-primary/25 blur-[140px]" />
        <div className="absolute -right-24 bottom-[-15%] h-[42rem] w-[42rem] rounded-full bg-cyan-500/20 blur-[160px]" />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.22]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(from var(--foreground) l c h / 0.08) 1px, transparent 1px), linear-gradient(90deg, oklch(from var(--foreground) l c h / 0.08) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, #000 30%, transparent 85%)",
          }}
        />
      </div>

      <div className="mx-auto flex min-h-screen max-w-[1400px] items-center justify-center p-4 sm:p-6 lg:p-10">
        {/* Framed split-panel card */}
        <div
          className="relative grid w-full overflow-hidden rounded-[28px] border border-border/60 bg-card/40 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)] backdrop-blur-xl lg:grid-cols-[1.05fr_1fr]"
          style={{ opacity: 0, transform: "translateY(24px)", animation: "fadeSlideIn 0.9s ease-out forwards" }}
        >
          {/* Left: form */}
          <section className="relative flex items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-md">
              <div className="mb-8 flex items-center gap-2">
                <FinFlowLogo className="h-8 w-auto text-foreground" />
              </div>

              <div className="mb-1.5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
                <Sparkles className="h-3 w-3 text-primary" />
                {mode === "signup" ? "Get started" : "Welcome back"}
              </div>

              <h1 className="mt-3 font-display text-4xl font-normal leading-[0.98] tracking-[-0.035em] sm:text-5xl">
                {title ?? (mode === "signup" ? (
                  <><span className="block">Create your</span><span className="block italic text-primary" style={{ fontFamily: "var(--font-serif)" }}>account</span></>
                ) : (
                  <><span className="block">Sign in to</span><span className="block italic text-primary" style={{ fontFamily: "var(--font-serif)" }}>Calculyx</span></>
                ))}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {description ?? (mode === "signup"
                  ? "Save calculations, sync devices, and unlock AI insights."
                  : "Access your dashboard, saved analyses, and AI reports.")}
              </p>

              {/* Method tabs */}
              <div className="mt-7 grid grid-cols-2 gap-1 rounded-2xl border border-border/60 bg-muted/40 p-1 backdrop-blur-sm">
                {(["email", "phone"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onMethodChange?.(m)}
                    className={cn(
                      "relative flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                      method === m
                        ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {m === "email" ? <Mail className="h-3.5 w-3.5" /> : <Phone className="h-3.5 w-3.5" />}
                    {m === "email" ? "Email" : "Phone"}
                  </button>
                ))}
              </div>


              {/* Email form */}
              {method === "email" && (
                <form className="mt-5 space-y-3.5" onSubmit={onEmailSubmit}>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email address</label>
                    <FieldShell icon={<Mail className="h-4 w-4" />}>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full bg-transparent px-3 py-3 text-sm focus:outline-none"
                      />
                    </FieldShell>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Password</label>
                    <FieldShell icon={<Lock className="h-4 w-4" />}>
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        placeholder="••••••••"
                        className="w-full bg-transparent px-3 py-3 pr-11 text-sm focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </FieldShell>
                  </div>

                  {mode === "signup" && (
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Phone (optional)</label>
                      <FieldShell icon={<Phone className="h-4 w-4" />}>
                        <input
                          name="phone"
                          type="tel"
                          placeholder="+1 555 123 4567"
                          className="w-full bg-transparent px-3 py-3 text-sm focus:outline-none"
                        />
                      </FieldShell>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-sm">
                    <label className="flex items-center gap-2 text-muted-foreground">
                      <input type="checkbox" name="remember" className="h-4 w-4 rounded border-border accent-primary" />
                      Remember me
                    </label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => onResetPassword?.()}
                        className="text-primary transition-colors hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>

                  <TermsBox termsAccepted={termsAccepted} onTermsChange={onTermsChange} />

                  <PrimaryButton loading={loading} canProceed={canProceed}>
                    {mode === "signup" ? "Create account" : "Sign in"}
                  </PrimaryButton>
                </form>
              )}

              {/* Phone OTP */}
              {method === "phone" && phoneStage === "request" && (
                <form className="mt-5 space-y-3.5" onSubmit={onPhoneRequest}>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Phone number</label>
                    <div className="group relative flex items-stretch rounded-xl border border-border/70 bg-card/60 backdrop-blur-sm transition-all focus-within:border-primary/70 focus-within:bg-card/90 focus-within:ring-2 focus-within:ring-primary/20 hover:border-border">
                      <div className="relative flex items-center border-r border-border/60 pl-3 pr-1 text-muted-foreground group-focus-within:text-primary">
                        <Phone className="h-4 w-4" />
                        <select
                          name="dial"
                          value={dial}
                          onChange={(e) => setDial(e.target.value)}
                          aria-label="Country dial code"
                          className="appearance-none bg-transparent pl-2 pr-6 py-3 text-sm font-medium text-foreground focus:outline-none cursor-pointer max-w-[7.5rem]"
                        >
                          {DIAL_CODES.map((c) => (
                            <option key={c.code} value={c.dial} className="bg-background text-foreground">
                              {c.flag} {c.dial} {c.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-1.5 h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <input
                        name="phone"
                        type="tel"
                        required
                        inputMode="numeric"
                        placeholder="555 123 4567"
                        className="w-full bg-transparent px-3 py-3 text-sm focus:outline-none"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">Pick your country, then enter your number. We'll text you a 6-digit code.</p>
                  </div>

                  <TermsBox termsAccepted={termsAccepted} onTermsChange={onTermsChange} />

                  <PrimaryButton loading={loading} canProceed={canProceed}>Send verification code</PrimaryButton>
                </form>
              )}


              {method === "phone" && phoneStage === "verify" && (
                <form className="mt-5 space-y-3.5" onSubmit={onPhoneVerify}>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Verification code</label>
                    <FieldShell icon={<ShieldCheck className="h-4 w-4" />}>
                      <input
                        name="token"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        required
                        placeholder="123456"
                        className="w-full bg-transparent px-3 py-3 text-sm tracking-[0.5em] focus:outline-none"
                      />
                    </FieldShell>
                    <button
                      type="button"
                      onClick={() => onPhoneReset?.()}
                      className="mt-2 text-xs text-primary hover:underline"
                    >
                      Use a different number
                    </button>
                  </div>

                  <PrimaryButton loading={loading} canProceed={canProceed}>Verify & continue</PrimaryButton>
                </form>
              )}

              <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <div className="h-px flex-1 bg-border/70" />
                or
                <div className="h-px flex-1 bg-border/70" />
              </div>

              <button
                type="button"
                onClick={onGoogleSignIn}
                disabled={loading || !canProceed}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/70 bg-card/60 py-3 text-sm font-medium backdrop-blur-sm transition hover:bg-card hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                title={!canProceed ? "Accept the terms to continue" : undefined}
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "signup" ? "Already have an account?" : "New to Calculyx AI?"}{" "}
                <button
                  type="button"
                  onClick={() => onCreateAccount?.()}
                  className="font-medium text-primary hover:underline"
                >
                  {mode === "signup" ? "Sign in" : "Create account"}
                </button>
              </p>
            </div>
          </section>

          {/* Right: showcase */}
          <ShowcasePanel testimonials={testimonials} />
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbitReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

function TermsBox({ termsAccepted, onTermsChange }: { termsAccepted?: boolean; onTermsChange?: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
      <input
        type="checkbox"
        checked={!!termsAccepted}
        onChange={(e) => onTermsChange?.(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
      />
      <span>
        I agree to the{" "}
        <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Terms</a>,{" "}
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy</a>, and{" "}
        <a href="/disclaimer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Financial Disclaimer</a>.
      </span>
    </label>
  );
}

function PrimaryButton({
  loading,
  canProceed,
  children,
}: {
  loading?: boolean;
  canProceed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading || !canProceed}
      className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary via-primary to-primary/85 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative">
        {loading ? "Please wait…" : !canProceed ? "Accept the terms to continue" : children}
      </span>
    </button>
  );
}

function ShowcasePanel({ testimonials }: { testimonials: Testimonial[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ringsRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
      );
      gsap.fromTo(
        ".trust-avatar",
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, delay: 0.4, ease: "back.out(1.8)" },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (testimonials.length < 2) return;
    const id = setInterval(() => {
      gsap.to(quoteRef.current, {
        opacity: 0,
        y: -8,
        duration: 0.35,
        onComplete: () => {
          setI((prev) => (prev + 1) % testimonials.length);
          gsap.fromTo(quoteRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 });
        },
      });
    }, 5200);
    return () => clearInterval(id);
  }, [testimonials.length]);

  const t = testimonials[i];

  return (
    <section
      ref={rootRef}
      className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 lg:block"
    >
      {/* Aurora */}
      <div className="absolute -left-24 top-1/4 h-[28rem] w-[28rem] rounded-full bg-primary/40 blur-[120px]" />
      <div className="absolute -right-16 bottom-1/4 h-[26rem] w-[26rem] rounded-full bg-cyan-500/30 blur-[120px]" />

      {/* Orbital trust rings */}
      <div ref={ringsRef} className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2">
        {[220, 300, 380, 460].map((size, idx) => (
          <div
            key={size}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
            style={{
              width: size,
              height: size,
              animation: `${idx % 2 === 0 ? "orbit" : "orbitReverse"} ${40 + idx * 15}s linear infinite`,
            }}
          >
            {/* Avatars scattered on the ring */}
            {testimonials.slice(0, 3).map((tt, j) => {
              const angle = (j / 3) * 360 + idx * 45;
              const rad = (angle * Math.PI) / 180;
              const r = size / 2;
              return (
                <img
                  key={`${size}-${j}`}
                  src={tt.avatarSrc}
                  alt=""
                  className="trust-avatar absolute h-10 w-10 rounded-full border-2 border-white/30 object-cover shadow-lg"
                  style={{
                    left: `calc(50% + ${Math.cos(rad) * r}px - 20px)`,
                    top: `calc(50% + ${Math.sin(rad) * r}px - 20px)`,
                    animation: `${idx % 2 === 0 ? "orbitReverse" : "orbit"} ${40 + idx * 15}s linear infinite`,
                  }}
                />
              );
            })}
          </div>
        ))}
        {/* Center logo */}
        <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl">
          <FinFlowLogo className="h-8 w-auto text-white" />
        </div>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-white/80">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Trusted by 12,000+ investors
        </div>

        <div className="max-w-md">
          <div className="mb-4 flex items-center gap-1.5 text-amber-300">
            {[0, 1, 2, 3, 4].map((s) => (
              <svg key={s} viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M12 17.3l-6.16 3.7 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63L22 9.24l-5.48 4.73 1.64 7.03z" />
              </svg>
            ))}
          </div>
          {t && (
            <div ref={quoteRef}>
              <p className="font-display text-2xl font-medium leading-snug tracking-tight text-white">
                "{t.text}"
              </p>
              <div className="mt-5 flex items-center gap-3">
                <img src={t.avatarSrc} alt={t.name} className="h-11 w-11 rounded-full border border-white/20 object-cover" />
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-white/60">{t.handle}</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

function TrustStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-white/60">
        {icon}
        {label}
      </div>
      <div className="mt-1 font-mono text-sm font-semibold tabular-nums text-white">{value}</div>
    </div>
  );
}
