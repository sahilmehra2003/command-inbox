"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useAgentStore } from "@/app/store/agent-store";
import { AgentMessage } from "./agent-message";

export function AgentInput() {
  const {
    input,
    setInput,
    addMessage,
    isLoading,
    setLoading,
  } = useAgentStore();

  const sendMessage = async () => {
    const message = input.trim();

    if (!message || isLoading) return;

    addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: message,
      createdAt:new Date(Date.now())
    });

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/ai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Something went wrong"
        );
      }

      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response,
        createdAt:new Date(Date.now())
      });
    } catch (error) {
        console.log("error is: ",error);
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content:"Sorry, something went wrong.",
        createdAt:new Date(Date.now())  
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="mx-auto flex max-w-4xl gap-2">
        <Textarea
          value={input}
          disabled={isLoading}
          placeholder="Ask me anything about your email or calendar..."
          className="min-h-14 resize-none"
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey
            ) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        

        <Button
        className="cursor-pointer"
          size="icon"
          disabled={
            isLoading || !input.trim()
          }
          onClick={sendMessage}
        >
          <Send className="size-4" />
        </Button> 
        
      </div>
    </div>
  );
}