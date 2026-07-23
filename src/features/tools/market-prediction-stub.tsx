"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MarketPredictionStub() {
  return (
    <div className="space-y-6">
      <div
        role="note"
        className="rounded-2xl border border-warning/30 bg-warning/10 px-5 py-4 text-sm text-foreground"
      >
        <p className="font-medium text-warning">Disclaimer</p>
        <p className="mt-1 text-muted-foreground">
          Market forecasts are speculative and not guarantees. Real estate involves risk;
          past performance does not predict future results. This page is a product stub for
          an upcoming AI outlook — not financial, legal, or investment advice.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "South Bay inventory",
            body: "AI narrative will summarize weeks of supply and new listing velocity by city.",
          },
          {
            title: "Rate path scenarios",
            body: "Scenario cards for base / dovish / sticky inflation rate paths.",
          },
          {
            title: "Price band outlook",
            body: "City-level 6–12 month range estimates with confidence intervals.",
          },
        ].map((card) => (
          <Card key={card.title} className="border-dashed">
            <CardHeader>
              <Badge variant="secondary" className="w-fit">
                Coming soon
              </Badge>
              <CardTitle className="text-lg">{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{card.body}</CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-soft/50 dark:bg-secondary/20">
        <CardHeader>
          <CardTitle className="text-xl">How it will work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Planned inputs: MLS closed/active stats, Fed / mortgage rate series, and local
            employment indicators. Output: human-readable brief with charts and source links.
          </p>
          <p>Always pair model output with on-the-ground agent judgment.</p>
        </CardContent>
      </Card>
    </div>
  );
}
