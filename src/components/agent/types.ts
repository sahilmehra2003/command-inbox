import {
  Calendar,
  Mail,
  ClipboardList,
  Sparkles,
} from "lucide-react";


export interface ChatMessage {
  id: string;
  role: "user" | "assistant";

  content?: string;

  type?: string;

  data?: unknown;

  createdAt: Date;
}

export const AGENT_WORKFLOWS = [
  {
    id: "daily-brief",
    title: "Daily Brief",
    prompt: "Give me my daily brief",
    description:
      "Get today's priorities, emails and meetings",
    icon: Sparkles,
  },
  {
    id: "inbox-summary",
    title: "Summarize Inbox",
    prompt: "Summarize today's inbox",
    description:
      "Review today's important emails",
    icon: Mail,
  },
  {
    id: "today-agenda",
    title: "Today's Agenda",
    prompt: "Show today's agenda",
    description:
      "See today's meetings",
    icon: Calendar,
  },
  {
    id: "tomorrow-agenda",
    title: "Tomorrow's Agenda",
    prompt: "Show tomorrow's agenda",
    description:
      "See tomorrow's meetings",
    icon: ClipboardList,
  },
  {
    id: "meeting-notify",
    title: "Create Meeting + Notify",
    prompt:
      "Create a meeting and notify attendees",
    description:
      "Schedule a meeting and send invitations",
    icon: Calendar,
  },
];