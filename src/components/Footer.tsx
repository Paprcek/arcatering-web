import Image from "next/image";
import Link from "next/link";
import type { CopyData } from "@/data/copy";
import { showsVatNote, type PricingTier } from "@/lib/pricing";

export function Footer({ copy, tier = "none" }: { copy: CopyData; tier?: PricingTier }) {
  const legal = showsVatNote(tier) ? copy.footer.legal : copy.footer.legalNoVat;
  return (
    <footer id="footer" className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="brand brand-lg">
            <Image src="/images/logo.png" alt="AR Catering" className="brand-logo brand-logo-lg" width={203} height={46} />
          </div>
          <p className="muted">{copy.footer.tagline}</p>
        </div>
        <div className="footer-col">
          <h4 className="footer-h">Adresa</h4>
          <address>
            {copy.footer.addr.split("\n").map((l, i) => <div key={i}>{l}</div>)}
          </address>
        </div>
        <div className="footer-col">
          <h4 className="footer-h">{copy.footer.contact}</h4>
          {copy.footer.contacts.map(p => (
            <div key={p.email} className="footer-contact-person">
              <span className="footer-contact-name">{p.name}</span>
              <a href={`mailto:${p.email}`}>{p.email}</a>
              <a href={`tel:${p.phone.replace(/\s/g, "")}`}>{p.phone}</a>
            </div>
          ))}
          <span className="muted">{copy.footer.hours}</span>
        </div>
        <div className="footer-col">
          <h4 className="footer-h">Social</h4>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
        </div>
      </div>
      <div className="container footer-legal">
        <span className="muted small">{legal}</span>
        {" · "}
        <Link href="/zasady-ochrany-osobnich-udaju" className="muted small">{copy.footer.gdprLink}</Link>
        {" · "}
        <span className="muted small">{copy.footer.allergensNote}</span>
      </div>
    </footer>
  );
}
