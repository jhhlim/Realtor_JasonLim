"use client";

import * as React from "react";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

/**
 * Official Calendly inline widget.
 * Raw calendly.com pages often refuse iframe embedding (X-Frame-Options);
 * this loads Calendly's embed script instead.
 *
 * Set NEXT_PUBLIC_CALENDLY_URL to your real event URL, e.g.
 * https://calendly.com/your-handle/30min
 */
export function CalendlyEmbed({
  url = siteConfig.calendly,
  height = 720,
}: {
  url?: string;
  height?: number;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const src = "https://assets.calendly.com/assets/external/widget.js";
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    );

    const init = () => {
      const calendly = (
        window as unknown as {
          Calendly?: { initInlineWidget: (opts: Record<string, unknown>) => void };
        }
      ).Calendly;
      if (!calendly || !containerRef.current) return;
      containerRef.current.innerHTML = "";
      calendly.initInlineWidget({
        url,
        parentElement: containerRef.current,
        resize: true,
      });
    };

    if (existing) {
      init();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = init;
    document.body.appendChild(script);
  }, [url]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Prefer email?{" "}
          <a
            className="font-medium text-accent hover:underline"
            href={`mailto:${siteConfig.contact.email}?subject=Consultation%20with%20Jason%20Lim`}
          >
            {siteConfig.contact.email}
          </a>
        </p>
        <Button asChild variant="outline" size="sm">
          <a href={url} target="_blank" rel="noopener noreferrer">
            Open Calendly
          </a>
        </Button>
      </div>
      <div
        ref={containerRef}
        className="calendly-inline-widget min-h-[640px] w-full overflow-hidden rounded-2xl border border-border/60 bg-background"
        style={{ minWidth: "320px", height }}
        data-url={url}
      />
    </div>
  );
}
