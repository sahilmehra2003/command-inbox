/* eslint-disable @typescript-eslint/no-explicit-any */

import { CalendarEvent } from "./calendar.types";


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