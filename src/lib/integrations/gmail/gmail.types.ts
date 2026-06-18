export interface InboxMessage {
    id: string;
    threadId?: string;
    from: string;
    subject: string;
    snippet: string;
    internalDate?: string | number | Date | null;
    formattedDate?: Date | string
    isUnread?: boolean;
    isImportant?: boolean;
    isSpam?: boolean;
    isStarred?: boolean;
}

export interface InboxMessageListResponse {
    messages: InboxMessage[];
    nextPageToken?: string;
    resultSizeEstimate?: number;
}

export interface GmailMessageMetadata {
    from: string;
    senderName: string;
    subject: string;
    formattedDate: string;
}

export interface GmailAttachment {
    filename: string;
    mimeType: string;
    size: number;
}

export interface GmailMessageDetail {
    id: string;
    threadId?: string;
    from: string;
    senderName: string;
    senderEmail: string
    to: string;
    cc?: string;
    subject: string;
    snippet: string;
    internalDate?: string | number | Date | null;
    formattedDate?: string;
    htmlBody?: string;
    textBody?: string;
    attachments: GmailAttachment[];
    isUnread: boolean;
    isArchived: boolean;
    isStarred: boolean
    isImportant: boolean
    isSpam?: boolean;
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
    cc?: string | string[];
    bcc?: string | string[];
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
export type InboxEmail = {
    id: string;
    from: string;
    subject: string;
    snippet: string;
    internalDate: number;
    isUnread: boolean;
    isImportant: boolean;
    isStarred: boolean;
    isSpam: boolean;
    isVipSender: boolean
};

// ai related

export type InboxSummary = {
  totalEmails: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  summary: string;
  recommendedActions: string[];
};

export type PrioritizedEmail = InboxEmail & {
    priority:
    | "critical"
    | "high"
    | "medium"
    | "low";
    reason: string;
};

//! Priority emails for a inbox
export const VIP_SENDERS = [
    "s.mehra.sh@gmail.com",
    "mehra.sahil.dev03@gmail.com",
];

export const VIP_DOMAINS = [
    "amazon.in",
    "amazon.com",
];

