"use client"
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";



const meetingFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  start: z.string().min(1, "Start time is required"),
  end: z.string().min(1, "End time is required"),
  // Keep this as a string so the Textarea can handle it easily
  attendees: z.string(), 
});

const meetingSubmitSchema = meetingFormSchema.extend({
  attendees: z.string().transform((val) => 
    val.split("\n").map((e) => e.trim()).filter(Boolean)
  ),
});

type MeetingFormValues = z.infer<typeof meetingFormSchema>;
type MeetingSubmitValues = z.infer<typeof meetingSubmitSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CreateMeetingDialog({ open, onOpenChange, onSubmit }: any) {
 const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<MeetingFormValues>({
  resolver: zodResolver(meetingFormSchema), // Use the form-friendly schema
  defaultValues: { 
    title: "", 
    description: "",
    location: "",
    start: "",
    end: "",
    attendees: "" 
  },
});

const onFormSubmit = async (
  data: MeetingFormValues
) => {
  const validatedData =
    meetingSubmitSchema.parse(data);

  await onSubmit({
    ...validatedData,

    start: new Date(
      validatedData.start
    ).toISOString(),

    end: new Date(
      validatedData.end
    ).toISOString(),
  });

  reset();
  onOpenChange(false);
};
return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Meeting + Notify</DialogTitle>
          <DialogDescription>Create a calendar event and send an AI-generated email.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <Controller name="title" control={control} render={({ field }) => <Input {...field} placeholder="Meeting Title" />} />
          <Controller name="description" control={control} render={({ field }) => <Textarea {...field} placeholder="Description" />} />
          <Controller 
            name="location" 
            control={control} 
            render={({ field }) => (
              <Input 
                {...field} 
                placeholder="Location (Optional)" 
              />
            )} 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Controller name="start" control={control} render={({ field }) => <Input type="datetime-local" {...field} />} />
            <Controller name="end" control={control} render={({ field }) => <Input type="datetime-local" {...field} />} />
          </div>

          <Controller name="attendees" control={control} render={({ field }) => (
            <Textarea {...field} placeholder="Emails (one per line)" className="min-h-32" />
          )} />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Meeting & Notify"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
