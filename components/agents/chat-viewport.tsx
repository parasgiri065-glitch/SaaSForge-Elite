"use client";

import { useEffect, useRef } from "react";
import { ChatInput } from "@/components/agents/chat-input";
import { ChatMessage } from "@/components/agents/chat-message";
import { useAgentStream } from "@/hooks/use-agent-stream";

interface ChatViewportProps {
  disabled?: boolean;
}

export function ChatViewport({ disabled = false }: ChatViewportProps) {
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
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-sm font-medium">Start a conversation</p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Streaming markdown, auto-scroll, and a locked composer while the model
                answers.
              </p>
            </div>
          ) : (
            messages.map((message) => <ChatMessage key={message.id} message={message} />)
          )}
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
