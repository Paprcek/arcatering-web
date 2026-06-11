import { NextResponse } from "next/server";
import { getZohoAccessToken, zohoEnvHeader, zohoBase } from "@/lib/zoho";

// Multi-select z Creatoru může přijít jako pole nebo čárkami oddělený string – sjednotíme na pole.
function toList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  if (typeof v === "string") return v.split(",").map((x) => x.trim()).filter(Boolean);
  return [];
}

// id kategorie ze sentence-case názvu (stabilní klíč pro frontend)
function slug(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface CatalogItem {
  id: string;
  photo: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  min: string;
  tags: string[];
  allergens: string[];
  order: number;
}

export async function GET() {
  try {
    const token = await getZohoAccessToken();

    // Načti všechny produkty (stránkování po 200 kvůli většímu ceníku)
    const records: Record<string, unknown>[] = [];
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
      const cat = (r.Kategorie as string) || "Ostatní";
      (byCat[cat] ??= []).push({
        id: String(r.ID),
        photo: `/api/product-image/${r.ID}`,
        name: (r.Nazev as string) ?? "",
        description: (r.Popis as string) ?? "",
        price: parseFloat(r.Cena as string) || 0,
        unit: (r.Jednotka as string) ?? "",
        min: (r.Min as string) ?? "",
        tags: toList(r.Tagy),
        allergens: toList(r.Alergeny),
        order: parseInt(r.Poradi as string, 10) || 0,
      });
    }

    const categories = Object.keys(byCat).map((title) => ({
      id: slug(title),
      title,
      subtitle: "",
      items: byCat[title].sort((a, b) => a.order - b.order),
    }));

    return NextResponse.json({ categories });
  } catch (e) {
    console.error("[products]", e);
    return NextResponse.json({ categories: [], error: true }, { status: 500 });
  }
}
