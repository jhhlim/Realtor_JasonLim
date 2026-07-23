/**
 * Display formatting helpers for prices, dates, and property metrics.
 */

export function formatPrice(
  value: number,
  opts: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    ...opts,
  }).format(value);
}

export function formatNumber(
  value: number,
  opts: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat("en-US", opts).format(value);
}

export function formatPercent(
  value: number,
  opts: { digits?: number; signed?: boolean } = {},
): string {
  const { digits = 1, signed = false } = opts;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
    signDisplay: signed ? "exceptZero" : "auto",
  }).format(value / 100);
  return formatted;
}

export function formatDate(
  value: string | number | Date,
  opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", opts).format(date);
}

export function formatSqft(value: number): string {
  return `${formatNumber(Math.round(value))} sqft`;
}
