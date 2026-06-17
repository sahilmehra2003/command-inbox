"use client";

import {
  Inbox,
  Mail,
  Star,
  AlertCircle,
  Send,
  ShieldAlert,
  Trash2,
  Pencil,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useComposeStore } from "@/app/store/compose-store";
import Link from "next/link";
const items = [
  {
    id: "inbox",
    label: "Inbox",
    icon: Inbox,
  },
  {
    id: "unread",
    label: "Unread",
    icon: Mail,
  },
  {
    id: "starred",
    label: "Starred",
    icon: Star,
  },
  {
    id: "important",
    label: "Important",
    icon: AlertCircle,
  },
  {
    id: "sent",
    label: "Sent",
    icon: Send,
  },
  {
    id: "spam",
    label: "Spam",
    icon: ShieldAlert,
  },
  {
    id: "trash",
    label: "Trash",
    icon: Trash2,
  },
];


export default function MailSidebar() {
  const openNew = useComposeStore(
    (state) => state.openNew
  );
  const searchParams = useSearchParams();
const activeFilter = searchParams.get('filter');

  return (
    <aside className="flex h-full w-64 flex-col border-r">
      <div className="p-4">
        <Button
          className="w-full justify-start gap-2"
          onClick={openNew}
        >
          <Pencil className="h-4 w-4" />
          Compose
        </Button>
      </div>

      <nav className="space-y-1 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
           <Link
            href={`/inbox?filter=${item.id}`}
            key={item.id}
            className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            activeFilter === item.id 
            ? "bg-muted font-medium text-primary" 
            : "hover:bg-muted text-muted-foreground" )}>
           <Icon className="h-4 w-4" />{item.label}
           </Link>
          );
        })}
      </nav>
    </aside>
  );
}