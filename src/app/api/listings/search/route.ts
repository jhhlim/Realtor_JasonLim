import { NextResponse } from "next/server";

import type { ListingStatus, PropertyType, SearchFilters } from "@/types";
import { SearchServiceImpl } from "@/services/listings";

export const dynamic = "force-dynamic";

function parseNumber(value: string | null): number | undefined {
  if (value == null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function parseBoolean(value: string | null): boolean | undefined {
  if (value == null || value === "") return undefined;
  if (value === "1" || value.toLowerCase() === "true") return true;
  if (value === "0" || value.toLowerCase() === "false") return false;
  return undefined;
}

function parseCsv<T extends string>(value: string | null): T[] | undefined {
  if (!value) return undefined;
  const parts = value
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length ? (parts as T[]) : undefined;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: SearchFilters = {
      query: searchParams.get("query") ?? searchParams.get("q") ?? undefined,
      city: searchParams.get("city") ?? undefined,
      zip: searchParams.get("zip") ?? undefined,
      mlsNumber: searchParams.get("mlsNumber") ?? undefined,
      neighborhood: searchParams.get("neighborhood") ?? undefined,
      schoolDistrict: searchParams.get("schoolDistrict") ?? undefined,
      minPrice: parseNumber(searchParams.get("minPrice")),
      maxPrice: parseNumber(searchParams.get("maxPrice")),
      beds: parseNumber(searchParams.get("beds")),
      baths: parseNumber(searchParams.get("baths")),
      minSqft: parseNumber(searchParams.get("minSqft")),
      maxSqft: parseNumber(searchParams.get("maxSqft")),
      minLotSize: parseNumber(searchParams.get("minLotSize")),
      maxHoa: parseNumber(searchParams.get("maxHoa")),
      garage: parseBoolean(searchParams.get("garage")),
      pool: parseBoolean(searchParams.get("pool")),
      openHouse: parseBoolean(searchParams.get("openHouse")),
      newConstruction: parseBoolean(searchParams.get("newConstruction")),
      priceReduced: parseBoolean(searchParams.get("priceReduced")),
      status: parseCsv<ListingStatus>(searchParams.get("status")),
      propertyType: parseCsv<PropertyType>(searchParams.get("propertyType")),
      page: parseNumber(searchParams.get("page")) ?? 1,
      pageSize: parseNumber(searchParams.get("pageSize")) ?? 24,
      sort: (searchParams.get("sort") as SearchFilters["sort"]) ?? undefined,
    };

    const suggest = searchParams.get("suggest");
    const service = new SearchServiceImpl();

    if (suggest != null) {
      const suggestions = await service.suggest(suggest);
      return NextResponse.json({ suggestions });
    }

    const result = await service.search(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/listings/search]", error);
    return NextResponse.json(
      { error: "Failed to search listings" },
      { status: 500 },
    );
  }
}
