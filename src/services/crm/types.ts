export type CrmProviderId =
  | "followupboss"
  | "kvcore"
  | "lofty"
  | "cinc"
  | "hubspot"
  | "salesforce"
  | "gohighlevel";

export interface CrmContact {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
  source?: string;
  notes?: string;
}

export interface CrmLeadInput {
  contact: CrmContact;
  message?: string;
  listingId?: string;
  listingUrl?: string;
  interest?: "buy" | "sell" | "invest" | "rent" | "other";
  budgetMin?: number;
  budgetMax?: number;
  preferredCities?: string[];
}

export interface CrmLeadResult {
  provider: CrmProviderId | string;
  success: boolean;
  externalId?: string;
  message?: string;
}

export interface CrmProvider {
  readonly name: CrmProviderId | string;
  createLead(input: CrmLeadInput): Promise<CrmLeadResult>;
  upsertContact(contact: CrmContact): Promise<CrmLeadResult>;
}
