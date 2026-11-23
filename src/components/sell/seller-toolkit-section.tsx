import Link from "next/link";
import {
  ArrowRight,
  Clapperboard,
  ExternalLink,
  Hammer,
  LayoutTemplate,
  Sofa,
  Trees,
  Wrench,
} from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

const serviceIcons = {
  "marketing-video": Clapperboard,
  "listing-website": LayoutTemplate,
  "staging-furniture": Sofa,
  contractors: Wrench,
  "landscaping-handyman": Trees,
} as const;

export function SellerToolkitSection() {
  const { sellerToolkit, social, cta } = siteConfig;
  const embedSrc = `https://www.youtube-nocookie.com/embed/${sellerToolkit.youtubeVideoId}`;

  return (
    <Section
      id="seller-toolkit"
      eyebrow="Seller toolkit"
      title="Beyond the listing"
      description="Compass marketing plus hands-on extras — video, listing sites, staging pieces, contractor referrals, and practical prep help — so your home shows stronger online and in person."
      className="scroll-mt-24 bg-gradient-to-b from-slate-soft/80 to-background dark:from-card/30"
      actions={
        <Button asChild variant="outline">
          <a
            href={social.youtube}
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch on YouTube
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <FadeIn>
          <Card className="overflow-hidden border-border/70 shadow-soft">
            <CardContent className="space-y-5 p-5 sm:p-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  Featured video
                </p>
                <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                  Marketing that helps buyers find you
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                  See how Jason approaches seller storytelling and local market
                  context — then talk through a plan tailored to your home.
                </p>
              </div>

              <div className="relative aspect-video overflow-hidden rounded-xl border border-border/70 bg-secondary">
                <iframe
                  src={embedSrc}
                  title={sellerToolkit.youtubeTitle}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild variant="accent">
                  <Link href={cta.consultation.href}>
                    Plan your listing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href={social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open on YouTube
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {sellerToolkit.services.map((service, index) => {
            const Icon =
              serviceIcons[service.id as keyof typeof serviceIcons] ?? Hammer;

            return (
              <FadeIn key={service.id} delay={0.04 + index * 0.04}>
                <Card className="h-full border-border/70">
                  <CardContent className="flex gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-display text-lg font-semibold leading-snug">
                        {service.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                        {service.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
