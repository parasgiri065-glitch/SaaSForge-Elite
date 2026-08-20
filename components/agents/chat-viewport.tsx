"use client";

import { ChatInput } from "@/components/agents/chat-input";
import { ChatMessage } from "@/components/agents/chat-message";
import { ToolCallTrace } from "@/components/agents/tool-call-trace";
import { useAgentStream } from "@/hooks/use-agent-stream";
import { useStickToBottomScroll } from "@/hooks/use-stick-to-bottom-scroll";
import { layoutClasses } from "@/lib/ui/layout-classes";

interface ChatViewportProps {
  disabled?: boolean;
  agentId?: string;
}

/**
 * Agent transcript + composer. Stream data is `useAgentStream`;
 * stick-to-bottom is `useStickToBottomScroll`.
 *
 * @param props.disabled - Extra lock forwarded to the composer.
 * @param props.agentId - Optional session id shown on the tool-call trace.
 * @returns The full chat column.
 */
export function ChatViewport({ disabled = false, agentId }: ChatViewportProps) {
  const { messages, isStreaming, send, stop } = useAgentStream();
  const { scrollerRef, handleScrollerScroll } = useStickToBottomScroll(messages);

  return (
    <section className={layoutClasses.chatColumn}>
      <div
        ref={scrollerRef}
        onScroll={handleScrollerScroll}
        className={layoutClasses.chatScroller}
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages.length === 0 ? (
            <div className="glass-panel rounded-2xl px-6 py-12 text-center">
              <p className="text-sm font-medium">Ask the workspace agent</p>
              <p className="mt-1 text-sm text-white/45">
                Streaming markdown, auto-scroll, and a locked input while it answers.
              </p>
            </div>
          ) : (
            messages.map((message) => <ChatMessage key={message.id} message={message} />)
          )}
          {isStreaming ? (
            <ToolCallTrace
              calls={[
                {
                  name: "scopeTenant",
                  status: "running",
                  detail: agentId ? `session ${agentId}` : "workspace context",
                },
              ]}
            />
          ) : null}
        </div>
      </div>
      <ChatInput
        disabled={disabled}
        isStreaming={isStreaming}
        onSend={(value) => {
          void send(value);
        }}
        onStop={stop}
      />
    </section>
  );
}
