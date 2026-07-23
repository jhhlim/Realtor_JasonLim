"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { estimateAffordability } from "@/lib/mortgage";
import { formatCurrency } from "@/lib/utils";

export function AffordabilityCalculator() {
  const [annualIncome, setAnnualIncome] = React.useState(320_000);
  const [monthlyDebts, setMonthlyDebts] = React.useState(800);
  const [rate, setRate] = React.useState(6.5);
  const [downPaymentPercent, setDownPaymentPercent] = React.useState(20);
  const [dti, setDti] = React.useState(36);

  const result = React.useMemo(
    () =>
      estimateAffordability({
        annualIncome,
        monthlyDebts,
        annualRate: rate,
        downPaymentPercent,
        dtiRatio: dti / 100,
      }),
    [annualIncome, monthlyDebts, rate, downPaymentPercent, dti],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Your finances</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="income">Gross annual income ($)</Label>
            <Input
              id="income"
              type="number"
              min={0}
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="debts">Monthly debts ($)</Label>
            <Input
              id="debts"
              type="number"
              min={0}
              value={monthlyDebts}
              onChange={(e) => setMonthlyDebts(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aff-rate">Rate (%)</Label>
            <Input
              id="aff-rate"
              type="number"
              step={0.01}
              min={0}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aff-dp">Down payment (%)</Label>
            <Input
              id="aff-dp"
              type="number"
              min={0}
              max={100}
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dti">Target DTI (%)</Label>
            <Input
              id="dti"
              type="number"
              min={20}
              max={50}
              value={dti}
              onChange={(e) => setDti(Number(e.target.value) || 36)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-soft to-background dark:from-card">
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Estimated max price
          </p>
          <p className="font-display text-4xl font-semibold">
            {formatCurrency(result.maxHomePrice)}
          </p>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-border/70 py-2">
            <span className="text-muted-foreground">Max housing / month</span>
            <span className="font-semibold tabular-nums">
              {formatCurrency(result.maxMonthlyHousing)}
            </span>
          </div>
          <div className="flex justify-between border-b border-border/70 py-2">
            <span className="text-muted-foreground">Max loan</span>
            <span className="font-semibold tabular-nums">
              {formatCurrency(result.maxLoanAmount)}
            </span>
          </div>
          <p className="pt-2 text-muted-foreground">
            Heuristic using {dti}% DTI, {downPaymentPercent}% down, and illustrative tax/insurance
            assumptions. Lenders underwrite with credit, reserves, and program overlays.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
