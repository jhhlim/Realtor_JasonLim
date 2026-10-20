import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Home } from "lucide-react";

import type { BlogPost } from "@/types";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";
import { BrandName } from "@/components/layout/brand-name";
import { formatDate } from "@/lib/format";

interface FeaturedMarketArticleProps {
  post: BlogPost;
}

export function FeaturedMarketArticle({ post }: FeaturedMarketArticleProps) {
  return (
    <Section
      eyebrow="Market Insights"
      title="Latest from the market"
      description="Clear takes on what headline sales, rates, and local affordability mean for Bay Area buyers and sellers."
      className="bg-gradient-to-b from-slate-soft/70 to-background dark:from-card/25"
    >
      <FadeIn>
        <Card className="overflow-hidden border-border/80 shadow-lift">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative aspect-[16/10] bg-secondary lg:aspect-auto lg:min-h-[360px]">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
            <CardContent className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">Market Insights</Badge>
                <time
                  dateTime={post.publishedAt}
                  className="text-sm text-muted-foreground"
                >
                  {formatDate(post.publishedAt, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
              <div className="space-y-3">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition-colors hover:text-accent"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
                  {post.excerpt}
                </p>
                <p className="text-sm text-muted-foreground">
                  By <BrandName /> | REALTOR® · {siteConfig.brokerage.name} ·{" "}
                  {siteConfig.license.dre}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button asChild variant="accent" size="lg">
                  <Link href={`/blog/${post.slug}`}>
                    Read the full update
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/blog">Explore market insights</Link>
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </FadeIn>

      <FadeIn delay={0.08} className="mt-6">
        <Card className="border-accent/25 bg-gradient-to-br from-accent/5 to-transparent">
          <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Next step
              </p>
              <h3 className="font-display text-2xl font-semibold tracking-tight">
                Request a Personalized Home Valuation
              </h3>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Get a data-backed look at your home&apos;s value — then turn
                today&apos;s market context into a clear buy, sell, or hold plan.
              </p>
            </div>
            <Button asChild size="lg" variant="accent" className="shrink-0">
              <Link href={siteConfig.cta.valuation.href}>
                <Home className="h-4 w-4" />
                Request a valuation
              </Link>
            </Button>
          </CardContent>
        </Card>
      </FadeIn>
    </Section>
  );
}
