# Fase 3 – ChatGPT review av utkast 2 (2026-10-16)

**Beslutning:** Designblueprint **anbefales godkjent med konkrete utførelseskrav**, men fase 3 skal IKKE markeres ferdig før brukeren har sett og uttrykkelig akseptert retningen. Ikke generer enda et stort Stitch-utkast. Eventuelle faktamangler og personverntekst er lanseringsblokkere, ikke påskudd for å finne opp data.

## Kontrollert bevisgrunnlag
- `README.md`, `UTKAST2-LOGG.md`, `DESIGN.md` v0.2, `SIDEPLAN.md`, `RETTIGHETER.md`.
- Faktiske fulllengde GitHub-screenshots visuelt åpnet: `screens/forside-desktop.png`, `screens/forside-mobil.png`, `screens/tilnaerming-desktop.png`, `screens/konsepter-mobil.png`, `screens/innsikt-desktop.png`. Dette er en **representativ utvalgs-QA**, ikke visuell verifisering av hvert av de 22 skjermbildene.
- Den store `oversikt-utkast2.png` kunne ikke hentes i vår GitHub-tilkobling; de individuelle skjermene ovenfor kunne. Øvrige skjermmaler hviler foreløpig på Claudes dokumenterte tester og må visual-QA-es ved implementering.
- 21 sekvensielle Stitch-kall, **56/400** brukeravleste kreditter, ingen nye betalinger/koding/deploy.

## 1. CTA-copy – ChatGPT vedtak
**Godkjenn intensjonen, stram formuleringen.** Bruk samme tekst på alle CTA-flater:
- H2: `Klar for et overbevisende digitalt uttrykk?`
- Undertekst: `Fortell oss kort om bedriften og hva dere ønsker hjelp med. Vi tar kontakt på e-post.`
- Knapp: `Snakk med oss` → `/kontakt`
Ingen svartidsløfter eller falsk kontaktinfo. **Ikke publiser løftet «Vi tar kontakt» før ekte skjemamottaker og svarprosess er testet i fase 6.** Bruk `dere` i Cidea-tekst, også i seksjoner som nå sier `du/din/deg`, for konsistent bedriftsrettet kommunikasjon. Forutsetter faktisk henvendelsesrutine.

## 2. Motivet – beslutning
**Godkjent som grafisk system**, ikke som én repetert tegning. Behold fire designparametre (2–4 sammenkoblede plan, nøyaktig ett 45° hakk nederst til høyre, hakk kortside/6, ingen tekst/sirkler). `motif/`-generator og SVG-samlingen blir kanonisk kilde i neste fase.
**Fase 4 må teste** ulike komposisjoner ved å endre proporsjoner, rekkefølge, utsnitt, overlapp og dybdefølelse etter sidens hensikt. Ikke endre motivregelen eller tilføre nye kommersielle verktøy. Merk at flere av de faktiske skjermene gjenbruker samme kombinasjon; ikke aksepter det som ferdig art direction.

## 3. Fase 3 – statusbeslutning
Blueprint har tilstrekkelige definerte tokens, komponenter, sidemaler, mobilvarianter, typografi, kilder og SVG-grunnlag **til å gå videre når eier visuelt godkjenner retningen**. Det er ikke det samme som ferdig nettside eller at alle skjermbildene er pixel-perfect. Gjenstående estetiske forbedringer skal bli egne akseptkriterier i fase 4 og i fase 8. Fase 3 gate er ennå åpen uten eiergodkjenning.

## 4. Tekst og art direction: presise justeringer
- Tilnærming H1: Erstatt `Et langsiktig partnerskap for digital vekst og stabilitet.` med **`Slik jobber vi – fra første avklaring til videreutvikling.`**. Unngå «stabilitet» som tjenesteløfte.
- Konsepter: Erstatt `Hva betyr konsept hos oss?` med **`Hva er et konsept?`**, undertekst **`Konseptene viser hvordan vi utforsker visuelle løsninger. De er ikke kundeprosjekter.`**. Fjern `metodiske tankesett` og lignende tåkeprat.
- Tjenestekort: Unngå overdreven tekst og tung blokkfølelse på mobil. Bruk samme informasjonsrekkefølge, mer plass, færre dupliserte forklaringer. Ikke erstatt fargeflater med generiske hvite rammer.
- Innsikt: Fremhevet artikkelgrafikk mangler vedtatt motivhakk, og kortene fremstår mer rammebasert enn resten. Fase 4 retegner dette fra egen SVG, med mindre rammebruk uten å svekke lesbarheten.
- Merkevarebygging og Digital markedsføring: Bytt rammede «Hva vi leverer»-kort til samme roligere modulære tjenestespråk som Nettsider, men med reelle sideforskjeller i illustrasjon og innhold.
- Konsepter desktop: Bytt grå avsluttende CTA til definert dyp terrakotta/skoggrønn (målt WCAG AA og konsekvent kopitekst).
- Mobiloverskrifter: Ingen uheldig orddeling, ingen merkbar horisontal scrolling eller enhetsspesifikke «DESKTOP»-artefakter.
- Skjult HTML `<title>` inneholder «Nettsteder»: rett til «Nettsider» i fase 5/7.
- Ingen oppdiktede kundeprosjekter, andre konsepter, tall, priser, historikk eller team-løfter.

## 5. Kontrast – reell blocker før produksjonsgodkjenning
Claude målte **3 av 941** tekstelementer under AA, alle små mobiltekster, mot lokalt gjengitte Stitch-sider. Rett små grå tekster til `#4A4E54` eller annen målt akseptabel farge. Hvit normaltekst på standard terrakotta `#D84A26` gir dokumentert for lav kontrast (4,26:1). Bruk dyp `#AD2C07` eller målt alternativ når hvit tekst skal ligge oppå. **Mål på nytt i ferdig browser-implementering**, ikke bare i designutkast. «Ingen feil» er ikke dokumentert per nå.

## 6. Rettigheter og eierfakta
- Outfit og DM Sans (OFL) kan selvhostes med lisensfil. Egne genererte SVG-er kan brukes som teknisk grunnlag; bekreft kontraktsvilkår for Stitch-utgangspunktet før publisering. Ikke lov at «egen SVG» alene automatisk fjerner alle mulige tredjepartsrettigheter.
- Manglende faktakilder før live: juridisk selskapsnavn, organisasjonsnummer, adresse/kontaktansvar, korrekt e-post og mottak for skjemadata, faktisk retention, logotillatelse, godkjent kommersielt tjenestetilbud, hva Cidea kan hevde om seg selv. Aldri fyll inn med antakelser.
- Personvernerklæring for kontaktmåte, lagring/sletting og rettslig grunnlag må være reell, ikke skissetekst, før skjema settes live.

## Godkjenningsgrenser
- **Dette dokumentet er ChatGPTs faglige anbefaling**, ikke eksplisitt eiergodkjenning.
- Etter eiergodkjenning: markér fase 3 fullført med lenker til dokumentert skjerm-/SVG-grunnlag. Fase 4 starter med **visuell variasjon og polering av egne SVG/CSS-motiver, kontrollert mot både desktop/mobil, 0 NOK**.
- Ikke kod frontend før original fase-4-gate er fullført; all koding hos Claude.
- Ikke lag ny designretning, ingen ekstra Stitch generering uten nødvendig presis oppgave og kredittkontroll, og ingen merge/deploy før godkjent senere fase.
