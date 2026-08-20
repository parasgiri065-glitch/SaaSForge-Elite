"use client";

import { useCallback, useState, type FormEvent, type KeyboardEvent } from "react";

export type ComposerDraftState = {
  composerDraft: string;
  setComposerDraft: (nextDraft: string) => void;
  isComposerBlocked: boolean;
  submitComposerDraft: () => void;
  handleComposerSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleComposerKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
};

/**
 * Local draft state for the agent composer. Does not talk to the network —
 * `onSendPrompt` is the data-fetching boundary owned by `useAgentStream`.
 *
 * @param options.isDisabled - Extra lock (e.g. unauthenticated).
 * @param options.isStreaming - Whether the model is currently generating.
 * @param options.onSendPrompt - Called with the trimmed draft on submit.
 * @returns Draft value, blocked flag, and submit/key handlers.
 */
export function useComposerDraft(options: {
  isDisabled: boolean;
  isStreaming: boolean;
  onSendPrompt: (prompt: string) => void;
}): ComposerDraftState {
  const { isDisabled, isStreaming, onSendPrompt } = options;
  const [composerDraft, setComposerDraft] = useState("");
  const isComposerBlocked = isDisabled || isStreaming;

  const submitComposerDraft = useCallback(() => {
    const trimmedDraft = composerDraft.trim();
    if (!trimmedDraft || isComposerBlocked) {
      return;
    }
    onSendPrompt(trimmedDraft);
    setComposerDraft("");
  }, [composerDraft, isComposerBlocked, onSendPrompt]);

  const handleComposerSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      submitComposerDraft();
    },
    [submitComposerDraft],
  );

  const handleComposerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submitComposerDraft();
      }
    },
    [submitComposerDraft],
  );

  return {
    composerDraft,
    setComposerDraft,
    isComposerBlocked,
    submitComposerDraft,
    handleComposerSubmit,
    handleComposerKeyDown,
  };
}
