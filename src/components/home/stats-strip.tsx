import { siteConfig } from "@/config/site";
import { Container } from "@/components/shared/container";
import { FadeIn } from "@/components/shared/fade-in";
import { cn } from "@/lib/utils";

export function StatsStrip({ className }: { className?: string }) {
  return (
    <section className={cn("border-b border-border/70 bg-card/50 py-10", className)}>
      <Container>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {siteConfig.stats.map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 0.05}>
              <div className="text-center md:text-left">
                <p className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
