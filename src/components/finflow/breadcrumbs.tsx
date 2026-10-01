import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { Crumb } from "@/lib/seo";

/**
 * Visible breadcrumb trail. Mirrors the BreadcrumbList JSON-LD emitted by
 * `pageHead({ crumbs })` so what Google parses matches what users see.
 * The last crumb is the current page and is rendered as plain text.
 */
export function Breadcrumbs({
  items,
  className = "",
}: {
  items: Crumb[];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <nav
      aria-label="Breadcrumb"
      className={`mx-auto max-w-7xl px-4 sm:px-6 text-xs text-muted-foreground ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />}
              {last ? (
                <span className="text-foreground/90" aria-current="page">
                  {c.name}
                </span>
              ) : (
                <Link to={c.path as "/"} className="transition-colors hover:text-primary">
                  {c.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
