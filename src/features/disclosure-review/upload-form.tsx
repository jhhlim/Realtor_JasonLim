"use client";

import * as React from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
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

type SubmitState = "idle" | "uploading" | "analyzing" | "success" | "error";

function getBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon);
}

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
  const [status, setStatus] = React.useState<SubmitState>("idle");
  const [preferredContactConfirm, setPreferredContactConfirm] =
    React.useState("email");

  const phoneRequired = contactMethod === "phone";
  const busy = status === "uploading" || status === "analyzing";

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

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setClientError(null);

    if (!uploadsEnabled) {
      setClientError(
        "Secure document upload is not live yet. Please use Review With Jason below.",
      );
      return;
    }
    if (!consent) {
      setClientError("Please confirm consent before submitting.");
      return;
    }
    if (!files.length) {
      setClientError("Add at least one PDF disclosure package.");
      return;
    }
    if (phoneRequired && !phone.trim()) {
      setClientError("Phone is required when you choose a phone call.");
      return;
    }

    const supabase = getBrowserSupabase();
    if (!supabase) {
      setClientError("Upload client is not configured.");
      return;
    }

    try {
      setStatus("uploading");

      const initRes = await fetch("/api/disclosure-review/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyAddress: address,
          fullName: name,
          email,
          phone,
          preferredContact: contactMethod,
          offerDeadline,
          workingWithAgent,
          attentionNotes: attention,
          consent: true,
          files: files.map((f) => ({
            name: f.name,
            size: f.size,
            contentType: f.type || "application/pdf",
          })),
        }),
      });

      const initJson = (await initRes.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
        requestId?: string;
        uploads?: {
          path: string;
          token: string;
          originalName: string;
        }[];
      } | null;

      if (!initRes.ok || !initJson?.success || !initJson.requestId || !initJson.uploads) {
        throw new Error(initJson?.error || "Unable to start upload.");
      }

      const uploadedPaths: { path: string; originalName: string }[] = [];

      for (const upload of initJson.uploads) {
        const file = files.find((f) => f.name === upload.originalName);
        if (!file) {
          throw new Error(`Missing local file for ${upload.originalName}`);
        }

        const { error } = await supabase.storage
          .from("disclosure-packages")
          .uploadToSignedUrl(upload.path, upload.token, file, {
            contentType: "application/pdf",
            upsert: false,
          });

        if (error) {
          throw new Error(`Upload failed for ${file.name}: ${error.message}`);
        }

        uploadedPaths.push({
          path: upload.path,
          originalName: upload.originalName,
        });
      }

      setStatus("analyzing");

      const completeRes = await fetch("/api/disclosure-review/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: initJson.requestId,
          uploadedPaths,
        }),
      });

      const completeJson = (await completeRes.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
        preferredContact?: string;
      } | null;

      if (!completeRes.ok || !completeJson?.success) {
        throw new Error(
          completeJson?.error ||
            "Upload finished but processing failed. Use Review With Jason if you need a quick follow-up.",
        );
      }

      setPreferredContactConfirm(
        completeJson.preferredContact || contactMethod,
      );
      setStatus("success");
      setFiles([]);
      setConsent(false);
    } catch (error) {
      setStatus("error");
      setClientError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        id="upload"
        className={cn(
          "scroll-mt-28 space-y-4 rounded-3xl border border-accent/25 bg-accent/5 p-6 sm:p-8",
          className,
        )}
        role="status"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Package received
        </p>
        <h3 className="font-display text-2xl font-semibold tracking-tight">
          Thanks — your disclosures are in
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
          Your package was received securely. Jason will review the organized draft
          and follow up using your preferred contact method (
          {preferredContactConfirm}). Complimentary — no obligation. This did not
          subscribe you to marketing.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Button asChild variant="accent">
            <a href="#review-with-jason">Also request a live walkthrough</a>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact page</Link>
          </Button>
        </div>
      </div>
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
      aria-busy={busy}
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
            Live PDF upload needs Supabase storage on this deployment. You can still{" "}
            <a href="#review-with-jason" className="font-medium text-accent hover:underline">
              request a walkthrough
            </a>{" "}
            now.
          </p>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="disclosure-address">Property address</Label>
        <Input
          id="disclosure-address"
          name="address"
          required
          disabled={!uploadsEnabled || busy}
          placeholder="Street address, city"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <Label id="disclosure-files-label">Disclosure PDFs</Label>
        <div
          role="button"
          tabIndex={uploadsEnabled && !busy ? 0 : -1}
          aria-disabled={!uploadsEnabled || busy}
          aria-labelledby="disclosure-files-label"
          className={cn(
            "rounded-2xl border border-dashed px-4 py-8 text-center transition-colors",
            uploadsEnabled && !busy
              ? "cursor-pointer border-border hover:border-accent/50 hover:bg-accent/5"
              : "cursor-not-allowed border-border/60 bg-secondary/40 opacity-80",
            dragActive && uploadsEnabled && "border-accent bg-accent/5",
          )}
          onClick={() => uploadsEnabled && !busy && inputRef.current?.click()}
          onKeyDown={(e) => {
            if (!uploadsEnabled || busy) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            if (uploadsEnabled && !busy) setDragActive(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (uploadsEnabled && !busy) setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (uploadsEnabled && !busy) addFiles(e.dataTransfer.files);
          }}
        >
          <FileUp className="mx-auto mb-3 h-8 w-8 text-accent" aria-hidden />
          <p className="text-sm font-medium">
            {uploadsEnabled
              ? "Drag and drop PDFs here, or choose files"
              : "Drag-and-drop upload unavailable"}
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
            disabled={!uploadsEnabled || busy}
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
                  disabled={busy}
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
            disabled={!uploadsEnabled || busy}
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
            disabled={!uploadsEnabled || busy}
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
            disabled={!uploadsEnabled || busy}
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
            disabled={!uploadsEnabled || busy}
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
            disabled={!uploadsEnabled || busy}
            value={offerDeadline}
            onChange={(e) => setOfferDeadline(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="disclosure-agent">Already working with an agent?</Label>
          <Select
            value={workingWithAgent}
            onValueChange={setWorkingWithAgent}
            disabled={!uploadsEnabled || busy}
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
            disabled={!uploadsEnabled || busy}
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
          disabled={!uploadsEnabled || busy}
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
        <Button
          type="submit"
          size="lg"
          variant="accent"
          disabled={!uploadsEnabled || !consent || busy}
        >
          {status === "uploading"
            ? "Uploading…"
            : status === "analyzing"
              ? "Organizing draft…"
              : "Submit disclosure package"}
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href="#review-with-jason">Review With Jason instead</a>
        </Button>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Any summary is a reading aid for Jason to review with you. Always consult the
        original documents and qualified professionals before making decisions.
        Findings cite source files and PDF pages; they do not invent repair costs or
        property condition claims.
      </p>
    </form>
  );
}
