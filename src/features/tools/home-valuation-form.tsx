"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";
import { AiAnalyzeSection } from "@/features/tools/use-ai-analysis";

type Status = "idle" | "loading" | "success" | "error";

export function HomeValuationForm() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);
  const [mailtoHref, setMailtoHref] = React.useState<string | null>(null);

  const [address, setAddress] = React.useState("");
  const [beds, setBeds] = React.useState(3);
  const [baths, setBaths] = React.useState(2);
  const [sqft, setSqft] = React.useState(1500);
  const [notes, setNotes] = React.useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    setInfo(null);
    setMailtoHref(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const first = String(data.get("first") ?? "").trim();
    const last = String(data.get("last") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const addr = String(data.get("address") ?? "").trim();
    const noteText = String(data.get("notes") ?? "").trim();
    const name = `${first} ${last}`.trim();
    const to = siteConfig.contact.email;
    const subject = `Home valuation request — ${addr}`;
    const message = [
      `Property: ${addr}`,
      `Beds/Baths/Sqft: ${beds}/${baths}/${sqft}`,
      phone ? `Phone: ${phone}` : null,
      noteText ? `Notes: ${noteText}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const formSubmitRes = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(to)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            address: addr,
            notes: noteText,
            message,
            _subject: subject,
            _template: "table",
            _captcha: "false",
            _replyto: email,
          }),
        },
      );

      const formSubmitData = (await formSubmitRes.json().catch(() => null)) as {
        success?: string | boolean;
        message?: string;
      } | null;

      const ok =
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

      if (ok) {
        const msg = String(formSubmitData?.message ?? "").toLowerCase();
        setInfo(
          msg.includes("activate")
            ? `Check ${siteConfig.contact.email} for a FormSubmit activation email and click Activate once.`
            : null,
        );
        setStatus("success");
        form.reset();
        return;
      }

      const web3Key = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();
      if (web3Key) {
        const w3 = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: web3Key,
            subject,
            from_name: name,
            name,
            email,
            phone,
            address: addr,
            message,
          }),
        });
        const w3data = (await w3.json().catch(() => null)) as {
          success?: boolean;
        } | null;
        if (w3.ok && w3data?.success) {
          setStatus("success");
          form.reset();
          return;
        }
      }

      const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        [`Name: ${name}`, `Email: ${email}`, phone ? `Phone: ${phone}` : null, `Property: ${addr}`, noteText ? `Notes: ${noteText}` : null]
          .filter(Boolean)
          .join("\n"),
      )}`;
      setMailtoHref(mailto);
      setError(`Unable to deliver email right now. Please email ${to} directly.`);
      setStatus("error");
    } catch {
      setError(`Unable to deliver email right now. Please email ${to} directly.`);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Request sent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Thanks — your valuation request was sent to{" "}
            <a
              className="font-medium text-accent hover:underline"
              href={`mailto:${siteConfig.contact.email}`}
            >
              {siteConfig.contact.email}
            </a>
            .
          </p>
          {info ? <p>{info}</p> : null}
          <Button asChild variant="accent">
            <a href={siteConfig.cta.consultation.href}>Schedule a call</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Request a valuation</CardTitle>
            <p className="text-sm text-muted-foreground">
              Run AI analysis instantly, or submit for a personal CMA follow-up at{" "}
              {siteConfig.contact.email}.
            </p>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="first">First name</Label>
                <Input
                  id="first"
                  name="first"
                  required
                  autoComplete="given-name"
                  disabled={status === "loading"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last">Last name</Label>
                <Input
                  id="last"
                  name="last"
                  required
                  autoComplete="family-name"
                  disabled={status === "loading"}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  disabled={status === "loading"}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  disabled={status === "loading"}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Property address</Label>
                <Input
                  id="address"
                  name="address"
                  required
                  autoComplete="street-address"
                  disabled={status === "loading"}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beds">Beds</Label>
                <Input
                  id="beds"
                  type="number"
                  min={0}
                  value={beds}
                  onChange={(e) => setBeds(Number(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="baths">Baths</Label>
                <Input
                  id="baths"
                  type="number"
                  min={0}
                  step={0.5}
                  value={baths}
                  onChange={(e) => setBaths(Number(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="sqft">Sq ft</Label>
                <Input
                  id="sqft"
                  type="number"
                  min={0}
                  value={sqft}
                  onChange={(e) => setSqft(Number(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Remodels, timing, goals…"
                  disabled={status === "loading"}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              {error ? (
                <div className="space-y-2 sm:col-span-2 text-sm text-destructive">
                  <p>{error}</p>
                  {mailtoHref ? (
                    <Button asChild variant="outline" size="sm">
                      <a href={mailtoHref}>Email {siteConfig.contact.email}</a>
                    </Button>
                  ) : null}
                </div>
              ) : null}
              <div className="sm:col-span-2">
                <Button
                  type="submit"
                  variant="outline"
                  size="lg"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Sending…" : "Submit for personal CMA follow-up"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-dashed bg-slate-soft/40 dark:bg-secondary/20">
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              What happens next
            </p>
            <CardTitle className="text-xl">Data-backed CMA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              AI gives an instant preview. Submit the form for comps, pricing strategy,
              and next steps from Jason.
            </p>
          </CardContent>
        </Card>
      </div>

      <AiAnalyzeSection
        tool="home-valuation"
        inputs={{ address, beds, baths, sqft, market: "Silicon Valley" }}
        context={notes}
        disabled={!address.trim()}
        label="Get Jason's AI valuation analysis"
      />
    </div>
  );
}
