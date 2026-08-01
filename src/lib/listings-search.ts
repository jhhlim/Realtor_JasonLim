import type { PropertyType, SearchFilters, ListingStatus } from "@/types";

type ParamValue = string | string[] | undefined;

function first(value: ParamValue): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function toNumber(value: ParamValue): number | undefined {
  const raw = first(value);
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

function toBool(value: ParamValue): true | undefined {
  const raw = first(value);
  if (raw === "1" || raw === "true" || raw === "yes") return true;
  return undefined;
}

const propertyTypes: PropertyType[] = [
  "single_family",
  "condo",
  "townhome",
  "multi_family",
  "land",
  "other",
];

const statuses: ListingStatus[] = [
  "active",
  "pending",
  "sold",
  "coming_soon",
  "withdrawn",
];

const sorts: NonNullable<SearchFilters["sort"]>[] = [
  "price_asc",
  "price_desc",
  "newest",
  "sqft_desc",
  "dom_asc",
];

function normalizeZip(value?: string): string | undefined {
  if (!value) return undefined;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 5 ? digits.slice(0, 5) : undefined;
}

export function parseSearchParams(
  params: Record<string, ParamValue>,
): SearchFilters {
  const propertyTypeRaw = first(params.propertyType);
  const statusRaw = first(params.status);
  const sortRaw = first(params.sort);
  const query = first(params.query)?.trim() || undefined;
  const queryZip = normalizeZip(query);
  const zip = normalizeZip(first(params.zip)) ?? queryZip;

  return {
    // Keep ZIP-only searches on `zip` so filters stay clear in the URL.
    query: queryZip ? undefined : query,
    city: first(params.city) || undefined,
    zip,
    mlsNumber: first(params.mlsNumber) || undefined,
    neighborhood: first(params.neighborhood) || undefined,
    schoolDistrict: first(params.schoolDistrict) || undefined,
    minPrice: toNumber(params.minPrice),
    maxPrice: toNumber(params.maxPrice),
    beds: toNumber(params.beds),
    baths: toNumber(params.baths),
    minSqft: toNumber(params.minSqft),
    maxSqft: toNumber(params.maxSqft),
    minLotSize: toNumber(params.minLotSize),
    maxHoa: toNumber(params.maxHoa),
    garage: toBool(params.garage),
    pool: toBool(params.pool),
    openHouse: toBool(params.openHouse),
    newConstruction: toBool(params.newConstruction),
    priceReduced: toBool(params.priceReduced),
    propertyType:
      propertyTypeRaw && propertyTypes.includes(propertyTypeRaw as PropertyType)
        ? [propertyTypeRaw as PropertyType]
        : undefined,
    status:
      statusRaw && statuses.includes(statusRaw as ListingStatus)
        ? [statusRaw as ListingStatus]
        : undefined,
    sort:
      sortRaw && sorts.includes(sortRaw as NonNullable<SearchFilters["sort"]>)
        ? (sortRaw as SearchFilters["sort"])
        : "newest",
    page: toNumber(params.page) ?? 1,
    pageSize: toNumber(params.pageSize) ?? 12,
  };
}

export function filtersToSearchParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams();
  const set = (key: string, value: string | number | boolean | undefined) => {
    if (value === undefined || value === "" || value === false) return;
    params.set(key, String(value));
  };

  set("query", filters.query);
  set("city", filters.city);
  set("zip", filters.zip);
  set("mlsNumber", filters.mlsNumber);
  set("neighborhood", filters.neighborhood);
  set("schoolDistrict", filters.schoolDistrict);
  set("minPrice", filters.minPrice);
  set("maxPrice", filters.maxPrice);
  set("beds", filters.beds);
  set("baths", filters.baths);
  set("minSqft", filters.minSqft);
  set("maxSqft", filters.maxSqft);
  set("minLotSize", filters.minLotSize);
  set("maxHoa", filters.maxHoa);
  set("garage", filters.garage);
  set("pool", filters.pool);
  set("openHouse", filters.openHouse);
  set("newConstruction", filters.newConstruction);
  set("priceReduced", filters.priceReduced);
  set("propertyType", filters.propertyType?.[0]);
  set("status", filters.status?.[0]);
  if (filters.sort && filters.sort !== "newest") set("sort", filters.sort);
  if (filters.page && filters.page > 1) set("page", filters.page);
  if (filters.pageSize && filters.pageSize !== 12) set("pageSize", filters.pageSize);

  return params;
}
