
import { GmailMessageDetail,markAsRead } from "@/lib/corsair/corsair-gmail-service";

import MediaDetailClient from "./MediaDetailClient";


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