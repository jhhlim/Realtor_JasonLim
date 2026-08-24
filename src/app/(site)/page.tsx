import { BlogPreview } from "@/components/home/blog-preview";
import { ContactCta } from "@/components/home/contact-cta";
import { FeaturedListings } from "@/components/home/featured-listings";
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

  const latestReport = mockMarketReports[0] ?? null;

  return (
    <>
      <Hero />
      <StatsStrip />
      <FeaturedListings listings={featured} />
      <MarketInsights report={latestReport} />
      <NeighborhoodsPreview neighborhoods={mockNeighborhoods} />
      <RecentSales listings={recentSales} />
      <TestimonialsCarousel testimonials={mockTestimonials} />
      <MortgageTeaser />
      <BlogPreview posts={mockBlogPosts} />
      <ContactCta />
    </>
  );
}
