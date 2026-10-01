import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

interface StatusShellProps {
  code?: string;
  kicker?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  icon?: ReactNode;
}

/**
 * Shared premium visual shell for status pages: 404, 500, offline, loading, empty.
 */
export function StatusShell({ code, kicker = "Status", title, description, actions, icon }: StatusShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-page-gradient">
      {/* ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-20%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute right-[-10%] bottom-[-15%] h-[420px] w-[420px] rounded-full bg-gold/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        {code && (
          <div
            className="font-display text-[6.5rem] font-semibold leading-none tracking-[-0.04em] text-transparent sm:text-[9rem]"
            style={{
              backgroundImage: "linear-gradient(180deg, hsl(var(--foreground)) 0%, hsl(var(--foreground) / 0.15) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            {code}
          </div>
        )}

        {icon && <div className="mb-4">{icon}</div>}

        <div className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          {kicker}
        </div>

        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>

        {description && (
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}

        {actions && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {actions}
          </div>
        )}

        <div className="mt-12 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/60">
          Calculyx AI · Financial Intelligence
        </div>
      </div>
    </div>
  );
}

export function StatusButton({ to, href, onClick, children, variant = "primary" }: {
  to?: string;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "ghost";
}) {
  const base = "inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] transition-all";
  const cls = variant === "primary"
    ? `${base} bg-foreground text-background hover:bg-foreground/90`
    : `${base} border border-border bg-muted/40 text-foreground/80 hover:bg-muted/60 hover:text-foreground`;
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  if (href) return <a href={href} className={cls}>{children}</a>;
  return <button onClick={onClick} className={cls}>{children}</button>;
}
