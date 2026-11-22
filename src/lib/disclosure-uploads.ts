/**
 * Live disclosure PDF uploads use private Supabase Storage + a server-side
 * PDF extract / AI draft workflow for Jason to review before buyer follow-up.
 *
 * Enabled when Supabase service credentials exist, unless explicitly disabled:
 *   DISCLOSURE_UPLOADS_ENABLED=false
 * Force-on even during partial setup:
 *   DISCLOSURE_UPLOADS_ENABLED=true
 */
export function areDisclosureUploadsEnabled() {
  if (process.env.DISCLOSURE_UPLOADS_ENABLED === "false") return false;
  if (process.env.DISCLOSURE_UPLOADS_ENABLED === "true") return true;

  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

export function isDisclosureAiConfigured() {
  return (
    process.env.AI_ENABLED !== "false" &&
    Boolean(process.env.OPENAI_API_KEY?.trim())
  );
}
