import MailDetailView from "@/components/inbox/MailDetailView";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getMessageById } from "@/lib/corsair/corsair-gmail-service";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    messageId: string;
  }>;
}

const InboxOpen = async ({
  params,
}: Props) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { messageId } =
    await params;

  const message =
    await getMessageById(
      user.id,
      messageId
    );

  return (
    <main className="flex-1 overflow-y-auto">
  <MailDetailView
    message={message}
    userId={user.id}
  />
</main>
  );
};

export default InboxOpen;