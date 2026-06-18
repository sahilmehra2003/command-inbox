import {
  Calendar,
  Flame,
  Lightbulb,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DailyBriefCardProps {
  data: {
    summary: string;
    topPriorities: string[];
    upcomingMeetings: string[];
    recommendations: string[];
  };
}

export function DailyBriefCard({
  data,
}: DailyBriefCardProps) {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>
          📋 Daily Brief
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <p>{data.summary}</p>

        <div>
          <div className="mb-2 flex items-center gap-2 font-medium">
            <Flame className="size-4" />
            Top Priorities
          </div>

          <ul className="space-y-1">
            {data.topPriorities.map(
              (item) => (
                <li key={item}>
                  • {item}
                </li>
              )
            )}
          </ul>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 font-medium">
            <Calendar className="size-4" />
            Upcoming Meetings
          </div>

          <ul className="space-y-1">
            {data.upcomingMeetings.map(
              (item) => (
                <li key={item}>
                  • {item}
                </li>
              )
            )}
          </ul>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 font-medium">
            <Lightbulb className="size-4" />
            Recommendations
          </div>

          <ul className="space-y-1">
            {data.recommendations.map(
              (item) => (
                <li key={item}>
                  • {item}
                </li>
              )
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}