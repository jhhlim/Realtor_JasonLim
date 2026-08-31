export type ListingStatus =
  | "active"
  | "pending"
  | "sold"
  | "coming_soon"
  | "withdrawn";

export type PropertyType =
  | "single_family"
  | "condo"
  | "townhome"
  | "multi_family"
  | "land"
  | "other";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface ListingPhoto {
  url: string;
  caption?: string;
  order: number;
}

export interface SchoolInfo {
  name: string;
  type: "elementary" | "middle" | "high" | "private" | "charter";
  rating?: number;
  distanceMiles?: number;
  grades?: string;
}

export interface ScoreBundle {
  walk?: number;
  transit?: number;
  bike?: number;
}

export interface TaxHistoryItem {
  year: number;
  amount: number;
  assessment?: number;
}

export interface PriceHistoryItem {
  date: string;
  event: string;
  price?: number;
}

export interface ComparableSale {
  id: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  soldDate: string;
  distanceMiles: number;
}

export interface ListingSummary {
  id: string;
  mlsNumber: string;
  slug: string;
  status: ListingStatus;
  propertyType: PropertyType;
  listPrice: number;
  beds: number;
  baths: number;
  sqft: number;
  lotSizeSqft?: number;
  yearBuilt?: number;
  address: {
    street: string;
    unit?: string;
    city: string;
    state: string;
    zip: string;
    neighborhood?: string;
  };
  geo: GeoPoint;
  photo: string;
  photosCount: number;
  hoaMonthly?: number;
  garageSpaces?: number;
  pool?: boolean;
  openHouse?: string;
  newConstruction?: boolean;
  priceReduced?: boolean;
  daysOnMarket?: number;
  featured?: boolean;
  /** MLS listing agent (not necessarily the site agent). */
  listingAgentName?: string;
  /** Listing office / brokerage on the MLS. */
  listingOffice?: string;
}

export interface ListingDetails extends ListingSummary {
  description: string;
  photos: ListingPhoto[];
  features: string[];
  schools: SchoolInfo[];
  scores: ScoreBundle;
  taxHistory: TaxHistoryItem[];
  priceHistory: PriceHistoryItem[];
  comps: ComparableSale[];
  estimatedValue?: number;
  propertyHistory: string[];
  streetViewUrl?: string;
}

export interface SearchFilters {
  query?: string;
  city?: string;
  zip?: string;
  mlsNumber?: string;
  neighborhood?: string;
  schoolDistrict?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  minSqft?: number;
  maxSqft?: number;
  minLotSize?: number;
  maxHoa?: number;
  garage?: boolean;
  pool?: boolean;
  openHouse?: boolean;
  newConstruction?: boolean;
  priceReduced?: boolean;
  status?: ListingStatus[];
  propertyType?: PropertyType[];
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  polygon?: GeoPoint[];
  page?: number;
  pageSize?: number;
  sort?:
    | "price_asc"
    | "price_desc"
    | "newest"
    | "sqft_desc"
    | "dom_asc";
}

export interface SearchResult {
  items: ListingSummary[];
  total: number;
  page: number;
  pageSize: number;
  provider: string;
}

export interface NeighborhoodSummary {
  slug: string;
  name: string;
  county: string;
  tagline: string;
  description: string;
  heroImage: string;
  medianPrice: number;
  priceChangeYoY: number;
  avgDom: number;
  schoolsHighlight: string;
  lifestyle: string[];
  restaurants: string[];
  parks: string[];
  videoUrl?: string;
  marketTrend: { month: string; median: number }[];
  geo: GeoPoint;
}

export interface MarketReport {
  id: string;
  title: string;
  slug: string;
  summary: string;
  publishedAt: string;
  region: string;
  stats: { label: string; value: string; change?: string }[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category:
    | "Buying"
    | "Selling"
    | "Investment"
    | "Mortgage"
    | "Bay Area"
    | "Technology"
    | "AI";
  coverImage: string;
  publishedAt: string;
  readingMinutes: number;
  tags: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  location: string;
  videoUrl?: string;
  source?: "google" | "zillow" | "yelp" | "facebook" | "direct";
}

export interface ReviewAggregate {
  source: "google" | "zillow" | "yelp" | "facebook";
  rating: number;
  count: number;
  url?: string;
}
