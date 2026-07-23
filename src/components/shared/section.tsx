import * as React from "react";

import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  description?: string;
  align?: "left" | "center";
  contained?: boolean;
  headerClassName?: string;
  actions?: React.ReactNode;
}

export function Section({
  eyebrow,
  title,
  description,
  align = "left",
  contained = true,
  className,
  headerClassName,
  actions,
  children,
  ...props
}: SectionProps) {
  const body = (
    <>
      {(eyebrow || title || description || actions) && (
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          align={align}
          actions={actions}
          className={cn(
            "mb-10 lg:mb-12",
            actions && align === "left" && "sm:flex-row sm:items-end sm:justify-between",
            headerClassName,
          )}
        />
      )}
      {children}
    </>
  );

  return (
    <section
      className={cn("relative py-16 sm:py-20 lg:py-24", className)}
      {...props}
    >
      {contained ? <Container>{body}</Container> : body}
    </section>
  );
}
