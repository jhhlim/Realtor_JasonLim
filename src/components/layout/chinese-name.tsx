"use client";

import * as React from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type SiteLanguage = "en" | "zh-CN" | "zh-TW";

const STORAGE_KEY = "site-lang";

function readLang(): SiteLanguage {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "zh-CN" || stored === "zh-TW" || stored === "en") {
      return stored;
    }
  } catch {
    /* ignore */
  }
  const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
  const value = match?.[1] ? decodeURIComponent(match[1]) : "";
  if (value.includes("zh-TW")) return "zh-TW";
  if (value.includes("zh-CN") || value.includes("zh")) return "zh-CN";
  return "en";
}

/**
 * Renders the Chinese name only when 简体 / 繁體 is active.
 */
export function ChineseName({
  className,
  prefix = " ",
}: {
  className?: string;
  /** Text before the name (default space). Pass "" when using block layout. */
  prefix?: string;
}) {
  const [lang, setLang] = React.useState<SiteLanguage>("en");

  React.useEffect(() => {
    setLang(readLang());
  }, []);

  if (lang === "en") return null;

  return (
    <span className={cn("notranslate", className)}>
      {prefix}
      {siteConfig.nameZh}
    </span>
  );
}
