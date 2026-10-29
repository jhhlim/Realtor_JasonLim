import { BlogPreview } from "@/components/home/blog-preview";
import { ContactCta } from "@/components/home/contact-cta";
import { FeaturedListings } from "@/components/home/featured-listings";
import { GoalsCta } from "@/components/home/goals-cta";
import { Hero } from "@/components/home/hero";
import { MarketInsights } from "@/components/home/market-insights";
import { MortgageTeaser } from "@/components/home/mortgage-teaser";
import { NeighborhoodsPreview } from "@/components/home/neighborhoods-preview";
import { RecentSales } from "@/components/home/recent-sales";
import { StatsStrip } from "@/components/home/stats-strip";
import { TestimonialsCarousel } from "@/components/home/testimonials-carousel";
import { mockBlogPosts } from "@/data/mock-blog";
import { mockMarketReports } from "@/data/mock-market-reports";
import { mockNeighborhoods } from "@/data/mock-neighborhoods";
import { mockTestimonials } from "@/data/mock-testimonials";
import { getListingProvider } from "@/services/listings";

export default async function HomePage() {
  const provider = getListingProvider();
  const [featured, recentSales] = await Promise.all([
    provider.getFeatured(6),
    provider.getRecentSales(6),
  ]);

  const featuredReport =
    mockMarketReports.find(
      (r) => r.slug === "scc-detached-homes-october-25-2026",
    ) ??
    [...mockMarketReports].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )[0] ??
    null;

  return (
    <>
      <Hero />
      <StatsStrip />
      <MarketInsights report={featuredReport} />
      <GoalsCta />
      {featured.length > 0 ? <FeaturedListings listings={featured} /> : null}
      <NeighborhoodsPreview neighborhoods={mockNeighborhoods} />
      {recentSales.length > 0 ? <RecentSales listings={recentSales} /> : null}
      <TestimonialsCarousel testimonials={mockTestimonials} />
      <MortgageTeaser />
      <BlogPreview posts={mockBlogPosts} />
      <ContactCta />
    </>
  );
}
