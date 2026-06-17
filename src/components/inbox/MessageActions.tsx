"use client";
import {
  Archive,
  ArchiveRestore,
  Star,
  Trash2,
  Reply,
  Forward
} from "lucide-react";


import { toggleArchiveAction, toggleStarAction, trashMessageAction,toggleImportantAction } from "@/lib/actions/gmail-actions";
import { useMessageStore } from "@/app/store/message-store";
import { useComposeStore } from "@/app/store/compose-store";
import DropDownMenuList from "./DropDownMenuList";




interface MessageActionsProps {
  userId:string;
}


export default function MessageActions({
  userId,
}:MessageActionsProps ){
    const message=useMessageStore((state)=>state.message);
    const updateMessage = useMessageStore((state) => state.updateMessage);
     const openForward=useComposeStore((state)=>state.openForward);
    const openReply=useComposeStore((state)=>state.openReply);
    if (!message) {
        return null
    }
  return (
    <div className="flex items-center gap-2">
      <button className="rounded-md p-2 hover:bg-muted cursor-pointer" onClick={()=>openReply(message)}>
                  <Reply className="h-4 w-4" />
      </button>
      <button className="rounded-md p-2 hover:bg-muted cursor-pointer" onClick={()=>openForward(message)}>
        <Forward className="h-4 w-4" />
      </button>  
      <button
      className="rounded-md p-2 hover:bg-muted cursor-pointer"
      onClick={async () => {
      const currentArchived =message.isArchived;

    updateMessage({
      isArchived: !currentArchived,
    });

    try {
      await toggleArchiveAction(
        userId,
        message.id,
        currentArchived
      );
    } catch {
      updateMessage({
        isArchived: currentArchived,
      });
    }
  }}
>
  {message.isArchived ? (
    <ArchiveRestore className="h-4 w-4" />
  ) : (
    <Archive className="h-4 w-4" />
  )}
</button>

      <button 
      className="rounded-md p-2 hover:bg-muted cursor-pointer"
      onClick={async()=>await trashMessageAction(userId,message.id)}>
        <Trash2 className="h-4 w-4"  />
      </button>

    <button
  className="rounded-md p-2 hover:bg-muted cursor-pointer"
  onClick={async () => {
    const currentStarred =
      message.isStarred;

    updateMessage({
      isStarred: !currentStarred,
    });

    try {
      await toggleStarAction(
        userId,
        message.id,
        currentStarred
      );
    } catch {
      updateMessage({
        isStarred: currentStarred,
      });
    }
  }}
>
  <Star
    className={
      message.isStarred
        ? "fill-yellow-400 text-yellow-400 h-4 w-4"
        : "h-4 w-4"
    }
  />
</button>
    <DropDownMenuList userId={userId}/>
    </div>
  );
}