import { CalendarEvent, MeetingInviteEmail } from "@/lib/integrations/calenadr/calendar.types";
import { openai } from "../open-ai-setup";
import { GENERATE_MEETING_INVITE_EMAIL_PROMPT } from "../../prompts/calendar/generate-email-invite-email.prompt";

export async function generateMeetingInviteEmail(
    event: CalendarEvent,
    attendees: string[]
): Promise<MeetingInviteEmail> {
    const response =
        await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.4,
            response_format: {
                type: "json_object",
            },
            messages: [
                {
                    role: "system",
                    content: GENERATE_MEETING_INVITE_EMAIL_PROMPT,
                },
                {
                    role: "user",
                    content: JSON.stringify({
                        title: event.title,
                        description: event.description,
                        start: event.start,
                        end: event.end,
                        calendarLink: event.htmlLink,
                        attendees,
                    }),
                },
            ],
        });

    const content =
        response.choices[0].message.content;

    if (!content) {
        throw new Error(
            "Failed to generate meeting invite email"
        );
    }

    return JSON.parse(content);
}