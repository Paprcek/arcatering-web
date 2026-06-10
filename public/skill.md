---
name: ar-catering
display_name: AR Catering — request a corporate catering quote
description: Submit a non-binding catering enquiry to AR Catering (Prague & surroundings). Returns within an hour during office hours.
version: 1.0.0
language: cs, en
contact: poptavka@arcatering.cz
---

# AR Catering — Quote Request Skill

This skill lets an AI agent submit a corporate catering enquiry to AR Catering on behalf of a user. AR Catering is a Prague-based family caterer (since 2008) serving trainings, meetings, client visits, company parties and other corporate events in Prague and the surrounding region.

## When to use

The user is planning a corporate event in Prague or surroundings and wants to request a catering quote. Typical signals: number of guests, event date, type of food (canapés, finger food, hot dishes, salads, desserts, drinks), allergens or dietary requirements (vegetarian, vegan, fish, gluten-free), delivery location.

## How it works

1. Browse the public catalog at `https://arcatering-web.vercel.app/`. Categories are: chlebíčky a kanapky, studené finger food, bagety/croissanty/wrapy, teplé pokrmy, saláty a misky, mini dezerty, nápoje, servis a vybavení.
2. Build a list of items with quantities. Respect each item's `min` (minimum order quantity).
3. Collect contact details (name, email required; company and phone optional).
4. POST a JSON payload to `/api/quote`.

## Endpoint

```
POST https://arcatering-web.vercel.app/api/quote
Content-Type: application/json
```

### Request body

```jsonc
{
  "items": [
    { "id": "k1", "name": "Chlebíček s lososovou pěnou a limetkou", "qty": 24, "price": null, "basePrice": null, "unit": "ks" }
  ],
  "total": null,
  "pricing": { "tier": "none", "discount": 0 },
  "event": {
    "guests": "30",
    "date": "2026-06-12T17:00",
    "notes": "Standing reception, 2 guests with nut allergy"
  },
  "contact": {
    "name": "Jana Nováková",
    "company": "Acme s.r.o.",
    "email": "jana@acme.cz",
    "phone": "+420 777 123 456"
  },
  "lang": "cs",
  "ts": "2026-06-01T09:00:00.000Z"
}
```

When the agent is using the public site (no `?p=` query param), `pricing.tier` should be `"none"` and `total` and per-item `price` should be `null`. The catering team will produce a priced proposal in their reply.

### Response

```json
{ "ok": true, "message": "Quote received" }
```

A response with `ok: false` (5xx) means the submission failed; retry with exponential backoff or fall back to emailing `poptavka@arcatering.cz`.

## Constraints

- Office hours for human reply: Mon–Fri 8:00–17:00 CET.
- Standard delivery area: Prague + 25 km. Further on request.
- Minimum order quantities are enforced per item — see each item's `min` field in the catalog.
- Free-form requests not in the catalog (custom desserts, alcohol, branded items) are welcome — describe them in `event.notes`.

## Privacy

Personal data is processed only for the purpose of fulfilling the enquiry. The agent must obtain user consent before submitting (the `consent` checkbox on the website serves the same purpose).
