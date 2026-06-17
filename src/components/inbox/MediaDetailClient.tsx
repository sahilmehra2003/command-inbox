"use client"
import React, { useEffect } from 'react'
import {
  Forward,
  Reply,
  ArrowLeft
} from "lucide-react";

interface MailDetailViewProps {
  message: GmailMessageDetail;
  userId:string
}

import MessageActions from "./MessageActions";
import { useRouter } from 'next/navigation';
import { GmailMessageDetail } from '@/lib/corsair/corsair-gmail-service';
import ComposeDialog from './ComposeDialog';
import { useMessageStore } from '@/app/store/message-store';
import { useComposeStore } from '@/app/store/compose-store';
const MediaDetailClient = ({ message,
  userId}:MailDetailViewProps) => {
    const router=useRouter();
    const mode=useComposeStore((state)=>state.mode);
    const openForward=useComposeStore((state)=>state.openForward);
    const openReply=useComposeStore((state)=>state.openReply);

    const  {setMessage}=useMessageStore()

useEffect(() => {
  setMessage(message);
}, [message]);
   
  return (
     <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl">
        {/* Actions */}
        <div className="flex items-center gap-2 border-b px-6 py-3">
          <button className="rounded-md p-2 hover:bg-muted cursor-pointer"
          onClick={()=>router.back()}>
            <ArrowLeft className="h-4 w-4"/>
          </button>  
          

          <MessageActions
          userId={userId}
          />
        </div>
        {/* Header */}
        <div className="border-b px-8 py-6">
          <h1 className="text-2xl font-semibold">
            {message.subject}
          </h1>

          <div className="mt-6 flex items-start justify-between">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-medium">
                {message.senderName?.[0]}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {message.senderName}
                  </p>

                  <span className="text-sm text-muted-foreground">
                    &lt;{message.senderEmail}&gt;
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  to {message.to}
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {message.formattedDate}
            </p>
          </div>
        </div>

        

        {/* Attachments */}
        {message.attachments.length > 0 && (
          <div className="border-b px-8 py-4">
            <h3 className="mb-3 text-sm font-medium">
              Attachments
            </h3>

            <div className="flex flex-wrap gap-2">
              {message.attachments.map(
                (attachment) => (
                  <div
                    key={attachment.filename}
                    className="rounded-lg border px-3 py-2 text-sm"
                  >
                    {attachment.filename}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="px-8 py-6">
          {message.htmlBody ? (
            <div  className="prose prose-neutral dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{__html: message.htmlBody,}}/>
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-sm">
              {message.textBody}
            </pre>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="border-t px-8 py-4">
          <div className="flex gap-3">
            <button 
            className="flex items-center gap-2.5 rounded-lg border px-2 py-1.5  text-sm hover:bg-muted cursor-pointer"
            onClick={()=>openReply(message)}>
                 <Reply/>
             <span> Reply</span>
            </button>

            <button 
            className="flex items-center gap-2.5 rounded-lg border px-2 py-2 text-sm hover:bg-muted cursor-pointer"
            onClick={()=>openForward(message)}>
              <Forward/> Forward
            </button>
          </div>
        </div>
        <div>
            {mode &&  <ComposeDialog
            userId={userId}
            />
             }
        </div>
      </div>
    </div>
  )
}

export default MediaDetailClient