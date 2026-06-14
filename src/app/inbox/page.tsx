import React from 'react'
import TopNavbar from '@/components/inbox/top-navbar'
import MessageList from '@/components/inbox/message-list'
import MailSidebar from '@/components/inbox/mail-sidebar'
import CalendarSidebar from '@/components/inbox/calendar-sidebar'
import CommandBar from '@/components/inbox/command-bar'
import { getCurrentUser } from '@/lib/auth/get-current-user'
import { getTenantMessageList, getThread } from '@/lib/corsair/corsair-gmail-service'
import { redirect } from 'next/navigation'
import { getAllCalendarEvents } from '@/lib/corsair/corsair-calendar-service'

const InboxPage = async() => {
  const user=await getCurrentUser();
      if (!user) {
          redirect("/auth/login");
      }
      const messages=await getTenantMessageList(user.id);   
     // await getThread(user.id);
     const calendarEvents=await getAllCalendarEvents(user.id);
     console.log("calendar Events: ",calendarEvents);
  return (
    <div className="h-screen flex flex-col">
  <TopNavbar />

  <div className="flex flex-1 overflow-hidden">
    <aside className="w-64 border-r">
      <MailSidebar />
    </aside>

    <main className="flex-1 overflow-y-auto">
      <MessageList messages={messages.messages}/>
    </main>

    <aside className="w-80 border-l">
      <CalendarSidebar events={calendarEvents.events} />
    </aside>
  </div>

  <CommandBar />
</div>
  )
}

export default InboxPage