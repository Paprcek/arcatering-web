import type { CopyData } from "@/data/copy";

export function Faq({ copy }: { copy: CopyData }) {
  const f = copy.faq;
  return (
    <section id="faq" className="faq" aria-labelledby="faq-title">
      <div className="container">
        <header className="section-head">
          <div className="eyebrow">{f.eyebrow}</div>
          <h2 id="faq-title" className="display-h2">{f.title}</h2>
        </header>
        <div className="faq-list" role="list">
          {f.items.map((item, i) => (
            <article key={i} className="faq-item" role="listitem">
              <details>
                <summary>
                  <h3 className="faq-q display-h5">{item.q}</h3>
                  <span className="faq-toggle" aria-hidden="true">+</span>
                </summary>
                <p className="faq-a">{item.a}</p>
              </details>
            </article>
          ))}
        </div>
        <p className="faq-cta muted">
          Nenašli jste odpověď? <a href="#quote">Sestavte si poptávku</a> nebo nám napište na{" "}
          <a href="mailto:poptavka@arcatering.cz">poptavka@arcatering.cz</a>.
        </p>
      </div>
    </section>
  );
}
