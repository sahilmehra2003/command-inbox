import { InboxMessageListResponse } from "@/lib/corsair/corsair-gmail-service";

const MessageList = async ({ messages }: InboxMessageListResponse) => {
  return (
    <div className="h-full overflow-y-auto">
      {messages.map((message) => (
        <button
          key={message.id}
          className={`
            w-full
            border-b
            px-4
            py-3
            text-left
            transition-colors
            hover:bg-muted/50
            cursor-pointer

            ${
              message.isUnread
                ? "bg-background font-medium"
                : "bg-background/40"
            }
          `}
        >
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
                  className={`
                    truncate
                    ${
                      message.isUnread
                        ? "font-semibold"
                        : "font-normal text-muted-foreground"
                    }
                  `}
                >
                  {message.from}
                </span>

                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {message.formattedDate}
                </span>
              </div>

              <p
                className={`
                  truncate
                  ${
                    message.isUnread
                      ? "font-medium"
                      : "text-muted-foreground"
                  }
                `}
              >
                {message.subject}
              </p>

              <p className="truncate text-sm text-muted-foreground">
                {message.snippet}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default MessageList;