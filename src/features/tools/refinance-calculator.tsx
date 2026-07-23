"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateRefinanceBreakEven } from "@/lib/mortgage";
import { formatCurrency } from "@/lib/utils";

export function RefinanceCalculator() {
  const [currentPayment, setCurrentPayment] = React.useState(7200);
  const [newPayment, setNewPayment] = React.useState(6400);
  const [closingCosts, setClosingCosts] = React.useState(12_000);

  const result = calculateRefinanceBreakEven({
    closingCosts,
    currentMonthlyPayment: currentPayment,
    newMonthlyPayment: newPayment,
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Refinance scenario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cur">Current monthly payment ($)</Label>
            <Input
              id="cur"
              type="number"
              value={currentPayment}
              onChange={(e) => setCurrentPayment(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new">New monthly payment ($)</Label>
            <Input
              id="new"
              type="number"
              value={newPayment}
              onChange={(e) => setNewPayment(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="costs">Closing costs ($)</Label>
            <Input
              id="costs"
              type="number"
              value={closingCosts}
              onChange={(e) => setClosingCosts(Number(e.target.value) || 0)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-soft to-background dark:from-card">
        <CardHeader>
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Monthly savings
          </p>
          <p className="font-display text-4xl font-semibold">
            {formatCurrency(result.monthlySavings)}
          </p>
        </CardHeader>
        <CardContent>
          {result.breakEvenMonths == null ? (
            <p className="text-sm text-muted-foreground">
              New payment is not lower — refinance does not break even on payment alone.
            </p>
          ) : (
            <p className="text-sm">
              Break-even in{" "}
              <span className="font-display text-2xl font-semibold">
                {result.breakEvenMonths}
              </span>{" "}
              months if you stay in the loan.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
