"use client";

import * as React from "react";
import { Check, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

export function ShareButton({
  title,
  text,
  url,
  className,
  size = "default",
  showLabel = true,
}: ShareButtonProps) {
  const [copied, setCopied] = React.useState(false);

  async function handleShare() {
    const shareUrl =
      url ?? (typeof window !== "undefined" ? window.location.href : "");
    const payload = { title, text: text ?? title, url: shareUrl };

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(payload);
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        // no-op if clipboard unavailable
      }
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      className={cn(className)}
      onClick={handleShare}
      aria-label="Share listing"
    >
      {copied ? (
        <Check className="h-4 w-4 text-accent" aria-hidden />
      ) : (
        <Share2 className="h-4 w-4" aria-hidden />
      )}
      {showLabel ? (copied ? "Link copied" : "Share") : null}
    </Button>
  );
}
