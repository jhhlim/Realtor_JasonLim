"use client";

import * as React from "react";
import Link from "next/link";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { cn, formatCurrency } from "@/lib/utils";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  price?: number;
  slug?: string;
  label?: string;
}

export interface PropertyMapProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  height?: number | string;
}

const markerIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:9999px;background:#1F6F78;border:2px solid white;box-shadow:0 4px 12px rgba(11,31,51,.35)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

/**
 * Leaflet map — import with `next/dynamic` and `{ ssr: false }`:
 * `const PropertyMap = dynamic(() => import("@/components/map/property-map").then(m => m.PropertyMap), { ssr: false })`
 */
export function PropertyMap({
  markers,
  center,
  zoom = 11,
  className,
  height = 420,
}: PropertyMapProps) {
  const mapCenter = React.useMemo<[number, number]>(() => {
    if (center) return center;
    if (markers.length) return [markers[0].lat, markers[0].lng];
    return [37.3382, -121.8863];
  }, [center, markers]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border shadow-soft",
        className,
      )}
      style={{ height }}
    >
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={markerIcon}
          >
            <Popup>
              <div className="space-y-1 text-sm">
                {marker.label ? (
                  <p className="font-medium">{marker.label}</p>
                ) : null}
                {typeof marker.price === "number" ? (
                  <p>{formatCurrency(marker.price)}</p>
                ) : null}
                {marker.slug ? (
                  <Link
                    href={`/listings/${marker.slug}`}
                    className="text-[#1F6F78] underline-offset-2 hover:underline"
                  >
                    View listing
                  </Link>
                ) : null}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default PropertyMap;
