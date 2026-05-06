export const COPY: Record<string, CopyData> = {
  cs: {
    nav: { menu: "Sortiment", how: "Jak to funguje", reference: "Reference", contact: "Kontakt", quote: "Nezávazná poptávka" },
    hero: {
      eyebrow: "Catering pro firemní akce v Praze a okolí · rodinná firma od 2008",
      title: ["Občerstvení,", "které ", "rozhodne", " o úspěchu vaší akce."],
      lead: "Specializujeme se na školení, meetingy, klientské návštěvy a firemní oslavy. Sestavte si poptávku za 2 minuty — ozveme se do hodiny v pracovní době.",
      ctaPrimary: "Sestavit poptávku",
      ctaSecondary: "Prohlédnout sortiment",
      stat1: ["18+", "let na pražském trhu"],
      stat2: ["1 800+", "zrealizovaných akcí"],
      stat3: ["< 60 min", "odezva v pracovní době"],
      tags: ["školení", "semináře", "meetingy", "klientské návštěvy", "firemní večírky", "oslavy"]
    },
    promise: {
      eyebrow: "Proč AR Catering",
      title: "Šest věcí, na kterých si zakládáme.",
      items: [
        { kicker: "01", title: "Čerstvé suroviny od osvědčených dodavatelů", body: "Zeleninu vozíme z Holešovické tržnice, ryby z Makro Premium, sýry od malých výrobců. Žádné polotovary." },
        { kicker: "02", title: "Vlastní vozový park, doručení na minutu přesně", body: "Chladicí vozy a vlastní řidiči. Domluvíme přesný čas příjezdu — důležité pro coffee break v 10:00 i raut po keynote." },
        { kicker: "03", title: "Individuální přístup, jeden event manažer", body: "Od poptávky po úklid vás vede jeden člověk. Bez přeposílání, bez zbytečných schůzek — domluvíme i to, co v ceníku nenajdete." },
        { kicker: "04", title: "Vše na porcelánu, inventář zapůjčíme", body: "Standardně servírujeme na porcelánu se sklem a příbory. Druhý den si pro vše přijedeme — špinavé nádobí jen vrátíte do beden." },
        { kicker: "05", title: "Bohatá nabídka pro vegetariány a vegany", body: "Veg a vegan položky napříč všemi kategoriemi — od kanapek po teplé chody. Vyhradíme klidně celý raut bez masa." },
        { kicker: "06", title: "Cokoliv mimo nabídku — naceníme", body: "Káva, alko, nealko, custom dezerty, dorty s logem, special diet… Stačí napsat do poznámky a obratem oceníme." }
      ]
    },
    quoteSection: {
      eyebrow: "Nezávazná poptávka",
      title: "Sestavte si vlastní občerstvení.",
      lead: "Vyberte položky, řekněte nám kdy a pro kolik lidí. Cenovou nabídku připravíme co nejdříve.",
      customNoteTitle: "Něco, co tu není?",
      customNoteBody: "Káva, alko, nealko, custom dezerty, speciální diety nebo dort s logem — napište nám to v poznámce, naceníme.",
      step1: "Vyberte položky",
      step2: "Detaily akce",
      step3: "Kontakt",
      stickyTitle: "Vaše poptávka",
      empty: "Zatím prázdno — přidejte první položku z nabídky.",
      total: "Orientační součet",
      totalNote: "Konečnou cenu potvrdíme v nabídce. Bez DPH.",
      totalNoteB2c: "Konečnou cenu potvrdíme v nabídce.",
      totalNoteDisc: "Ceny po individuální slevě. Konečnou cenu potvrdíme v nabídce.",
      submit: "Odeslat poptávku",
      submitNoPrice: "Odeslat nezávaznou poptávku",
      sending: "Odesílám…",
      sent: "Odesláno. Ozveme se do hodiny.",
      formGuests: "Počet hostů",
      formDate: "Datum a čas akce",
      formNotes: "Poznámka (alergeny, místo, formát akce…)",
      formNotesPh: "Např. raut na stojáka, alergie na ořechy u 2 hostů, dovoz do Karlína v 17:30…",
      formName: "Jméno a příjmení",
      formCompany: "Firma",
      formEmail: "E-mail",
      formPhone: "Telefon",
      consent: "Souhlasím se zpracováním osobních údajů pro účely vyřízení poptávky.",
      next: "Pokračovat",
      back: "Zpět",
      filterAll: "Vše",
      filterVeg: "Vegetariánské",
      filterVegan: "Veganské",
      filterFish: "Ryby",
      add: "Přidat",
      remove: "Odebrat",
      from: "od",
      min: "min."
    },
    refs: {
      eyebrow: "Spolupracujeme s",
      title: "Týmy, které nám věří."
    },
    testimonials: {
      eyebrow: "Reference",
      items: [
        { quote: "Spolupracujeme druhým rokem a jsme velmi spokojeni. Vždy kladou velký důraz na čerstvost a kvalitu surovin, což je na chuti hodně znát.", name: "Office Manager", role: "Pražská kancelář mezinárodní poradenské firmy" },
        { quote: "Ve chvíli, kdy nám tři dny před akcí onemocněl interní cateringový tým, AR Catering převzali raut pro 180 hostů a doručili bez jediného zaškobrtnutí.", name: "Event Lead", role: "Konferenční centrum, Praha 4" },
        { quote: "Pravidelně objednáváme občerstvení na představenstvo a klientské snídaně. Vždy přesně, vždy chutně.", name: "Asistentka GŘ", role: "Bankovní instituce" }
      ]
    },
    how: {
      eyebrow: "Jak to funguje",
      title: "Od poptávky k pohoštění za 4 kroky.",
      steps: [
        { n: "1", t: "Pošlete poptávku", b: "Sestavte si vlastní výběr nebo nám napište, co řešíte. Stačí pár minut." },
        { n: "2", t: "Odpovíme do hodiny", b: "Zavoláme nebo napíšeme, doladíme detaily a cenovou nabídku připravíme co nejdříve." },
        { n: "3", t: "Potvrdíte a my vaříme", b: "Po potvrzení nakoupíme čerstvé suroviny a den před akcí vše chystáme." },
        { n: "4", t: "Doručíme, naservírujeme, odvezeme", b: "Včas, na klíč. Po akci si použité nádobí odvezeme zpět." }
      ]
    },
    footer: {
      tagline: "Catering & dodávky občerstvení pro firemní akce v Praze a okolí.",
      addr: "AR Catering s.r.o.\nKřížíkova 16, 186 00 Praha 8",
      hours: "Po–Pá 8:00–17:00",
      contact: "Kontakt",
      legal: "© 2026 AR Catering s.r.o. — IČO 12345678. Vše v ceně bez DPH, pokud není uvedeno jinak.",
      legalNoVat: "© 2026 AR Catering s.r.o. — IČO 12345678."
    },
    footerCta: {
      title: "Plánujete akci v Praze nebo okolí?",
      lead: "Sestavte si poptávku za pár minut, nebo nám rovnou napište. Odpovíme do hodiny v pracovní době.",
      cta: "Sestavit poptávku"
    }
  },
  en: {
    nav: { menu: "Menu", how: "How it works", reference: "Clients", contact: "Contact", quote: "Get a quote" },
    hero: {
      eyebrow: "Corporate catering in Prague & surroundings · family business since 2008",
      title: ["Catering", "that ", "elevates", " your event."],
      lead: "We specialise in trainings, meetings, client visits and company parties. Build your quote in 2 minutes — we reply within an hour during office hours.",
      ctaPrimary: "Build a quote",
      ctaSecondary: "Browse menu",
      stat1: ["18+", "years on the Prague market"],
      stat2: ["1,800+", "events delivered"],
      stat3: ["< 60 min", "reply time, business hours"],
      tags: ["trainings", "seminars", "meetings", "client visits", "company parties", "celebrations"]
    },
    promise: {
      eyebrow: "Why AR Catering",
      title: "Six things we never compromise on.",
      items: [
        { kicker: "01", title: "Fresh, traceable ingredients", body: "Vegetables from Holešovice market, fish from Makro Premium, cheeses from small Czech producers. No shortcuts, no convenience products." },
        { kicker: "02", title: "Own fleet, delivery to the minute", body: "Refrigerated vehicles and our own drivers. We commit to an exact arrival time — important for a 10:00 coffee break and a post-keynote reception alike." },
        { kicker: "03", title: "Individual approach, one event manager", body: "One person handles you from brief to clean-up. No hand-offs, no extra meetings — and we'll quote whatever isn't on the price list too." },
        { kicker: "04", title: "Real porcelain, inventory loan included", body: "We serve on porcelain with proper glassware and cutlery. We collect everything the next day — you just return the dirty dishes in the crates." },
        { kicker: "05", title: "Strong vegetarian and vegan range", body: "Veg and vegan options across every category — from canapés to hot mains. Happy to set up an entirely meat-free reception." },
        { kicker: "06", title: "Anything off-menu — we'll price it", body: "Coffee, alcohol, soft drinks, custom desserts, branded cakes, special diets… Just note it in the form and we'll come back with a price." }
      ]
    },
    quoteSection: {
      eyebrow: "Get a quote",
      title: "Build your own catering.",
      lead: "Pick what you'd like, tell us when and for how many. We'll send a price as soon as possible.",
      customNoteTitle: "Looking for something not on the list?",
      customNoteBody: "Coffee, alcohol, soft drinks, custom desserts, special diets, branded cakes — note it in the form and we'll come back with a price.",
      step1: "Pick items",
      step2: "Event details",
      step3: "Contact",
      stickyTitle: "Your quote",
      empty: "Empty for now — add your first item from the menu.",
      total: "Indicative total",
      totalNote: "Final price confirmed in the proposal. VAT excluded.",
      totalNoteB2c: "Final price confirmed in the proposal.",
      totalNoteDisc: "Prices include your individual discount. Final price confirmed in the proposal.",
      submit: "Send quote request",
      submitNoPrice: "Send enquiry",
      sending: "Sending…",
      sent: "Sent. We'll be in touch within an hour.",
      formGuests: "Number of guests",
      formDate: "Event date & time",
      formNotes: "Notes (allergens, venue, event format…)",
      formNotesPh: "E.g. standing reception, 2 guests with nut allergy, delivery to Karlín at 17:30…",
      formName: "Full name",
      formCompany: "Company",
      formEmail: "Email",
      formPhone: "Phone",
      consent: "I agree to the processing of personal data for the purpose of this enquiry.",
      next: "Continue",
      back: "Back",
      filterAll: "All",
      filterVeg: "Vegetarian",
      filterVegan: "Vegan",
      filterFish: "Fish",
      add: "Add",
      remove: "Remove",
      from: "from",
      min: "min."
    },
    refs: {
      eyebrow: "We work with",
      title: "Teams that trust us."
    },
    testimonials: {
      eyebrow: "References",
      items: [
        { quote: "We've been working with AR Catering for the second year and we're very happy. They always put real emphasis on freshness — and it shows in the flavour.", name: "Office Manager", role: "Prague office, international consultancy" },
        { quote: "Three days before our event our internal catering team got sick. AR Catering took over a reception for 180 guests and delivered without a single hiccup.", name: "Event Lead", role: "Conference centre, Prague 4" },
        { quote: "We order regularly for board meetings and client breakfasts. Always on time, always delicious.", name: "Executive Assistant", role: "Banking institution" }
      ]
    },
    how: {
      eyebrow: "How it works",
      title: "From enquiry to event in 4 steps.",
      steps: [
        { n: "1", t: "Send your enquiry", b: "Build your own selection or just tell us what you're planning. Two minutes is enough." },
        { n: "2", t: "We reply within an hour", b: "We'll call or write, refine the details and send a priced proposal as soon as possible." },
        { n: "3", t: "You confirm, we cook", b: "Once confirmed we buy fresh ingredients and start prep the day before." },
        { n: "4", t: "Deliver, set up, clear away", b: "On time, turnkey. We collect everything used after the event." }
      ]
    },
    footer: {
      tagline: "Catering & food delivery for corporate events in Prague & surroundings.",
      addr: "AR Catering s.r.o.\nKřížíkova 16, 186 00 Prague 8",
      hours: "Mon–Fri 8:00–17:00",
      contact: "Contact",
      legal: "© 2026 AR Catering s.r.o. — Company ID 12345678. All prices VAT excluded unless stated.",
      legalNoVat: "© 2026 AR Catering s.r.o. — Company ID 12345678."
    },
    footerCta: {
      title: "Planning an event in Prague or nearby?",
      lead: "Build your quote in minutes, or write to us directly. We reply within an hour during office hours.",
      cta: "Build a quote"
    }
  }
};

