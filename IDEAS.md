# AR Catering — Ideas & Open Items

## 1. Quick quote mode (form-only)

Let users skip the product catalog entirely. Just show the contact form with a notes/comment field where they describe what they need in free text ("raut pro 50 lidi, mix kanapek a finger food, budget cca 15k"). The sales team builds the quote manually.

Good for: users who don't want to browse, repeat clients who just want to fire off a request fast.

## 2. AI quote agent (random/smart order builder)

An AI agent that generates a suggested order based on simple inputs:
- Number of guests
- Event type (raut, meeting, snidane, party...)
- Budget range (optional)
- Dietary requirements

The agent picks items from the catalog, sets reasonable quantities, and pre-fills the cart. User reviews, adjusts, and submits. Could use a simple rules engine first, upgrade to LLM-powered later.

Good for: users who don't know what to pick, decision fatigue reduction, upselling.

---

## 3. Pending data to wire in (AEO audit follow-up)

The AI/AEO audit (https://arcatering-web.vercel.app/) keeps flagging a few items that need **real customer data** rather than code changes. Once these arrive, the updates are small and well-localised — pointers below.

### 3.1 Social profiles → `sameAs`

The current `sameAs` only has `https://www.arcatering.cz` (inferred from the `poptavka@arcatering.cz` email — **needs verification it actually resolves**).

When real profile URLs are known, add them in `src/app/layout.tsx` inside the `jsonLd.@graph[0].sameAs` array:

```ts
sameAs: [
  "https://www.arcatering.cz",
  "https://www.instagram.com/<handle>",
  "https://www.linkedin.com/company/<slug>",
  "https://www.facebook.com/<page>",
  "https://www.google.com/maps/place/...",  // Google Business Profile URL
  "https://www.firmy.cz/detail/<id>",
],
```

The Footer also has placeholder `<a href="#">Instagram</a>` and `<a href="#">LinkedIn</a>` links in `src/components/Footer.tsx` — swap to the real URLs (or remove if not active).

### 3.2 Reviews → `AggregateRating`

The audit wants star ratings in search results. We can't fake these (Google penalises invented `AggregateRating`). Once we have real reviews — for example:
- Google Business Profile rating
- Firmy.cz / Heureka rating
- Internal NPS / collected testimonials

Add to `src/app/layout.tsx` inside the LocalBusiness entity:

```ts
aggregateRating: {
  "@type": "AggregateRating",
  ratingValue: "4.8",     // real average from the source
  reviewCount: "42",       // real count
  bestRating: "5",
  worstRating: "1",
},
review: [
  {
    "@type": "Review",
    author: { "@type": "Person", name: "Jana N." },
    reviewRating: { "@type": "Rating", ratingValue: "5" },
    reviewBody: "Excellent service, ...",
    datePublished: "2026-03-12",
  },
  // ...
],
```

Use only **verifiable** reviews. The source (Google, Firmy.cz) must be linkable.

### 3.3 Real address & geo coordinates

Current placeholder data in `src/data/copy.ts` (footer) and `src/app/layout.tsx` (jsonLd):
- Address: Křížíkova 16, 186 00 Praha 8
- Phone: +420 776 123 456
- Email: poptavka@arcatering.cz
- IČO: 12345678 (footer legal text)
- Geo: `50.0942, 14.4517` (approximate)

When real numbers arrive, update:
- `src/data/copy.ts` → `footer.{addr, legal}`
- `src/app/layout.tsx` → `jsonLd.@graph[0].{telephone, email, address, geo}`
- `public/llms.txt` → contact section
- `public/skill.md` → contact field

For precise geo, open Google Maps → right-click the building → copy lat/lng.

### 3.4 Audit false-positives — **do not chase**

These persist across every audit run regardless of what we change. Don't waste cycles:

- **P1 "CAPTCHA Detected"** — there is no captcha on the site. The auditor's heuristic misfires on our consent checkbox + submit pattern. Confirmed by manual inspection of every form element.
- **P2 autocomplete on guests / date / notes / consent** — HTML spec has no standard `autocomplete` token for "guest count", "event date-time", free-text notes, or a GDPR checkbox. Adding `autocomplete="off"` makes the auditor angrier (it wants positive tokens). Best we can do is leave the attribute off.
- **`<link rel="mcp">` missing** — we don't run an MCP server. Adding a fake link would lie.

### 3.5 Real ceiling for this single-page marketing site

Without expanding scope, the audit will plateau around 60–70. To break through:
- Add a blog or case-studies section (more internal linking, longer content, more pages in sitemap)
- Get and display real reviews (`AggregateRating`)
- Real social profile presence (`sameAs`)

None are urgent unless lead-gen tells us otherwise.

---

## 4. Production-grade pricing tiers

Currently `?p=b2b`, `?p=b2c`, `?p=disc&d=15` are **mocks** — anyone could guess them. For prod, replace with signed/opaque tokens so customers can't forge a 99 % discount link.

Sketch:
- Zoho Creator (or a small Vercel KV table) holds `{ token → { tier, discount, validUntil, recipient } }`
- Link is `/?t=<token>` instead of `?p=...&d=...`
- `src/lib/pricing.ts` resolves `?t=` server-side (KV / DB lookup) and returns the tier
- Existing `PricingConfig` shape stays the same; only the parser changes

Optional: tokens are single-use or rate-limited.

---

## 5. Auto-deploy from GitHub

Currently the Vercel project is linked but **not** tracking the GitHub repo for auto-deploys (`farkas@delame.it` ran `vercel link` locally; the dashboard side isn't connected). Pushes to `main` or `feat/*` don't trigger Vercel builds — they have to be run manually with `vercel --prod`.

To enable: **Vercel Dashboard → arcatering-web → Settings → Git → Connect Git Repository → `delame/arcatering-web`**, then choose which branches get preview vs production.
