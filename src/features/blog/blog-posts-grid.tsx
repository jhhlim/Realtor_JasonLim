"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

import type { BlogPost } from "@/types";
import { FadeIn } from "@/components/shared/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";

export const BLOG_CATEGORIES = [
  "All",
  "Buying",
  "Selling",
  "Investment",
  "Mortgage",
  "Bay Area",
  "Technology",
  "AI",
] as const;

type Category = (typeof BLOG_CATEGORIES)[number];

interface BlogPostsGridProps {
  posts: BlogPost[];
}

export function BlogPostsGrid({ posts }: BlogPostsGridProps) {
  const [active, setActive] = useState<Category>("All");

  const filtered = useMemo(() => {
    if (active === "All") return posts;
    return posts.filter((post) => post.category === active);
  }, [active, posts]);

  const sorted = useMemo(
    () =>
      [...filtered].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime(),
      ),
    [filtered],
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-2">
        {BLOG_CATEGORIES.map((category) => {
          const count =
            category === "All"
              ? posts.length
              : posts.filter((p) => p.category === category).length;
          if (category !== "All" && count === 0) return null;

          return (
            <Button
              key={category}
              type="button"
              size="sm"
              variant={active === category ? "accent" : "outline"}
              className={cn(
                "rounded-full",
                active === category && "shadow-soft",
              )}
              onClick={() => setActive(category)}
            >
              {category}
              <span className="ml-1.5 text-xs opacity-70">({count})</span>
            </Button>
          );
        })}
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-secondary/40 px-6 py-16 text-center">
          <p className="font-display text-xl font-semibold">No articles yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another category or check back soon.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((post, index) => (
            <FadeIn key={post.slug} delay={index * 0.04}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="accent">{post.category}</Badge>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readingMinutes} min
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-semibold tracking-tight group-hover:text-accent">
                    {post.title}
                  </h2>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">
                    {post.excerpt}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(post.publishedAt)}
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
