import { MarketsTracker } from "@/components/markets/markets-tracker";
import { ToolPageShell } from "@/features/tools/tool-page-shell";
import { buildMetadata } from "@/lib/seo";
import { getMarketsSnapshot } from "@/services/markets";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Oil, Gold, Indexes & Overnight Tape",
  description:
    "Daily track of WTI oil, gold, S&P 500, Dow, Nasdaq, plus nearly-24h US500/US100/US30 for morning opens — macro context for Bay Area real estate.",
  path: "/tools/markets",
});

export default async function MarketsToolPage() {
  const snapshot = await getMarketsSnapshot();

  return (
    <ToolPageShell
      title="Oil, gold, indexes & overnight tape"
      description="Cash indexes plus nearly-24h US500 / US100 / US30 so you can watch the tape before the cash open. Official CME futures (ES, NQ, YM, CL, GC) link out to TradingView — they aren’t licensed for free website embeds."
    >
      <MarketsTracker snapshot={snapshot} />
    </ToolPageShell>
  );
}
