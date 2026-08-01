"use client";

import * as React from "react";
import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SiteLanguage = "en" | "zh-CN";

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

function readCookieLang(): SiteLanguage {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
  const value = match?.[1] ? decodeURIComponent(match[1]) : "";
  return value.includes("zh") ? "zh-CN" : "en";
}

function writeTranslateCookie(lang: SiteLanguage) {
  const value = lang === "zh-CN" ? "/en/zh-CN" : "/en/en";
  const expires = "expires=Fri, 31 Dec 9999 23:59:59 GMT";
  // Host + root path cookies so Google Translate picks it up reliably.
  document.cookie = `googtrans=${value};path=/;${expires}`;
  document.cookie = `googtrans=${value};path=/;domain=${window.location.hostname};${expires}`;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
}

function ensureTranslateScript() {
  if (document.getElementById("google-translate-script")) return;

  window.googleTranslateElementInit = () => {
    if (!window.google?.translate?.TranslateElement) return;
    // Avoid double-init if React remounts.
    const host = document.getElementById("google_translate_element");
    if (host && host.childElementCount > 0) return;
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: "en,zh-CN",
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

/**
 * EN / 中文 toggle using Google Website Translator for full-page translation.
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
    const initial = stored === "zh-CN" || stored === "en" ? stored : readCookieLang();
    setLang(initial);
    ensureTranslateScript();
    setReady(true);

    // If user previously chose Chinese, ensure cookie matches before GT runs.
    if (initial === "zh-CN" && readCookieLang() !== "zh-CN") {
      writeTranslateCookie("zh-CN");
      window.location.reload();
    }
  }, []);

  function switchTo(next: SiteLanguage) {
    if (next === lang) return;
    writeTranslateCookie(next);
    setLang(next);
    // Reload so Google Translate applies across the full document.
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
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={!ready}
        aria-pressed={lang === "en"}
        onClick={() => switchTo("en")}
        className={cn(
          "h-8 rounded-lg px-2.5 text-xs font-semibold",
          lang === "en"
            ? "bg-secondary text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        EN
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={!ready}
        aria-pressed={lang === "zh-CN"}
        onClick={() => switchTo("zh-CN")}
        className={cn(
          "h-8 rounded-lg px-2.5 text-xs font-semibold",
          lang === "zh-CN"
            ? "bg-secondary text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Languages className="mr-1 h-3.5 w-3.5" aria-hidden />
        中文
      </Button>
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
