import MessageList from "@/components/inbox/message-list";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getTenantMessageList } from "@/lib/integrations/gmail/gmail.service";
import { redirect } from "next/navigation";
import { FILTER_QUERIES } from "@/lib/constants/mail-filters";






const InboxPage = async({searchParams}: {searchParams: Promise<{
    filter?: string;
    q?:string
  }>;}) => {
   const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }
   const { filter,q } =await searchParams;
   const filterQuery =filter && filter in FILTER_QUERIES ? FILTER_QUERIES[filter as keyof typeof FILTER_QUERIES] : undefined;
   const gmailQuery=[
    filterQuery,
    q
   ].filter(Boolean)
    .join(" ")
  const messages = await getTenantMessageList(user.id,gmailQuery);
  return (
  <main className="flex-1 overflow-y-auto">
  <MessageList
    messages={messages.messages}
  />
</main>
);
}

export default InboxPage