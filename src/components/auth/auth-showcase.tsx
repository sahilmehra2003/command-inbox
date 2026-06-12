import {
  Calendar,
  Mail,
  Sparkles,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Mail,
    title: "Unified Inbox",
    description: "All your emails in one smart inbox.",
  },
  {
    icon: Calendar,
    title: "Smart Meetings",
    description: "Schedule, join and manage meetings.",
  },
  {
    icon: Sparkles,
    title: "AI Assistant",
    description: "Summaries, actions and insights.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Enterprise-grade security.",
  },
];

export default function AuthShowcase() {
  return (
    <div className="flex h-full w-full flex-col justify-center px-12 py-10">
      {/* Hero */}

      <div className="mb-10">
        <h1 className="text-5xl font-bold leading-tight">
          Your inbox.
          <br />
          <span className="text-primary">
            Your command center.
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          Unify your emails, meetings and tasks with AI
          that helps you focus on what matters most.
        </p>
      </div>

      {/* Features */}

      <div className="grid grid-cols-2 gap-5">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border bg-card p-5"
          >
            <feature.icon className="mb-3 h-5 w-5 text-primary" />

            <h3 className="font-semibold">
              {feature.title}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Integrations */}

      <div className="mt-8">
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          Seamless integrations
        </p>

        <div className="flex gap-3">
          <div className="rounded-xl border px-4 py-2 text-sm">
            Gmail
          </div>

          <div className="rounded-xl border px-4 py-2 text-sm">
            Google Calendar
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}

      <div className="mt-10 rounded-3xl border bg-card p-6 shadow-lg">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-semibold">
            Command Inbox
          </h3>

          <div className="text-xs text-muted-foreground">
            Powered by Corsair
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 rounded-xl border p-4">
            <div className="space-y-3">
              <div className="h-10 rounded-md bg-muted" />
              <div className="h-10 rounded-md bg-muted" />
              <div className="h-10 rounded-md bg-muted" />
              <div className="h-10 rounded-md bg-muted" />
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <div className="space-y-3">
              <div className="h-20 rounded-md bg-muted" />
              <div className="h-16 rounded-md bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}