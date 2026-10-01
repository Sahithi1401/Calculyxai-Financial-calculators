import * as React from 'react'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from '@react-email/components'
import { LogoHeader } from './logo-header'
import { styles } from './brand'

interface EmailChangeEmailProps {
  siteName: string
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName, oldEmail, newEmail, confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your new email for {siteName}</Preview>
    <Body style={styles.main}>
      <Container style={styles.container}>
        <LogoHeader />
        <Text style={styles.eyebrow}>EMAIL CHANGE</Text>
        <Heading style={styles.h1}>Confirm your email change</Heading>
        <Text style={styles.text}>
          You requested to change your {siteName} email from{' '}
          <Link href={`mailto:${oldEmail}`} style={styles.link}>{oldEmail}</Link> to{' '}
          <Link href={`mailto:${newEmail}`} style={styles.link}>{newEmail}</Link>.
        </Text>

        <Section style={styles.ctaWrap}>
          <Button style={styles.button} href={confirmationUrl}>Confirm email change</Button>
          <Text style={styles.hint}>
            Or paste this link in your browser:<br />
            <Link href={confirmationUrl} style={styles.link}>{confirmationUrl}</Link>
          </Text>
        </Section>

        <Hr style={styles.divider} />
        <Text style={styles.text}>
          Didn't request this? Please secure your account immediately by resetting your password.
        </Text>
        <Text style={styles.signature}>— The Calculyx AI team</Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail
