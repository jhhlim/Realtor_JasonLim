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

/**
 * Delivers leads client-side (browser → FormSubmit/Web3Forms/Resend API).
 * Server-side Resend needs a verified domain; FormSubmit works without one.
 */
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
  const [infoMessage, setInfoMessage] = React.useState<string | null>(null);
  const [mailtoHref, setMailtoHref] = React.useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);
    setInfoMessage(null);
    setMailtoHref(null);

    const subject = `Website inquiry from ${name}`;
    const composedMessage = [
      `Interest: ${interest}`,
      `Source: ${source}`,
      phone ? `Phone: ${phone}` : null,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const result = await deliverLead({
        name,
        email,
        phone,
        subject,
        message: composedMessage,
        interest,
        source,
      });

      if (!result.ok) {
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
        setErrorMessage(result.error);
        return;
      }

      setStatus("success");
      setInfoMessage(result.info ?? null);
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
        <div
          role="status"
          className="space-y-2 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
        >
          <p>
            Thanks — your message was sent to {siteConfig.contact.email}. I&apos;ll
            follow up shortly.
          </p>
          {infoMessage ? (
            <p className="text-success/90">{infoMessage}</p>
          ) : null}
        </div>
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

type DeliverResult =
  | { ok: true; info?: string }
  | { ok: false; error: string };

async function deliverLead(input: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  interest: string;
  source: string;
}): Promise<DeliverResult> {
  const to = siteConfig.contact.email;
  const web3Key = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();

  // 1) Preferred: Web3Forms (client-side, no custom domain needed)
  if (web3Key) {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: web3Key,
        subject: input.subject,
        from_name: input.name,
        name: input.name,
        email: input.email,
        phone: input.phone,
        interest: input.interest,
        source: input.source,
        message: input.message,
      }),
    });
    const data = (await res.json().catch(() => null)) as {
      success?: boolean;
      message?: string;
    } | null;
    if (res.ok && data?.success) {
      return { ok: true };
    }
  }

  // 2) FormSubmit (client-side). First use may require clicking Activate in inbox.
  const formSubmitRes = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(to)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        phone: input.phone,
        interest: input.interest,
        source: input.source,
        message: input.message,
        _subject: input.subject,
        _template: "table",
        _captcha: "false",
        _replyto: input.email,
      }),
    },
  );

  const formSubmitData = (await formSubmitRes.json().catch(() => null)) as {
    success?: string | boolean;
    message?: string;
  } | null;

  const formSubmitOk =
    formSubmitRes.ok &&
    (formSubmitData?.success === true ||
      formSubmitData?.success === "true" ||
      String(formSubmitData?.message ?? "")
        .toLowerCase()
        .includes("success") ||
      String(formSubmitData?.message ?? "")
        .toLowerCase()
        .includes("sent") ||
      String(formSubmitData?.message ?? "")
        .toLowerCase()
        .includes("activate"));

  if (formSubmitOk) {
    const msg = String(formSubmitData?.message ?? "").toLowerCase();
    return {
      ok: true,
      info: msg.includes("activate")
        ? "If this is your first submission, check jason.lim@compass.com for a FormSubmit activation email and click Activate once."
        : undefined,
    };
  }

  // 3) Last resort: our API (Resend) — works after a verified sending domain.
  const apiRes = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      phone: input.phone,
      interest: input.interest,
      message: input.message,
      source: input.source,
      notifyEmail: to,
    }),
  });
  const apiData = (await apiRes.json().catch(() => null)) as {
    success?: boolean;
    emailed?: boolean;
    error?: string;
    message?: string;
  } | null;

  if (apiRes.ok && apiData?.success && apiData.emailed !== false) {
    return { ok: true, info: apiData.message };
  }

  return {
    ok: false,
    error:
      apiData?.error ||
      formSubmitData?.message ||
      `Unable to deliver email right now. Please email ${to} directly.`,
  };
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
