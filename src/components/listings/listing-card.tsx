import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, Maximize2 } from "lucide-react";

import type { ListingSummary } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatListingAttribution } from "@/lib/listing-agent";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";

const statusLabels: Record<ListingSummary["status"], string> = {
  active: "Active",
  pending: "Pending",
  sold: "Sold",
  coming_soon: "Coming Soon",
  withdrawn: "Withdrawn",
};

interface ListingCardProps {
  listing: ListingSummary;
  className?: string;
  priority?: boolean;
}

export function ListingCard({ listing, className, priority }: ListingCardProps) {
  const addressLine = [
    listing.address.street,
    listing.address.unit ? `#${listing.address.unit}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card
      className={cn(
        "group overflow-hidden border-border/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <Link href={`/listings/${listing.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          <Image
            src={listing.photo}
            alt={`${addressLine}, ${listing.address.city}`}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F33]/45 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <Badge
              variant={listing.status === "sold" ? "secondary" : "accent"}
              className="backdrop-blur-sm"
            >
              {statusLabels[listing.status]}
            </Badge>
            {listing.featured ? <Badge>Featured</Badge> : null}
            {listing.priceReduced ? <Badge variant="warning">Price Reduced</Badge> : null}
            {listing.openHouse ? <Badge variant="success">Open House</Badge> : null}
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
            <p className="font-display text-2xl font-semibold text-white drop-shadow">
              {formatCurrency(listing.listPrice)}
            </p>
            {listing.photosCount > 1 ? (
              <span className="rounded-full bg-black/45 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
                {listing.photosCount} photos
              </span>
            ) : null}
          </div>
        </div>
        <CardContent className="space-y-3 p-5">
          <div>
            <h3 className="font-medium text-foreground">{addressLine}</h3>
            <p className="text-sm text-muted-foreground">
              {listing.address.city}, {listing.address.state} {listing.address.zip}
              {listing.address.neighborhood
                ? ` · ${listing.address.neighborhood}`
                : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-accent" />
              {listing.beds} bd
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-accent" />
              {listing.baths} ba
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Maximize2 className="h-4 w-4 text-accent" />
              {formatNumber(listing.sqft)} sqft
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {formatListingAttribution(listing)}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
