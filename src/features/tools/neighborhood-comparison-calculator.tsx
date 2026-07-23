"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockNeighborhoods } from "@/data/mock-neighborhoods";
import { formatCurrency } from "@/lib/utils";

export function NeighborhoodComparisonCalculator() {
  const [leftSlug, setLeftSlug] = React.useState("san-jose");
  const [rightSlug, setRightSlug] = React.useState("cupertino");

  const left = mockNeighborhoods.find((n) => n.slug === leftSlug) ?? mockNeighborhoods[0];
  const right =
    mockNeighborhoods.find((n) => n.slug === rightSlug) ??
    mockNeighborhoods[1] ??
    mockNeighborhoods[0];

  const rows = [
    {
      label: "Median price",
      left: formatCurrency(left.medianPrice),
      right: formatCurrency(right.medianPrice),
    },
    {
      label: "YoY change",
      left: `${left.priceChangeYoY >= 0 ? "+" : ""}${left.priceChangeYoY.toFixed(1)}%`,
      right: `${right.priceChangeYoY >= 0 ? "+" : ""}${right.priceChangeYoY.toFixed(1)}%`,
    },
    {
      label: "Avg days on market",
      left: `${left.avgDom} days`,
      right: `${right.avgDom} days`,
    },
    {
      label: "County",
      left: left.county,
      right: right.county,
    },
    {
      label: "Schools highlight",
      left: left.schoolsHighlight,
      right: right.schoolsHighlight,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hood-a">Community A</Label>
          <Select value={leftSlug} onValueChange={setLeftSlug}>
            <SelectTrigger id="hood-a">
              <SelectValue placeholder="Select community" />
            </SelectTrigger>
            <SelectContent>
              {mockNeighborhoods.map((hood) => (
                <SelectItem key={hood.slug} value={hood.slug}>
                  {hood.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="hood-b">Community B</Label>
          <Select value={rightSlug} onValueChange={setRightSlug}>
            <SelectTrigger id="hood-b">
              <SelectValue placeholder="Select community" />
            </SelectTrigger>
            <SelectContent>
              {mockNeighborhoods.map((hood) => (
                <SelectItem key={hood.slug} value={hood.slug}>
                  {hood.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Community A
            </p>
            <CardTitle>{left.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{left.tagline}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Community B
            </p>
            <CardTitle>{right.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{right.tagline}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid gap-3 border-b border-border/70 pb-4 last:border-0 last:pb-0 sm:grid-cols-[140px_1fr_1fr]"
            >
              <p className="text-sm font-medium text-muted-foreground">{row.label}</p>
              <p className="text-sm">{row.left}</p>
              <p className="text-sm">{row.right}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {[left, right].map((hood) => (
          <Card key={hood.slug}>
            <CardHeader>
              <CardTitle className="text-lg">{hood.name} lifestyle</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {hood.lifestyle.map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
