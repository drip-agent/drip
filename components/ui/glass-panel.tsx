import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

const glassPanelVariants = cva("glass rounded-card p-6", {
  variants: {
    blur: {
      sm: "[&]:backdrop-blur-[8px]",
      md: "", // uses the glass utility default (12px)
      lg: "[&]:backdrop-blur-[20px]",
    },
  },
  defaultVariants: {
    blur: "md",
  },
});

export interface GlassPanelProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassPanelVariants> {}

export function GlassPanel({
  className,
  blur,
  children,
  ...props
}: GlassPanelProps) {
  return (
    <div className={cn(glassPanelVariants({ blur, className }))} {...props}>
      {children}
    </div>
  );
}

export { glassPanelVariants };
