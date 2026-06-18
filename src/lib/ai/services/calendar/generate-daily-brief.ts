import { CalendarEvent, DailyBrief } from "@/lib/integrations/calenadr/calendar.types";
import { InboxSummary } from "@/lib/integrations/gmail/gmail.types";
import { openai } from "../open-ai-setup";
import { DAILY_BRIEF_PROMPT } from "../../prompts/calendar/daily-brief.prompt";

export async function generateDailyBrief(
    inboxSummary: InboxSummary,
    agenda: CalendarEvent[]
): Promise<DailyBrief> {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        response_format: {
            type: "json_object",
        },
        messages: [
            {
                role: "system",
                content:DAILY_BRIEF_PROMPT,
            },
            {
                role: "user",
                content: JSON.stringify({
                    inboxSummary,
                    meetings: agenda.map(
                        (meeting) => ({
                            title: meeting.title,
                            description:meeting.description,
                            start: meeting.start,
                            end: meeting.end,
                        })
                    ),
                }),
            },
        ],
    });

    const content = response.choices[0].message.content;

    if (!content) {
        throw new Error(
            "Failed to generate daily brief"
        );
    }

    const parsed = JSON.parse(content);
    return parsed;
}