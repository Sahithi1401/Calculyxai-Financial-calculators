import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next, request }) => {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/lovable/")) {
    return next();
  }
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Enterprise-grade security headers applied to every response.
const securityHeadersMiddleware = createMiddleware().server(async ({ next, request }) => {
  const response = await next();
  const res = response as unknown as Response;
  if (!res || typeof (res as Response).headers?.set !== "function") return response;

  const url = new URL(request.url);
  const isHtml = (res.headers.get("content-type") ?? "").includes("text/html");

  // Transport & framing
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-DNS-Prefetch-Control", "on");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(self), geolocation=(), payment=(), usb=(), interest-cohort=()",
  );
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  res.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  // Content Security Policy — HTML documents only (avoid breaking JSON/asset requests).
  if (isHtml && !url.pathname.startsWith("/api/")) {
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      // Vite/TanStack inject a small inline bootstrap; allow it plus trusted CDNs.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://cdn.jsdelivr.net https://img.logo.dev",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' data: blob:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.groq.com https://finnhub.io https://api.resend.com https://stock.indianapi.in https://*.logo.dev",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; ");
    res.headers.set("Content-Security-Policy", csp);
  }

  return response;
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware, securityHeadersMiddleware],
}));
