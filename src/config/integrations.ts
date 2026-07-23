/**
 * Future integration stubs — env var names for AI, messaging, payments, and data.
 * Wire concrete clients behind these keys when ready; keep secrets server-side only.
 */

export const integrationsConfig = {
  ai: {
    openai: {
      label: "OpenAI",
      env: {
        apiKey: "OPENAI_API_KEY",
        orgId: "OPENAI_ORG_ID",
        model: "OPENAI_MODEL",
      },
      notes: "Home valuation narrative, offer coaching, market prediction drafts.",
    },
    claude: {
      label: "Anthropic Claude",
      env: {
        apiKey: "ANTHROPIC_API_KEY",
        model: "ANTHROPIC_MODEL",
      },
      notes: "Long-context CMA / comps analysis and blog drafting.",
    },
    gemini: {
      label: "Google Gemini",
      env: {
        apiKey: "GOOGLE_GENERATIVE_AI_API_KEY",
        model: "GEMINI_MODEL",
      },
      notes: "Multimodal listing photo analysis and neighborhood summaries.",
    },
  },

  messaging: {
    twilio: {
      label: "Twilio",
      env: {
        accountSid: "TWILIO_ACCOUNT_SID",
        authToken: "TWILIO_AUTH_TOKEN",
        fromNumber: "TWILIO_FROM_NUMBER",
      },
      notes: "SMS alerts for new listings and appointment reminders.",
    },
  },

  email: {
    resend: {
      label: "Resend",
      env: {
        apiKey: "RESEND_API_KEY",
        from: "EMAIL_FROM",
      },
      notes: "Transactional email (lead confirmations, valuation follow-ups).",
    },
  },

  payments: {
    stripe: {
      label: "Stripe",
      env: {
        secretKey: "STRIPE_SECRET_KEY",
        publishableKey: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
        webhookSecret: "STRIPE_WEBHOOK_SECRET",
      },
      notes: "Optional paid market reports or concierge retainers.",
    },
  },

  documents: {
    docusign: {
      label: "DocuSign",
      env: {
        integrationKey: "DOCUSIGN_INTEGRATION_KEY",
        userId: "DOCUSIGN_USER_ID",
        accountId: "DOCUSIGN_ACCOUNT_ID",
        privateKey: "DOCUSIGN_PRIVATE_KEY",
      },
      notes: "eSign listing agreements and disclosures.",
    },
  },

  productivity: {
    notion: {
      label: "Notion",
      env: {
        apiKey: "NOTION_API_KEY",
        databaseId: "NOTION_DATABASE_ID",
      },
      notes: "Sync leads or content calendar to Notion.",
    },
  },

  data: {
    supabase: {
      label: "Supabase",
      env: {
        url: "NEXT_PUBLIC_SUPABASE_URL",
        anonKey: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        serviceRoleKey: "SUPABASE_SERVICE_ROLE_KEY",
      },
      notes: "Auth, saved searches, and lead storage.",
    },
    firebase: {
      label: "Firebase",
      env: {
        apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
        projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
        appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
      },
      notes: "Optional push notifications / analytics alternate.",
    },
    pinecone: {
      label: "Pinecone",
      env: {
        apiKey: "PINECONE_API_KEY",
        index: "PINECONE_INDEX",
        environment: "PINECONE_ENVIRONMENT",
      },
      notes: "Vector search over listing descriptions and market reports.",
    },
    postgres: {
      label: "Postgres",
      env: {
        databaseUrl: "DATABASE_URL",
        directUrl: "DIRECT_URL",
      },
      notes: "Primary relational store (Prisma / Drizzle) for leads & cache.",
    },
  },

  calendly: {
    label: "Calendly",
    env: {
      url: "NEXT_PUBLIC_CALENDLY_URL",
    },
    notes: "Consultation booking embed / CTA links.",
  },
} as const;

export type IntegrationsConfig = typeof integrationsConfig;
