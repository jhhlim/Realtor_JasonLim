"use client";

import * as React from "react";
import { AlertTriangle, TrendingUp } from "lucide-react";

import { siteConfig } from "@/config/site";
import { BrandName } from "@/components/layout/brand-name";
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

export function MarketPredictionForm() {
  const [neighborhood, setNeighborhood] = React.useState("san-jose");
  const [horizon, setHorizon] = React.useState("12");
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const hood = mockNeighborhoods.find((n) => n.slug === neighborhood);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
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
            "Market prediction interest",
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
        throw new Error(data.error ?? "Unable to submit your request.");
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
    <div className="space-y-6">
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="flex gap-3 p-4 text-sm">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <p className="text-muted-foreground">
            <strong className="text-foreground">Disclaimer:</strong> Forward-looking
            market views are illustrative only — not investment advice, not a guarantee
            of future prices, and not a substitute for licensed appraisal or financial
            planning. Past trends do not predict future results.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>Market outlook preview</CardTitle>
              <Badge variant="accent">AI preview</Badge>
            </div>
            <CardDescription>
              AI-generated neighborhood forecasts are in development. Join the waitlist
              and <BrandName /> will share curated market reports in the meantime.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === "success" ? (
              <p className="text-sm text-muted-foreground">
                You&apos;re on the list — we&apos;ll send curated outlook notes for{" "}
                {hood?.name ?? "your market"} when new reports publish.
              </p>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
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
                <div className="space-y-2">
                  <Label htmlFor="pred-email">Email for updates</Label>
                  <Input
                    id="pred-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errorMessage ? (
                  <p className="text-sm text-destructive">{errorMessage}</p>
                ) : null}
                <Button type="submit" variant="accent" disabled={status === "loading"}>
                  {status === "loading" ? "Submitting…" : "Notify me when live"}
                </Button>
              </form>
            )}
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
            <p className="text-muted-foreground">
              Automated prediction bands will layer inventory, rates, and macro signals —
              always reviewed by a licensed agent before client use.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
