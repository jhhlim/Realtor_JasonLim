import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BrandName } from "@/components/layout/brand-name";
import { cn } from "@/lib/utils";

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/60 glass",
        className,
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-3 lg:h-[4.25rem]">
        <div className="flex min-w-0 flex-1 items-center gap-5 xl:gap-7">
          <Link
            href="/"
            className="group flex shrink-0 flex-col justify-center leading-none"
          >
            <span className="font-display text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-xl">
              <BrandName />
            </span>
            <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/80 xl:block">
              Compass · Silicon Valley
            </span>
          </Link>

          <MainNav />
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguageToggle className="hidden sm:inline-flex" />
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <Button asChild variant="accent" size="sm" className="hidden md:inline-flex">
            <Link href={siteConfig.cta.consultation.href}>Schedule</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
