export type LeadStatus =
  | "new"
  | "attempted_contact"
  | "contacted"
  | "nurture"
  | "active_buyer"
  | "active_seller"
  | "active_renter"
  | "under_contract"
  | "closed"
  | "lost"
  | "archived";

export type Temperature = "hot" | "warm" | "cold";

export interface CrmContact {
  id: string;
  owner_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  secondary_phone: string | null;
  phone_normalized: string | null;
  preferred_contact_method: string | null;
  is_buyer: boolean;
  is_seller: boolean;
  is_renter: boolean;
  is_investor: boolean;
  is_neighbor: boolean;
  is_referral: boolean;
  is_other: boolean;
  lead_source: string | null;
  source_detail: string | null;
  lead_status: LeadStatus;
  temperature: Temperature;
  budget_min: number | null;
  budget_max: number | null;
  desired_cities: string[] | null;
  desired_zips: string[] | null;
  neighborhoods: string[] | null;
  bedrooms_min: number | null;
  bathrooms_min: number | null;
  property_types: string[] | null;
  target_purchase_date: string | null;
  preapproval_status: string | null;
  lender: string | null;
  current_housing: string | null;
  seller_property_address: string | null;
  seller_estimated_value: number | null;
  selling_timeframe: string | null;
  reason_for_selling: string | null;
  monthly_budget: number | null;
  desired_move_in: string | null;
  has_cosigner: boolean | null;
  has_pets: boolean | null;
  last_contacted_at: string | null;
  next_follow_up_at: string | null;
  outreach_interval_days: number | null;
  email_opt_out: boolean;
  key_background: string | null;
  notes: string | null;
  organization: string | null;
  job_title: string | null;
  crm_contact: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface CrmNote {
  id: string;
  owner_id: string;
  contact_id: string;
  body: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface CrmActivity {
  id: string;
  owner_id: string;
  contact_id: string | null;
  type: string;
  title: string | null;
  body: string | null;
  metadata: Record<string, unknown>;
  occurred_at: string;
  created_at: string;
}

export interface ImportJob {
  id: string;
  owner_id: string;
  source_type: "csv" | "vcf" | "apple_contacts";
  file_name: string | null;
  status: string;
  processed: number;
  created_count: number;
  updated_count: number;
  merged_count: number;
  skipped_count: number;
  failed_count: number;
  defaults: Record<string, unknown>;
  error_summary: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface ParsedImportContact {
  tempId: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  secondary_phone?: string;
  organization?: string;
  job_title?: string;
  note?: string;
  address?: string;
  selected?: boolean;
}

export interface DuplicateMatch {
  contact: Pick<
    CrmContact,
    "id" | "first_name" | "last_name" | "email" | "phone"
  >;
  strength: "email" | "phone" | "name";
}

export type DuplicateAction = "merge" | "skip" | "create";

export function displayName(c: {
  first_name: string;
  last_name?: string | null;
}) {
  return [c.first_name, c.last_name].filter(Boolean).join(" ").trim();
}

export function statusLabel(status: string) {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
