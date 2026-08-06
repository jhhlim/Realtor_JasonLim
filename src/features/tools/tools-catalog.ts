export const toolsCatalog = [
  {
    slug: "home-valuation",
    title: "AI Home Valuation",
    description: "Instant AI analysis plus personal CMA follow-up from Jason.",
    href: "/tools/home-valuation",
    status: "live" as const,
    category: "AI",
  },
  {
    slug: "affordability",
    title: "Affordability Calculator",
    description: "Income, debts, and rate → estimated max purchase price.",
    href: "/tools/affordability",
    status: "live" as const,
    category: "Buy",
  },
  {
    slug: "rent-vs-buy",
    title: "Rent vs Buy",
    description: "Compare renting against buying over a holding period.",
    href: "/tools/rent-vs-buy",
    status: "live" as const,
    category: "Buy",
  },
  {
    slug: "investment",
    title: "Investment Returns",
    description: "Cap rate and cash-on-cash return calculator.",
    href: "/tools/investment",
    status: "live" as const,
    category: "Invest",
  },
  {
    slug: "cash-flow",
    title: "Rental Cash Flow",
    description: "Model income, expenses, and monthly cash flow.",
    href: "/tools/cash-flow",
    status: "live" as const,
    category: "Invest",
  },
  {
    slug: "refinance",
    title: "Refinance Break-Even",
    description: "Months to recover closing costs after a refinance.",
    href: "/tools/refinance",
    status: "live" as const,
    category: "Mortgage",
  },
  {
    slug: "mortgage-comparison",
    title: "Mortgage Comparison",
    description: "Side-by-side compare 2–3 loan scenarios.",
    href: "/tools/mortgage-comparison",
    status: "live" as const,
    category: "Mortgage",
  },
  {
    slug: "neighborhood-comparison",
    title: "Neighborhood Comparison",
    description: "Compare two Bay Area communities from market data.",
    href: "/tools/neighborhood-comparison",
    status: "live" as const,
    category: "Market",
  },
  {
    slug: "school-comparison",
    title: "School Comparison",
    description: "Placeholder UI for district and school tradeoffs.",
    href: "/tools/school-comparison",
    status: "placeholder" as const,
    category: "Market",
  },
  {
    slug: "offer-competitiveness",
    title: "Offer Competitiveness",
    description: "AI offer analysis with Jason's personal recommendation.",
    href: "/tools/offer-competitiveness",
    status: "live" as const,
    category: "AI",
  },
  {
    slug: "market-prediction",
    title: "Market Prediction",
    description: "Neighborhood outlook with affordability, risks, and appreciation.",
    href: "/tools/market-prediction",
    status: "live" as const,
    category: "AI",
  },
  {
    slug: "mortgage-calculator",
    title: "Mortgage Calculator",
    description: "Full payment breakdown with amortization charts.",
    href: "/mortgage-calculator",
    status: "live" as const,
    category: "Mortgage",
  },
] as const;

export type ToolCatalogItem = (typeof toolsCatalog)[number];
export type ToolStatus = ToolCatalogItem["status"];

/** Tools routed under `/tools/[slug]` (excludes standalone pages like mortgage calculator). */
export const toolsUnderToolsRoute = toolsCatalog.filter((tool) =>
  tool.href.startsWith("/tools/"),
);

export function getToolBySlug(slug: string): ToolCatalogItem | undefined {
  return toolsCatalog.find((tool) => tool.slug === slug);
}
