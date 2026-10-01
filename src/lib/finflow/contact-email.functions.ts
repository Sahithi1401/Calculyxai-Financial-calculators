import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const RESEND_URL = "https://api.resend.com/emails";
const OWNER_EMAIL = "balaji04@calculyxai.online";

const input = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(4000),
  hp: z.string().max(200).optional(),
  t: z.number().optional(),
});

export const sendContactEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => input.parse(data))
  .handler(async ({ data }) => {
    const { guardForm } = await import("./spam-guard.server");
    const g = guardForm({ scope: "contact", honeypot: data.hp, startedAt: data.t, limit: 3, windowMs: 10 * 60_000, minFillMs: 3000 });
    if (g === "bot") return { sent: true, reason: "ok" as const };
    if (g === "rate_limited") return { sent: false, reason: "rate_limited" as const };
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.warn("[contact-email] missing RESEND_API_KEY");
      return { sent: false, reason: "not_configured" as const };
    }

    const from = process.env.RESEND_FROM ?? "Calculyx AI <onboarding@resend.dev>";

    const html = `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a;background:#f5f7fb;padding:24px;">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:28px;box-shadow:0 4px 24px rgba(9,37,80,0.08);">
        <h2 style="margin:0 0 16px;color:#092550;">New contact message</h2>
        <p style="margin:4px 0;"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p style="margin:4px 0;"><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p style="margin:4px 0;"><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;" />
        <p style="white-space:pre-wrap;line-height:1.6;color:#334155;">${escapeHtml(data.message)}</p>
      </div>
    </body></html>`;

    const text = `New contact message\n\nName: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\n\n${data.message}`;

    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from,
        to: [OWNER_EMAIL],
        reply_to: data.email,
        subject: `[Calculyx Contact] ${data.subject}`,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[contact-email] resend failed [${res.status}]: ${body}`);
      return { sent: false, reason: "provider_error" as const, status: res.status };
    }

    return { sent: true as const };
  });

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
