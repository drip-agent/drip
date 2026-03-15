import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

const cardVariants = cva("rounded-card p-6", {
  variants: {
    variant: {
      default:
        "bg-dark-surface border border-ocean-mist/20",
      elevated:
        "bg-dark-elevated border border-ocean-mist/10",
      featured:
        "bg-dark-surface border border-icy-aqua/30 shadow-glow-md",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, children, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, className }))} {...props}>
      {children}
    </div>
  );
}

export { cardVariants };
