import { ChatMessage } from "@/components/agent/types";
import { create } from "zustand";

interface AgentStore {
    messages: ChatMessage[];
    input: string;
    isLoading: boolean;

    setInput: (
        value: string
    ) => void,
    addMessage: (
        message: ChatMessage
    ) => void;

    setLoading: (
        value: boolean
    ) => void;

    clearMessages: () => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
    isLoading: false,
    input: "",
    messages: [],
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    setInput:(value)=>set({input:value}),
    clearMessages: () => set({ messages: [] }),
    setLoading: (value) => set({ isLoading: value }),
}))