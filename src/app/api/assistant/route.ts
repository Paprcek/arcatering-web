import { NextResponse } from "next/server";

// Tenký proxy na Catalyst fn-inquiry-receiver – klíč/URL zůstávají na serveru.
export async function POST(request: Request) {
  try {
    const payload = await request.json(); // { inquiry_text, catalog }

    const url = process.env.ORDERAI_ASSISTANT_URL;
    if (!url) {
      console.error("[assistant] ORDERAI_ASSISTANT_URL is not set");
      return NextResponse.json({ error: "not_configured" }, { status: 500 });
    }

    console.log("[assistant] request", {
      inquiry_text: payload.inquiry_text,
      catalog_size: Array.isArray(payload.catalog) ? payload.catalog.length : "n/a",
    });

    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await upstream.json();

    console.log("[assistant] response", {
      status: upstream.status,
      matched: data.matched_items?.length ?? "n/a",
      unmatched: data.unmatched_items?.length ?? "n/a",
      raw: JSON.stringify(data).slice(0, 500),
    });

    return NextResponse.json(data, { status: upstream.status });
  } catch (e) {
    console.error("[assistant] error", e);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
