import type { MarketHistoryPoint } from "./types";

function parseCsvLine(line: string) {
  return line.split(",").map((part) => part.trim());
}

export async function fetchStooqQuote(symbol: string): Promise<{
  price: number;
  previousClose: number;
  history: MarketHistoryPoint[];
} | null> {
  const quoteUrl = `https://stooq.com/q/l/?s=${encodeURIComponent(symbol)}&f=sd2t2ohlcv&h&e=csv`;
  const histUrl = `https://stooq.com/q/d/l/?s=${encodeURIComponent(symbol)}&i=d`;

  const [quoteRes, histRes] = await Promise.all([
    fetch(quoteUrl, { next: { revalidate: 3600 } }),
    fetch(histUrl, { next: { revalidate: 3600 } }),
  ]);

  if (!quoteRes.ok) return null;

  const quoteText = await quoteRes.text();
  const quoteLines = quoteText.trim().split(/\r?\n/);
  if (quoteLines.length < 2) return null;

  const headers = parseCsvLine(quoteLines[0]!).map((h) => h.toLowerCase());
  const values = parseCsvLine(quoteLines[1]!);
  const get = (key: string) => {
    const idx = headers.indexOf(key);
    return idx >= 0 ? values[idx] : undefined;
  };

  const closeRaw = get("close");
  const price = closeRaw ? Number(closeRaw) : NaN;
  if (!Number.isFinite(price)) return null;

  const history: MarketHistoryPoint[] = [];
  if (histRes.ok) {
    const histText = await histRes.text();
    const lines = histText.trim().split(/\r?\n/).slice(1);
    for (const line of lines.slice(0, 35)) {
      const [date, , , , close] = parseCsvLine(line);
      const n = close ? Number(close) : NaN;
      if (date && Number.isFinite(n)) {
        history.push({ date, close: n });
      }
    }
    history.reverse();
  }

  const previousClose = history.at(-2)?.close ?? price;

  return { price, previousClose, history };
}
