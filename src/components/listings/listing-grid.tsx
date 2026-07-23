import type { ListingSummary } from "@/types";
import { ListingCard } from "@/components/listings/listing-card";
import { cn } from "@/lib/utils";

interface ListingGridProps {
  listings: ListingSummary[];
  className?: string;
  emptyMessage?: string;
}

export function ListingGrid({
  listings,
  className,
  emptyMessage = "No listings match your filters yet.",
}: ListingGridProps) {
  if (!listings.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-secondary/40 px-6 py-16 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-6 sm:grid-cols-2 xl:grid-cols-3",
        className,
      )}
    >
      {listings.map((listing, index) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          priority={index < 3}
        />
      ))}
    </div>
  );
}
