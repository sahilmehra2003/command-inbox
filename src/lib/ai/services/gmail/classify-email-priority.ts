
import { getEmailsForAi } from "@/lib/integrations/gmail/gmail.transformer";
import { InboxEmail, PrioritizedEmail } from "@/lib/integrations/gmail/gmail.types";
import { openai } from "../open-ai-setup";
import { PRIORITY_CLASSIFIER_PROMPT } from "../../prompts/gmail/priority-classifier.promt";




export async function classifyEmailPriority(
    emails: InboxEmail[]
): Promise<PrioritizedEmail[]> {
    if (!emails.length) {
        return [];
    }

    const emailsForAi = getEmailsForAi(emails)

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0,
        messages: [
            {
                role: "system",
                content:PRIORITY_CLASSIFIER_PROMPT,
            },
            {
                role: "user",
                content: JSON.stringify(emailsForAi),
            },
        ],
        response_format: {
            type: "json_object",
        },
    });

    const content =
        response.choices[0].message
            .content;

    if (!content) {
        throw new Error(
            "Priority classifier returned empty response"
        );
    }

    const parsed = JSON.parse(
        content
    ) as {
        emails: {
            id: string;
            priority:
            | "critical"
            | "high"
            | "medium"
            | "low";
            reason: string;
        }[];
    };

    const priorityMap = new Map(
        parsed.emails.map((email) => [
            email.id,
            email,
        ])
    );

    return emails.map((email) => {
        const classified =
            priorityMap.get(email.id);

        return {
            ...email,
            priority:
                classified?.priority ??
                "medium",
            reason:
                classified?.reason ??
                "No reason provided",
        };
    });
}