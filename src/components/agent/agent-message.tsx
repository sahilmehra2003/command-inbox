"use client";

import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { DailyBriefCard } from "../workflow-cards/daily-brief-card";
import { AgendaCard } from "../workflow-cards/agenda-card";
import { InboxSummaryCard } from "../workflow-cards/inbox-summary-card";
import { MeetingCreatedCard } from "../workflow-cards/meeting-created-card";

interface AgentMessageProps {
  message: any; 
}

export function AgentMessage({
  message,
}: AgentMessageProps) {
  const isUser =
    message.role === "user";
  if (isUser) {
    return (
      <div className="flex w-full justify-end">
        <div
          className={cn(
            "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
            "bg-primary text-primary-foreground"
          )}
        >
          {message.content}
        </div>
      </div>
    );
  }

  switch (message.type) {
    case "daily-brief":
      return (
        <DailyBriefCard
          data={message.data}
        />
      );

    case "agenda":
      return (
        <AgendaCard
          events={message.data}
        />
      );

    case "inbox-summary":
      return (
        <InboxSummaryCard
          data={message.data}
        />
      );

    case "meeting-created":
      return (
        <MeetingCreatedCard
          data={message.data}
        />
      );

    default:
      return (
        <div className="flex w-full justify-start">
          <div
            className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap",
              "bg-muted"
            )}
          >
            <ReactMarkdown
              remarkPlugins={[
                remarkGfm,
              ]}
            >
              {message.content ?? ""}
            </ReactMarkdown>
          </div>
        </div>
      );
  }
}