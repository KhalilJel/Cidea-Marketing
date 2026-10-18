import React from "react";
import "../forside/forside.css";
import "./konsept-scroll.css";
import { Ramme, useMeta } from "../forside/Ramme.jsx";
import { tjenester, steg, artikler } from "../forside/Forside.jsx";

// Prototype for retningen «Fra ord til gjennomslag» (fase 5, ikke godkjent). Isolert på /konsept-scroll.
// All tekst er eksisterende, godkjent innhold, bortsett fra «Bli sett» / «Bli valgt», som kommer fra briefen.
// Bevegelsen er ren CSS (scroll-drevne animasjoner) på vanlig nettleserscroll: ingen JavaScript,
// ingen scrollmotor. Uten støtte, med redusert bevegelse eller uten JS vises en statisk og lesbar side.
export default function KonseptScroll() {
  useMeta({
    tittel: "Konsept: Fra ord til gjennomslag | Cidea Marketing",
    beskrivelse: "Prototype av en scrollstyrt forside for Cidea Marketing. Ikke publisert som forside.",
    sti: "/konsept-scroll",
  });
  return (
    <Ramme>
      <div className="ks">
        <section className="ks-start" aria-labelledby="ks-h1">
          <div className="ks-scene">
            <p className="ks-ordmerke" aria-hidden="true">CIDEA</p>
            <div className="ks-intro">
              <h1 id="ks-h1">Nettsider og helhetlig markedsføring som utvikles over tid.</h1>
              <p className="ks-ingress">Vi bygger nettsider, former merkevarer og driver målrettet SEO og digital markedsføring for bedrifter som ønsker kontinuerlig forbedring.</p>
            </div>
            <a className="cm-knapp ks-kontakt" href="/kontakt">Snakk med oss <span aria-hidden="true">→</span></a>
            <div className="ks-teppe" aria-hidden="true" />
          </div>
        </section>

        <section className="ks-bilde" aria-label="Bildescene">
          <figure className="ks-bilderamme">
            <div className="ks-plassholder">
              <p className="ks-plassholder-merke">Midlertidig bildeområde</p>
              <p className="ks-plassholder-tekst">Blått pigment som sprer seg i klart vann. Endelig bilde er ikke produsert.</p>
            </div>
          </figure>
        </section>

        <section className="ks-ord" aria-labelledby="ks-ord-tittel">
          <h2 id="ks-ord-tittel" className="ks-ordpar">
            <span className="ks-ord-1">Bli sett</span>
            <span className="ks-ord-2">Bli valgt</span>
          </h2>
          <div className="cm-wrap">
            <p className="ks-under">Vi hjelper bedrifter med nettsider, merkevare, SEO og digital markedsføring.</p>
            <ul className="ks-tjenester">
              {tjenester.map(t => (
                <li key={t.href}>
                  <a href={t.href}>
                    <h3>{t.tittel}</h3>
                    <p>{t.tekst}</p>
                    <span className="ks-lenketekst">{t.lenke} <span aria-hidden="true">→</span></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ks-rolig" aria-labelledby="ks-steg-tittel">
          <div className="cm-wrap">
            <h2 id="ks-steg-tittel">Slik jobber vi</h2>
            <p className="ks-under">Vi avklarer behov, designer og utvikler nettsiden, og kan videreutvikle løsningen etter lansering.</p>
            <ol className="ks-steg">
              {steg.map(s => <li key={s.tittel}><h3>{s.tittel}</h3><p>{s.tekst}</p></li>)}
            </ol>
          </div>
          <div className="cm-wrap ks-innsikt">
            <h2 id="ks-innsikt-tittel">Innsikt</h2>
            <p className="ks-under">Artikler om nettsider, synlighet og merkevare.</p>
            <ul className="ks-artikler" aria-labelledby="ks-innsikt-tittel">
              {artikler.map(a => (
                <li key={a.slug}>
                  <a href={`/blog/${a.slug}`}>
                    <span className="ks-tema">{a.tema}</span>
                    <h3>{a.tittel}</h3>
                    <p>{a.utdrag}</p>
                    <span className="ks-lenketekst">Les artikkelen <span aria-hidden="true">→</span></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ks-slutt" aria-labelledby="ks-cta-tittel">
          <p className="ks-slutt-merke" aria-hidden="true">CIDEA</p>
          <div className="cm-wrap ks-slutt-rad">
            <h2 id="ks-cta-tittel">Klar for et overbevisende digitalt uttrykk?</h2>
            <p>Fortell oss kort om bedriften og hva dere ønsker hjelp med. Vi tar kontakt på e-post.</p>
            <a className="cm-knapp cm-knapp-lys" href="/kontakt">Snakk med oss <span aria-hidden="true">→</span></a>
          </div>
        </section>
      </div>
    </Ramme>
  );
}
