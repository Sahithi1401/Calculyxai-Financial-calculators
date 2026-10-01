import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(5)
  .max(254)
  .email("Please enter a valid email address")
  .refine((v) => !/[<>"'`\\]/.test(v), "Invalid characters");

const input = z.object({
  email: emailSchema,
  source: z.string().trim().max(40).optional(),
  hp: z.string().max(200).optional(),
  t: z.number().optional(),
});

type Result =
  | { ok: true; alreadySubscribed: boolean }
  | { ok: false; code: "invalid" | "duplicate" | "rate_limited" | "server_error"; message: string };

/**
 * Public newsletter signup. Anyone can call this (no auth). Writes to
 * public.newsletter_subscribers via the anon-INSERT RLS policy and fires the
 * welcome email through Resend when configured.
 */
export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => input.parse(d))
  .handler(async ({ data }): Promise<Result> => {
    const { guardForm } = await import("./spam-guard.server");
    const g = guardForm({ scope: "newsletter", honeypot: data.hp, startedAt: data.t, limit: 5, windowMs: 10 * 60_000 });
    if (g === "bot") return { ok: true, alreadySubscribed: true };
    if (g === "rate_limited") return { ok: false, code: "rate_limited", message: "Too many attempts. Please try again in a few minutes." };
    const url = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !anonKey) {
      return { ok: false, code: "server_error", message: "Newsletter is not configured." };
    }

    // Insert via PostgREST as anon; RLS allows anon INSERT only.
    const insertRes = await fetch(`${url}/rest/v1/newsletter_subscribers`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        "Content-Type": "application/json",
        Prefer: "return=representation,resolution=ignore-duplicates",
      },
      body: JSON.stringify({ email: data.email, source: data.source ?? "footer" }),
    });

    if (insertRes.status === 409 || insertRes.status === 200) {
      // Duplicate email — treat as idempotent success but don't re-send welcome mail.
      return { ok: true, alreadySubscribed: true };
    }

    if (!insertRes.ok) {
      const body = await insertRes.text().catch(() => "");
      console.error("[newsletter] insert failed", insertRes.status, body.slice(0, 300));
      // Unique-violation surfaced as 400/23505 from PostgREST in some cases
      if (/23505|duplicate/i.test(body)) {
        return { ok: true, alreadySubscribed: true };
      }
      return { ok: false, code: "server_error", message: "Couldn't sign you up. Please try again." };
    }

    // Fire welcome email (best-effort; do not fail signup if Resend errors).
    await sendWelcomeMail(data.email).catch((e) =>
      console.warn("[newsletter] welcome mail failed", (e as Error).message),
    );

    return { ok: true, alreadySubscribed: false };
  });

async function sendWelcomeMail(to: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const from = process.env.RESEND_FROM ?? "Calculyx AI <onboarding@resend.dev>";

  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#0b0d17;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#e6ecff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0d17;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0f1424;border-radius:20px;overflow:hidden;border:1px solid #1e2540;">
        <tr><td style="background:linear-gradient(120deg,#1AE1F3 0%,#346DF1 100%);padding:28px 32px;color:#0b0d17;">
          <div style="font-size:22px;font-weight:800;letter-spacing:-0.02em;">Calculyx AI</div>
          <div style="opacity:.85;font-size:14px;margin-top:4px;">AI-powered financial intelligence</div>
        </td></tr>
        <tr><td style="padding:32px;">
          <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#ffffff;">You're on the list 🎉</h1>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#c1cbe6;">
            Thanks for subscribing to Calculyx AI. You'll get concise market insights, new calculator drops, and product updates — no spam, unsubscribe any time.
          </p>
          <a href="https://calculyxai.online/calculators" style="display:inline-block;background:linear-gradient(120deg,#1AE1F3,#346DF1);color:#0b0d17;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:700;font-size:14px;">Explore calculators →</a>
          <p style="margin:24px 0 0;font-size:12px;color:#7c88a8;">Educational content only — not financial advice.</p>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Welcome to Calculyx AI",
      html,
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    console.warn("[newsletter] resend", res.status, t.slice(0, 200));
  }
}
