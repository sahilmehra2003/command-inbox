import { corsair } from "@/server/corsair";


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

export const transformCalendarEvent = (
    event: any
): CalendarEvent => {
    return {
        id: event.id ?? "",
        title: event.summary ?? "Untitled Event",
        description: event.description ?? "",
        status: event.status ?? "",

        start:
            event.start?.dateTime ??
            event.start?.date ??
            "",

        end:
            event.end?.dateTime ??
            event.end?.date ??
            "",

        htmlLink: event.htmlLink,

        createdAt: event.created,
        updatedAt: event.updated,
    };
};

export const getTenant = async (tenantId: string) => {
    const tenant = await corsair.withTenant(tenantId);

    if (!tenant) {
        throw new Error("Corsair account not found");
    }
    return tenant
}


export const getAllCalendarEvents = async (
    tenantId: string
): Promise<CalendarEventsResponse> => {
    const tenant = await getTenant(tenantId);

    const response =
        await tenant.googlecalendar.api.events.getMany({
            maxResults: 25,
        });

    return {
        events:
            response.items?.map(
                transformCalendarEvent
            ) ?? [],

        summary: response.summary,
        timeZone: response.timeZone,
        nextSyncToken: response.nextSyncToken,
    };
};

export const getCalendarEventById = async (tenantId: string, eventId: string): Promise<CalendarEvent> => {
    const tenant = await getTenant(tenantId);

    const event = await tenant.googlecalendar.api.events.get({ id: eventId });
    if (!event) {
        throw new Error("Event not found");
    }
    return transformCalendarEvent(event)
}

export const createCalendarEvent = async (
    tenantId: string,
    input: CreateCalendarEventInput
): Promise<CalendarEvent> => {
    const tenant = await getTenant(tenantId);

    const event =
        await tenant.googlecalendar.api.events.create({
            event: {
                summary: input.title,
                description: input.description,
                location: input.location,

                start: {
                    dateTime: input.start,
                },

                end: {
                    dateTime: input.end,
                },

                attendees:
                    input.attendees?.map((email) => ({
                        email,
                    })) ?? [],
            },
        });

    return transformCalendarEvent(event);
};

export const updateCalendarEvent = async (
    tenantId: string,
    input: UpdateCalendarEventInput
): Promise<CalendarEvent> => {
    const tenant = await getTenant(tenantId);

    const event =
        await tenant.googlecalendar.api.events.update({
            id: input.eventId,

            event: {
                ...(input.title && {
                    summary: input.title,
                }),

                ...(input.description && {
                    description: input.description,
                }),

                ...(input.location && {
                    location: input.location,
                }),

                ...(input.start && {
                    start: {
                        dateTime: input.start,
                    },
                }),

                ...(input.end && {
                    end: {
                        dateTime: input.end,
                    },
                }),

                ...(input.attendees && {
                    attendees: input.attendees.map(
                        (email) => ({
                            email,
                        })
                    ),
                }),
            },
        });

    return transformCalendarEvent(event);
};

export const deleteCalendarEventById = async (tenantId: string, eventId: string) => {
    const tenant = await getTenant(tenantId);

    await tenant.googlecalendar.api.events.delete({
        id: eventId
    });
}

export const getAvailability = async (
    tenantId: string,
    { timeMin, timeMax }: GetAvailabilityInput
): Promise<CalendarAvailability> => {
    const tenant = await getTenant(tenantId);

    const response =
        await tenant.googlecalendar.api.calendar.getAvailability({
            timeMin,
            timeMax,
        });

    return {
        timeMin: response.timeMin ?? timeMin,
        timeMax: response.timeMax! ?? timeMax,
        calendars: response.calendars! ?? {},
    };
};