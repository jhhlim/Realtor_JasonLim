/**
 * Single source of truth for personal & site branding.
 * Update placeholders here — they propagate across the site.
 */
export const siteConfig = {
  name: "Jason Lim",
  /** Simplified Chinese name (林辉鸿). */
  nameZhCN: "林辉鸿",
  /** Traditional Chinese name (林輝鴻). */
  nameZhTW: "林輝鴻",
  legalName: "Jason Lim | Compass",
  tagline: "Helping Bay Area families make confident real estate decisions.",
  secondaryTagline: "AI-powered real estate insights.",
  differentiator: "Technology + Data + Personal Service.",
  title: "Compass REALTOR® | Bay Area Real Estate",
  description:
    "Bay Area native and South Bay homeowner. Compass REALTOR® helping buyers and sellers across San Jose and Silicon Valley with clear advice, local market knowledge, and responsive service.",
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
    agentProfileUrl: "https://www.compass.com/agents/jason-lim/",
    tagline: "Official Compass agent serving San Jose & Silicon Valley.",
  },

  social: {
    linkedin: "https://www.linkedin.com/in/jasonnlim",
    x: "https://x.com/jasonlimrealty",
    instagram: "https://www.instagram.com/jasonlimrealty/",
    youtube: "https://www.youtube.com/watch?v=GQ-jtpjEFTc",
  },

  /**
   * Seller value-add services featured on /sell#seller-toolkit.
   * Keep claims grounded — no invented credentials or guarantees.
   */
  sellerToolkit: {
    youtubeVideoId: "GQ-jtpjEFTc",
    youtubeTitle: "Jason Lim | Compass — seller marketing & local expertise",
    services: [
      {
        id: "marketing-video",
        title: "Marketing & YouTube video",
        description:
          "Listing marketing that goes beyond photos — including video content for YouTube and social so more buyers discover your home before they tour.",
      },
      {
        id: "listing-website",
        title: "Listing website design",
        description:
          "Custom listing sites built with modern AI and MCP workflows — a polished online home for your property that can sit alongside MLS / IDX-style inventory.",
      },
      {
        id: "staging-furniture",
        title: "Custom furniture & staging rental",
        description:
          "Access to unique custom furniture and staging rental options so rooms feel intentional — not generic — when buyers walk through.",
      },
      {
        id: "contractors",
        title: "Contractor recommendations",
        description:
          "Trusted referrals for painters, handypeople, and specialty trades when prep work needs the right crew before you list.",
      },
      {
        id: "landscaping-handyman",
        title: "Landscaping & handyman help",
        description:
          "Background in landscaping plus hands-on experience with minor to moderate handyman fixes — practical guidance (and help where it fits) to tighten curb appeal and punch-list items.",
      },
    ],
  },

  /** Set true + NEXT_PUBLIC_CALENDLY_URL when ready to show the scheduler again. */
  calendlyEnabled: false,
  /** Set NEXT_PUBLIC_CALENDLY_URL in Vercel to your real event link (e.g. https://calendly.com/you/30min). */
  calendly:
    process.env.NEXT_PUBLIC_CALENDLY_URL ??
    "https://calendly.com/jason-lim-compass/consultation",
  googleReviewsUrl: "https://g.page/r/jasonlimrealty/review",

  /**
   * Headshot on homepage + About. Default on; set
   * NEXT_PUBLIC_SHOW_AGENT_PHOTOS=false to hide.
   */
  showAgentPhotos: process.env.NEXT_PUBLIC_SHOW_AGENT_PHOTOS !== "false",

  media: {
    headshot: "/images/jason-lim-portrait.webp",
    heroPortrait: "/images/jason-lim-portrait.webp",
    ogImage: "/images/jason-lim-portrait.jpg",
  },

  credentials: [
    "San Jose homeowner",
    "33+ years lived in the Bay Area",
    "Lived in 5+ Bay Area cities",
    "Local high school & college graduate",
    "11+ years software & hardware",
    "5+ years across finance, insurance, real estate & more",
    "Hands-on / handyman experience",
    "Project-manager approach for buying & listing",
    "High-quality, detail-driven service",
    "Licensed California REALTOR® · Compass",
  ],

  audiences: [
    "First-time home buyers",
    "Move-up buyers",
    "Sellers",
    "Investors",
    "Bay Area families",
  ],

  strengths: [
    "True local knowledge — homeowner & Bay Area native",
    "Project-manager execution for buy & list",
    "Hands-on problem solving",
    "High-quality, responsive service",
  ],

  experience: {
    techYears: "11+",
    financeInsuranceYears: "3+",
    educationYears: "1+",
    governmentYears: "1+",
    industriesLabel: "Finance, insurance, education & government",
    focus: [
      "Software & hardware",
      "Enterprise software",
      "AI",
      "Automation",
      "Analytics",
      "Finance & insurance",
      "Education",
      "Government",
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
    { label: "Years in the Bay Area", value: "33+" },
    { label: "Bay Area Cities Lived", value: "5+" },
    { label: "San Jose Homeowner", value: "Local" },
    { label: "Software & Hardware", value: "11+" },
    { label: "Finance · Insurance · RE", value: "5+" },
    { label: "Buy & List Project Lead", value: "PM" },
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
      {
        label: "Buy",
        href: "/buy",
        children: [
          { label: "Buyer process", href: "/buy" },
          { label: "Disclosure Review", href: "/disclosure-review" },
        ],
      },
      { label: "Sell", href: "/sell" },
      { label: "Listings", href: "/listings" },
      { label: "Communities", href: "/communities" },
      { label: "Reports", href: "/market-reports" },
      { label: "Insights", href: "/blog" },
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
          { label: "Disclosure Review", href: "/disclosure-review" },
          { label: "Sell", href: "/sell" },
          { label: "Seller toolkit", href: "/sell#seller-toolkit" },
          { label: "Listing support", href: "/sell#listing-support" },
          { label: "Communities", href: "/communities" },
          { label: "Market Reports", href: "/market-reports" },
        ],
      },
      {
        title: "Tools",
        links: [
          { label: "Mortgage Calculator", href: "/mortgage-calculator" },
          { label: "Oil / Gold / Indexes", href: "/tools/markets" },
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
          { label: "Insights", href: "/blog" },
          { label: "FAQ", href: "/faq" },
          { label: "Contact", href: "/contact" },
          { label: "Compass", href: "https://www.compass.com/agents/jason-lim/" },
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
      label: "Request a Personalized Home Valuation",
      href: "/tools/home-valuation",
    },
    search: {
      label: "Search Homes",
      href: "/listings",
    },
    marketReport: {
      label: "See Market Report",
      href: "/market-reports/scc-detached-homes-november-22-2026",
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
