"use client";

import type { ReactNode } from "react";
import { usePointerTilt } from "@/hooks/use-pointer-tilt";

interface TiltStageProps {
  children: ReactNode;
}

/**
 * Perspective frame for the marketing product mock.
 * Tilt math lives in `usePointerTilt`.
 *
 * @param props.children - The product stage contents.
 * @returns A 3D-tilting wrapper.
 */
export function TiltStage({ children }: TiltStageProps) {
  const { frameRef, tiltStyle, handlePointerMove, handlePointerLeave } = usePointerTilt();

  return (
    <div
      ref={frameRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="relative mx-auto w-full max-w-5xl"
      style={{ perspective: "1600px" }}
    >
      <div className="relative will-change-transform" style={tiltStyle}>
        {children}
      </div>
    </div>
  );
}
