import Link from "next/link";
import { redirect } from "next/navigation";

import { listImportJobs } from "@/features/crm/actions/import";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Import history" };

export default async function ImportHistoryPage() {
  let jobs;
  try {
    jobs = await listImportJobs();
  } catch {
    redirect("/admin/login");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/admin/contacts"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Contacts
          </Link>
          <h1 className="mt-2 font-display text-3xl font-semibold">Import history</h1>
        </div>
        <Button asChild variant="accent">
          <Link href="/admin/contacts/import">New import</Link>
        </Button>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            No imports yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Card key={job.id} className="border-border/70">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {job.file_name || "Import"}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {new Date(job.created_at).toLocaleString()} · {job.source_type}
                </p>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-5">
                <p>
                  <span className="text-muted-foreground">Processed</span>
                  <br />
                  <strong>{job.processed}</strong>
                </p>
                <p>
                  <span className="text-muted-foreground">Created</span>
                  <br />
                  <strong>{job.created_count}</strong>
                </p>
                <p>
                  <span className="text-muted-foreground">Merged</span>
                  <br />
                  <strong>{job.merged_count}</strong>
                </p>
                <p>
                  <span className="text-muted-foreground">Skipped</span>
                  <br />
                  <strong>{job.skipped_count}</strong>
                </p>
                <p>
                  <span className="text-muted-foreground">Failed</span>
                  <br />
                  <strong>{job.failed_count}</strong>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
