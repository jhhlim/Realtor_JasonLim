import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Mail, Phone, MessageSquare } from "lucide-react";

import { getContact } from "@/features/crm/actions/contacts";
import { listActivities, listNotes } from "@/features/crm/actions/notes";
import { ContactEditForm } from "@/features/crm/contact-edit-form";
import { ContactNotesPanel } from "@/features/crm/contact-notes-panel";
import { displayName, statusLabel } from "@/types/crm";
import { formatPhoneDisplay } from "@/lib/crm/phone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Contact" };

export default async function ContactDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ focus?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  let contact;
  try {
    contact = await getContact(id);
  } catch {
    redirect("/admin/login");
  }
  if (!contact) notFound();

  const [notes, activities] = await Promise.all([
    listNotes(id),
    listActivities(id),
  ]);

  const types = [
    contact.is_buyer && "Buyer",
    contact.is_seller && "Seller",
    contact.is_renter && "Renter",
    contact.is_investor && "Investor",
    contact.is_neighbor && "Neighbor",
    contact.is_referral && "Referral",
  ].filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin/contacts" className="hover:text-foreground">
          Contacts
        </Link>
        <span>/</span>
        <span className="text-foreground">{displayName(contact)}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr_300px]">
        {/* Left */}
        <div className="space-y-4">
          <Card className="border-border/70">
            <CardContent className="space-y-4 p-5">
              <div>
                <h1 className="font-display text-2xl font-semibold">
                  {displayName(contact)}
                </h1>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="accent">{statusLabel(contact.lead_status)}</Badge>
                  <Badge variant="secondary">{contact.temperature}</Badge>
                  {types.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                  {contact.email_opt_out ? (
                    <Badge variant="warning">Unsubscribed</Badge>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {contact.phone ? (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="h-4 w-4 text-accent" />
                    {formatPhoneDisplay(contact.phone)}
                  </a>
                ) : null}
                {contact.email ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="h-4 w-4 text-accent" />
                    {contact.email}
                  </a>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                {contact.phone ? (
                  <Button asChild size="sm" variant="outline">
                    <a href={`tel:${contact.phone}`}>Call</a>
                  </Button>
                ) : null}
                {contact.phone ? (
                  <Button asChild size="sm" variant="outline">
                    <a href={`sms:${contact.phone}`}>
                      <MessageSquare className="h-3.5 w-3.5" />
                      Text
                    </a>
                  </Button>
                ) : null}
                {contact.email ? (
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/email?contact=${contact.id}`}>Email</Link>
                  </Button>
                ) : null}
              </div>

              <div className="space-y-2 border-t border-border/70 pt-4 text-sm">
                <p>
                  <span className="text-muted-foreground">Source: </span>
                  {contact.lead_source || "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Detail: </span>
                  {contact.source_detail || "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Created: </span>
                  {new Date(contact.created_at).toLocaleDateString()}
                </p>
                <p>
                  <span className="text-muted-foreground">Last contacted: </span>
                  {contact.last_contacted_at
                    ? new Date(contact.last_contacted_at).toLocaleString()
                    : "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Next follow-up: </span>
                  {contact.next_follow_up_at
                    ? new Date(contact.next_follow_up_at).toLocaleDateString()
                    : "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Areas: </span>
                  {(contact.neighborhoods || []).join(", ") ||
                    (contact.desired_cities || []).join(", ") ||
                    "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Budget: </span>
                  {contact.budget_min || contact.budget_max
                    ? `$${Number(contact.budget_min || 0).toLocaleString()} – $${Number(contact.budget_max || 0).toLocaleString()}`
                    : "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Financing: </span>
                  {contact.preapproval_status || "—"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center */}
        <ContactNotesPanel
          contactId={contact.id}
          notes={notes}
          activities={activities}
          focusNote={sp.focus === "note"}
        />

        {/* Right */}
        <div className="space-y-4">
          <Card className="border-border/70">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Key background</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {contact.key_background || "Add pinned context in Details below."}
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactEditForm contact={contact} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
