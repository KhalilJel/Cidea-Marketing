import React, { useEffect, useId, useRef, useState } from "react";
import { selskap } from "../sider/tjenester-innhold.js";
import { sprakLenke } from "../i18n.js";
import "./sprak.css";

// Felles toppmeny for undersidene og mobilmenyen.
export const meny = [
  { tekst: "Tjenester", href: "/tjenester" },
  { tekst: "Om oss", href: "/om-oss" },
  { tekst: "Innsikt", href: "/blog" },
  { tekst: "Kontakt", href: "/kontakt" },
];

// Engelsk meny for den internasjonale delen (src/en/). Språket styres av lang-propen på Ramme.
export const menyEn = [
  { tekst: "Services", href: "/services" },
  { tekst: "Dubai & UAE", href: "/dubai" },
  { tekst: "About", href: "/about" },
  { tekst: "Insights", href: "/insights" },
  { tekst: "Contact", href: "/contact" },
];

// Logoen fører til forsiden på sidens språk: engelsk forside er /, norsk forside er /no.
const forsideFor = lang => (lang === "en" ? "/" : "/no");

// Faste tekster i rammen på hvert språk.
const tekster = {
  no: { hopp: "Hopp til innhold", tilForsiden: "Cidea Marketing – til forsiden", meny: "Meny", lukk: "Lukk", hovedmeny: "Hovedmeny",
    cta: "Snakk med oss", ctaHref: "/kontakt", bunnmeny: "Bunnmeny", personvern: ["Personvern", "/personvern"], drives: "Drives av", orgnr: "org.nr." },
  en: { hopp: "Skip to content", tilForsiden: "Cidea Marketing – home", meny: "Menu", lukk: "Close", hovedmeny: "Main menu",
    cta: "Discuss a project", ctaHref: "/contact", bunnmeny: "Footer menu", personvern: ["Privacy", "/privacy"], drives: "Operated by", orgnr: "org. no." },
};

/** Språkvelger: lenke til samme side på det andre språket (eller forsiden der siden ikke finnes). Ingen automatisk omdirigering. */
function Sprakvalg({ sti, klasse = "" }) {
  const s = sprakLenke(sti || "/no");
  return <a className={`cm-sprak ${klasse}`} href={s.href} hrefLang={s.lang} lang={s.lang} aria-label={s.etikett}>{s.tekst}</a>;
}

/** Setter tittel, beskrivelse og kanonisk adresse for siden (erstatter den umonterte Meta i gammel kode). */
export function useMeta({ tittel, beskrivelse, sti }) {
  useEffect(() => {
    document.title = tittel;
    document.querySelector('meta[name="description"]')?.setAttribute("content", beskrivelse);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://cideamarketing.com${sti === "/" ? "/" : sti}`);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", tittel);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", beskrivelse);
  }, [tittel, beskrivelse, sti]);
}

// aria-current: "page" på lenken til siden man står på, "true" på overordnet seksjon (f.eks. Tjenester på en
// tjenesteside, Innsikt på en artikkel). sti er sidens egen adresse, seksjon er menypunktet den hører under.
const naa = (href, sti, seksjon) => (href === sti ? "page" : href === seksjon ? "true" : undefined);

