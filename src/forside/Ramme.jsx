import React, { useEffect, useId, useRef, useState } from "react";
import { selskap } from "../sider/tjenester-innhold.js";

// Felles toppmeny for undersidene og mobilmenyen.
export const meny = [
  { tekst: "Tjenester", href: "/tjenester" },
  { tekst: "Om oss", href: "/om-oss" },
  { tekst: "Innsikt", href: "/blog" },
  { tekst: "Kontakt", href: "/kontakt" },
];

// Logoen fører til forsiden i både ordinært bygg og lokalt referansebygg.
export const FORSIDE = "/";

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

function Toppmeny({ sti, seksjon }) {
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
        <a className="cm-ordmerke" href={FORSIDE} aria-label="Cidea Marketing – til forsiden" aria-current={naa(FORSIDE, sti)}>CIDEA MARKETING</a>
        <button ref={knapp} className="cm-menyknapp" type="button" aria-expanded={apen} aria-controls={id}
          onClick={() => setApen(v => !v)}><span className="cm-hamburger" aria-hidden="true" />{apen ? "Lukk" : "Meny"}</button>
        <nav id={id} ref={panel} className="cm-meny" data-apen={apen ? "1" : "0"} aria-label="Hovedmeny"
          onBlur={e => { if (apen && !panel.current?.contains(e.relatedTarget) && e.relatedTarget !== knapp.current) setApen(false); }}>
          <ul>
            {meny.map(m => (
              <li key={m.href}><a href={m.href} aria-current={naa(m.href, sti, seksjon)}
                onClick={() => setApen(false)}>{m.tekst}</a></li>
            ))}
          </ul>
          <a className="cm-knapp cm-meny-cta" href="/kontakt" aria-current={naa("/kontakt", sti, seksjon)} onClick={() => setApen(false)}>Snakk med oss</a>
        </nav>
      </div>
    </header>
  );
}

function Bunn({ sti, seksjon }) {
  return (
    <footer className="cm-bunn">
      <div className="cm-wrap cm-bunn-rad">
        <a className="cm-ordmerke" href={FORSIDE} aria-label="Cidea Marketing – til forsiden" aria-current={naa(FORSIDE, sti)}>CIDEA MARKETING</a>
        <nav aria-label="Bunnmeny"><ul>{[...meny, { tekst: "Personvern", href: "/personvern" }].map(m => <li key={m.href}><a href={m.href} aria-current={naa(m.href, sti, seksjon)}>{m.tekst}</a></li>)}</ul></nav>
        <p className="cm-copy">© 2026 Cidea Marketing · Drives av {selskap.navn}, org.nr. {selskap.orgnr} · <a href={`mailto:${selskap.epost}`}>{selskap.epost}</a></p>
      </div>
    </footer>
  );
}

/** Felles ramme for nye sider: hopp-lenke, toppmeny, innhold, bunntekst. sti = sidens adresse, seksjon = overordnet menypunkt.
 *  fastMeny: toppmenyen ligger fast øverst og er alltid tilgjengelig (brukes i filmprototypen /konsept-scroll). */
export function Ramme({ sti, seksjon = sti, fastMeny = false, children }) {
  return (
    <div className={fastMeny ? "cm cm-fast" : "cm"}>
      <a className="cm-hopp" href="#innhold">Hopp til innhold</a>
      <Toppmeny sti={sti} seksjon={seksjon} />
      <main id="innhold">{children}</main>
      <Bunn sti={sti} seksjon={seksjon} />
    </div>
  );
}

/** Avsluttende CTA. Standardteksten er godkjent i ChatGPT-review utkast 2 (DESIGN.md § 8); undersidene sender egen
 *  tittel og tekst tilpasset siden (godkjent av eier i oktober 2026). */
export function SluttCta({ tittel = "Klar for et overbevisende digitalt uttrykk?", tekst = "Fortell oss kort om bedriften og hva dere ønsker hjelp med. Vi tar kontakt på e-post." }) {
  return (
    <section className="cm-cta" aria-labelledby="cta-tittel">
      <div className="cm-wrap cm-cta-rad">
        <h2 id="cta-tittel">{tittel}</h2>
        <p>{tekst}</p>
        <a className="cm-knapp cm-knapp-lys" href="/kontakt">Snakk med oss <span aria-hidden="true">→</span></a>
      </div>
    </section>
  );
}
