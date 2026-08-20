"use client";

import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type RefObject,
} from "react";

const RESTING_TILT = { rotateX: 16, rotateY: -18 } as const;

export type PointerTiltState = {
  frameRef: RefObject<HTMLDivElement | null>;
  tiltStyle: CSSProperties;
  handlePointerMove: (event: MouseEvent<HTMLDivElement>) => void;
  handlePointerLeave: () => void;
};

/**
 * Pointer-driven 3D tilt for the marketing product stage.
 * UI-only — no data fetching.
 *
 * @returns A frame ref, inline transform style, and mouse handlers.
 */
export function usePointerTilt(): PointerTiltState {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [tiltRotation, setTiltRotation] = useState<{ rotateX: number; rotateY: number }>({
    rotateX: RESTING_TILT.rotateX,
    rotateY: RESTING_TILT.rotateY,
  });

  const handlePointerMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const frameNode = frameRef.current;
    if (!frameNode) {
      return;
    }
    const boundingRect = frameNode.getBoundingClientRect();
    const normalizedX = (event.clientX - boundingRect.left) / boundingRect.width - 0.5;
    const normalizedY = (event.clientY - boundingRect.top) / boundingRect.height - 0.5;
    setTiltRotation({
      rotateX: RESTING_TILT.rotateX + normalizedY * -10,
      rotateY: RESTING_TILT.rotateY + normalizedX * 14,
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setTiltRotation({
      rotateX: RESTING_TILT.rotateX,
      rotateY: RESTING_TILT.rotateY,
    });
  }, []);

  const tiltStyle: CSSProperties = {
    transform: `rotateX(${tiltRotation.rotateX}deg) rotateY(${tiltRotation.rotateY}deg)`,
    transformStyle: "preserve-3d",
    transition: "transform 180ms ease-out",
  };

  return {
    frameRef,
    tiltStyle,
    handlePointerMove,
    handlePointerLeave,
  };
}
