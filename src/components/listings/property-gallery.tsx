"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

import type { ListingPhoto } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  photos: ListingPhoto[];
  alt: string;
  className?: string;
}

export function PropertyGallery({ photos, alt, className }: PropertyGalleryProps) {
  const sorted = React.useMemo(
    () => [...photos].sort((a, b) => a.order - b.order),
    [photos],
  );
  const [index, setIndex] = React.useState(0);
  const [fullscreen, setFullscreen] = React.useState(false);

  const current = sorted[index] ?? sorted[0];

  function go(delta: number) {
    if (!sorted.length) return;
    setIndex((prev) => (prev + delta + sorted.length) % sorted.length);
  }

  React.useEffect(() => {
    if (!fullscreen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setFullscreen(false);
      if (event.key === "ArrowRight") {
        setIndex((prev) => (prev + 1) % sorted.length);
      }
      if (event.key === "ArrowLeft") {
        setIndex((prev) => (prev - 1 + sorted.length) % sorted.length);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen, sorted.length]);

  if (!sorted.length) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
        No photos available
      </div>
    );
  }

  return (
    <>
      <div className={cn("space-y-3", className)}>
        <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-secondary">
          <Image
            src={current.url}
            alt={current.caption || alt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 70vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
            <p className="text-sm text-white/90">
              {index + 1} / {sorted.length}
              {current.caption ? ` · ${current.caption}` : ""}
            </p>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="bg-white/90 text-foreground hover:bg-white"
              onClick={() => setFullscreen(true)}
            >
              <Expand className="h-4 w-4" />
              Fullscreen
            </Button>
          </div>
          {sorted.length > 1 ? (
            <>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/85 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => go(-1)}
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/85 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => go(1)}
                aria-label="Next photo"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          ) : null}
        </div>

        {sorted.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {sorted.map((photo, i) => (
              <button
                key={`${photo.url}-${i}`}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                  i === index
                    ? "border-accent"
                    : "border-transparent opacity-75 hover:opacity-100",
                )}
              >
                <Image
                  src={photo.url}
                  alt={photo.caption || `${alt} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {fullscreen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <p className="text-sm">
              {index + 1} / {sorted.length}
            </p>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
              onClick={() => setFullscreen(false)}
              aria-label="Close gallery"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-8">
            <div className="relative h-full w-full max-w-6xl">
              <Image
                src={current.url}
                alt={current.caption || alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            {sorted.length > 1 ? (
              <>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute left-6 top-1/2 -translate-y-1/2"
                  onClick={() => go(-1)}
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute right-6 top-1/2 -translate-y-1/2"
                  onClick={() => go(1)}
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
