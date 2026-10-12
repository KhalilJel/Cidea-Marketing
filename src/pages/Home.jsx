import React from "react";
import { home, ui, services } from "../content.js";
import { listArticles } from "../articles.js";
import { localize } from "../routes.js";
import { Arrow } from "../components/Layout.jsx";
import { Constellation } from "../components/Constellation.jsx";
import { CtaBand, SectionHead, ServiceIndex, Spark } from "../components/Blocks.jsx";

function ConceptArt({ index }) {
  if (index === 0)
    return (
      <div className="conceptArt artAtelier" aria-hidden="true">
        <div className="artBrowser">
          <div className="artBar">
            <i />
            <i />
            <i />
          </div>
          <div className="artScreen">
            <span className="artMeta">Atelier — 2026</span>
            <strong>
              Form.
              <br />
              Function.
              <br />
              <em>Identity.</em>
            </strong>
          </div>
        </div>
      </div>
    );
  if (index === 1)
    return (
      <div className="conceptArt artForm" aria-hidden="true">
        <span className="artMeta">Form Studio</span>
        <strong>FORM</strong>
        <span className="artTri" />
        <span className="artMeta right">Identity system</span>
      </div>
    );
  return (
    <div className="conceptArt artNoise" aria-hidden="true">
      <strong>
        Make
        <br />
        noise.
      </strong>
      <span className="artMeta">Campaign / Social / Search</span>
    </div>
  );
}

function linkLabel(lang, key) {
  const name = services.find((s) => s.key === key)[lang].nav;
  return `${ui[lang].explore} ${name === "SEO" ? name : name.toLowerCase()}`;
}

export function Home({ lang }) {
  const h = home[lang];
  const t = ui[lang];
  const articles = listArticles(lang).slice(0, 3);
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="wrap heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">{h.eyebrow}</p>
            <h1 id="hero-title" className="display">
              {h.title}
            </h1>
            <p className="lead">{h.lead}</p>
            <div className="actions">
              <a className="button primary" href={localize(lang, "/contact")}>
                {t.cta} <Arrow />
              </a>
              <a className="ghost" href="#services">
                {h.secondary} <Arrow dir="down" />
              </a>
            </div>
            <p className="fineprint">{t.noCost}</p>
          </div>
          <div className="heroVisual">
            <Constellation />
          </div>
        </div>
      </section>

      <section className="section manifesto" aria-labelledby="manifesto-title">
        <div className="wrap manifestoGrid">
          <p className="eyebrow">{h.manifestoEyebrow}</p>
          <h2 id="manifesto-title" className="mega">
            {h.manifesto.map((line, i) => (
              <span key={line} className={i === 2 ? "accentLine" : undefined}>
                {line}
              </span>
            ))}
          </h2>
          <p className="body manifestoBody">{h.manifestoBody}</p>
        </div>
      </section>

      <section className="section" id="services" aria-labelledby="services-title">
        <div className="wrap">
          <SectionHead eyebrow={h.servicesEyebrow} title={h.servicesTitle} id="services-title" />
          <ServiceIndex lang={lang} />
        </div>
      </section>

      <section className="section work" aria-labelledby="work-title">
        <div className="wrap">
          <SectionHead eyebrow={h.workEyebrow} title={h.workTitle} id="work-title">
            <p className="body sectionBody">{h.workBody}</p>
          </SectionHead>
          <div className="concepts">
            {h.work.map((w, i) => (
              <article key={w.name} className={"concept" + (i % 2 ? " flip" : "")}>
                <ConceptArt index={i} />
                <div className="conceptText">
                  <p className="tag">
                    <Spark /> {h.conceptLabel} · {w.kind}
                  </p>
                  <h3>{w.name}</h3>
                  <p className="body">{w.text}</p>
                  <a className="ghost" href={localize(lang, w.href)}>
                    {linkLabel(lang, w.href.slice(1))} <Arrow />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section process" aria-labelledby="process-title">
        <div className="wrap">
          <SectionHead eyebrow={h.processEyebrow} title={h.processTitle} id="process-title" />
          <ol className="steps">
            {h.process.map(([title, text], i) => (
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

      <section className="section audit" aria-labelledby="audit-title">
        <div className="wrap auditGrid">
          <div>
            <p className="eyebrow">{h.auditEyebrow}</p>
            <h2 id="audit-title" className="headline">
              {h.auditTitle}
            </h2>
            <p className="body">{h.auditBody}</p>
            <div className="actions">
              <a className="button primary" href={localize(lang, "/contact")}>
                {t.cta} <Arrow />
              </a>
            </div>
            <p className="fineprint">{t.noCost}</p>
          </div>
          <ul className="auditList">
            {h.auditList.map((item) => (
              <li key={item}>
                <Spark />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section journal" aria-labelledby="journal-title">
        <div className="wrap">
          <div className="headRow">
            <SectionHead eyebrow={h.journalEyebrow} title={h.journalTitle} id="journal-title" />
            <a className="ghost" href={localize(lang, "/blog")}>
              {t.allArticles} <Arrow />
            </a>
          </div>
          <ul className="articleRows">
            {articles.map((a) => (
              <li key={a.slug}>
                <a href={localize(lang, "/blog/" + a.slug)}>
                  <h3>{a.title}</h3>
                  <p>{a.intro}</p>
                  <span className="meta">
                    {a.minutes} {t.minRead} <Arrow />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand lang={lang} title={h.finalTitle} body={h.finalBody} cta={h.finalCta} />
    </>
  );
}
