/**
 * Newsletter adapter stubs.
 *
 * Set `NEWSLETTER_PROVIDER` to one of: mailchimp | convertkit | beehiiv | kit
 *
 * Required env vars (by provider):
 * - mailchimp → MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID, MAILCHIMP_SERVER_PREFIX
 * - convertkit → CONVERTKIT_API_KEY, CONVERTKIT_FORM_ID
 * - beehiiv → BEEHIIV_API_KEY, BEEHIIV_PUBLICATION_ID
 * - kit → KIT_API_KEY, KIT_FORM_ID
 */
import type {
  NewsletterProvider,
  NewsletterProviderId,
  NewsletterSubscribeResult,
  NewsletterSubscriber,
} from "@/services/newsletter/types";

export type {
  NewsletterProvider,
  NewsletterProviderId,
  NewsletterSubscribeResult,
  NewsletterSubscriber,
} from "@/services/newsletter/types";

abstract class StubNewsletterProvider implements NewsletterProvider {
  abstract readonly name: NewsletterProviderId;
  protected abstract envHint: string;

  protected notConfigured(): never {
    throw new Error(`Not configured: set ${this.envHint} for ${this.name}`);
  }

  async subscribe(_subscriber: NewsletterSubscriber): Promise<NewsletterSubscribeResult> {
    this.notConfigured();
  }

  async unsubscribe(_email: string): Promise<NewsletterSubscribeResult> {
    this.notConfigured();
  }
}

export class MailchimpNewsletterProvider extends StubNewsletterProvider {
  readonly name = "mailchimp" as const;
  protected envHint = "MAILCHIMP_API_KEY / MAILCHIMP_AUDIENCE_ID / MAILCHIMP_SERVER_PREFIX";
}

export class ConvertKitNewsletterProvider extends StubNewsletterProvider {
  readonly name = "convertkit" as const;
  protected envHint = "CONVERTKIT_API_KEY / CONVERTKIT_FORM_ID";
}

/** Beehiiv publication newsletter adapter stub. */
export class BeehiivNewsletterProvider extends StubNewsletterProvider {
  readonly name = "beehiiv" as const;
  protected envHint = "BEEHIIV_API_KEY / BEEHIIV_PUBLICATION_ID";
}

/** Kit (rebranded ConvertKit) adapter stub. */
export class KitNewsletterProvider extends StubNewsletterProvider {
  readonly name = "kit" as const;
  protected envHint = "KIT_API_KEY / KIT_FORM_ID";
}

export function getNewsletterProvider(
  providerId?: NewsletterProviderId,
): NewsletterProvider {
  const id =
    providerId ??
    (process.env.NEWSLETTER_PROVIDER as NewsletterProviderId | undefined);

  if (!id) {
    throw new Error(
      "Not configured: set NEWSLETTER_PROVIDER to select a newsletter adapter",
    );
  }

  switch (id) {
    case "mailchimp":
      return new MailchimpNewsletterProvider();
    case "convertkit":
      return new ConvertKitNewsletterProvider();
    case "beehiiv":
      return new BeehiivNewsletterProvider();
    case "kit":
      return new KitNewsletterProvider();
    default:
      throw new Error(`Not configured: unknown NEWSLETTER_PROVIDER "${String(id)}"`);
  }
}
