import { GmailMessageDetail } from "@/lib/integrations/gmail/gmail.types";
import { create } from "zustand";

interface ComposeStore {
    isOpen: boolean;

    mode: "new" | "reply" | "forward" | null;

    message: GmailMessageDetail | null;

    openNew: () => void;

    openReply: (
        message: GmailMessageDetail
    ) => void;

    openForward: (
        message: GmailMessageDetail
    ) => void;

    close: () => void;
}

export const useComposeStore = create<ComposeStore>((set) => ({
    isOpen: false,
    mode: null,
    message: null,
    openNew: () =>set({ mode: "new", isOpen: true,message:null }),
    openReply: (message) => set({ message, isOpen: true, mode: "reply" }),
    openForward: (message) => set({ isOpen: true, message, mode: "forward" }),
    close: () => set({ isOpen: false, mode: null, message: null })
}))