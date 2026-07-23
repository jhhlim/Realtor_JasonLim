"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { mockNeighborhoods } from "@/data/mock-neighborhoods";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function NeighborhoodComparisonTool() {
  const [leftSlug, setLeftSlug] = React.useState(mockNeighborhoods[0]?.slug ?? "san-jose");
  const [rightSlug, setRightSlug] = React.useState(
    mockNeighborhoods[2]?.slug ?? "fremont",
  );

  const left = mockNeighborhoods.find((n) => n.slug === leftSlug);
  const right = mockNeighborhoods.find((n) => n.slug === rightSlug);

  if (!left || !right) return null;

  const rows: { label: string; a: string; b: string }[] = [
    {
      label: "Median price",
      a: formatCurrency(left.medianPrice),
      b: formatCurrency(right.medianPrice),
    },
    {
      label: "YoY price change",
      a: `${left.priceChangeYoY > 0 ? "+" : ""}${left.priceChangeYoY}%`,
      b: `${right.priceChangeYoY > 0 ? "+" : ""}${right.priceChangeYoY}%`,
    },
    {
      label: "Avg days on market",
      a: formatNumber(left.avgDom),
      b: formatNumber(right.avgDom),
    },
    { label: "County", a: left.county, b: right.county },
    { label: "Schools", a: left.schoolsHighlight, b: right.schoolsHighlight },
    {
      label: "Lifestyle",
      a: left.lifestyle.slice(0, 3).join(" · "),
      b: right.lifestyle.slice(0, 3).join(" · "),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="left-community">Community A</Label>
          <Select value={leftSlug} onValueChange={setLeftSlug}>
            <SelectTrigger id="left-community">
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
          <Label htmlFor="right-community">Community B</Label>
          <Select value={rightSlug} onValueChange={setRightSlug}>
            <SelectTrigger id="right-community">
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
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {[left, right].map((n) => (
          <Card key={n.slug} className="overflow-hidden">
            <div
              className="h-36 bg-cover bg-center"
              style={{ backgroundImage: `url(${n.heroImage})` }}
              role="img"
              aria-label={n.name}
            />
            <CardHeader>
              <CardTitle>{n.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{n.tagline}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Side-by-side</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Metric</th>
                <th className="py-2 pr-4 font-medium">{left.name}</th>
                <th className="py-2 font-medium">{right.name}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-border/70 align-top">
                  <td className="py-3 pr-4 font-medium">{row.label}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{row.a}</td>
                  <td className="py-3 text-muted-foreground">{row.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Badge variant="accent">Mock market data</Badge>
        <Badge variant="secondary">Replace with live MLS + school APIs</Badge>
      </div>
    </div>
  );
}
