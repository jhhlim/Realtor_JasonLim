import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export interface BuildMetadataInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
}

function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function absoluteImage(image?: string): string {
  const src = image ?? siteConfig.media.ogImage;
  if (src.startsWith("http")) return src;
  return absoluteUrl(src);
}

/**
 * Build Next.js Metadata from siteConfig defaults + page overrides.
 */
export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  image,
  noIndex = false,
  keywords,
}: BuildMetadataInput = {}): Metadata {
  const pageTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} | ${siteConfig.title}`;
  const url = absoluteUrl(path);
  const ogImage = absoluteImage(image);

  return {
    metadataBase: new URL(siteConfig.url),
    title: title
      ? { absolute: pageTitle }
      : {
          default: `${siteConfig.name} | ${siteConfig.title}`,
          template: `%s | ${siteConfig.name}`,
        },
    description,
    keywords: keywords ?? [
      "Bay Area realtor",
      "Silicon Valley real estate",
      "San Jose homes",
      "Cupertino realtor",
      "first-time home buyer",
      siteConfig.name,
    ],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.legalName,
      title: pageTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${siteConfig.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical: url,
    },
  };
}
