"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { compareLoanScenarios, type LoanScenarioResult } from "@/lib/mortgage";
import { formatCurrency } from "@/lib/utils";

type ScenarioState = {
  label: string;
  homePrice: number;
  downPaymentPercent: number;
  annualRate: number;
  years: number;
};

const defaultScenarios: ScenarioState[] = [
  {
    label: "Scenario A",
    homePrice: 1_450_000,
    downPaymentPercent: 20,
    annualRate: 6.5,
    years: 30,
  },
  {
    label: "Scenario B",
    homePrice: 1_450_000,
    downPaymentPercent: 15,
    annualRate: 6.25,
    years: 30,
  },
  {
    label: "Scenario C",
    homePrice: 1_450_000,
    downPaymentPercent: 20,
    annualRate: 6.5,
    years: 15,
  },
];

export function MortgageComparisonCalculator() {
  const [scenarios, setScenarios] = React.useState(defaultScenarios);

  const results = React.useMemo(
    () =>
      compareLoanScenarios(
        scenarios.map((scenario) => ({
          ...scenario,
          propertyTaxRate: 1.1,
          insuranceMonthly: 185,
          hoaMonthly: 0,
        })),
      ),
    [scenarios],
  );

  function updateScenario(
    index: number,
    field: keyof ScenarioState,
    value: string | number,
  ) {
    setScenarios((prev) =>
      prev.map((scenario, i) =>
        i === index ? { ...scenario, [field]: value } : scenario,
      ),
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {scenarios.map((scenario, index) => (
          <Card key={scenario.label}>
            <CardHeader>
              <CardTitle>{scenario.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor={`${index}-price`}>Home price ($)</Label>
                <Input
                  id={`${index}-price`}
                  type="number"
                  min={0}
                  value={scenario.homePrice}
                  onChange={(e) =>
                    updateScenario(index, "homePrice", Number(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${index}-dp`}>Down payment (%)</Label>
                <Input
                  id={`${index}-dp`}
                  type="number"
                  min={0}
                  max={100}
                  value={scenario.downPaymentPercent}
                  onChange={(e) =>
                    updateScenario(
                      index,
                      "downPaymentPercent",
                      Number(e.target.value) || 0,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${index}-rate`}>Rate (%)</Label>
                <Input
                  id={`${index}-rate`}
                  type="number"
                  step={0.01}
                  min={0}
                  value={scenario.annualRate}
                  onChange={(e) =>
                    updateScenario(index, "annualRate", Number(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${index}-years`}>Term (years)</Label>
                <Input
                  id={`${index}-years`}
                  type="number"
                  min={1}
                  value={scenario.years}
                  onChange={(e) =>
                    updateScenario(index, "years", Number(e.target.value) || 30)
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Side-by-side comparison</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Metric</th>
                {results.map((result) => (
                  <th key={result.label} className="pb-3 pr-4 font-medium">
                    {result.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["Down payment", (r: LoanScenarioResult) => formatCurrency(r.downPayment)],
                  ["Loan amount", (r: LoanScenarioResult) => formatCurrency(r.loanAmount)],
                  [
                    "P&I / month",
                    (r: LoanScenarioResult) => formatCurrency(r.principalAndInterest),
                  ],
                  ["All-in / month", (r: LoanScenarioResult) => formatCurrency(r.totalMonthly)],
                  [
                    "Lifetime interest",
                    (r: LoanScenarioResult) => formatCurrency(r.totalInterest),
                  ],
                ] as const
              ).map(([label, formatter]) => (
                <tr key={String(label)} className="border-b border-border/70">
                  <td className="py-3 pr-4 text-muted-foreground">{label}</td>
                  {results.map((result) => (
                    <td key={result.label} className="py-3 pr-4 font-semibold tabular-nums">
                      {formatter(result)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-muted-foreground">
            Includes illustrative property tax (1.1%) and insurance estimates. PMI,
            Mello-Roos, and lender overlays may differ.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
