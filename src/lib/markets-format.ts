export function formatMarketPrice(price: number, id: string) {
  if (id === "oil" || id === "gold") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatMarketChange(change: number, changePct: number) {
  const sign = change > 0 ? "+" : "";
  const absPct = Math.abs(changePct).toFixed(2);
  const pctSign = changePct > 0 ? "+" : changePct < 0 ? "-" : "";
  return {
    changeLabel: `${sign}${change.toFixed(2)}`,
    pctLabel: `${pctSign}${absPct}%`,
    direction: change > 0 ? "up" : change < 0 ? "down" : "flat",
  } as const;
}
