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
        <Card className="border-border/80 shadow-lift">
          <Link href={`/blog/${post.slug}`} className="group block">
            <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl bg-secondary sm:aspect-[2/1]">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 1100px"
              />
            </div>
            <CardContent className="space-y-4 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">Market Insights</Badge>
                <span aria-hidden>·</span>
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-balance transition-colors group-hover:text-accent sm:text-3xl lg:text-4xl">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                By <BrandName /> | REALTOR® · {siteConfig.brokerage.name} ·{" "}
                {siteConfig.license.dre}
              </p>
            </CardContent>
          </Link>
          <div className="flex flex-wrap gap-3 border-t border-border/70 px-6 pb-6 pt-0 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">
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
