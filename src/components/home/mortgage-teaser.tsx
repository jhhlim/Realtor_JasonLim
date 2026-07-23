import Link from "next/link";
import { Calculator } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";
import { formatCurrency } from "@/lib/utils";

export function MortgageTeaser() {
  return (
    <Section
      eyebrow="Planning tools"
      title="Estimate payments before you tour"
      description="A quick sense of monthly cost — then refine with taxes, HOA, and insurance on the full calculator."
    >
      <FadeIn>
        <Card className="overflow-hidden border-border/80 bg-gradient-to-br from-card via-card to-slate-soft dark:to-secondary/40">
          <CardContent className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/12 text-accent">
                <Calculator className="h-5 w-5" />
              </div>
              <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Mortgage calculator
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
                Model down payment, rate, and term for Silicon Valley price points — then bring the
                scenario into your consultation.
              </p>
              <Button asChild variant="accent" size="lg">
                <Link href="/mortgage-calculator">Open calculator</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[
                { label: "Example home", value: formatCurrency(1650000) },
                { label: "20% down · 6.5%", value: formatCurrency(8320) + "/mo*" },
                { label: "Term", value: "30 years" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3 dark:bg-background/40"
                >
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-1 font-display text-lg font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
      <p className="mt-3 text-xs text-muted-foreground">
        *Principal & interest illustration only. Not a loan offer.
      </p>
    </Section>
  );
}
