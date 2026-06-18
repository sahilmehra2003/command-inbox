import { generateDailyBrief } from "../ai/services/calendar/generate-daily-brief";
import { getAgenda } from "../integrations/calenadr/calendar-ai.service";
import { getTodayInboxSummary } from "./inbox-summary.workflow";

export const getDailyBrief = async (tenantId: string) => {
    const inboxSummary = await getTodayInboxSummary(tenantId);

    const agenda =
        await getAgenda(
            tenantId,
            new Date()
        );

    return generateDailyBrief(
        inboxSummary,
        agenda,
    );
}