"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireUser } from "@/lib/crm/auth";
import { normalizePhone } from "@/lib/crm/phone";
import type { CrmContact, DuplicateMatch } from "@/types/crm";

const quickCreateSchema = z.object({
  first_name: z.string().min(1).max(80),
  last_name: z.string().max(80).optional().default(""),
  email: z.string().max(200).optional().nullable(),
  phone: z.string().max(40).optional().nullable(),
  crm_contact: z.boolean().optional().default(true),
});

export type ContactInput = z.infer<typeof quickCreateSchema> & {
  secondary_phone?: string | null;
  preferred_contact_method?: string | null;
  is_buyer?: boolean;
  is_seller?: boolean;
  is_renter?: boolean;
  is_investor?: boolean;
  is_neighbor?: boolean;
  is_referral?: boolean;
  is_other?: boolean;
  lead_source?: string | null;
  source_detail?: string | null;
  lead_status?: string;
  temperature?: string;
  budget_min?: number | null;
  budget_max?: number | null;
  desired_cities?: string[];
  desired_zips?: string[];
  neighborhoods?: string[];
  bedrooms_min?: number | null;
  bathrooms_min?: number | null;
  property_types?: string[];
  target_purchase_date?: string | null;
  preapproval_status?: string | null;
  lender?: string | null;
  current_housing?: string | null;
  seller_property_address?: string | null;
  seller_estimated_value?: number | null;
  selling_timeframe?: string | null;
  reason_for_selling?: string | null;
  monthly_budget?: number | null;
  desired_move_in?: string | null;
  has_cosigner?: boolean | null;
  has_pets?: boolean | null;
  next_follow_up_at?: string | null;
  outreach_interval_days?: number | null;
  key_background?: string | null;
  organization?: string | null;
  job_title?: string | null;
  crm_contact?: boolean;
};

function contactPayload(ownerId: string, input: ContactInput) {
  const phone = input.phone?.trim() || null;
  const secondary = input.secondary_phone?.trim() || null;
  return {
    owner_id: ownerId,
    first_name: input.first_name.trim(),
    last_name: (input.last_name || "").trim(),
    email: input.email || null,
    phone,
    secondary_phone: secondary,
    phone_normalized: normalizePhone(phone),
    secondary_phone_normalized: normalizePhone(secondary),
    preferred_contact_method: input.preferred_contact_method || null,
    is_buyer: !!input.is_buyer,
    is_seller: !!input.is_seller,
    is_renter: !!input.is_renter,
    is_investor: !!input.is_investor,
    is_neighbor: !!input.is_neighbor,
    is_referral: !!input.is_referral,
    is_other: !!input.is_other,
    lead_source: input.lead_source || null,
    source_detail: input.source_detail || null,
    lead_status: input.lead_status || "new",
    temperature: input.temperature || "warm",
    budget_min: input.budget_min ?? null,
    budget_max: input.budget_max ?? null,
    desired_cities: input.desired_cities || [],
    desired_zips: input.desired_zips || [],
    neighborhoods: input.neighborhoods || [],
    bedrooms_min: input.bedrooms_min ?? null,
    bathrooms_min: input.bathrooms_min ?? null,
    property_types: input.property_types || [],
    target_purchase_date: input.target_purchase_date || null,
    preapproval_status: input.preapproval_status || null,
    lender: input.lender || null,
    current_housing: input.current_housing || null,
    seller_property_address: input.seller_property_address || null,
    seller_estimated_value: input.seller_estimated_value ?? null,
    selling_timeframe: input.selling_timeframe || null,
    reason_for_selling: input.reason_for_selling || null,
    monthly_budget: input.monthly_budget ?? null,
    desired_move_in: input.desired_move_in || null,
    has_cosigner: input.has_cosigner ?? null,
    has_pets: input.has_pets ?? null,
    next_follow_up_at: input.next_follow_up_at || null,
    outreach_interval_days: input.outreach_interval_days ?? 4,
    key_background: input.key_background || null,
    organization: input.organization || null,
    job_title: input.job_title || null,
    crm_contact: input.crm_contact !== false,
  };
}

export async function createContact(input: ContactInput) {
  const parsed = quickCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: "First name is required." };
  }

  const emailRaw = (parsed.data.email || "").trim();
  if (emailRaw && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw)) {
    return { success: false as const, error: "Enter a valid email or leave it blank." };
  }

  const { supabase, user } = await requireUser();
  const payload = contactPayload(user.id, {
    ...input,
    ...parsed.data,
    email: emailRaw || null,
  });

  const { data, error } = await supabase
    .from("contacts")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    console.error("[createContact]", error);
    return { success: false as const, error: error.message };
  }

  await supabase.from("activities").insert({
    owner_id: user.id,
    contact_id: data.id,
    type: "contact_created",
    title: "Contact created",
    body: `${payload.first_name} ${payload.last_name}`.trim(),
  });

  revalidatePath("/admin");
  revalidatePath("/admin/contacts");
  return { success: true as const, contact: data as CrmContact };
}

