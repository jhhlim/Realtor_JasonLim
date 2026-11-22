"use client";

import * as React from "react";
import Link from "next/link";
import { FileUp, Lock, X } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const MAX_FILES = 10;
const MAX_FILE_MB = 20;
const ACCEPTED = "application/pdf,.pdf";

interface DisclosureUploadFormProps {
  uploadsEnabled?: boolean;
  className?: string;
}

/**
 * Full intake UI. File submission stays disabled until private storage +
 * PDF analysis services are configured (DISCLOSURE_UPLOADS_ENABLED=true).
 */
export function DisclosureUploadForm({
  uploadsEnabled = false,
  className,
}: DisclosureUploadFormProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const [address, setAddress] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [contactMethod, setContactMethod] = React.useState("email");
  const [offerDeadline, setOfferDeadline] = React.useState("");
  const [workingWithAgent, setWorkingWithAgent] = React.useState("no");
  const [attention, setAttention] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const [clientError, setClientError] = React.useState<string | null>(null);

  const phoneRequired = contactMethod === "phone";

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    setClientError(null);
    const next: File[] = [...files];
    for (const file of Array.from(list)) {
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        setClientError("Only PDF files are accepted.");
        continue;
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        setClientError(`Each PDF must be under ${MAX_FILE_MB} MB.`);
        continue;
      }
      if (next.length >= MAX_FILES) {
        setClientError(`You can upload up to ${MAX_FILES} PDFs.`);
        break;
      }
      if (!next.some((f) => f.name === file.name && f.size === file.size)) {
        next.push(file);
      }
    }
    setFiles(next);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!uploadsEnabled) {
      setClientError(
        "Secure document upload is not live yet. Please use Review With Jason below, and we can exchange documents privately after we connect.",
      );
      return;
    }
    setClientError(
      "Upload endpoint is not configured. Contact Jason directly for a private review.",
    );
  }

  return (
    <form
      id="upload"
      onSubmit={onSubmit}
      className={cn(
        "scroll-mt-28 space-y-6 rounded-3xl border border-border/80 bg-card p-6 shadow-soft sm:p-8",
        className,
      )}
      noValidate={!uploadsEnabled}
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Upload disclosures
        </p>
        <h3 className="font-display text-2xl font-semibold tracking-tight">
          Send a disclosure package
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
          Property address and one or more PDFs. Complimentary AI-assisted organization
          for Jason’s review — personal follow-up, no obligation. Submitting a review
          request does not subscribe you to marketing.
        </p>
      </div>

      {!uploadsEnabled ? (
        <div
          className="flex gap-3 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-foreground"
          role="status"
        >
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
          <p className="leading-relaxed">
            Live PDF upload is paused until private storage and document analysis are
            configured. You can still{" "}
            <a href="#review-with-jason" className="font-medium text-accent hover:underline">
              request a walkthrough
            </a>{" "}
            now — use the form preview below to see what the intake will collect.
          </p>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="disclosure-address">Property address</Label>
        <Input
          id="disclosure-address"
          name="address"
          required
          disabled={!uploadsEnabled}
          placeholder="Street address, city"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <Label id="disclosure-files-label">Disclosure PDFs</Label>
        <div
          role="button"
          tabIndex={uploadsEnabled ? 0 : -1}
          aria-disabled={!uploadsEnabled}
          aria-labelledby="disclosure-files-label"
          className={cn(
            "rounded-2xl border border-dashed px-4 py-8 text-center transition-colors",
            uploadsEnabled
              ? "cursor-pointer border-border hover:border-accent/50 hover:bg-accent/5"
              : "cursor-not-allowed border-border/60 bg-secondary/40 opacity-80",
            dragActive && uploadsEnabled && "border-accent bg-accent/5",
          )}
          onClick={() => uploadsEnabled && inputRef.current?.click()}
          onKeyDown={(e) => {
            if (!uploadsEnabled) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            if (uploadsEnabled) setDragActive(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (uploadsEnabled) setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (uploadsEnabled) addFiles(e.dataTransfer.files);
          }}
        >
          <FileUp className="mx-auto mb-3 h-8 w-8 text-accent" aria-hidden />
          <p className="text-sm font-medium">
            {uploadsEnabled
              ? "Drag and drop PDFs here, or choose files"
              : "Drag-and-drop upload (coming soon)"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PDF only · up to {MAX_FILES} files · {MAX_FILE_MB} MB each
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            multiple
            className="sr-only"
            disabled={!uploadsEnabled}
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
        {files.length ? (
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/70 px-3 py-2 text-sm"
              >
                <span className="truncate">
                  {file.name}{" "}
                  <span className="text-muted-foreground">
                    ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                  </span>
                </span>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="disclosure-name">Full name</Label>
          <Input
            id="disclosure-name"
            required
            disabled={!uploadsEnabled}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="disclosure-email">Email</Label>
          <Input
            id="disclosure-email"
            type="email"
            required
            disabled={!uploadsEnabled}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="disclosure-phone">
            Phone{phoneRequired ? "" : " (optional)"}
          </Label>
          <Input
            id="disclosure-phone"
            type="tel"
            disabled={!uploadsEnabled}
            required={phoneRequired}
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="disclosure-contact-method">Preferred contact</Label>
          <Select
            value={contactMethod}
            onValueChange={setContactMethod}
            disabled={!uploadsEnabled}
          >
            <SelectTrigger id="disclosure-contact-method">
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
          <Label htmlFor="disclosure-deadline">Offer deadline (optional)</Label>
          <Input
            id="disclosure-deadline"
            type="date"
            disabled={!uploadsEnabled}
            value={offerDeadline}
            onChange={(e) => setOfferDeadline(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="disclosure-agent">Already working with an agent?</Label>
          <Select
            value={workingWithAgent}
            onValueChange={setWorkingWithAgent}
            disabled={!uploadsEnabled}
          >
            <SelectTrigger id="disclosure-agent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="exploring">Just exploring</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="disclosure-attention">
            Anything you’d like me to pay particular attention to? (optional)
          </Label>
          <Textarea
            id="disclosure-attention"
            rows={3}
            disabled={!uploadsEnabled}
            value={attention}
            onChange={(e) => setAttention(e.target.value)}
            placeholder="Roof, electrical, HOA reserves, permits, pest…"
          />
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-secondary/30 p-4">
        <Checkbox
          id="disclosure-consent"
          checked={consent}
          disabled={!uploadsEnabled}
          onCheckedChange={(v) => setConsent(v === true)}
          aria-required
        />
        <Label
          htmlFor="disclosure-consent"
          className="text-sm font-normal leading-relaxed text-muted-foreground"
        >
          I consent to AI-assisted processing of these documents and review by Jason
          Lim. Files are for transaction guidance only — not shared for marketing.
          Access is limited to Jason and systems needed to process the review. Documents
          are kept only as long as needed for the request or applicable legal
          requirements; email{" "}
          <a
            href="mailto:jason.lim@compass.com"
            className="font-medium text-accent hover:underline"
          >
            jason.lim@compass.com
          </a>{" "}
          to request deletion. See the{" "}
          <Link href="/privacy" className="font-medium text-accent hover:underline">
            Privacy Policy
          </Link>
          .
        </Label>
      </div>

      {clientError ? (
        <p className="text-sm text-destructive" role="alert">
          {clientError}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" variant="accent" disabled={!uploadsEnabled || !consent}>
          {uploadsEnabled ? "Submit disclosure package" : "Upload coming soon"}
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href="#review-with-jason">Review With Jason instead</a>
        </Button>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Any summary is a reading aid. Always consult the original documents and
        qualified professionals (inspectors, contractors, attorneys, lenders) before
        making decisions. Findings cite source files and PDF pages; they do not invent
        repair costs or property condition claims.
      </p>
    </form>
  );
}
