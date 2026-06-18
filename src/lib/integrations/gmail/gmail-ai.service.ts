import { getTenantMessageList } from "./gmail.service";
import { InboxEmail, VIP_DOMAINS, VIP_SENDERS } from "./gmail.types";


export function isVipSender(
    sender: string
) {
    const lower =
        sender.toLowerCase();

    return (
        VIP_SENDERS.some((email) =>
            lower.includes(
                email.toLowerCase()
            )
        ) ||
        VIP_DOMAINS.some((domain) =>
            lower.includes(domain)
        )
    );
}


export async function getTodayInboxEmails(
    tenantId: string,
    maxResults = 50
): Promise<InboxEmail[]> {
    const query = "in:inbox newer_than:1d";

    const emails = await getTenantMessageList(
        tenantId,
        query,
        maxResults
    );
    return emails.messages.map((email) => ({
        id: email.id,
        from: email.from,
        subject: email.subject,
        snippet: email.snippet,
        internalDate: Number(email.internalDate),
        isUnread: email.isUnread!,
        isImportant: email.isImportant!,
        isStarred: email.isStarred!,
        isSpam: email.isSpam!,
        isVipSender: isVipSender(email.from),
    }));
}