"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  calculateMortgagePayment,
  cn,
  formatCurrency,
} from "@/lib/utils";

interface MortgageEstimateProps {
  price: number;
  className?: string;
  defaultDownPaymentPercent?: number;
  defaultRate?: number;
  defaultYears?: number;
}

export function MortgageEstimate({
  price,
  className,
  defaultDownPaymentPercent = 20,
  defaultRate = 6.5,
  defaultYears = 30,
}: MortgageEstimateProps) {
  const [downPaymentPercent, setDownPaymentPercent] = React.useState(
    defaultDownPaymentPercent,
  );
  const [rate, setRate] = React.useState(defaultRate);
  const [years, setYears] = React.useState(defaultYears);

  const downPayment = (price * downPaymentPercent) / 100;
  const principal = Math.max(price - downPayment, 0);
  const monthly = calculateMortgagePayment({
    principal,
    annualRate: rate,
    years,
  });

  return (
    <Card className={cn("border-border/80", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Payment estimate</CardTitle>
        <p className="text-sm text-muted-foreground">
          Illustrative principal & interest only — taxes, insurance, and HOA not included.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-2xl bg-slate-soft px-5 py-4 dark:bg-secondary/50">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Estimated monthly
          </p>
          <p className="mt-1 font-display text-3xl font-semibold text-foreground">
            {formatCurrency(monthly)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Loan amount {formatCurrency(principal)} · {years}-year · {rate}%
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <Label>Down payment</Label>
            <span className="font-medium">
              {downPaymentPercent}% · {formatCurrency(downPayment)}
            </span>
          </div>
          <Slider
            value={[downPaymentPercent]}
            min={5}
            max={50}
            step={1}
            onValueChange={(v) => setDownPaymentPercent(v[0] ?? 20)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="rate">Interest rate (%)</Label>
            <Input
              id="rate"
              type="number"
              step="0.01"
              min={0}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="years">Term (years)</Label>
            <Input
              id="years"
              type="number"
              min={1}
              max={40}
              value={years}
              onChange={(e) => setYears(Number(e.target.value) || 30)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
