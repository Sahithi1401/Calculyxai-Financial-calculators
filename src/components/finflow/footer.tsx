import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertTriangle,
  ShieldCheck,
  Lock,
  Eye,
  Sparkles,
  Activity,
  Mail,
  Github,
  Linkedin,
  Loader2,
  Check,
  ExternalLink,
} from "lucide-react";
import { FinFlowLogo } from "@/components/finflow/logo";
import { subscribeNewsletter } from "@/lib/finflow/newsletter.functions";
import { toast } from "sonner";
import { SupportPromise } from "@/components/finflow/support-promise";

const PRODUCT_LINKS = [
  { to: "/stocks", label: "Stocks" },
  { to: "/dashboard", label: "Portfolio" },
  { to: "/calculators", label: "Calculators" },
  { to: "/ai", label: "AI Copilot" },
  { to: "/calc/currency", label: "Currency Converter" },
  { to: "/investing-calculators", label: "Investing Tools" },
] as const;

const RESOURCE_LINKS = [
  { to: "/news", label: "Market Insights" },
  { to: "/market-data", label: "Market Data Sources" },
  { to: "/how-to-calculate-sip-returns", label: "SIP Returns Guide" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact Support" },
] as const;

const CALCULATOR_LINKS = [
  { to: "/calc/sip", label: "SIP Calculator" },
  { to: "/calc/home-loan", label: "Home Loan EMI" },
  { to: "/calc/mortgage", label: "Mortgage Calculator" },
  { to: "/calc/income-tax", label: "Income Tax Calculator" },
  { to: "/calc/gst", label: "GST Calculator" },
  { to: "/calc/salary", label: "Salary Take-Home" },
  { to: "/calc/fd", label: "FD Calculator" },
  { to: "/calc/compound-interest", label: "Compound Interest" },
  { to: "/calc/retirement", label: "Retirement Planner" },
  { to: "/calc/inflation", label: "Inflation Impact" },
  { to: "/calc/property", label: "Property Cost" },
] as const;

const COMPANY_LINKS = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
  { to: "/auth", label: "Sign In" },
] as const;


