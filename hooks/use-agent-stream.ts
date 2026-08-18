"use client";

import { useCallback, useRef, useState } from "react";
import type { ChatMessage } from "@/types/agent";

const DEMO_REPLY = `I can help you ship this workspace faster.

**What I can do**
- Summarize tenant billing state
- Draft replies with citations
- Walk through RLS policies

\`\`\`ts
const orgId = ctx.orgId; // never chosen by the model
await db.from("projects").select("*").eq("organization_id", orgId);
\`\`\`

Ask me anything about *SaaSForge Elite* — auth, Stripe, or the agent pipeline.`;

function createId(): string {
  return globalThis.crypto.randomUUID();
}

function nowIso(): string {
  return new Date().toISOString();
}

async function simulateStream(
  onDelta: (chunk: string) => void,
  signal: AbortSignal,
): Promise<void> {
  let offset = 0;
  while (offset < DEMO_REPLY.length) {
    if (signal.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    const size = offset < 24 ? 2 : 1 + Math.floor(Math.random() * 4);
    const next = DEMO_REPLY.slice(offset, offset + size);
    offset += size;
    onDelta(next);
    await new Promise((resolve) => {
      window.setTimeout(resolve, 16 + Math.floor(Math.random() * 22));
    });
  }
}

export function useAgentStream() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
    setMessages((current) =>
      current.map((message) =>
        message.status === "streaming" ? { ...message, status: "complete" } : message,
      ),
    );
  }, []);

  const send = useCallback(async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed || abortRef.current) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
      createdAt: nowIso(),
      status: "complete",
    };
    const assistantId = createId();
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: nowIso(),
      status: "streaming",
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await simulateStream((chunk) => {
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? { ...message, content: `${message.content}${chunk}` }
              : message,
          ),
        );
      }, controller.signal);

      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId ? { ...message, status: "complete" } : message,
        ),
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      const messageText = error instanceof Error ? error.message : "Stream failed";
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? { ...message, status: "error", content: message.content || messageText }
            : message,
        ),
      );
    } finally {
      abortRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  return { messages, isStreaming, send, stop };
}
