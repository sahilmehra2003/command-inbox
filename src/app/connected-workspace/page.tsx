import { HeroSection } from "@/components/ConnectWorkspacePage/hero-section";
import { IntegrationCard } from "@/components/ConnectWorkspacePage/integration-card";
import { WorkspaceStatus } from "@/components/ConnectWorkspacePage/workspace-connected";
import { ContinueButton } from "@/components/ConnectWorkspacePage/continue-button";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { redirect } from "next/navigation";
import { getConnectedIntegrations } from "@/lib/corsair/get-connected-integrations";


export default async function ConnectWorkspacePage() {

  const user=await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }
  const integrations =
   await getConnectedIntegrations(user.id);
  const gmailConnected =
   integrations.some(
      i => i.name === "gmail"
   );

const calendarConnected =
   integrations.some(
      i => i.name === "googlecalendar"
   );

  return (
    <div className="container mx-auto max-w-6xl py-12 space-y-10">
      <HeroSection />

      <div className="grid gap-6 md:grid-cols-2">
        <IntegrationCard
          name="Gmail"
          description="Access email summaries and action items."
          features={[
            "Summarize emails",
            "Find action items",
            "Draft replies",
          ]}
          connected={gmailConnected}
          connectUrl="/api/integrations/connect?plugin=gmail"
        />

        <IntegrationCard
          name="Google Calendar"
          description="Manage meetings and schedules."
          features={[
            "Upcoming meetings",
            "Scheduling insights",
            "Agenda summaries",
          ]}
          connected={calendarConnected}
          connectUrl="/api/integrations/connect?plugin=googlecalendar"
        />
      </div>

      <WorkspaceStatus
        gmailConnected={gmailConnected}
        calendarConnected={calendarConnected}
      />

      <ContinueButton
        canContinue={
          gmailConnected || calendarConnected
        }
      />
    </div>
  );
}