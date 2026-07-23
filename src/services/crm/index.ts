/**
 * CRM adapter stubs for common real-estate platforms.
 *
 * Set `CRM_PROVIDER` to one of:
 * followupboss | kvcore | lofty | cinc | hubspot | salesforce | gohighlevel
 *
 * Required env vars (by provider):
 * - followupboss → FOLLOW_UP_BOSS_API_KEY
 * - kvcore → KVCORE_API_KEY
 * - lofty → LOFTY_API_KEY
 * - cinc → CINC_API_KEY
 * - hubspot → HUBSPOT_ACCESS_TOKEN
 * - salesforce → SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET, SALESFORCE_REFRESH_TOKEN
 * - gohighlevel → GOHIGHLEVEL_API_KEY
 */
import type {
  CrmContact,
  CrmLeadInput,
  CrmLeadResult,
  CrmProvider,
  CrmProviderId,
} from "@/services/crm/types";

export type {
  CrmContact,
  CrmLeadInput,
  CrmLeadResult,
  CrmProvider,
  CrmProviderId,
} from "@/services/crm/types";

abstract class StubCrmProvider implements CrmProvider {
  abstract readonly name: CrmProviderId;
  protected abstract envHint: string;

  protected notConfigured(): never {
    throw new Error(`Not configured: set ${this.envHint} for ${this.name}`);
  }

  async createLead(_input: CrmLeadInput): Promise<CrmLeadResult> {
    this.notConfigured();
  }

  async upsertContact(_contact: CrmContact): Promise<CrmLeadResult> {
    this.notConfigured();
  }
}

export class FollowUpBossCrmProvider extends StubCrmProvider {
  readonly name = "followupboss" as const;
  protected envHint = "FOLLOW_UP_BOSS_API_KEY";
}

export class KvCoreCrmProvider extends StubCrmProvider {
  readonly name = "kvcore" as const;
  protected envHint = "KVCORE_API_KEY";
}

export class LoftyCrmProvider extends StubCrmProvider {
  readonly name = "lofty" as const;
  protected envHint = "LOFTY_API_KEY";
}

export class CincCrmProvider extends StubCrmProvider {
  readonly name = "cinc" as const;
  protected envHint = "CINC_API_KEY";
}

export class HubSpotCrmProvider extends StubCrmProvider {
  readonly name = "hubspot" as const;
  protected envHint = "HUBSPOT_ACCESS_TOKEN";
}

export class SalesforceCrmProvider extends StubCrmProvider {
  readonly name = "salesforce" as const;
  protected envHint = "SALESFORCE_CLIENT_ID / SALESFORCE_CLIENT_SECRET / SALESFORCE_REFRESH_TOKEN";
}

export class GoHighLevelCrmProvider extends StubCrmProvider {
  readonly name = "gohighlevel" as const;
  protected envHint = "GOHIGHLEVEL_API_KEY";
}

export function getCrmProvider(providerId?: CrmProviderId): CrmProvider {
  const id =
    providerId ??
    (process.env.CRM_PROVIDER as CrmProviderId | undefined);

  if (!id) {
    throw new Error("Not configured: set CRM_PROVIDER to select a CRM adapter");
  }

  switch (id) {
    case "followupboss":
      return new FollowUpBossCrmProvider();
    case "kvcore":
      return new KvCoreCrmProvider();
    case "lofty":
      return new LoftyCrmProvider();
    case "cinc":
      return new CincCrmProvider();
    case "hubspot":
      return new HubSpotCrmProvider();
    case "salesforce":
      return new SalesforceCrmProvider();
    case "gohighlevel":
      return new GoHighLevelCrmProvider();
    default:
      throw new Error(`Not configured: unknown CRM_PROVIDER "${String(id)}"`);
  }
}
