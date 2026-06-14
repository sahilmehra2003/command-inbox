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

interface ForgotPasswordEmailProps {
  name: string;
  resetUrl: string;
}

export default function ForgotPasswordEmail({
  name,
  resetUrl,
}: ForgotPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Command Inbox password</Preview>

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

          <Heading>Reset Your Password</Heading>

          <Text>Hi {name},</Text>

          <Text>
            We received a request to reset your Command Inbox password.
          </Text>

          <Section style={{ margin: "32px 0" }}>
            <Button
              href={resetUrl}
              style={{
                backgroundColor: "#0f172a",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              Reset Password
            </Button>
          </Section>

          <Text style={{ color: "#64748b", fontSize: "14px" }}>
            If you didn&apos;t request a password reset, you can safely
            ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}