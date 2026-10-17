# Fase 5 – ChatGPTs visuelle kontroll og neste Claude-oppdrag

Dato: 2026-10-17. Kontrollert kilde: a26e7f7ecb917f4edef08fd5146032c8830ed6af.
Status: IMPLEMENTERT, MEN IKKE GODKJENT. **Oppfølging:** begge P2-punktene er utført av Claude Code 2026-10-17. Se [`REVISJON-NETTBRETT.md`](REVISJON-NETTBRETT.md). Fase 4 er eiergodkjent med vilkår. Ingen overgang til fase 6.

## Faktisk kontrollert

- Ren checkout, npm ci og npm run build bestått. Ingen applikasjonskode endret av ChatGPT.
- Faktiske React-skjermbilder i `screens/qa/forside-{320,375,768,1440}.png` sammenlignet med `../phase3/screens/forside-desktop.png` og `forside-mobil.png` samt godkjente fase 4-komposisjoner.
- Norsk tekst, sammenhengende geometrisk grafikk, fontfamilie, konseptmerking og tydelige handlingsknapper kontrollert visuelt. Ingen synlig kollisjon i de undersøkte bildene.
- 26/26 og 56/56 er eksisterende Claude-testkvitteringer. Ingen ny nettleserkjøring: browser-download ga ugyldig/tomt ZIP-arkiv. Build er selvstendig kontrollert.
- Eksisterende Netlify-preview er registrert som success i GitHub. Besøk ble avvist av browserens tilgangskontroll; ingen live inspeksjon eller omgåelse.

## Konkrete designbeslutninger til Claude Code

| Prioritet | Observasjon | Bestilling | Akseptbevis |
|---|---|---|---|
| P2 | Ved 768 px strekkes mobilmotivet over hele bredden. Hero og konseptgrafikk dominerer vertikalt; nettbrettet føles som en oppblåst mobilside. | Gi 600–860 px en bevisst nettbrettkomposisjon. Begrens heroens grafikk til omtrent 480 px bredde / 345 px høyde og konseptgrafikken til omtrent 400 px bredde. Bevar proporsjoner, eksisterende SVG og synlig hakk. Bruk tilgjengelig bredde til to tjenestekolonner der tekst og trykkflater fortsatt fungerer. Finjuster ut fra faktiske bilder. | Nye bilder ved 600/768/860/1024 i tillegg til 320/375/390/1440. Vis målte grafikk- og seksjonshøyder, ingen avkuttet tekst eller overflow. |
| P2 | Prosess står før konsept; godkjent SIDEPLAN og Stitch viser konsept først. | Rekkefølge: hero → tjenester → konsept → slik jobber vi → innsikt → CTA. Bevar eksisterende anker-ID-er og korrekt fokusrekkefølge. | Fullsidebilder desktop og mobil, alle menyankere fungerer. |

Behold lys prosessflate med fargede toppkanter: den gir en nødvendig pause mellom mettede felt og følger fase 4-reviewets krav om færre repeterende fargeflater. Behold artikkelgrafikken og tekstlenken «Se konseptet»; primær-CTA får dermed tydeligst prioritet. Mobilheroens tekst og handlinger før motiv beholdes. Ikke bytt konsept, farger, Outfit/DM Sans eller lag nye motiver.

## Utføring i Claude Code

Les dette dokumentet, MASTER-GAMEPLAN, STATUS og eksisterende fase 5 README. Sjekk git status og hent grenen trygt uten å miste lokalt arbeid. Utfør de to P2-rettelsene, kjør build, test:forside og tests/qa.mjs. Kontroller 580 ms, reduced-motion, fallback, tastaturmeny og gamle ruter. Ta faktiske nye bilder. Dokumenter før/etter og oppdater STATUS og PR #13. Push bare til experiment/cinematic-marketing-pilot. Ingen merge, manuell deploy, DNS/MX, betalte verktøy eller nye designretninger. Fase 5 krever ny ChatGPT-kontroll og uttrykkelig eiervurdering.

Delegeringsstatus: mottatt og utført i en Claude Code-økt 2026-10-17. Resultat i `REVISJON-NETTBRETT.md`.

Åpne før publisering: faktisk kontaktflyt, selskapsopplysninger, personvern og dokumenterte rettigheter. `/kontakt` er fortsatt en ærlig midlertidig side, ikke en fungerende innsending. Dette er ikke en ferdig kundehenvendelsesflyt.
