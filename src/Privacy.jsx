import React, { useEffect } from 'react';

const sections = [
  ['Hvem er ansvarlig?', 'CIDEA AS, org.nr. 927 394 391, driver Cidea Marketing og er behandlingsansvarlig for Gullkornet. Denne erklæringen gjelder bedriftshenvendelser og tilhørende dialog. Den dekker ikke en full kartlegging av nettstedets øvrige tjenester.'],
  ['Opplysninger, kilder og formål', 'Vi bruker selskapsnavn, organisasjonsnummer, organisasjonsform, bransje, kommune, nettsted og offentlig publisert fellesadresse fra Enhetsregisteret og bedriftens egen nettside. Vi registrerer kilde, tidspunkt, kontaktstatus, svar og reservasjoner. Svar kan inneholde personnavn, kontaktinformasjon og korrespondanse. Formålet er én relevant bedriftshenvendelse, ønsket videre dialog og å hindre gjentatt eller uønsket kontakt. Dette løpet retter seg ikke mot navngitte personadresser eller enkeltpersonforetak. Vi bruker ikke åpnings- eller klikksporing i dette løpet.'],
  ['Behandlingsgrunnlag', 'Der opplysningene gjelder personer, vurderer vi berettiget interesse etter personvernforordningen artikkel 6 nr. 1 bokstav f for avgrenset bedriftshenvendelse, svar og nødvendig sperrehåndtering. Vurderingen omfatter relevans, nødvendighet, rimelige forventninger, én kontakt og enkel protest. Dette erstatter ikke eventuelle krav etter markedsføringsloven. Nødvendig avtaleoppfølging og lovpålagt bevaring vurderes separat; en bedriftsansatt er ikke automatisk selv avtalepart.'],
  ['Lagring og reservasjoner', 'Vår interne policy er maksimalt 90 dager fra opprinnelig innsamling for ukontaktede prospekter og 90 dager fra utsending for kontakt uten svar. Aktiv dialog beholdes etter konkret behov og vurderes minst hver 90. dag. Avsluttet dialog ryddes innen 90 dager, med separat vurdering av avtale- og regnskapsbehov. Ferdigbehandlede meldingskopier i svarmonitoren har en intern frist på 30 dager når nødvendig dialog er sikret i originalsystemet. Minimale reservasjoner og vern mot ny kontakt vurderes årlig. Dette er interne policyfrister; de er ikke en påstand om at automatisk sletting er aktivert.'],
  ['Leverandører og overføringer — under ferdigstilling', 'Vi bruker Airtable til kø og kundeoversikt, Migadu til innboks, Railway til svarmonitor og GitHub til kjøringer. Resend er den tilkoblede utsendingstjenesten, men det planlagte uoppfordrede løpet er ikke aktivert. Opplysningene selges ikke. Resend opplyser at kundedata lagres i USA, også ved valgt europeisk avsenderregion, og at overføringer omfattes av standard personvernbestemmelser (SCC) i databehandleravtalen. Airtables og Railways offentlige databehandleravtaler beskriver også SCC. Nærmere opplysninger om aktuelle garantier kan fås ved å kontakte oss. Faktisk bevaring og håndtering av historikk og sikkerhetskopier hos de øvrige leverandørene må ferdigstilles før dette utkastet publiseres.'],
  ['Leverandørbevaring', 'Resend oppgir 30 dagers bevaring av e-post- og loggdata på standardplanene og 7 dagers bevaring av sikkerhetskopier. Dette er separat fra vår interne prospektpolicy. Railways tilgjengelige logghistorikk varierer med abonnement og er ikke i seg selv dokumentasjon på sletting. Vi lover ikke at originalinnboks, historikk eller sikkerhetskopier automatisk slettes etter samme frist som aktive prospektposter.'],
  ['Rettigheter', 'Dere kan kontakte oss for innsyn, retting, sletting eller begrensning der vilkårene er oppfylt. Personer kan når som helst og gratis protestere mot direkte markedsføring ved å svare på henvendelsen eller kontakte oss. Da stopper markedsføringen; minimale sperreopplysninger kan beholdes for å respektere protesten. Henvendelser håndteres uten ugrunnet opphold og normalt innen én måned. Klage kan sendes til Datatilsynet.']
];

export default function Privacy() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Personvern | Cidea Marketing';
    const existingRobots = document.querySelector('meta[name="robots"]');
    const robots = existingRobots || document.createElement('meta');
    const previousRobots = robots.getAttribute('content');
    robots.name = 'robots';
    robots.content = 'noindex';
    if (!existingRobots) document.head.appendChild(robots);
    return () => {
      document.title = previousTitle;
      if (!existingRobots) robots.remove();
      else if (previousRobots === null) robots.removeAttribute('content');
      else robots.setAttribute('content', previousRobots);
    };
  }, []);
  return <section className="page privacyPage" aria-labelledby="privacy-title">
    <p className="eyebrow">CIDEA MARKETING / PERSONVERN</p>
    <h1 id="privacy-title">Personvern</h1>
    <p className="privacyDraft"><strong>Utkast – ikke publiseringsklart.</strong> Leverandørbevaring og praktisk oppfølging av lagringsfristene må ferdigstilles før publisering.</p>
    <p className="pageLead">Slik behandler vi opplysninger ved bedriftshenvendelser gjennom Gullkornet.</p>
    <div className="articleBody">
    <p>Sist oppdatert: 16. oktober 2026. Kontakt om personvern: <a href="mailto:jelassi@cideamarketing.com">jelassi@cideamarketing.com</a>.</p>
      {sections.map(([heading, text]) => <section key={heading}><h2>{heading}</h2><p>{text}</p></section>)}
      <p><a href="https://www.datatilsynet.no/">Datatilsynet</a></p>
    </div>
    <a className="textLink" href="/">← Til forsiden</a>
  </section>;
}
