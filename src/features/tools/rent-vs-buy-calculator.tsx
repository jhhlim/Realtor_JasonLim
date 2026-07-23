"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateMortgagePayment } from "@/lib/mortgage";
import { formatCurrency } from "@/lib/utils";

export function RentVsBuyCalculator() {
  const [rent, setRent] = React.useState(3800);
  const [homePrice, setHomePrice] = React.useState(1_450_000);
  const [downPercent, setDownPercent] = React.useState(20);
  const [rate, setRate] = React.useState(6.5);
  const [years] = React.useState(30);
  const [taxRate, setTaxRate] = React.useState(1.1);
  const [insurance, setInsurance] = React.useState(185);
  const [hoa, setHoa] = React.useState(0);
  const [maintenancePct, setMaintenancePct] = React.useState(1);
  const [appreciation, setAppreciation] = React.useState(3);
  const [rentGrowth, setRentGrowth] = React.useState(3);
  const [horizon, setHorizon] = React.useState(7);
  const [sellingCostPct, setSellingCostPct] = React.useState(6);

  const analysis = React.useMemo(() => {
    const loan = homePrice * (1 - downPercent / 100);
    const pi = calculateMortgagePayment({
      principal: loan,
      annualRate: rate,
      years,
    });
    const monthlyOwn =
      pi +
      (homePrice * taxRate) / 100 / 12 +
      insurance +
      hoa +
      (homePrice * maintenancePct) / 100 / 12;

    let rentCost = 0;
    let ownCash = 0;
    let currentRent = rent;
    for (let y = 0; y < horizon; y++) {
      rentCost += currentRent * 12;
      ownCash += monthlyOwn * 12;
      currentRent *= 1 + rentGrowth / 100;
    }

    const futureValue = homePrice * Math.pow(1 + appreciation / 100, horizon);
    const sellingCosts = futureValue * (sellingCostPct / 100);
    const downPayment = homePrice * (downPercent / 100);
    // Total rent paid vs (owning cash + down − estimated equity after sale costs)
    const estimatedEquity = futureValue - loan - sellingCosts;
    const buyTotalOutlay = ownCash + downPayment;
    const buyNet = buyTotalOutlay - Math.max(estimatedEquity, 0);
    const advantage = rentCost - buyNet;

    return {
      monthlyOwn,
      rentCost,
      buyNet,
      advantage,
      estimatedEquity,
      breakEvenYears:
        advantage >= 0
          ? `Buying looks ahead over ${horizon} years under these assumptions.`
          : `Renting looks ahead over ${horizon} years under these assumptions.`,
    };
  }, [
    rent,
    homePrice,
    downPercent,
    rate,
    years,
    taxRate,
    insurance,
    hoa,
    maintenancePct,
    appreciation,
    rentGrowth,
    horizon,
    sellingCostPct,
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Assumptions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {[
            ["rent", "Monthly rent ($)", rent, setRent],
            ["price", "Home price ($)", homePrice, setHomePrice],
            ["dp", "Down payment (%)", downPercent, setDownPercent],
            ["rate", "Mortgage rate (%)", rate, setRate],
            ["tax", "Property tax rate (%)", taxRate, setTaxRate],
            ["ins", "Insurance / mo ($)", insurance, setInsurance],
            ["hoa", "HOA / mo ($)", hoa, setHoa],
            ["maint", "Maintenance (% / yr)", maintenancePct, setMaintenancePct],
            ["appr", "Appreciation (% / yr)", appreciation, setAppreciation],
            ["rg", "Rent growth (% / yr)", rentGrowth, setRentGrowth],
            ["hz", "Horizon (years)", horizon, setHorizon],
            ["sell", "Selling costs (%)", sellingCostPct, setSellingCostPct],
          ].map(([id, label, value, setter]) => (
            <div key={String(id)} className="space-y-2">
              <Label htmlFor={String(id)}>{String(label)}</Label>
              <Input
                id={String(id)}
                type="number"
                value={Number(value)}
                onChange={(e) =>
                  (setter as (n: number) => void)(Number(e.target.value) || 0)
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-soft to-background dark:from-card">
        <CardHeader>
          <CardTitle>Comparison over {horizon} years</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Monthly ownership cost
            </p>
            <p className="font-display text-3xl font-semibold">
              {formatCurrency(analysis.monthlyOwn)}
            </p>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total rent paid</span>
            <span className="font-semibold tabular-nums">
              {formatCurrency(analysis.rentCost)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Est. buy net cost</span>
            <span className="font-semibold tabular-nums">
              {formatCurrency(analysis.buyNet)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Est. equity after sale costs</span>
            <span className="font-semibold tabular-nums">
              {formatCurrency(analysis.estimatedEquity)}
            </span>
          </div>
          <p
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              analysis.advantage >= 0
                ? "bg-success/12 text-success"
                : "bg-warning/15 text-warning"
            }`}
          >
            {analysis.breakEvenYears} Net edge:{" "}
            {formatCurrency(Math.abs(analysis.advantage))}{" "}
            {analysis.advantage >= 0 ? "toward buying" : "toward renting"}.
          </p>
          <p className="text-xs text-muted-foreground">
            Simplified model — ignores tax deductions, opportunity cost of down payment, and
            refinance options.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
