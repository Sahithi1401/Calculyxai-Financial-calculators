import { createServerFn } from '@tanstack/react-start'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

/**
 * Sends the Calculyx AI welcome email once per user (idempotent by profile flag).
 * Called after any successful sign-in — new users get the email, returning users
 * are a no-op. Works for both password and Google OAuth flows because the auth
 * middleware trusts the session bearer token, regardless of provider.
 */
export const sendWelcomeIfNew = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId, claims } = context

    // Read the flag under the user's own RLS.
    const { data: profile, error: readErr } = await supabase
      .from('profiles')
      .select('id, email, display_name, welcomed_at')
      .eq('id', userId)
      .maybeSingle()

    if (readErr) {
      console.error('[welcome] profile read failed', readErr.message)
      return { sent: false as const, reason: 'profile_read_failed' as const }
    }

    if (profile?.welcomed_at) {
      return { sent: false as const, reason: 'already_welcomed' as const }
    }

    // Resolve recipient from profile → claims fallback. Google OAuth users
    // always have email in claims.
    const to =
      profile?.email ||
      (typeof claims.email === 'string' ? claims.email : undefined)
    if (!to) {
      return { sent: false as const, reason: 'no_recipient' as const }
    }

    const displayName =
      (profile?.display_name && profile.display_name.trim()) ||
      (typeof claims.email === 'string' ? claims.email.split('@')[0] : undefined)

    // Send via Lovable's managed email API — same fast path used for auth emails.
    let sent = false
    try {
      const { sendTemplateEmail } = await import('@/lib/email-templates/send-email')
      // Idempotency key rotates per attempt: a failed send with a given key
      // is permanently locked at the provider (409), so retries MUST use a
      // fresh key. Duplicate-send protection still comes from the
      // profiles.welcomed_at flag set below.
      const result = await sendTemplateEmail('welcome', to, {
        templateData: { name: displayName },
        idempotencyKey: `welcome-${userId}-${Date.now()}-${crypto.randomUUID()}`,
      })
      sent = result.sent
    } catch (e) {
      console.error('[welcome] send failed', (e as Error).message)
      // Fall through and still mark the flag? No — leave it so a retry can send.
      return { sent: false as const, reason: 'send_failed' as const }
    }

    if (sent) {
      const { error: updErr } = await supabase
        .from('profiles')
        .update({ welcomed_at: new Date().toISOString() })
        .eq('id', userId)
      if (updErr) {
        console.warn('[welcome] flag update failed', updErr.message)
      }
    }

    return { sent, reason: sent ? ('ok' as const) : ('suppressed' as const) }
  })
