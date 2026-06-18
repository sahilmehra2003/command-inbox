import {
  CalendarDays,
  Clock,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarEvent } from "@/lib/integrations/calenadr/calendar.types";

export function AgendaCard({
  events,
}: {
  events: CalendarEvent[];
}) {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="size-5" />
          Agenda
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border-l-2 pl-4"
            >
              <div className="font-medium">
                {event.title}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-3" />
                {new Date(
                  event.start
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute:
                    "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}