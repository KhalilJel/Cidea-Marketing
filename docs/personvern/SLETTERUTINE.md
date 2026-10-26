# Sletterutine for henvendelser fra kontaktskjemaet

**Status:** Godkjent av eier 26.10.2026. Utføres manuelt av eier. Automatisk sletting er **ikke** godkjent og ikke satt opp.

## Regel

Henvendelser som ikke fører til et kundeforhold, slettes **senest 6 måneder etter at dialogen er avsluttet**, både hos Netlify og i e-posten.

- **Avsluttet dialog** = datoen for siste e-post i tråden, fra oss eller fra den som tok kontakt.
- **Kundeforhold:** tråden flyttes til kundens mappe. Det betyr ikke at all korrespondanse beholdes. Bare det som trengs for avtalen, dokumentasjon av oppdraget og lovpålagte plikter (for eksempel regnskap) beholdes. Øvrig korrespondanse i tråden, som tidlige avklaringer, småprat og vedlegg som ikke trengs, vurderes for sletting etter samme prinsipp som over.
- **Søppelpost** i Netlify slettes ved hver gjennomgang.
- **«Senest»** betyr at tidligere sletting er greit. Netlify-kopien trengs ikke når henvendelsen ligger i e-posten.

## Oppsett (kontrollert 26.10.2026)

| Ledd | Oppsett | Merknad |
| --- | --- | --- |
| Skjema | Netlify Forms, skjemaet `kontakt` i prosjektet `cideamarketing` | Innsendinger lagres hos Netlify til de slettes. Netlify har ingen innstilling for automatisk sletting. |
| Varsel | Netlify → Forms → Submission notifications: «Email hello@cideamarketing.com on new submission from any form» | Endret fra jelassi@ til hello@ 26.10.2026. Emne: «Ny henvendelse fra cideamarketing.com (id)». |
| E-post | Migadu (Migadu-Mail GmbH, Sveits). hello@ er et alias som leveres til innboksen for jelassi@ | Ifølge prosjektdokumentasjonen. Aliaset er ikke en egen postkasse, så alt ligger i jelassi@-postkassen. |

**Viktig for sletting:** Fordi hello@ er et alias, finnes det ingen egen hello@-postkasse å tømme. Varsler og svar ligger i **jelassi@-postkassen** (innboks, sendte, eventuelle mapper og papirkurven). Kontroller én gang i Migadu-administrasjonen at aliaset bare har jelassi@ som mottaker. Har det flere mottakere, må hver av dem tas med i rutinen.

## Månedlig gjennomgang (eier)

Første virkedag hver måned, ca. 10 minutter. Slett det som har passert **5 måneder** etter avsluttet dialog, så holdes grensen på 6 måneder selv om en henvendelse blir liggende til neste gjennomgang.

### 1. Netlify

1. Logg inn på app.netlify.com → prosjektet **cideamarketing** → **Forms** → **kontakt**.
2. Merk innsendinger der dialogen er avsluttet, ingen kunde ble resultatet, og datoen har passert grensen. Innsendinger som allerede ligger i e-posten, kan slettes tidligere.
3. Velg **Delete submission** og bekreft. Netlify oppgir at slettingen er permanent.
4. Bytt til **spam-listen** (menyen over lista). Sjekk raskt at ingen ekte henvendelser ligger der. Slett resten.

### 2. E-post (jelassi@-postkassen hos Migadu)

1. Bruk en egen mappe for skjemavarsler, f.eks. **«Henvendelser»**, med en regel på emnet «Ny henvendelse fra cideamarketing.com».
2. Sorter mappen etter dato. Åpne trådene der siste e-post har passert grensen.
3. Ble det ikke et kundeforhold: slett **hele tråden**, også svarene i **Sendte**.
4. Ble det et kundeforhold: flytt tråden til kundens mappe først. Gå samtidig gjennom tråden og slett det som ikke trengs for avtalen, dokumentasjonen eller lovpålagte plikter.
5. Tøm **papirkurven** for disse e-postene.
6. Har noen lastet ned eller kopiert henvendelser (CSV, notater, skjermbilder), slett også dem.

