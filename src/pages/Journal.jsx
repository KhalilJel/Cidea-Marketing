import React from "react";
import { blogPage, ui } from "../content.js";
import { getArticle, listArticles } from "../articles.js";
import { localize } from "../routes.js";
import { Arrow } from "../components/Layout.jsx";
import { CtaBand } from "../components/Blocks.jsx";
import { Markdown } from "../markdown.jsx";

export function BlogIndex({ lang }) {
  const b = blogPage[lang];
  const t = ui[lang];
  return (
    <>
      <section className="pageHero compact" aria-labelledby="page-title">
        <div className="wrap">
          <p className="eyebrow">{t.journal}</p>
          <h1 id="page-title" className="display">
            {b.title}
          </h1>
          <p className="lead">{b.lead}</p>
        </div>
      </section>
      <section className="section flushTop">
        <div className="wrap">
          <ul className="articleRows">
            {listArticles(lang).map((a) => (
              <li key={a.slug}>
                <a href={localize(lang, "/blog/" + a.slug)}>
                  <h2>{a.title}</h2>
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
      <CtaBand lang={lang} title={b.ctaTitle} body={b.ctaBody} />
    </>
  );
}

export function Article({ lang, slug }) {
  const a = getArticle(lang, slug);
  const b = blogPage[lang];
  const t = ui[lang];
  const more = listArticles(lang).filter((x) => x.slug !== slug).slice(0, 2);
  return (
    <>
      <article className="articlePage" aria-labelledby="page-title">
        <div className="wrap narrow">
          <a className="ghost back" href={localize(lang, "/blog")}>
            <Arrow dir="left" /> {t.allArticles}
          </a>
          <p className="eyebrow">
            {t.journal} · {a.minutes} {t.minRead}
          </p>
          <h1 id="page-title" className="articleTitle">
            {a.title}
          </h1>
          <div className="prose">
            <Markdown source={a.body} lang={lang} />
          </div>
        </div>
      </article>
      <section className="section" aria-labelledby="more-title">
        <div className="wrap narrow">
          <h2 id="more-title" className="label">
            {t.journal}
          </h2>
          <ul className="articleRows">
            {more.map((m) => (
              <li key={m.slug}>
                <a href={localize(lang, "/blog/" + m.slug)}>
                  <h3>{m.title}</h3>
                  <p>{m.intro}</p>
                  <span className="meta">
                    {t.readArticle} <Arrow />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand lang={lang} title={b.ctaTitle} body={b.ctaBody} />
    </>
  );
}
