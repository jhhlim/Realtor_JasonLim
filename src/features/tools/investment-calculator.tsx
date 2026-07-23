"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateCapRate, calculateCashOnCash } from "@/lib/mortgage";
import { formatCurrency } from "@/lib/utils";

export function InvestmentCalculator() {
  const [purchasePrice, setPurchasePrice] = React.useState(1_200_000);
  const [grossRent, setGrossRent] = React.useState(54_000);
  const [vacancyPct, setVacancyPct] = React.useState(4);
  const [opex, setOpex] = React.useState(18_000);
  const [cashInvested, setCashInvested] = React.useState(300_000);
  const [debtService, setDebtService] = React.useState(42_000);

  const noi = grossRent * (1 - vacancyPct / 100) - opex;
  const annualCashFlow = noi - debtService;
  const capRate = calculateCapRate({ noi, purchasePrice });
  const coc = calculateCashOnCash({ annualCashFlow, cashInvested });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Investment inputs</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {[
            ["price", "Purchase price ($)", purchasePrice, setPurchasePrice],
            ["rent", "Gross rent / year ($)", grossRent, setGrossRent],
            ["vac", "Vacancy (%)", vacancyPct, setVacancyPct],
            ["opex", "Operating expenses / year ($)", opex, setOpex],
            ["cash", "Cash invested ($)", cashInvested, setCashInvested],
            ["debt", "Annual debt service ($)", debtService, setDebtService],
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
          <CardTitle>Returns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Cap rate
            </p>
            <p className="font-display text-4xl font-semibold">{capRate.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Cash-on-cash
            </p>
            <p className="font-display text-4xl font-semibold">{coc.toFixed(2)}%</p>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">NOI</span>
            <span className="font-semibold">{formatCurrency(noi)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Annual cash flow</span>
            <span className="font-semibold">{formatCurrency(annualCashFlow)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
