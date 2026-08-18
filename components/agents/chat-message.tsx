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
            ? "rounded-br-md bg-violet-500 text-white shadow-[0_8px_30px_rgba(139,92,246,0.35)]"
            : "rounded-bl-md border border-white/10 bg-white/10 text-white"
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
