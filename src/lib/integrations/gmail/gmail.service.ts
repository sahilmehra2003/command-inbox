import { getTenant } from "@/lib/corsair/get-tenant";
import { batchModifyMessageLabels, buildRawEmail, extractMessageDetail, extractMessageMetadata, modifyMessageLabels } from "./gmail.transformer";
import { ForwardEmailInput, GmailMessageDetail, InboxMessage, InboxMessageListResponse, ReplyEmailInput, SendEmailInput, ThreadDetails } from "./gmail.types";


export const getTenantMessageList = async (
    tenantId: string,
    q?: string,
    maxResults = 10
): Promise<InboxMessageListResponse> => {
    const tenant = await getTenant(tenantId);

    if (!tenant) {
        throw new Error("Corsair account not found");
    }
    const response =
        await tenant.gmail.api.messages.list({
            maxResults,
            includeSpamTrash: q?.includes("in:spam") || q?.includes("in:trash"),
            q,
        });

    const messages = await Promise.all(
        (response.messages ?? []).map(
            async (message) => {
                const fullMessage =
                    await tenant.gmail.api.messages.get({
                        id: message.id!,
                    });

                const {
                    senderName,
                    subject,
                    formattedDate,
                } = extractMessageMetadata(
                    fullMessage
                );
                return {
                    id: fullMessage.id ?? "",
                    threadId: fullMessage.threadId,
                    from: senderName,
                    subject,
                    snippet: fullMessage.snippet ?? "",
                    internalDate: fullMessage.internalDate,
                    formattedDate,
                    isUnread: fullMessage.labelIds?.includes("UNREAD") ?? false,
                    isImportant: fullMessage.labelIds?.includes("IMPORTANT") ?? false,
                    isStarred: fullMessage.labelIds?.includes("STARRED") ?? false,
                    isSpam: fullMessage.labelIds?.includes("SPAM") ?? false,
                };
            }
        )
    );

    return {
        messages,
        nextPageToken:
            response.nextPageToken,
        resultSizeEstimate:
            response.resultSizeEstimate,
    };
};

export const getMessageById = async (
    tenantId: string,
    messageId: string
): Promise<GmailMessageDetail> => {
    const tenant = await getTenant(
        tenantId
    );

    const message =
        await tenant.gmail.api.messages.get({
            id: messageId,
        });


    if (!message) {
        throw new Error(
            "Message not found"
        );
    }

    const detail =
        extractMessageDetail(message);

    const labels = message.labelIds ?? [];
    const isStarred = labels.includes("STARRED");
    const isArchived = !labels.includes("INBOX");
    const isUnread = labels.includes("UNREAD");
    const isImportant = labels.includes("IMPORTANT")
    const isSpam = labels.includes("SPAM") ?? false;

    return {
        id: message.id ?? "",
        threadId: message.threadId,
        ...detail,
        snippet: message.snippet ?? "",
        internalDate: message.internalDate,
        isUnread,
        isArchived,
        isStarred,
        isImportant,
        isSpam
    };
};

export const sendEmail = async (
    tenantId: string,
    input: SendEmailInput
) => {
    const tenant = await getTenant(tenantId);

    const raw = buildRawEmail(input);

    return tenant.gmail.api.messages.send({
        raw,
    });
};

export const replyToEmail = async (
    tenantId: string,
    input: ReplyEmailInput
) => {
    const tenant = await getTenant(tenantId);

    const raw = buildRawEmail({
        to: input.to,
        subject: input.subject.startsWith("Re:")
            ? input.subject
            : `Re: ${input.subject}`,
        body: input.body,
        contentType: input.contentType
    });

    return tenant.gmail.api.messages.send({
        raw,
        threadId: input.threadId,
    });
};


export const forwardEmail = async (
    tenantId: string,
    input: ForwardEmailInput
) => {
    const tenant = await getTenant(tenantId);

    const body = `
${input.additionalMessage ?? ""}

---------- Forwarded Message ----------

${input.originalBody}
`;

    const raw = buildRawEmail({
        to: input.to,
        subject: input.originalSubject.startsWith("Fwd:")
            ? input.originalSubject
            : `Fwd: ${input.originalSubject}`,
        body,
        contentType: input.contentType
    });

    return tenant.gmail.api.messages.send({
        raw,
    });
};

export const trashMessage = async (
    tenantId: string,
    messageId: string
) => {
    const tenant = await getTenant(tenantId);

    return tenant.gmail.api.messages.trash({
        id: messageId,
    });
};

export const untrashMessage = async (
    tenantId: string,
    messageId: string
) => {
    const tenant = await getTenant(tenantId);

    return tenant.gmail.api.messages.untrash({
        id: messageId,
    });
};


export const deleteMessage = async (
    tenantId: string,
    messageId: string
) => {
    const tenant = await getTenant(tenantId);

    await tenant.gmail.api.messages.delete({
        id: messageId,
    });
};

