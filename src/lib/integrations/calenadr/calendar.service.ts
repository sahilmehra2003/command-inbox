import { getTenant } from "@/lib/corsair/get-tenant";
import { BusySlot, CalendarAvailability, CalendarEvent, CalendarEventsResponse, CreateCalendarEventInput, GetAvailabilityInput, UpdateCalendarEventInput } from "./calendar.types";
import { transformCalendarEvent } from "./calendar.transformer";

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
                    input.attendees?.map((email: string) => ({
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
                        (email: string) => ({
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

    // Transform the calendars data to match your local interface
    const normalizedCalendars: Record<string, { busy: BusySlot[] }> = {};

    if (response.calendars) {
        Object.entries(response.calendars).forEach(([key, value]) => {
            normalizedCalendars[key] = {
                // Filter ensures we only include valid objects if necessary
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                busy: (value.busy ?? []).map((slot: any) => ({
                    start: slot.start ?? '',
                    end: slot.end ?? ''
                }))
            };
        });
    }

    return {
        timeMin: response.timeMin ?? timeMin,
        timeMax: response.timeMax ?? timeMax,
        calendars: normalizedCalendars,
    };
};