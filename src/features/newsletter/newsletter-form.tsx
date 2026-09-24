"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import { sendViaFormSubmit } from "@/lib/formsubmit";
import { cn } from "@/lib/utils";

interface NewsletterFormProps {
  className?: string;
  tags?: string[];
  cityInterest?: string[];
}

export function NewsletterForm({
  className,
  tags = ["market-updates"],
  cityInterest,
}: NewsletterFormProps) {
  const [email, setEmail] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [infoMessage, setInfoMessage] = React.useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);
    setInfoMessage(null);

    const to = siteConfig.contact.email;
    const name = firstName.trim() || "Newsletter subscriber";
    const tagList = tags.join(", ");
    const cities = cityInterest?.join(", ") ?? "";

    try {
      const result = await sendViaFormSubmit({
        to,
        name,
        email: email.trim(),
        subject: `Newsletter signup from ${name}`,
        message: [
          "New market-updates newsletter signup from jasonlimrealty.com",
          `Name: ${name}`,
          `Email: ${email.trim()}`,
          `Tags: ${tagList}`,
          cities ? `Cities: ${cities}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
        fields: {
          form: "newsletter",
          tags: tagList,
          ...(cities ? { cityInterest: cities } : {}),
        },
      });

      if (!result.ok) {
        throw new Error(result.error);
      }

      setStatus("success");
      setInfoMessage(
        result.needsActivation
          ? `First-time setup: check ${to} (and spam) for a FormSubmit “Activate” email and click it once — then try again.`
          : `Signup emailed to ${to}. Check inbox + spam if you don’t see it within a minute.`,
      );
      setEmail("");
      setFirstName("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("space-y-4", className)}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="newsletter-first-name">First name</Label>
          <Input
            id="newsletter-first-name"
            name="firstName"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Optional"
            disabled={status === "loading"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="newsletter-email">Email</Label>
          <Input
            id="newsletter-email"
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
        <Button
          type="submit"
          size="lg"
          variant="accent"
          disabled={status === "loading"}
          className="w-full sm:w-auto"
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>

      {status === "success" ? (
        <div
          role="status"
          className="space-y-1 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
        >
          <p>You&apos;re on the list — thanks for subscribing.</p>
          {infoMessage ? <p className="text-success/90">{infoMessage}</p> : null}
        </div>
      ) : null}

      {status === "error" && errorMessage ? (
        <p
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {errorMessage}
        </p>
      ) : null}

      <p className="text-xs text-muted-foreground">
        No spam. Unsubscribe anytime. Occasional Bay Area market notes only.
      </p>
    </form>
  );
}
