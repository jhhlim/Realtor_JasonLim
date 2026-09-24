"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface NewsletterFormProps {
  className?: string;
  tags?: string[];
  cityInterest?: string[];
}

/**
 * Native FormSubmit POST for newsletter signups → jason.lim@compass.com.
 */
export function NewsletterForm({
  className,
  tags = ["market-updates"],
  cityInterest,
}: NewsletterFormProps) {
  const [email, setEmail] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success">(
    "idle",
  );
  const [nextUrl, setNextUrl] = React.useState(
    `${siteConfig.url}/contact?subscribed=1#newsletter`,
  );

  React.useEffect(() => {
    setNextUrl(`${window.location.origin}/contact?subscribed=1#newsletter`);
    if (
      new URLSearchParams(window.location.search).get("subscribed") === "1"
    ) {
      setStatus("success");
    }
  }, []);

  const formAction = `https://formsubmit.co/${encodeURIComponent(siteConfig.contact.email)}`;
  const name = firstName.trim() || "Newsletter subscriber";
  const tagList = tags.join(", ");
  const cities = cityInterest?.join(", ") ?? "";

  return (
    <form
      action={formAction}
      method="POST"
      className={cn("space-y-4", className)}
      onSubmit={() => setStatus("loading")}
    >
      <input
        type="hidden"
        name="_subject"
        value={`Newsletter signup from ${name}`}
      />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_next" value={nextUrl} />
      <input type="hidden" name="_replyto" value={email} />
      <input type="hidden" name="form" value="newsletter" />
      <input type="hidden" name="tags" value={tagList} />
      {cities ? (
        <input type="hidden" name="cityInterest" value={cities} />
      ) : null}
      <input
        type="hidden"
        name="message"
        value={[
          "New market-updates newsletter signup from jasonlimrealty.com",
          `Name: ${name}`,
          `Email: ${email}`,
          `Tags: ${tagList}`,
          cities ? `Cities: ${cities}` : null,
        ]
          .filter(Boolean)
          .join("\n")}
      />
      <input
        type="text"
        name="_honey"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="newsletter-first-name">First name</Label>
          <Input
            id="newsletter-first-name"
            name="name"
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
          className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
        >
          <p>You&apos;re on the list — thanks for subscribing.</p>
        </div>
      ) : null}

      <p className="text-xs text-muted-foreground">
        No spam. Unsubscribe anytime. Occasional Bay Area market notes only.
      </p>
    </form>
  );
}
