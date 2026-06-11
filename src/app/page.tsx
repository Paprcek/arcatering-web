"use client";

import { useState, useEffect } from "react";
import { COPY } from "@/data/copy";
import { PRODUCTS, type Category } from "@/data/products";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { WhyUs } from "@/components/WhyUs";
import { QuoteBuilder } from "@/components/QuoteBuilder";
import { HowItWorks } from "@/components/HowItWorks";
import { References } from "@/components/References";
import { FooterCTA } from "@/components/FooterCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [lang, setLang] = useState("cs");
  const copy = COPY[lang];

  // Katalog se načítá z Creatoru přes /api/products.
  // Když fetch selže nebo vrátí prázdno, padáme na hardcoded data (fallback).
  const [products, setProducts] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        const cats: Category[] = d.categories ?? [];
        setProducts(cats.length > 0 ? cats : PRODUCTS["cs"].categories);
      })
      .catch(() => setProducts(PRODUCTS["cs"].categories))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Nav copy={copy} lang={lang} setLang={setLang} />
      <main>
        <Hero copy={copy} />
        <WhyUs copy={copy} />
        <section id="menu">
          {loading || products.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center", color: "#5b6b57" }}>
              Načítám nabídku…
            </div>
          ) : (
            <QuoteBuilder copy={copy} products={products} lang={lang} />
          )}
        </section>
        <HowItWorks copy={copy} />
        <References copy={copy} />
        <FooterCTA copy={copy} />
      </main>
      <Footer copy={copy} />
    </>
  );
}
