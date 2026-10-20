import React, { useEffect, useRef, useState } from "react";
import "../forside/forside.css";
import "../sider/sider.css";
import { Ramme, useMeta } from "../forside/Ramme.jsx";
import { selskap } from "../sider/tjenester-innhold.js";

// Kontaktskjema (fase 6) via Netlify Forms – en del av eksisterende hosting, uten egne nøkler eller nye tjenester.
// Netlify finner skjemaet i den forhåndsrendrede HTML-en (data-netlify) ved deploy. Med JavaScript sendes det med
// fetch og siden viser lasting, feil eller bekreftelse; uten JavaScript sendes det vanlig til /kontakt/takk.
// Bekreftelse vises bare ved et vellykket svar (HTTP 2xx). Ingen falsk suksessmelding.
// Validering: den forhåndsrendrede HTML-en har nettleserens egen validering (required, type=email, minlength), som
// gjelder uten JavaScript. Når JavaScript er lastet, slås den av (noValidate) og erstattes av tilgjengelige feltfeil
// og feiloppsummering. Klientsidevalidering er ingen beskyttelse på serveren; Netlify tar imot det som sendes.
// Feltet heter «email» slik at Netlify bruker avsenderen som svaradresse i e-postvarselet; «subject» er emnelinjen.
// MOTTAK_BEKREFTET settes til true først når eier har aktivert skjemaregistrering og e-postvarsel hos Netlify
// og en testhenvendelse faktisk er mottatt (se docs/cinematic-pilot/phase6/README.md).
const MOTTAK_BEKREFTET = false;

const temaer = ["Nettsider", "Merkevarebygging", "SEO", "Digital markedsføring", "Annet"];
const tomFeil = {};

function valider(data) {
  const f = {};
  if (!data.get("navn")?.trim()) f.navn = "Skriv inn navn.";
  const e = data.get("email")?.trim() || "";
  if (!e) f.email = "Skriv inn e-postadresse.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) f.email = "E-postadressen ser ikke riktig ut. Eksempel: navn@bedrift.no";
  if (!data.get("tema")) f.tema = "Velg hva henvendelsen gjelder.";
  const m = data.get("melding")?.trim() || "";
  if (m.length < 10) f.melding = "Skriv en kort melding (minst 10 tegn).";
  return f;
}

