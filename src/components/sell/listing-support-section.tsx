import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Home,
  MapPinned,
  UsersRound,
} from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

const supportTopics = [
  {
    title: "Listing concierge",
    description:
      "Coordinated listing support beyond a basic MLS entry — timeline, vendor sequencing, marketing checkpoints, and clear next steps so prep, media, and launch stay aligned.",
    icon: ClipboardList,
  },
  {
    title: "Home setup & prep",
    description:
      "A readiness plan before photos and launch: what to tackle first, what can wait, and how to sequence work so the house shows clean without last-minute scramble.",
    icon: Home,
    crossLink: {
      href: "/sell#seller-toolkit",
      label: "See seller toolkit",
    },
  },
  {
    title: "Where to live while you sell",
    description:
      "Bridge, short-term, or buy-before-sell style guidance — we map timing, cash-flow tradeoffs, and move logistics so your next place fits the sale plan, not the other way around.",
    icon: MapPinned,
  },
  {
    title: "Selling with tenants in place",
    description:
      "Occupied listings need notice, showing etiquette, and practical coordination. High-level California considerations for access and communication — planned with you, not improvised on showing day.",
    icon: UsersRound,
  },
] as const;

export function ListingSupportSection() {
  return (
    <Section
      id="listing-support"
      eyebrow="Listing support"
      title="Listing concierge & occupied homes"
      description="Beyond pricing and marketing phases — coordinated prep, housing logistics, and tenant-aware showings when your situation isn’t a vacant, turnkey list."
      className="scroll-mt-24 bg-slate-soft/50 dark:bg-card/30"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {supportTopics.map((topic, index) => (
          <FadeIn key={topic.title} delay={index * 0.04}>
            <Card className="h-full border-border/70">
              <CardContent className="space-y-4 p-6">
                <topic.icon className="h-5 w-5 text-accent" aria-hidden />
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-semibold">
                    {topic.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                    {topic.description}
                  </p>
                  {"crossLink" in topic && topic.crossLink ? (
                    <p className="pt-1">
                      <Link
                        href={topic.crossLink.href}
                        className="text-sm font-medium text-accent underline-offset-4 hover:underline"
                      >
                        {topic.crossLink.label}
                        <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
                      </Link>
                      {" — staging, contractors, landscaping & more."}
                    </p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.14} className="mt-8">
        <Card className="border-border/70">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="max-w-2xl space-y-2">
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                Tenant rights, lease terms, and notice requirements vary. This is
                general listing coordination — not legal advice. For your lease or
                local rules, consult a qualified California attorney or housing
                professional when needed.
              </p>
            </div>
            <Button asChild variant="accent" className="shrink-0">
              <Link href={siteConfig.cta.consultation.href}>
                Talk through your situation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </FadeIn>
    </Section>
  );
}
