"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateMortgagePayment } from "@/lib/mortgage";
import { formatCurrency } from "@/lib/utils";

export function CashFlowCalculator() {
  const [price, setPrice] = React.useState(1_100_000);
  const [downPct, setDownPct] = React.useState(25);
  const [rate, setRate] = React.useState(6.75);
  const [years, setYears] = React.useState(30);
  const [rent, setRent] = React.useState(4200);
  const [vacancyPct, setVacancyPct] = React.useState(5);
  const [taxes, setTaxes] = React.useState(1100);
  const [insurance, setInsurance] = React.useState(160);
  const [hoa, setHoa] = React.useState(0);
  const [managementPct, setManagementPct] = React.useState(8);
  const [maintenance, setMaintenance] = React.useState(250);
  const [other, setOther] = React.useState(100);

  const loan = price * (1 - downPct / 100);
  const pi = calculateMortgagePayment({
    principal: loan,
    annualRate: rate,
    years,
  });
  const effectiveRent = rent * (1 - vacancyPct / 100);
  const management = (effectiveRent * managementPct) / 100;
  const expenses = taxes + insurance + hoa + management + maintenance + other + pi;
  const cashFlow = effectiveRent - expenses;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Rental property</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {[
            ["price", "Purchase price ($)", price, setPrice],
            ["dp", "Down payment (%)", downPct, setDownPct],
            ["rate", "Rate (%)", rate, setRate],
            ["term", "Term (years)", years, setYears],
            ["rent", "Gross rent / mo ($)", rent, setRent],
            ["vac", "Vacancy (%)", vacancyPct, setVacancyPct],
            ["tax", "Taxes / mo ($)", taxes, setTaxes],
            ["ins", "Insurance / mo ($)", insurance, setInsurance],
            ["hoa", "HOA / mo ($)", hoa, setHoa],
            ["mgmt", "Property mgmt (%)", managementPct, setManagementPct],
            ["maint", "Maintenance / mo ($)", maintenance, setMaintenance],
            ["other", "Other / mo ($)", other, setOther],
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
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Monthly cash flow
          </p>
          <p
            className={`font-display text-4xl font-semibold ${
              cashFlow >= 0 ? "text-success" : "text-destructive"
            }`}
          >
            {formatCurrency(cashFlow)}
          </p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Effective rent</span>
            <span className="font-medium">{formatCurrency(effectiveRent)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">P&I</span>
            <span className="font-medium">{formatCurrency(pi)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Operating + debt</span>
            <span className="font-medium">{formatCurrency(expenses)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2">
            <span className="text-muted-foreground">Annualized</span>
            <span className="font-semibold">{formatCurrency(cashFlow * 12)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