export interface CopyData {
  nav: { menu: string; how: string; reference: string; contact: string; quote: string };
  hero: {
    eyebrow: string;
    title: string[];
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stat1: string[];
    stat2: string[];
    stat3: string[];
    tags: string[];
  };
  promise: {
    eyebrow: string;
    title: string;
    items: { kicker: string; title: string; body: string }[];
  };
  quoteSection: {
    eyebrow: string;
    title: string;
    lead: string;
    customNoteTitle: string;
    customNoteBody: string;
    step1: string;
    step2: string;
    step3: string;
    stickyTitle: string;
    empty: string;
    total: string;
    totalNote: string;
    totalNoteB2c: string;
    totalNoteDisc: string;
    submit: string;
    submitNoPrice: string;
    sending: string;
    sent: string;
    formGuests: string;
    formDate: string;
    formNotes: string;
    formNotesPh: string;
    formName: string;
    formCompany: string;
    formEmail: string;
    formPhone: string;
    consent: string;
    next: string;
    back: string;
    filterAll: string;
    filterVeg: string;
    filterVegan: string;
    filterFish: string;
    add: string;
    remove: string;
    from: string;
    min: string;
  };
  refs: { eyebrow: string; title: string };
  testimonials: {
    eyebrow: string;
    items: { quote: string; name: string; role: string }[];
  };
  how: {
    eyebrow: string;
    title: string;
    steps: { n: string; t: string; b: string }[];
  };
  footer: {
    tagline: string;
    addr: string;
    hours: string;
    contact: string;
    legal: string;
    legalNoVat: string;
  };
  footerCta: {
    title: string;
    lead: string;
    cta: string;
  };
}
