import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { siteConfig } from "@/config/site";
import { mockBlogPosts } from "@/data/mock-blog";
import type { BlogPost } from "@/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Blog | ${siteConfig.name}`,
  description:
    "Bay Area buying, selling, mortgage, and AI-powered real estate insights from Jason Lim.",
};

const categories: Array<BlogPost["category"] | "All"> = [
  "All",
  "Buying",
  "Selling",
  "Investment",
  "Mortgage",
  "Bay Area",
  "Technology",
  "AI",
];

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const categoryParam = params.category?.trim();
  const active =
    categoryParam && categories.includes(categoryParam as BlogPost["category"])
      ? (categoryParam as BlogPost["category"])
      : "All";

  const posts =
    active === "All"
      ? mockBlogPosts
      : mockBlogPosts.filter((p) => p.category === active);

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Bay Area real estate blog"
        description="Practical guides on buying, selling, mortgages, and using technology without losing judgment."
      />
      <Section className="pt-10">
        <div className="mb-8 flex flex-wrap gap-2" role="navigation" aria-label="Blog categories">
          {categories.map((cat) => {
            const href = cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`;
            const isActive = active === cat;
            return (
              <Link
                key={cat}
                href={href}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground",
                )}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts in this category yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full overflow-hidden transition-all group-hover:-translate-y-0.5 group-hover:shadow-lift">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <CardContent className="space-y-3 p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="accent">{post.category}</Badge>
                      <span>{post.readingMinutes} min read</span>
                      <span aria-hidden>·</span>
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                    <h2 className="font-display text-xl font-semibold tracking-tight group-hover:text-accent">
                      {post.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Section>
      <CtaBanner />
    </>
  );
}
