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

      <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-24">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                {siteConfig.brand} · Silicon Valley REALTOR®
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
              Serving {siteConfig.contact.address.city},{" "}
              {siteConfig.contact.address.state} {siteConfig.contact.address.zip} &amp;{" "}
              {siteConfig.contact.address.region}
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

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-accent/20 via-transparent to-navy/15 blur-sm" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-border/80 bg-secondary shadow-lift">
            <Image
              src={siteConfig.media.heroPortrait}
              alt={`${siteConfig.name} — Bay Area REALTOR®`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 420px"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B1F33]/75 to-transparent p-6 text-white">
              <p className="font-display text-xl font-semibold">
                <BrandName />
              </p>
              <p className="text-sm text-white/80">
                {siteConfig.brand} · {siteConfig.license.status}
              </p>
              <p className="mt-1 text-xs font-medium tracking-wide text-white/70">
                {siteConfig.license.dre}
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
