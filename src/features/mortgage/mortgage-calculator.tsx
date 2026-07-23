"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  buildAmortizationSchedule,
  calculateHousingPayment,
} from "@/lib/mortgage";
import { formatCurrency } from "@/lib/utils";

const PIE_COLORS = ["#0B1F33", "#1F6F78", "#64748b", "#94a3b8", "#cbd5e1", "#2a8a94"];

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function currencyInputProps(value: number, onChange: (n: number) => void) {
  return {
    type: "number" as const,
    min: 0,
    step: 1,
    value: Number.isFinite(value) ? value : 0,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(Number(e.target.value) || 0),
  };
}

export function MortgageCalculator() {
  const [homePrice, setHomePrice] = React.useState(1_450_000);
  const [downPaymentPercent, setDownPaymentPercent] = React.useState(20);
  const [rate, setRate] = React.useState(6.5);
  const [years, setYears] = React.useState(30);
  const [taxMode, setTaxMode] = React.useState<"annual" | "rate">("rate");
  const [propertyTaxAnnual, setPropertyTaxAnnual] = React.useState(15_950);
  const [propertyTaxRate, setPropertyTaxRate] = React.useState(1.1);
  const [insuranceMonthly, setInsuranceMonthly] = React.useState(185);
  const [hoaMonthly, setHoaMonthly] = React.useState(0);
  const [pmiThreshold, setPmiThreshold] = React.useState(80);
  const [pmiAnnualRate, setPmiAnnualRate] = React.useState(0.5);
  const [extraMonthly, setExtraMonthly] = React.useState(0);
  const [showFullSchedule, setShowFullSchedule] = React.useState(false);

  const breakdown = React.useMemo(
    () =>
      calculateHousingPayment({
        homePrice,
        downPaymentPercent,
        annualRate: rate,
        years,
        propertyTaxAnnual: taxMode === "annual" ? propertyTaxAnnual : undefined,
        propertyTaxRate: taxMode === "rate" ? propertyTaxRate : undefined,
        insuranceMonthly,
        hoaMonthly,
        pmiLtvThreshold: pmiThreshold,
        pmiAnnualRate,
        extraMonthlyPayment: extraMonthly,
      }),
    [
      homePrice,
      downPaymentPercent,
      rate,
      years,
      taxMode,
      propertyTaxAnnual,
      propertyTaxRate,
      insuranceMonthly,
      hoaMonthly,
      pmiThreshold,
      pmiAnnualRate,
      extraMonthly,
    ],
  );

  const amortization = React.useMemo(
    () =>
      buildAmortizationSchedule({
        principal: breakdown.loanAmount,
        annualRate: rate,
        years,
        extraPayment: extraMonthly,
      }),
    [breakdown.loanAmount, rate, years, extraMonthly],
  );

  const pieData = [
    { name: "Principal & interest", value: breakdown.principalAndInterest },
    { name: "Taxes", value: breakdown.taxes },
    { name: "Insurance", value: breakdown.insurance },
    { name: "HOA", value: breakdown.hoa },
    { name: "PMI", value: breakdown.pmi },
    { name: "Extra", value: breakdown.extra },
  ].filter((d) => d.value > 0);

  const balanceSeries = React.useMemo(() => {
    const step = Math.max(1, Math.floor(amortization.schedule.length / 60));
    return amortization.schedule
      .filter((_, i) => i % step === 0 || i === amortization.schedule.length - 1)
      .map((row) => ({
        month: row.month,
        balance: Math.round(row.balance),
        label: `Mo ${row.month}`,
      }));
  }, [amortization.schedule]);

  const visibleRows = showFullSchedule
    ? amortization.schedule
    : amortization.schedule.slice(0, 12);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <CardHeader>
          <CardTitle>Loan inputs</CardTitle>
          <p className="text-sm text-muted-foreground">
            Estimates for planning only — not a lender quote.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Field id="home-price" label="Home price">
            <Input
              id="home-price"
              aria-describedby="home-price-hint"
              {...currencyInputProps(homePrice, setHomePrice)}
            />
          </Field>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="down-payment">Down payment</Label>
              <span className="text-sm font-medium tabular-nums" id="down-payment-value">
                {downPaymentPercent}% · {formatCurrency(breakdown.downPayment)}
              </span>
            </div>
            <Slider
              id="down-payment"
              aria-valuetext={`${downPaymentPercent} percent`}
              value={[downPaymentPercent]}
              min={0}
              max={60}
              step={1}
              onValueChange={(v) => setDownPaymentPercent(v[0] ?? 20)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="rate" label="Interest rate (%)">
              <Input
                id="rate"
                type="number"
                min={0}
                step={0.01}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value) || 0)}
              />
            </Field>
            <Field id="term" label="Term (years)">
              <Input
                id="term"
                type="number"
                min={1}
                max={40}
                value={years}
                onChange={(e) => setYears(Number(e.target.value) || 30)}
              />
            </Field>
          </div>

          <div className="space-y-3 rounded-2xl border border-border/80 bg-slate-soft/60 p-4 dark:bg-secondary/30">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">Property tax</p>
              <div className="flex gap-1 rounded-lg bg-background p-1">
                <Button
                  type="button"
                  size="sm"
                  variant={taxMode === "rate" ? "accent" : "ghost"}
                  onClick={() => setTaxMode("rate")}
                  aria-pressed={taxMode === "rate"}
                >
                  % of price
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={taxMode === "annual" ? "accent" : "ghost"}
                  onClick={() => setTaxMode("annual")}
                  aria-pressed={taxMode === "annual"}
                >
                  Annual $
                </Button>
              </div>
            </div>
            {taxMode === "rate" ? (
              <Field id="tax-rate" label="Annual tax rate (%)" hint="Typical Bay Area range ~0.9–1.2% before Mello-Roos.">
                <Input
                  id="tax-rate"
                  type="number"
                  min={0}
                  step={0.01}
                  value={propertyTaxRate}
                  onChange={(e) => setPropertyTaxRate(Number(e.target.value) || 0)}
                />
              </Field>
            ) : (
              <Field id="tax-annual" label="Annual property tax ($)">
                <Input
                  id="tax-annual"
                  {...currencyInputProps(propertyTaxAnnual, setPropertyTaxAnnual)}
                />
              </Field>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="insurance" label="Insurance (monthly $)">
              <Input
                id="insurance"
                {...currencyInputProps(insuranceMonthly, setInsuranceMonthly)}
              />
            </Field>
            <Field id="hoa" label="HOA (monthly $)">
              <Input id="hoa" {...currencyInputProps(hoaMonthly, setHoaMonthly)} />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="pmi-threshold"
              label="PMI LTV threshold (%)"
              hint="PMI typically drops at or below 80% LTV."
            >
              <Input
                id="pmi-threshold"
                type="number"
                min={0}
                max={100}
                value={pmiThreshold}
                onChange={(e) => setPmiThreshold(Number(e.target.value) || 0)}
              />
            </Field>
            <Field id="pmi-rate" label="PMI annual rate (%)">
              <Input
                id="pmi-rate"
                type="number"
                min={0}
                step={0.01}
                value={pmiAnnualRate}
                onChange={(e) => setPmiAnnualRate(Number(e.target.value) || 0)}
              />
            </Field>
          </div>

          <Field
            id="extra"
            label="Extra monthly principal ($)"
            hint="Optional prepayment applied after scheduled principal."
          >
            <Input
              id="extra"
              {...currencyInputProps(extraMonthly, setExtraMonthly)}
            />
          </Field>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="overflow-hidden border-accent/20 bg-gradient-to-br from-slate-soft to-background dark:from-card">
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Estimated total payment
            </p>
            <p className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {formatCurrency(breakdown.totalMonthly, {
                maximumFractionDigits: 0,
              })}
              <span className="ml-1 text-lg font-sans font-medium text-muted-foreground">
                /mo
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Loan {formatCurrency(breakdown.loanAmount)} · LTV{" "}
              {breakdown.ltv.toFixed(1)}% · Payoff{" "}
              {amortization.payoffMonths} months
            </p>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[
              ["Principal & interest", breakdown.principalAndInterest],
              ["Taxes", breakdown.taxes],
              ["Insurance", breakdown.insurance],
              ["HOA", breakdown.hoa],
              ["PMI", breakdown.pmi],
              ["Extra", breakdown.extra],
            ].map(([label, value]) => (
              <div
                key={String(label)}
                className="flex items-center justify-between rounded-xl border border-border/70 bg-background/80 px-3.5 py-3"
              >
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-semibold tabular-nums">
                  {formatCurrency(Number(value), { maximumFractionDigits: 0 })}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Payment & amortization</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pie">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="pie">Breakdown</TabsTrigger>
                <TabsTrigger value="balance">Balance</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="pie" className="pt-2">
                <div className="h-64 w-full" role="img" aria-label="Monthly payment breakdown chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={58}
                        outerRadius={88}
                        paddingAngle={2}
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) =>
                          formatCurrency(Number(value), { maximumFractionDigits: 0 })
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {pieData.map((item, i) => (
                    <li key={item.name} className="flex items-center gap-2 text-sm">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                        aria-hidden
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="balance" className="pt-2">
                <div className="h-64 w-full" role="img" aria-label="Loan balance over time">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={balanceSeries}>
                      <defs>
                        <linearGradient id="bal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1F6F78" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#1F6F78" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v) =>
                          formatCurrency(Number(v), {
                            notation: "compact",
                            maximumFractionDigits: 1,
                          } as Intl.NumberFormatOptions)
                        }
                      />
                      <Tooltip
                        formatter={(value) =>
                          formatCurrency(Number(value), { maximumFractionDigits: 0 })
                        }
                        labelFormatter={(label) => `Month ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="#1F6F78"
                        fill="url(#bal)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Total interest {formatCurrency(amortization.totalInterest)} · Total paid{" "}
                  {formatCurrency(amortization.totalPaid)}
                </p>
              </TabsContent>

              <TabsContent value="schedule" className="pt-2">
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full min-w-[32rem] text-left text-sm">
                    <caption className="sr-only">
                      Amortization schedule showing payment, principal, interest, and balance
                    </caption>
                    <thead className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th scope="col" className="px-3 py-2.5 font-medium">
                          Mo
                        </th>
                        <th scope="col" className="px-3 py-2.5 font-medium">
                          Payment
                        </th>
                        <th scope="col" className="px-3 py-2.5 font-medium">
                          Principal
                        </th>
                        <th scope="col" className="px-3 py-2.5 font-medium">
                          Interest
                        </th>
                        <th scope="col" className="px-3 py-2.5 font-medium">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleRows.map((row) => (
                        <tr key={row.month} className="border-t border-border/70">
                          <td className="px-3 py-2 tabular-nums">{row.month}</td>
                          <td className="px-3 py-2 tabular-nums">
                            {formatCurrency(row.payment, { maximumFractionDigits: 0 })}
                          </td>
                          <td className="px-3 py-2 tabular-nums">
                            {formatCurrency(row.principal + row.extra, {
                              maximumFractionDigits: 0,
                            })}
                          </td>
                          <td className="px-3 py-2 tabular-nums">
                            {formatCurrency(row.interest, { maximumFractionDigits: 0 })}
                          </td>
                          <td className="px-3 py-2 tabular-nums">
                            {formatCurrency(row.balance, { maximumFractionDigits: 0 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {amortization.schedule.length > 12 ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-3"
                    onClick={() => setShowFullSchedule((s) => !s)}
                  >
                    {showFullSchedule
                      ? "Show first 12 months"
                      : `Show full schedule (${amortization.schedule.length} months)`}
                  </Button>
                ) : null}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
