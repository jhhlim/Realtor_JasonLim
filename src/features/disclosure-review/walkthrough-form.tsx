"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface WalkthroughFormProps {
  className?: string;
  source?: string;
  id?: string;
}

/**
 * Walkthrough request without file upload — uses FormSubmit like other site leads.
 * Buyers can request a disclosure walkthrough even before secure uploads go live.
 */
export function DisclosureWalkthroughForm({
  className,
  source = "disclosure-review-walkthrough",
  id = "review-with-jason",
}: WalkthroughFormProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [contactMethod, setContactMethod] = React.useState("email");
  const [address, setAddress] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success">(
    "idle",
  );
  const [nextUrl, setNextUrl] = React.useState(
    `${siteConfig.url}/disclosure-review?walkthrough=1#review-with-jason`,
  );

  React.useEffect(() => {
    setNextUrl(
      `${window.location.origin}/disclosure-review?walkthrough=1#review-with-jason`,
    );
    if (new URLSearchParams(window.location.search).get("walkthrough") === "1") {
      setStatus("success");
    }
  }, []);

  const phoneRequired = contactMethod === "phone";
  const formAction = `https://formsubmit.co/${encodeURIComponent(siteConfig.contact.email)}`;
  const subject = name.trim()
    ? `Disclosure walkthrough request from ${name.trim()}`
    : "Disclosure walkthrough request";

  if (status === "success") {
    return (
      <div
        id={id}
        className={cn(
          "scroll-mt-28 space-y-4 rounded-3xl border border-accent/25 bg-accent/5 p-6 sm:p-8",
          className,
        )}
        role="status"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Request received
        </p>
        <h3 className="font-display text-2xl font-semibold tracking-tight">
          Thanks — I’ll follow up soon
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
          Your walkthrough request was received. I’ll reach out using the contact
          method you chose. Complimentary, personal follow-up — no obligation.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Button asChild variant="accent">
            <a href="#sample-report">See sample report</a>
          </Button>
          <Button asChild variant="outline">
            <a href={siteConfig.cta.consultation.href}>Contact page</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      id={id}
      action={formAction}
      method="POST"
      className={cn(
        "scroll-mt-28 space-y-5 rounded-3xl border border-border/80 bg-card p-6 shadow-soft sm:p-8",
        className,
      )}
      onSubmit={() => setStatus("loading")}
      aria-busy={status === "loading"}
    >
      <input type="hidden" name="_subject" value={subject} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_next" value={nextUrl} />
      <input type="hidden" name="_replyto" value={email} />
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="full_name" value={name} />
      <input type="hidden" name="email_address" value={email} />
      <input type="hidden" name="phone_number" value={phone || "Not provided"} />
      <input type="hidden" name="preferred_contact" value={contactMethod} />
      <input type="hidden" name="property_address" value={address || "Not provided"} />
      <input type="hidden" name="notes" value={message || "None"} />
      <input type="hidden" name="marketing_opt_in" value="no" />
      <input
        type="text"
        name="_honey"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Review with Jason
        </p>
        <h3 className="font-display text-2xl font-semibold tracking-tight">
          Request a disclosure walkthrough
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
          Already have a question about an inspection or seller disclosure? Tell me
          what you’re looking at and I’ll help you find the relevant pages and figure
          out what to ask — even if you haven’t uploaded files yet.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="walkthrough-name">Full name</Label>
          <Input
            id="walkthrough-name"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="walkthrough-email">Email</Label>
          <Input
            id="walkthrough-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="walkthrough-phone">
            Phone{phoneRequired ? "" : " (optional)"}
          </Label>
          <Input
            id="walkthrough-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required={phoneRequired}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="walkthrough-contact-method">Preferred contact</Label>
          <Select value={contactMethod} onValueChange={setContactMethod}>
            <SelectTrigger id="walkthrough-contact-method" aria-label="Preferred contact">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone call</SelectItem>
              <SelectItem value="text">Text</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="walkthrough-address">Property address (optional)</Label>
          <Input
            id="walkthrough-address"
            name="address"
            autoComplete="street-address"
            placeholder="e.g. Berryessa, North San Jose, or Milpitas"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="walkthrough-message">
            What would you like to go through?
          </Label>
          <Textarea
            id="walkthrough-message"
            name="message"
            rows={4}
            placeholder="Inspection findings, seller disclosures, pest report, HOA docs, or a specific question…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Submitting this request does not subscribe you to marketing. See the{" "}
        <a href="/privacy" className="font-medium text-accent hover:underline">
          Privacy Policy
        </a>
        . Complimentary review walkthrough — no obligation.
      </p>

      <Button type="submit" size="lg" variant="accent" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Review With Jason"}
      </Button>
    </form>
  );
}
