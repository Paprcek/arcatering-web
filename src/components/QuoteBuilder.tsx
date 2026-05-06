"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Icon } from "./Icon";
import type { CopyData } from "@/data/copy";
import type { Category, ProductItem } from "@/data/products";
import {
  effectivePrice,
  showsPrices,
  showsVatNote,
  type PricingConfig,
} from "@/lib/pricing";

interface QuoteBuilderProps {
  copy: CopyData;
  products: Category[];
  lang: string;
  pricing: PricingConfig;
}

export function QuoteBuilder({ copy, products, lang, pricing }: QuoteBuilderProps) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [activeCat, setActiveCat] = useState(products[0].id);
  const [filter, setFilter] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({ guests: "30", date: "", notes: "", name: "", company: "", email: "", phone: "", consent: false });
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const priced = showsPrices(pricing.tier);
  const showVat = showsVatNote(pricing.tier);
  const isDiscounted = pricing.tier === "disc" && pricing.discount > 0;

  const allItems = useMemo(() => {
    const m: Record<string, ProductItem & { catId: string; catTitle: string }> = {};
    products.forEach(c => c.items.forEach(i => { m[i.id] = { ...i, catId: c.id, catTitle: c.title }; }));
    return m;
  }, [products]);

  const cartList = Object.entries(cart).filter(([, q]) => q > 0).map(([id, q]) => {
    const it = allItems[id];
    return { ...it, qty: q, basePrice: it.price, price: effectivePrice(it.price, pricing) };
  });
  const total = cartList.reduce((s, it) => s + it.price * it.qty, 0);
  const itemCount = cartList.reduce((s, it) => s + it.qty, 0);

  const setQty = (id: string, q: number) => setCart(c => {
    const n = { ...c };
    if (q <= 0) delete n[id]; else n[id] = q;
    return n;
  });
  const inc = (id: string) => setQty(id, (cart[id] || 0) + 1);
  const dec = (id: string) => setQty(id, Math.max(0, (cart[id] || 0) - 1));

  const filtered = (cat: Category) => {
    if (filter === "all") return cat.items;
    if (filter === "veg") return cat.items.filter(i => i.tags.includes("veg") || i.tags.includes("vegan"));
    if (filter === "vegan") return cat.items.filter(i => i.tags.includes("vegan"));
    if (filter === "fish") return cat.items.filter(i => i.tags.includes("fish") || i.tags.includes("ryba"));
    return cat.items;
  };

  const handleSubmit = async () => {
    if (!form.consent || !form.email || !form.name || cartList.length === 0) return;
    setSubmitState("sending");
    const payload = {
      items: cartList.map(it => ({
        id: it.id,
        name: it.name,
        qty: it.qty,
        price: priced ? it.price : null,
        basePrice: it.basePrice,
        unit: it.unit,
      })),
      total: priced ? total : null,
      pricing: { tier: pricing.tier, discount: pricing.discount },
      event: { guests: form.guests, date: form.date, notes: form.notes },
      contact: { name: form.name, company: form.company, email: form.email, phone: form.phone },
      lang,
      ts: new Date().toISOString()
    };
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Submit failed");
      setSubmitState("sent");
    } catch {
      setSubmitState("error");
    }
  };

  const c = copy.quoteSection;

  const totalNote = showVat
    ? c.totalNote
    : pricing.tier === "disc"
      ? c.totalNoteDisc
      : c.totalNoteB2c;
  const submitLabel = priced ? c.submit : c.submitNoPrice;

  const tagLabel = (tag: string) => {
    if (tag === "veg") return lang === "cs" ? "Vege" : "Veg";
    if (tag === "vegan") return "Vegan";
    if (tag === "fish" || tag === "ryba") return lang === "cs" ? "Ryba" : "Fish";
    if (tag === "bezlepkové" || tag === "gluten-free") return lang === "cs" ? "Bezlep." : "GF";
    return tag;
  };

  const ItemCard = ({ item }: { item: ProductItem }) => {
    const qty = cart[item.id] || 0;
    const shown = effectivePrice(item.price, pricing);
    return (
      <div className={`item-card ${qty > 0 ? "has" : ""}`}>
        <div className="item-card-photo">
          <Image src={item.urlPic ?? item.photo} alt={item.name} width={250} height={187} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        </div>
        <div className="item-card-body">
          <div className="item-card-top">
            <div className="item-card-name">{item.name}</div>
            {item.tags.length > 0 && (
              <div className="tags">
                {item.tags.slice(0, 2).map(tg => <span key={tg} className="tag">{tagLabel(tg)}</span>)}
              </div>
            )}
          </div>
          <div className="item-card-bottom">
            {priced ? (
              <div className="item-card-price">
                {isDiscounted && <span className="price-original">{item.price} Kč</span>}
                <b>{shown}</b><span className="csym"> Kč</span><span className="punit">/{item.unit}</span>
              </div>
            ) : (
              <div className="item-card-price item-card-price-empty">
                <span className="punit">{lang === "cs" ? `min. ${item.min} ${item.unit}` : `min. ${item.min} ${item.unit}`}</span>
              </div>
            )}
            <Stepper qty={qty} onInc={() => inc(item.id)} onDec={() => dec(item.id)} addLabel={c.add} />
          </div>
        </div>
      </div>
    );
  };

  const fmt = (n: number) => n.toLocaleString(lang === "cs" ? "cs-CZ" : "en-US");

  const cartContents = (
    <>
      <div className="drawer-header">
        <h3 className="display-h4">{c.stickyTitle}</h3>
        <span className="drawer-count">{itemCount}</span>
      </div>

      {submitState === "sent" ? (
        <div className="sent-state">
          <div className="sent-mark"><Icon name="check" size={20} /></div>
          <h4 className="display-h4">{c.sent.split(".")[0]}.</h4>
          <p className="muted">{c.sent.split(".").slice(1).join(".").trim()}</p>
        </div>
      ) : (
        <>
          <div className="drawer-scroll">
            {cartList.length === 0 ? (
              <div className="cart-empty">
                <div className="cart-empty-icon"><Icon name="cart" size={20} /></div>
                <p className="muted">{c.empty}</p>
              </div>
            ) : (
              <ul className="cart-items">
                {cartList.map(it => (
                  <li key={it.id} className="cart-item">
                    <div className="cart-item-info">
                      <div className="cart-item-name">{it.name}</div>
                      <div className="cart-item-line">
                        {priced ? (
                          <>
                            <span>{it.qty} × {it.price} Kč</span>
                            <b>{fmt(it.qty * it.price)} Kč</b>
                          </>
                        ) : (
                          <span>{it.qty} {it.unit}</span>
                        )}
                      </div>
                    </div>
                    <div className="cart-item-ctrls">
                      <Stepper qty={it.qty} onInc={() => inc(it.id)} onDec={() => dec(it.id)} addLabel={c.add} />
                      <button className="cart-item-x" onClick={() => setQty(it.id, 0)} title={c.remove}><Icon name="close" size={11} /></button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <form className="quote-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row two">
                <label className="field" htmlFor="qf-guests">
                  <span className="field-label">{c.formGuests}</span>
                  <input id="qf-guests" name="guests" type="number" min="1" inputMode="numeric" autoComplete="off" value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })} />
                </label>
                <label className="field" htmlFor="qf-date">
                  <span className="field-label">{c.formDate}</span>
                  <input id="qf-date" name="date" type="datetime-local" autoComplete="off" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </label>
              </div>
              <label className="field" htmlFor="qf-notes">
                <span className="field-label">{c.formNotes}</span>
                <textarea id="qf-notes" name="notes" rows={2} placeholder={c.formNotesPh} autoComplete="off" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </label>
              <div className="form-divider"></div>
              <div className="form-row two">
                <label className="field" htmlFor="qf-name">
                  <span className="field-label">{c.formName}<em> *</em></span>
                  <input id="qf-name" name="name" type="text" autoComplete="name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </label>
                <label className="field" htmlFor="qf-company">
                  <span className="field-label">{c.formCompany}</span>
                  <input id="qf-company" name="company" type="text" autoComplete="organization" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                </label>
              </div>
              <div className="form-row two">
                <label className="field" htmlFor="qf-email">
                  <span className="field-label">{c.formEmail}<em> *</em></span>
                  <input id="qf-email" name="email" type="email" autoComplete="email" inputMode="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </label>
                <label className="field" htmlFor="qf-phone">
                  <span className="field-label">{c.formPhone}</span>
                  <input id="qf-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </label>
              </div>
              <label className="consent" htmlFor="qf-consent">
                <input id="qf-consent" name="consent" type="checkbox" required checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })} />
                <span>{c.consent}</span>
              </label>
            </form>
          </div>

          <div className="drawer-footer">
            {priced && cartList.length > 0 && (
              <div className="cart-total">
                <div className="cart-total-row">
                  <span className="muted">{c.total}</span>
                  <b className="cart-total-num">{fmt(total)} Kč</b>
                </div>
                <p className="muted total-note">{totalNote}</p>
              </div>
            )}
            <button
              className="submit-btn"
              disabled={submitState === "sending" || !form.consent || !form.email || !form.name || cartList.length === 0}
              onClick={handleSubmit}
            >
              {submitState === "sending" ? c.sending : submitLabel}
              {submitState !== "sending" && <Icon name="arrow" size={14} />}
            </button>
            {submitState === "error" && (
              <p className="muted" style={{ fontSize: 12, color: "#c00" }}>
                {lang === "cs" ? "Něco se pokazilo, zkuste to znovu." : "Something went wrong, please try again."}
              </p>
            )}
          </div>
        </>
      )}
    </>
  );

  return (
    <section id="quote" className="quote-section">
      <div className="container">
        <header className="section-head">
          <div className="eyebrow">{c.eyebrow}</div>
          <h2 className="display-h2">{c.title}</h2>
          <p className="lead">{c.lead}</p>
        </header>

        <div className="quote-shell with-drawer">
          <div className="quote-catalog">
            <div className="custom-note">
              <div className="custom-note-icon"><Icon name="plus" size={14} /></div>
              <div className="custom-note-body">
                <b>{c.customNoteTitle}</b>
                <span>{c.customNoteBody}</span>
              </div>
            </div>
            <div className="catalog-controls">
              <nav className="cat-tabs" aria-label="Categories">
                {products.map(cat => (
                  <button key={cat.id} className={`cat-tab ${activeCat === cat.id ? "on" : ""}`} onClick={() => setActiveCat(cat.id)}>
                    {cat.title}
                  </button>
                ))}
              </nav>
              <div className="filter-pills">
                {([["all", c.filterAll], ["veg", c.filterVeg], ["vegan", c.filterVegan], ["fish", c.filterFish]] as const).map(([k, l]) => (
                  <button key={k} className={`pill ${filter === k ? "on" : ""}`} onClick={() => setFilter(k)}>{l}</button>
                ))}
              </div>
            </div>

            {products.filter(cat => cat.id === activeCat).map(cat => (
              <div key={cat.id} className="cat-block">
                <div className="cat-header">
                  <h3 className="display-h3">{cat.title}</h3>
                  <p className="muted">{cat.subtitle}</p>
                </div>
                <div className="items-grid">
                  {filtered(cat).map(it => <ItemCard key={it.id} item={it} />)}
                </div>
                {filtered(cat).length === 0 && (
                  <div className="empty-filter">
                    — {lang === "cs" ? "Pro zvolený filtr nic nenajdeme. Zkuste jinou kategorii." : "Nothing matches this filter. Try another category."}
                  </div>
                )}
              </div>
            ))}
          </div>

          <aside className="quote-drawer">
            <div className="drawer-inner">
              {cartContents}
            </div>
          </aside>
        </div>
      </div>

      {itemCount > 0 && (
        <button className={`mobile-cart-fab ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(o => !o)}>
          <Icon name="cart" size={16} />
          <span>{itemCount} {lang === "cs" ? "pol." : "items"}</span>
          {priced && <b>{total.toLocaleString(lang === "cs" ? "cs-CZ" : "en-US")} Kč</b>}
        </button>
      )}
      {drawerOpen && (
        <div className="mobile-drawer-modal" onClick={() => setDrawerOpen(false)}>
          <div className="mobile-drawer-inner" onClick={e => e.stopPropagation()}>
            <button className="mobile-drawer-close" onClick={() => setDrawerOpen(false)}><Icon name="close" /></button>
            {cartContents}
          </div>
        </div>
      )}
    </section>
  );
}

function Stepper({ qty, onInc, onDec, addLabel }: { qty: number; onInc: () => void; onDec: () => void; addLabel: string }) {
  if (qty === 0) {
    return <button className="add-btn" onClick={onInc}><Icon name="plus" size={12} /><span>{addLabel}</span></button>;
  }
  return (
    <div className="stepper">
      <button onClick={onDec}><Icon name="minus" size={12} /></button>
      <span className="stepper-qty">{qty}</span>
      <button onClick={onInc}><Icon name="plus" size={12} /></button>
    </div>
  );
}
