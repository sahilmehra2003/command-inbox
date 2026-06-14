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
    <div>
      Welcome to command-inbox!
      <Button type="button" className="h-12 px-3 rounded-xl font-medium cursor-pointer bg-amber-700" onClick={()=>router.push("/auth/profile")}>View Profile</Button>
      <Button type="button" className="h-12 px-3 rounded-xl font-medium cursor-pointer"
      onClick={handleSignOut}
      >
          Sign Out
      </Button>
    </div>
  );
}
