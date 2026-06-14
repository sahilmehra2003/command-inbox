export const HeroSection = () => {
  return (
    <section className="text-center space-y-4">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border bg-background">
        ⚡
      </div>

      <h1 className="text-4xl font-bold tracking-tight">
        Connect Your Workspace
      </h1>

      <p className="mx-auto max-w-2xl text-muted-foreground">
        Connect Gmail and Google Calendar to unlock AI-powered email
        summaries, meeting insights, scheduling assistance, and more.
      </p>
    </section>
  );
};