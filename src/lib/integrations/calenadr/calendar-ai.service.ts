import { getTenant } from "@/lib/corsair/get-tenant";
import { transformCalendarEvent } from "./calendar.transformer";
import { CalendarEvent } from "./calendar.types";

export async function getAgenda(
    tenantId: string,
    date: Date
): Promise<CalendarEvent[]> {
    const tenant = await getTenant(
        tenantId
    );

    const startOfDay = new Date(date);
    startOfDay.setHours(
        0,
        0,
        0,
        0
    );

    const endOfDay = new Date(date);
    endOfDay.setHours(
        23,
        59,
        59,
        999
    );

    const response =await tenant.googlecalendar.api.events.getMany({
            timeMin:
                startOfDay.toISOString(),
            timeMax:
                endOfDay.toISOString(),
            singleEvents: true,
            orderBy: "startTime",
            maxResults: 50,
        });

    return (
        response.items?.map(
            transformCalendarEvent
        ) ?? []
    );
}