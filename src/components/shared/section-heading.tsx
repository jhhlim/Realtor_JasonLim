import * as React from "react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  actions?: React.ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  actions,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl space-y-3", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0 pt-1">{actions}</div> : null}
    </div>
  );
}
