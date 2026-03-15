"use client";

import { motion, useReducedMotion, useInView } from "motion/react";
import { useRef, Children } from "react";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";

interface FadeInStaggerProps {
  staggerDelay?: number;
  className?: string;
  children: React.ReactNode;
  viewTrigger?: boolean;
}

export function FadeInStagger({
  staggerDelay = 0.1,
  className,
  children,
  viewTrigger = true,
}: FadeInStaggerProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const shouldAnimate = viewTrigger ? isInView : true;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn(className)}
      variants={containerVariants}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
    >
      {Children.map(children, (child) => (
        <motion.div variants={staggerItem}>{child}</motion.div>
      ))}
    </motion.div>
  );
}
