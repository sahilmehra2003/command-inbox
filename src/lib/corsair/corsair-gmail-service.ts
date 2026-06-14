import { corsair } from "@/server/corsair";

export interface InboxMessage {
    id: string;
    threadId?: string;
    from: string;
    subject: string;
    snippet: string;
    internalDate?: string | number | Date | null;
    formattedDate?: Date | string
    isUnread?: boolean;
}


export interface InboxMessageListResponse {
    messages: InboxMessage[];
    nextPageToken?: string;
    resultSizeEstimate?: number;
}

interface GmailMessageMetadata {
    from: string;
    senderName: string;
    subject: string;
    formattedDate: string;
}

export interface ThreadMessage {
    id: string;
    threadId?: string;

    from: string;
    subject: string;

    snippet: string;

    internalDate: string;
    formattedDate: string;

    isUnread: boolean;
}

export interface ThreadDetails {
    id: string;
    messages: ThreadMessage[];
}

export interface SendEmailInput {
    to: string | string[];
    subject: string;
    body: string;
    contentType?: string
}

export interface ReplyEmailInput extends SendEmailInput {
    threadId: string;
}

export interface ForwardEmailInput {
    to: string | string[];
    originalSubject: string;
    originalBody: string;
    contentType?: string
    additionalMessage?: string;
}



export const getTenant = async (tenantId: string) => {
    const tenant = await corsair.withTenant(tenantId);

    if (!tenant) {
        throw new Error("Corsair account not found");
    }
    return tenant
}


export function extractMessageMetadata(message: any): GmailMessageMetadata {
    const headers = message.payload?.headers ?? [];

    const from =
        headers.find(
            (header) =>
                header.name?.toLowerCase() === "from"
        )?.value ?? "";

    const subject =
        headers.find(
            (header: any) =>
                header.name?.toLowerCase() === "subject"
        )?.value ?? "";

    const senderName =
        from.includes("<")
            ? from.split("<")[0].trim()
            : from;

    const formattedDate = message.internalDate
        ? new Date(
            Number(message.internalDate)
        ).toLocaleDateString()
        : "";

    return {
        from,
        senderName,
        subject,
        formattedDate,
    };
}

export const getTenantMessageList = async (
    tenantId: string
): Promise<InboxMessageListResponse> => {
    const tenant = await getTenant(tenantId);

    if (!tenant) {
        throw new Error("Corsair account not found");
    }

    const response = await tenant.gmail.api.messages.list({
        maxResults: 10,
        includeSpamTrash: false,
    });

    const messages = await Promise.all(
        (response.messages ?? []).map(async (message) => {
            const fullMessage = await tenant.gmail.api.messages.get({
                id: message.id!,
            });

            const { senderName, subject, formattedDate } = extractMessageMetadata(fullMessage)


            return {
                id: fullMessage.id ?? "",
                threadId: fullMessage.threadId,
                from: senderName,
                subject,
                snippet: fullMessage.snippet ?? "",
                internalDate: fullMessage.internalDate,
                formattedDate,
                isUnread:
                    fullMessage.labelIds?.includes("UNREAD") ?? false,
            };
        }));
    return {
        messages,
        nextPageToken: response.nextPageToken,
        resultSizeEstimate: response.resultSizeEstimate,
    };

}


export const getMessageById = async (
    tenantId: string,
    messageId: string
): Promise<InboxMessage> => {
    const tenant = await getTenant(tenantId);

    const message = await tenant.gmail.api.messages.get({
        id: messageId,
    });

    if (!message) {
        throw new Error("Message not found");
    }

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
        internalDate: message.internalDate,
        formattedDate,
        isUnread: message.labelIds?.includes("UNREAD") ?? false,
    };
};

// single message actions
const modifyMessageLabels = async (
    tenantId: string,
    messageId: string,
    options: {
        addLabelIds?: string[];
        removeLabelIds?: string[];
    }
) => {
    const tenant = await getTenant(tenantId);

    return tenant.gmail.api.messages.modify({
        id: messageId,
        ...options,
    });
};

