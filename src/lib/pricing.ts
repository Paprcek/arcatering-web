export type PricingTier = "none" | "b2b" | "b2c" | "disc";

export interface PricingConfig {
  tier: PricingTier;
  discount: number;
}

export function parsePricingConfig(params: URLSearchParams | null): PricingConfig {
  const raw = params?.get("p")?.toLowerCase() ?? "";
  const tier: PricingTier =
    raw === "b2b" || raw === "b2c" || raw === "disc" ? raw : "none";

  let discount = 0;
  if (tier === "disc") {
    const d = Number(params?.get("d") ?? "");
    if (Number.isFinite(d) && d > 0 && d < 100) discount = d;
  }
  return { tier, discount };
}

export function showsPrices(tier: PricingTier): boolean {
  return tier !== "none";
}

export function showsVatNote(tier: PricingTier): boolean {
  return tier === "b2b";
}

export function effectivePrice(base: number, cfg: PricingConfig): number {
  if (cfg.tier === "disc" && cfg.discount > 0) {
    return Math.round(base * (1 - cfg.discount / 100));
  }
  return base;
}
