/**
 * Live disclosure PDF uploads require private object storage, server-side PDF
 * extraction/OCR, and a private report workflow for Jason to review before sharing.
 *
 * Enable only when those services are configured:
 *   DISCLOSURE_UPLOADS_ENABLED=true
 *   + storage credentials (e.g. Supabase Storage / S3)
 *   + AI provider for draft analysis
 */
export function areDisclosureUploadsEnabled() {
  return process.env.DISCLOSURE_UPLOADS_ENABLED === "true";
}
