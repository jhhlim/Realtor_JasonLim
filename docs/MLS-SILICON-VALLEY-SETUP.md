# Silicon Valley MLS inventory (MLSListings IDX)

The free SimplyRETS credentials (`simplyrets` / `simplyrets`) are **sample market data**, not Bay Area live MLS.

Live Silicon Valley / Peninsula / Monterey Bay inventory comes from **MLSListings**. Agents usually cannot get a raw RESO Web API feed directly — MLSListings issues IDX feeds to **approved vendors** after **broker (Compass) written authorization**.

## What to do (Compass agent)

1. Email your Compass Market Center admin / tech support (and CC your broker of record).
2. Ask them to approve IDX for `jasonlimrealty.com` and either:
   - Connect you through Compass’s preferred IDX vendor, **or**
   - Authorize SimplyRETS / Bridge / another MLSListings-approved vendor for your domain.
3. When credentials arrive, set Vercel env:

```bash
MLS_PROVIDER=simplyrets   # or bridge, once that adapter is configured
SIMPLYRETS_USERNAME=<production username from vendor>
SIMPLYRETS_PASSWORD=<production password from vendor>
# If RESO goes to Bridge instead:
# MLS_PROVIDER=bridge
# BRIDGE_SERVER_TOKEN=...
# BRIDGE_CLIENT_ID=...
# BRIDGE_CLIENT_SECRET=...
```

4. Redeploy. Listing cards already show **Listing agent (MLS)** so third-party listings are not attributed to Jason.

## Copy/paste email

**To:** your Compass admin / IDX support  
**Subject:** IDX feed for jasonlimrealty.com (MLSListings)

```
Hi,

I need live MLSListings IDX inventory on my custom site jasonlimrealty.com
(Next.js / Vercel), with listing agent + office attribution on every card.

Please advise the Compass-approved path for Silicon Valley IDX:
1) Broker authorization form for Jason Lim, DRE #02444964, Compass
2) Approved vendor (SimplyRETS, Bridge, Compass IDX, etc.)
3) RESO Web API or RETS credentials / next steps for domain jasonlimrealty.com

Coverage needed: Santa Clara County / Silicon Valley active + pending
(and sold if included in standard IDX).

Thank you,
Jason Lim
REALTOR® | Compass | DRE #02444964
(510) 480-7191
jason.lim@compass.com
https://jasonlimrealty.com
```

## Interim options

Until IDX is approved, the site can keep SimplyRETS demo data (not SV) or stay empty with a contact CTA. Do **not** scrape Zillow/Redfin/Compass public pages for production IDX — that violates MLS rules and site terms.
