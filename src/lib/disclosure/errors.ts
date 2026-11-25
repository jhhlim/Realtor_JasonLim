/**
 * Map raw Supabase / network failures to buyer-facing copy.
 * Never surface "TypeError: fetch failed" or similar stack noise.
 */

const TABLE_MISSING =
  /relation .*disclosure_requests.* does not exist|Could not find the table|schema cache/i;

const NETWORK =
  /fetch failed|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|socket|network|getaddrinfo|UND_ERR|Failed to fetch|Load failed|aborted/i;

const ENV_MISSING =
  /Missing NEXT_PUBLIC_SUPABASE_URL|Missing.*SUPABASE_SERVICE_ROLE|not configured/i;

const BUCKET =
  /bucket|storage|Unable to (list|create) storage|upload URL/i;

export function disclosureErrorText(error: unknown): string {
  if (error == null) return "";
  if (typeof error === "string") return error;
  if (error instanceof Error) {
    const cause =
      error.cause instanceof Error
        ? error.cause.message
        : typeof error.cause === "string"
          ? error.cause
          : "";
    return [error.name, error.message, cause].filter(Boolean).join(" ");
  }
  if (typeof error === "object" && "message" in error) {
    const msg = (error as { message?: unknown }).message;
    return typeof msg === "string" ? msg : String(msg ?? "");
  }
  return String(error);
}

export type DisclosureInfraKind =
  | "network"
  | "table_missing"
  | "env_missing"
  | "bucket"
  | "unknown";

export function classifyDisclosureInfraError(error: unknown): DisclosureInfraKind {
  const text = disclosureErrorText(error);
  if (ENV_MISSING.test(text)) return "env_missing";
  if (TABLE_MISSING.test(text)) return "table_missing";
  if (NETWORK.test(text)) return "network";
  if (BUCKET.test(text)) return "bucket";
  return "unknown";
}

/** Public-safe message for init / storage failures. */
export function friendlyDisclosureInitError(error: unknown): string {
  switch (classifyDisclosureInfraError(error)) {
    case "env_missing":
      return "Secure disclosure upload is not configured yet. Please use Review With Jason below.";
    case "table_missing":
      return "Disclosure storage is almost ready — the disclosure_requests table still needs to be created in Supabase. Run supabase/DISCLOSURE_SETUP.sql in the SQL Editor, then try again. Or use Review With Jason below.";
    case "network":
      return "Secure storage is temporarily unreachable (could not reach the document database). Please use Review With Jason below, or try again in a few minutes.";
    case "bucket":
      return "File storage is not ready yet. Please use Review With Jason below, or try again after the disclosure-packages bucket is created.";
    default: {
      const text = disclosureErrorText(error).trim();
      // Never leak raw TypeError / fetch failed to buyers.
      if (!text || NETWORK.test(text) || /^TypeError\b/i.test(text)) {
        return "Unable to start disclosure upload. Please use Review With Jason below.";
      }
      return `Unable to create disclosure request. ${text} You can also use Review With Jason below.`;
    }
  }
}

export function isDisclosureInfraFailureMessage(message: string | null | undefined) {
  if (!message) return false;
  return (
    /Review With Jason|not configured|temporarily unreachable|almost ready|File storage is not ready|Unable to start disclosure|Unable to create disclosure/i.test(
      message,
    )
  );
}
