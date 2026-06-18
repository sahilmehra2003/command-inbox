


import { GmailMessageDetail } from "@/lib/integrations/gmail/gmail.types";
import MediaDetailClient from "./MediaDetailClient";
import { markAsRead } from "@/lib/integrations/gmail/gmail.service";


interface MailDetailViewProps {
  message: GmailMessageDetail;
  userId:string
}

const MailDetailView = async({
  message,
  userId
}: MailDetailViewProps) => {
    await markAsRead(userId,message.id)
  return (
    <>
    <MediaDetailClient message={message} userId={userId}/>
    </>
     
    );
};

export default MailDetailView;