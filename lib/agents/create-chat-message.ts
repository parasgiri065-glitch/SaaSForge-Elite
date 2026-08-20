import { randomId } from "@/lib/crypto/random";
import type { ChatMessage } from "@/types/agent";

/**
 * Allocate a cryptographically random message id.
 *
 * @returns A UUID (or UUID-shaped hex fallback).
 */
export function createChatMessageId(): string {
  return randomId();
}

/**
 * ISO timestamp for a newly created chat message.
 *
 * @returns `new Date().toISOString()`.
 */
export function currentChatTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Build a completed user turn.
 *
 * @param content - Trimmed prompt text already validated by Zod.
 * @returns A `ChatMessage` with `role: "user"` and `status: "complete"`.
 */
export function createUserChatMessage(content: string): ChatMessage {
  return {
    id: createChatMessageId(),
    role: "user",
    content,
    createdAt: currentChatTimestamp(),
    status: "complete",
  };
}

/**
 * Build an empty assistant turn that the stream will fill in.
 *
 * @returns A `ChatMessage` with `role: "assistant"` and `status: "streaming"`.
 */
export function createStreamingAssistantMessage(): ChatMessage {
  return {
    id: createChatMessageId(),
    role: "assistant",
    content: "",
    createdAt: currentChatTimestamp(),
    status: "streaming",
  };
}

/**
 * Append a token chunk to the streaming assistant message.
 *
 * @param messages - Current transcript.
 * @param assistantMessageId - Id of the in-flight assistant turn.
 * @param tokenChunk - Next substring from the model (or demo simulator).
 * @returns A new transcript array with the chunk appended.
 */
export function appendChunkToAssistantMessage(
  messages: ChatMessage[],
  assistantMessageId: string,
  tokenChunk: string,
): ChatMessage[] {
  return messages.map((message) =>
    message.id === assistantMessageId
      ? { ...message, content: `${message.content}${tokenChunk}` }
      : message,
  );
}

/**
 * Mark the in-flight assistant turn as complete.
 *
 * @param messages - Current transcript.
 * @param assistantMessageId - Id of the in-flight assistant turn.
 * @returns A new transcript array with that turn marked complete.
 */
export function completeAssistantMessage(
  messages: ChatMessage[],
  assistantMessageId: string,
): ChatMessage[] {
  return messages.map((message) =>
    message.id === assistantMessageId ? { ...message, status: "complete" } : message,
  );
}

/**
 * Mark every streaming turn complete (used when the user hits Stop).
 *
 * @param messages - Current transcript.
 * @returns A new transcript array with no `streaming` statuses.
 */
export function completeAllStreamingMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.map((message) =>
    message.status === "streaming" ? { ...message, status: "complete" } : message,
  );
}

/**
 * Mark the in-flight assistant turn as errored.
 *
 * @param messages - Current transcript.
 * @param assistantMessageId - Id of the in-flight assistant turn.
 * @param fallbackMessage - Used when the bubble is still empty.
 * @returns A new transcript array with that turn marked `error`.
 */
export function failAssistantMessage(
  messages: ChatMessage[],
  assistantMessageId: string,
  fallbackMessage: string,
): ChatMessage[] {
  return messages.map((message) =>
    message.id === assistantMessageId
      ? { ...message, status: "error", content: message.content || fallbackMessage }
      : message,
  );
}