function Toppmeny({ sti, seksjon, lang }) {
  const t = tekster[lang]; const forside = forsideFor(lang);
  const [apen, setApen] = useState(false);
  const knapp = useRef(null);
  const panel = useRef(null);
  const id = useId();

  // Åpnet meny: fokus til første lenke. Escape lukker og gir fokus tilbake til knappen.
  useEffect(() => {
    if (!apen) return;
    panel.current?.querySelector("a")?.focus();
    const tast = e => { if (e.key === "Escape") { setApen(false); knapp.current?.focus(); } };
    document.addEventListener("keydown", tast);
    return () => document.removeEventListener("keydown", tast);
  }, [apen]);

  return (
    <header className="cm-topp">
      <div className="cm-wrap cm-topp-rad">
        <a className="cm-ordmerke" href={forside} aria-label={t.tilForsiden} aria-current={naa(forside, sti)}>CIDEA MARKETING</a>
        <button ref={knapp} className="cm-menyknapp" type="button" aria-expanded={apen} aria-controls={id}
          onClick={() => setApen(v => !v)}><span className="cm-hamburger" aria-hidden="true" />{apen ? t.lukk : t.meny}</button>
        <nav id={id} ref={panel} className="cm-meny" data-apen={apen ? "1" : "0"} aria-label={t.hovedmeny}
          onBlur={e => { if (apen && !panel.current?.contains(e.relatedTarget) && e.relatedTarget !== knapp.current) setApen(false); }}>
          <ul>
            {(lang === "en" ? menyEn : meny).map(m => (
              <li key={m.href}><a href={m.href} aria-current={naa(m.href, sti, seksjon)}
                onClick={() => setApen(false)}>{m.tekst}</a></li>
            ))}
            <li><Sprakvalg sti={sti} /></li>
          </ul>
          <a className="cm-knapp cm-meny-cta" href={t.ctaHref} aria-current={naa(t.ctaHref, sti, seksjon)} onClick={() => setApen(false)}>{t.cta}</a>
        </nav>
      </div>
    </header>
  );
}

function Bunn({ sti, seksjon, lang }) {
  const t = tekster[lang]; const forside = forsideFor(lang);
  const lenker = [...(lang === "en" ? menyEn : meny), { tekst: t.personvern[0], href: t.personvern[1] }];
  return (
    <footer className="cm-bunn">
      <div className="cm-wrap cm-bunn-rad">
        <a className="cm-ordmerke" href={forside} aria-label={t.tilForsiden} aria-current={naa(forside, sti)}>CIDEA MARKETING</a>
        <nav aria-label={t.bunnmeny}><ul>{lenker.map(m => <li key={m.href}><a href={m.href} aria-current={naa(m.href, sti, seksjon)}>{m.tekst}</a></li>)}<li><Sprakvalg sti={sti} /></li></ul></nav>
        <p className="cm-copy">© 2026 Cidea Marketing · {t.drives} {selskap.navn}, {t.orgnr} {selskap.orgnr}{lang === "en" ? ", Oslo, Norway" : ""} · <a href={`mailto:${selskap.epost}`}>{selskap.epost}</a></p>
      </div>
    </footer>
  );
}

/** Felles ramme for nye sider: hopp-lenke, toppmeny, innhold, bunntekst. sti = sidens adresse, seksjon = overordnet menypunkt.
 *  fastMeny: toppmenyen ligger fast øverst og er alltid tilgjengelig (brukes i filmprototypen /konsept-scroll). */
export function Ramme({ sti, seksjon = sti, fastMeny = false, lang = "no", children }) {
  return (
    <div className={fastMeny ? "cm cm-fast" : "cm"}>
      <a className="cm-hopp" href="#innhold">{tekster[lang].hopp}</a>
      <Toppmeny sti={sti} seksjon={seksjon} lang={lang} />
      <main id="innhold">{children}</main>
      <Bunn sti={sti} seksjon={seksjon} lang={lang} />
    </div>
  );
}

/** Avsluttende CTA. Standardteksten er godkjent i ChatGPT-review utkast 2 (DESIGN.md § 8); undersidene sender egen
 *  tittel og tekst tilpasset siden (godkjent av eier i oktober 2026). */
export function SluttCta({ tittel = "Klar for et overbevisende digitalt uttrykk?", tekst = "Fortell oss kort om bedriften og hva dere ønsker hjelp med. Vi tar kontakt på e-post.",
  knapp = "Snakk med oss", href = "/kontakt" }) {
  return (
    <section className="cm-cta" aria-labelledby="cta-tittel">
      <div className="cm-wrap cm-cta-rad">
        <h2 id="cta-tittel">{tittel}</h2>
        <p>{tekst}</p>
        <a className="cm-knapp cm-knapp-lys" href={href}>{knapp} <span aria-hidden="true">→</span></a>
      </div>
    </section>
  );
}
