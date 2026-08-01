"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BrandName } from "@/components/layout/brand-name";

/** Radix dialog scroll-lock can leave body unscrollable after close/navigate. */
function unlockBodyScroll() {
  if (typeof document === "undefined") return;
  document.body.style.removeProperty("pointer-events");
  document.body.style.removeProperty("overflow");
  document.body.style.removeProperty("padding-right");
  document.documentElement.style.removeProperty("overflow");
}

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Close menu + restore scroll when the route changes.
  React.useEffect(() => {
    setOpen(false);
    unlockBodyScroll();
  }, [pathname]);

  React.useEffect(() => {
    if (!open) {
      // After close animation, clear any leftover lock.
      const t = window.setTimeout(unlockBodyScroll, 350);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) unlockBodyScroll();
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex h-full max-h-[100dvh] w-full flex-col gap-6 overflow-y-auto overscroll-contain sm:max-w-sm"
      >
        <SheetHeader className="shrink-0">
          <SheetTitle className="font-display text-left text-2xl">
            <BrandName />
          </SheetTitle>
          <p className="text-left text-sm text-muted-foreground">
            {siteConfig.title}
          </p>
        </SheetHeader>
        <nav className="flex flex-col gap-1 pb-2">
          {siteConfig.navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleOpenChange(false)}
              className="rounded-xl px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Separator className="shrink-0" />
        <div className="shrink-0 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Language · 语言
          </p>
          <LanguageToggle className="w-full justify-between sm:inline-flex" />
        </div>
        <div className="flex shrink-0 items-center justify-between gap-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <ThemeToggle />
          <Button asChild variant="accent" className="flex-1">
            <Link
              href={siteConfig.cta.consultation.href}
              onClick={() => handleOpenChange(false)}
            >
              {siteConfig.cta.consultation.label}
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
