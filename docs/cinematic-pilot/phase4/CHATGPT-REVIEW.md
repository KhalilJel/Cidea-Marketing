# Fase 4 – ChatGPTs gjennomgang av ressurs- og animasjonspakken

**Dato:** 2026-10-16
**Status:** FAGLIG GODKJENT MED VILKÅR; **uttrykkelig eiergodkjent med vilkår 2026-10-17**.
**Vurdert:** `phase4/README.md`, `AUDIT.md`, `ASSETS.md`, `QA.md`, `motion/TEST-RESULTATER.md` samt de faktiske GitHub-bildene `variants-overview.png` og `motion/oversikt.png`.

## Hva som faktisk er kontrollert

- De ti sidekomposisjonene er visuelt forskjellige og bygger videre på Cidea-motivets geometri, ikke ti kopier av samme hero.
- Desktop/mobil-design i overview har felles typografi, signalfarger og navigasjon. Følg ekstra med på svært små skrifter og mange store fargefelt når fasen blir en ekte, fullstendig side.
- Motion-oversikt viser inngangssekvens, redusert bevegelse/JS-avslag, hover/fokus, og scroll-reveal. Testloggen dokumenterer 580 ms, 12/12 bestått og målt lav layoutaktivitet. Ingen selvstendig re-kjøring av Playwright er gjennomført av ChatGPT, dette er Claudes testkvitteringer.
- QA-dokumentet dokumenterer 30/30 prototypkontroller uten registrerte kontrast-/overflytfeil, men **K5 er uttrykkelig bare delvis bestått** fordi noen mobilseksjoner er lengre enn 900 px. K10 rettigheter har åpent Stitch-vilkårsforbehold.
- 28 SVG-er og kildegenerator er rapportert som validert, med kildekode i repoet. Phase 5 må kontrollere faktisk integrasjon, ikke bare selvstendige prototyper.

## Beslutning 1: K5 – lange mobilseksjoner

**Godkjenn unntak fra vilkårlig 900px-grense når seksjonen inneholder nyttig innhold og korte skannbare elementer**. Særlig seks leveranser à ~143 px er akseptabelt dersom det er lett å orientere seg og CTA forblir tilgjengelig. Ikke skjul SEO-relevant eller nødvendig tjenesteinformasjon bak «vis flere» uten behov.

I fase 5/6: Prøv å redusere unødvendig tekst og vertikale mellomrom før interaktiv «Vis flere». For lengre **sekundære** lister som konsept-familien (~1500 px) kan «Vis flere» være aktuelt når det gir klar bedre brukeropplevelse; tilgjengelighet, tastatur, skjermleser og no-JS fallback må da fungere. Kravet om null horisontal overflow opprettholdes. Mål scroll-rytme på faktisk side.

## Beslutning 2: ti komposisjoner

**Godkjenn den kreative ressursfamilien og foreslått side↔motiv-kobling**: Forside–Sammenføyning; Nettsider–Rutenett; Merkevarebygging–Stempel; SEO–Trapp; Digital markedsføring–Spredning; Tilnærming–Bro; Konsepter–Diagram; Innsikt–Spalter; Kontakt–Åpning; 404–Forskyvning.

Dette er **godkjent som fundament, ikke endelig visuelt polert React-design**. Ikke lag enda flere motiver for variasjonens skyld. Test faktisk visuell virkning i sidene, mobile heroer, sammenhengende scroll-layout, CTA og balanse. Bevar ett synlig 45°-hakk og ingen nye grafikkstiler.

## Beslutning 3: animasjoner

**Godkjenn som fase 5-spesifikasjon:** 580 ms inngang én gang, bare transform/opacity; identisk synlig sluttbilde uten JavaScript eller ved redusert bevegelse; hover og tastaturfokus viser lik affordance, scroll-reveal uten scrolljacking og med umiddelbart synlig fallback der CSS view-timeline ikke støttes. I React må animasjons-lifecycle og lagdeling være ryddig. Kjør nye tester i den faktiske React-siden og dokumenter performance på mobil, ikke stol kun på isolerte testresultater.

## Gjenværende betingelser

1. **Oppfylt 2026-10-17:** eier har uttrykkelig godkjent fase 4 med vilkårene her og åpnet fase 5.
2. Google Stitch/Labs-spesifikke vilkår og kommersiell bruk av det grafiske konseptet må gjennomgås av eier før publisering; generelle Google-vilkår alene er ikke endelig avklaring.
3. Selskapets juridiske opplysninger, skjemamottak, kontaktprosess, datalagring og personverntekst skal være faktabekreftet og testet før live; aldri fyll inn antakelser.
4. Designet må i fase 5 bli et **sammenhengende nettsted**, ikke bare ti heroer. Begrens repeterende fargeflater, små etiketter og generisk kortstruktur; løft originalitet og mobil rytme.
5. Fortsatt **0 NOK** nye kjøp, ingen produksjonsdeploy, merge eller DNS/MX-endringer uten tillatelse.

**Anbefaling til eier:** Godkjenn fase 4 som en komplett grafisk/animert ressurs- og testpakke med disse fase 5-kvalitetskravene. Da kan Claude begynne React-forsiden på isolert eksperimentgren, ikke produksjonssetting.
