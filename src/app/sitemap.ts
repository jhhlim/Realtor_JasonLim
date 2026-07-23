import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { mockBlogPosts } from "@/data/mock-blog";
import { mockMarketReports } from "@/data/mock-market-reports";
import { mockNeighborhoods } from "@/data/mock-neighborhoods";
import { getListingProvider } from "@/services/listings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const staticPaths = [
    "",
    "/buy",
    "/sell",
    "/listings",
    "/communities",
    "/market-reports",
    "/resources",
    "/about",
    "/contact",
    "/blog",
    "/testimonials",
    "/faq",
    "/mortgage-calculator",
    "/tools",
    "/tools/home-valuation",
    "/tools/affordability",
    "/tools/rent-vs-buy",
    "/tools/investment",
    "/tools/cash-flow",
    "/tools/refinance",
    "/tools/mortgage-comparison",
    "/tools/neighborhood-comparison",
    "/tools/school-comparison",
    "/tools/offer-competitiveness",
    "/tools/market-prediction",
    "/privacy",
    "/terms",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/listings" ? 0.9 : 0.7,
  }));

  const communityEntries: MetadataRoute.Sitemap = mockNeighborhoods.map(
    (n) => ({
      url: `${base}/communities/${n.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  const blogEntries: MetadataRoute.Sitemap = mockBlogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const reportEntries: MetadataRoute.Sitemap = mockMarketReports.map(
    (report) => ({
      url: `${base}/market-reports/${report.slug}`,
      lastModified: new Date(report.publishedAt),
      changeFrequency: "monthly",
      priority: 0.65,
    }),
  );

  let listingEntries: MetadataRoute.Sitemap = [];
  try {
    const result = await getListingProvider().search({ pageSize: 200 });
    listingEntries = result.items.map((item) => ({
      url: `${base}/listings/${item.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.85,
    }));
  } catch {
    listingEntries = [];
  }

  return [
    ...staticEntries,
    ...communityEntries,
    ...blogEntries,
    ...reportEntries,
    ...listingEntries,
  ];
}
