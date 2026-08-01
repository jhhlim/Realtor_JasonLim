/**
 * Single source of truth for personal & site branding.
 * Update placeholders here — they propagate across the site.
 */
export const siteConfig = {
  name: "Jason Lim",
  legalName: "Jason Lim | Compass",
  tagline: "Helping Bay Area families make confident real estate decisions.",
  secondaryTagline: "AI-powered real estate insights.",
  differentiator: "Technology + Data + Personal Service.",
  title: "Compass REALTOR® | Bay Area Real Estate",
  description:
    "Compass REALTOR® in San Jose combining software engineering, AI, and market analytics to help first-time buyers, move-up buyers, and investors make confident decisions.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://realtor-jason-lim.vercel.app",
  locale: "en_US",

  contact: {
    phone: "(510) 480-7191",
    phoneHref: "tel:+15104807191",
    email: "jason.lim@compass.com",
    sms: "sms:+15104807191",
    address: {
      line1: "San Jose, California",
      city: "San Jose",
      state: "CA",
      zip: "95132",
      region: "Silicon Valley",
    },
  },

  license: {
    dre: "DRE #02444964",
    status: "Licensed California REALTOR®",
  },

  brokerage: {
    name: "Compass",
    legalName: "Compass",
    url: "https://www.compass.com",
    findAgentUrl: "https://www.compass.com/agents/",
    tagline: "Official Compass agent serving San Jose & Silicon Valley.",
  },

  social: {
    instagram: "https://instagram.com/jasonlimrealty",
    linkedin: "https://www.linkedin.com/in/jasonnlim",
    x: "https://x.com/jasonlimrealty",
    googleBusiness: "https://g.page/jasonlimrealty",
  },

  /** Set true + NEXT_PUBLIC_CALENDLY_URL when ready to show the scheduler again. */
  calendlyEnabled: false,
  /** Set NEXT_PUBLIC_CALENDLY_URL in Vercel to your real event link (e.g. https://calendly.com/you/30min). */
  calendly:
    process.env.NEXT_PUBLIC_CALENDLY_URL ??
    "https://calendly.com/jason-lim-compass/consultation",
  googleReviewsUrl: "https://g.page/r/jasonlimrealty/review",

  media: {
    headshot: "/images/jason-lim-headshot.jpg",
    heroPortrait: "/images/jason-lim-hero.jpg",
    ogImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  },

  credentials: [
    "Software Engineer",
    "AI Developer",
    "UC Berkeley Economics",
    "Oregon State Computer Science",
    "Licensed California REALTOR®",
    "Compass Agent",
  ],

  audiences: [
    "First-time home buyers",
    "Move-up buyers",
    "Investors",
    "Bay Area families",
  ],

  strengths: [
    "Technology",
    "Market analytics",
    "Negotiation",
    "Customer service",
  ],

  experience: {
    techYears: "10+",
    focus: [
      "Enterprise software",
      "AI",
      "Automation",
      "Analytics",
    ],
    differentiators: [
      {
        title: "Fresh Perspective",
        description:
          "Unbiased guidance grounded in current market data — not outdated playbooks.",
      },
      {
        title: "Latest Market Knowledge",
        description:
          "Actively tracking Bay Area inventory, pricing, and rate dynamics every week.",
      },
      {
        title: "Technology Advantage",
        description:
          "Custom tools, dashboards, and AI-assisted analysis for clearer decisions.",
      },
      {
        title: "Always Available",
        description:
          "Responsive communication when timing matters most in competitive markets.",
      },
      {
        title: "Personalized Service",
        description:
          "Strategy tailored to your goals, timeline, and risk tolerance.",
      },
      {
        title: "Attention to Detail",
        description:
          "Engineering discipline applied to contracts, inspections, and negotiations.",
      },
    ],
  },

  stats: [
    { label: "Years in Tech", value: "10+" },
    { label: "Bay Area Focus", value: "SV" },
    { label: "Response Time", value: "<2h" },
    { label: "Client-First", value: "100%" },
  ],

  communities: [
    "san-jose",
    "milpitas",
    "fremont",
    "santa-clara",
    "sunnyvale",
    "cupertino",
    "los-gatos",
    "campbell",
    "mountain-view",
    "palo-alto",
    "morgan-hill",
  ] as const,

  navigation: {
    main: [
      { label: "Buy", href: "/buy" },
      { label: "Sell", href: "/sell" },
      { label: "Listings", href: "/listings" },
      { label: "Communities", href: "/communities" },
      { label: "Market Reports", href: "/market-reports" },
      { label: "Resources", href: "/resources" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    footer: [
      {
        title: "Explore",
        links: [
          { label: "Search Homes", href: "/listings" },
          { label: "Buy", href: "/buy" },
          { label: "Sell", href: "/sell" },
          { label: "Communities", href: "/communities" },
          { label: "Market Reports", href: "/market-reports" },
        ],
      },
      {
        title: "Tools",
        links: [
          { label: "Mortgage Calculator", href: "/mortgage-calculator" },
          { label: "Home Valuation", href: "/tools/home-valuation" },
          { label: "Affordability", href: "/tools/affordability" },
          { label: "Rent vs Buy", href: "/tools/rent-vs-buy" },
          { label: "Investment Calculator", href: "/tools/investment" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About Jason", href: "/about" },
          { label: "Testimonials", href: "/testimonials" },
          { label: "Blog", href: "/blog" },
          { label: "FAQ", href: "/faq" },
          { label: "Contact", href: "/contact" },
          { label: "Compass", href: "https://www.compass.com" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Use", href: "/terms" },
        ],
      },
    ],
  },

  cta: {
    consultation: {
      label: "Schedule Consultation",
      href: "/contact",
    },
    valuation: {
      label: "Request Home Valuation",
      href: "/tools/home-valuation",
    },
    search: {
      label: "Search Homes",
      href: "/listings",
    },
    marketReport: {
      label: "See Market Report",
      href: "/market-reports",
    },
    subscribe: {
      label: "Subscribe to Market Updates",
      href: "/contact#newsletter",
    },
  },

  integrations: {
    analytics: {
      gaId: process.env.NEXT_PUBLIC_GA_ID,
      gtmId: process.env.NEXT_PUBLIC_GTM_ID,
      metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
      hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID,
      clarityId: process.env.NEXT_PUBLIC_CLARITY_ID,
    },
    maps: {
      provider: (process.env.NEXT_PUBLIC_MAP_PROVIDER ?? "leaflet") as
        | "google"
        | "mapbox"
        | "leaflet",
      googleMapsKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    },
    mls: {
      provider: process.env.MLS_PROVIDER ?? "mock",
      realtyApiKey: process.env.REALTY_API_KEY,
      realtyApiHost: process.env.REALTY_API_HOST,
    },
    crm: {
      provider: process.env.CRM_PROVIDER,
    },
    newsletter: {
      provider: process.env.NEWSLETTER_PROVIDER,
    },
    email: {
      resendApiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM ?? "Jason Lim <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL ?? "jason.lim@compass.com",
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
export type CommunitySlug = (typeof siteConfig.communities)[number];
