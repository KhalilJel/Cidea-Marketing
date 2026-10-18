import React from "react";
import "../forside/forside.css";
import "./sider.css";
import { Ramme, SluttCta, useMeta } from "../forside/Ramme.jsx";
import { tjenesteSider, selskap } from "./tjenester-innhold.js";
import { artikler, ArtikkelTekst } from "./artikler.jsx";
import { gullkornetSeksjoner, gullkornetSistOppdatert } from "./personvern-gullkornet.js";

// Undersider (fase 6): rolig, oversiktlig oppsett med godkjente fonter og farger. Ingen nye figurer eller bilder.
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

function Steg({ steg, tittel = "Slik foregår samarbeidet", id = "steg" }) {
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
  useMeta({ tittel: "Tjenester | Cidea Marketing", beskrivelse: "Nettsider, merkevarebygging, SEO og digital markedsføring for bedrifter.", sti: "/tjenester" });
  return (
    <Ramme aktiv="/tjenester">
      <Sidehode tittel="Dette kan vi hjelpe dere med" ingress="Vi hjelper bedrifter med nettsider, merkevare, SEO og digital markedsføring. Tjenestene kan brukes hver for seg eller sammen." />
      <section className="cm-seksjon sd-seksjon sd-tett" aria-label="Tjenester">
        <div className="cm-wrap">
          <ul className="sd-tjenester">
            {tjenesteSider.map(t => (
              <li key={t.sti} className={`sd-strek-${t.farge}`}>
                <h2><a href={t.sti}>{t.navn}</a></h2>
                <p className="sd-tjeneste-ingress">{t.ingress}</p>
                <p>{t.behov}</p>
                <a className="sd-lenke" href={t.sti} aria-hidden="true" tabIndex={-1}>Les om {t.navn === "SEO" ? t.navn : t.navn.toLowerCase()} <span>→</span></a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="cm-seksjon cm-lys sd-seksjon" aria-labelledby="usikker">
        <div className="cm-wrap sd-smal">
          <h2 id="usikker">Riktige tiltak for bedriften deres</h2>
          <p>Vi tar utgangspunkt i målene deres og prioriterer tiltakene som støtter dem. Noen ganger betyr det å forbedre det dere allerede har. Andre ganger trengs en ny løsning.</p>
          <a className="cm-knapp" href="/kontakt">Snakk med oss <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </Ramme>
  );
}

export function TjenesteSide({ t }) {
  useMeta({ tittel: `${t.navn} | Cidea Marketing`, beskrivelse: t.ingress, sti: t.sti });
  return (
    <Ramme aktiv="/tjenester">
      <Sidehode sti={[["Tjenester", "/tjenester"], [t.navn]]} tittel={t.tittel} ingress={t.ingress}>
        <div className="sd-handling">
          <a className="cm-knapp" href="/kontakt">Snakk med oss <span aria-hidden="true">→</span></a>
          <a className="cm-lenke" href="#leveranse">Hva vi leverer <span aria-hidden="true">↓</span></a>
        </div>
      </Sidehode>
      <section className="cm-seksjon sd-seksjon sd-tett" aria-labelledby="behov">
        <div className="cm-wrap sd-to">
          <h2 id="behov">Hva vi hjelper med</h2>
          <p className="sd-brod">{t.behov}</p>
        </div>
      </section>
      <section id="leveranse" className="cm-seksjon sd-seksjon" aria-labelledby="leveranse-tittel">
        <div className="cm-wrap sd-to">
          <h2 id="leveranse-tittel">Hva leveransen kan inneholde</h2>
          <dl className="sd-rader">{t.leveranse.map(([n, x]) => <div key={n}><dt>{n}</dt><dd>{x}</dd></div>)}</dl>
        </div>
      </section>
      <Steg steg={t.steg} />
      <section className="cm-seksjon sd-seksjon" aria-labelledby="videre">
        <div className="cm-wrap sd-to">
          <h2 id="videre">Videre etter leveransen</h2>
          <p className="sd-brod">{t.videre}</p>
        </div>
      </section>
      <ArtikkelListe slugs={t.artikler} overskrift="Les videre" id="les-videre" />
      <SluttCta />
    </Ramme>
  );
}

/* ---------- Om oss ---------- */
export function OmOss() {
  useMeta({ tittel: "Om oss | Cidea Marketing", beskrivelse: "Cidea Marketing hjelper bedrifter med nettsider, merkevarebygging, SEO og digital markedsføring.", sti: "/om-oss" });
  return (
    <Ramme aktiv="/om-oss">
      <Sidehode tittel="Om Cidea Marketing" ingress="Cidea Marketing hjelper bedrifter med å bli enklere å forstå, finne og velge på nett. Vi lager nettsider, bygger merkevarer og jobber med SEO og digital markedsføring – og kan videreutvikle løsningene etter lansering." />
      <section className="cm-seksjon sd-seksjon sd-tett" aria-labelledby="tilbyr">
        <div className="cm-wrap sd-to">
          <h2 id="tilbyr">Hva vi tilbyr</h2>
          <dl className="sd-rader">{tjenesteSider.map(t => <div key={t.sti}><dt><a href={t.sti}>{t.navn}</a></dt><dd>{t.ingress}</dd></div>)}</dl>
        </div>
      </section>
      <section className="cm-seksjon cm-lys sd-seksjon" aria-labelledby="anbefalinger">
        <div className="cm-wrap sd-to">
          <h2 id="anbefalinger">Anbefalinger ut fra målene deres</h2>
          <p className="sd-brod">Vi anbefaler det som faktisk støtter målene deres, ikke mest mulig. Er nettsiden eller merkevaren dere har god nok, sier vi det og foreslår forbedringer i stedet for noe nytt.</p>
        </div>
      </section>
      <Steg tittel="Slik jobber vi" id="slik" steg={[
        ["Avklare behov", "Vi går gjennom virksomheten, målgruppen og målene."],
        ["Designe og utvikle", "Vi lager struktur, design og innhold og bygger løsningen."],
        ["Videreutvikle", "Etter lansering kan vi forbedre og vedlikeholde løsningen over tid."],
      ]} />
      <section className="cm-seksjon sd-seksjon" aria-labelledby="forvente">
        <div className="cm-wrap sd-to">
          <h2 id="forvente">Hva dere kan forvente</h2>
          <ul className="sd-punkter">
            <li>Tydelige avklaringer før vi starter</li>
            <li>Forslag basert på hva bedriften faktisk trenger</li>
            <li>Løpende forbedringer når det er avtalt</li>
            <li>Åpen dialog om prioriteringer</li>
          </ul>
        </div>
      </section>
      <section className="cm-seksjon cm-lys sd-seksjon" aria-labelledby="selskapet">
        <div className="cm-wrap sd-to">
          <h2 id="selskapet">Selskapet</h2>
          <div className="sd-brod">
            <p>Cidea Marketing drives av {selskap.navn}, org.nr. {selskap.orgnr}, {selskap.adresse}.</p>
            <p>Kontakt: <a href={`mailto:${selskap.epost}`}>{selskap.epost}</a></p>
          </div>
        </div>
      </section>
      <SluttCta />
    </Ramme>
  );
}

/* ---------- Innsikt ---------- */
export function Innsikt() {
  useMeta({ tittel: "Innsikt | Cidea Marketing", beskrivelse: "Artikler om nettsider, synlighet og merkevare.", sti: "/blog" });
  return (
    <Ramme aktiv="/blog">
      <Sidehode tittel="Innsikt" ingress="Artikler om nettsider, synlighet og merkevare." />
      <section className="cm-seksjon sd-seksjon sd-tett" aria-label="Artikler">
        <div className="cm-wrap">
          <ul className="sd-artikler sd-artikler-stor">
            {artikler.map(a => (
              <li key={a.slug}>
                <a href={`/blog/${a.slug}`}>
                  <span className="sd-tema">{a.tema}</span>
                  <h2>{a.tittel}</h2>
                  <p>{a.utdrag}</p>
                  <span className="sd-lenke">Les artikkelen <span aria-hidden="true">→</span></span>
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

export function Artikkel({ a }) {
  useMeta({ tittel: `${a.tittel} | Cidea Marketing`, beskrivelse: a.utdrag, sti: `/blog/${a.slug}` });
  return (
    <Ramme aktiv="/blog">
      <article>
        <Sidehode sti={[["Innsikt", "/blog"], [a.tittel]]} tittel={a.tittel}>
          <p className="sd-tema">{a.tema}</p>
        </Sidehode>
        <div className="cm-wrap">
          <div className="sd-artikkel"><ArtikkelTekst kilde={a.kilde} /></div>
          <p className="sd-tilbake"><a className="cm-lenke" href="/blog"><span aria-hidden="true">←</span> Alle artikler</a></p>
        </div>
      </article>
      <SluttCta />
    </Ramme>
  );
}

/* ---------- Personvern ---------- */
export function Personvern() {
  useMeta({ tittel: "Personvern | Cidea Marketing", beskrivelse: "Slik behandler Cidea Marketing personopplysninger.", sti: "/personvern" });
  return (
    <Ramme>
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
    <Ramme aktiv="/kontakt">
      <Sidehode tittel="Henvendelsen er sendt" ingress="Takk for henvendelsen. Skjemaløsningen har tatt imot meldingen, og vi svarer på e-post." />
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
      </div>
    </Ramme>
  );
}