const LEGAL_LINKS = [
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/disclaimer", label: "Financial Disclaimer" },
  { to: "/ai-disclaimer", label: "AI Disclaimer" },
  { to: "/market-data", label: "Market Data" },
  { to: "/cookies", label: "Cookie Policy" },
  { to: "/copyright", label: "Copyright" },
  { to: "/acceptable-use", label: "Acceptable Use" },
  { to: "/ai-usage", label: "AI Usage Policy" },
  { to: "/security", label: "Security" },
] as const;

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Secure" },
  { icon: Lock, label: "SSL Protected" },
  { icon: Eye, label: "Privacy First" },
  { icon: Sparkles, label: "AI Powered" },
  { icon: Activity, label: "Real-time Data" },
] as const;

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border/60 bg-gradient-to-b from-transparent via-background/80 to-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Top: Brand + Newsletter */}
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <FinFlowLogo className="h-10 w-auto text-foreground" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              AI-powered financial intelligence platform helping investors analyze markets, plan finances, and make informed decisions.
            </p>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {TRUST_BADGES.map((b) => (
                <div
                  key={b.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur"
                >
                  <b.icon className="h-3.5 w-3.5 text-primary" aria-hidden />
                  <span>{b.label}</span>
                </div>
              ))}
            </div>

            {/* Product Hunt badge */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="https://www.producthunt.com/products/calculyx-ai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-calculyx-ai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Calculyx AI on Product Hunt"
                className="inline-block rounded-lg transition-transform hover:scale-[1.02]"
              >
                <img
                  alt="Calculyx AI - AI-powered stock market insights & financial calculators | Product Hunt"
                  width={250}
                  height={54}
                  loading="lazy"
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1198862&theme=light&t=1784276297869"
                />
              </a>
              <a
                href="https://sitepatent.com/?utm_source=calculyxai.online&utm_medium=badge"
                target="_blank"
                rel="nofollow noopener noreferrer"
                aria-label="Calculyx AI on SitePatent"
                className="inline-block rounded-lg transition-transform hover:scale-[1.02]"
              >
                <img
                  src="https://sitepatent.com/api/badge?style=classic"
                  alt="Calculyx AI verified on SitePatent"
                  height={54}
                  loading="lazy"
                  className="h-[54px] w-auto"
                />
              </a>
              <a
                href="https://findtop.tools/projects/calculyxai"
                target="_blank"
                rel="noopener noreferrer"
                title="Find Top Tools Top 2 Daily Winner"
                aria-label="Calculyx AI on Find Top Tools"
                className="inline-block rounded-lg transition-transform hover:scale-[1.02]"
              >
                <img
                  src="https://r2.direasy-multi-tenant.focusapps.app/uploads/616d0b1a-3979-4b8c-94d1-b4f1fedd3ead/1783046772211/bzmx0zi15su/top2-light.svg"
                  alt="Find Top Tools Top 2 Daily Winner"
                  width={195}
                  loading="lazy"
                  className="h-auto w-[195px]"
                />
              </a>

              <span className="text-xs text-muted-foreground">🚀 Featured on Product Hunt</span>
            </div>
          </div>

          {/* Newsletter */}
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-xl">
            <h3 className="text-base font-semibold text-foreground">Stay in the loop</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Weekly market insights, new calculators, and product updates. No spam.
            </p>
            <NewsletterForm />
            <SupportPromise variant="inline" className="mt-5 border-t border-border/50 pt-4" />
          </div>
        </div>

        {/* Middle: link columns */}
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <LinkColumn title="Product" links={PRODUCT_LINKS} />
          <LinkColumn title="Calculators" links={CALCULATOR_LINKS} />
          <LinkColumn title="Resources" links={RESOURCE_LINKS} />
          <LinkColumn title="Company" links={COMPANY_LINKS} />
          <LinkColumn title="Legal" links={LEGAL_LINKS} />

          {/* Legal disclaimer card */}
          <div className="rounded-2xl border border-warning/20 bg-warning/5 p-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" aria-hidden />
              <h3 className="text-sm font-semibold text-foreground">Financial Disclaimer</h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Calculyx AI provides educational and informational content only. Nothing on this platform constitutes financial, legal, tax, or investment advice. Always consult a licensed financial advisor before making investment decisions.
            </p>
            <Link
              to="/disclaimer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Read Full Disclaimer <ExternalLink className="h-3 w-3" aria-hidden />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Calculyx AI. Built for investors worldwide.
          </p>
          <div className="flex items-center gap-2">
            <SocialLink href="https://www.linkedin.com/company/calculyxai/" label="LinkedIn" icon={Linkedin} />
            <SocialLink href="https://github.com/" label="GitHub" icon={Github} />
            <SocialLink
              href="https://www.producthunt.com/products/calculyx-ai"
              label="Product Hunt"
              icon={ExternalLink}
            />
            <SocialLink href="mailto:balaji04@calculyxai.online" label="Email" icon={Mail} />
          </div>
        </div>
      </div>
    </footer>
  );
}

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ to: string; label: string }>;
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to as "/"}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-white/5 text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

function NewsletterForm() {
  const subscribe = useServerFn(subscribeNewsletter);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);

    const trimmed = email.trim();
    // Client-side validation (server validates too)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed) || trimmed.length > 254) {
      setState("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    if (/[<>"'`\\]/.test(trimmed)) {
      setState("error");
      setMessage("Email contains invalid characters.");
      return;
    }

    setState("loading");
    try {
      const res = await subscribe({ data: { email: trimmed, source: "footer", hp, t: startedAt } });
      if (res.ok) {
        setState("success");
        setMessage(
          res.alreadySubscribed
            ? "You're already subscribed — thanks!"
            : "Subscribed! Check your inbox for a welcome email.",
        );
        setEmail("");
        toast.success("Welcome to Calculyx AI");
        navigate({ to: "/thank-you", search: { source: "newsletter" } });
      } else {
        setState("error");
        setMessage(res.message);
      }
    } catch (err) {
      setState("error");
      setMessage((err as Error).message || "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative mt-4 space-y-2" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <div className="flex gap-2">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== "idle") setState("idle");
          }}
          disabled={state === "loading" || state === "success"}
          aria-label="Email address"
          className="flex-1 rounded-full border border-border/60 bg-background/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={state === "loading" || state === "success"}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#1AE1F3] to-[#346DF1] px-5 py-2.5 text-sm font-semibold text-[#0b0d17] shadow-elegant transition-all hover:brightness-110 disabled:opacity-70"
        >
          {state === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : state === "success" ? (
            <Check className="h-4 w-4" aria-hidden />
          ) : (
            "Subscribe"
          )}
        </button>
      </div>
      <AnimatePresence mode="wait">
        {message && (
          <motion.p
            key={message}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={`text-xs ${state === "error" ? "text-destructive" : "text-primary"}`}
            role={state === "error" ? "alert" : "status"}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
      <p className="text-[11px] text-muted-foreground/70">
        By subscribing, you agree to our{" "}
        <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
