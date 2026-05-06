import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://arcatering-web.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "AR Catering — Firemní catering Praha a okolí",
  description:
    "Catering pro firemní akce v Praze a okolí. Školení, meetingy, večírky. Sestavte si poptávku za 2 minuty.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: SITE_URL,
    siteName: "AR Catering",
    title: "AR Catering — Firemní catering Praha a okolí",
    description:
      "Catering pro firemní akce v Praze a okolí. Rodinná firma od 2008. Servis na porcelánu, vlastní vozový park, doručení do hodiny.",
    images: [{ url: "/images/food/grill-platter.jpg", width: 1200, height: 630, alt: "AR Catering — výběr pokrmů" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AR Catering — Firemní catering Praha a okolí",
    description: "Rodinný catering pro firemní akce. Servis na porcelánu, vlastní vozový park.",
    images: ["/images/food/grill-platter.jpg"],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "FoodEstablishment"],
      "@id": `${SITE_URL}/#business`,
      name: "AR Catering",
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo.png`,
      image: `${SITE_URL}/images/food/grill-platter.jpg`,
      description:
        "Rodinný catering pro firemní akce v Praze a okolí. Specializace na školení, meetingy, klientské návštěvy a firemní oslavy. Na trhu od roku 2008.",
      foundingDate: "2008",
      slogan: "Občerstvení, které rozhodne o úspěchu vaší akce.",
      telephone: "+420776123456",
      email: "poptavka@arcatering.cz",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Křížíkova 16",
        addressLocality: "Praha",
        postalCode: "186 00",
        addressCountry: "CZ",
      },
      areaServed: [
        { "@type": "City", name: "Praha" },
        { "@type": "AdministrativeArea", name: "Středočeský kraj" },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:00",
          closes: "17:00",
        },
      ],
      servesCuisine: ["Czech", "European", "International"],
      sameAs: [],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Catering nabídka",
        itemListElement: [
          { "@type": "OfferCatalog", name: "Chlebíčky a kanapky" },
          { "@type": "OfferCatalog", name: "Studené finger food" },
          { "@type": "OfferCatalog", name: "Bagety, croissanty a wrapy" },
          { "@type": "OfferCatalog", name: "Teplé pokrmy" },
          { "@type": "OfferCatalog", name: "Saláty a misky" },
          { "@type": "OfferCatalog", name: "Mini dezerty" },
          { "@type": "OfferCatalog", name: "Nápoje" },
          { "@type": "OfferCatalog", name: "Servis a vybavení" },
        ],
      },
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#service`,
      serviceType: "Corporate catering",
      provider: { "@id": `${SITE_URL}/#business` },
      areaServed: { "@type": "City", name: "Praha" },
      name: "Catering pro firemní akce",
      description:
        "Coffee breaky, rauty, teplé bufety, finger food, snídaně a dezerty pro školení, meetingy, klientské návštěvy a firemní oslavy. Servis na porcelánu, inventář zapůjčen v ceně.",
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceSpecification: { "@type": "PriceSpecification", priceCurrency: "CZK" },
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "AR Catering",
      inLanguage: "cs-CZ",
      publisher: { "@id": `${SITE_URL}/#business` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={`${geistSans.variable} ${geistMono.variable}`} data-direction="brand">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
