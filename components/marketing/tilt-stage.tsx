"use client";

import { useCallback, useRef, useState, type MouseEvent, type ReactNode } from "react";

interface TiltStageProps {
  children: ReactNode;
}

export function TiltStage({ children }: TiltStageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 16, y: -18 });

  const onMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const node = frameRef.current;
    if (!node) {
      return;
    }
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: 16 + py * -10, y: -18 + px * 14 });
  }, []);

  const onLeave = useCallback(() => {
    setTilt({ x: 16, y: -18 });
  }, []);

  return (
    <div
      ref={frameRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative mx-auto w-full max-w-5xl"
      style={{ perspective: "1600px" }}
    >
      <div
        className="relative will-change-transform"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 180ms ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}
