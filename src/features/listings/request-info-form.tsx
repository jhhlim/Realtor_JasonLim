"use client";

import * as React from "react";
import { MessageSquareText } from "lucide-react";

import { siteConfig } from "@/config/site";
import { BrandName } from "@/components/layout/brand-name";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface RequestInfoFormProps {
  listingAddress: string;
  listingSlug?: string;
  mlsNumber?: string;
  className?: string;
  triggerLabel?: string;
  triggerVariant?: "default" | "secondary" | "outline" | "ghost" | "link" | "accent";
}

export function RequestInfoForm({
  listingAddress,
  listingSlug,
  mlsNumber,
  className,
  triggerLabel = "Request info",
  triggerVariant = "outline",
}: RequestInfoFormProps) {
  const [open, setOpen] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = new FormData(event.currentTarget);
    // Placeholder until CRM is wired — keep payload local for now.
    void {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      message: String(form.get("message") ?? ""),
      listingAddress,
      listingSlug,
      mlsNumber,
    };
    await new Promise((resolve) => setTimeout(resolve, 450));
    setPending(false);
    setSubmitted(true);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      window.setTimeout(() => setSubmitted(false), 200);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant={triggerVariant} className={cn(className)}>
          <MessageSquareText className="h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        {submitted ? (
          <div className="space-y-3 py-2">
            <DialogHeader>
              <DialogTitle>Request received</DialogTitle>
              <DialogDescription>
                Thanks — <BrandName /> will follow up shortly about{" "}
                {listingAddress}.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="accent" onClick={() => setOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Request more information</DialogTitle>
              <DialogDescription>
                Ask a question about {listingAddress}
                {mlsNumber ? ` (MLS ${mlsNumber})` : ""}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="info-name">Name</Label>
              <Input id="info-name" name="name" required autoComplete="name" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="info-email">Email</Label>
                <Input
                  id="info-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="info-phone">Phone</Label>
                <Input
                  id="info-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="info-message">Message</Label>
              <Textarea
                id="info-message"
                name="message"
                rows={4}
                placeholder="I'd like details on showing times, comps, or offer strategy…"
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="accent" disabled={pending}>
                {pending ? "Sending…" : "Send request"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