### 3. Logg (uten personopplysninger)

Én linje per gjennomgang, f.eks.:

```
2026-12-01 · Netlify: 3 slettet, spam: 2 slettet · E-post: 2 tråder slettet · utført av eier
```

Ikke skriv navn, e-postadresser, firmanavn eller innhold i loggen.

## Forespørsel om innsyn, retting eller sletting

Forespørsler kommer normalt til hello@cideamarketing.com. Svar uten ugrunnet opphold og senest innen én måned (personvernforordningen artikkel 12). Gå gjennom stegene i rekkefølge:

1. **Registrer forespørselen** i loggen (dato og type, uten personopplysninger), og svar kort at den er mottatt.
2. **Kontroller identitet ved behov.** Ikke utlever opplysninger automatisk til en ubekreftet avsender. Kommer forespørselen fra samme e-postadresse som henvendelsen ble sendt fra, er det som regel nok. Kommer den fra en annen adresse, eller gjelder den noen andre, be om en enkel bekreftelse, f.eks. svar fra den opprinnelige adressen. Be ikke om mer enn nødvendig.
3. **Avklar omfang.** Hvilke henvendelser og hvilke opplysninger gjelder det: innsending i Netlify, e-posttråder, eventuelle kopier.
4. **Vurder forespørselen og eventuelle oppbevaringsplikter.** Er det et kundeforhold, kan noe måtte beholdes for avtalen, dokumentasjon eller lovpålagte plikter (for eksempel regnskap). Det øvrige slettes eller utleveres. Er du i tvil, avklar før du sletter.
5. **Gjennomfør.** Slett i Netlify (også spam-listen) og i jelassi@-postkassen (innboks, Sendte, papirkurv), eller sett sammen innsyn.
6. **Svar sikkert.** Svar til den bekreftede adressen. Utleveres opplysninger, send bare det som gjelder personen. Skriv hva som er slettet, og hva som eventuelt er beholdt og hvorfor.
7. **Trenger du mer tid** (opptil to måneder ekstra ved komplekse eller mange forespørsler), si fra innen én måned og forklar hvorfor.

## Ikke kontrollert

- Om Migadu tar sikkerhetskopier av slettet e-post, og hvor lenge. Migadus personvernerklæring (sist oppdatert 05.12.2024) nevner det ikke. Den sier at innhold kan slettes av brukeren når som helst, og at personopplysninger slettes innen 30 dager etter at avtalen avsluttes.
- Hvilke land Migadus servere står i. Personvernerklæringen nevner ikke land.
- Om aliaset hello@ har flere mottakere enn jelassi@ (se over).

## Avtaler (lest 26.10.2026)

| Leverandør | Avtale | Hovedpunkter |
| --- | --- | --- |
| Netlify | [Data Processing Agreement](https://www.netlify.com/pdf/netlify-dpa.pdf), sist oppdatert 9. juni 2026 | Del av abonnementsavtalen, ingen egen signatur nevnt. Overføring til USA: EU–US Data Privacy Framework, med EUs standard personvernbestemmelser (modul 2/3) som reserve. Varsel om nye underleverandører 30 dager før, med rett til å protestere. Data slettes eller eksporteres ved oppsigelse. |
| Migadu | [Personvernerklæring og databehandleravtale](https://migadu.com/privacy/), sist oppdatert 5. desember 2024 | Dokumentet er både personvernerklæring og databehandleravtale. Migadu-Mail GmbH, Sveits. Underleverandører nevnt: Stripe og PayPal (betaling). Sletting innen 30 dager etter avsluttet avtale. |

Ikke kontrollert: om Netlifys databehandleravtale er akseptert for akkurat denne kontoen ut over at den er en del av vilkårene.

## Kilder

- Netlify: [form submissions](https://docs.netlify.com/manage/forms/submissions/), [API, skjemaer](https://docs.netlify.com/api-and-cli-guides/api-guides/get-started-with-api#forms), [DPA](https://www.netlify.com/pdf/netlify-dpa.pdf)
- Migadu: [personvernerklæring/DPA](https://migadu.com/privacy/)
