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
    const params = filtersToSearchParams({ ...filters, page: 1 });
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
