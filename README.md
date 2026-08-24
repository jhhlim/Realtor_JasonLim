# Jason Lim — Bay Area Real Estate

Premium Silicon Valley REALTOR® website built with Next.js 15.

**Tagline:** Helping Bay Area families make confident real estate decisions.  
**Differentiator:** AI-powered real estate insights · Technology + Data + Personal Service.

Live-ready architecture for MLS IDX, maps, CRM, newsletters, analytics, and AI tools — with honest positioning around a technology-first agent background (software engineering, AI, UC Berkeley Economics, Oregon State CS, California REALTOR®).

**Private CRM:** See [docs/CRM.md](docs/CRM.md) — `/admin` (Supabase Auth).

## Stack

- **Next.js 15** (App Router) · React 19 · TypeScript
- **Tailwind CSS v4** · shadcn/ui · Framer Motion · Lucide
- **Leaflet** maps (Google Maps / Mapbox ready via env)
- **Zod** validation · dark/light mode · SEO (metadata, sitemap, robots, JSON-LD)
- Vercel deployment ready

## Quick start

```bash
git clone https://github.com/jhhlim/Realtor_JasonLim.git
cd Realtor_JasonLim
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command        | Description                |
|----------------|----------------------------|
| `npm run dev`  | Turbopack development      |
| `npm run build`| Production build           |
| `npm start`    | Serve production build     |
| `npm run lint` | ESLint                     |

## Configuration

All personal branding lives in **`src/config/site.ts`**:

- Name, tagline, bio credentials, DRE license
- Phone, email, SMS, address placeholders
- Social links, Calendly, Google Reviews
- Headshot / hero / OG image URLs
- Navigation and CTAs
- Community slugs (San Jose → Morgan Hill)

Integration stubs: **`src/config/integrations.ts`**.  
Environment template: **`.env.example`**.

## Architecture

```
src/
  app/                 # App Router pages + API routes
  components/          # UI, layout, home, listings, map, seo
  features/            # Domain UI (mortgage, tools, contact, blog)
  services/            # ListingProvider, CRM, newsletter, maps, AI
  data/                # Mock listings, neighborhoods, blog, testimonials
  config/              # site.ts + integrations
  lib/                 # format, mortgage math, SEO, schema
  hooks/ types/
```

### MLS abstraction

`getListingProvider()` in `src/services/listings/` selects a provider from `MLS_PROVIDER`:

| Id          | Purpose                          |
|-------------|----------------------------------|
| `mock`      | Local mock data (default)        |
| `realtyapi` | RealtyAPI example integration    |
| `bridge`    | Bridge Interactive stub          |
| `idx`       | IDX stub                         |
| `mls-grid`  | MLS Grid stub                    |
| `simplyrets`| SimplyRETS stub                  |
| `trestle`   | Trestle stub                     |
| `estated`   | Estated stub                     |
| `reso`      | RESO Web API stub                |

Interfaces: `ListingProvider`, `SearchService`, `NeighborhoodService`, `PropertyDetailsService`.

No Zillow/Redfin scraping — adapters consume licensed APIs only.

### Key pages

Home · About · Buy · Sell · Listings · Property details · Communities (11 cities) · Market reports · Mortgage calculator · Tools (valuation, affordability, rent vs buy, investment, AI stubs) · Blog · FAQ · Testimonials · Contact · Privacy · Terms · Resources

### API routes

- `GET /api/listings/search` — filtered search
- `POST /api/contact` — lead capture (Resend-ready)
- `POST /api/newsletter` — subscription stub

## Deploy on Vercel

1. Push this repo to GitHub (`jhhlim/Realtor_JasonLim`).
2. Import the project in [Vercel](https://vercel.com/new).
3. Set `NEXT_PUBLIC_SITE_URL` and any integration secrets.
4. Deploy. Preview URLs work with ISR-friendly App Router pages.

```bash
npx vercel
```

## Branding notes

- Clean, premium, Silicon Valley aesthetic (inspired by top agent sites — not a copy).
- White backgrounds, subtle gradients, rounded cards, Fraunces + Plus Jakarta Sans.
- Experience framing emphasizes **fresh perspective**, market knowledge, and **technology advantage** rather than inflated sales tenure.

## License

Private / all rights reserved — Jason Lim.
