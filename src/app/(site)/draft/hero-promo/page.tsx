import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

/**
 * Draft preview page — not linked from main nav.
 * Review the recommended homepage hero placement before approving.
 */
export default function DraftHeroPromoPage() {
  return (
    <main className="min-h-screen bg-background py-12">
      <Container className="max-w-5xl space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Draft preview — not live on main yet
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Recommended placement: Homepage hero
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            This graphic replaces the empty space where your photo used to be
            (right side of the homepage hero). It leads with Buy / Sell / Invest,
            keeps Compass branding, and balances the text column.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Note:</strong> The flyer shows
              phone <code>408-358-1111</code>, while the site uses{" "}
              {siteConfig.contact.phone}. Confirm which number should stay.
            </li>
            <li>
              Production stays unchanged until you approve and we merge this
              draft.
            </li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild variant="accent">
              <Link href="/">View on homepage layout (this draft branch)</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/about">About page (unchanged)</Link>
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-secondary shadow-lift">
          <Image
            src={siteConfig.media.heroPromo}
            alt="Draft promo graphic — Real Estate for What's Next"
            width={1200}
            height={1200}
            priority
            className="h-auto w-full"
          />
        </div>
      </Container>
    </main>
  );
}
