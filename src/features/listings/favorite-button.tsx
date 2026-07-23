"use client";

import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  listingId: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

export function FavoriteButton({
  listingId,
  className,
  size = "default",
  showLabel = true,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, ready } = useFavorites();
  const active = ready && isFavorite(listingId);

  return (
    <Button
      type="button"
      variant={active ? "accent" : "outline"}
      size={size}
      className={cn(className)}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Save to favorites"}
      onClick={() => toggleFavorite(listingId)}
    >
      <Heart
        className={cn("h-4 w-4", active && "fill-current")}
        aria-hidden
      />
      {showLabel ? (active ? "Saved" : "Favorite") : null}
    </Button>
  );
}
