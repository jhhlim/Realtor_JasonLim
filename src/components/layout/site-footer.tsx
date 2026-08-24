import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";
import { BrandName } from "@/components/layout/brand-name";

const socialLinks = [
  { href: siteConfig.social.linkedin, label: "LinkedIn" },
  { href: siteConfig.social.x, label: "X" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-slate-soft/80 dark:bg-card/40">
      <div className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
          <div className="max-w-sm space-y-5">
            <div>
              <p className="font-display text-2xl font-semibold tracking-tight">
                <BrandName />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {siteConfig.brand} · {siteConfig.title}
              </p>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
              {siteConfig.tagline} {siteConfig.differentiator}
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a
                href={siteConfig.contact.phoneHref}
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Phone className="h-4 w-4 text-accent" />
                {siteConfig.contact.phone}
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4 text-accent" />
                {siteConfig.contact.email}
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                {siteConfig.contact.address.city}, {siteConfig.contact.address.state}{" "}
                {siteConfig.contact.address.zip}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {socialLinks.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {siteConfig.navigation.footer.map((column) => (
            <div key={column.title} className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {column.title}
              </p>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-foreground/80 transition-colors hover:text-accent"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-foreground/80 transition-colors hover:text-accent"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <p>
            {siteConfig.license.status} · {siteConfig.license.dre} ·{" "}
            {siteConfig.brokerage.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
