import type { MarketReport } from "@/types";

export const mockMarketReports: MarketReport[] = [
  {
    id: "mr-2026-q2-sv",
    title: "Silicon Valley Q2 2026 Market Report",
    slug: "silicon-valley-q2-2026",
    summary:
      "Inventory edged higher while median prices held firm across Cupertino, Palo Alto, and Sunnyvale. Entry-level condos in Santa Clara and Milpitas saw the fastest absorption.",
    publishedAt: "2026-07-08",
    region: "Silicon Valley",
    stats: [
      { label: "Median Sale Price", value: "$1.82M", change: "+2.1% YoY" },
      { label: "Avg Days on Market", value: "18", change: "-2 days" },
      { label: "Sale-to-List", value: "101.4%", change: "+0.3 pts" },
      { label: "Active Inventory", value: "2,140", change: "+6% MoM" },
    ],
  },
  {
    id: "mr-2026-06-sj",
    title: "San Jose June 2026 Neighborhood Snapshot",
    slug: "san-jose-june-2026",
    summary:
      "Willow Glen and Rose Garden remained competitive. Downtown condo prices stabilized after spring rate volatility; Almaden single-family demand stayed resilient.",
    publishedAt: "2026-06-30",
    region: "San Jose",
    stats: [
      { label: "Median SFH Price", value: "$1.51M", change: "+1.8% YoY" },
      { label: "Condo Median", value: "$820K", change: "-0.4% YoY" },
      { label: "New Listings", value: "412", change: "+9% MoM" },
      { label: "Pending Ratio", value: "62%", change: "+4 pts" },
    ],
  },
  {
    id: "mr-2026-05-schools",
    title: "School-Driven Markets: Cupertino & Fremont May 2026",
    slug: "cupertino-fremont-may-2026",
    summary:
      "Spring buying season concentrated around top school clusters. Mission San Jose and Cupertino Union boundaries continue to command the largest premiums.",
    publishedAt: "2026-05-28",
    region: "Cupertino & Fremont",
    stats: [
      { label: "Cupertino Median", value: "$2.85M", change: "+1.5% YoY" },
      { label: "Fremont Median", value: "$1.52M", change: "+2.1% YoY" },
      { label: "Avg Offers / Home", value: "3.4", change: "+0.2" },
      { label: "DOM (Top Schools)", value: "11", change: "-1 day" },
    ],
  },
  {
    id: "mr-2026-q1-south",
    title: "South County Q1 2026: Morgan Hill Opportunity Report",
    slug: "morgan-hill-q1-2026",
    summary:
      "Morgan Hill offered the strongest value relative to North County tech employment, with larger lots and improving downtown amenities drawing move-down and investor interest.",
    publishedAt: "2026-04-02",
    region: "Morgan Hill",
    stats: [
      { label: "Median Sale Price", value: "$1.18M", change: "+3.8% YoY" },
      { label: "Avg Lot Size", value: "7,200 sqft", change: "stable" },
      { label: "Investor Share", value: "14%", change: "+2 pts" },
      { label: "DOM", value: "24", change: "-3 days" },
    ],
  },
];
