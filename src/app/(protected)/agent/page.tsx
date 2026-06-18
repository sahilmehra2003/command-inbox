import { AgentChat } from '@/components/agent/agent-chat';
import { AgentInput } from '@/components/agent/agent-input';
import AgentHeader from '@/components/agent/agent.header';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';


const AgentPage = async() => {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/auth/login");
    }
  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      <AgentHeader />
       <Button
    asChild
    variant="outline"
    size="sm"
  >
    <Link href="/">
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Home
    </Link>
  </Button>

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