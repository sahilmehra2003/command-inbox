import { generateMeetingInviteEmail } from "../ai/services/calendar/generate-meeting-invite-email";
import { createCalendarEvent } from "../integrations/calenadr/calendar.service";
import { CreateCalendarEventInput, CreateMeetingAndNotifyResult } from "../integrations/calenadr/calendar.types";
import { sendEmail } from "../integrations/gmail/gmail.service";

export async function createMeetingAndNotify(
    tenantId: string,
    input: CreateCalendarEventInput
): Promise<CreateMeetingAndNotifyResult> {
    // 1. Create Calendar Event
    const event = await createCalendarEvent(
        tenantId,
        input
    );

    // 2. Generate AI Email
    const inviteEmail =
        await generateMeetingInviteEmail(
            event,
            input.attendees ?? []
        );

    // 3. Send Email
    if (
        input.attendees &&
        input.attendees.length > 0
    ) {
        await sendEmail(tenantId, {
            to: input.attendees,
            subject: inviteEmail.subject,
            body: inviteEmail.body,
            contentType: "text/html",
        });
    }

    // 4. Return Workflow Result
    return {
        event,
        emailSubject: inviteEmail.subject,
        emailBody: inviteEmail.body,
        emailsSent: input.attendees?.length ?? 0,
    };
}