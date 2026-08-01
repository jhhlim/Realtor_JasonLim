"use client";

import { usePathname, useRouter } from "next/navigation";

import type { SearchFilters } from "@/types";
import { ListingFilters } from "@/components/listings/listing-filters";
import { filtersToSearchParams } from "@/lib/listings-search";

interface ListingsFiltersClientProps {
  initial: SearchFilters;
  className?: string;
}

export function ListingsFiltersClient({
  initial,
  className,
}: ListingsFiltersClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  function apply(filters: SearchFilters) {
    const trimmedQuery = filters.query?.trim();
    const zipFromQuery =
      trimmedQuery && /^\d{5}(-\d{4})?$/.test(trimmedQuery)
        ? trimmedQuery.slice(0, 5)
        : undefined;

    const normalized: SearchFilters = {
      ...filters,
      page: 1,
      ...(zipFromQuery
        ? { zip: zipFromQuery, query: undefined }
        : { query: trimmedQuery || undefined }),
    };

    const params = filtersToSearchParams(normalized);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <ListingFilters
      value={initial}
      onSubmit={apply}
      className={className}
    />
  );
}
