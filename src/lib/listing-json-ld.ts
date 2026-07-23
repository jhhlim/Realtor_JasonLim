import type { ListingDetails } from "@/types";
import { siteConfig } from "@/config/site";

export function listingJsonLd(listing: ListingDetails) {
  const addressLine = [
    listing.address.street,
    listing.address.unit ? `#${listing.address.unit}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: `${addressLine}, ${listing.address.city}`,
    description: listing.description,
    url: `${siteConfig.url}/listings/${listing.slug}`,
    datePosted: listing.priceHistory.find((h) => h.event === "Listed")?.date,
    image: listing.photos.map((p) => p.url),
    offers: {
      "@type": "Offer",
      price: listing.listPrice,
      priceCurrency: "USD",
      availability:
        listing.status === "sold"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: addressLine,
      addressLocality: listing.address.city,
      addressRegion: listing.address.state,
      postalCode: listing.address.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: listing.geo.lat,
      longitude: listing.geo.lng,
    },
    numberOfRooms: listing.beds,
    numberOfBathroomsTotal: listing.baths,
    floorSize: {
      "@type": "QuantitativeValue",
      value: listing.sqft,
      unitCode: "FTK",
    },
  };
}
