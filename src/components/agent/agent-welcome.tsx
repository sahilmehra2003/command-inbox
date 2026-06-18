


interface AgentWelcomeProps {
  userName: string;
}


function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";

  return "Good evening";
}

const AgentWelcome = ({userName}:AgentWelcomeProps) => {
  return (
    <>
     <h1 className="text-3xl font-bold text-center">
        {getGreeting()}, {userName} 👋
      </h1>

      <p className="mt-3 text-lg text-muted-foreground text-center">
        Choose a workflow or ask me anything about your
        email and calendar.
      </p>
    </>
  )
}

export default AgentWelcome