import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileSearch, ListChecks, MessageCircle } from "lucide-react";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { areDisclosureUploadsEnabled } from "@/lib/disclosure-uploads";
import { disclosureHowItWorks } from "@/data/disclosure-sample";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";
import { CtaBanner } from "@/components/shared/cta-banner";
import { DisclosureSampleReport } from "@/features/disclosure-review/sample-report";
import { DisclosureUploadForm } from "@/features/disclosure-review/upload-form";
import { DisclosureWalkthroughForm } from "@/features/disclosure-review/walkthrough-form";

export const metadata = buildMetadata({
  title: "Disclosure Review",
  description:
    "Complimentary AI-assisted disclosure review with Jason Lim — organize findings, flag follow-up questions, and walk through the package before you decide how to move forward in Berryessa, North San Jose, Milpitas, and beyond.",
  path: "/disclosure-review",
  keywords: [
    "disclosure review",
    "seller disclosures",
    "home inspection",
    "Berryessa",
    "North San Jose",
    "Milpitas",
    "Jason Lim",
    "Compass",
  ],
});

export default function DisclosureReviewPage() {
  const uploadsEnabled = areDisclosureUploadsEnabled();

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/70 bg-gradient-to-br from-[#0B1F33] via-[#12304a] to-[#1F6F78] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_55%)]" />
        <Container className="relative py-16 sm:py-20 lg:py-24">
          <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <FadeIn className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Buyer resource · Disclosure review
              </p>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem]">
                Buying a home? Let&apos;s go through the disclosures together.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-white/80 text-pretty sm:text-lg">
                Send me the disclosure package for a home you&apos;re considering. I&apos;ll
                use an AI-assisted review to organize what the documents say, flag
                questions to follow up on, and walk through the findings with you before
                you decide how to move forward.
              </p>
              <p className="text-sm italic text-white/70">
                Complimentary analysis. Personal follow-up. No obligation.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-[#0B1F33] hover:bg-white/90"
                >
                  <a href="#upload">Upload Disclosures</a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <a href="#sample-report">
                    See a Sample Report
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <DisclosureSampleReport />
            </FadeIn>
          </div>
        </Container>
      </section>

      <Section
        eyebrow="Personal invitation"
        title="We can go through it together"
        description="Whether you’re shopping in Berryessa, North San Jose, Milpitas, or elsewhere in Silicon Valley, disclosures deserve a calm second look before you commit."
      >
        <Card className="overflow-hidden border-border/70">
          <CardContent className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-8 sm:p-8">
            {siteConfig.showAgentPhotos ? (
              <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-2xl border border-border/80 bg-secondary sm:mx-0 sm:h-32 sm:w-32">
                <Image
                  src={siteConfig.media.headshot}
                  alt={`${siteConfig.name} — professional headshot`}
                  fill
                  className="object-cover object-top"
                  sizes="128px"
                />
              </div>
            ) : null}
            <div className="space-y-4">
              <p className="text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
                Already have a question about an inspection or seller disclosure? We can
                go through it together. I&apos;ll help you find the relevant pages and
                figure out what to ask the listing agent or inspector.
              </p>
              <p className="text-sm font-medium text-foreground">
                Jason Lim | Compass | CA {siteConfig.license.dre}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="accent" size="lg">
                  <a href="#review-with-jason">Review With Jason</a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={siteConfig.cta.consultation.href}>
                    {siteConfig.cta.consultation.label}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section
        id="how-it-works"
        eyebrow="How it works"
        title="Three simple steps"
        description="Upload the package → Get an organized summary → Go through it with Jason."
        className="bg-gradient-to-b from-slate-soft/70 to-background dark:from-card/30"
      >
        <div className="grid gap-5 md:grid-cols-3">
          {disclosureHowItWorks.map((item, index) => {
            const Icon =
              index === 0 ? FileSearch : index === 1 ? ListChecks : MessageCircle;
            return (
              <FadeIn key={item.title} delay={index * 0.05}>
                <Card className="h-full border-border/70">
                  <CardContent className="space-y-3 p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/30 text-sm font-semibold text-accent">
                        {item.step}
                      </span>
                      <Icon className="h-5 w-5 text-accent" aria-hidden />
                    </div>
                    <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      <Section
        eyebrow="Intake"
        title="Upload & follow-up"
        description="Private, mobile-friendly intake. Prefer to talk first? Use Review With Jason — no upload required."
      >
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <DisclosureUploadForm uploadsEnabled={uploadsEnabled} />
          <DisclosureWalkthroughForm />
        </div>
      </Section>

      <Section
        eyebrow="Important"
        title="A reading aid — not a substitute for the originals"
        description="Summaries help you organize questions. They do not replace reading the full disclosure package or advice from qualified professionals."
      >
        <div className="mx-auto max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <p>
            Factual findings cite the uploaded file and PDF page. Seller statements,
            inspector observations, and AI-assisted interpretation are kept distinct.
            The review does not invent citations, repair costs, or claims about property
            condition.
          </p>
          <p>
            Topics covered when your package includes them may include permits, roof,
            electrical, plumbing, moisture, pest, and HOA. Always verify against the
            source documents and consult inspectors, contractors, attorneys, or lenders
            as needed.
          </p>
          <p>
            Learn how inquiry and document information is handled in the{" "}
            <Link href="/privacy" className="font-medium text-accent hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </Section>

      <CtaBanner
        title="Ready to walk through a disclosure package?"
        description="Request a complimentary review walkthrough, or reach out on the contact page anytime."
        primaryLabel="Review With Jason"
        primaryHref="#review-with-jason"
        secondaryLabel={siteConfig.cta.consultation.label}
        secondaryHref={siteConfig.cta.consultation.href}
      />
    </>
  );
}
