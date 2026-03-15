import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glowBorderVariants = cva("rounded-card", {
  variants: {
    intensity: {
      sm: "shadow-glow-sm",
      md: "shadow-glow-md",
      lg: "shadow-glow-lg",
    },
  },
  defaultVariants: {
    intensity: "md",
  },
});

export interface GlowBorderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glowBorderVariants> {}

function GlowBorder({ className, intensity, children, ...props }: GlowBorderProps) {
  return (
    <div
      className={cn(glowBorderVariants({ intensity, className }))}
      {...props}
    >
      {children}
    </div>
  );
}

export { GlowBorder, glowBorderVariants };
