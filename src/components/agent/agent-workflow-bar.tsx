"use client";

import { SuggestedPrompts } from "./suggested-prompts";
interface AgentWorkflowBarStateProps {
  onWorkflowSelect: (
    workflowId: string
  ) => void;
}



export function AgentWorkflowBar({
  onWorkflowSelect,
}: AgentWorkflowBarStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <SuggestedPrompts
        onSelect={onWorkflowSelect}
      />
    </div>
  );
}