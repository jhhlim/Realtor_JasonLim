import type { ReviewAggregate, Testimonial } from "@/types";

export const mockTestimonials: Testimonial[] = [
  {
    id: "t-001",
    name: "Priya & Ankit Mehta",
    role: "Buyers",
    quote:
      "Jason combined market data with calm negotiation. We won a Sunnyvale home without overpaying — the CMA he built was clearer than anything we saw online.",
    rating: 5,
    location: "Sunnyvale, CA",
    source: "google",
  },
  {
    id: "t-002",
    name: "Lauren Chen",
    role: "Seller",
    quote:
      "Our Willow Glen listing was priced precisely and sold in under a week. The prep checklist and open-house plan felt like a product launch — in a good way.",
    rating: 5,
    location: "San Jose, CA",
    source: "zillow",
  },
  {
    id: "t-003",
    name: "Marcus Rivera",
    role: "First-time buyer",
    quote:
      "As a first-time buyer I was overwhelmed. Jason explained contingencies, HOAs, and rate locks in plain English and answered texts late when offers moved fast.",
    rating: 5,
    location: "Santa Clara, CA",
    source: "google",
  },
  {
    id: "t-004",
    name: "Helen Park",
    role: "Move-up buyer",
    quote:
      "We needed Cupertino schools and a workable commute. Jason mapped tradeoffs across Cupertino, Fremont, and Sunnyvale so we could decide with confidence.",
    rating: 5,
    location: "Cupertino, CA",
    source: "yelp",
  },
  {
    id: "t-005",
    name: "David Okonkwo",
    role: "Investor",
    quote:
      "The ADU and cash-flow analysis on a Morgan Hill purchase was excellent. Tech-backed but never robotic — still felt like white-glove service.",
    rating: 5,
    location: "Morgan Hill, CA",
    source: "direct",
  },
  {
    id: "t-006",
    name: "Sofia Alvarez",
    role: "Buyer & seller",
    quote:
      "Jason coordinated our Los Gatos sale and Mountain View purchase seamlessly. Timeline, vendors, and negotiations all stayed on track.",
    rating: 5,
    location: "Los Gatos, CA",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    source: "facebook",
  },
];

export const mockReviewAggregates: ReviewAggregate[] = [
  {
    source: "google",
    rating: 5.0,
    count: 48,
    url: "https://g.page/r/jasonlimrealty/review",
  },
  {
    source: "zillow",
    rating: 4.9,
    count: 22,
    url: "https://www.zillow.com/profile/jasonlimrealty",
  },
  {
    source: "yelp",
    rating: 5.0,
    count: 14,
    url: "https://www.yelp.com/biz/jason-lim-real-estate",
  },
  {
    source: "facebook",
    rating: 5.0,
    count: 31,
    url: "https://facebook.com/jasonlimrealty/reviews",
  },
];
