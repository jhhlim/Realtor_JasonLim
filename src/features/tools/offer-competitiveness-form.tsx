"use client";

import * as React from "react";
import { ClipboardCheck } from "lucide-react";

import { siteConfig } from "@/config/site";
import { BrandName } from "@/components/layout/brand-name";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function OfferCompetitivenessForm() {
  const [address, setAddress] = React.useState("");
  const [listPrice, setListPrice] = React.useState(1_650_000);
  const [offerPrice, setOfferPrice] = React.useState(1_700_000);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [context, setContext] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          interest: "buy",
          source: "offer-competitiveness",
          message: [
            "Offer competitiveness review request",
            `Property: ${address}`,
            `List price: $${listPrice.toLocaleString()}`,
            `Planned offer: $${offerPrice.toLocaleString()}`,
            context ? `Context: ${context}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Unable to submit your request.");
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  }

  if (status === "success") {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Review queued</CardTitle>
          <CardDescription>
            <BrandName /> will assess escalation room, appraisal risk, and term
            structure — AI-assisted scoring is coming soon.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>Offer competitiveness check</CardTitle>
            <Badge variant="accent">AI preview</Badge>
          </div>
          <CardDescription>
            Share your target property and offer terms. Automated win-probability scoring
            is in development — you&apos;ll get a human strategy review today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="offer-address">Property address</Label>
              <Input
                id="offer-address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="list-price">List price ($)</Label>
                <Input
                  id="list-price"
                  type="number"
                  min={0}
                  value={listPrice}
                  onChange={(e) => setListPrice(Number(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offer-price">Your offer ($)</Label>
                <Input
                  id="offer-price"
                  type="number"
                  min={0}
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(Number(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="offer-name">Name</Label>
                <Input
                  id="offer-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offer-email">Email</Label>
                <Input
                  id="offer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="offer-context">Competing offers, appraisal, or terms</Label>
              <Textarea
                id="offer-context"
                rows={3}
                placeholder="Waiving inspection, 25% down, multiple offers expected…"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}
            <Button type="submit" variant="accent" disabled={status === "loading"}>
              {status === "loading" ? "Submitting…" : "Request offer review"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="h-fit bg-gradient-to-br from-slate-soft to-background dark:from-card">
        <CardHeader>
          <ClipboardCheck className="h-5 w-5 text-accent" />
          <CardTitle className="text-lg">Checklist preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Price vs. recent comps and list-to-sale ratios</p>
          <p>Escalation, appraisal gap, and contingency posture</p>
          <p>Close timeline vs. seller motivation signals</p>
        </CardContent>
      </Card>
    </div>
  );
}
