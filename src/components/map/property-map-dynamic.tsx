"use client";

import dynamic from "next/dynamic";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  price?: number;
  slug?: string;
  label?: string;
}

export interface PropertyMapDynamicProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  height?: number | string;
}

const PropertyMap = dynamic(
  () =>
    import("@/components/map/property-map").then((m) => m.PropertyMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] animate-pulse rounded-2xl border border-border bg-secondary" />
    ),
  },
);

export function PropertyMapDynamic(props: PropertyMapDynamicProps) {
  return <PropertyMap {...props} />;
}
