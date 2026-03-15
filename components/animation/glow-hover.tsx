"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Intensity = "sm" | "md" | "lg";

interface GlowHoverProps {
  intensity?: Intensity;
  color?: string;
  className?: string;
  children: React.ReactNode;
}

const glowShadows: Record<Intensity, string> = {
  sm: "var(--shadow-glow-sm)",
  md: "var(--shadow-glow-md)",
  lg: "var(--shadow-glow-lg)",
};

export function GlowHover({
  intensity = "md",
  color,
  className,
  children,
}: GlowHoverProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const shadowValue = color
    ? `0 0 ${intensity === "sm" ? 8 : intensity === "md" ? 16 : 32}px 0 ${color}`
    : glowShadows[intensity];

  return (
    <motion.div
      className={cn("will-change-[box-shadow]", className)}
      whileHover={{
        boxShadow: shadowValue,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
}
