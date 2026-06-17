'use client';
import { useForm,Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { composeEmailAction, sendEmailAction } from "@/lib/actions/gmail-actions";
import { GmailMessageDetail } from "@/lib/corsair/corsair-gmail-service";
import { useEffect, useState } from "react";
import { useComposeStore } from "@/app/store/compose-store";

// Define a unified schema
const formSchema = z.object({
  to: z.email({error:"Invalid email address"}),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Message body is required"),
   cc: z.string().optional(),
  bcc: z.string().optional(),
  
});

interface ComposeDialogProps {
  userId: string;
}

const ComposeDialog = ({ userId }: ComposeDialogProps) => {
  const mode=useComposeStore((state)=>state.mode);
  const message=useComposeStore((state)=>state.message)
  const onClose=useComposeStore((state)=>state.close)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: { to: "", subject: "", body: "",cc:"",bcc:"" },
  });
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
useEffect(() => {
  if (mode === "new") {
    form.reset({
      to: "",
      cc: "",
      bcc: "",
      subject: "",
      body: "",
    });

    return;
  }

  if (message) {
    form.reset({
      to:
        mode === "reply"
          ? message.senderEmail
          : "",
      subject:
        mode === "reply"
          ? `Re: ${message.subject}`
          : `Fwd: ${message.subject}`,
      body: "",
    });
  }
}, [mode, message, form]);
  
  if (!mode) return null;
  if (mode !== "new" && !message) {
  return null;
  }
  const emailMessage =message!

  const parseRecipients = (value?: string) =>
  value
    ?.split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (mode === "new") {
      await composeEmailAction(userId, {
        to: values.to,
        cc: parseRecipients(values.cc),
        bcc: parseRecipients(values.bcc),
        subject: values.subject,
        body: values.body,
      });
    }else{ 
        await sendEmailAction(userId, mode!, {
        ...values,
        threadId: emailMessage.threadId, 
        originalBody: emailMessage.textBody,
      });
    }
      onClose();
    } catch (error) {
      if (error instanceof Error){
         toast.error(error.message)
      }
      throw new Error("Error in sending email");
    }
  };

  return (
    <div className="fixed bottom-0 right-8 z-50 flex h-125 w-175 flex-col overflow-hidden rounded-t-xl border bg-background shadow-2xl">
   <form
  onSubmit={form.handleSubmit(onSubmit)}
  className="flex h-full flex-col"
>
  <div className="flex items-center justify-between border-b px-4 py-3">
   <h3 className="font-medium">
  {mode === "new"
    ? "New Message"
    : mode === "reply"
    ? "Reply"
    : "Forward"}
</h3>
    <Button className="cursor-pointer" variant="ghost" size="icon" onClick={onClose} type="button">
      <X className="h-4 w-4" />
    </Button>
  </div>

  



  <div className="border-b px-4 py-2">
  <div className="flex items-center gap-2">
    <Controller
      control={form.control}
      name="to"
      render={({ field }) => (
        <Input
          {...field}
          placeholder="Recipients"
          className="border-none shadow-none focus-visible:ring-0 p-0"
        />
      )}
    />

    {mode === "new" && (
      <>
        <button
          type="button"
          onClick={() => setShowCc((prev) => !prev)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Cc
        </button>

        <button
          type="button"
          onClick={() => setShowBcc((prev) => !prev)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Bcc
        </button>
      </>
    )}
  </div>

  {form.formState.errors.to && (
    <p className="text-xs text-red-500">
      {form.formState.errors.to.message}
    </p>
  )}
</div>

    {mode === "new" && showCc && (
  <div className="border-b px-4 py-2">
    <Controller
      control={form.control}
      name="cc"
      render={({ field }) => (
        <Input
          {...field}
          placeholder="Cc"
          className="border-none shadow-none focus-visible:ring-0 p-0"
        />
      )}
    />
  </div>
)}

  {mode === "new" && showBcc && (
  <div className="border-b px-4 py-2">
    <Controller
      control={form.control}
      name="bcc"
      render={({ field }) => (
        <Input
          {...field}
          placeholder="Bcc"
          className="border-none shadow-none focus-visible:ring-0 p-0"
        />
      )}
    />
  </div>
)}

  <div className="border-b px-4 py-2">
  <Controller
    control={form.control}
    name="subject"
    render={({ field }) => (
      <Input
        {...field}
        placeholder="Subject"
        className="border-none shadow-none focus-visible:ring-0 p-0"
      />
    )}
  />

  {form.formState.errors.subject && (
    <p className="text-xs text-red-500">
      {form.formState.errors.subject.message}
    </p>
  )}
</div>

  <div className="flex-1 p-4">
    <Controller
      control={form.control}
      name="body"
      render={({ field }) => (
        <Textarea
          {...field}
          placeholder="Write your message..."
          className="h-full resize-none"
        />
      )}
    />
  </div>

  {mode === "reply" && (
    <div className="border-t bg-muted/30 p-4 text-xs text-muted-foreground overflow-y-auto">
      <p>On {emailMessage.formattedDate}, {emailMessage.senderName} wrote:</p>
      <p className="mt-2 line-clamp-4">{emailMessage.textBody}</p>
    </div>
  )}

  <div className="flex items-center justify-end gap-2 border-t p-4">
    <Button className="cursor-pointer" variant="outline" onClick={onClose} type="button">
      Cancel
    </Button>
    <Button
      type="submit"
    >
      <Send className="mr-2 h-4 w-4" /> Send
    </Button>
  </div>
</form>
    </div>
  );
};

export default ComposeDialog;