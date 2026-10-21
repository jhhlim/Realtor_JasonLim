"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const INTEREST_OPTIONS = [
  { value: "Buying a home", label: "Buying a home" },
  { value: "Selling a home", label: "Selling a home" },
  { value: "Exploring the market", label: "Exploring the market" },
] as const;

interface GoalsInquiryFormProps {
  className?: string;
  source?: string;
}

/**
 * Native FormSubmit POST for homepage goals CTA.
 * Browser → formsubmit.co → jason.lim@compass.com → redirect with ?goals=1
 *
 * Important: do not disable named inputs on submit — disabled fields are
 * omitted from the POST body (which previously dropped name/email/phone).
 */
export function GoalsInquiryForm({
  className,
  source = "homepage-goals",
}: GoalsInquiryFormProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [interests, setInterests] = React.useState<string[]>([]);
  const [city, setCity] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success">(
    "idle",
  );
  const [nextUrl, setNextUrl] = React.useState(`${siteConfig.url}/?goals=1#goals`);

  React.useEffect(() => {
    setNextUrl(`${window.location.origin}/?goals=1#goals`);
    if (new URLSearchParams(window.location.search).get("goals") === "1") {
      setStatus("success");
    }
  }, []);

  function toggleInterest(value: string) {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  const formAction = `https://formsubmit.co/${encodeURIComponent(siteConfig.contact.email)}`;
  const subject = name.trim()
    ? `Real estate goals inquiry from ${name.trim()}`
    : "Real estate goals inquiry";
  const interestValue = interests.join(", ") || "Not specified";

  return (
    <form
      id="goals-form"
      action={formAction}
      method="POST"
      className={cn("space-y-5", className)}
      onSubmit={() => setStatus("loading")}
      aria-busy={status === "loading"}
    >
      <input type="hidden" name="_subject" value={subject} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_next" value={nextUrl} />
      <input type="hidden" name="_replyto" value={email} />
      <input type="hidden" name="source" value={source} />
      {/* Mirrors for FormSubmit table — stay enabled so they always POST */}
      <input type="hidden" name="full_name" value={name} />
      <input type="hidden" name="email_address" value={email} />
      <input type="hidden" name="phone_number" value={phone || "Not provided"} />
      <input type="hidden" name="interest" value={interestValue} />
      <input type="hidden" name="preferred_area" value={city || "Not provided"} />
      <input type="hidden" name="notes" value={message || "None"} />
      <input
        type="text"
        name="_honey"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">I&apos;m interested in</legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {INTEREST_OPTIONS.map((option) => {
            const checked = interests.includes(option.value);
            return (
              <label
                key={option.value}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                  checked
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-accent/40",
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggleInterest(option.value)}
                />
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border text-[10px]",
                    checked
                      ? "border-accent bg-accent text-white"
                      : "border-border",
                  )}
                  aria-hidden
                >
                  {checked ? "✓" : ""}
                </span>
                {option.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="goals-city">Preferred city or neighborhood</Label>
        <Input
          id="goals-city"
          name="city_neighborhood"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Los Gatos, Willow Glen, Cupertino"
          readOnly={status === "loading"}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="goals-name">Full name</Label>
          <Input
            id="goals-name"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Rivera"
            readOnly={status === "loading"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="goals-email">Email</Label>
          <Input
            id="goals-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            readOnly={status === "loading"}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="goals-phone">Phone (optional)</Label>
        <Input
          id="goals-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={siteConfig.contact.phone}
          readOnly={status === "loading"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="goals-message">Anything else? (optional)</Label>
        <Textarea
          id="goals-message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Timeline, budget range, or questions…"
          readOnly={status === "loading"}
        />
      </div>

      {status === "success" ? (
        <div
          role="status"
          className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
        >
          Thanks — your note was sent. I&apos;ll follow up shortly.
        </div>
      ) : null}

      <Button
        type="submit"
        size="lg"
        variant="accent"
        disabled={status === "loading"}
        className="w-full sm:w-auto"
      >
        {status === "loading" ? "Sending…" : "Get personalized insights"}
      </Button>
    </form>
  );
}
