"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { IconSend, IconStop } from "@/components/ui/icons";

interface ChatInputProps {
  disabled: boolean;
  isStreaming: boolean;
  onSend: (value: string) => void;
  onStop: () => void;
}

export function ChatInput({ disabled, isStreaming, onSend, onStop }: ChatInputProps) {
  const [value, setValue] = useState("");
  const blocked = disabled || isStreaming;

  function submit() {
    const next = value.trim();
    if (!next || blocked) {
      return;
    }
    onSend(next);
    setValue("");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-zinc-200 bg-white/90 p-3 backdrop-blur md:p-4 dark:border-zinc-800 dark:bg-zinc-950/90"
    >
      <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900">
        <label className="sr-only" htmlFor="agent-prompt">
          Message
        </label>
        <textarea
          id="agent-prompt"
          name="prompt"
          rows={1}
          value={value}
          disabled={blocked}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={isStreaming ? "Waiting for the model…" : "Ask the agent…"}
          className="max-h-36 min-h-11 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
        {isStreaming ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onStop}
            aria-label="Stop generating"
          >
            <IconStop className="h-3.5 w-3.5" />
            Stop
          </Button>
        ) : (
          <Button
            type="submit"
            size="sm"
            disabled={blocked || value.trim().length === 0}
            aria-label="Send message"
          >
            <IconSend className="h-3.5 w-3.5" />
            Send
          </Button>
        )}
      </div>
      <p className="mx-auto mt-2 max-w-3xl px-1 text-[11px] text-zinc-500">
        Enter to send · Shift+Enter for a new line
      </p>
    </form>
  );
}
