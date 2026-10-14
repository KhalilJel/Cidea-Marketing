import React from "react";

// Text wordmark as on the current site. To be replaced by the approved SVG wordmark.
export function Logo({ href = "/" }) {
  return <a className="ds-logo" href={href} aria-label="Cidea Marketing – forsiden">cidea<span>marketing</span></a>;
}

// Responsive image. `sources` = [{ type: "image/avif", srcSet: "a-800.avif 800w, ..." }].
// width/height are required so the browser reserves space (no layout shift).
// Without `src` it renders a clearly labelled empty slot — never a stand-in image.
export function Media({ src, alt, width, height, sources = [], sizes = "100vw", priority = false, ratio, missingLabel = "Godkjent bilde mangler" }) {
  const style = ratio ? { "--ratio": ratio } : undefined;
  if (!src) return <div className="ds-media ds-media--missing" style={style} role="img" aria-label={missingLabel}><span aria-hidden="true">{missingLabel}</span></div>;
  return (
    <picture className="ds-media" style={style}>
      {sources.map(s => <source key={s.type} type={s.type} srcSet={s.srcSet} sizes={sizes} />)}
      <img src={src} alt={alt} width={width} height={height} sizes={sizes}
        loading={priority ? "eager" : "lazy"} decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"} />
    </picture>
  );
}

export function Button({ href, variant = "primary", children }) {
  return <a className={`ds-button ds-button--${variant}`} href={href}>{children}</a>;
}

export function Hero({ eyebrow, title, lead, primary, secondary, note, media, tone = "light", headingLevel = 1 }) {
  const H = `h${headingLevel}`;
  return (
    <section className={`ds-hero${tone === "dark" ? " ds-dark" : ""}`}>
      <div className={`ds-container ds-hero__inner${media ? " ds-hero__inner--media" : ""}`}>
        <div>
          {eyebrow && <p className="ds-eyebrow">{eyebrow}</p>}
          <H className="ds-hero__title">{title}</H>
          {lead && <p className="ds-hero__lead">{lead}</p>}
          {(primary || secondary) && (
            <div className="ds-hero__actions">
              {primary && <Button href={primary.href}>{primary.label}</Button>}
              {secondary && <a className="ds-link" href={secondary.href}>{secondary.label}</a>}
            </div>
          )}
          {note && <p className="ds-hero__note">{note}</p>}
        </div>
        {media}
      </div>
    </section>
  );
}

// `service` is a slug from tokens.json → sets the accent via [data-service].
// Pass `text={null}` when approved copy does not exist yet; the gap stays visible.
export function ServiceCard({ service, label, title, text, href, linkLabel = "Utforsk" }) {
  return (
    <article className="ds-card" data-service={service}>
      <p className="ds-eyebrow ds-card__label">{label}</p>
      <h3 className="ds-card__title">{title}</h3>
      {text ? <p className="ds-card__text">{text}</p> : <p className="ds-card__text ds-missing">Tekst mangler – leveres av innholdsansvarlig.</p>}
      {href && <a className="ds-card__link" href={href}>{linkLabel} <span aria-hidden="true">→</span><span className="ds-visually-hidden"> – {title}</span></a>}
    </article>
  );
}

export function ArticleCard({ href, title, intro, label = "Artikkel" }) {
  return (
    <article className="ds-article">
      <p className="ds-eyebrow">{label}</p>
      <h3 className="ds-article__title"><a href={href}>{title}</a></h3>
      <p className="ds-article__intro">{intro}</p>
    </article>
  );
}

export function Cta({ eyebrow, title, text, action }) {
  return (
    <section className="ds-section">
      <div className="ds-container">
        <div className="ds-cta ds-dark">
          {eyebrow && <p className="ds-eyebrow">{eyebrow}</p>}
          <h2 className="ds-cta__title">{title}</h2>
          {text && <p className="ds-cta__text">{text}</p>}
          {action && <Button href={action.href}>{action.label}</Button>}
        </div>
      </div>
    </section>
  );
}

export function Footer({ columns, legal }) {
  return (
    <footer className="ds-footer ds-dark">
      <div className="ds-container">
        <div className="ds-footer__grid">
          <div><Logo /></div>
          {columns.map(col => (
            <nav key={col.title} aria-label={col.title}>
              <h2>{col.title}</h2>
              <ul>{col.links.map(l => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}</ul>
            </nav>
          ))}
        </div>
        {legal && <p className="ds-footer__bottom">{legal}</p>}
      </div>
    </footer>
  );
}
