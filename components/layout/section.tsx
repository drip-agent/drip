import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

const sectionVariants = cva("w-full", {
  variants: {
    spacing: {
      default: "py-16 sm:py-20 lg:py-24",
      compact: "py-8 sm:py-12 lg:py-16",
      spacious: "py-24 sm:py-30 lg:py-34",
    },
  },
  defaultVariants: {
    spacing: "default",
  },
});

export interface SectionProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  heading?: string;
  subheading?: string;
}

export function Section({
  className,
  spacing,
  heading,
  subheading,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn(sectionVariants({ spacing, className }))} {...props}>
      {(heading || subheading) && (
        <div className="mb-12 text-center">
          {heading && (
            <h2 className="font-heading text-3xl font-bold tracking-tight text-icy-aqua sm:text-4xl">
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="mt-4 text-lg text-ocean-mist">{subheading}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

export { sectionVariants };
