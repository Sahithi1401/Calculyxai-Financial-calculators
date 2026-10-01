import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/**
 * Premium empty state placeholder for lists, tables, dashboards.
 * Uses semantic tokens so it looks correct in both themes.
 */
export function EmptyState({ icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center ${className}`}
    >
      <div className="grid h-14 w-14 place-items-center rounded-2xl border border-border bg-muted/60 text-muted-foreground">
        {icon ?? <Inbox className="h-6 w-6" strokeWidth={1.5} />}
      </div>
      <div className="mt-5 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
        Nothing here yet
      </div>
      <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
