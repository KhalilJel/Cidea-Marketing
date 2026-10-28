import React from "react";
import "../forside/forside.css";
import "./sider.css";
import { Ramme, SluttCta, useMeta } from "../forside/Ramme.jsx";
import { tjenesteSider, selskap } from "./tjenester-innhold.js";
import { artikler, ArtikkelTekst, RikTekst, inline } from "./artikler.jsx";
import { siderMeta } from "./sider-meta.js";
import { gullkornetSeksjoner, gullkornetSistOppdatert } from "./personvern-gullkornet.js";

// Undersider (fase 6): rolig, oversiktlig oppsett med godkjente fonter og farger. Ingen nye figurer eller bilder.
// Tekstene er oppdatert med innholdet eier godkjente i oktober 2026.
// Estetisk finpuss vurderes med eier senere; denne runden gjelder struktur, innhold og funksjon.

function Sidehode({ sti, tittel, ingress, children }) {
  return (
    <header className="sd-hode">
      <div className="cm-wrap">
        {sti && <nav className="sd-sti" aria-label="Brødsmuler"><ol>{sti.map(([t, h]) => <li key={t}>{h ? <a href={h}>{t}</a> : <span aria-current="page">{t}</span>}</li>)}</ol></nav>}
        <h1 id="h1">{tittel}</h1>
        {ingress && <p className="sd-ingress">{ingress}</p>}
        {children}
      </div>
    </header>
  );
}

function Steg({ steg, tittel, id = "steg" }) {
  tittel = tittel || "Slik foregår samarbeidet";
  const farger = ["marine", "dyp", "skog"];
  return (
    <section className="cm-seksjon cm-lys sd-seksjon" aria-labelledby={id}>
      <div className="cm-wrap">
        <h2 id={id}>{tittel}</h2>
        <ol className="cm-steg">{steg.map(([t, x], i) => <li key={t} className={`cm-steg-${farger[i % 3]}`}><h3>{t}</h3><p>{x}</p></li>)}</ol>
      </div>
    </section>
  );
}

