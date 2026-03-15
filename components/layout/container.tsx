import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

const containerVariants = cva("mx-auto w-full px-4 sm:px-6 lg:px-8", {
  variants: {
    size: {
      default: "max-w-6xl",
      narrow: "max-w-4xl",
      wide: "max-w-7xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export function Container({
  className,
  size,
  children,
  ...props
}: ContainerProps) {
  return (
    <div className={cn(containerVariants({ size, className }))} {...props}>
      {children}
    </div>
  );
}

export { containerVariants };
