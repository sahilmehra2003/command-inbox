import { InboxMessageListResponse } from "@/lib/corsair/corsair-gmail-service";
import { MailQuestion } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
const MessageList = async ({ messages }: InboxMessageListResponse) => {
  return (
   <div className="h-full overflow-y-auto">
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
          <div className="rounded-full bg-muted p-4">
            <MailQuestion className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No messages</h3>
          <p className="text-sm text-muted-foreground max-w-50">
            Your inbox is currently empty. Check back later!
          </p>
        </div>
      ) : (
        // Message List 
        messages.map((message) => (
        <Link
          key={message.id}
          href={`/inbox/${message.id}`}
          className={cn(`w-full border-b px-4 py-3 text-left transition-colors hover:bg-muted/50 cursor-pointer
            ${message.isUnread? "bg-background font-medium": "bg-background/40"}`)}>
          <div className="flex items-start gap-3">
            {/* unread dot */}
            <div className="mt-2 shrink-0">
              {message.isUnread && (
                <div className="h-2 w-2 rounded-full bg-blue-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <span
                  className={cn(`truncate ${message.isUnread? "font-semibold": "font-normal text-muted-foreground"}`)}>
                  {message.from}
                </span>

                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {message.formattedDate}
                </span>
              </div>
              <p className={`truncate ${message.isUnread ? "font-medium": "text-muted-foreground"}`}>
                {message.subject}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {message.snippet}
              </p>
            </div>
          </div>
        </Link>
      ))
      )}
    </div>
  );
};

export default MessageList;