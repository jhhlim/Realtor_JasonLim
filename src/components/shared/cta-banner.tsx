import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

interface CtaBannerProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

export function CtaBanner({
  title = "Ready for a clearer path to your next home?",
  description = "Book a consultation or request a data-backed home valuation — tailored for Silicon Valley buyers and sellers.",
  primaryLabel = siteConfig.cta.consultation.label,
  primaryHref = siteConfig.cta.consultation.href,
  secondaryLabel = siteConfig.cta.valuation.label,
  secondaryHref = siteConfig.cta.valuation.href,
  className,
}: CtaBannerProps) {
  return (
    <section className={cn("py-16 sm:py-20", className)}>
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#0B1F33] via-[#12304a] to-[#1F6F78] px-8 py-12 text-white shadow-lift sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-teal-soft/30 blur-3xl" />
          <div className="relative max-w-2xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Next step
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {title}
            </h2>
            <p className="text-base leading-relaxed text-white/80 text-pretty sm:text-lg">
              {description}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="bg-white text-[#0B1F33] hover:bg-white/90">
                <Link href={primaryHref}>{primaryLabel}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
