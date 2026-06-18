import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getConnectedIntegrations } from "@/lib/corsair/get-connected-integrations";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const user=await getCurrentUser();
    if (!user) {
      redirect("/auth/login");
    }
    const integrations =await getConnectedIntegrations(user.id);
    const gmailConnected =integrations.some(i => i.name === "gmail" );
  
  const calendarConnected =integrations.some( i => i.name === "googlecalendar");
    const hasIntegration = gmailConnected || calendarConnected;

  if (!hasIntegration) {
    redirect("/connected-workspace");
  }

  return <>{children}</>;
}