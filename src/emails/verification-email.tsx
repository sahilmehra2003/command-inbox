import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  name: string;
  verificationUrl: string;
}

export default function VerificationEmail({
  name,
  verificationUrl,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your Command Inbox account</Preview>

      <Body
        style={{
          backgroundColor: "#f8fafc",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            margin: "40px auto",
            padding: "40px",
            borderRadius: "12px",
            maxWidth: "600px",
          }}
        >
          <Text
            style={{
              color: "#64748b",
              fontSize: "12px",
              marginBottom: "4px",
            }}
          >
            Powered by Corsair
          </Text>

          <Heading>Welcome to Command Inbox</Heading>

          <Text>Hi {name},</Text>

          <Text>
            Thanks for signing up. Please verify your email address to
            activate your account and start using Gmail, Google Calendar
            and AI-powered workflows.
          </Text>

          <Section style={{ margin: "32px 0" }}>
            <Button
              href={verificationUrl}
              style={{
                backgroundColor: "#0f172a",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              Verify Email
            </Button>
          </Section>

          <Text style={{ color: "#64748b", fontSize: "14px" }}>
            If you didn&apos;t create this account, you can safely ignore
            this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}