export async function updateContact(id: string, input: Partial<ContactInput>) {
  const { supabase, user } = await requireUser();

  const patch: Record<string, unknown> = { ...input };
  if ("phone" in input) {
    patch.phone = input.phone?.trim() || null;
    patch.phone_normalized = normalizePhone(input.phone);
  }
  if ("secondary_phone" in input) {
    patch.secondary_phone = input.secondary_phone?.trim() || null;
    patch.secondary_phone_normalized = normalizePhone(input.secondary_phone);
  }
  if ("email" in input) {
    patch.email = input.email?.trim() || null;
  }
  if ("first_name" in input && input.first_name) {
    patch.first_name = input.first_name.trim();
  }
  if ("last_name" in input) {
    patch.last_name = (input.last_name || "").trim();
  }

  delete patch.owner_id;

  const { data: before } = await supabase
    .from("contacts")
    .select("lead_status")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();

  const { data, error } = await supabase
    .from("contacts")
    .update(patch)
    .eq("id", id)
    .eq("owner_id", user.id)
    .select("*")
    .single();

  if (error) {
    return { success: false as const, error: error.message };
  }

  if (
    before &&
    input.lead_status &&
    before.lead_status !== input.lead_status
  ) {
    await supabase.from("activities").insert({
      owner_id: user.id,
      contact_id: id,
      type: "status_change",
      title: "Status changed",
      body: `${before.lead_status} → ${input.lead_status}`,
    });
  }

  revalidatePath("/admin/contacts");
  revalidatePath(`/admin/contacts/${id}`);
  return { success: true as const, contact: data as CrmContact };
}

export async function deleteContact(id: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) return { success: false as const, error: error.message };
  revalidatePath("/admin/contacts");
  return { success: true as const };
}

export async function listContacts(opts?: {
  q?: string;
  status?: string;
  crmOnly?: boolean;
  source?: string;
}) {
  const { supabase, user } = await requireUser();
  let query = supabase
    .from("contacts")
    .select("*")
    .eq("owner_id", user.id)
    .order("updated_at", { ascending: false });

  if (opts?.crmOnly !== false) {
    query = query.eq("crm_contact", true);
  }
  if (opts?.status) {
    query = query.eq("lead_status", opts.status);
  }
  if (opts?.source) {
    query = query.eq("lead_source", opts.source);
  }

  const { data, error } = await query.limit(500);
  if (error) throw new Error(error.message);

  let rows = (data || []) as CrmContact[];
  const q = opts?.q?.trim().toLowerCase();
  if (q) {
    rows = rows.filter((c) => {
      const hay = [
        c.first_name,
        c.last_name,
        c.email,
        c.phone,
        c.lead_source,
        c.source_detail,
        c.organization,
        ...(c.neighborhoods || []),
        ...(c.desired_cities || []),
        ...(c.desired_zips || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }
  return rows;
}

export async function getContact(id: string) {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as CrmContact | null;
}

export async function findDuplicatesFor(
  candidates: Array<{
    first_name: string;
    last_name: string;
    email?: string | null;
    phone?: string | null;
  }>,
): Promise<Record<number, DuplicateMatch | null>> {
  const { supabase, user } = await requireUser();
  const { data } = await supabase
    .from("contacts")
    .select("id, first_name, last_name, email, phone, phone_normalized")
    .eq("owner_id", user.id)
    .limit(2000);

  const existing = data || [];
  const result: Record<number, DuplicateMatch | null> = {};

  candidates.forEach((c, idx) => {
    const email = c.email?.trim().toLowerCase();
    const phone = normalizePhone(c.phone);
    let match: DuplicateMatch | null = null;

    for (const e of existing) {
      if (email && e.email?.toLowerCase() === email) {
        match = {
          contact: e,
          strength: "email",
        };
        break;
      }
      if (phone && e.phone_normalized === phone) {
        match = { contact: e, strength: "phone" };
        break;
      }
    }
    if (!match) {
      for (const e of existing) {
        if (
          e.first_name.toLowerCase() === c.first_name.toLowerCase() &&
          (e.last_name || "").toLowerCase() === (c.last_name || "").toLowerCase() &&
          c.first_name.trim()
        ) {
          match = { contact: e, strength: "name" };
          break;
        }
      }
    }
    result[idx] = match;
  });

  return result;
}
