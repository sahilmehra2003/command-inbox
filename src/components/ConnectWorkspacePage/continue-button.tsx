type ContinueButtonProps = {
  canContinue: boolean;
};

export const ContinueButton = ({
  canContinue,
}: ContinueButtonProps) => {
  return (
    <div className="flex justify-center">
      <a
        href="/agent"
        className={`rounded-xl px-6 py-3 font-medium ${
          canContinue
            ? "bg-primary text-primary-foreground"
            : "pointer-events-none opacity-50 bg-muted"
        }`}
      >
        Continue to Command Inbox
      </a>
    </div>
  );
};