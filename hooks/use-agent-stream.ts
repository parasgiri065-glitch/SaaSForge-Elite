"use client";

import { useCallback, useRef, useState } from "react";
import {
  appendChunkToAssistantMessage,
  completeAllStreamingMessages,
  completeAssistantMessage,
  createStreamingAssistantMessage,
  createUserChatMessage,
  failAssistantMessage,
} from "@/lib/agents/create-chat-message";
import { simulateAgentTokenStream } from "@/lib/agents/simulate-token-stream";
import { agentPromptSchema } from "@/lib/security/api-schemas";
import type { ChatMessage } from "@/types/agent";

export type AgentStreamState = {
  messages: ChatMessage[];
  isStreaming: boolean;
  send: (prompt: string) => Promise<void>;
  stop: () => void;
};

/**
 * Transcript + streaming controller for the workspace agent.
 * Data/simulation lives here; scroll and composer state live in sibling hooks.
 *
 * @returns Messages, streaming flag, `send(prompt)`, and `stop()`.
 */
export function useAgentStream(): AgentStreamState {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsStreaming(false);
    setMessages((currentMessages) => completeAllStreamingMessages(currentMessages));
  }, []);

  const send = useCallback(async (prompt: string) => {
    const parsedPrompt = agentPromptSchema.safeParse(prompt);
    if (!parsedPrompt.success || abortControllerRef.current) {
      return;
    }

    const userMessage = createUserChatMessage(parsedPrompt.data);
    const assistantMessage = createStreamingAssistantMessage();
    const assistantMessageId = assistantMessage.id;

    setMessages((currentMessages) => [...currentMessages, userMessage, assistantMessage]);
    setIsStreaming(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      await simulateAgentTokenStream((tokenChunk) => {
        setMessages((currentMessages) =>
          appendChunkToAssistantMessage(currentMessages, assistantMessageId, tokenChunk),
        );
      }, abortController.signal);

      setMessages((currentMessages) =>
        completeAssistantMessage(currentMessages, assistantMessageId),
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      const fallbackMessage = error instanceof Error ? error.message : "Stream failed";
      setMessages((currentMessages) =>
        failAssistantMessage(currentMessages, assistantMessageId, fallbackMessage),
      );
    } finally {
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  return { messages, isStreaming, send, stop };
}
