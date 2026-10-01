import * as React from 'react'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from '@react-email/components'
import { LogoHeader } from './logo-header'
import { styles } from './brand'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({ siteName, confirmationUrl }: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your secure login link for {siteName}</Preview>
    <Body style={styles.main}>
      <Container style={styles.container}>
        <LogoHeader />
        <Text style={styles.eyebrow}>SIGN-IN LINK</Text>
        <Heading style={styles.h1}>Your one-click login</Heading>
        <Text style={styles.text}>
          Click the button below to securely sign in to {siteName}. This link expires shortly and can
          only be used once.
        </Text>

        <Section style={styles.ctaWrap}>
          <Button style={styles.button} href={confirmationUrl}>Sign in to Calculyx AI</Button>
          <Text style={styles.hint}>
            Or paste this link in your browser:<br />
            <Link href={confirmationUrl} style={styles.link}>{confirmationUrl}</Link>
          </Text>
        </Section>

        <Hr style={styles.divider} />
        <Text style={styles.text}>
          Didn't request this link? You can safely ignore this email.
        </Text>
        <Text style={styles.signature}>— The Calculyx AI team</Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail
