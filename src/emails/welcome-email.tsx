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

interface WelcomeEmailProps {
name: string;
dashboardUrl: string;
}

export default function WelcomeEmail({
name,
dashboardUrl,
}: WelcomeEmailProps) {
return ( 

<Html> 
    <Head /> <Preview>Welcome to Command Inbox</Preview>
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

      <Heading>Welcome to Command Inbox 🚀</Heading>

      <Text>Hi {name},</Text>

      <Text>
        Your account has been successfully verified and you&apos;re all set to
        start using Command Inbox.
      </Text>

      <Text>
        Connect your Gmail and Google Calendar to unlock AI-powered email
        management, meeting scheduling, and productivity workflows from a
        single workspace.
      </Text>

      <Section style={{ margin: "32px 0" }}>
        <Button
          href={dashboardUrl}
          style={{
            backgroundColor: "#0f172a",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          Open Workspace
        </Button>
      </Section>

      <Text>
        Here&apos;s what you can do next:
      </Text>

      <Text>
        • Connect your Gmail account
        <br />
        • Connect your Google Calendar
        <br />
        • View and manage important emails
        <br />
        • Schedule meetings faster
        <br />
        • Let AI help prioritize your work
      </Text>

      <Text style={{ color: "#64748b", fontSize: "14px" }}>
        Thank you for choosing Command Inbox. We&apos;re excited to help you
        streamline your workflow.
      </Text>
    </Container>
  </Body>
</Html>
);
}
