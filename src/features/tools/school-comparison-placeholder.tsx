import Link from "next/link";
import { GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SchoolComparisonPlaceholder() {
  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <GraduationCap className="h-8 w-8 text-accent" />
        <CardTitle>School comparison — coming soon</CardTitle>
        <CardDescription>
          Side-by-side district ratings, boundary maps, and commute tradeoffs are on the
          roadmap. For now, explore community guides with school highlights or schedule a
          consult for a personalized shortlist.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
          <li>Compare GreatSchools / Niche scores by address</li>
          <li>Overlay school boundaries on map search</li>
          <li>Model price premium by elementary feeder</li>
        </ul>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="accent">
            <Link href="/communities">Browse communities</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Ask about schools</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
