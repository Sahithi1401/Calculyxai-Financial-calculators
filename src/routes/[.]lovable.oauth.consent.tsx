import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Minimal typed wrapper for the beta supabase.auth.oauth namespace.
type OAuthClient = { name?: string; redirect_uri?: string };
type AuthorizationDetails = {
  client?: OAuthClient;
  scope?: string;
  redirect_url?: string;
  redirect_to?: string;
} | null;
type OAuthResult = { redirect_url?: string; redirect_to?: string };
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: AuthorizationDetails; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: OAuthResult | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: OAuthResult | null; error: { message: string } | null }>;
};
function oauth(): OAuthApi {
  const authApi = supabase.auth as unknown as { oauth: OAuthApi };
  return authApi.oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/auth", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="min-h-screen flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-3">
        <h1 className="text-2xl font-semibold">Could not load this authorization request</h1>
        <p className="text-sm text-muted-foreground">{String((error as Error)?.message ?? error)}</p>
      </div>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientName = details?.client?.name ?? "an external app";
  const redirectHost = (() => {
    const uri = details?.client?.redirect_uri;
    if (!uri) return null;
    try { return new URL(uri).host; } catch { return uri; }
  })();

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (error) { setBusy(false); setError(error.message); return; }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) { setBusy(false); setError("No redirect returned by the authorization server."); return; }
    window.location.href = target;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Calculyx AI · Authorization</p>
          <h1 className="text-2xl font-semibold">Connect {clientName} to your Calculyx account</h1>
          <p className="text-sm text-muted-foreground">
            {clientName} will be able to call Calculyx's enabled tools while you are signed in — run investing
            calculators, fetch stock quotes, and read your portfolio and holdings. This does not bypass Calculyx's
            permissions or backend policies.
          </p>
          {redirectHost && (
            <p className="text-xs text-muted-foreground">Will redirect to <span className="font-mono">{redirectHost}</span></p>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => decide(true)}
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Working…" : "Approve"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => decide(false)}
            className="flex-1 rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm font-medium disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}
