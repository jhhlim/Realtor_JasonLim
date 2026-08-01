"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SiteLanguage = "en" | "zh-CN" | "zh-TW";

const STORAGE_KEY = "site-lang";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: Record<string, unknown>,
          elementId: string,
        ) => void;
      };
    };
  }
}

function cookieDomains(): string[] {
  if (typeof window === "undefined") return [""];
  const hostname = window.location.hostname;
  const domains = ["", hostname, `.${hostname}`];
  const parts = hostname.split(".");
  // e.g. realtor-jason-lim.vercel.app → .vercel.app
  if (parts.length >= 2) {
    domains.push(`.${parts.slice(-2).join(".")}`);
  }
  if (parts.length >= 3) {
    domains.push(`.${parts.slice(-3).join(".")}`);
  }
  return [...new Set(domains)];
}

/** Fully expire googtrans on every domain variant Google may have set. */
function clearTranslateCookies() {
  const expires = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  for (const domain of cookieDomains()) {
    const domainPart = domain ? `;domain=${domain}` : "";
    document.cookie = `googtrans=;path=/;${expires}${domainPart}`;
    document.cookie = `googtrans=;path=/;${expires}`;
  }
}

function readCookieLang(): SiteLanguage {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
  const value = match?.[1] ? decodeURIComponent(match[1]) : "";
  if (value.includes("zh-TW") || value.includes("/zh-TW")) return "zh-TW";
  if (value.includes("zh-CN") || value.includes("/zh-CN") || value.includes("zh"))
    return "zh-CN";
  return "en";
}

function writeTranslateCookie(lang: SiteLanguage) {
  // Always clear first — leftover googtrans cookies are why EN "reverts" to Chinese.
  clearTranslateCookies();

  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }

  if (lang === "en") {
    // Original language: no googtrans cookie.
    return;
  }

  const value = lang === "zh-TW" ? "/en/zh-TW" : "/en/zh-CN";
  const expires = "expires=Fri, 31 Dec 9999 23:59:59 GMT";
  document.cookie = `googtrans=${value};path=/;${expires}`;
  document.cookie = `googtrans=${value};path=/;domain=${window.location.hostname};${expires}`;
}

function ensureTranslateScript() {
  if (document.getElementById("google-translate-script")) return;

  window.googleTranslateElementInit = () => {
    if (!window.google?.translate?.TranslateElement) return;
    const host = document.getElementById("google_translate_element");
    if (host && host.childElementCount > 0) return;
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: "en,zh-CN,zh-TW",
        autoDisplay: false,
        layout: 0,
      },
      "google_translate_element",
    );
  };

  const script = document.createElement("script");
  script.id = "google-translate-script";
  script.src =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
}

const LANG_OPTIONS: { value: SiteLanguage; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "zh-CN", label: "简体" },
  { value: "zh-TW", label: "繁體" },
];

/**
 * EN / 简体 / 繁體 toggle using Google Website Translator.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const [lang, setLang] = React.useState<SiteLanguage>("en");
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const stored = (() => {
      try {
        return localStorage.getItem(STORAGE_KEY) as SiteLanguage | null;
      } catch {
        return null;
      }
    })();

    const valid: SiteLanguage[] = ["en", "zh-CN", "zh-TW"];
    const initial = stored && valid.includes(stored) ? stored : readCookieLang();
    setLang(initial);
    ensureTranslateScript();
    setReady(true);

    // Sync cookie to stored preference (Chinese only). Never force-reload into Chinese
    // when the user just chose English — that was causing the revert bug.
    if (initial !== "en") {
      const cookie = readCookieLang();
      if (cookie !== initial) {
        writeTranslateCookie(initial);
        window.location.reload();
      }
    } else if (readCookieLang() !== "en") {
      // Stored EN but leftover Chinese cookie — clear it.
      clearTranslateCookies();
      window.location.reload();
    }
  }, []);

  function switchTo(next: SiteLanguage) {
    if (next === lang) return;
    writeTranslateCookie(next);
    setLang(next);
    window.location.reload();
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border border-border/80 bg-background/80 p-0.5",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {LANG_OPTIONS.map((opt) => (
        <Button
          key={opt.value}
          type="button"
          variant="ghost"
          size="sm"
          disabled={!ready}
          aria-pressed={lang === opt.value}
          onClick={() => switchTo(opt.value)}
          className={cn(
            "h-8 rounded-lg px-2 text-xs font-semibold",
            lang === opt.value
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}

/** Hidden host required by the Google Translate Element script. */
export function GoogleTranslateHost() {
  React.useEffect(() => {
    ensureTranslateScript();
  }, []);

  return (
    <div
      id="google_translate_element"
      className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
      aria-hidden
    />
  );
}
