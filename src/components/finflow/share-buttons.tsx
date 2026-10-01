import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden focusable="false">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden focusable="false">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12M7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden focusable="false">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97s-.47-.15-.67.15-.77.96-.94 1.16-.35.22-.65.07a8.1 8.1 0 0 1-2.39-1.48 9 9 0 0 1-1.65-2.06c-.17-.3-.02-.46.13-.61s.3-.35.45-.52.2-.3.3-.5a.55.55 0 0 0-.03-.52c-.07-.15-.67-1.61-.92-2.2s-.49-.5-.67-.51h-.57a1.1 1.1 0 0 0-.8.37 3.35 3.35 0 0 0-1.04 2.48 5.8 5.8 0 0 0 1.22 3.09 13.3 13.3 0 0 0 5.1 4.5c.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.41s.25-1.29.18-1.42-.28-.2-.58-.34M12.05 21.8h-.02a9.8 9.8 0 0 1-4.98-1.36l-.36-.21-3.7.97.99-3.61-.24-.37a9.8 9.8 0 0 1-1.5-5.23A9.82 9.82 0 0 1 18.99 5.1a9.7 9.7 0 0 1 2.87 6.9 9.82 9.82 0 0 1-9.81 9.8M20.46 3.55A12.2 12.2 0 0 0 11.99 0 12.06 12.06 0 0 0 1.52 18.06L0 24l6.08-1.6a12 12 0 0 0 5.9 1.51h.01A12.06 12.06 0 0 0 24 11.99a12 12 0 0 0-3.54-8.44" />
    </svg>
  );
}

const btn =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-border/60 bg-white/5 px-3 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Share controls for calculator results and news articles.
 * Falls back to `window.location.href` when no explicit URL is supplied.
 */
export function ShareButtons({
  title,
  url,
  text,
  label = "Share this",
  className = "",
}: {
  title: string;
  url?: string;
  text?: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const resolve = () =>
    url ?? (typeof window !== "undefined" ? window.location.href : "https://calculyxai.online");

  const open = (href: string) => {
    if (typeof window !== "undefined") window.open(href, "_blank", "noopener,noreferrer");
  };

  const shareText = text ?? title;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-muted-foreground">
        <Share2 className="h-3.5 w-3.5" aria-hidden />
        {label}
      </span>

      <button
        type="button"
        className={btn}
        aria-label={`Share "${title}" on X`}
        onClick={() =>
          open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(resolve())}`,
          )
        }
      >
        <XIcon className="h-3.5 w-3.5" />X
      </button>

      <button
        type="button"
        className={btn}
        aria-label={`Share "${title}" on LinkedIn`}
        onClick={() =>
          open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(resolve())}`)
        }
      >
        <LinkedInIcon className="h-3.5 w-3.5" />
        LinkedIn
      </button>

      <button
        type="button"
        className={btn}
        aria-label={`Share "${title}" on WhatsApp`}
        onClick={() =>
          open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${resolve()}`)}`)
        }
      >
        <WhatsAppIcon className="h-3.5 w-3.5" />
        WhatsApp
      </button>

      <button
        type="button"
        className={btn}
        aria-label="Copy link to clipboard"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(resolve());
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          } catch {
            /* clipboard unavailable */
          }
        }}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
