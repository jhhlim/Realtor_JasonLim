import type { BlogPost } from "@/types";

const cover = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

export const mockBlogPosts: BlogPost[] = [
  {
    slug: "first-time-buyer-checklist-bay-area-2026",
    title: "First-Time Buyer Checklist for the Bay Area in 2026",
    excerpt:
      "Pre-approval, HOA diligence, and contingency strategy — a practical checklist for Silicon Valley first-time buyers.",
    content: `Buying your first Bay Area home means navigating competitive offers, complex HOAs, and rate volatility. Start with a full pre-approval (not just a pre-qualification), understand your true monthly budget including Mello-Roos and HOA dues, and decide contingency comfort levels before touring.

Tour with a clear must-have list, run comps yourself with recent closed sales, and keep earnest money and inspection vendors lined up. In 2026, inventory remains thin in Cupertino, Palo Alto, and Los Gatos — flexibility on city and property type often unlocks better outcomes.`,
    category: "Buying",
    coverImage: cover("photo-1560518883-ce09059eeffa"),
    publishedAt: "2026-06-12",
    readingMinutes: 7,
    tags: ["first-time buyers", "checklist", "bay area"],
  },
  {
    slug: "how-to-price-your-home-willow-glen",
    title: "How to Price Your Home in Willow Glen",
    excerpt:
      "Pricing strategy for San Jose's Willow Glen: reading absorption, school boundaries, and remodel premiums.",
    content: `Willow Glen buyers pay for walkability to Lincoln Avenue and perceived school quality. Overpricing by even 3–5% can stall a listing while nearby actives absorb demand. Use last 90 days of closed sales within half a mile, adjust for lot size and kitchen condition, and consider a soft open house weekend to create urgency without a blind race.`,
    category: "Selling",
    coverImage: cover("photo-1600585154340-be6161a56a0c"),
    publishedAt: "2026-05-28",
    readingMinutes: 6,
    tags: ["selling", "pricing", "willow glen"],
  },
  {
    slug: "adu-roi-silicon-valley",
    title: "ADU ROI Across Silicon Valley Cities",
    excerpt:
      "Where accessory dwelling units pencil out — Sunnyvale, San Jose, and Mountain View compared.",
    content: `ADUs can add rental income or multigenerational housing, but permit timelines and construction costs vary. Sunnyvale and Mountain View often support stronger rents; San Jose offers more lot flexibility in some R-1 zones. Model net cash flow after taxes, insurance, and vacancy — and confirm setbacks before you buy with ADU intent.`,
    category: "Investment",
    coverImage: cover("photo-1600607687939-ce8a6c25118c"),
    publishedAt: "2026-05-10",
    readingMinutes: 8,
    tags: ["investment", "adu", "rental"],
  },
  {
    slug: "mortgage-rate-locks-explained",
    title: "Mortgage Rate Locks Explained for Competitive Offers",
    excerpt:
      "When to lock, float-down options, and how rate strategy affects your offer strength.",
    content: `In multi-offer scenarios, a locked rate can strengthen appraisal confidence and monthly payment certainty. Float-down options help if rates drop after lock. Coordinate lock timing with inspection periods so you are not paying extension fees unnecessarily.`,
    category: "Mortgage",
    coverImage: cover("photo-1554224155-6726b3ff858f"),
    publishedAt: "2026-04-22",
    readingMinutes: 5,
    tags: ["mortgage", "rates", "offers"],
  },
  {
    slug: "cupertino-vs-fremont-schools-housing",
    title: "Cupertino vs Fremont: Schools, Commute, and Housing Tradeoffs",
    excerpt:
      "A side-by-side look at two of the South Bay's most school-driven housing markets.",
    content: `Cupertino delivers elite school prestige with higher entry prices and smaller lots. Fremont's Mission San Jose cluster rivals that reputation with relatively more inventory and East Bay BART access. Your commute pattern — Apple Park vs Warm Springs / Tesla — often decides the winner more than test scores alone.`,
    category: "Bay Area",
    coverImage: cover("photo-1580582932707-520aed937b7b"),
    publishedAt: "2026-04-05",
    readingMinutes: 9,
    tags: ["cupertino", "fremont", "schools"],
  },
  {
    slug: "using-ai-to-analyze-comps",
    title: "Using AI to Analyze Comps Without Losing Judgment",
    excerpt:
      "How AI-assisted CMA tools help — and where human market intuition still wins.",
    content: `AI can cluster comps by feature similarity and flag outliers, but it can miss micro-neighborhood premiums like a quiet cul-de-sac or a freeway noise discount. Use models to accelerate research, then validate with boots-on-the-ground tours and recent inspection chatter.`,
    category: "AI",
    coverImage: cover("photo-1677442136019-21780ecad995"),
    publishedAt: "2026-03-18",
    readingMinutes: 6,
    tags: ["ai", "cma", "comps"],
  },
  {
    slug: "proptech-tools-for-bay-area-buyers",
    title: "PropTech Tools Bay Area Buyers Should Actually Use",
    excerpt:
      "Skip the noise — a shortlist of mapping, commute, and valuation tools that save time.",
    content: `Prioritize tools that show school boundaries, true commute times at rush hour, and flood/fire risk overlays. Combine automated valuations with agent-curated comps. Technology should reduce uncertainty, not add another dashboard you ignore.`,
    category: "Technology",
    coverImage: cover("photo-1551288049-bebda4e38f71"),
    publishedAt: "2026-02-27",
    readingMinutes: 7,
    tags: ["proptech", "tools", "buyers"],
  },
  {
    slug: "rent-vs-buy-south-bay-2026",
    title: "Rent vs Buy in the South Bay: 2026 Scenarios",
    excerpt:
      "Break-even timelines for San Jose, Sunnyvale, and Morgan Hill under current rate assumptions.",
    content: `With higher rates, break-even horizons lengthened — but forced savings and leverage still matter for long-horizon residents. Morgan Hill can break even sooner due to lower entry prices; Sunnyvale often requires longer holding periods unless you have a strong down payment or employer equity.`,
    category: "Investment",
    coverImage: cover("photo-1560520031-3a4dc4e9de0c"),
    publishedAt: "2026-02-08",
    readingMinutes: 10,
    tags: ["rent vs buy", "investment", "south bay"],
  },
];
