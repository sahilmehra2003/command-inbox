type IntegrationCardProps = {
  name: string;
  description: string;
  features: string[];
  connected?: boolean;
  connectUrl: string;
};

export const IntegrationCard = ({
  name,
  description,
  features,
  connected,
  connectUrl,
}: IntegrationCardProps) => {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{name}</h3>

        {connected ? (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Connected
          </span>
        ) : (
          <span className="rounded-full bg-muted px-3 py-1 text-xs">
            Not Connected
          </span>
        )}
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        {description}
      </p>

      <ul className="mt-5 space-y-2 text-sm">
        {features.map((feature) => (
          <li key={feature}>✓ {feature}</li>
        ))}
      </ul>

      <div className="mt-6">
        {connected ? (
          <button
            disabled
            className="w-full rounded-lg border py-2 text-sm"
          >
            Connected
          </button>
        ) : (
          <a
            href={connectUrl}
            className="block w-full rounded-lg bg-primary px-4 py-2 text-center text-primary-foreground"
          >
            Connect {name}
          </a>
        )}
      </div>
    </div>
  );
};