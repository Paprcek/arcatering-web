"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { COPY } from "@/data/copy";
import { PRODUCTS } from "@/data/products";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { WhyUs } from "@/components/WhyUs";
import { QuoteBuilder } from "@/components/QuoteBuilder";
import { HowItWorks } from "@/components/HowItWorks";
import { References } from "@/components/References";
import { FooterCTA } from "@/components/FooterCTA";
import { Footer } from "@/components/Footer";
import { parsePricingConfig, type PricingConfig } from "@/lib/pricing";

export default function Home() {
  return (
    <Suspense fallback={<HomeView lang="cs" pricing={{ tier: "none", discount: 0 }} />}>
      <HomeWithParams />
    </Suspense>
  );
}

function HomeWithParams() {
  const params = useSearchParams();
  const pricing = parsePricingConfig(params);
  return <HomeView lang="cs" pricing={pricing} />;
}

function HomeView({ lang: initialLang, pricing }: { lang: string; pricing: PricingConfig }) {
  const [lang, setLang] = useState(initialLang);
  const copy = COPY[lang];
  const products = PRODUCTS[lang].categories;

  return (
    <>
      {pricing.tier !== "none" && <PricingBanner pricing={pricing} lang={lang} />}
      <Nav copy={copy} lang={lang} setLang={setLang} />
      <main>
        <Hero copy={copy} />
        <WhyUs copy={copy} />
        <section id="menu">
          <QuoteBuilder copy={copy} products={products} lang={lang} pricing={pricing} />
        </section>
        <HowItWorks copy={copy} />
        <References copy={copy} />
        <FooterCTA copy={copy} />
      </main>
      <Footer copy={copy} tier={pricing.tier} />
    </>
  );
}

function PricingBanner({ pricing, lang }: { pricing: PricingConfig; lang: string }) {
  const cs = lang === "cs";
  const labels: Record<string, string> = {
    b2b: cs ? "B2B – ceny bez DPH" : "B2B – prices excl. VAT",
    b2c: cs ? "B2C – spotřebitelské ceny" : "B2C – consumer prices",
    disc: cs
      ? `Individuální sleva ${pricing.discount}% – ceny po slevě`
      : `Individual discount ${pricing.discount}% – discounted prices`,
  };
  const note = cs
    ? "Náhled speciálního odkazu. Veřejná verze webu zobrazuje pouze položky bez cen."
    : "Preview of a private link. The public site shows items without prices.";
  return (
    <div className="pricing-banner" role="status">
      <span className="pricing-banner-tag">{labels[pricing.tier]}</span>
      <span className="pricing-banner-note">{note}</span>
    </div>
  );
}
