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
 * Native FormSubmit POST (not AJAX).
 * Browser posts to formsubmit.co → email to jason.lim@compass.com → redirect back.
 * First ever submission: activate via the email FormSubmit sends to Compass.
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
  const [status, setStatus] = React.useState<"idle" | "loading" | "success">(
    "idle",
  );
  const [nextUrl, setNextUrl] = React.useState(
    `${siteConfig.url}/contact?sent=1`,
  );

  React.useEffect(() => {
    setNextUrl(`${window.location.origin}/contact?sent=1`);
    if (new URLSearchParams(window.location.search).get("sent") === "1") {
      setStatus("success");
    }
  }, []);

  const formAction = `https://formsubmit.co/${encodeURIComponent(siteConfig.contact.email)}`;
  const subject = name.trim()
    ? `Website inquiry from ${name.trim()}`
    : "Website inquiry";

  return (
    <form
      action={formAction}
      method="POST"
      className={cn("space-y-5", className)}
      onSubmit={() => setStatus("loading")}
    >
      <input type="hidden" name="_subject" value={subject} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_next" value={nextUrl} />
      <input type="hidden" name="_replyto" value={email} />
      <input type="hidden" name="interest" value={interest} />
      <input type="hidden" name="source" value={source} />
      <input
        type="text"
        name="_honey"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

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
            Thanks — your message was submitted to FormSubmit for{" "}
            {siteConfig.contact.email}.
          </p>
          <p className="text-success/90">
            Check that inbox (and spam). If this is the first submission ever,
            open FormSubmit&apos;s <strong>Activate</strong> email once, then
            send another test.
          </p>
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
