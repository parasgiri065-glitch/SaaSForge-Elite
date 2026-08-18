import type { ChatMessage as ChatMessageModel } from "@/types/agent";
import { MarkdownStream } from "@/components/agents/markdown-stream";

interface ChatMessageProps {
  message: ChatMessageModel;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const streaming = message.status === "streaming";

  return (
    <article
      className={`animate-bubble-in flex ${isUser ? "justify-end" : "justify-start"}`}
      aria-live={streaming ? "polite" : undefined}
    >
      <div
        className={`max-w-[min(100%,42rem)] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? "rounded-br-md bg-indigo-600 text-white"
            : "rounded-bl-md border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-6 whitespace-pre-wrap">{message.content}</p>
        ) : (
          <MarkdownStream content={message.content} streaming={streaming} />
        )}
        {message.status === "error" ? (
          <p className="mt-2 text-xs text-red-500">The stream ended unexpectedly.</p>
        ) : null}
      </div>
    </article>
  );
}
