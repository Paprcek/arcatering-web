import { NextResponse } from "next/server";

// Frontend posílá ISO ("2026-05-15T17:30" nebo "...Z"), Creator vyžaduje "dd-MMM-yyyy HH:mm:ss".
// Parsujeme komponenty přímo ze stringu (bez TZ konverze), ať se zachová zadaný čas.
function toCreatorDateTime(iso?: string): string {
  if (!iso) return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [, y, mo, d, hh, mm, ss] = m;
  return `${d}-${months[parseInt(mo, 10) - 1]}-${y} ${hh}:${mm}:${ss ?? "00"}`;
}

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
  if (!data.access_token) {
    throw new Error("Zoho OAuth failed: " + JSON.stringify(data));
  }
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const token = await getAccessToken();

    const zohoData = {
      Items_JSON: JSON.stringify(payload.items ?? []),
      Total: payload.total ?? 0,
      Guests: payload.event?.guests ?? 0,
      Event_Date: toCreatorDateTime(payload.event?.date),
      Notes: payload.event?.notes ?? "",
      Contact_Name: payload.contact?.name ?? "",
      Company: payload.contact?.company ?? "",
      Email: payload.contact?.email ?? "",
      Phone_Number: payload.contact?.phone ?? "",
      Language: payload.lang ?? "cs",
      Submitted_At: toCreatorDateTime(payload.ts),
    };

    const owner = process.env.ZOHO_OWNER;
    const app = process.env.ZOHO_APP;
    const form = process.env.ZOHO_FORM;
    const url = `https://creator.zoho.eu/api/v2/${owner}/${app}/form/${form}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Zoho-oauthtoken ${token}`,
    };
    // ZOHO_ENV="development" → zapisuje do dev prostředí. Pro produkci nech prázdné/"production".
    if (process.env.ZOHO_ENV && process.env.ZOHO_ENV !== "production") {
      headers["environment"] = process.env.ZOHO_ENV;
    }

    const zohoRes = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ data: zohoData }),
    });
    const result = await zohoRes.json();

    if (result.code === 3000) {
      return NextResponse.json({ ok: true, id: result.data?.ID });
    }

    console.error("[Zoho error]", zohoRes.status, JSON.stringify(result));
    return NextResponse.json({ ok: false, error: result }, { status: 502 });
  } catch (e) {
    console.error("[Quote submit error]", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
