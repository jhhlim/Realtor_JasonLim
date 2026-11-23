"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = (typeof siteConfig.navigation.main)[number];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function itemIsActive(pathname: string, item: NavItem) {
  if (isActive(pathname, item.href)) return true;
  return Boolean(
    "children" in item &&
      item.children?.some((child) => isActive(pathname, child.href)),
  );
}

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("hidden items-center gap-0.5 xl:flex", className)}
      aria-label="Primary"
    >
      {siteConfig.navigation.main.map((item) => {
        const active = itemIsActive(pathname, item);
        const children =
          "children" in item && item.children?.length ? item.children : null;

        if (!children) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors hover:bg-secondary/70 hover:text-foreground",
                active ? "bg-secondary/60 text-foreground" : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        }

        return (
          <DropdownMenu key={item.href}>
            <div className="flex items-center">
              <Link
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-l-lg py-2 pl-2.5 pr-1 text-sm font-medium transition-colors hover:bg-secondary/70 hover:text-foreground",
                  active ? "bg-secondary/60 text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={`${item.label} menu`}
                  className={cn(
                    "inline-flex h-9 items-center rounded-r-lg px-1.5 text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active && "bg-secondary/60 text-foreground",
                  )}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent align="start" className="min-w-[12.5rem]">
              {children.map((child) => (
                <DropdownMenuItem key={child.href} asChild>
                  <Link href={child.href}>{child.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </nav>
  );
}
