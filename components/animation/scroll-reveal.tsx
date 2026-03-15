"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { defaultScrollTrigger, easings } from "@/lib/gsap-utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Direction = "up" | "down" | "left" | "right";

interface ScrollRevealProps {
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  children: React.ReactNode;
}

const directionOffset: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 60 },
  down: { x: 0, y: -60 },
  left: { x: 60, y: 0 },
  right: { x: -60, y: 0 },
};

export function ScrollReveal({
  direction = "up",
  delay = 0,
  duration = 0.8,
  className,
  children,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const offset = directionOffset[direction];

      // Check prefers-reduced-motion
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReduced) {
        // Ensure children are visible immediately
        gsap.set(el, { opacity: 1, x: 0, y: 0 });
        return;
      }

      gsap.fromTo(
        el,
        { opacity: 0, x: offset.x, y: offset.y },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          delay,
          ease: easings.smooth,
          scrollTrigger: {
            trigger: el,
            ...defaultScrollTrigger,
          },
        }
      );
    },
    { scope: containerRef, dependencies: [direction, delay, duration] }
  );

  return (
    <div ref={containerRef} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
