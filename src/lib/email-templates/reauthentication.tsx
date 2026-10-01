import * as React from 'react'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Text,
} from '@react-email/components'
import { LogoHeader } from './logo-header'
import { styles } from './brand'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Calculyx AI verification code</Preview>
    <Body style={styles.main}>
      <Container style={styles.container}>
        <LogoHeader />
        <Text style={styles.eyebrow}>VERIFICATION CODE</Text>
        <Heading style={styles.h1}>Confirm it's you</Heading>
        <Text style={styles.text}>Use the code below to confirm your identity:</Text>
        <Text style={styles.codeBox}>{token}</Text>
        <Hr style={styles.divider} />
        <Text style={styles.text}>
          This code will expire shortly. If you didn't request it, you can safely ignore this email.
        </Text>
        <Text style={styles.signature}>— The Calculyx AI team</Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail
