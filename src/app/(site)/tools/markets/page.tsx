import { MarketsTracker } from "@/components/markets/markets-tracker";
import { ToolPageShell } from "@/features/tools/tool-page-shell";
import { buildMetadata } from "@/lib/seo";
import { getMarketsSnapshot } from "@/services/markets";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Oil, Gold & Index Daily Tracker",
  description:
    "Daily track of WTI oil, gold, S&P 500, Dow, and Nasdaq — macro context for Bay Area real estate decisions. Delayed quotes with links to OilPrice, GoldPrice, and CNBC.",
  path: "/tools/markets",
});

export default async function MarketsToolPage() {
  const snapshot = await getMarketsSnapshot();

  return (
    <ToolPageShell
      title="Oil, gold & major indexes"
      description="Daily track of WTI crude, gold futures, S&P 500, Dow, and Nasdaq. Useful backdrop when rates, risk assets, and Silicon Valley housing psychology move together."
    >
      <MarketsTracker snapshot={snapshot} />
    </ToolPageShell>
  );
}
