"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  appendChunkToAssistantMessage,
  completeAllStreamingMessages,
  completeAssistantMessage,
  createStreamingAssistantMessage,
  createUserChatMessage,
  failAssistantMessage,
} from "@/lib/agents/create-chat-message";
import { consumeTextStream } from "@/lib/agents/consume-text-stream";
import { agentPromptSchema } from "@/lib/security/api-schemas";
import { readJsonError } from "@/lib/http/json-error";
import { isolateUnknownError } from "@/lib/errors/isolate-unknown-error";
import type { ChatMessage } from "@/types/agent";

export type AgentStreamState = {
  messages: ChatMessage[];
  isStreaming: boolean;
  send: (prompt: string) => Promise<void>;
  stop: () => void;
};

/**
 * Transcript + Groq streaming via POST /api/ai/stream.
 * No local canned reply.
 *
 * @returns Messages, streaming flag, `send(prompt)`, and `stop()`.
 */
export function useAgentStream(): AgentStreamState {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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

    const history = messagesRef.current
      .filter(
        (message) =>
          message.status === "complete" &&
          (message.role === "user" || message.role === "assistant") &&
          message.content.length > 0,
      )
      .slice(-16)
      .map((message) => ({
        role: message.role as "user" | "assistant",
        content: message.content,
      }));

    const userMessage = createUserChatMessage(parsedPrompt.data);
    const assistantMessage = createStreamingAssistantMessage();
    const assistantMessageId = assistantMessage.id;

    setMessages((currentMessages) => [...currentMessages, userMessage, assistantMessage]);
    setIsStreaming(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch("/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: parsedPrompt.data,
          messages: history,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorBody: unknown = await response.json().catch(() => null);
        const message = readJsonError(errorBody, `Stream failed (${response.status})`);
        console.error("[ai.stream] client HTTP error", response.status, message);
        throw new Error(message);
      }

      if (!response.body) {
        console.error("[ai.stream] client received an empty body");
        throw new Error("Stream response was empty");
      }

      let receivedChars = 0;
      await consumeTextStream(
        response.body,
        (tokenChunk) => {
          receivedChars += tokenChunk.length;
          setMessages((currentMessages) =>
            appendChunkToAssistantMessage(currentMessages, assistantMessageId, tokenChunk),
          );
        },
        abortController.signal,
      );

      if (receivedChars === 0) {
        console.error("[ai.stream] Groq returned an empty stream");
        throw new Error("The model returned no text. Check GROQ_API_KEY on Vercel.");
      }

      setMessages((currentMessages) =>
        completeAssistantMessage(currentMessages, assistantMessageId),
      );
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      const isolated = isolateUnknownError(error, "stream_failed");
      console.error("[ai.stream] client catch", isolated);
      setMessages((currentMessages) =>
        failAssistantMessage(currentMessages, assistantMessageId, isolated.message),
      );
    } finally {
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  return { messages, isStreaming, send, stop };
}
