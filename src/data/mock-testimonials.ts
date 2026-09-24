import type { ReviewAggregate, Testimonial } from "@/types";

/** Real testimonials only — add verified quotes here. */
export const mockTestimonials: Testimonial[] = [
  {
    id: "t-will-k",
    name: "Will K.",
    role: "Managing Director",
    quote:
      "Jason’s intellect, ability to connect with people, and strong work ethic make him a great fit as a Compass real estate professional.",
    rating: 5,
    location: "Los Gatos, CA",
    source: "direct",
  },
  {
    id: "t-shawn-a",
    name: "Shawn A.",
    role: "Top Almaden REALTOR®",
    quote:
      "I was impressed by Jason’s tenacity, positive attitude, and genuine commitment to pursuing knowledge and excellence.",
    rating: 5,
    location: "Los Gatos, CA",
    source: "direct",
  },
];

/** Hidden until live platform profiles are connected. */
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
