# Zoho Creator Integration Guide

## Overview

Two Creator integrations live in this project:

1. **Inbound — Quote submissions.** The quote builder submits a JSON payload to `/api/quote` (Next.js API route at `src/app/api/quote/route.ts`). Currently this is a stub that logs the payload and returns success. This guide explains what's needed from the Zoho side and how to switch to the real integration.
2. **Outbound — Product catalog sync.** Products in `src/data/products.ts` will be sourced from a Creator app over time, including each item's photo URL (`urlPic` field — Cloudinary). See *Product catalog sync* below.

---

## What we need from the Zoho admin

### 1. Zoho Creator form / application

Create a form in Zoho Creator to receive quote requests. Recommended fields:

| Zoho Field         | Type          | Maps to payload                     |
|--------------------|---------------|-------------------------------------|
| Items JSON         | Multi-line    | `items` (stringified JSON array)    |
| Total              | Number        | `total`                             |
| Guests             | Number        | `event.guests`                      |
| Event Date         | Date-Time     | `event.date`                        |
| Notes              | Multi-line    | `event.notes`                       |
| Contact Name       | Single-line   | `contact.name`                      |
| Company            | Single-line   | `contact.company`                   |
| Email              | Email         | `contact.email`                     |
| Phone              | Phone         | `contact.phone`                     |
| Language           | Single-line   | `lang` ("cs" or "en")              |
| Submitted At       | Date-Time     | `ts`                                |

**Alternative:** If the team prefers, the entire payload can go into a single "Raw JSON" multi-line field and be parsed by a Zoho Deluge script.

### 2. Zoho Creator REST API endpoint

We need:
- **Application link name** (e.g. `ar-catering-crm`)
- **Form link name** (e.g. `Quote_Requests`)
- **Account owner name** (e.g. `admin@arcatering.cz`)

The API endpoint will be:
```
https://creator.zoho.eu/api/v2/<owner>/<app>/form/<form>/record
```

### 3. Authentication (OAuth2)

