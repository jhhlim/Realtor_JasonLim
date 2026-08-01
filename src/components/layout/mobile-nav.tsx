"use client";

import * as React from "react";
import Link from "next/link";
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

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col gap-6 sm:max-w-sm">
        <SheetHeader>
          <SheetTitle className="font-display text-left text-2xl">
            {siteConfig.name}
            <span className="notranslate ml-2 text-[0.85em] font-medium text-muted-foreground">
              {siteConfig.nameZh}
            </span>
          </SheetTitle>
          <p className="text-left text-sm text-muted-foreground">
            {siteConfig.title}
          </p>
        </SheetHeader>
        <nav className="flex flex-1 flex-col gap-1">
          {siteConfig.navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Separator />
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Language · 语言
          </p>
          <LanguageToggle className="w-full justify-between sm:inline-flex" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <ThemeToggle />
          <Button asChild variant="accent" className="flex-1" onClick={() => setOpen(false)}>
            <Link href={siteConfig.cta.consultation.href}>
              {siteConfig.cta.consultation.label}
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
