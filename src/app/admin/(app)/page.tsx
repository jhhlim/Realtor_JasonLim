import Link from "next/link";
import {
  AlertCircle,
  CalendarClock,
  CheckSquare,
  Mail,
  UserPlus,
} from "lucide-react";

import { leadSources, leadStatuses } from "@/config/crm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Dashboard",
};

const followUpCards = [
  {
    label: "Follow-ups due today",
    value: "—",
    hint: "Connect Supabase to load live counts",
    icon: CalendarClock,
  },
  {
    label: "Overdue contacts",
    value: "—",
    hint: "Based on next_follow_up_at",
    icon: AlertCircle,
  },
  {
    label: "Tasks due",
    value: "—",
    hint: "From /admin/tasks",
    icon: CheckSquare,
  },
  {
    label: "Leads needing attention",
    value: "—",
    hint: "New + attempted contact",
    icon: UserPlus,
  },
];

const sampleActivity = [
  {
    title: "CRM ready",
    detail: "Phase 1 shell is live. Add contacts in Phase 2.",
    time: "Just now",
  },
  {
    title: "Auth protected",
    detail: "/admin requires Supabase sign-in.",
    time: "Setup",
  },
  {
    title: "Email pipeline",
    detail: "Resend + webhooks land in Phase 5–7.",
    time: "Roadmap",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Dashboard
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Follow-up & pipeline pulse
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your private CRM for open-house leads through closed deals.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="accent">
            <Link href="/admin/contacts">+ Create contact</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/email">
              <Mail className="h-4 w-4" />
              Compose email
            </Link>
          </Button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {followUpCards.map((card) => (
          <Card key={card.label} className="border-border/70">
            <CardContent className="space-y-3 p-5">
              <card.icon className="h-5 w-5 text-accent" />
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {card.label}
              </p>
              <p className="font-display text-3xl font-semibold">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.hint}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold">Lead summary</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {leadStatuses.map((status) => (
            <Card key={status.id} className="border-border/70">
              <CardContent className="flex items-center justify-between gap-2 p-4">
                <span className="text-sm text-muted-foreground">{status.label}</span>
                <Badge variant="secondary">0</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-lg">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sampleActivity.map((item) => (
              <div
                key={item.title}
                className="flex gap-3 border-b border-border/60 pb-4 last:border-0 last:pb-0"
              >
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">{item.title}</p>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-lg">Lead sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {leadSources.map((source) => (
              <div key={source} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{source}</span>
                <span className="font-semibold tabular-nums">0</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed border-accent/30 bg-accent/5">
        <CardContent className="space-y-2 p-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Phase 1 complete — next up</p>
          <p>
            Phase 2: working Contacts CRUD with search/filters. Run the SQL migration in
            Supabase, create your Auth user, and set env vars before adding live data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
