"use client";

import { AgentMessage } from "./agent-message";
import {  AgentWorkflowBar } from "./agent-workflow-bar";
import { useAgentStore } from "@/app/store/agent-store";
import { runWorkflow } from "@/lib/actions/run-workflow-action";
import { AGENT_WORKFLOWS } from "./types";
import AgentWelcome from "./agent-welcome";
import { useState } from "react";
import { CreateCalendarEventInput } from "@/lib/integrations/calenadr/calendar.types";
import { CreateMeetingDialog } from "../workflow-cards/create-meeting-dialog";
import { createMeetingAndNotifyAction } from "@/lib/actions/create-meeting-notify";

interface AgentChatProps {
  userName: string;
}

export function AgentChat({
  userName,
}: AgentChatProps) {
   const [meetingDialogOpen,setMeetingDialogOpen] =useState(false);
  const {
  messages,
  addMessage,
  isLoading,
  setLoading,
} = useAgentStore();
  
 const handleWorkflow = async (
  workflowId: string
) => {
  if (isLoading) return;

  // Create Meeting + Notify
  if (workflowId === "meeting-notify") {
    setMeetingDialogOpen(true);
    return;
  }

  try {
    setLoading(true);

    const workflow =
      AGENT_WORKFLOWS.find(
        (w) => w.id === workflowId
      );

    addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content:
        workflow?.title ??
        workflowId,
      createdAt: new Date(),
    });

    const result =
      await runWorkflow(
        workflowId
      );
    addMessage({
      id: crypto.randomUUID(),
      role: "assistant",
      type:
        workflowId ===
          "today-agenda" ||
        workflowId ===
          "tomorrow-agenda"
          ? "agenda"
          : workflowId,
      data: result,
      createdAt: new Date(),
    });
  } catch (error) {
    console.log(
      "error in running workflow:",
      error
    );

    addMessage({
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Failed to run workflow.",
      createdAt: new Date(),
    });
  } finally {
    setLoading(false);
  }
};
 const handleCreateMeeting = async (
    input: CreateCalendarEventInput
  ) => {
    try {
      setLoading(true);

      addMessage({
        id: crypto.randomUUID(),
        role: "user",
        content:
          "Create Meeting + Notify",
        createdAt: new Date(),
      });
      const result =
        await createMeetingAndNotifyAction(
          input
        );
        if (!result.success) {
  addMessage({
    id: crypto.randomUUID(),
    role: "assistant",
    content:
      result.error ??
      "Failed to create meeting",
    createdAt: new Date(),
  });

  return;
}
    
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        type: "meeting-created",
        data: result.data,
        createdAt: new Date(),
      });

      setMeetingDialogOpen(false);

    } catch (error) {
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Failed to create meeting.",
        createdAt: new Date(),
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-4 p-6">
  <AgentWorkflowBar
      onWorkflowSelect={handleWorkflow}
    />
   {messages.length === 0 && (
      <AgentWelcome
        userName={userName}
      />
    )} 
  {messages.map((message) => (
  <AgentMessage
    key={message.id}
    message={message}
  />
))}

{isLoading && (
  <div className="flex w-full justify-start">
    <div className="bg-muted rounded-2xl px-4 py-3">
      <div className="flex items-center gap-1">
        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
      </div>
    </div>
  </div>
)}
<CreateMeetingDialog
      open={meetingDialogOpen}
      onOpenChange={setMeetingDialogOpen}
      onSubmit={handleCreateMeeting}
    />
    </div>
  );
}