import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/layout/language-toggle";
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
      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-[4.25rem]">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex flex-col leading-none">
            <span className="font-display text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-2xl">
              <BrandName />
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:block">
              Silicon Valley Real Estate
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {siteConfig.navigation.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
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
