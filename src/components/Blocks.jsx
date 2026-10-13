import React from "react";
import { services, ui } from "../content.js";
import { localize } from "../routes.js";
import { Arrow } from "./Layout.jsx";

export function Spark({ className = "" }) {
  return (
    <svg className={"spark " + className} viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false">
      <path d="M6 1.2 10.8 10H1.2Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

export function SectionHead({ eyebrow, title, children, as: Tag = "h2", id }) {
  return (
    <div className="sectionHead">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag className="headline" id={id}>
        {title}
      </Tag>
      {children}
    </div>
  );
}

export function ServiceIndex({ lang, keys, headingLevel = 3 }) {
  const Tag = "h" + headingLevel;
  return (
    <ul className="serviceIndex">
      {services
        .filter((s) => !keys || keys.includes(s.key))
        .map((s) => {
          const c = s[lang];
          return (
            <li key={s.key}>
              <a href={localize(lang, "/" + s.key)}>
                <Tag className="siName">{c.name}</Tag>
                <span className="siSummary">{c.summary}</span>
                <span className="siPrice">{c.price}</span>
                <span className="siArrow">
                  <Arrow dir="up" />
                </span>
              </a>
            </li>
          );
        })}
    </ul>
  );
}

export function CtaBand({ lang, title, body, cta }) {
  const t = ui[lang];
  return (
    <section className="ctaBand" aria-labelledby="cta-title">
      <div className="wrap">
        <Spark className="ctaSpark" />
        <h2 id="cta-title" className="ctaTitle">
          {title}
        </h2>
        <p className="ctaBody">{body}</p>
        <div className="actions">
          <a className="button primary" href={localize(lang, "/contact")}>
            {cta || t.cta} <Arrow />
          </a>
        </div>
        <p className="fineprint">{t.noCost}</p>
      </div>
    </section>
  );
}
