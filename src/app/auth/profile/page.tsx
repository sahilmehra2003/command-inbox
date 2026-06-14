import Image from "next/image";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  Alert,
} from "@/components/ui/alert"
import { redirect } from "next/navigation";
import { getConnectedIntegrations } from "@/lib/corsair/get-connected-integrations";
import { Button } from "@/components/ui/button";

type ProfilePageProps = {
  searchParams: Promise<{
    connected?: string;
  }>;
};

const ProfilePage = async ({searchParams,}:ProfilePageProps) => {
   
  
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth/login");
  }
  const integrations=await getConnectedIntegrations(user.id);
  const gmailConnected = integrations.some(
  (integration) => integration.name === "gmail"
);

const calendarConnected = integrations.some(
  (integration) => integration.name === "googlecalendar"
);
 const connectedCount =
  Number(gmailConnected) + Number(calendarConnected);
  const params = await searchParams;
  const connectedPlugin = params.connected; 
  const displayName =
  connectedPlugin === "gmail"
    ? "Gmail"
    : "Google Calendar";
  

  return (

    <div className="container mx-auto max-w-5xl p-6 space-y-6">
      {/* Header */}
     <div className="space-y-4">
  <div className="flex items-start justify-between">
    <div>
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="text-muted-foreground">
        Manage your account and integrations
      </p>
    </div>

    <Button variant="outline" asChild>
  <a href="/connected-workspace">
    Manage Integrations
  </a>
</Button>
  </div>

  {connectedPlugin && (
    <Alert className="border bg-muted/50">
      <span className="font-medium">
        ✓ {displayName} connected successfully
      </span>
    </Alert>
  )}
</div>
      

      {/* User Card */}
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-5">
          {user.image ? (
            <Image
              loading="eager"
              src={user.image}
              alt={user.name ?? "User"}
              width={80}
              height={80}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-2xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>

            <div className="mt-3 inline-flex rounded-full bg-secondary px-3 py-1 text-sm">
              Google Account
            </div>
          </div>
        </div>
      </div>


      {/* Integrations */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-semibold">Connected Integrations</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {/* Gmail */}
          <div className="rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Gmail</h3>

              <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                gmailConnected ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                 {gmailConnected ? "Connected" : "Not Connected"}
              </span>
            </div>


            <div className="mt-4 flex gap-2">
              {gmailConnected ? (
            <>
              

              <button className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600">
                 Disconnect
              </button>
            </>
               ) : (
              <a
                href="/api/integrations/connect?plugin=gmail"
                className="rounded-lg border px-3 py-2 text-sm"
              >
                Connect Gmail
              </a>
            )}
          </div>
            </div>

          {/* Calendar */}
          <div className="rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Google Calendar</h3>

              <span className={`rounded-full px-2 py-1 text-xs font-medium 
                ${calendarConnected ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                {calendarConnected ? "Connected" : "Not Connected"}
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600">
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Summary */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-semibold">Workspace Summary</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">Emails Synced</p>
            <p className="mt-2 text-2xl font-bold">0</p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">Calendar Events</p>
            <p className="mt-2 text-2xl font-bold">0</p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">Commands Executed</p>
            <p className="mt-2 text-2xl font-bold">0</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-200 p-6">
        <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>

        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-lg border border-red-300 px-4 py-2 text-red-600">
            Disconnect All Integrations
          </button>

          <button className="rounded-lg bg-red-600 px-4 py-2 text-white">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;