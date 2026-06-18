import { AgentChat } from '@/components/agent/agent-chat';
import { AgentInput } from '@/components/agent/agent-input';
import AgentHeader from '@/components/agent/agent.header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { redirect } from 'next/navigation';


const AgentPage = async() => {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/auth/login");
    }
  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      <AgentHeader />

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <AgentChat
            userName={user.name}
          />
        </ScrollArea>
      </div>

      <AgentInput />
    </div>
    
  )
}

export default AgentPage;