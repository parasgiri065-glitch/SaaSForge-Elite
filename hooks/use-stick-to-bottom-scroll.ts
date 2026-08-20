"use client";

import { useCallback, useEffect, useRef, type RefObject, type UIEvent } from "react";

export type StickToBottomScrollState = {
  scrollerRef: RefObject<HTMLDivElement | null>;
  handleScrollerScroll: (event: UIEvent<HTMLDivElement>) => void;
};

/**
 * Auto-scroll a transcript to the bottom unless the user has scrolled up.
 * Pure UI layout state — the caller still owns the message list.
 *
 * @param scrollDependency - Any value that changes when new content arrives.
 * @param bottomThresholdPixels - Distance from the bottom that still counts as "stuck".
 * @returns A ref to attach to the scroller and a scroll handler.
 */
export function useStickToBottomScroll(
  scrollDependency: unknown,
  bottomThresholdPixels = 72,
): StickToBottomScrollState {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const shouldStickToBottomRef = useRef(true);

  const handleScrollerScroll = useCallback(() => {
    const scrollerNode = scrollerRef.current;
    if (!scrollerNode) {
      return;
    }
    const distanceFromBottom =
      scrollerNode.scrollHeight - scrollerNode.scrollTop - scrollerNode.clientHeight;
    shouldStickToBottomRef.current = distanceFromBottom < bottomThresholdPixels;
  }, [bottomThresholdPixels]);

  useEffect(() => {
    if (!shouldStickToBottomRef.current) {
      return;
    }
    const scrollerNode = scrollerRef.current;
    scrollerNode?.scrollTo({ top: scrollerNode.scrollHeight, behavior: "smooth" });
  }, [scrollDependency]);

  return { scrollerRef, handleScrollerScroll };
}
