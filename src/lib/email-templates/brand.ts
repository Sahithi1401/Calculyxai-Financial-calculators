// Shared brand tokens for all Calculyx AI emails.
// Keep everything inline-safe (no external CSS) and email-client friendly.

export const BRAND = {
  primary: '#346DF1',
  primaryDark: '#1A4CB7',
  accent: '#1AE1F3',
  ink: '#0B0D17',
  body: '#3A3F4B',
  muted: '#6B7280',
  softBg: '#F4F7FF',
  border: '#E4EBFB',
  softBorder: '#DCE6FA',
  buttonGradient: 'linear-gradient(120deg,#1AE1F3 0%,#346DF1 100%)',
}

// Email-safe font stacks. Clients that support web fonts (Apple Mail, iOS Mail,
// Gmail app on iOS) will use Inter / Space Grotesk from the <link> in <Head />.
// Everywhere else falls back through the native system UI stack.
export const FONT_BODY =
  '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
export const FONT_DISPLAY =
  '"Space Grotesk", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'

export const styles = {
  main: {
    backgroundColor: '#ffffff',
    fontFamily: FONT_BODY,
    color: BRAND.ink,
    margin: 0,
    padding: 0,
    WebkitFontSmoothing: 'antialiased' as const,
    MozOsxFontSmoothing: 'grayscale' as const,
  },
  container: { padding: '32px 28px', maxWidth: '580px', margin: '0 auto' },
  eyebrow: {
    fontFamily: FONT_DISPLAY,
    fontSize: '11px',
    fontWeight: 700 as const,
    letterSpacing: '3px',
    color: BRAND.primary,
    margin: '0 0 10px',
    textTransform: 'uppercase' as const,
  },
  h1: {
    fontFamily: FONT_DISPLAY,
    fontSize: '28px',
    fontWeight: 600 as const,
    color: BRAND.ink,
    lineHeight: '1.22',
    margin: '0 0 14px',
    letterSpacing: '-0.02em',
  },
  text: {
    fontSize: '15px',
    color: BRAND.body,
    lineHeight: '1.65',
    margin: '0 0 16px',
  },
  ctaWrap: {
    background: BRAND.softBg,
    border: `1px solid ${BRAND.softBorder}`,
    borderRadius: '16px',
    padding: '24px',
    margin: '24px 0',
    textAlign: 'center' as const,
  },
  button: {
    // Gradient render on Gmail/Outlook — most clients fall back to solid primary.
    background: BRAND.buttonGradient,
    backgroundColor: BRAND.primary,
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: 700 as const,
    borderRadius: '999px',
    padding: '14px 28px',
    textDecoration: 'none',
    display: 'inline-block',
    letterSpacing: '0.2px',
  },
  hint: {
    fontSize: '12px',
    color: BRAND.muted,
    lineHeight: '1.5',
    margin: '14px 0 0',
    wordBreak: 'break-all' as const,
  },
  divider: { borderColor: BRAND.border, margin: '28px 0' },
  link: { color: BRAND.primary, textDecoration: 'underline' },
  footer: {
    fontSize: '12px',
    color: BRAND.muted,
    lineHeight: '1.6',
    margin: '10px 0 0',
  },
  signature: {
    fontSize: '14px',
    fontWeight: 600 as const,
    color: BRAND.ink,
    margin: '4px 0 0',
  },
  codeBox: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: '26px',
    fontWeight: 700 as const,
    letterSpacing: '6px',
    color: BRAND.ink,
    background: BRAND.softBg,
    border: `1px solid ${BRAND.softBorder}`,
    borderRadius: '12px',
    padding: '16px 20px',
    textAlign: 'center' as const,
    margin: '0 0 20px',
  },
}
