export type NewsletterProviderId = "mailchimp" | "convertkit" | "beehiiv" | "kit";

export interface NewsletterSubscriber {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  cityInterest?: string[];
}

export interface NewsletterSubscribeResult {
  provider: NewsletterProviderId | string;
  success: boolean;
  externalId?: string;
  message?: string;
}

export interface NewsletterProvider {
  readonly name: NewsletterProviderId | string;
  subscribe(subscriber: NewsletterSubscriber): Promise<NewsletterSubscribeResult>;
  unsubscribe(email: string): Promise<NewsletterSubscribeResult>;
}
