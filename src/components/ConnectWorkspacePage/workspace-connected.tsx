import Link from "next/link";
import { Button } from "@/components/ui/button";

type WorkspaceStatusProps = {
  gmailConnected: boolean;
  calendarConnected: boolean;
};

export const WorkspaceStatus = ({
  gmailConnected,
  calendarConnected,
}: WorkspaceStatusProps) => {
  const connectedCount =
    Number(gmailConnected) + Number(calendarConnected);

  return (
    <section className="rounded-2xl border bg-card p-6">
      <h2 className="text-lg font-semibold">
        Workspace Status
      </h2>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <span>Gmail</span>
          <span>
            {gmailConnected ? "✅ Connected" : "❌ Not Connected"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Google Calendar</span>
          <span>
            {calendarConnected
              ? "✅ Connected"
              : "❌ Not Connected"}
          </span>
        </div>
      </div>

      <div className="mt-5 rounded-lg bg-muted p-3 text-sm">
  {connectedCount} of 2 integrations connected
</div>

{connectedCount > 0 && (
  <div className="mt-5 flex justify-center">
    <Button asChild>
      <Link href="/">
       Go to home
      </Link>
    </Button>
  </div>
)}
    </section>
  );
};