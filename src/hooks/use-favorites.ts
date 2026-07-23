"use client";

import * as React from "react";

const STORAGE_KEY = "jasonlim-favorites";

function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function writeFavorites(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function useFavorites() {
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setFavorites(readFavorites());
    setReady(true);
  }, []);

  const isFavorite = React.useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const toggleFavorite = React.useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      writeFavorites(next);
      return next;
    });
  }, []);

  const addFavorite = React.useCallback((id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      writeFavorites(next);
      return next;
    });
  }, []);

  const removeFavorite = React.useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((item) => item !== id);
      writeFavorites(next);
      return next;
    });
  }, []);

  return {
    favorites,
    ready,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
  };
}
