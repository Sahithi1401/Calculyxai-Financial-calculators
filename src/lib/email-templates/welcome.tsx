import * as React from 'react'
import {
  Body, Button, Container, Font, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from '@react-email/components'
import { LogoHeader } from './logo-header'
import { styles, BRAND } from './brand'
import type { TemplateEntry } from './registry'

interface WelcomeEmailProps {
  name?: string
  siteUrl?: string
}

const SITE_URL = 'https://calculyxai.online/'

export const WelcomeEmail = ({ name, siteUrl = SITE_URL }: WelcomeEmailProps) => {
  const displayName = (name && name.trim()) || 'there'
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily={['Helvetica', 'Arial', 'sans-serif']}
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Inter"
          fallbackFontFamily={['Helvetica', 'Arial', 'sans-serif']}
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.woff2',
            format: 'woff2',
          }}
          fontWeight={600}
          fontStyle="normal"
        />
        <Font
          fontFamily="Space Grotesk"
          fallbackFontFamily={['Helvetica', 'Arial', 'sans-serif']}
          webFont={{
            url: 'https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUUxjLg.woff2',
            format: 'woff2',
          }}
          fontWeight={600}
          fontStyle="normal"
        />
      </Head>
      <Preview>Welcome to Calculyx AI — let's make your money make sense.</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <LogoHeader />

          <Text style={styles.eyebrow}>WELCOME TO CALCULYX AI</Text>
          <Heading style={styles.h1}>Hi {displayName}, so glad you're here 👋</Heading>
          <Text style={styles.text}>
            You just joined a community of people who believe money decisions should feel clear —
            not confusing. Calculyx AI is your calm, sharp, always-honest financial co-pilot for
            loans, taxes, savings, currencies, stocks, and every "what if?" in between.
          </Text>

          <Section style={styles.ctaWrap}>
            <Text style={{ ...styles.text, margin: '0 0 14px' }}>
              Jump in — your calculators, saved reports and AI chats are ready.
            </Text>
            <Button style={styles.button} href={siteUrl}>
              Open Calculyx AI →
            </Button>
          </Section>

          <Section style={{ padding: '4px 0' }}>
            <Text style={{ ...styles.text, fontWeight: 700, color: BRAND.ink, margin: '0 0 8px' }}>
              What you can do right now
            </Text>
            <Text style={styles.text}>
              • Run country-aware calculators across India, USA and UAE<br />
              • Compare live bank rates with the Home Loan Engine<br />
              • Save scenarios &amp; export polished PDF reports<br />
              • Ask the AI assistant to explain the numbers in plain English<br />
              • Track stocks, currencies and your net worth in one place
            </Text>
          </Section>

          <Hr style={styles.divider} />

          <Text style={styles.text}>
            Reply to this email anytime — a real human on our team reads every message. We're rooting
            for you.
          </Text>
          <Text style={styles.signature}>— The Calculyx AI team</Text>

          <Text style={styles.footer}>
            You're receiving this because you signed up at{' '}
            <Link href={siteUrl} style={styles.link}>calculyxai.online</Link>.
            Educational content only — not financial advice.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: WelcomeEmail,
  subject: 'Welcome to Calculyx AI 🎉',
  displayName: 'Welcome (post sign-up)',
  previewData: { name: 'Alex' },
} satisfies TemplateEntry

export default WelcomeEmail