Zoho Creator uses OAuth2. We need:
- **Client ID** and **Client Secret** from Zoho API Console (https://api-console.zoho.eu/)
- **Refresh Token** (generated once via OAuth flow with scope `ZohoCreator.form.CREATE`)

The refresh token is long-lived. Our API route will exchange it for a short-lived access token when submitting.

### 4. Email notification workflow

Set up in Zoho Creator (no code needed on our side):
1. Go to the form > Workflows > On Create
2. Add action: Send Email
3. To: `poptavka@arcatering.cz`
4. Subject: `Nova poptavka od {{Contact_Name}} ({{Company}})`
5. Body: include all fields

---

## How to switch to production

### Step 1: Add environment variables in Vercel

Go to **Vercel Dashboard > arcatering-web > Settings > Environment Variables** and add:

```
ZOHO_CREATOR_API_BASE=https://creator.zoho.eu/api/v2
ZOHO_OWNER=admin@arcatering.cz
ZOHO_APP=ar-catering-crm
ZOHO_FORM=Quote_Requests
ZOHO_CLIENT_ID=1000.XXXXXXXXXXXX
ZOHO_CLIENT_SECRET=xxxxxxxxxxxxxxxx
ZOHO_REFRESH_TOKEN=1000.xxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxx
```

Set these for **Production** environment (and Preview if you want to test).

### Step 2: Update the API route

Replace `src/app/api/quote/route.ts` with:

```typescript
import { NextResponse } from "next/server";

async function getAccessToken(): Promise<string> {
  const res = await fetch("https://accounts.zoho.eu/oauth/v2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.ZOHO_CLIENT_ID!,
      client_secret: process.env.ZOHO_CLIENT_SECRET!,
      refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("Zoho OAuth failed: " + JSON.stringify(data));
  return data.access_token;
}

export async function POST(request: Request) {
  const payload = await request.json();

  try {
    const token = await getAccessToken();

    const zohoPayload = {
      data: {
        Items_JSON: JSON.stringify(payload.items),
        Total: payload.total,
        Guests: payload.event.guests,
        Event_Date: payload.event.date,
        Notes: payload.event.notes,
        Contact_Name: payload.contact.name,
        Company: payload.contact.company,
        Email: payload.contact.email,
        Phone: payload.contact.phone,
        Language: payload.lang,
        Submitted_At: payload.ts,
      },
    };

    const base = process.env.ZOHO_CREATOR_API_BASE;
    const owner = process.env.ZOHO_OWNER;
    const app = process.env.ZOHO_APP;
    const form = process.env.ZOHO_FORM;

    const zohoRes = await fetch(`${base}/${owner}/${app}/form/${form}/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Zoho-oauthtoken ${token}`,
      },
      body: JSON.stringify(zohoPayload),
    });

    if (!zohoRes.ok) {
      const err = await zohoRes.text();
      console.error("[Zoho error]", zohoRes.status, err);
      return NextResponse.json({ ok: false }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[Quote submit error]", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
```

### Step 3: Deploy

```bash
npx vercel --prod
```

Or just push to `main` — if you connect the GitHub repo in Vercel dashboard, it auto-deploys.

---

## Payload shape (reference)

This is what the frontend sends to `/api/quote`:

```json
{
  "items": [
    { "id": "k1", "name": "Chlebicek s lososovou penou", "qty": 24, "price": 49, "basePrice": 49, "unit": "ks" },
    { "id": "f3", "name": "Krevety v parmske sunce", "qty": 12, "price": 79, "basePrice": 79, "unit": "ks" }
  ],
  "total": 2124,
  "pricing": { "tier": "b2b", "discount": 0 },
  "event": {
    "guests": 30,
    "date": "2026-05-15T17:30",
    "notes": "Raut na stojaka, 2 hoste s alergii na orechy"
  },
  "contact": {
    "name": "Jana Novakova",
    "company": "Acme s.r.o.",
    "email": "jana@acme.cz",
    "phone": "+420 777 123 456"
  },
  "lang": "cs",
  "ts": "2026-04-28T21:00:00.000Z"
}
```

### Pricing tier (payload)

The `pricing` object reflects the **link tier** the customer used:

- `tier: "none"` — public web view, no prices were shown. `total` is `null`, `items[].price` is `null`. Treat the request as a free-form enquiry.
- `tier: "b2b"` — prices excl. VAT (current standard).
- `tier: "b2c"` — prices were shown without any VAT mention (consumer view).
- `tier: "disc"` — `discount` is the percentage off; `items[].price` is what the customer saw, `items[].basePrice` is the original catalog price for the same item.

Recommended Creator fields to add: `Pricing_Tier` (single-line) and `Discount_Pct` (number).

---

## Product catalog sync (outbound)

The frontend reads products from `src/data/products.ts` today (a static TypeScript export). Migration target is a Creator app whose **Products** form populates this file (build-time fetch) or a future `/api/products` endpoint.

### Recommended Creator product fields

| Zoho Field         | Type         | Maps to TypeScript                          |
|--------------------|--------------|---------------------------------------------|
| ID                 | Single-line  | `id` (stable, used as React key)            |
| Name CS            | Single-line  | `name` (when lang=cs)                       |
| Name EN            | Single-line  | `name` (when lang=en)                       |
| Category           | Single-select| → maps to a `Category.id` in products.ts    |
| Price              | Number       | `price` (CZK)                               |
| Unit               | Single-line  | `unit` (`ks`, `porce`, `os`, `hod`, `akce`) |
| Min                | Number       | `min` (minimum order quantity)              |
| Tags               | Multi-select | `tags[]` (`veg`, `vegan`, `ryba`, `bezlepkové`) |
| **urlPic**         | **URL**      | `urlPic` (Cloudinary CDN URL)               |
| Active             | Boolean      | filter out when false                       |

### Cloudinary upload pipeline

1. In the Creator product form, attach an image upload control (any name) and a Deluge workflow on save.
2. Workflow uploads the file to Cloudinary using a [signed upload preset](https://cloudinary.com/documentation/upload_presets) — recommended preset config:
   - `folder`: `arcatering/products`
   - `eager`: `f_auto,q_auto,c_fill,g_auto,w_500,h_375` (transformations baked in once)
   - `unique_filename`: `true`
   - `overwrite`: `false`
3. Cloudinary's response includes `secure_url` (the `https://res.cloudinary.com/...` URL). The Deluge step writes that into the **urlPic** field.
4. Frontend (`QuoteBuilder.tsx` / `Image src={item.urlPic ?? item.photo}`) picks it up automatically.

`next.config.ts` already whitelists `res.cloudinary.com` under `images.remotePatterns`, so `next/image` will optimize and CDN-cache the URL on Vercel's edge.

### Creator → static products.ts (build-time)

For now (v1) the simplest path is a periodic export from Creator:

1. Schedule a Creator script (Deluge cron) that produces a JSON dump of all active products
2. Push to a known location (Creator file URL, S3, or commit to repo)
3. A Vercel build hook regenerates `src/data/products.ts` from the JSON before each build

For a fully dynamic catalog (no rebuild on product change), add `src/app/api/products/route.ts` that proxies the Creator REST API and have `page.tsx` fetch it server-side. Cache aggressively (e.g. `revalidate: 3600`).

---

## Testing checklist

- [ ] Zoho Creator form created with all fields
- [ ] OAuth2 client registered in Zoho API Console
- [ ] Refresh token generated (scope: `ZohoCreator.form.CREATE`)
- [ ] Environment variables set in Vercel
- [ ] API route updated (copy from Step 2 above)
- [ ] Submit a test quote from the live site
- [ ] Verify record appears in Zoho Creator
- [ ] Verify email notification sent to `poptavka@arcatering.cz`
- [ ] Test error handling (bad token, Zoho down)

---

## Zoho regions

If the account is NOT on `.eu`, change the URLs:
- EU: `zoho.eu` / `accounts.zoho.eu`
- US: `zoho.com` / `accounts.zoho.com`
- IN: `zoho.in` / `accounts.zoho.in`
- AU: `zoho.com.au` / `accounts.zoho.com.au`
