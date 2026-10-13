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

export interface CatalogItem {
  id: string;
  photo: string;
  urlPic?: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  min: number;
  tags: string[];
  allergens: string[];
  order: number;
}

// Kvóta Creator API je omezená a počítá se na každé volání. Katalog proto čteme
// z Creatoru max. jednou za 6 hodin, ne při každé návštěvě webu:
//  - CDN (Vercel) drží odpověď přes s-maxage, návštěvníci se do funkce vůbec nedostanou
//  - paměť instance drží poslední dobrou odpověď (použije se i když Creator selže)
const FRESH_MS = 6 * 60 * 60 * 1000;

export interface CatalogCategory {
  id: string;
  title: string;
  subtitle: string;
  items: CatalogItem[];
}

let cache: { categories: CatalogCategory[]; exp: number } | null = null;

// Teplé pokrmy se objednávají minimálně po 3 porcích (požadavek Richarda 2026-10-13).
const HOT_FOOD_CATEGORIES = ["Teplé pokrmy", "Vegetariánské teplé pokrmy"];
const HOT_FOOD_MIN = 3;

// Minimální množství položky: pole Min z Creatoru (číslo, příp. text typu "5ks"),
// když chybí, u teplých pokrmů 3, jinak 1.
export function minQty(rawMin: unknown, category: string): number {
  const n = parseInt(String(rawMin ?? ""), 10);
  if (n > 0) return n;
  return HOT_FOOD_CATEGORIES.includes(category) ? HOT_FOOD_MIN : 1;
}

async function loadCatalog(): Promise<CatalogCategory[]> {
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
    // Creator vrací chyby (např. 4000 = vyčerpaná API kvóta) s HTTP 200 → kontrolujeme code
    if (data.code !== 3000) {
      throw new Error("Creator error: " + JSON.stringify(data));
    }
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
      // bez fotky v Creatoru neposíláme URL → frontend rovnou ukáže placeholder
      // a nevolá /api/product-image (každé takové volání by stálo kvótu)
      photo: r.Foto ? `/api/product-image/${r.ID}` : "",
      // Cloudinary URL (pole urlPic v Creatoru) – fotka se pak načítá přímo z Cloudinary,
      // bez volání Creator API. next/image povoluje jen res.cloudinary.com, jiný host by
      // shodil render, proto jiné URL ignorujeme.
      ...(typeof r.urlPic === "string" && r.urlPic.startsWith("https://res.cloudinary.com/")
        ? { urlPic: r.urlPic }
        : {}),
      name: (r.Nazev as string) ?? "",
      description: (r.Popis as string) ?? "",
      price: parseFloat(r.Cena as string) || 0,
      unit: (r.Jednotka as string) ?? "",
      min: minQty(r.Min, cat),
      tags: toList(r.Tagy),
      allergens: toList(r.Alergeny),
      order: parseInt(r.Poradi as string, 10) || 0,
    });
  }

  return Object.keys(byCat).map((title) => ({
    id: slug(title),
    title,
    subtitle: "",
    items: byCat[title].sort((a, b) => a.order - b.order),
  }));
}

// Katalog z paměti instance (max. 6 h starý), jinak čerstvě z Creatoru.
// Když Creator selže, vrátí poslední dobrou kopii se stale: true; bez kopie vyhodí chybu.
export async function getCatalog(): Promise<{ categories: CatalogCategory[]; stale: boolean }> {
  if (cache && cache.exp > Date.now()) {
    return { categories: cache.categories, stale: false };
  }
  try {
    const categories = await loadCatalog();
    cache = { categories, exp: Date.now() + FRESH_MS };
    return { categories, stale: false };
  } catch (e) {
    if (cache) {
      console.error("[catalog] Creator selhal, vracím starou kopii", e);
      return { categories: cache.categories, stale: true };
    }
    throw e;
  }
}
