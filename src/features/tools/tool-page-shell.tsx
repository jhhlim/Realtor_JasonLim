import type { ReactNode } from "react";

import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { siteConfig } from "@/config/site";

export function ToolPageShell({
  eyebrow = "Tools",
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        primaryCta={siteConfig.cta.consultation}
        secondaryCta={{ label: "All tools", href: "/tools" }}
      />
      <Section className="pt-10 sm:pt-12">{children}</Section>
      <CtaBanner />
    </>
  );
}
