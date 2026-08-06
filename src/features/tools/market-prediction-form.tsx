"use client";

import * as React from "react";
import { AlertTriangle, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockNeighborhoods } from "@/data/mock-neighborhoods";
import { AiAnalyzeSection } from "@/features/tools/use-ai-analysis";

export function MarketPredictionForm() {
  const [neighborhood, setNeighborhood] = React.useState("san-jose");
  const [horizon, setHorizon] = React.useState("12");
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const hood = mockNeighborhoods.find((n) => n.slug === neighborhood);

  const computedMetrics = React.useMemo(
    () =>
      hood
        ? {
            medianPrice: hood.medianPrice,
            priceChangeYoY: hood.priceChangeYoY,
            avgDom: hood.avgDom,
            horizonMonths: Number(horizon) || 12,
          }
        : { horizonMonths: Number(horizon) || 12 },
    [hood, horizon],
  );

  const inputs = React.useMemo(
    () => ({
      neighborhood,
      neighborhoodName: hood?.name ?? neighborhood,
      horizonMonths: Number(horizon) || 12,
    }),
    [neighborhood, hood?.name, horizon],
  );

  async function onSubscribe(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Market outlook subscriber",
          email,
          interest: "other",
          source: "market-prediction",
          message: [
            "Market prediction updates",
            `Neighborhood: ${hood?.name ?? neighborhood}`,
            `Horizon: ${horizon} months`,
          ].join("\n"),
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Unable to submit.");
      }

      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  }

  return (
    <div className="space-y-8">
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="flex gap-3 p-4 text-sm">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <p className="text-muted-foreground">
            <strong className="text-foreground">Disclaimer:</strong> Forward-looking
            views are illustrative only — not investment advice or a guarantee of future
            prices. Always verify with licensed professionals.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>Market outlook</CardTitle>
              <Badge variant="accent">AI powered</Badge>
            </div>
            <CardDescription>
              Select a Silicon Valley neighborhood and forecast horizon. Jason&apos;s AI
              explains affordability, risks, negotiation context, and appreciation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pred-hood">Neighborhood</Label>
              <Select value={neighborhood} onValueChange={setNeighborhood}>
                <SelectTrigger id="pred-hood">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockNeighborhoods.map((n) => (
                    <SelectItem key={n.slug} value={n.slug}>
                      {n.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pred-horizon">Forecast horizon (months)</Label>
              <Input
                id="pred-horizon"
                type="number"
                min={3}
                max={36}
                value={horizon}
                onChange={(e) => setHorizon(e.target.value)}
              />
            </div>
            <form onSubmit={onSubscribe} className="flex flex-wrap gap-3 border-t border-border/70 pt-4">
              <div className="min-w-[200px] flex-1 space-y-2">
                <Label htmlFor="pred-email">Email for market updates (optional)</Label>
                <Input
                  id="pred-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" variant="outline" disabled={status === "loading" || !email}>
                  {status === "loading" ? "…" : "Subscribe"}
                </Button>
              </div>
            </form>
            {status === "success" ? (
              <p className="text-sm text-accent">Subscribed — we&apos;ll send curated updates.</p>
            ) : null}
            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="h-fit bg-gradient-to-br from-slate-soft to-background dark:from-card">
          <CardHeader>
            <TrendingUp className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">
              {hood?.name ?? "Market"} snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Median price</span>
              <span className="font-semibold">
                {hood ? `$${hood.medianPrice.toLocaleString()}` : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">YoY change</span>
              <span className="font-semibold">
                {hood
                  ? `${hood.priceChangeYoY >= 0 ? "+" : ""}${hood.priceChangeYoY.toFixed(1)}%`
                  : "—"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <AiAnalyzeSection
        tool="market-prediction"
        inputs={inputs}
        computedMetrics={computedMetrics}
        label="Get Jason's market outlook"
      />
    </div>
  );
}
