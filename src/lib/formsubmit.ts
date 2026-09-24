/**
 * Client-side FormSubmit delivery to jason.lim@compass.com.
 * Browser → formsubmit.co is more reliable than Vercel serverless IPs.
 * https://formsubmit.co/ajax-documentation
 */

export type FormSubmitResult =
  | { ok: true; needsActivation?: boolean; rawMessage?: string }
  | { ok: false; error: string };

export async function sendViaFormSubmit(input: {
  to: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Extra fields shown in the FormSubmit table email */
  fields?: Record<string, string>;
}): Promise<FormSubmitResult> {
  const body: Record<string, string> = {
    name: input.name,
    email: input.email,
    message: input.message,
    _subject: input.subject,
    _template: "table",
    _captcha: "false",
    _replyto: input.email,
    ...(input.fields ?? {}),
  };

  let res: Response;
  try {
    res = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(input.to)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      },
    );
  } catch {
    return {
      ok: false,
      error: `Network error reaching FormSubmit. Please email ${input.to} directly.`,
    };
  }

  const raw = await res.text().catch(() => "");
  let parsed: { success?: string | boolean; message?: string } | null = null;
  try {
    parsed = raw
      ? (JSON.parse(raw) as { success?: string | boolean; message?: string })
      : null;
  } catch {
    parsed = null;
  }

  const message = String(parsed?.message ?? raw ?? "");
  const lower = message.toLowerCase();
  const successFlag =
    parsed?.success === true ||
    parsed?.success === "true" ||
    lower.includes("success") ||
    lower.includes("sent") ||
    lower.includes("activate") ||
    lower.includes("confirm");

  if (res.ok && successFlag) {
    return {
      ok: true,
      needsActivation:
        lower.includes("activate") || lower.includes("confirm"),
      rawMessage: message || undefined,
    };
  }

  // FormSubmit sometimes returns 200 with an empty body after accept.
  if (res.ok && !raw.trim()) {
    return { ok: true };
  }

  return {
    ok: false,
    error:
      message.slice(0, 280) ||
      `FormSubmit returned HTTP ${res.status}. Please email ${input.to} directly.`,
  };
}
