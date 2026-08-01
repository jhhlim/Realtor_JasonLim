"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";

import type { PropertyType, SearchFilters } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: "single_family", label: "Single Family" },
  { value: "condo", label: "Condo" },
  { value: "townhome", label: "Townhome" },
  { value: "multi_family", label: "Multi-Family" },
  { value: "land", label: "Land" },
];

interface ListingFiltersProps {
  value?: SearchFilters;
  onChange?: (filters: SearchFilters) => void;
  onSubmit?: (filters: SearchFilters) => void;
  className?: string;
}

export function ListingFilters({
  value,
  onChange,
  onSubmit,
  className,
}: ListingFiltersProps) {
  const [filters, setFilters] = React.useState<SearchFilters>(value ?? {});

  React.useEffect(() => {
    if (!value) return;
    // Surface ZIP searches in the location field for clearer UX.
    setFilters({
      ...value,
      query: value.query ?? value.zip ?? "",
    });
  }, [value]);

  function update(partial: SearchFilters) {
    const next = { ...filters, ...partial };
    setFilters(next);
    onChange?.(next);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit?.(filters);
  }

  function reset() {
    const cleared: SearchFilters = {};
    setFilters(cleared);
    onChange?.(cleared);
    onSubmit?.(cleared);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "space-y-6 rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-accent" />
          <h2 className="font-display text-lg font-semibold">Filters</h2>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={reset}>
          Reset
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="query">Location or MLS #</Label>
        <Input
          id="query"
          placeholder="City, neighborhood, ZIP…"
          value={filters.query ?? ""}
          onChange={(e) => update({ query: e.target.value || undefined })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="minPrice">Min price</Label>
          <Input
            id="minPrice"
            type="number"
            inputMode="numeric"
            placeholder="750000"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              update({
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxPrice">Max price</Label>
          <Input
            id="maxPrice"
            type="number"
            inputMode="numeric"
            placeholder="2500000"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              update({
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Beds</Label>
          <Select
            value={filters.beds?.toString() ?? "any"}
            onValueChange={(v) =>
              update({ beds: v === "any" ? undefined : Number(v) })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}+
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Baths</Label>
          <Select
            value={filters.baths?.toString() ?? "any"}
            onValueChange={(v) =>
              update({ baths: v === "any" ? undefined : Number(v) })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {[1, 2, 3, 4].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}+
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="minSqft">Min sqft</Label>
          <Input
            id="minSqft"
            type="number"
            value={filters.minSqft ?? ""}
            onChange={(e) =>
              update({
                minSqft: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Property type</Label>
          <Select
            value={filters.propertyType?.[0] ?? "any"}
            onValueChange={(v) =>
              update({
                propertyType:
                  v === "any" ? undefined : [v as PropertyType],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {propertyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        {(
          [
            ["openHouse", "Open house"],
            ["priceReduced", "Price reduced"],
            ["newConstruction", "New construction"],
            ["pool", "Pool"],
            ["garage", "Garage"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-3 text-sm">
            <Checkbox
              checked={Boolean(filters[key])}
              onCheckedChange={(checked) =>
                update({ [key]: checked === true ? true : undefined })
              }
            />
            {label}
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Sort</Label>
        <Select
          value={filters.sort ?? "newest"}
          onValueChange={(v) =>
            update({ sort: v as SearchFilters["sort"] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="sqft_desc">Largest</SelectItem>
            <SelectItem value="dom_asc">Days on market</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" variant="accent" className="w-full">
        Apply filters
      </Button>
    </form>
  );
}
