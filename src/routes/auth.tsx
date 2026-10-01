import { pageHead } from "@/lib/seo";
import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

import { SignInPage, type Testimonial, type AuthMethod, type PhoneStage } from "@/components/ui/sign-in";

function isSafeNext(v: unknown): v is string {
  return typeof v === "string" && v.startsWith("/") && !v.startsWith("//");
}

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): { next?: string } =>
    isSafeNext(s.next) ? { next: s.next } : {},
  head: () =>
    pageHead({
      title: "Sign In or Create Account — Calculyx AI",
      description:
        "Sign in to Calculyx AI with email, phone or Google to save calculations, track your portfolio, export premium PDF reports and unlock the AI copilot.",
      path: "/auth",
      crumbs: [{ name: "Home", path: "/" }, { name: "Sign In", path: "/auth" }],
      noindex: true,
    }),
  beforeLoad: async ({ search }) => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      if (search.next) throw redirect({ href: search.next });
      throw redirect({ to: "/dashboard" });
    }
  },
  component: AuthPage,
});


const testimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Sarah Chen",
    handle: "@sarahdigital",
    text: "Calculyx made my SIP planning effortless — the AI insights are on point.",
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Marcus Johnson",
    handle: "@marcustech",
    text: "One-click, PDF-ready reports across every calculator. Exactly what I needed.",
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "David Martinez",
    handle: "@davidcreates",
    text: "The stock hub and calculators together are unreal. Best fintech tool I use.",
  },
];

function normalizePhone(raw: string) {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/[^\d]/g, "");
  if (trimmed.startsWith("+")) return "+" + digits;
  return digits ? "+" + digits : "";
}

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const postAuthTarget = next ?? "/dashboard";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [method, setMethod] = useState<AuthMethod>("email");
  const [phoneStage, setPhoneStage] = useState<PhoneStage>("request");
  const [pendingPhone, setPendingPhone] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        if (next) window.location.href = next;
        else navigate({ to: "/dashboard" });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, next]);


  const requireTerms = () => {
    if (!termsAccepted) {
      toast.error("Please accept the Terms & Conditions to continue.");
      return false;
    }
    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!requireTerms()) return;
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    const phone = String(fd.get("phone") || "");
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: window.location.origin + postAuthTarget,
            data: phone.trim() ? { phone: phone.trim() } : undefined,
          },
        });

        if (error) throw error;
        toast.success("Account created — check your inbox to confirm.");
        navigate({ to: "/thank-you", search: { source: "signup" } });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Auth failed");
    } finally { setLoading(false); }
  };

  const handlePhoneRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!requireTerms()) return;
    const fd = new FormData(e.currentTarget);
    const dial = String(fd.get("dial") || "").trim();
    const national = String(fd.get("phone") || "").replace(/[^\d]/g, "");
    const phone = normalizePhone(`${dial}${national}`);
    if (phone.replace(/\D/g, "").length < 7) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
      setPendingPhone(phone);
      setPhoneStage("verify");
      toast.success("Code sent — check your messages.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send code");
    } finally { setLoading(false); }
  };


  const handlePhoneVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const token = String(fd.get("token") || "").trim();
    if (token.length !== 6) {
      toast.error("Enter the 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ phone: pendingPhone, token, type: "sms" });
      if (error) throw error;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid or expired code");
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    if (!requireTerms()) return;
    setLoading(true);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + postAuthTarget });
    if (res.error) { toast.error(res.error.message); setLoading(false); }
  };

  return (
    <SignInPage
      testimonials={testimonials}
      mode={mode}
      method={method}
      phoneStage={phoneStage}
      loading={loading}
      termsAccepted={termsAccepted}
      onTermsChange={setTermsAccepted}
      onMethodChange={(m) => {
        setMethod(m);
        setPhoneStage("request");
      }}
      onEmailSubmit={handleEmailSubmit}
      onPhoneRequest={handlePhoneRequest}
      onPhoneVerify={handlePhoneVerify}
      onPhoneReset={() => { setPhoneStage("request"); setPendingPhone(""); }}
      onGoogleSignIn={handleGoogle}
      onResetPassword={() => toast.info("Password reset link will be emailed shortly.")}
      onCreateAccount={() => { setMode(mode === "signup" ? "signin" : "signup"); setPhoneStage("request"); }}
    />
  );
}
