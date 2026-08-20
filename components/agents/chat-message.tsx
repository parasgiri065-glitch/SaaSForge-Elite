import type { ChatMessage as ChatMessageModel } from "@/types/agent";
import { MarkdownStream } from "@/components/agents/markdown-stream";
import { cn } from "@/lib/ui/cn";
import { chatBubbleClassName } from "@/lib/ui/layout-classes";

interface ChatMessageProps {
  message: ChatMessageModel;
}

/**
 * One transcript bubble. User text is plain; assistant text is markdown.
 *
 * @param props.message - The chat message to render.
 * @returns An `article` aligned left or right.
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const isUserMessage = message.role === "user";
  const isStreaming = message.status === "streaming";

  return (
    <article
      className={cn(
        "animate-bubble-in flex",
        isUserMessage ? "justify-end" : "justify-start",
      )}
      aria-live={isStreaming ? "polite" : undefined}
    >
      <div className={chatBubbleClassName(isUserMessage)}>
        {isUserMessage ? (
          <p className="text-sm leading-6 whitespace-pre-wrap">{message.content}</p>
        ) : (
          <MarkdownStream content={message.content} streaming={isStreaming} />
        )}
        {message.status === "error" ? (
          <p className="mt-2 text-xs text-red-500">The stream ended unexpectedly.</p>
        ) : null}
      </div>
    </article>
  );
}
