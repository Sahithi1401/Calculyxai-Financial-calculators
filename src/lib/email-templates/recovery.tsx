import * as React from 'react'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from '@react-email/components'
import { LogoHeader } from './logo-header'
import { styles } from './brand'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({ siteName, confirmationUrl }: RecoveryEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Reset your {siteName} password securely</Preview>
    <Body style={styles.main}>
      <Container style={styles.container}>
        <LogoHeader />
        <Text style={styles.eyebrow}>PASSWORD RESET</Text>
        <Heading style={styles.h1}>Reset your password</Heading>
        <Text style={styles.text}>
          We received a request to reset the password for your {siteName} account. Click the button
          below to set a new one — the link is valid for a short time.
        </Text>

        <Section style={styles.ctaWrap}>
          <Button style={styles.button} href={confirmationUrl}>Reset my password</Button>
          <Text style={styles.hint}>
            Or paste this link in your browser:<br />
            <Link href={confirmationUrl} style={styles.link}>{confirmationUrl}</Link>
          </Text>
        </Section>

        <Hr style={styles.divider} />
        <Text style={styles.text}>
          Didn't request this? You can safely ignore this email — your password will stay the same.
        </Text>
        <Text style={styles.signature}>— The Calculyx AI team</Text>
        <Text style={styles.footer}>
          Calculyx AI • AI-powered financial intelligence • calculyxai.online
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail
