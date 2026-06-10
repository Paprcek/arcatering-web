// Sdílené helpery pro Zoho Creator API (token cache + env header).

let cachedToken: { token: string; exp: number } | null = null;

export async function getZohoAccessToken(): Promise<string> {
  // vrať z cache, pokud platí ještě aspoň minutu
  if (cachedToken && cachedToken.exp > Date.now() + 60_000) {
    return cachedToken.token;
  }
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
  cachedToken = {
    token: data.access_token,
    exp: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return cachedToken.token;
}

// ZOHO_ENV="development" → píše/čte z dev prostředí; pro produkci prázdné/"production".
export function zohoEnvHeader(): Record<string, string> {
  const env = process.env.ZOHO_ENV;
  if (env && env !== "production") {
    return { environment: env };
  }
  return {};
}

export function zohoBase(): string {
  return `https://creator.zoho.eu/api/v2/${process.env.ZOHO_OWNER}/${process.env.ZOHO_APP}`;
}
