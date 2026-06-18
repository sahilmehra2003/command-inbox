import {
  Calendar,
  CheckCircle2,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateMeetingAndNotifyResult } from "@/lib/integrations/calenadr/calendar.types";

export function MeetingCreatedCard({
  data,
}: {
  data: CreateMeetingAndNotifyResult;
}) {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="size-5" />
          Meeting Created
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="font-semibold">
            {data.event.title}
          </div>

          <div className="text-sm text-muted-foreground">
            {data.event.description}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="size-4" />
          {new Date(
            data.event.start
          ).toLocaleString()}
        </div>

        <div className="flex items-center gap-2">
          <Users className="size-4" />
          {data.emailsSent} attendee(s)
          notified
        </div>
      </CardContent>
    </Card>
  );
}