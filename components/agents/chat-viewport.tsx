"use client";

import { useEffect, useRef } from "react";
import { ChatInput } from "@/components/agents/chat-input";
import { ChatMessage } from "@/components/agents/chat-message";
import { useAgentStream } from "@/hooks/use-agent-stream";

import { ToolCallTrace } from "@/components/agents/tool-call-trace";

interface ChatViewportProps {
  disabled?: boolean;
  agentId?: string;
}

export function ChatViewport({ disabled = false, agentId }: ChatViewportProps) {
  const { messages, isStreaming, send, stop } = useAgentStream();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  function onScroll() {
    const node = scrollerRef.current;
    if (!node) {
      return;
    }
    const distance = node.scrollHeight - node.scrollTop - node.clientHeight;
    stickToBottom.current = distance < 72;
  }

  useEffect(() => {
    if (!stickToBottom.current) {
      return;
    }
    const node = scrollerRef.current;
    node?.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <section className="flex h-[calc(100dvh-4rem)] flex-col">
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex-1 scrollbar-thin overflow-y-auto px-4 py-6 md:px-6"
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