function ArtikkelListe({ slugs, overskrift, id }) {
  const liste = slugs.map(s => artikler.find(a => a.slug === s)).filter(Boolean);
  if (!liste.length) return null;
  return (
    <section className="cm-seksjon sd-seksjon" aria-labelledby={id}>
      <div className="cm-wrap">
        <h2 id={id}>{overskrift}</h2>
        <ul className="sd-artikler">
          {liste.map(a => (
            <li key={a.slug}>
              <a href={`/blog/${a.slug}`}>
                <span className="sd-tema">{a.tema}</span>
                <h3>{a.tittel}</h3>
                <p>{a.utdrag}</p>
                {a.oppdatert && <p className="sd-dato">Oppdatert {a.oppdatert}</p>}
                <span className="sd-lenke">Les artikkelen <span aria-hidden="true">→</span></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Tjenester ---------- */
export function Tjenester() {
  useMeta({ tittel: siderMeta["/tjenester"].tittel, beskrivelse: siderMeta["/tjenester"].beskrivelse, sti: "/tjenester" });
  return (
    <Ramme sti="/tjenester">
      <Sidehode tittel="Nettsider, merkevare, SEO og digital markedsføring" ingress="Nettsider er hovedtjenesten vår. De andre tjenestene kan dere kjøpe hver for seg, eller sammen med en ny nettside når det gir mening." />
      <section className="cm-seksjon sd-seksjon sd-tett" aria-label="Tjenester">
        <div className="cm-wrap">
          <ul className="sd-tjenester">
            {tjenesteSider.map(t => (
              <li key={t.sti} className={`sd-strek-${t.farge}`}>
                <h2><a href={t.sti}>{t.navn}</a></h2>
                <p className="sd-tjeneste-ingress">{t.oversikt}</p>
                <p><strong>Passer når:</strong> {t.passer}</p>
                <a className="sd-lenke" href={t.sti} aria-hidden="true" tabIndex={-1}>{t.lenketekst} <span>→</span></a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="cm-seksjon cm-lys sd-seksjon" aria-labelledby="usikker">
        <div className="cm-wrap sd-smal">
          <h2 id="usikker">Usikre på hvor dere bør starte?</h2>
          <p>Mange starter med nettsiden, fordi det er der kundene sjekker dere før de tar kontakt. Noen ganger er det smartere å forbedre det dere har. Fortell kort om bedriften, så foreslår vi et fornuftig første steg.</p>
          <a className="cm-knapp" href="/kontakt">Snakk med oss <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </Ramme>
  );
}

export function TjenesteSide({ t }) {
  useMeta({ tittel: t.metaTittel, beskrivelse: t.beskrivelse, sti: t.sti });
  return (
    <Ramme sti={t.sti} seksjon="/tjenester">
      <Sidehode sti={[["Tjenester", "/tjenester"], [t.navn]]} tittel={t.tittel} ingress={t.ingress}>
        <div className="sd-handling">
          <a className="cm-knapp" href="/kontakt">{t.handling || "Snakk med oss"} <span aria-hidden="true">→</span></a>
          <a className="cm-lenke" href="#leveranse">{t.ankerTekst || "Hva vi leverer"} <span aria-hidden="true">↓</span></a>
        </div>
      </Sidehode>
      <section className="cm-seksjon sd-seksjon sd-tett" aria-labelledby="behov">
        <div className="cm-wrap sd-to">
          <h2 id="behov">{t.behovTittel || "Hva vi hjelper med"}</h2>
          <p className="sd-brod">{t.behov}</p>
        </div>
      </section>
      <section id="leveranse" className="cm-seksjon sd-seksjon" aria-labelledby="leveranse-tittel">
        <div className="cm-wrap sd-to">
          <h2 id="leveranse-tittel">{t.leveranseTittel || "Hva leveransen kan inneholde"}</h2>
          <dl className="sd-rader">{t.leveranse.map(([n, x]) => <div key={n}><dt>{n}</dt><dd>{inline(x, n)}</dd></div>)}</dl>
        </div>
      </section>
      <Steg steg={t.steg} tittel={t.stegTittel} />
      {t.pris && (
        <section className="cm-seksjon sd-seksjon" aria-labelledby="pris">
          <div className="cm-wrap sd-to">
            <h2 id="pris">{t.pris.tittel}</h2>
            <div className="sd-brod">
              <p>{t.pris.tekst}</p>
              <ul className="sd-liste">{t.pris.punkter.map(p => <li key={p}>{p}</li>)}</ul>
              <p>{t.pris.etter}</p>
              <p><a className="cm-lenke" href={t.pris.lenke[1]}>{t.pris.lenke[0]} <span aria-hidden="true">→</span></a></p>
            </div>
          </div>
        </section>
      )}
      {t.eksempel && (
        <section className="cm-seksjon cm-lys sd-seksjon" aria-labelledby="eksempel">
          <div className="cm-wrap sd-to">
            <h2 id="eksempel">{t.eksempel.tittel}</h2>
            <div className="sd-brod">
              <p>{t.eksempel.tekst}</p>
              <p><a className="cm-lenke" href={t.eksempel.lenke[1]}>{t.eksempel.lenke[0]} <span aria-hidden="true">→</span></a></p>
            </div>
          </div>
        </section>
      )}
      <section className="cm-seksjon sd-seksjon" aria-labelledby="videre">
        <div className="cm-wrap sd-to">
          <h2 id="videre">{t.videreTittel || "Videre etter leveransen"}</h2>
          <div className="sd-brod"><RikTekst tekst={t.videre} /></div>
        </div>
      </section>
      {t.faq && (
        <section className="cm-seksjon cm-lys sd-seksjon" aria-labelledby="faq">
          <div className="cm-wrap sd-to">
            <h2 id="faq">{t.faqTittel}</h2>
            <div className="sd-faq">
              {t.faq.map(([s, svar]) => (
                <details key={s}>
                  <summary><h3>{s}</h3></summary>
                  <p>{inline(svar, s)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
      <ArtikkelListe slugs={t.artikler} overskrift="Les videre" id="les-videre" />
      <SluttCta {...t.avslutning} />
    </Ramme>
  );
}

/* ---------- Om oss ---------- */
const verdier = [
  ["Klarhet", "En nettside skal gjøre det lett å forstå hva dere tilbyr. Det gjelder også hvordan vi forklarer vårt eget arbeid."],
  ["Ærlighet", "Vi anbefaler det dere trenger, også når det er mindre enn dere spurte om."],
  ["Forutsigbarhet", "Dere vet hva som inngår, hva det koster og når det blir ferdig, før vi starter."],
  ["Langsiktighet", "En nettside er aldri helt ferdig. Vi blir gjerne med videre og forbedrer den over tid."],
];
const forventninger = [
  ["Tydelig omfang før start.", "Dere vet hva som inngår og hva det koster før vi begynner."],
  ["Fast pris på nettsideprosjekter.", "Prisen avtales etter at behovet er avklart."],
  ["Råd basert på behov.", "Vi sier fra når noe ikke er nødvendig."],
  ["Åpen dialog om prioriteringer.", "Vi forklarer valgene uten unødvendig fagspråk."],
  ["Videre arbeid etter avtale.", "Drift, vedlikehold og forbedringer avtales når dere trenger det."],
];

export function OmOss() {
  useMeta({ tittel: siderMeta["/om-oss"].tittel, beskrivelse: siderMeta["/om-oss"].beskrivelse, sti: "/om-oss" });
  return (
    <Ramme sti="/om-oss">
      <Sidehode tittel="Vi lager nettsider som gjør det lettere å forstå hva bedrifter tilbyr" ingress="Cidea Marketing er et norsk byrå som lager nettsider for bedrifter som selger tjenester. Vi hjelper også med merkevare, SEO og digital markedsføring, og blir gjerne med videre etter lansering." />
      <section className="cm-seksjon sd-seksjon sd-tett" aria-labelledby="verdier">
        <div className="cm-wrap sd-to">
          <h2 id="verdier">Det vi står for</h2>
          <dl className="sd-rader">{verdier.map(([n, x]) => <div key={n}><dt>{n}</dt><dd>{x}</dd></div>)}</dl>
        </div>
      </section>
      <section className="cm-seksjon cm-lys sd-seksjon" aria-labelledby="slik-jobber">
        <div className="cm-wrap sd-to">
          <h2 id="slik-jobber">Slik jobber vi</h2>
          <div className="sd-brod">
            <p>Vi anbefaler det som støtter målene deres, ikke mest mulig arbeid. Er nettsiden deres god nok, foreslår vi forbedringer i stedet for å bygge nytt. Vi skriver tekstene selv, fordi en nettside sjelden blir bedre enn det den forteller.</p>
            <h3>Dette kan dere forvente</h3>
            <ul className="sd-punkter">{forventninger.map(([n, x]) => <li key={n}><strong>{n}</strong> {x}</li>)}</ul>
          </div>
        </div>
      </section>
      <Steg tittel="Fra første samtale til ferdig nettside" id="slik" steg={[
        ["Avklare behov", "Vi går gjennom bedriften, målgruppen og målene."],
        ["Designe og utvikle", "Vi lager struktur, tekst, design og løsning."],
        ["Videreutvikle", "Vi forbedrer og vedlikeholder etter lansering, når dere ønsker det."],
      ]} />
      <div className="cm-wrap sd-avslutt"><a className="cm-lenke" href="/websites">Les mer om hvordan vi lager nettsider <span aria-hidden="true">→</span></a></div>
      <section className="cm-seksjon cm-lys sd-seksjon" aria-labelledby="selskapet">
        <div className="cm-wrap sd-to">
          <h2 id="selskapet">Om selskapet</h2>
          <div className="sd-brod">
            <p>Cidea Marketing drives av {selskap.navn}, org.nr. {selskap.orgnr}. Vi holder til i {selskap.adresse}, og jobber med bedrifter i hele Norge.</p>
            <p>Kontakt: <a href={`mailto:${selskap.epost}`}>{selskap.epost}</a></p>
          </div>
        </div>
      </section>
      <SluttCta tittel="Vil dere bli kjent med oss?" tekst="Fortell kort om bedriften og hva dere trenger hjelp med. Vi svarer på e-post." />
    </Ramme>
  );
}

/* ---------- Innsikt ---------- */
export function Innsikt() {
  useMeta({ tittel: siderMeta["/blog"].tittel, beskrivelse: siderMeta["/blog"].beskrivelse, sti: "/blog" });
  return (
    <Ramme sti="/blog">
      <Sidehode tittel="Innsikt" ingress="Praktiske svar for dere som vurderer ny nettside: pris, innhold, prosess og synlighet i Google." />
      <section className="cm-seksjon sd-seksjon sd-tett" aria-label="Artikler">
        <div className="cm-wrap">
          <ul className="sd-artikler sd-artikler-stor">
            {artikler.map(a => (
              <li key={a.slug}>
                <a href={`/blog/${a.slug}`}>
                  <span className="sd-tema">{a.tema}</span>
                  <h2>{a.tittel}</h2>
                  <p>{a.utdrag}</p>
                  {a.oppdatert && <p className="sd-dato">Oppdatert {a.oppdatert}</p>}
                  <span className="sd-lenke">Les artikkelen <span aria-hidden="true">→</span></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <SluttCta tittel="Vurderer dere ny nettside?" tekst="Fortell kort om bedriften og hva nettsiden skal hjelpe dere med, så svarer vi på e-post." />
    </Ramme>
  );
}

export function Artikkel({ a }) {
  useMeta({ tittel: a.metaTittel, beskrivelse: a.beskrivelse, sti: `/blog/${a.slug}` });
  return (
    <Ramme sti={`/blog/${a.slug}`} seksjon="/blog">
      <article>
        <Sidehode sti={[["Innsikt", "/blog"], [a.tittel]]} tittel={a.tittel}>
          <p className="sd-tema">{a.tema}{a.oppdatert && <span className="sd-dato"> · Oppdatert {a.oppdatert} · Cidea Marketing</span>}</p>
        </Sidehode>
        <div className="cm-wrap">
          <div className="sd-artikkel"><ArtikkelTekst kilde={a.kilde} /></div>
          <p className="sd-tilbake"><a className="cm-lenke" href="/blog"><span aria-hidden="true">←</span> Alle artikler</a></p>
        </div>
      </article>
      <SluttCta tittel={a.tema === "SEO" ? "Vil dere bli lettere å finne?" : "Vurderer dere ny nettside?"} tekst="Fortell kort om bedriften og hva dere ønsker hjelp med, så svarer vi på e-post." />
    </Ramme>
  );
}

/* ---------- Personvern ---------- */
export function Personvern() {
  useMeta({ tittel: "Personvern | Cidea Marketing", beskrivelse: "Slik behandler Cidea Marketing personopplysninger.", sti: "/personvern" });
  return (
    <Ramme sti="/personvern">
      <Sidehode tittel="Personvern" ingress="Slik behandler vi opplysninger på dette nettstedet, i kontaktskjemaet og ved bedriftshenvendelser gjennom Gullkornet." />
      <div className="cm-wrap">
        <div className="sd-artikkel">
          <p>Behandlingsansvarlig er {selskap.navn}, org.nr. {selskap.orgnr}, {selskap.adresse}, som driver Cidea Marketing. Kontakt om personvern: <a href={`mailto:${selskap.epost}`}>{selskap.epost}</a>.</p>

          <h2>Nettstedet</h2>
          <p>Nettstedet bruker ikke informasjonskapsler, analyseverktøy, sporingspiksler eller annonsenettverk. Skriftene ligger på vår egen server, så nettleseren henter ikke filer fra Google eller andre tredjeparter for å vise sidene.</p>
          <p>Nettstedet driftes hos Netlify. Når sidene lastes, behandler Netlify tekniske opplysninger som IP-adresse og nettlesertype for å levere sidene og beskytte tjenesten.</p>

          <h2>Kontaktskjemaet</h2>
          <p>Skjemaet samler inn navn, e-postadresse, eventuelt bedriftsnavn, hva henvendelsen gjelder og meldingen. Vi bruker opplysningene bare til å svare på henvendelsen og eventuell videre dialog som dere ber om. Grunnlaget er vår berettigede interesse i å besvare henvendelser og, der det er aktuelt, tiltak før en eventuell avtale (personvernforordningen artikkel 6 nr. 1 bokstav f og b).</p>
          <p>Skjemaet sendes gjennom Netlify sin skjemafunksjon, og innsendte henvendelser lagres hos Netlify.</p>
          <p className="sd-hull" role="note"><strong>Må fastsettes før skjemaet tas i bruk:</strong> lagringstid for henvendelser, hvordan henvendelser varsles til e-post, og om Netlify sitt overføringsgrunnlag for lagring utenfor EØS skal beskrives her.</p>

          <h2>Bedriftshenvendelser gjennom Gullkornet</h2>
          <p>Sist oppdatert: {gullkornetSistOppdatert}.</p>
          {gullkornetSeksjoner.map(([h, x]) => <section key={h}><h3>{h}</h3><p>{x}</p></section>)}
          <p><a href="https://www.datatilsynet.no/">Datatilsynet</a></p>
        </div>
      </div>
    </Ramme>
  );
}

/* ---------- Takk og 404 ---------- */
export function Takk() {
  useMeta({ tittel: "Henvendelsen er sendt | Cidea Marketing", beskrivelse: "Bekreftelse på henvendelse.", sti: "/kontakt/takk" });
  return (
    <Ramme sti="/kontakt/takk" seksjon="/kontakt">
      <Sidehode tittel="Henvendelsen er sendt" ingress="Takk, vi har mottatt henvendelsen. Vi leser den og svarer på e-post. Har vi spørsmål, tar vi dem i svaret." />
      <div className="cm-wrap sd-avslutt"><a className="cm-lenke" href="/tjenester">Se tjenestene <span aria-hidden="true">→</span></a></div>
    </Ramme>
  );
}

export function IkkeFunnet() {
  useMeta({ tittel: "Siden finnes ikke | Cidea Marketing", beskrivelse: "Siden finnes ikke.", sti: "/404" });
  return (
    <Ramme>
      <Sidehode tittel="Siden finnes ikke" ingress="Adressen kan være feil, eller siden kan være flyttet. Her er noen steder å fortsette:" />
      <div className="cm-wrap sd-avslutt">
        <ul className="sd-punkter sd-punkter-lenker">
          <li><a href="/tjenester">Tjenester</a></li>
          <li><a href="/om-oss">Om oss</a></li>
          <li><a href="/blog">Innsikt</a></li>
          <li><a href="/kontakt">Kontakt</a></li>
        </ul>
        <p lang="en" className="sd-hjelp">Page not found. <a href="/" hrefLang="en">Go to the English homepage</a>.</p>
      </div>
    </Ramme>
  );
}
