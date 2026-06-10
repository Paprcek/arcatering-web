import { NextResponse } from "next/server";
import { getZohoAccessToken, zohoEnvHeader, zohoBase } from "@/lib/zoho";

interface CatalogItem {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  min: string;
  order: number;
  photo: string;
}

export async function GET() {
  try {
    const token = await getZohoAccessToken();

    // Načti všechny produkty (stránkování po 200 kvůli většímu ceníku)
    const records: Record<string, string>[] = [];
    let from = 1;
    const limit = 200;
    while (true) {
      const url = `${zohoBase()}/report/Products_Report?from=${from}&limit=${limit}`;
      const res = await fetch(url, {
        headers: { Authorization: `Zoho-oauthtoken ${token}`, ...zohoEnvHeader() },
      });
      const data = await res.json();
      const page = data.data ?? [];
      records.push(...page);
      if (page.length < limit) break;
      from += limit;
    }

    // Seskup podle kategorie, jen dostupné, seřaď podle Poradi
    const byCat: Record<string, CatalogItem[]> = {};
    for (const r of records) {
      if (String(r.Dostupne) !== "true") continue;
      const cat = r.Kategorie || "Ostatní";
      (byCat[cat] ??= []).push({
        id: r.ID,
        name: r.Nazev ?? "",
        description: r.Popis ?? "",
        price: parseFloat(r.Cena) || 0,
        unit: r.Jednotka ?? "",
        min: r.Min ?? "",
        order: parseInt(r.Poradi, 10) || 0,
        photo: `/api/product-image?id=${r.ID}`,
      });
    }

    const categories = Object.keys(byCat).map((title) => ({
      title,
      items: byCat[title].sort((a, b) => a.order - b.order),
    }));

    return NextResponse.json({ categories });
  } catch (e) {
    console.error("[products]", e);
    return NextResponse.json({ categories: [], error: true }, { status: 500 });
  }
}
