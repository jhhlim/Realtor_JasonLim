import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { CtaBanner } from "@/components/shared/cta-banner";
import { Container } from "@/components/shared/container";
import { siteConfig } from "@/config/site";
import { mockBlogPosts } from "@/data/mock-blog";
import { BrandName } from "@/components/layout/brand-name";

export function generateStaticParams() {
  return mockBlogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = mockBlogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Article not found" };

  return {
    title: `${post.title} | ${siteConfig.name}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      images: [{ url: post.coverImage }],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = mockBlogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const paragraphs = post.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <article>
        <div className="border-b border-border/70 bg-gradient-to-b from-slate-soft to-background py-12 sm:py-16 dark:from-card/40">
          <Container className="max-w-3xl space-y-5">
            <Link
              href={`/blog?category=${encodeURIComponent(post.category)}`}
              className="inline-flex"
            >
              <Badge variant="accent">{post.category}</Badge>
            </Link>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
              <span aria-hidden>·</span>
              <span>{post.readingMinutes} min read</span>
              <span aria-hidden>·</span>
              <span>
                <BrandName />
              </span>
            </div>
          </Container>
        </div>

        <Container className="max-w-3xl py-10 sm:py-14">
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-3xl">
            <Image
              src={post.coverImage}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
          <div className="space-y-5 text-base leading-relaxed text-foreground/90 sm:text-lg">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
          {post.tags.length > 0 ? (
            <ul className="mt-10 flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Badge variant="secondary">{tag}</Badge>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-8">
            <Link href="/blog" className="text-sm font-medium text-accent hover:underline">
              ← Back to all posts
            </Link>
          </p>
        </Container>
      </article>
      <CtaBanner />
    </>
  );
}
