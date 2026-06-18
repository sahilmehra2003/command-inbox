"use server";

import { getCurrentUser } from "../auth/get-current-user";
import { CreateCalendarEventInput } from "../integrations/calenadr/calendar.types";
import { createMeetingAndNotify } from "../workflows/create-metting-notify.workflow";




export async function createMeetingAndNotifyAction(input:CreateCalendarEventInput) {
  try {
    const user = await getCurrentUser();
    
    if (!user?.id) {
      return { success: false, error: "Unauthorized: User not found." };
    }

    const result = await createMeetingAndNotify(user.id, input);

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to create meeting:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred." 
    };
  }
}