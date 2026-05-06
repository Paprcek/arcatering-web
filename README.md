# AR Catering — Web

Marketing & lead-capture site for **AR Catering** (rodinný catering pro firemní akce v Praze a okolí, od 2008). Single-page Next.js 16 (App Router, Turbopack), deployed on Vercel.

- **Production**: https://arcatering-web.vercel.app
- **Repo**: https://github.com/delame/arcatering-web
- **Vercel project**: `arcatering-web` (org `kris-projects-0a58ffb7`)

## Stack

- **Next.js 16** (App Router, Turbopack) — see `node_modules/next/dist/docs/` for the version-specific docs (this build has breaking changes vs. older Next, read the relevant guide before editing).
- **TypeScript**, strict mode
- **CSS**: hand-rolled in `src/app/globals.css` — no Tailwind, no CSS-in-JS
- **next/image** with Cloudinary remote pattern (see *Images* below)
- **Vercel** for hosting + edge CDN

## Local dev

```bash
npm install
npm run dev
# → http://localhost:3000
```

The dev server hot-reloads on save. There is no other build step.

## Project layout

```
src/
  app/
    layout.tsx        # <html>, metadata, JSON-LD, fonts
    page.tsx          # routes ?p= / ?d= → pricing tier
    globals.css       # all styles
    sitemap.ts        # auto-generated sitemap.xml
    api/quote/        # POST endpoint for quote submissions (stub today)
  components/
    Hero, WhyUs, HowItWorks, References, FooterCTA, Footer
    Nav, Icon
    QuoteBuilder.tsx  # the catalog + cart + form
  data/
    copy.ts           # all marketing copy (CS + EN)
    products.ts       # the catalog (8 categories)
  lib/
    pricing.ts        # pricing-tier helpers (see below)
public/
  robots.txt          # allow all + sitemap pointer
  llms.txt            # CS+EN site summary for AI crawlers
  images/             # static images (logo, food/*)
```

## Pricing tiers via private link

Prices are **never shown on the public web**. They unlock only when a private link carries a `?p=` query param:

| URL                       | Tier   | Behavior                                                            |
|---------------------------|--------|---------------------------------------------------------------------|
| `/`                       | `none` | No prices, no totals. Submit CTA = "Send enquiry."                  |
| `/?p=b2b`                 | `b2b`  | Prices shown excl. VAT, "Bez DPH" notes everywhere. Default for B2B. |
| `/?p=b2c`                 | `b2c`  | Prices shown, **zero** mention of VAT (consumer-facing).            |
| `/?p=disc&d=15`           | `disc` | Each price reduced by 15 % with original struck through. No VAT.    |

A small banner at the very top identifies which tier is active so the recipient knows what they're seeing.

**Production note (mock today):** the tier is parsed from a query param. For prod we should replace it with a signed/opaque token so customers can't guess `?p=disc&d=99` — see `src/lib/pricing.ts`. The Creator/Zoho side mints links; the API resolves token → `{ tier, discount }` server-side.

## Images & Cloudinary

Each product (`src/data/products.ts`) has:
- `photo` — fallback static path (`/images/food/*.jpg`)
- `urlPic?` — **Cloudinary URL** synced from the Zoho Creator field of the same name; takes precedence when present

`next.config.ts` allows `res.cloudinary.com` under `images.remotePatterns`, so `next/image` optimises Cloudinary URLs further (caching them on Vercel's edge).

**Recommended Cloudinary URL transformations** (apply once at upload time, then `next/image` won't re-transform):

```
https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,c_fill,g_auto,w_500,h_375/<public_id>.jpg
```

- `f_auto,q_auto` — automatic format (AVIF/WebP) and quality
- `c_fill,g_auto` — smart-crop on the food
- `w_500,h_375` — 4:3 frame matching the catalog tiles

If `urlPic` is empty, the local fallback in `photo` is used.

## SEO / AEO

The site ships with the basics for both classic SEO and AI-agent optimisation:

| File / element             | Where                              | Purpose                                                  |
|----------------------------|------------------------------------|----------------------------------------------------------|
| `public/robots.txt`        | served at `/robots.txt`            | Allow all + sitemap pointer                              |
| `public/llms.txt`          | served at `/llms.txt`              | CS+EN site summary for AI crawlers                       |
| `src/app/sitemap.ts`       | served at `/sitemap.xml`           | Auto-generated; only `/` for now (single page)           |
| JSON-LD `@graph`           | inline in `<body>` via `layout.tsx`| LocalBusiness + FoodEstablishment + Service + WebSite    |
| Open Graph + Twitter card  | `metadata` in `layout.tsx`         | Real og:image, locale `cs_CZ`                            |
| `metadataBase`             | `layout.tsx`                       | Resolves all relative URLs to the absolute domain        |
| Form `id`/`htmlFor`/`autocomplete` | `QuoteBuilder.tsx`         | Agentic form-filling friendly                            |
| Descriptive `alt` text     | `Hero.tsx`, `QuoteBuilder.tsx`     | Accessibility + image search                             |

When real address/phone/email/IČO arrive, update `src/data/copy.ts` (`footer.*`) and `src/app/layout.tsx` (`jsonLd` literal — search for `telephone`, `email`, `address`).

## Deployment

The repo is **not** auto-deploying from GitHub yet. Deploys are manual via the Vercel CLI:

```bash
# preview build (per-deploy URL, doesn't touch production)
vercel deploy --yes

# promote to production (https://arcatering-web.vercel.app)
vercel deploy --prod --yes
```

To enable Git-based auto-deploy, link the repo in **Vercel Dashboard → arcatering-web → Settings → Git → Connect Git Repository**.

## Branch workflow

- `main` — last shipped state
- `feat/pricing-tiers` — current working branch with all the recent UX/SEO changes; production currently runs from this branch's HEAD via `vercel --prod`. Merge to `main` and delete when ready.

## Quote submission

Currently `POST /api/quote` is a stub that logs and returns `{ ok: true }`. To wire it to Zoho Creator, follow [`ZOHO_INTEGRATION.md`](./ZOHO_INTEGRATION.md). The payload now also includes the active pricing tier:

```jsonc
{
  "items": [{ "id": "k1", "qty": 12, "price": 49, "basePrice": 49, "unit": "ks" }],
  "total": 588,
  "pricing": { "tier": "b2b", "discount": 0 },
  "event": { /* … */ },
  "contact": { /* … */ },
  "lang": "cs",
  "ts": "2026-05-06T17:52:00.000Z"
}
```

`price` is the value the customer saw (after any discount); `basePrice` is the catalog price before tier adjustments. `total` is `null` when the public/no-price view is active.

## Future ideas

See [`IDEAS.md`](./IDEAS.md) — quick-quote mode (form-only), AI quote agent that pre-fills the cart from a brief.
