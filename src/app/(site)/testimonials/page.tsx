import Link from "next/link";
import { Star } from "lucide-react";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { mockTestimonials } from "@/data/mock-testimonials";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";
import { CtaBanner } from "@/components/shared/cta-banner";

/** Set true when live Google/Zillow/Yelp aggregates are ready. */
const SHOW_REVIEW_AGGREGATES = false;

export const metadata = buildMetadata({
  title: "Testimonials",
  description:
    "Client stories from Bay Area buyers and sellers who worked with Jason Lim.",
  path: "/testimonials",
});

function sourceLabel(source?: string) {
  if (!source || source === "direct") return "Client";
  return source.charAt(0).toUpperCase() + source.slice(1);
}

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="Outcomes clients remember"
        description="Real feedback from buyers and sellers across Silicon Valley — calm process, clear data, and responsive communication."
        primaryCta={siteConfig.cta.consultation}
        secondaryCta={{ label: "About Jason", href: "/about" }}
      />

      {SHOW_REVIEW_AGGREGATES ? (
        <Section
          eyebrow="Reviews"
          title="Aggregate ratings"
          description="Ratings across major review platforms."
        >
          <p className="text-sm text-muted-foreground">
            Prefer leaving a review?{" "}
            <a
              href={siteConfig.googleReviewsUrl}
              className="font-medium text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google reviews
            </a>
            .
          </p>
        </Section>
      ) : null}

      <Section
        eyebrow="Client stories"
        title="What working together felt like"
        description="Feedback from buyers and sellers across Silicon Valley."
        className="bg-gradient-to-b from-slate-soft/80 to-background dark:from-card/30"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {mockTestimonials.map((t, index) => (
            <FadeIn key={t.id} delay={index * 0.04}>
              <Card className="flex h-full flex-col border-border/70 shadow-soft">
                <CardContent className="flex flex-1 flex-col gap-5 p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-accent text-accent"
                        />
                      ))}
                    </div>
                    <Badge variant="secondary">{sourceLabel(t.source)}</Badge>
                    <Badge variant="outline">{t.role}</Badge>
                  </div>
                  <blockquote className="flex-1 font-display text-lg font-medium leading-snug tracking-tight text-balance sm:text-xl">
                    “{t.quote}”
                  </blockquote>
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.location}</p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section align="center">
        <p className="text-sm text-muted-foreground">
          Want to share your experience?{" "}
          <Link href="/contact" className="font-medium text-accent hover:underline">
            Contact Jason
          </Link>{" "}
          or leave a review on Google.
        </p>
      </Section>

      <CtaBanner
        title="Ready for your own success story?"
        description="Schedule a consultation and we'll map a clear plan for your buy or sell."
      />
    </>
  );
}