export default function Kontakt() {
  useMeta({
    tittel: "Kontakt | Cidea Marketing",
    beskrivelse: "Ta kontakt med Cidea Marketing om nettsider, merkevarebygging, SEO eller digital markedsføring.",
    sti: "/kontakt",
  });
  const [status, setStatus] = useState("klar"); // klar | sender | sendt | feil
  const [feil, setFeil] = useState(tomFeil);
  const [js, setJs] = useState(false); // false i forhåndsrendret HTML → nettleserens validering uten JavaScript
  useEffect(() => setJs(true), []);
  const oppsummering = useRef(null);
  const bekreftelse = useRef(null);
  const feilmelding = useRef(null);

  async function send(ev) {
    ev.preventDefault();
    const skjema = ev.currentTarget; const data = new FormData(skjema);
    const f = valider(data); setFeil(f);
    if (Object.keys(f).length) { setStatus("klar"); requestAnimationFrame(() => oppsummering.current?.focus()); return; }
    if (data.get("bot-felt")) { setStatus("feil"); return; } // honningfelle: fylles bare ut av roboter
    setStatus("sender");
    try {
      const svar = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(data).toString() });
      if (!svar.ok) throw new Error(`HTTP ${svar.status}`);
      setStatus("sendt"); requestAnimationFrame(() => bekreftelse.current?.focus());
    } catch {
      setStatus("feil"); requestAnimationFrame(() => feilmelding.current?.focus());
    }
  }

  const felt = (navn, beskrivelse) => ({
    id: `k-${navn}`, name: navn, "aria-invalid": feil[navn] ? "true" : undefined,
    "aria-describedby": [beskrivelse && `k-${navn}-hjelp`, feil[navn] && `k-${navn}-feil`].filter(Boolean).join(" ") || undefined,
  });
  const Feil = ({ navn }) => feil[navn] ? <p className="sd-feltfeil" id={`k-${navn}-feil`}>{feil[navn]}</p> : null;
  const antallFeil = Object.keys(feil).length;

  return (
    <Ramme sti="/kontakt">
      <header className="sd-hode">
        <div className="cm-wrap">
          <h1 id="h1">Ta kontakt for en uforpliktende fagprat.</h1>
          <p className="sd-ingress">Skriv til oss om nettsider, merkevarebygging, SEO eller digital markedsføring for bedriften.</p>
        </div>
      </header>

      <div className="cm-wrap sd-kontakt">
        <section className="sd-skjemaflate" aria-labelledby="henvendelse">
          <h2 id="henvendelse">Henvendelse</h2>
          {!MOTTAK_BEKREFTET && (
            <p className="sd-hull" role="note">Skjemaet er koblet til skjemaløsningen hos nettstedets vertskap, men mottak er ikke bekreftet ennå. Haster det, skriv direkte til <a href={`mailto:${selskap.epost}`}>{selskap.epost}</a>.</p>
          )}

          {status === "sendt" ? (
            <div className="sd-melding sd-melding-ok" role="status">
              <h3 ref={bekreftelse} tabIndex={-1}>Henvendelsen er sendt</h3>
              <p>Takk. Vi leser henvendelsen og svarer på e-post.</p>
            </div>
          ) : (
            <form name="kontakt" method="POST" action="/kontakt/takk" data-netlify="true" netlify-honeypot="bot-felt" noValidate={js} onSubmit={send}>
              <input type="hidden" name="form-name" value="kontakt" />
              <input type="hidden" name="subject" value="Ny henvendelse fra cideamarketing.com (%{submissionId})" />
              <p className="sd-honning" aria-hidden="true"><label>Ikke fyll ut dette feltet <input name="bot-felt" tabIndex={-1} autoComplete="off" /></label></p>

              {antallFeil > 0 && (
                <div className="sd-melding sd-melding-feil" ref={oppsummering} tabIndex={-1} role="alert">
                  <h3>{antallFeil === 1 ? "Ett felt må rettes" : `${antallFeil} felt må rettes`}</h3>
                  <ul>{Object.entries(feil).map(([n, x]) => <li key={n}><a href={n === "tema" ? "#k-tema-0" : `#k-${n}`}>{x}</a></li>)}</ul>
                </div>
              )}

              <div className="sd-felt">
                <label htmlFor="k-navn">Navn</label>
                <input {...felt("navn")} type="text" autoComplete="name" required />
                <Feil navn="navn" />
              </div>
              <div className="sd-felt">
                <label htmlFor="k-bedrift">Bedrift <span className="sd-valgfritt">(valgfritt)</span></label>
                <input {...felt("bedrift")} type="text" autoComplete="organization" />
              </div>
              <div className="sd-felt">
                <label htmlFor="k-email">E-post</label>
                <input {...felt("email", true)} type="email" autoComplete="email" inputMode="email" required />
                <p className="sd-hjelp" id="k-email-hjelp">Vi svarer på denne adressen.</p>
                <Feil navn="email" />
              </div>
              <fieldset className="sd-felt" aria-describedby={feil.tema ? "k-tema-feil" : undefined}>
                <legend>Hva gjelder det?</legend>
                <div className="sd-valg">
                  {temaer.map((t, i) => (
                    <label key={t} className="sd-valg-alt"><input type="radio" id={`k-tema-${i}`} name="tema" value={t} required aria-invalid={feil.tema ? "true" : undefined} /> {t}</label>
                  ))}
                </div>
                <Feil navn="tema" />
              </fieldset>
              <div className="sd-felt">
                <label htmlFor="k-melding">Melding</label>
                <textarea {...felt("melding", true)} rows={6} required minLength={10} />
                <p className="sd-hjelp" id="k-melding-hjelp">Fortell kort om bedriften og hva dere ønsker hjelp med.</p>
                <Feil navn="melding" />
              </div>

              <p className="sd-hjelp">Vi bruker opplysningene bare til å svare på henvendelsen. Se <a href="/personvern">personvernerklæringen</a> for hvordan vi behandler dem.</p>

              {status === "feil" && (
                <div className="sd-melding sd-melding-feil" ref={feilmelding} tabIndex={-1} role="alert">
                  <h3>Henvendelsen ble ikke sendt</h3>
                  <p>Noe gikk galt under sendingen. Prøv igjen, eller skriv direkte til <a href={`mailto:${selskap.epost}`}>{selskap.epost}</a>.</p>
                </div>
              )}

              <button className="cm-knapp sd-send" type="submit" disabled={status === "sender"} aria-describedby="k-sendestatus">
                {status === "sender" ? "Sender …" : <>Send henvendelse <span aria-hidden="true">→</span></>}
              </button>
              <p className="cm-skjult" id="k-sendestatus" role="status" aria-live="polite">{status === "sender" ? "Sender henvendelsen" : ""}</p>
            </form>
          )}
        </section>

        <aside className="sd-kontaktinfo" aria-labelledby="direkte">
          <h2 id="direkte">Direkte kontakt</h2>
          <p><a href={`mailto:${selskap.epost}`}>{selskap.epost}</a></p>
          <h2>Hva skjer videre?</h2>
          <p>Vi leser henvendelsen og svarer på e-post. Har vi spørsmål, tar vi dem i svaret.</p>
          <h2>Selskapet</h2>
          <p>Cidea Marketing drives av {selskap.navn}<br />Org.nr. {selskap.orgnr}<br />{selskap.adresse}</p>
        </aside>
      </div>
    </Ramme>
  );
}
