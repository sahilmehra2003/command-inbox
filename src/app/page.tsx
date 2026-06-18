"use client"
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const router=useRouter();
  async function handleSignOut() {
  const { error } = await authClient.signOut();

  if (error) {
    toast.error(error.message ?? "Failed to log out");
    return;
  }

  toast.success("Logged out successfully");
  
  // prevents user from navigating to protected page
  router.replace("/auth/login");
  router.refresh();
}
  return (
  <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/40 px-6">
    <div className="w-full max-w-2xl rounded-3xl border bg-card p-10 shadow-lg">
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold">
          CI
        </div>

        <h1 className="text-4xl font-bold tracking-tight">
          Command Inbox
        </h1>

        <p className="text-muted-foreground text-lg">
          AI-powered Email & Calendar Assistant
        </p>

        <p className="mx-auto max-w-xl text-sm text-muted-foreground">
          Manage emails, prioritize tasks, generate daily briefs,
          schedule meetings, and stay organized with AI-powered
          workflows built using Corsair, Gmail, and Google Calendar.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          type="button"
          size="lg"
          className="cursor-pointer"
          onClick={() => router.push("/inbox")}
        >
          Open Inbox
        </Button>

        <Button
          type="button"
          size="lg"
          variant="outline"
          className="cursor-pointer"
          onClick={() => router.push("/agent")}
        >
          Open AI Assistant
        </Button>

        <Button
          type="button"
          size="lg"
          variant="secondary"
          className="cursor-pointer"
          onClick={() => router.push("/auth/profile")}
        >
          View Profile
        </Button>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          type="button"
          variant="destructive"
          className="cursor-pointer"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    </div>
  </main>
);
}
