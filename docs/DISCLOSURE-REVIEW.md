# Disclosure Review (`/disclosure-review`)

Buyer resource that mirrors a “Home Clarity”-style journey with Jason Lim Realty branding.

## Live today

- Public landing page with original copy
- Interactive **fictional sample** report (no contact info required)
- **Review With Jason** walkthrough form → FormSubmit email lead (no file upload)
- Links from Buy, Resources, footer Explore, sitemap
- Privacy policy section covering disclosure packages

## Not live yet (by design)

PDF upload + server-side extraction/OCR + private AI draft reports require:

1. Private object storage (e.g. Supabase Storage or S3) with access controls
2. Server route that validates PDF type/size, stores files privately, never emails attachments or logs document text
3. PDF text extraction (and OCR for scanned pages), preserving document name + page numbers; flag unreadable pages
4. AI draft structured for **Jason to review before sharing** (overview, findings, conflicts, missing referenced docs, questions) with citations
5. Set `DISCLOSURE_UPLOADS_ENABLED=true` only after the above is ready

Until then, the upload UI is visible but disabled; buyers use the walkthrough request and can share PDFs privately after contact.
