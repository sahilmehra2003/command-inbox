import { Suspense } from "react";
import VerifyUserPendingForm from "@/components/auth/verify-user-pending-form";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyUserPendingForm />
    </Suspense>
  );
}