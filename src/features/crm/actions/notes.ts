"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireUser } from "@/lib/crm/auth";
import type { CrmActivity, CrmNote } from "@/types/crm";

const noteSchema = z.object({
  contact_id: z.string().uuid(),
  body: z.string().min(1).max(10000),
  pinned: z.boolean().optional(),
});

export async function createNote(input: {
  contact_id: string;
  body: string;
  pinned?: boolean;
}) {
  const parsed = noteSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: "Note text is required." };
  }

  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("notes")
    .insert({
      owner_id: user.id,
      contact_id: parsed.data.contact_id,
      body: parsed.data.body.trim(),
      pinned: parsed.data.pinned ?? false,
    })
    .select("*")
    .single();

  if (error) return { success: false as const, error: error.message };

  await supabase.from("activities").insert({
    owner_id: user.id,
    contact_id: parsed.data.contact_id,
    type: "note",
    title: "Added note",
    body: parsed.data.body.trim().slice(0, 280),
  });

  await supabase
    .from("contacts")
    .update({ last_contacted_at: new Date().toISOString() })
    .eq("id", parsed.data.contact_id)
    .eq("owner_id", user.id);

  revalidatePath(`/admin/contacts/${parsed.data.contact_id}`);
  return { success: true as const, note: data as CrmNote };
}

export async function updateNote(
  id: string,
  patch: { body?: string; pinned?: boolean },
) {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("notes")
    .update({
      ...(patch.body !== undefined ? { body: patch.body.trim() } : {}),
      ...(patch.pinned !== undefined ? { pinned: patch.pinned } : {}),
    })
    .eq("id", id)
    .eq("owner_id", user.id)
    .select("*")
    .single();

  if (error) return { success: false as const, error: error.message };
  if (data) revalidatePath(`/admin/contacts/${data.contact_id}`);
  return { success: true as const, note: data as CrmNote };
}

export async function deleteNote(id: string, contactId: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath(`/admin/contacts/${contactId}`);
  return { success: true as const };
}

export async function listNotes(contactId: string, search?: string) {
  const { supabase, user } = await requireUser();
  let query = supabase
    .from("notes")
    .select("*")
    .eq("owner_id", user.id)
    .eq("contact_id", contactId)
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  let notes = (data || []) as CrmNote[];
  if (search?.trim()) {
    const q = search.toLowerCase();
    notes = notes.filter((n) => n.body.toLowerCase().includes(q));
  }
  return notes;
}

export async function listActivities(contactId: string) {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("owner_id", user.id)
    .eq("contact_id", contactId)
    .order("occurred_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return (data || []) as CrmActivity[];
}
