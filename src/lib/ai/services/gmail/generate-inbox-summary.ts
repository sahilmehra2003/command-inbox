import { InboxSummary, PrioritizedEmail } from "@/lib/integrations/gmail/gmail.types";
import { INBOX_SUMMARY_PROMPT } from "../../prompts/gmail/inbox-summary.prompt";
import { openai } from "../open-ai-setup";





export async function generateInboxSummary(
  emails: PrioritizedEmail[]
): Promise<InboxSummary> {
  if (!emails.length) {
    return {
      totalEmails: 0,
      criticalCount: 0,
      highCount: 0,
      mediumCount: 0,
      lowCount: 0,
      summary: "No emails received today.",
      recommendedActions: [],
    };
  }

  const criticalEmails = emails.filter(
    (email) => email.priority === "critical"
  );

  const highEmails = emails.filter(
    (email) => email.priority === "high"
  );

  const mediumEmails = emails.filter(
    (email) => email.priority === "medium"
  );

  const lowEmails = emails.filter(
    (email) => email.priority === "low"
  );

  const summaryInput = {
    totalEmails: emails.length,
    criticalEmails: criticalEmails.map(
      ({ from, subject, reason }) => ({
        from,
        subject,
        reason,
      })
    ),
    highEmails: highEmails.map(
      ({ from, subject, reason }) => ({
        from,
        subject,
        reason,
      })
    ),
    mediumCount: mediumEmails.length,
    lowCount: lowEmails.length,
  };

  const response =
    await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: INBOX_SUMMARY_PROMPT,
        },
        {
          role: "user",
          content: JSON.stringify(
            summaryInput,
            null,
            2
          ),
        },
      ],
    });

  const content =
    response.choices[0].message.content;

  if (!content) {
    throw new Error(
      "Failed to generate inbox summary"
    );
  }

  const parsed = JSON.parse(content);

  return {
    totalEmails: emails.length,
    criticalCount: criticalEmails.length,
    highCount: highEmails.length,
    mediumCount: mediumEmails.length,
    lowCount: lowEmails.length,
    summary: parsed.summary,
    recommendedActions: parsed.recommendedActions ?? [],
  };
}