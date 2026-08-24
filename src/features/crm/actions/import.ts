"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/crm/auth";
import { normalizePhone } from "@/lib/crm/phone";
import type {
  DuplicateAction,
  ImportJob,
  ParsedImportContact,
} from "@/types/crm";

export interface ImportDefaults {
  groupName?: string;
  is_buyer?: boolean;
  is_seller?: boolean;
  is_renter?: boolean;
  is_investor?: boolean;
  is_neighbor?: boolean;
  is_referral?: boolean;
  lead_source?: string;
  source_detail?: string;
  tags?: string[];
  lead_status?: string;
  temperature?: string;
  crm_contact?: boolean;
}

export interface ImportRowDecision {
  contact: ParsedImportContact;
  action: DuplicateAction;
  matchId?: string;
  /** For merge: which phone/email to keep */
  keepPhone?: "existing" | "imported" | "both";
  keepEmail?: "existing" | "imported";
}

export async function commitImport(input: {
  sourceType: "csv" | "vcf" | "apple_contacts";
  fileName: string;
  rows: ImportRowDecision[];
  defaults: ImportDefaults;
}) {
  const { supabase, user } = await requireUser();
  const selected = input.rows.filter((r) => r.contact.selected !== false);

  let created = 0;
  let updated = 0;
  let merged = 0;
  let skipped = 0;
  let failed = 0;

  const tagIds: string[] = [];
  if (input.defaults.tags?.length) {
    for (const name of input.defaults.tags) {
      const trimmed = name.trim();
      if (!trimmed) continue;
      const { data: existing } = await supabase
        .from("tags")
        .select("id")
        .eq("owner_id", user.id)
        .eq("name", trimmed)
        .maybeSingle();
      if (existing) {
        tagIds.push(existing.id);
      } else {
        const { data: createdTag } = await supabase
          .from("tags")
          .insert({ owner_id: user.id, name: trimmed })
          .select("id")
          .single();
        if (createdTag) tagIds.push(createdTag.id);
      }
    }
  }

  let groupId: string | null = null;
  if (input.defaults.groupName?.trim()) {
    const gName = input.defaults.groupName.trim();
    const { data: gExisting } = await supabase
      .from("groups")
      .select("id")
      .eq("owner_id", user.id)
      .eq("name", gName)
      .maybeSingle();
    if (gExisting) {
      groupId = gExisting.id;
    } else {
      const { data: gCreated } = await supabase
        .from("groups")
        .insert({ owner_id: user.id, name: gName })
        .select("id")
        .single();
      groupId = gCreated?.id ?? null;
    }
  }

  for (const row of selected) {
    try {
      if (row.action === "skip") {
        skipped += 1;
        continue;
      }

      const c = row.contact;
      const phone = c.phone?.trim() || null;
      const email = c.email?.trim() || null;

      if (row.action === "merge" && row.matchId) {
        const { data: existing } = await supabase
          .from("contacts")
          .select("*")
          .eq("id", row.matchId)
          .eq("owner_id", user.id)
          .maybeSingle();

        if (!existing) {
          failed += 1;
          continue;
        }

        const patch: Record<string, unknown> = {
          crm_contact: input.defaults.crm_contact !== false,
        };

        if (row.keepEmail === "imported" && email) patch.email = email;
        if (row.keepPhone === "imported" && phone) {
          patch.phone = phone;
          patch.phone_normalized = normalizePhone(phone);
        }
        if (row.keepPhone === "both" && phone && existing.phone !== phone) {
          patch.secondary_phone = phone;
          patch.secondary_phone_normalized = normalizePhone(phone);
        }
        if (input.defaults.lead_source) patch.lead_source = input.defaults.lead_source;
        if (input.defaults.source_detail)
          patch.source_detail = input.defaults.source_detail;
        if (input.defaults.lead_status) patch.lead_status = input.defaults.lead_status;
        if (input.defaults.temperature) patch.temperature = input.defaults.temperature;
        if (input.defaults.is_buyer) patch.is_buyer = true;
        if (input.defaults.is_seller) patch.is_seller = true;
        if (input.defaults.is_renter) patch.is_renter = true;
        if (input.defaults.is_investor) patch.is_investor = true;
        if (input.defaults.is_neighbor) patch.is_neighbor = true;
        if (input.defaults.is_referral) patch.is_referral = true;
        if (c.organization && !existing.organization)
          patch.organization = c.organization;
        if (c.job_title && !existing.job_title) patch.job_title = c.job_title;

        await supabase
          .from("contacts")
          .update(patch)
          .eq("id", existing.id)
          .eq("owner_id", user.id);

        if (c.note?.trim()) {
          await supabase.from("notes").insert({
            owner_id: user.id,
            contact_id: existing.id,
            body: c.note.trim(),
          });
        }

        await supabase.from("activities").insert({
          owner_id: user.id,
          contact_id: existing.id,
          type: "contact_created",
          title: "Contact imported (merged)",
          body: `Merged from ${input.fileName}`,
        });

        for (const tagId of tagIds) {
          await supabase
            .from("contact_tags")
            .upsert({ contact_id: existing.id, tag_id: tagId });
        }
        if (groupId) {
          await supabase
            .from("contact_groups")
            .upsert({ contact_id: existing.id, group_id: groupId });
        }

        merged += 1;
        updated += 1;
        continue;
      }

      // create separate
      const { data: createdContact, error } = await supabase
        .from("contacts")
        .insert({
          owner_id: user.id,
          first_name: c.first_name.trim() || "Unknown",
          last_name: (c.last_name || "").trim(),
          email,
          phone,
          phone_normalized: normalizePhone(phone),
          secondary_phone: c.secondary_phone || null,
          secondary_phone_normalized: normalizePhone(c.secondary_phone),
          organization: c.organization || null,
          job_title: c.job_title || null,
          is_buyer: !!input.defaults.is_buyer,
          is_seller: !!input.defaults.is_seller,
          is_renter: !!input.defaults.is_renter,
          is_investor: !!input.defaults.is_investor,
          is_neighbor: !!input.defaults.is_neighbor,
          is_referral: !!input.defaults.is_referral,
          lead_source: input.defaults.lead_source || null,
          source_detail: input.defaults.source_detail || null,
          lead_status: input.defaults.lead_status || "new",
          temperature: input.defaults.temperature || "warm",
          crm_contact: input.defaults.crm_contact !== false,
        })
        .select("id")
        .single();

      if (error || !createdContact) {
        console.error(error);
        failed += 1;
        continue;
      }

      await supabase.from("activities").insert({
        owner_id: user.id,
        contact_id: createdContact.id,
        type: "contact_created",
        title: "Contact imported",
        body: `Imported from ${input.fileName}`,
      });

      if (c.note?.trim()) {
        await supabase.from("notes").insert({
          owner_id: user.id,
          contact_id: createdContact.id,
          body: c.note.trim(),
        });
        await supabase.from("activities").insert({
          owner_id: user.id,
          contact_id: createdContact.id,
          type: "note",
          title: "Imported note",
          body: c.note.trim().slice(0, 280),
        });
      }

      for (const tagId of tagIds) {
        await supabase
          .from("contact_tags")
          .upsert({ contact_id: createdContact.id, tag_id: tagId });
      }
      if (groupId) {
        await supabase
          .from("contact_groups")
          .upsert({ contact_id: createdContact.id, group_id: groupId });
      }

      created += 1;
    } catch (e) {
      console.error(e);
      failed += 1;
    }
  }

  const { data: job } = await supabase
    .from("import_jobs")
    .insert({
      owner_id: user.id,
      source_type: input.sourceType,
      file_name: input.fileName,
      status: "completed",
      processed: selected.length,
      created_count: created,
      updated_count: updated,
      merged_count: merged,
      skipped_count: skipped,
      failed_count: failed,
      defaults: input.defaults,
      completed_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  revalidatePath("/admin/contacts");
  revalidatePath("/admin/contacts/import");
  revalidatePath("/admin/contacts/import/history");

  return {
    success: true as const,
    job: job as ImportJob | null,
    stats: { created, updated, merged, skipped, failed, processed: selected.length },
  };
}

export async function listImportJobs() {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("import_jobs")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return (data || []) as ImportJob[];
}
