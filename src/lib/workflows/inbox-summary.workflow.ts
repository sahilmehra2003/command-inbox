import { classifyEmailPriority } from "../ai/services/gmail/classify-email-priority";
import { generateInboxSummary } from "../ai/services/gmail/generate-inbox-summary";
import { InboxSummary } from "../integrations/calenadr/calendar.types";
import { getTodayInboxEmails } from "../integrations/gmail/gmail-ai.service";


export async function getTodayInboxSummary(
    tenantId: string
): Promise<InboxSummary> {
    const emails =
        await getTodayInboxEmails(
            tenantId
        );

    const prioritizedEmails =
        await classifyEmailPriority(
            emails
        );

    return generateInboxSummary(
        prioritizedEmails
    );
}