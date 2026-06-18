
export interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    status: string;

    start: string;
    end: string;

    htmlLink?: string;

    createdAt?: string;
    updatedAt?: string;
}

export interface CalendarEventsResponse {
    events: CalendarEvent[];

    summary?: string;
    timeZone?: string;
    nextSyncToken?: string;
}

export interface BusySlot {
    start: string;
    end: string;
}

export interface CalendarAvailability {
    timeMin: string;
    timeMax: string;
    calendars: Record<
        string,
        {
            busy: BusySlot[];
        }
    >;
}

export interface GetAvailabilityInput {
    timeMin: string;
    timeMax: string;
}

export interface CreateCalendarEventInput {
    title: string;
    description?: string;
    location?: string;
    start: string;
    end: string;
    attendees?: string[];
}

export interface UpdateCalendarEventInput {
    eventId: string;
    title?: string;
    description?: string;
    location?: string;
    start?: string;
    end?: string;
    attendees?: string[];
}

export interface MeetingInviteEmail {
    subject: string;
    body: string;
}

export interface CreateMeetingAndNotifyResult {
    event: CalendarEvent;
    emailSubject: string;
    emailBody: string;
    emailsSent: number;
}

export interface DailyBrief {
    summary: string;
    topPriorities: string[];
    upcomingMeetings: string[];
    recommendations: string[];
}
export interface InboxSummary {
    totalEmails: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    summary: string;
    recommendedActions: string[];
}