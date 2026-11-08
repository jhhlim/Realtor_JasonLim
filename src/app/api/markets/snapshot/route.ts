import { NextResponse } from "next/server";

import { getMarketsSnapshot } from "@/services/markets";

export const revalidate = 3600;

export async function GET() {
  try {
    const snapshot = await getMarketsSnapshot();
    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[markets/snapshot]", error);
    return NextResponse.json(
      {
        asOf: new Date().toISOString(),
        quotes: [],
        provider: "error",
        disclaimer:
          "Market data temporarily unavailable. Try again shortly or check OilPrice.com, GoldPrice.org, and CNBC.",
        error: "Failed to load market snapshot",
      },
      { status: 502 },
    );
  }
}
