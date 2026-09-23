import Image from "next/image";
import Link from "next/link";
import { COPY } from "@/data/copy";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Zásady zpracování osobních údajů | ARcatering",
};

export default function GdprPage() {
  const copy = COPY.cs;
  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <Link href="/" className="brand">
            <Image src="/images/logo.png" alt="AR Catering" className="brand-logo" width={203} height={46} priority />
          </Link>
          <Link href="/" className="btn btn-primary">
            <span>Zpět na web</span>
          </Link>
        </div>
      </header>

      <section className="legal-page">
        <div className="container legal-content">
          <header className="section-head">
            <div className="eyebrow">Právní informace</div>
            <h1 className="display-h2">Zásady zpracování osobních údajů</h1>
            <p className="lead">Platí od 1. 1. 2026. Vysvětlují, jaké osobní údaje ARcateringCZ s.r.o. zpracovává v souvislosti s poptávkami a objednávkami zaslanými přes tento web, a jaká máte práva.</p>
          </header>

          <h2 className="display-h4">1. Správce osobních údajů</h2>
          <p>
            Správcem osobních údajů je <strong>ARcateringCZ s.r.o.</strong>, se sídlem Bubenská 575/23, 170 00 Praha 7 - Holešovice,
            IČ 04810694, DIČ CZ04810694, e-mail <a href="mailto:richard.spudil@arcatering.cz">richard.spudil@arcatering.cz</a>,
            telefon <a href="tel:+420608833229">+420 608 833 229</a> („<strong>my</strong>" nebo „<strong>Správce</strong>").
          </p>

          <h2 className="display-h4">2. Jaké údaje zpracováváme</h2>
          <p>Při odeslání poptávky nebo objednávky z tohoto webu zpracováváme:</p>
          <ul>
            <li>identifikační a kontaktní údaje – jméno a příjmení, e-mail, telefon, případně název firmy;</li>
            <li>údaje o akci – datum a čas konání, počet hostů, způsob předání (doprava/osobní odběr) a adresu doručení, je-li relevantní;</li>
            <li>obsah poptávky – vybrané položky z nabídky a poznámky, které do formuláře doplníte (např. alergie, speciální požadavky).</li>
          </ul>

          <h2 className="display-h4">3. Účel a právní základ zpracování</h2>
          <p>
            Údaje zpracováváme za účelem vyřízení vaší poptávky, přípravy cenové nabídky a případné realizace objednávky
            (plnění smlouvy nebo jednání o jejím uzavření, čl. 6 odst. 1 písm. b) GDPR), a na základě vámi uděleného
            souhlasu při odeslání formuláře (čl. 6 odst. 1 písm. a) GDPR). Kontaktní údaje dále zpracováváme z oprávněného
            zájmu za účelem komunikace ohledně vaší poptávky.
          </p>

          <h2 className="display-h4">4. Doba uchování</h2>
          <p>
            Údaje z nerealizovaných poptávek uchováváme po dobu 12 měsíců od odeslání, pokud nepožádáte o dřívější výmaz.
            Údaje k uskutečněným objednávkám uchováváme po dobu vyžadovanou účetními a daňovými předpisy.
          </p>

          <h2 className="display-h4">5. Komu údaje předáváme</h2>
          <p>
            Údaje zpracováváme v cloudové platformě (Zoho Creator) sloužící ke správě objednávek, která pro nás jedná
            jako zpracovatel osobních údajů na základě smlouvy o zpracování. Údaje dále nepředáváme třetím stranám,
            s výjimkou případů, kdy nám to ukládá zákon.
          </p>

          <h2 className="display-h4">6. Vaše práva</h2>
          <p>Ve vztahu ke svým osobním údajům máte právo:</p>
          <ul>
            <li>na přístup k údajům, které o vás zpracováváme;</li>
            <li>na opravu nepřesných nebo neúplných údajů;</li>
            <li>na výmaz („právo být zapomenut"), pokud pro zpracování není důvod;</li>
            <li>na omezení zpracování;</li>
            <li>na přenositelnost údajů;</li>
            <li>vznést námitku proti zpracování;</li>
            <li>kdykoliv odvolat udělený souhlas, aniž je tím dotčena zákonnost zpracování před jeho odvoláním.</li>
          </ul>
          <p>
            Svá práva můžete uplatnit e-mailem na <a href="mailto:richard.spudil@arcatering.cz">richard.spudil@arcatering.cz</a>.
            Pokud se domníváte, že vaše údaje zpracováváme v rozporu se zákonem, máte právo podat stížnost u Úřadu pro
            ochranu osobních údajů (uoou.cz).
          </p>

          <h2 className="display-h4">7. Kontakt</h2>
          <p>
            S jakýmikoliv dotazy ke zpracování osobních údajů nás kontaktujte na{" "}
            <a href="mailto:richard.spudil@arcatering.cz">richard.spudil@arcatering.cz</a> (Richard Spudil) nebo{" "}
            <a href="mailto:ales.tichy@arcatering.cz">ales.tichy@arcatering.cz</a> (Aleš Tichý).
          </p>
        </div>
      </section>

      <Footer copy={copy} />
    </>
  );
}
