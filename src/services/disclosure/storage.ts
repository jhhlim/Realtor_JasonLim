import { createServiceClient } from "@/lib/supabase/service";
import { DISCLOSURE_BUCKET } from "@/lib/disclosure/schema";

let bucketReady: Promise<void> | null = null;

export async function ensureDisclosureBucket() {
  if (!bucketReady) {
    bucketReady = (async () => {
      const supabase = createServiceClient();
      const { data: buckets, error: listError } =
        await supabase.storage.listBuckets();
      if (listError) {
        throw new Error(`Unable to list storage buckets: ${listError.message}`);
      }
      const exists = buckets?.some((b) => b.name === DISCLOSURE_BUCKET);
      if (!exists) {
        const { error } = await supabase.storage.createBucket(DISCLOSURE_BUCKET, {
          public: false,
          fileSizeLimit: 20 * 1024 * 1024,
          allowedMimeTypes: ["application/pdf"],
        });
        if (error && !/already exists/i.test(error.message)) {
          throw new Error(`Unable to create storage bucket: ${error.message}`);
        }
      }
    })().catch((err) => {
      bucketReady = null;
      throw err;
    });
  }
  await bucketReady;
}

export function sanitizeFileName(name: string) {
  return name
    .replace(/[^\w.\-() ]+/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180) || "document.pdf";
}

export async function createSignedDisclosureUploads(
  requestId: string,
  files: { name: string; size: number }[],
) {
  await ensureDisclosureBucket();
  const supabase = createServiceClient();

  const uploads: {
    path: string;
    token: string;
    signedUrl: string;
    originalName: string;
    size: number;
  }[] = [];

  for (const file of files) {
    const safe = sanitizeFileName(file.name);
    const path = `${requestId}/${Date.now()}-${safe}`;
    const { data, error } = await supabase.storage
      .from(DISCLOSURE_BUCKET)
      .createSignedUploadUrl(path);

    if (error || !data) {
      throw new Error(
        `Unable to create upload URL for ${file.name}: ${error?.message ?? "unknown"}`,
      );
    }

    uploads.push({
      path: data.path,
      token: data.token,
      signedUrl: data.signedUrl,
      originalName: file.name,
      size: file.size,
    });
  }

  return uploads;
}

export async function downloadDisclosureFile(path: string) {
  await ensureDisclosureBucket();
  const supabase = createServiceClient();
  const { data, error } = await supabase.storage
    .from(DISCLOSURE_BUCKET)
    .download(path);
  if (error || !data) {
    throw new Error(`Unable to download ${path}: ${error?.message ?? "missing"}`);
  }
  return data.arrayBuffer();
}
