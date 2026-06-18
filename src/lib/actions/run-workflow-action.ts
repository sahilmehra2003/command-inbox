"use server";

import { getCurrentUser } from "../auth/get-current-user";
import { getAgenda } from "../integrations/calenadr/calendar-ai.service";
import { getDailyBrief } from "../workflows/daily-brief.workflow";
import { getTodayInboxSummary } from "../workflows/inbox-summary.workflow";

export async function runWorkflow(
  workflowId: string
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  switch (workflowId) {
    case "daily-brief":
      return getDailyBrief(user.id);

    case "inbox-summary":
      return getTodayInboxSummary(user.id);

    case "today-agenda":
      return getAgenda(user.id, new Date());

    case "tomorrow-agenda": {
      const tomorrow = new Date();
      tomorrow.setDate(
        tomorrow.getDate() + 1
      );

      return getAgenda(
        user.id,
        tomorrow
      );
    }

    default:
      throw new Error(
        "Unknown workflow"
      );
  }
}