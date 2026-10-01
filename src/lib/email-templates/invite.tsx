import * as React from 'react'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from '@react-email/components'
import { LogoHeader } from './logo-header'
import { styles } from './brand'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({ siteName, siteUrl, confirmationUrl }: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You've been invited to {siteName}</Preview>
    <Body style={styles.main}>
      <Container style={styles.container}>
        <LogoHeader />
        <Text style={styles.eyebrow}>YOU'RE INVITED</Text>
        <Heading style={styles.h1}>Join {siteName}</Heading>
        <Text style={styles.text}>
          You've been invited to join{' '}
          <Link href={siteUrl} style={styles.link}><strong>{siteName}</strong></Link>{' '}
          — premium financial calculators, live market data, and an AI assistant tuned for personal finance.
        </Text>

        <Section style={styles.ctaWrap}>
          <Button style={styles.button} href={confirmationUrl}>Accept invitation</Button>
          <Text style={styles.hint}>
            Or paste this link in your browser:<br />
            <Link href={confirmationUrl} style={styles.link}>{confirmationUrl}</Link>
          </Text>
        </Section>

        <Hr style={styles.divider} />
        <Text style={styles.text}>
          If you weren't expecting this invitation, it's safe to ignore.
        </Text>
        <Text style={styles.signature}>— The Calculyx AI team</Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail
