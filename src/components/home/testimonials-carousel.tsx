"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

import type { Testimonial } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/shared/section";
import { cn } from "@/lib/utils";

const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priya & Amit",
    role: "First-time buyers",
    location: "Sunnyvale",
    rating: 5,
    quote:
      "Jason translated a chaotic market into a clear plan. We understood every offer tradeoff before we signed.",
    source: "google",
  },
  {
    id: "2",
    name: "Elena M.",
    role: "Move-up seller",
    location: "San Jose",
    rating: 5,
    quote:
      "The valuation work was sharp and the negotiation felt engineered — calm, precise, and effective.",
    source: "direct",
  },
  {
    id: "3",
    name: "Daniel K.",
    role: "Investor",
    location: "Fremont",
    rating: 5,
    quote:
      "Rare mix of tech fluency and local market judgment. The dashboards alone saved us weeks of guesswork.",
    source: "google",
  },
];

interface TestimonialsCarouselProps {
  testimonials?: Testimonial[];
  className?: string;
}

export function TestimonialsCarousel({
  testimonials = fallbackTestimonials,
  className,
}: TestimonialsCarouselProps) {
  const items = testimonials.length ? testimonials : fallbackTestimonials;
  const [index, setIndex] = React.useState(0);
  const current = items[index] ?? items[0];

  function prev() {
    setIndex((i) => (i - 1 + items.length) % items.length);
  }

  function next() {
    setIndex((i) => (i + 1) % items.length);
  }

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [items.length]);

  return (
    <Section
      className={cn("bg-gradient-to-b from-background to-slate-soft/70 dark:to-card/40", className)}
      eyebrow="Client stories"
      title="Trusted guidance, measured in outcomes"
      description="Buyers and sellers across the Bay Area share what working with Jason felt like."
      align="center"
    >
      <div className="relative mx-auto max-w-3xl">
        <Card className="overflow-hidden border-border/70 shadow-lift">
          <CardContent className="relative px-6 py-10 sm:px-10 sm:py-12">
            <Quote className="mb-6 h-8 w-8 text-accent/70" />
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                <div className="flex gap-1">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-accent text-accent"
                    />
                  ))}
                </div>
                <p className="font-display text-2xl font-medium leading-snug tracking-tight text-balance sm:text-3xl">
                  “{current.quote}”
                </p>
                <div>
                  <p className="font-medium">{current.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {current.role} · {current.location}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-2">
                {items.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Go to testimonial ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all",
                      i === index ? "w-6 bg-accent" : "bg-border hover:bg-muted-foreground/40",
                    )}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button type="button" size="icon" variant="outline" onClick={prev} aria-label="Previous">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button type="button" size="icon" variant="outline" onClick={next} aria-label="Next">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
