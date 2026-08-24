import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CrmComingSoon({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {phase}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="text-lg">Coming in a later phase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Navigation and auth are ready. This module will be built against the Phase 1
            database schema once Contacts CRUD is live.
          </p>
          <Button asChild variant="outline">
            <Link href="/admin">← Back to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
