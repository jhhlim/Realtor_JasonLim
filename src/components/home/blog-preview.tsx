import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import type { BlogPost } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/shared/fade-in";

interface BlogPreviewProps {
  posts?: BlogPost[];
}

export function BlogPreview({ posts = [] }: BlogPreviewProps) {
  return (
    <Section
      eyebrow="Resources"
      title="Guides for smarter Bay Area moves"
      description="Practical writing on buying, selling, mortgages, and AI-assisted market analysis."
      actions={
        <Button asChild variant="outline">
          <Link href="/blog">
            View all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      }
    >
      {posts.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post, index) => (
            <FadeIn key={post.slug} delay={index * 0.05}>
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
                  <div className="flex items-center gap-2">
                    <Badge variant="accent">{post.category}</Badge>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readingMinutes} min
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold tracking-tight group-hover:text-accent">
                    {post.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "First-time buyer checklist for Silicon Valley",
            "How to read a CMA like an engineer",
            "Rate scenarios that change your offer strategy",
          ].map((title, index) => (
            <FadeIn key={title} delay={index * 0.05}>
              <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <Badge variant="secondary" className="mb-3">
                  Coming soon
                </Badge>
                <h3 className="font-display text-lg font-semibold">{title}</h3>
              </div>
            </FadeIn>
          ))}
        </div>
      )}
    </Section>
  );
}
