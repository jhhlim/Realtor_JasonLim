"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { Pin, Trash2 } from "lucide-react";

import { createNote, deleteNote, updateNote } from "@/features/crm/actions/notes";
import type { CrmActivity, CrmNote } from "@/types/crm";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactNotesPanel({
  contactId,
  notes: initialNotes,
  activities,
  focusNote,
}: {
  contactId: string;
  notes: CrmNote[];
  activities: CrmActivity[];
  focusNote?: boolean;
}) {
  const router = useRouter();
  const [body, setBody] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const noteRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (focusNote) noteRef.current?.focus();
  }, [focusNote]);

  const filtered = search.trim()
    ? initialNotes.filter((n) =>
        n.body.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : initialNotes;

  async function onQuickNote(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    setError(null);
    const res = await createNote({ contact_id: contactId, body });
    setLoading(false);
    if (!res.success) {
      setError(res.error);
      return;
    }
    setBody("");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/70">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-lg bg-accent/12 px-3 py-1.5 font-medium text-accent">
              Create Note
            </span>
            <span className="rounded-lg px-3 py-1.5 text-muted-foreground">
              Send Email
            </span>
            <span className="rounded-lg px-3 py-1.5 text-muted-foreground">
              Log Activity
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onQuickNote} className="space-y-3">
            <Textarea
              ref={noteRef}
              rows={3}
              placeholder="Quick note from the conversation…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" variant="accent" size="sm" disabled={loading}>
              {loading ? "Saving…" : "Save note"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold">Activity & notes</h2>
          <Input
            className="max-w-xs"
            placeholder="Search notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.map((note) => (
          <Card
            key={note.id}
            className={note.pinned ? "border-accent/40 bg-accent/5" : "border-border/70"}
          >
            <CardContent className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  {new Date(note.created_at).toLocaleString()} — {siteConfig.name}
                  {note.updated_at !== note.created_at ? " · edited" : ""}
                </p>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={async () => {
                      await updateNote(note.id, { pinned: !note.pinned });
                      router.refresh();
                    }}
                    aria-label={note.pinned ? "Unpin" : "Pin"}
                  >
                    <Pin className={`h-3.5 w-3.5 ${note.pinned ? "text-accent" : ""}`} />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={async () => {
                      await deleteNote(note.id, contactId);
                      router.refresh();
                    }}
                    aria-label="Delete note"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{note.body}</p>
            </CardContent>
          </Card>
        ))}

        {activities
          .filter((a) => a.type !== "note")
          .map((a) => (
            <div
              key={a.id}
              className="flex gap-3 border-b border-border/50 py-3 last:border-0"
            >
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
              <div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="text-sm font-medium">{a.title || a.type}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(a.occurred_at).toLocaleString()}
                  </span>
                </div>
                {a.body ? (
                  <p className="text-sm text-muted-foreground">{a.body}</p>
                ) : null}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
