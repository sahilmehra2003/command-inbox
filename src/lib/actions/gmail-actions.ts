/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
    archiveMessage,
    unarchiveMessage,
    starMessage,
    unstarMessage,
    trashMessage,
    replyToEmail,
    forwardEmail,
    markImportant,
    unMarkImportant,
    sendEmail,
    markAsUnread,
    spamMessage,
    removeSpam
} from "@/lib/integrations/gmail/gmail.service";
import { SendEmailInput } from "../integrations/gmail/gmail.types";


export async function toggleStarAction(
    userId: string,
    messageId: string,
    starred: boolean
) {
    if (starred) {
        return await unstarMessage(userId, messageId);
    }
    return await starMessage(userId, messageId);
}


export async function toggleArchiveAction(
    userId: string,
    messageId: string,
    archived: boolean
) {
    if (archived) {
        return await unarchiveMessage(userId, messageId);
    }
    return await archiveMessage(userId, messageId);
}
export async function toggleImportantAction(
    userId: string,
    messageId: string,
    important: boolean
) {
    if (important) {
        return await unMarkImportant(userId, messageId);
    }
    return await markImportant(userId, messageId);
}

export async function trashMessageAction(
    userId: string,
    messageId: string,) {
    return await trashMessage(userId,messageId);
}

export async function toggleSpamMessageAction(userId:string,messageId:string,spam:boolean){
    if (!spam){
       return await spamMessage(userId,messageId);
    }
    return await removeSpam(userId,messageId);
}

export async function markAsUnreadAction(userId:string,messageId:string) {
    return await markAsUnread(userId,messageId);
}

export async function sendEmailAction(
  userId: string,
  mode: "reply" | "forward",
  data: any
) {
  try {
    if (mode === "reply") {
      return await replyToEmail(userId, {
        to: data.to,
        subject: data.subject,
        body: data.body,
        threadId: data.threadId,
      });
    } else {
      return await forwardEmail(userId, {
        to: data.to,
        originalSubject: data.subject,
        originalBody: data.originalBody,
        additionalMessage: data.body,
      });
    }
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send email");
  }
}
export async function composeEmailAction(
  userId: string,
  data: SendEmailInput
) {
  try {
    return await sendEmail(userId, data);
  } catch (error) {
    console.error(
      "Failed to send email:",
      error
    );

    throw new Error(
      "Failed to send email"
    );
  }
}