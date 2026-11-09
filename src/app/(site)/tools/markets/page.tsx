import { MarketsTracker } from "@/components/markets/markets-tracker";
import { ToolPageShell } from "@/features/tools/tool-page-shell";
import { buildMetadata } from "@/lib/seo";
import { getMarketsSnapshot } from "@/services/markets";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Oil, Gold, Indexes & Futures Daily Tracker",
  description:
    "Daily track of WTI oil, gold, S&P 500, Dow, Nasdaq, plus ES/NQ/YM/CL/GC futures for morning opens — macro context for Bay Area real estate.",
  path: "/tools/markets",
});

export default async function MarketsToolPage() {
  const snapshot = await getMarketsSnapshot();

  return (
    <ToolPageShell
      title="Oil, gold, indexes & futures"
      description="Cash indexes plus equity and commodity futures (ES, NQ, YM, CL, GC) so you can watch the tape before the cash open — useful backdrop for rates, risk assets, and Silicon Valley housing psychology."
    >
      <MarketsTracker snapshot={snapshot} />
    </ToolPageShell>
  );
}
