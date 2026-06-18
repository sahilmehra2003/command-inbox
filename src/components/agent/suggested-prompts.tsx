"use client";

import { cn } from "@/lib/utils";
import { AGENT_WORKFLOWS } from "./types";


interface WorkflowCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function WorkflowCard({
  title,
  description,
  icon,
  onClick,
}: WorkflowCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all",
        "hover:bg-muted/50 hover:border-primary cursor-pointer"
      )}
    >
      <div className="rounded-lg bg-primary/10 p-2">
        {icon}
      </div>

      <div>
        <h3 className="font-medium">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </button>
  );
}

interface SuggestedPromptsProps {
  onSelect: (
    workflowId: string
  ) => void;
}

export function SuggestedPrompts({
  onSelect,
}: SuggestedPromptsProps) {
  return (
    <div className="mt-8 grid w-full max-w-3xl gap-3 md:grid-cols-2">
      {
        AGENT_WORKFLOWS.map((workflow)=>{
          const Icon=workflow.icon;
          return(
          <WorkflowCard
          key={workflow.id}
          title={workflow.title}
          description={workflow.description}
          icon={<Icon className="size-5"/>}
          onClick={()=>onSelect(workflow.id)}
          />
          )
})
      }
      {/* <WorkflowCard
        title="Daily Brief"
        description="Get today's emails, meetings and priorities."
        icon={
          <Sparkles className="size-5" />
        }
        onClick={() =>
          onSelect("daily-brief")
        }
      />

      <WorkflowCard
        title="Summarize Inbox"
        description="Review important emails received today."
        icon={
          <Mail className="size-5" />
        }
        onClick={() =>
          onSelect("inbox-summary")
        }
      />

      <WorkflowCard
        title="Today's Agenda"
        description="View today's scheduled meetings."
        icon={
          <Calendar className="size-5" />
        }
        onClick={() =>
          onSelect("today-agenda")
        }
      />

      <WorkflowCard
        title="Tomorrow's Agenda"
        description="See what's planned for tomorrow."
        icon={
          <ClipboardList className="size-5" />
        }
        onClick={() =>
          onSelect("tomorrow-agenda")
        }
      />

      <WorkflowCard
        title="Create Meeting + Notify"
        description="Schedule a meeting and notify attendees."
        icon={
          <Calendar className="size-5" />
        }
        onClick={() =>
          onSelect("meeting-notify")
        }
      /> */}
    </div>
  );
}