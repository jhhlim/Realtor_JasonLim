import type { ListingDetails, ListingSummary } from "@/types";
import { siteConfig } from "@/config/site";

export type JsonLd = Record<string, unknown>;

export function buildRealEstateAgentSchema(): JsonLd {
  const { contact, social, media, license, name, legalName, description, url } =
    siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: legalName,
    alternateName: name,
    description,
    url,
    image: media.headshot.startsWith("http")
      ? media.headshot
      : `${url}${media.headshot}`,
    telephone: contact.phone,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.line1,
      addressLocality: contact.address.city,
      addressRegion: contact.address.state,
      postalCode: contact.address.zip,
      addressCountry: "US",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: contact.address.region,
    },
    sameAs: [
      social.instagram,
      social.linkedin,
      social.x,
      social.googleBusiness,
      siteConfig.brokerage.url,
    ].filter(Boolean),
    worksFor: {
      "@type": "Organization",
      name: siteConfig.brokerage.name,
      url: siteConfig.brokerage.url,
    },
    identifier: license.dre,
    knowsAbout: [
      "Bay Area real estate",
      "Silicon Valley homes",
      "First-time home buyers",
      "Market analytics",
      "AI-assisted real estate",
    ],
  };
}

export function buildBreadcrumbSchema(
  items: { name: string; url: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${siteConfig.url}${item.url}`,
    })),
  };
}

function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  return `${siteConfig.url}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function buildRealEstateListingSchema(
  listing: ListingSummary | ListingDetails,
): JsonLd {
  const address = listing.address;
  const photos =
    "photos" in listing && listing.photos?.length
      ? listing.photos.map((p) => absoluteUrl(p.url))
      : [absoluteUrl(listing.photo)];

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: `${address.street}, ${address.city}, ${address.state} ${address.zip}`,
    url: absoluteUrl(`/listings/${listing.slug}`),
    datePosted: "priceHistory" in listing && listing.priceHistory?.[0]?.date
      ? listing.priceHistory[0].date
      : undefined,
    image: photos,
    description:
      "description" in listing ? listing.description : undefined,
    offers: {
      "@type": "Offer",
      price: listing.listPrice,
      priceCurrency: "USD",
      availability:
        listing.status === "sold"
          ? "https://schema.org/SoldOut"
          : listing.status === "pending"
            ? "https://schema.org/LimitedAvailability"
            : "https://schema.org/InStock",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: address.unit
        ? `${address.street} ${address.unit}`
        : address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.zip,
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
    yearBuilt: listing.yearBuilt,
  };
}
