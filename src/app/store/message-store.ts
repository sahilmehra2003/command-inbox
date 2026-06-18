import { GmailMessageDetail } from "@/lib/integrations/gmail/gmail.types";
import { create } from "zustand";

interface MessageStore {
  message: GmailMessageDetail | null;

  setMessage: (
    message: GmailMessageDetail
  ) => void;

  updateMessage: (
    updates: Partial<GmailMessageDetail>
  ) => void;
}

export const useMessageStore =
  create<MessageStore>((set) => ({
    message: null,

    setMessage: (message) =>
      set({ message }),

    updateMessage: (updates) =>
      set((state) => ({
        message: state.message
          ? {
              ...state.message,
              ...updates,
            }
          : null,
      })),
  }));