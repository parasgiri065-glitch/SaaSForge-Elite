"use client";

import { Button } from "@/components/ui/button";
import { IconSend, IconStop } from "@/components/ui/icons";
import { useComposerDraft } from "@/hooks/use-composer-draft";
import { controlClasses, layoutClasses } from "@/lib/ui/layout-classes";

interface ChatInputProps {
  disabled: boolean;
  isStreaming: boolean;
  onSend: (value: string) => void;
  onStop: () => void;
}

/**
 * Agent composer. Draft state lives in `useComposerDraft`.
 *
 * @param props.disabled - Extra lock (e.g. unauthenticated).
 * @param props.isStreaming - Disables the textarea and shows Stop.
 * @param props.onSend - Data-fetching callback from `useAgentStream`.
 * @param props.onStop - Aborts the in-flight stream.
 * @returns The composer form.
 */
export function ChatInput({ disabled, isStreaming, onSend, onStop }: ChatInputProps) {
  const {
    composerDraft,
    setComposerDraft,
    isComposerBlocked,
    handleComposerSubmit,
    handleComposerKeyDown,
  } = useComposerDraft({
    isDisabled: disabled,
    isStreaming,
    onSendPrompt: onSend,
  });

  return (
    <form onSubmit={handleComposerSubmit} className={layoutClasses.composerBar}>
      <div className={layoutClasses.composerShell}>
        <label className="sr-only" htmlFor="agent-prompt">
          Message
        </label>
        <textarea
          id="agent-prompt"
          name="prompt"
          rows={1}
          value={composerDraft}
          disabled={isComposerBlocked}
          onChange={(event) => setComposerDraft(event.target.value)}
          onKeyDown={handleComposerKeyDown}
          placeholder={isStreaming ? "Waiting for the model…" : "Ask the agent…"}
          className={controlClasses.composerTextarea}
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
            disabled={isComposerBlocked || composerDraft.trim().length === 0}
            aria-label="Send message"
          >
            <IconSend className="h-3.5 w-3.5" />
            Send
          </Button>
        )}
      </div>
      <p className="mx-auto mt-2 max-w-3xl px-1 text-[11px] text-white/35">
        Enter to send · Shift+Enter for a new line
      </p>
    </form>
  );
}
