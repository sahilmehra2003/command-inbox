"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarEvent } from "@/lib/corsair/corsair-calendar-service";
import { Button } from "@/components/ui/button";
import { enUS } from "react-day-picker/locale/en-US";
import { format } from "date-fns";

interface CalendarSidebarProps {
  events: CalendarEvent[];
}

const CalendarSidebar = ({  
  events,
}: CalendarSidebarProps) => {
    

  const [selectedDate, setSelectedDate] =
  useState<Date | undefined>(new Date());

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) =>
          new Date(a.start).getTime() -
          new Date(b.start).getTime()
      ),
    [events]
  );

  const today = new Date();

  const todayEvents = sortedEvents.filter((event) => {
    const eventDate = new Date(event.start);

    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    );
  });

  const upcomingEvents = sortedEvents
    .filter(
      (event) =>
        new Date(event.start).getTime() >
        today.getTime()
    )
    .slice(0, 5);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <h2 className="font-semibold">
          Calendar
        </h2>
      </div>

      {/* Calendar */}
      <div className="border-b p-3">
        <Calendar
          mode="single"
          selected={selectedDate}
          locale={enUS}
          onSelect={(date) =>
            date && setSelectedDate(date)
          }
          className="w-full"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Today's Events */}
        <div className="p-4">
          <h3 className="mb-3 text-sm font-medium">
            Today&apos;s Events
          </h3>

          <div className="space-y-2">
            {todayEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No events today
              </p>
            ) : (
              todayEvents.map((event) => (
                <button
                  key={event.id}
                  className="
                    flex w-full items-center gap-2
                    rounded-md p-2 text-left
                    hover:bg-muted
                  "
                >
                  <div className="h-2 w-2 rounded-full bg-blue-500" />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {event.title}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {format(new Date(event.start), "h:mm a")}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Upcoming */}
        <div className="border-t p-4">
          <h3 className="mb-3 text-sm font-medium">
            Upcoming
          </h3>

          <div className="space-y-2">
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No upcoming events
              </p>
            ) : (
              upcomingEvents.map((event) => (
                <button
                  key={event.id}
                  className="
                    flex w-full items-center gap-2
                    rounded-md p-2 text-left
                    hover:bg-muted
                  "
                >
                  <div className="h-2 w-2 rounded-full bg-blue-500" />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">
                      {event.title}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {format(new Date(event.start), "MMM d, yyyy")}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-3">
        <Button className="w-full">
          + New Event
        </Button>
      </div>
    </div>
  );
};

export default CalendarSidebar;