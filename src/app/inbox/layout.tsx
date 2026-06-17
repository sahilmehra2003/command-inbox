import React from 'react'
import TopNavbar from '@/components/inbox/top-navbar'
import MailSidebar from '@/components/inbox/mail-sidebar'
import CalendarSidebar from '@/components/inbox/calendar-sidebar'
import CommandBar from '@/components/inbox/command-bar'
import { getCurrentUser } from '@/lib/auth/get-current-user'
import { redirect } from 'next/navigation'
import { getAllCalendarEvents } from '@/lib/corsair/corsair-calendar-service'
export default async function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const calendarEvents =
    await getAllCalendarEvents(user.id);

  return (
    <div className="h-screen flex flex-col">
      <TopNavbar />

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r">
          <MailSidebar />
        </aside>

        

        {children}

        <aside className="w-80 border-l">
          {/* <CalendarSidebar
            events={calendarEvents.events}
          /> */}
        </aside>
      </div>

      <CommandBar />
    </div>
  );
}