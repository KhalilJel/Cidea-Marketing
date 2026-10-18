import React, { useEffect, useId, useRef, useState } from "react";
import { selskap } from "../sider/tjenester-innhold.js";

// Fase 6: én sammenhengende meny for prototypen og undersidene. Kontakt nås via knappen «Snakk med oss».
export const meny = [
  { tekst: "Tjenester", href: "/tjenester" },
  { tekst: "Om oss", href: "/om-oss" },
  { tekst: "Innsikt", href: "/blog" },
];

// I forhåndsvisningsflyten fører logoen til arbeidsforsiden (scrollprototypen). Ordinær / er ikke erstattet.
// Settes til "/" når eier har godkjent ny forside.
export const FORSIDE = "/konsept-scroll";

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

function Toppmeny({ aktiv }) {
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
        <a className="cm-ordmerke" href={FORSIDE} aria-label="Cidea Marketing – til forsiden">CIDEA MARKETING</a>
        <button ref={knapp} className="cm-menyknapp" type="button" aria-expanded={apen} aria-controls={id}
          onClick={() => setApen(v => !v)}>{apen ? "Lukk" : "Meny"}</button>
        <nav id={id} ref={panel} className="cm-meny" data-apen={apen ? "1" : "0"} aria-label="Hovedmeny"
          onBlur={e => { if (apen && !panel.current?.contains(e.relatedTarget) && e.relatedTarget !== knapp.current) setApen(false); }}>
          <ul>
            {meny.map(m => (
              <li key={m.href}><a href={m.href} aria-current={aktiv === m.href ? "page" : undefined}
                onClick={() => setApen(false)}>{m.tekst}</a></li>
            ))}
          </ul>
          <a className="cm-knapp cm-meny-cta" href="/kontakt" aria-current={aktiv === "/kontakt" ? "page" : undefined} onClick={() => setApen(false)}>Snakk med oss</a>
        </nav>
      </div>
    </header>
  );
}

function Bunn() {
  return (
    <footer className="cm-bunn">
      <div className="cm-wrap cm-bunn-rad">
        <a className="cm-ordmerke" href={FORSIDE} aria-label="Cidea Marketing – til forsiden">CIDEA MARKETING</a>
        <nav aria-label="Bunnmeny"><ul>{meny.map(m => <li key={m.href}><a href={m.href}>{m.tekst}</a></li>)}<li><a href="/kontakt">Kontakt</a></li><li><a href="/personvern">Personvern</a></li></ul></nav>
        <p className="cm-copy">© 2026 Cidea Marketing · Drives av {selskap.navn}, org.nr. {selskap.orgnr} · <a href={`mailto:${selskap.epost}`}>{selskap.epost}</a></p>
      </div>
    </footer>
  );
}

/** Felles ramme for nye sider: hopp-lenke, toppmeny, innhold, bunntekst. */
export function Ramme({ aktiv, children }) {
  return (
    <div className="cm">
      <a className="cm-hopp" href="#innhold">Hopp til innhold</a>
      <Toppmeny aktiv={aktiv} />
      <main id="innhold">{children}</main>
      <Bunn />
    </div>
  );
}

/** Avsluttende CTA – godkjent tekst (ChatGPT-review utkast 2, DESIGN.md § 8). */
export function SluttCta() {
  return (
    <section className="cm-cta" aria-labelledby="cta-tittel">
      <div className="cm-wrap cm-cta-rad">
        <h2 id="cta-tittel">Klar for et overbevisende digitalt uttrykk?</h2>
        <p>Fortell oss kort om bedriften og hva dere ønsker hjelp med. Vi tar kontakt på e-post.</p>
        <a className="cm-knapp cm-knapp-lys" href="/kontakt">Snakk med oss <span aria-hidden="true">→</span></a>
      </div>
    </section>
  );
}
