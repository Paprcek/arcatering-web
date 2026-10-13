import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";

// Kvóta Creator API je omezená a počítá se na každé volání. Katalog proto čteme
// z Creatoru max. jednou za 6 hodin, ne při každé návštěvě webu:
//  - CDN (Vercel) drží odpověď přes s-maxage, návštěvníci se do funkce vůbec nedostanou
//  - paměť instance drží poslední dobrou odpověď (viz getCatalog v lib/catalog.ts)
const OK_HEADERS = { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" };

export async function GET() {
  try {
    const { categories, stale } = await getCatalog();
    if (stale) {
      // Creator selhal → radši stará kopie než prázdný katalog; krátká cache ať se brzy zkusí znovu
      return NextResponse.json(
        { categories, stale: true },
        { headers: { "Cache-Control": "public, s-maxage=60" } }
      );
    }
    return NextResponse.json({ categories }, { headers: OK_HEADERS });
  } catch (e) {
    console.error("[products]", e);
    // chybu necachovat (no-store), jinak by se prázdný katalog držel na CDN
    return NextResponse.json(
      { categories: [], error: true },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