export const markAsRead = async (tenantId: string, messageId: string) => await modifyMessageLabels(tenantId, messageId, { removeLabelIds: ["UNREAD"] });
export const markAsUnread = async (tenantId: string, messageId: string) => await modifyMessageLabels(tenantId, messageId, { addLabelIds: ["UNREAD"] });
export const archiveMessage = async (tenantId: string, messageId: string) => await modifyMessageLabels(tenantId, messageId, { removeLabelIds: ["INBOX"] });
export const unarchiveMessage = async (tenantId: string, messageId: string) => await modifyMessageLabels(tenantId, messageId, { addLabelIds: ["INBOX"], });
export const starMessage = async (tenantId: string, messageId: string) => await modifyMessageLabels(tenantId, messageId, { addLabelIds: ["STARRED"], });
export const unstarMessage = async (tenantId: string, messageId: string) => await modifyMessageLabels(tenantId, messageId, { removeLabelIds: ["STARRED"], });
export const markImportant = async (tenantId: string, messageId: string) => await modifyMessageLabels(tenantId, messageId, { addLabelIds: ["IMPORTANT"], });
export const unMarkImportant = async (tenantId: string, messageId: string) => await modifyMessageLabels(tenantId, messageId, { removeLabelIds: ["IMPORTANT"], });


// bulk message actions
const batchModifyMessageLabels = async (
    tenantId: string,
    messageIds: string[],
    options: {
        addLabelIds?: string[];
        removeLabelIds?: string[];
    }
) => {
    const tenant = await getTenant(tenantId);

    await tenant.gmail.api.messages.batchModify({
        ids: messageIds,
        ...options,
    });
};


export const bulkMarkAsRead = async (tenantId: string, messageIds: string[]) => await batchModifyMessageLabels(tenantId, messageIds, { removeLabelIds: ["UNREAD"], });
export const bulkMarkAsUnread = async (tenantId: string, messageIds: string[]) => await batchModifyMessageLabels(tenantId, messageIds, { addLabelIds: ["UNREAD"], });
export const bulkArchiveMessage = async (tenantId: string, messageIds: string[]) => await batchModifyMessageLabels(tenantId, messageIds, { removeLabelIds: ["INBOX"] });
export const bulkUnarchiveMessage = async (tenantId: string, messageIds: string[]) => await batchModifyMessageLabels(tenantId, messageIds, { addLabelIds: ["INBOX"], });
export const bulkStarMessage = async (tenantId: string, messageIds: string[]) => await batchModifyMessageLabels(tenantId, messageIds, { addLabelIds: ["STARRED"], });
export const bulkUnstarMessage = async (tenantId: string, messageIds: string[]) => await batchModifyMessageLabels(tenantId, messageIds, { removeLabelIds: ["STARRED"], });
export const bulkMarkImportant = async (tenantId: string, messageIds: string[]) => await batchModifyMessageLabels(tenantId, messageIds, { addLabelIds: ["IMPORTANT"], });
export const bulkUnMarkImportant = async (tenantId: string, messageIds: string[]) => await batchModifyMessageLabels(tenantId, messageIds, { removeLabelIds: ["IMPORTANT"], });


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



// mail sending feature

const toBase64Url = (input: string): string => {
    return Buffer.from(input)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
};

export const buildRawEmail = ({
    to,
    subject,
    body,
    contentType = "text/plain"
}: SendEmailInput): string => {
    const recipients = Array.isArray(to)
        ? to.join(", ")
        : to;

    const mime = [
        `To: ${recipients}`,
        `Subject: ${subject}`,
        "MIME-Version: 1.0",
        contentType,
        "",
        body,
    ].join("\r\n");

    return toBase64Url(mime);
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
            const fullMessage =
                await tenant.gmail.api.messages.get({
                    id: message.id!,
                });
            const { senderName, subject, formattedDate } = extractMessageMetadata(fullMessage)

            return {
                id: fullMessage.id ?? "",
                threadId: fullMessage.threadId,
                from: senderName,
                subject,
                snippet: fullMessage.snippet ?? "",
                internalDate: fullMessage.internalDate,
                formattedDate,
                isUnread:
                    fullMessage.labelIds?.includes("UNREAD") ?? false,
            }
        })
    );

    return messages;
};


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

                isUnread:
                    message.labelIds?.includes(
                        "UNREAD"
                    ) ?? false,
            };
        }) ?? [];

    return {
        id: thread.id ?? "",
        messages,
    };
};

