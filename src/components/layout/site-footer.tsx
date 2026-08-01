import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.94 8.5H3.75V20h3.19V8.5ZM5.35 3.5a1.86 1.86 0 1 0 0 3.72 1.86 1.86 0 0 0 0-3.72ZM20.25 20h-3.18v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94V20H9.9V8.5h3.05v1.57h.04c.42-.8 1.46-1.65 3-1.65 3.21 0 3.8 2.11 3.8 4.86V20Z" />
    </svg>
  );
}

function CompassMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M14.8 9.2 11 13l-1.8 4.8L14.8 9.2Zm-5.6 5.6L13 11l1.8-4.8L9.2 14.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

const socialIcons = [
  { href: siteConfig.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: siteConfig.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: siteConfig.brokerage.url, label: "Compass", Icon: CompassMark },
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
                {siteConfig.name}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {siteConfig.title}
              </p>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
              {siteConfig.tagline} {siteConfig.differentiator}
            </p>
            <p className="text-sm text-muted-foreground">
              {siteConfig.brokerage.tagline}{" "}
              <a
                href={siteConfig.brokerage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent hover:underline"
              >
                Visit Compass →
              </a>
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
            <div className="flex items-center gap-2 pt-1">
              {socialIcons.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
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
            {siteConfig.brokerage.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
