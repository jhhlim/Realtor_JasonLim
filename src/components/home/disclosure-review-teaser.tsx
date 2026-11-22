import Link from "next/link";
import { ArrowRight, FileSearch } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";

export function DisclosureReviewTeaser() {
  return (
    <Section
      eyebrow="Buyer resource"
      title="Disclosure Review"
      description="Before you offer, let’s organize what the seller disclosures and inspection reports actually say — then walk through the questions together."
      className="bg-gradient-to-b from-slate-soft/80 to-background dark:from-card/30"
      actions={
        <Button asChild variant="outline">
          <Link href="/disclosure-review">
            Open Disclosure Review
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      }
    >
      <FadeIn>
        <Card className="overflow-hidden border-border/70 shadow-soft">
          <CardContent className="grid gap-6 p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-8 sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/25 bg-accent/10 text-accent">
              <FileSearch className="h-7 w-7" aria-hidden />
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                Buying a home? Let’s go through the disclosures together.
              </h3>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
                Upload a package or request a walkthrough. Complimentary AI-assisted
                organization for Jason’s review — personal follow-up, no obligation.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 sm:justify-end">
              <Button asChild variant="accent">
                <Link href="/disclosure-review#upload">Upload Disclosures</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/disclosure-review#sample-report">See sample</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </Section>
  );
}
