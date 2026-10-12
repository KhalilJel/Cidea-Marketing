import React from "react";
import { services, servicePage, ui } from "../content.js";
import { localize } from "../routes.js";
import { Arrow } from "../components/Layout.jsx";
import { CtaBand, ServiceIndex, Spark } from "../components/Blocks.jsx";
import { Constellation } from "../components/Constellation.jsx";

export function Service({ lang, serviceKey }) {
  const service = services.find((x) => x.key === serviceKey);
  const s = service[lang];
  const p = servicePage[lang];
  const t = ui[lang];
  return (
    <>
      <section className="pageHero serviceHero" aria-labelledby="page-title">
        <div className="wrap heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">{s.eyebrow}</p>
            <h1 id="page-title" className="display">
              {s.title}
            </h1>
            <p className="lead">{s.lead}</p>
            <div className="actions">
              <a className="button primary" href={localize(lang, "/contact")}>
                {t.cta} <Arrow />
              </a>
              <p className="priceTag">
                <Spark /> {s.price}
              </p>
            </div>
          </div>
          <div className="heroVisual">
            <Constellation shape={service.shape} density={0.75} />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="deliverables-title">
        <div className="wrap splitRow">
          <h2 id="deliverables-title" className="label">
            {p.deliverables}
          </h2>
          <ul className="lineList">
            {s.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="fit-title">
        <div className="wrap splitRow">
          <h2 id="fit-title" className="label">
            {p.fit}
          </h2>
          <ul className="fitList">
            {s.fit.map((f) => (
              <li key={f}>
                <Spark />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section process" aria-labelledby="steps-title">
        <div className="wrap">
          <h2 id="steps-title" className="label">
            {p.process}
          </h2>
          <ol className="steps four">
            {s.steps.map(([title, text], i) => (
              <li key={title}>
                <span className="stepNo" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{title}</h3>
                <p className="body">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="price-title">
        <div className="wrap priceBlock">
          <div>
            <h2 id="price-title" className="label">
              {p.price}
            </h2>
            <p className="priceBig">{s.price}</p>
            <p className="body">{s.priceNote}</p>
          </div>
          <div className="priceAction">
            <a className="button primary" href={localize(lang, "/contact")}>
              {t.cta} <Arrow />
            </a>
            <p className="fineprint">{t.noCost}</p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-title">
        <div className="wrap splitRow">
          <h2 id="faq-title" className="label">
            {p.faq}
          </h2>
          <div className="faq">
            {s.faq.map(([q, a]) => (
              <details key={q}>
                <summary>
                  <span>{q}</span>
                  <i aria-hidden="true" />
                </summary>
                <p className="body">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="related-title">
        <div className="wrap">
          <h2 id="related-title" className="label">
            {p.related}
          </h2>
          <ServiceIndex lang={lang} keys={services.filter((x) => x.key !== serviceKey).map((x) => x.key)} />
        </div>
      </section>

      <CtaBand lang={lang} title={p.nextTitle} body={p.nextBody} />
    </>
  );
}
