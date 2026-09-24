"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { BrandName } from "@/components/layout/brand-name";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-soft via-background to-[#e8f2f3] dark:from-card dark:via-background dark:to-[#0c1f28]" />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-navy/10 blur-3xl dark:bg-accent/10" />

      <Container className="relative grid items-center gap-10 py-16 lg:grid-cols-[1fr_auto] lg:gap-14 lg:py-24">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Compass · Silicon Valley REALTOR®
              </p>
              <span className="rounded-full border border-border/80 bg-background/80 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {siteConfig.license.dre}
              </span>
            </div>
            <h1 className="font-display text-5xl font-semibold tracking-tight text-foreground text-balance sm:text-6xl lg:text-7xl">
              <BrandName />
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty sm:text-xl">
              {siteConfig.tagline}
            </p>
            <p className="max-w-lg text-sm font-medium text-foreground/80">
              {siteConfig.differentiator}
            </p>
            <p className="text-sm text-muted-foreground">
              Official{" "}
              <a
                href={siteConfig.brokerage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent underline-offset-2 hover:underline"
              >
                {siteConfig.brokerage.name}
              </a>{" "}
              agent · {siteConfig.contact.address.city},{" "}
              {siteConfig.contact.address.state} {siteConfig.contact.address.zip}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-3"
          >
            <Button asChild size="lg" variant="accent">
              <Link href={siteConfig.cta.search.href}>
                {siteConfig.cta.search.label}
              </Link>
            </Button>
            <Button asChild size="lg">
              <Link href={siteConfig.cta.consultation.href}>
                {siteConfig.cta.consultation.label}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={siteConfig.cta.marketReport.href}>
                {siteConfig.cta.marketReport.label}
              </Link>
            </Button>
          </motion.div>
        </div>

        {siteConfig.showAgentPhotos ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto flex w-full max-w-[11rem] flex-col items-center gap-3 sm:max-w-[12.5rem] lg:mx-0"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-full border border-border/80 bg-secondary shadow-lift ring-4 ring-background">
              <Image
                src={siteConfig.media.headshot}
                alt={`${siteConfig.name} — Bay Area REALTOR®`}
                fill
                priority
                className="object-cover object-[center_18%]"
                sizes="200px"
              />
            </div>
            <div className="text-center">
              <p className="font-display text-base font-semibold tracking-tight text-foreground">
                <BrandName />
              </p>
              <p className="text-xs text-muted-foreground">
                {siteConfig.brokerage.name} · {siteConfig.license.dre}
              </p>
            </div>
          </motion.div>
        ) : null}
      </Container>
    </section>
  );
}
