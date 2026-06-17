import {
  MoreVertical,
  AlertCircle,
  ShieldAlert,
  Mail,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { useMessageStore } from "@/app/store/message-store"; 
import { markAsUnreadAction, toggleImportantAction,toggleSpamMessageAction } from "@/lib/actions/gmail-actions";

interface DropDownMenuListProps {
    userId: string;
}


export default function DropDownMenuList({userId}:DropDownMenuListProps){
   const { message, updateMessage } = useMessageStore();
     if (!message) {
        return null
    }
    const importantAction=async (userId:string) => {
        const current =message.isImportant ?? false;

        updateMessage({
          isImportant: !current,
        });

        try {
          await toggleImportantAction(
            userId,
            message.id,
            current
          );
        } catch {
          updateMessage({
            isImportant: current,
          });
        }
    }
    const spamAction=async(userId:string)=>{
        const current=message.isSpam ?? false;
        updateMessage({
          isSpam: !current,
        });
        try {
            await toggleSpamMessageAction(
                userId,
                message.id,
                current
            )
        } catch {
        updateMessage({
          isSpam: current,
        }); 
        }
    }
    const markUnreadMessageAction=async (userId:string) => {
        await markAsUnreadAction(
          userId,
          message.id
        );
        updateMessage({
          isUnread: true,
        });
    }
   
    return(
        <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button className="rounded-md p-2 hover:bg-muted cursor-pointer">
      <MoreVertical className="h-4 w-4" />
    </button>
  </DropdownMenuTrigger>

  <DropdownMenuContent align="end">
    <DropdownMenuItem
      onClick={()=>importantAction(userId)}
    >
      <AlertCircle className="mr-2 h-4 w-4" />

      {message.isImportant
        ? "Not Important"
        : "Important"}
    </DropdownMenuItem>

    <DropdownMenuItem
      onClick={()=>spamAction(userId)}
    >
      <ShieldAlert className="mr-2 h-4 w-4" />

      {message.isSpam
        ? "Remove Spam"
        : "Mark Spam"}
    </DropdownMenuItem>

    {!message.isUnread && (<DropdownMenuItem
      onClick={()=>markUnreadMessageAction(userId)}
    >
      <Mail className="mr-2 h-4 w-4" />
      Mark Unread
    </DropdownMenuItem>)}
  </DropdownMenuContent>
        </DropdownMenu>
    )
}
