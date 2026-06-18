/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTenant } from "@/lib/corsair/get-tenant";
import { GmailMessageDetail, GmailMessageMetadata, InboxEmail, SendEmailInput } from "./gmail.types";


export function extractMessageMetadata(message: any): GmailMessageMetadata {
    const headers = message.payload?.headers ?? [];

    const from =
        headers.find(
            (header: { name: string; }) =>
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

export function getHeader(
    headers: any[],
    name: string
): string {
    return (
        headers.find(
            (header) =>
                header.name?.toLowerCase() ===
                name.toLowerCase()
        )?.value ?? ""
    );
}

export function decodeBase64Url(
    data?: string
): string {
    if (!data) return "";

    return Buffer.from(
        data.replace(/-/g, "+").replace(/_/g, "/"),
        "base64"
    ).toString("utf-8");
}

export function extractSenderEmail(headerValue: string): string {
    const emailRegex = /<([^>]+)>/;
    const match = headerValue.match(emailRegex);
    return match ? match[1] : headerValue;
}

export function extractMessageDetail(
    message: any
): Omit<
    GmailMessageDetail,
    | "id"
    | "threadId"
    | "snippet"
    | "internalDate"
    | "isUnread"
> {
    const headers =
        message.payload?.headers ?? [];

    const from = getHeader(headers, "From");
    const to = getHeader(headers, "To");
    const cc = getHeader(headers, "Cc");
    const subject = getHeader(
        headers,
        "Subject"
    );

    const senderName = from.includes("<")
        ? from.split("<")[0].trim()
        : from;

    const formattedDate =
        message.internalDate
            ? new Date(
                Number(message.internalDate)
            ).toLocaleString()
            : "";

    const parts =
        message.payload?.parts ?? [];

    const htmlPart = parts.find(
        (part: any) =>
            part.mimeType === "text/html"
    );

    const textPart = parts.find(
        (part: any) =>
            part.mimeType === "text/plain"
    );

    const htmlBody = decodeBase64Url(
        htmlPart?.body?.data
    );

    const textBody = decodeBase64Url(
        textPart?.body?.data
    );

    const labelIds = message.labelIds ?? [];
    const isImportant = labelIds.includes("IMPORTANT");
    const isStarred = labelIds.includes("STARRED");
    const isArchived = !labelIds.includes("INBOX");

    const attachments = parts
        .filter(
            (part: any) =>
                part.filename &&
                part.filename.length > 0
        )
        .map((part: any) => ({
            filename: part.filename,
            mimeType: part.mimeType,
            size: part.body?.size ?? 0,
        }));

    const cleanedHtml: string = message.htmlBody
        ?.replace(/<!doctype[^>]*>/gi, "")
        ?.replace(/<html[^>]*>/gi, "")
        ?.replace(/<\/html>/gi, "")
        ?.replace(/<head[\s\S]*?<\/head>/gi, "")
        ?.replace(/<body[^>]*>/gi, "")
        ?.replace(/<\/body>/gi, "");

    return {
        from,
        senderName,
        senderEmail: extractSenderEmail(from)!,
        to,
        cc,
        subject,
        formattedDate,
        htmlBody: cleanedHtml,
        textBody,
        attachments,
        isImportant, 
        isStarred,
        isArchived,
    };
}

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
    cc,
    bcc,
    subject,
    body,
    contentType = "text/plain",
}: SendEmailInput): string => {
    const recipients = Array.isArray(to)
        ? to.join(", ")
        : to;

    const ccRecipients = cc
        ? Array.isArray(cc)
            ? cc.join(", ")
            : cc
        : null;

    const bccRecipients = bcc
        ? Array.isArray(bcc)
            ? bcc.join(", ")
            : bcc
        : null;

    const mimeLines = [
        `To: ${recipients}`,
        ...(ccRecipients ? [`Cc: ${ccRecipients}`] : []),
        ...(bccRecipients ? [`Bcc: ${bccRecipients}`] : []),
        `Subject: ${subject}`,
        "MIME-Version: 1.0",
        `Content-Type: ${contentType}; charset=UTF-8`,
        "",
        body,
    ];

    return toBase64Url(
        mimeLines.join("\r\n")
    );
};

// single message actions
export const modifyMessageLabels = async (
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


// bulk message actions
export const batchModifyMessageLabels = async (
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


export const getEmailsForAi = (emails: InboxEmail[]) => {
    return emails.map(
        ({
            id,
            from,
            subject,
            snippet,
            isUnread,
            isImportant,
            isStarred,
            isSpam,
            isVipSender,
        }) => ({
            id,
            from,
            subject,
            snippet,
            isUnread,
            isImportant,
            isStarred,
            isSpam,
            isVipSender,
        })
    );
}