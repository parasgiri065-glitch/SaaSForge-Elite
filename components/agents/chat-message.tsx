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
        ) : message.status === "error" ? (
          <p className="text-sm text-red-300" role="alert">
            {message.content.trim().length > 0
              ? message.content
              : "API Key missing in environment"}
          </p>
        ) : (
          <MarkdownStream content={message.content} streaming={isStreaming} />
        )}
      </div>
    </article>
  );
}
