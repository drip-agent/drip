"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-icy-aqua/50 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-deepest disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-aquamarine text-dark-deepest hover:bg-icy-aqua shadow-glow-sm hover:shadow-glow-md",
        secondary:
          "bg-dark-elevated text-soft-cyan border border-ocean-mist/30 hover:bg-dark-surface hover:border-ocean-mist/50",
        ghost:
          "text-ocean-mist hover:text-icy-aqua hover:bg-dark-elevated/50",
        outline:
          "border border-ocean-mist/40 text-soft-cyan hover:bg-dark-elevated hover:border-icy-aqua/30",
      },
      size: {
        sm: "h-8 px-3 text-sm rounded-button gap-1.5",
        md: "h-10 px-5 text-sm rounded-button gap-2",
        lg: "h-12 px-7 text-base rounded-button gap-2.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
