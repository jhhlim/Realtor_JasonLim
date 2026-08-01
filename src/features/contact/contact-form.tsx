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

type Interest = "buy" | "sell" | "invest" | "other";

interface ContactFormProps {
  className?: string;
  defaultInterest?: Interest;
  source?: string;
}

export function ContactForm({
  className,
  defaultInterest = "buy",
  source = "contact-page",
}: ContactFormProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [interest, setInterest] = React.useState<Interest>(defaultInterest);
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [mailtoHref, setMailtoHref] = React.useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);
    setMailtoHref(null);

    const payload = {
      name,
      email,
      phone,
      interest,
      message,
      source,
      notifyEmail: siteConfig.contact.email,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
        mailto?: string;
        emailed?: boolean;
      };

      if (!response.ok || !data.success || data.emailed === false) {
        const fallback =
          data.mailto ||
          buildMailto({
            to: siteConfig.contact.email,
            name,
            email,
            phone,
            interest,
            message,
            source,
          });
        setMailtoHref(fallback);
        setStatus("error");
        setErrorMessage(
          data.error ??
            `Unable to send automatically. Please email ${siteConfig.contact.email} directly.`,
        );
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setInterest(defaultInterest);
      setMessage("");
    } catch {
      const fallback = buildMailto({
        to: siteConfig.contact.email,
        name,
        email,
        phone,
        interest,
        message,
        source,
      });
      setMailtoHref(fallback);
      setStatus("error");
      setErrorMessage(
        `Unable to send automatically. Please email ${siteConfig.contact.email} directly.`,
      );
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("space-y-5", className)}
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Full name</Label>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Rivera"
            disabled={status === "loading"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            disabled={status === "loading"}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-phone">Phone</Label>
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(510) 480-7191"
            disabled={status === "loading"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-interest">I am interested in</Label>
          <Select
            value={interest}
            onValueChange={(value) => setInterest(value as Interest)}
            disabled={status === "loading"}
          >
            <SelectTrigger id="contact-interest" aria-label="Interest">
              <SelectValue placeholder="Select interest" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buy">Buying a home</SelectItem>
              <SelectItem value="sell">Selling a home</SelectItem>
              <SelectItem value="invest">Investing</SelectItem>
              <SelectItem value="other">Something else</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your timeline, neighborhoods, and goals…"
          disabled={status === "loading"}
        />
      </div>

      {status === "success" ? (
        <p
          role="status"
          className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
        >
          Thanks — your message was emailed to {siteConfig.contact.email}. I&apos;ll
          follow up shortly.
        </p>
      ) : null}

      {status === "error" && errorMessage ? (
        <div
          role="alert"
          className="space-y-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <p>{errorMessage}</p>
          {mailtoHref ? (
            <Button asChild variant="outline" size="sm">
              <a href={mailtoHref}>Email {siteConfig.contact.email}</a>
            </Button>
          ) : null}
        </div>
      ) : null}

      <Button
        type="submit"
        size="lg"
        variant="accent"
        disabled={status === "loading"}
        className="w-full sm:w-auto"
      >
        {status === "loading" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

function buildMailto(input: {
  to: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  source: string;
}) {
  const subject = encodeURIComponent(`Website inquiry from ${input.name}`);
  const body = encodeURIComponent(
    [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      input.phone ? `Phone: ${input.phone}` : null,
      `Interest: ${input.interest}`,
      `Source: ${input.source}`,
      "",
      input.message,
    ]
      .filter(Boolean)
      .join("\n"),
  );
  return `mailto:${input.to}?subject=${subject}&body=${body}`;
}
