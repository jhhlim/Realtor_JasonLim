import type { GeoPoint, SchoolInfo } from "@/types";

export type MapProviderId = "google" | "mapbox" | "leaflet";

export type MapBasemap = "streets" | "satellite" | "hybrid" | "terrain";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  price?: number;
  label?: string;
  slug?: string;
}

export interface MapCluster {
  id: string;
  lat: number;
  lng: number;
  count: number;
  markers: MapMarker[];
}

export interface PolygonSearchArea {
  id?: string;
  paths: GeoPoint[];
}

export interface SchoolOverlay {
  school: SchoolInfo;
  geo: GeoPoint;
  boundary?: GeoPoint[];
}

export interface CommuteRequest {
  origin: GeoPoint;
  destination: GeoPoint;
  mode: "driving" | "transit" | "walking" | "bicycling";
  departAt?: string;
}

export interface CommuteResult {
  durationMinutes: number;
  distanceMiles: number;
  mode: CommuteRequest["mode"];
  summary?: string;
  steps?: string[];
}

export interface TransitStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  agency?: string;
  routes?: string[];
}

export interface MapViewport {
  center: GeoPoint;
  zoom: number;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

/**
 * MapProvider supports Google Maps, Mapbox, and Leaflet backends
 * with a shared contract for clustering, polygon draw-search,
 * school overlays, commute estimates, transit stops, and satellite basemaps.
 */
export interface MapProvider {
  readonly name: MapProviderId;

  /** Initialize / ensure the map SDK is ready for the given container. */
  init(containerId: string, viewport: MapViewport): Promise<void>;

  setBasemap(basemap: MapBasemap): Promise<void>;

  setMarkers(markers: MapMarker[]): Promise<void>;

  /** Cluster markers for dense listing maps. */
  setClusters(enabled: boolean, markers?: MapMarker[]): Promise<MapCluster[]>;

  /** Enable polygon draw tools and return the drawn search area. */
  enablePolygonSearch(): Promise<PolygonSearchArea>;

  clearPolygonSearch(): Promise<void>;

  /** Render school pins / optional attendance boundaries. */
  setSchoolOverlays(schools: SchoolOverlay[]): Promise<void>;

  /** Estimate commute between two points. */
  getCommute(request: CommuteRequest): Promise<CommuteResult>;

  /** Nearby transit stops for a coordinate. */
  getTransitStops(center: GeoPoint, radiusMiles?: number): Promise<TransitStop[]>;

  /** Switch to satellite imagery (or hybrid). */
  showSatellite(hybrid?: boolean): Promise<void>;

  fitBounds(points: GeoPoint[]): Promise<void>;

  destroy(): Promise<void>;
}

export function getMapProviderId(): MapProviderId {
  const raw = process.env.NEXT_PUBLIC_MAP_PROVIDER ?? "leaflet";
  if (raw === "google" || raw === "mapbox" || raw === "leaflet") return raw;
  return "leaflet";
}
