import {
  AlertTriangle,
  Mail,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { InboxSummary } from "@/lib/integrations/calenadr/calendar.types";

export function InboxSummaryCard({
  data,
}: {
  data: InboxSummary;
}) {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="size-5" />
          Inbox Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge>
            Total: {data.totalEmails}
          </Badge>

          <Badge variant="destructive">
            Critical: {data.criticalCount}
          </Badge>

          <Badge>
            High: {data.highCount}
          </Badge>

          <Badge variant="secondary">
            Medium: {data.mediumCount}
          </Badge>

          <Badge variant="outline">
            Low: {data.lowCount}
          </Badge>
        </div>

        <p>{data.summary}</p>

        <div>
          <div className="mb-2 flex items-center gap-2 font-medium">
            <AlertTriangle className="size-4" />
            Recommended Actions
          </div>

          <ul className="space-y-1">
            {data.recommendedActions.map(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (item:any) => (
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