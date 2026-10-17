import React from "react";
import "../forside/forside.css";
import { Motiv } from "../forside/Motiv.jsx";
import { Ramme, useMeta } from "../forside/Ramme.jsx";

// Midlertidig, ærlig kontaktside (fase 5): CTA-ene på forsiden skal ikke peke til en død side,
// men ingen mottaker er bekreftet ennå. Ingen e-postadresse, ingen innsending. Ekte skjema i fase 6.
export default function Kontakt() {
  useMeta({
    tittel: "Kontakt | Cidea Marketing",
    beskrivelse: "Ta kontakt med Cidea Marketing om nettsider, merkevarebygging, SEO eller digital markedsføring.",
    sti: "/kontakt",
  });
  return (
    <Ramme aktiv="/kontakt">
      <section className="cm-hero" aria-labelledby="h1">
        <div className="cm-wrap cm-hero-rad">
          <div className="cm-hero-tekst">
            <h1 id="h1">Ta kontakt for en uforpliktende fagprat.</h1>
            <p className="cm-ingress">Skriv til oss om nettsider, merkevarebygging, SEO eller digital markedsføring for bedriften.</p>
            <div className="cm-status" role="status">
              <h2>Kontaktskjemaet er ikke åpnet ennå</h2>
              <p>Vi åpner skjemaet når mottak og svar på henvendelser er satt opp og testet. Inntil da kan ikke meldinger sendes herfra.</p>
            </div>
          </div>
          <div className="cm-hero-kunst cm-inngang">
            <Motiv navn="kontakt-desktop" className="cm-kun-desktop" />
            <Motiv navn="kontakt-mobil" className="cm-kun-mobil" />
          </div>
        </div>
      </section>
    </Ramme>
  );
}