export const searchMessages = async (
    tenantId: string,
    query: string,
    maxResults = 50
): Promise<InboxMessage[]> => {
    const tenant = await getTenant(tenantId);

    const response = await tenant.gmail.api.messages.list({
        q: query,
        maxResults,
    });

    const messages = await Promise.all(
        (response.messages ?? []).map(async (message) => {
            const fullMessage =await tenant.gmail.api.messages.get({id: message.id!,});
            const { senderName, subject, formattedDate } = extractMessageMetadata(fullMessage)

            return {
                id: fullMessage.id ?? "",
                threadId: fullMessage.threadId,
                from: senderName,
                subject,
                snippet: fullMessage.snippet ?? "",
                internalDate: fullMessage.internalDate,
                formattedDate,
                isUnread:fullMessage.labelIds?.includes("UNREAD") ?? false,
            }
        })
    );

    return messages;
};


export const markAsRead = async (tenantId: string, messageId: string) => await modifyMessageLabels(tenantId, messageId, { removeLabelIds: ["UNREAD"] });
export const markAsUnread = async (tenantId: string, messageId: string) => await modifyMessageLabels(tenantId, messageId, { addLabelIds: ["UNREAD"] });
export const archiveMessage = async (tenantId: string, messageId: string) => await modifyMessageLabels(tenantId, messageId, { removeLabelIds: ["INBOX"] });
export const unarchiveMessage = async (tenantId: string, messageId: string) => await modifyMessageLabels(tenantId, messageId, { addLabelIds: ["INBOX"], });
export const starMessage = async (tenantId: string, messageId: string) => await modifyMessageLabels(tenantId, messageId, { addLabelIds: ["STARRED"], });
export const unstarMessage = async (tenantId: string, messageId: string) => await modifyMessageLabels(tenantId, messageId, { removeLabelIds: ["STARRED"], });
export const markImportant = async (tenantId: string, messageId: string) => await modifyMessageLabels(tenantId, messageId, { addLabelIds: ["IMPORTANT"], });
export const unMarkImportant = async (tenantId: string, messageId: string) => await modifyMessageLabels(tenantId, messageId, { removeLabelIds: ["IMPORTANT"], });
export const spamMessage = async (tenantId: string, messageId: string) => await modifyMessageLabels(tenantId, messageId, { addLabelIds: ["SPAM"], });
export const removeSpam = async (tenantId: string, messageId: string) => await modifyMessageLabels(tenantId, messageId, { removeLabelIds: ["SPAM"], });

// batch modify
export const bulkMarkAsRead = async (tenantId: string, messageIds: string[]) => await batchModifyMessageLabels(tenantId, messageIds, { removeLabelIds: ["UNREAD"], });
export const bulkMarkAsUnread = async (tenantId: string, messageIds: string[]) => await batchModifyMessageLabels(tenantId, messageIds, { addLabelIds: ["UNREAD"], });
export const bulkArchiveMessage = async (tenantId: string, messageIds: string[]) => await batchModifyMessageLabels(tenantId, messageIds, { removeLabelIds: ["INBOX"] });
export const bulkUnarchiveMessage = async (tenantId: string, messageIds: string[]) => await batchModifyMessageLabels(tenantId, messageIds, { addLabelIds: ["INBOX"], });
export const bulkStarMessage = async (tenantId: string, messageIds: string[]) => await batchModifyMessageLabels(tenantId, messageIds, { addLabelIds: ["STARRED"], });
export const bulkUnstarMessage = async (tenantId: string, messageIds: string[]) => await batchModifyMessageLabels(tenantId, messageIds, { removeLabelIds: ["STARRED"], });
export const bulkMarkImportant = async (tenantId: string, messageIds: string[]) => await batchModifyMessageLabels(tenantId, messageIds, { addLabelIds: ["IMPORTANT"], });
export const bulkUnMarkImportant = async (tenantId: string, messageIds: string[]) => await batchModifyMessageLabels(tenantId, messageIds, { removeLabelIds: ["IMPORTANT"], });

// Thread related
export const getThread = async (
    tenantId: string,
    threadId: string
): Promise<ThreadDetails> => {
    const tenant = await getTenant(tenantId);

    const thread = await tenant.gmail.api.threads.get({
        id: threadId,
    });

    const messages =
        thread.messages?.map((message) => {
            const {
                senderName,
                subject,
                formattedDate,
            } = extractMessageMetadata(message);

            return {
                id: message.id ?? "",
                threadId: message.threadId,

                from: senderName,
                subject,

                snippet: message.snippet ?? "",

                internalDate:
                    message.internalDate ?? "",

                formattedDate,

                isUnread: message.labelIds?.includes("UNREAD") ?? false,
            };
        }) ?? [];

    return {
        id: thread.id ?? "",
        messages,
    };
};