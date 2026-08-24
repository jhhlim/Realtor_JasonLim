"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import * as React from "react";

import { createContact } from "@/features/crm/actions/contacts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function QuickCreateContactDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [createdId, setCreatedId] = React.useState<string | null>(null);

  function reset() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setError(null);
    setCreatedId(null);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await createContact({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      crm_contact: true,
    });
    setLoading(false);
    if (!res.success) {
      setError(res.error);
      return;
    }
    setCreatedId(res.contact.id);
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent className="sm:max-w-md">
        {createdId ? (
          <>
            <DialogHeader>
              <DialogTitle>Contact created</DialogTitle>
              <DialogDescription>
                {firstName} {lastName} is in your CRM.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="accent" size="sm">
                <Link href={`/admin/contacts/${createdId}`}>View Contact</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/contacts/${createdId}?focus=note`}>
                  Add Notes
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/contacts/${createdId}?focus=followup`}>
                  Create Follow-Up
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/email?contact=${createdId}`}>Send Email</Link>
              </Button>
            </div>
          </>
        ) : (
          <form onSubmit={onSave} className="space-y-4">
            <DialogHeader>
              <DialogTitle>New contact</DialogTitle>
              <DialogDescription>
                Name is enough — add phone/email if you have them. Under 30 seconds.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="qc-first">First name *</Label>
                <Input
                  id="qc-first"
                  required
                  autoFocus
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qc-last">Last name</Label>
                <Input
                  id="qc-last"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="qc-phone">Phone</Label>
                <Input
                  id="qc-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="qc-email">Email</Label>
                <Input
                  id="qc-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="accent" disabled={loading}>
                {loading ? "Saving…" : "Save contact"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function GlobalQuickAdd() {
  const [contactOpen, setContactOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="accent"
            size="icon"
            className="fixed bottom-5 right-5 z-40 h-12 w-12 rounded-full shadow-lift lg:bottom-8 lg:right-8"
            aria-label="Quick add"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onSelect={() => setContactOpen(true)}>
            New Contact
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/contacts/new">Full contact form</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/tasks">New Task</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/open-houses">Add Open House</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/properties">Add Property</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/email">Log / Send Email</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <QuickCreateContactDialog open={contactOpen} onOpenChange={setContactOpen} />
    </>
  );
}
