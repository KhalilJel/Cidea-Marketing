import React from "react";
import "./forside.css";
import { Motiv, Grafikk } from "./Motiv.jsx";
import { Ramme, SluttCta, useMeta } from "./Ramme.jsx";

// All tekst er godkjent i fase 3 (DESIGN.md § 8, ChatGPT-review utkast 2) eller hentet ordrett
// fra eksisterende innhold (blog/*.md). Ingen nye faktapåstander.
export const tjenester = [
  { tittel: "Nettsider", tekst: "Vi designer og koder funksjonelle nettsider med klar struktur og god brukeropplevelse for bedrifter.", lenke: "Les om nettsider", href: "/websites", felt: "marine", glyf: "glyf-nettsider" },
  { tittel: "Merkevarebygging", tekst: "Vi utvikler visuelle identiteter, typografi og fargesystemer som gjør virksomheten tydelig og gjenkjennelig.", lenke: "Les om merkevarebygging", href: "/branding", felt: "dyp", glyf: "glyf-merkevarebygging" },
  { tittel: "SEO", tekst: "Vi optimaliserer teknisk struktur og innhold for å gi bedre organisk synlighet for relevante søk.", lenke: "Les om SEO", href: "/seo", felt: "skog", glyf: "glyf-seo" },
  { tittel: "Digital markedsføring og sosiale medier", tekst: "Vi utformer målrettede kampanjer og innhold som gir jevn synlighet mot riktige målgrupper over tid.", lenke: "Les om digital markedsføring", href: "/digital-marketing", felt: "svart", glyf: "glyf-digital-markedsforing" },
];

export const steg = [
  { tittel: "Avklare behov", tekst: "Vi går gjennom virksomheten, målgruppen og målene.", farge: "marine" },
  { tittel: "Designe og utvikle", tekst: "Vi lager struktur, design og innhold og bygger løsningen.", farge: "dyp" },
  { tittel: "Videreutvikle", tekst: "Etter lansering kan vi forbedre og vedlikeholde løsningen over tid.", farge: "skog" },
];

export const artikler = [
  { slug: "hvor-mye-koster-en-nettside", tema: "Nettsider", tittel: "Hvor mye koster en nettside?", utdrag: "Prisen på en nettside varierer mye. Det viktigste er ikke antall sider eller hvor avansert designet er, men hva nettsiden skal gjøre for virksomheten." },
  { slug: "hva-bor-en-god-bedriftsnettside-inneholde", tema: "Nettsider", tittel: "Hva bør en god bedriftsnettside inneholde?", utdrag: "En god bedriftsnettside skal gjøre det enkelt for en besøkende å forstå tre ting: hvem dere er, hva dere tilbyr og hva neste steg er." },
  { slug: "hvorfor-vises-ikke-nettsiden-pa-google", tema: "SEO", tittel: "Hvorfor vises ikke nettsiden på Google?", utdrag: "Det kan være mange grunner til at en nettside får lite synlighet i Google. Teknisk struktur, innhold, søkeintensjon, konkurranse og autoritet spiller alle en rolle." },
];

export default function Forside() {
  useMeta({
    tittel: "Cidea Marketing – Nettsider og helhetlig markedsføring",
    beskrivelse: "Vi bygger nettsider, former merkevarer og driver målrettet SEO og digital markedsføring for bedrifter som ønsker kontinuerlig forbedring.",
    sti: "/",
  });
  return (
    <Ramme aktiv="/">
      <section className="cm-hero" aria-labelledby="h1">
        <div className="cm-wrap cm-hero-rad">
          <div className="cm-hero-tekst">
            <h1 id="h1">Nettsider og helhetlig markedsføring som utvikles over tid.</h1>
            <p className="cm-ingress">Vi bygger nettsider, former merkevarer og driver målrettet SEO og digital markedsføring for bedrifter som ønsker kontinuerlig forbedring.</p>
            <div className="cm-handling">
              <a className="cm-knapp" href="/kontakt">Snakk med oss <span aria-hidden="true">→</span></a>
              <a className="cm-lenke" href="#konsept">Se konseptet <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <div className="cm-hero-kunst cm-inngang">
            <Motiv navn="forside-desktop" className="cm-kun-desktop" />
            <Motiv navn="forside-mobil" className="cm-kun-mobil" />
          </div>
        </div>
      </section>

      <section id="tjenester" className="cm-seksjon" aria-labelledby="tjenester-tittel">
        <div className="cm-wrap">
          <h2 id="tjenester-tittel">Dette kan vi hjelpe dere med</h2>
          <p className="cm-under">Vi hjelper bedrifter med nettsider, merkevare, SEO og digital markedsføring.</p>
          <ul className="cm-tjenester">
            {tjenester.map(t => (
              <li key={t.href} className={`cm-felt-${t.felt}`}>
                <a href={t.href}>
                  <Grafikk navn={t.glyf} className="cm-markor" />
                  <h3>{t.tittel}</h3>
                  <p>{t.tekst}</p>
                  <span className="cm-felt-lenke">{t.lenke} <span aria-hidden="true">→</span></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="konsept" className="cm-seksjon" aria-labelledby="konsept-tittel">
        <div className="cm-wrap cm-konsept">
          <div>
            <h2 id="konsept-tittel">Konsepter</h2>
            <p className="cm-merke">Konsept – ikke kundeprosjekt</p>
            <h3>Cidea-motivet – et geometrisk system</h3>
            <p>En undersøkelse av hvordan sammenkoblede fargeplan og ett diagonalt hakk kan bære en hel visuell identitet.</p>
          </div>
          <div className="cm-konsept-kunst"><Grafikk navn="konsepter-mobil" /></div>
        </div>
      </section>

      <section id="slik-jobber-vi" className="cm-seksjon cm-lys" aria-labelledby="steg-tittel">
        <div className="cm-wrap">
          <h2 id="steg-tittel">Slik jobber vi</h2>
          <p className="cm-under">Vi avklarer behov, designer og utvikler nettsiden, og kan videreutvikle løsningen etter lansering.</p>
          <ol className="cm-steg">
            {steg.map(s => <li key={s.tittel} className={`cm-steg-${s.farge}`}><h3>{s.tittel}</h3><p>{s.tekst}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="cm-seksjon" aria-labelledby="innsikt-tittel">
        <div className="cm-wrap">
          <h2 id="innsikt-tittel">Innsikt</h2>
          <p className="cm-under">Artikler om nettsider, synlighet og merkevare.</p>
          <ul className="cm-artikler">
            {artikler.map(a => (
              <li key={a.slug}>
                <a href={`/blog/${a.slug}`}>
                  <Grafikk navn={`artikkel-${a.slug}`} className="cm-artikkel-kunst" />
                  <span className="cm-tema">{a.tema}</span>
                  <h3>{a.tittel}</h3>
                  <p>{a.utdrag}</p>
                  <span className="cm-les">Les artikkelen <span aria-hidden="true">→</span></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SluttCta />
    </Ramme>
  );
}
