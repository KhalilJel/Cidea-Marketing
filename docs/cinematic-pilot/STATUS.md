# Cidea Marketing – Status / verificerbar fremdrift

**Oppdatert:** 2026-10-20
**Nå (2026-10-18):** **Fase 5 åpen**: forsidens hovedretning (/konsept-scroll) er akseptert av eier, og estetisk ferdigstilling gjenstår. **Fase 6 åpnet parallelt**: struktur og funksjon for hele nettstedet er levert til kontroll (`phase6/README.md`). **Fase 7–9 gjenstår.** Higgsfield og annen bildegenerering er pauset. Tidligere statuslinje: **4/9 faseporter godkjent**. Fase 4 godkjent med vilkår (`phase4/CHATGPT-REVIEW.md`). Claude Code har implementert 5.2–5.5 på eksperimentgrenen. Fase 5 er **ikke godkjent** før eier har vurdert faktisk forhåndsvisning. Ingen merge, deploy eller nye kjøp.
**Godkjent metode:** ChatGPT → Google Stitch → Claude Code → ChatGPT QA.
**Kostnader:** Eier har 2026-10-17 åpnet for nødvendige betalte visuelle verktøy, inkludert Higgsfield hvis det gir ønsket kvalitet. Ingen konkret plan, pris eller kjøp er valgt eller gjennomført. Tidligere nullkostnadsregel er dermed ikke et absolutt hinder for vurdering; faktiske kjøp må ha avklart omfang og kostnad.
**Eksperimentgren:** `experiment/cinematic-marketing-pilot`; [draft PR #13](https://github.com/KhalilJel/Cidea-Marketing/pull/13); ingen produksjonsendring.
**PR #11:** gammel design system-draft, ikke merge eller endre før gjennomgang.

## Gjeldende fremdrift

- Fase 1–3: tidligere godkjent; konsept C og fase 3 DESIGN.md er låst grunnlag.
- Fase 4: GODKJENT MED VILKÅR av eier. Ressurser og prototyper er levert; tidligere 30/30 og 12/12 er Claudes rapporterte tester, ikke nye React-tester.
- Fase 5.1: filstruktur auditert på branch HEAD 8e1c45f; konkret plan i `phase5/EXECUTION-BRIEF.md`. Ingen runtime-test utført i denne auditoppgaven.
- Fase 5.1: auditfunn bekreftet av Claude Code mot koden, pluss ett ekstra funn (globale elementselektorer i gammel CSS) – `phase5/README.md` § 5.1.
- Fase 5.2 (ce2840e): ny React-forside og ærlig `/kontakt`, tilgjengelig mobilmeny; gamle sider isolert med egen lat lastet CSS.
- Fase 5.3 (79e0f42): `/` og `/kontakt` forhåndsrendres (ekte innhold uten JS), fallback `spa.html` i `netlify.toml`. `tests/forside.test.mjs` **25/25**: 580 ms inngang, kun transform/opacity, redusert bevegelse, hover = fokus, `view()` med fallback testet i ekte Firefox 142 og WebKit 26, mobilytelse under 4× struping, 0 overflow.
- Fase 5.4 (6e3eddb): `tests/qa.mjs` **56/56** automatiske kontroller ved 320/375/390/768/1440 (kontrast ≥ 6,13:1, overskrifter, målområder, lenkemål, fokus, mobilmeny, språk/æøå). Rettet: ordmerke-målområde og mobil artikkelrytme. Ikke en WCAG-samsvarserklæring; skjermleser og ekte telefon er ikke testet.
- Fase 5.5: lokal forhåndsvisning (`npm run build && node tests/serve-dist.mjs` → http://127.0.0.1:4174). Bevis: `phase5/README.md`, `tests/RESULTAT.md`, `tests/QA-RESULTAT.md`, `phase5/screens/qa/`.
- **`main` hentet inn i eksperimentgrenen (92b866e, eiergodkjent, ikke merge til `main`):** konflikten i `src/main.jsx` er løst ved å beholde fase 5-ruteren. `/personvern` (Gullkornet-personvern, #14) er flyttet inn i `src/legacy/LegacyApp.jsx`, og «Personvern» er lagt i den nye bunnteksten. Låsefil og Node 24 / `npm ci` er hentet fra `main`. Tester etterpå: forside **26/26** (inkl. `/personvern` 200 uten feil), QA **56/56**. PR #13 er igjen uten konflikt.

- **Revisjon etter ChatGPT-kontroll (Claude Code, 2026-10-17):** seksjonsrekkefølgen er nå hero → tjenester → konsept → slik jobber vi → innsikt → CTA (anker-ID-er uendret). Nettbrett 600–860 px har fått egen komposisjon: heromotiv 480×345 (før 712×511 ved 768), konseptgrafikk 400×287 (før 672×482), to tjenestekolonner og tre prosessledd fra 700 px. Ved 768 er siden 4 042 px (før 4 425). Tester: build OK, `test:forside` 28/30 bestått + 2 ikke kjørt (Firefox/WebKit finnes ikke i skymiljøet; Chromium-stedfortreder for fallback bestått), `qa.mjs` 86/86 ved 8 bredder. Bevis: `phase5/REVISJON-NETTBRETT.md`, `phase5/screens/revisjon/`.

## Ny referanse fra eier (2026-10-17, ikke godkjent retning)

- **Eiers beslutning:** Dentsu Creative (https://www.dentsucreative.com/) er hovedreferanse for en levende, filmatisk forside med tydelig bevegelse og gjennomarbeidede overganger. Tjenestesider, blogg og kontakt kan være vanlige og oversiktlige sider.
- **Ikke lenger førende for neste forslag:** abstrakte geometriske figurer, ROM-mockupen og CIDEA-storyboardet. Dagens implementering (f26e9fd, nettbrettrevisjon faglig godkjent) beholdes som sammenligningsgrunnlag. Den er fortsatt ikke eiergodkjent som forside.
- **REA-analyse (Claude Code, lokalt 2026-10-18): ANALYSE OG FORSLAG LEVERT.** Dentsu-siden er observert i vanlig nettleser (curl får Vercel-bot-utfordring, som ikke er omgått): forside, `/services/brand` og `/cases/a-piece-of-me` ved 1440, 768 og 390, pluss redusert bevegelse. Bekreftet: Next.js 16 på Vercel, Storyblok, GSAP 3.11.3 (ScrollTrigger, ScrollSmoother, SplitText), egendefinert scroll (Smooth Scrollbar), Lottie, ingen autoavspilt video (prosjektvideo er Vimeo med klikk for avspilling), og at redusert bevegelse **ikke** respekteres i hovedkoreografien (0–1 % pikselforskjell). REA 6.5.0 er installert lokalt, men kommandoene ble stoppet av Claude Codes tillatelseskontroll. Playwright via CDP er brukt i stedet. Forslag: «Tydelig over tid» (tåke som letter over et rødt naust, 7 øyeblikk) med Higgsfield-liste H1–H6, byggeplan A–E, mobil og redusert bevegelse. Se `phase5/rea-dentsu/ANALYSE.md`, `CIDEA-FORSLAG.md` og `STORYBOARD.png`. Opptak og fullbilder er bare lokale (offentlig repo, tredjepartsmateriale).
- **Neste beslutning:** eier og ChatGPT vurderer konseptet «Tydelig over tid» og storyboardet, og avgjør om Higgsfield-prøven H1 (hero: tåken letter) kan bestilles og med hvilken kredittramme. Ingen produksjon eller kodeendring før godkjenning.

- **Prototype /konsept-scroll – «Fra ord til gjennomslag» (Claude Code, 2026-10-18, ikke godkjent):** isolert, kjørbar side på `/konsept-scroll` (`noindex`). Dagens forside er uendret. Sekvensen er:
  1. Gigantisk CIDEA og kontaktknapp.
  2. Ordmerket flyttes, H1 og ingress avdekkes, og flaten går over til marine.
  3. Midlertidig merket bildeområde for pigmentscenen.
  4. «BLI SETT» / «BLI VALGT» i motsatt retning, med ekte tjenestelenker.
  5. Rolig del med prosess og artikler.
  6. Marine avslutning.

  Bevegelsen er bare CSS-scrollanimasjoner på vanlig nettleserscroll, uten scrollmotor. Det er én festet scene (85vh desktop, 70vh mobil). Tester: `tests/konsept-scroll.test.mjs` 24/24 (overflow, tastatur, redusert bevegelse, uten JS, reversering, kontrast, Firefox-reserve, WebKit). Eksisterende suiter: 30/30 og 86/86. Bevis: `phase5/konsept-scroll/README.md` og `bevis/` (opptak 1440/390 og skjermbilder 1440/768/390).

- **Prototype /konsept-scroll, revisjon 1 (Claude Code skyøkt, 2026-10-18):**
  - Tom marine strekning fjernet: bildet glir inn under overgangen, og tomrommet er 41–46 % → 7–10 % av skjermhøyden.
  - Mobil viser H1 og ingress i første skjermbilde (tomrom under ordmerket 310 → 25 px ved 390).
  - «BLI VALGT» er hvit (laveste kontrast 3,43 → 6,42:1).
  - Fokusert kontaktknapp er aldri dekket.
  - Tester (Chromium): konsept-scroll 28/30 bestått + 2 ikke kjørt (Firefox/WebKit mangler i skymiljøet), forside 28/30 + 2 ikke kjørt, QA 86/86. Forsiden er uendret.
  - Se `phase5/konsept-scroll/README.md` § Revisjon 1. Retningen er ikke godkjent.

- **Fase 6 – hele nettstedet til strukturgjennomgang (Claude Code skyøkt, 2026-10-18):**
  - Forhåndsvisningen har /konsept-scroll som foreslått forside (logoen leder dit; ordinær / er ikke erstattet).
  - Nye eller fullførte sider: tjenesteoversikt, fire tjenestesider (eksisterende ruter), Om oss, Innsikt med fire hele artikler, kontakt med skjema, personvern tilpasset nettstedet og ekte 404.
  - Alle sider forhåndsrendres, så direktelenker og oppdatering fungerer. Den gamle appen er fjernet.
  - Kontaktskjemaet (Netlify Forms) er bygget og testet lokalt, men **faktisk levering er ikke testet eller bekreftet**: skjemaregistrering og e-postvarsel må slås på i Netlify.
  - Tester (Chromium): nettsted 33/33, forside 28/30 + 2 ikke kjørt, QA 86/86, prototype 28/30 + 2 ikke kjørt.
  - Estetisk godkjenning gjenstår.
- **Fase 6 – innholds- og funksjonsrevisjon (Claude Code skyøkt, 2026-10-18):** ny Om oss-innledning (hva Cidea Marketing er, hvem vi hjelper, hva vi tilbyr), nytt verdibudskap på Tjenester og Om oss, «dere» konsekvent i artikler, skjema og Takk, nettleserens egen validering uten JavaScript, e-postfeltet heter nå `email` (svaradresse i Netlify-varselet) og skjult `subject`. Netlify-veiledning for eier i `phase6/README.md`. `MOTTAK_BEKREFTET` er fortsatt `false`; levering er ikke testet. Tester (Chromium): nettsted 35/35, forside 28/30 + 2 ikke kjørt, QA 86/86, prototype 28/30 + 2 ikke kjørt. Fase 5 og 6 er fortsatt åpne.
- **Filmscene på /konsept-scroll (Claude Code skyøkt, 2026-10-20, ikke godkjent):** Higgsfield-utkastet (480p) erstatter pigmentplassholderen. Det er kodet om til VP9/WebM (2,09 MB) og H.264/MP4 (2,85 MB) uten lyd, med nøkkelbilde hvert 0,25 s og faststart. Startklippet med innbrent «CIDEA»-knapp er tatt ut (til vurdering). Filmen spoles av vanlig scroll via en passiv lytter, med festet lengde 300vh desktop og 240vh mobil og lenken «Hopp til tjenestene». Fem HTML-replikker er lagt på hendelser i filmen, unna ansikter og telefoner. På mobil vises hele filmbildet med teksten under. Statisk oppsett (plakat og alle replikker) gjelder uten JS, ved redusert bevegelse og ved feil. Tester (Chromium): konsept-scroll 48/50 + 2 ikke kjørt (Firefox/WebKit), nettsted 35/35, QA 86/86, forside 27/30 + 2 ikke kjørt (P2 feilet, kjent ustabil, oppgave 2). Se `phase5/konsept-scroll/FILM.md` og `bevis/film/`.
- **Fase 6, tekniske punkter (Claude Code skyøkt, 2026-10-20):**
  - Kodesplitting per side: JS 282 kB → 240–257 kB per side.
  - P2 kunne ikke gjenskapes i 50 kjøringer. Analysen står i `phase6/P2-ANALYSE.md`, og testen er uendret.
  - `aria-current`: «page» på eksakt side og «true» på overordnet seksjon (ny test S11, nettsted 36/36).
  - Personvernutkast for skjemaet med offisielle Netlify-kilder og åtte eierbeslutninger (`phase6/PERSONVERN-SKJEMA-UTKAST.md`). `/personvern` er uendret.
  - Kort Netlify-sjekkliste for eier (`phase6/NETLIFY-SJEKKLISTE.md`). Kontoen, kvoten og databehandleravtalen er ikke kontrollert. `MOTTAK_BEKREFTET` er fortsatt `false`.
- **Fase 5, ny føring fra eier (Claude Code skyøkt, 2026-10-20, ikke godkjent):** `/konsept-scroll` åpner nå med en hvit flate og én CIDEA-knapp. Første scroll, klikk eller Enter trykker knappen inn og åpner filmen som en sirkel over hele skjermen. Filmen fyller skjermen også på mobil, med utsnitt per scene og avvik dokumentert. Fire replikker ligger oppå filmen. Toppmenyen er fast (hamburger på mobil): lys på hvitt, mørk over filmen. H1, ingress og CTA står etter «Bli sett / Bli valgt», og gjentakelsen er fjernet. Statisk alternativ beholdt. Body-margen på 8 px (hvit ramme på alle sider) er rettet. Tester (Chromium): konsept-scroll 51/53 + 2 ikke kjørt, nettsted 36/36, QA 86/86, forside 28/30 + 2 ikke kjørt. Se `phase5/konsept-scroll/FILM.md` § Revisjon 2.

## Neste konkrete oppgave

1. Nettbrett- og rekkefølgerevisjonen er faglig godkjent av ChatGPT etter kontroll av faktiske bilder og kodediff ved f26e9fd. Ingen ny teknisk kjøring hevdet.
2. Avgrenset visuell prøve for sterkere hero- og støttemateriale; eier mener eksisterende geometriske figurer virker generiske/AI-pregede. Ikke videreproduser samme motivfamilie som endelig løsning før dette er avklart. Bevar fungerende kode og etablerte layoutforbedringer mens prøven vurderes.
3. Eier vurderer faktisk revidert forside. Fase 5 forblir åpen; fase 6 starter først etter godkjenning.

## Åpne vilkår

- Kontroller Stitch/Labs-spesifikke kommersielle rettigheter før publisering.
- Bekreft juridiske opplysninger, skjemamottak, kontaktprosess, datalagring og personverntekst før live. Ikke bruk den gamle SmartSvar-adressen som antatt Cidea-mottaker.
- Mål mobil scroll-rytme, null horisontal overflow, visuell sammenheng og lesbarhet i faktisk React-side.
- Verifiser 580 ms inngang én gang, transform/opacity, reduced-motion, fokus/hover og umiddelbart synlig fallback. Ingen skjult SEO-tekst eller scrolljacking.
- Ingen merge, produksjonsdeploy, DNS/MX-endring eller endring av PR #11. Ingen nye kjøp er gjennomført; se oppdatert kostnadsbeslutning øverst.

## Rapportregel

Etter hver arbeidsoppgave: fase/oppgave, verifisert utført med bevis, gjenstår, neste konkrete oppgave og lenke. Fase 5 krever faktisk forhåndsvisning, dokumentert visuell samsvar og eiergodkjenning.
Anbefalt neste modus: **Work**, fordi ekstern koordinering, implementering og browser-QA gjenstår. Foreslå vanlig ChatGPT når bare råd eller beslutninger gjenstår.

Dette gjelder nettsiden. Den større Cidea-planens innholdsbanker, SoMe og Gullkornet er ikke dermed fullført.

## Uavhengig ChatGPT-kontroll 2026-10-17
Ren checkout a26e7f7. npm ci og npm run build bestått. Faktiske, inncheckede React-skjermbilder visuelt kontrollert ved 320/375/768/1440 mot fase 3-referansene; funn og beslutninger i phase5/CHATGPT-REVIEW.md. Nye nettlesertester ikke kjørt: Playwright-nettleserarkivet kunne ikke installeres (ugyldig/tomt ZIP-arkiv). Eksisterende 26/26 og 56/56 beholdes som Claudes testkvitteringer, ikke nye målinger. Eksisterende Netlify-preview er registrert som success i GitHub, men ble ikke åpnet: nettleserens tilgangskontroll avviste besøket. Ingen omgåelse forsøkt.

## ChatGPT-kontroll av revisjonen — 2026-10-17
Kontrollert f26e9fd; nyere HEAD db68179 endrer bare prosjekt-skillens rapportregel. Kodediff bekrefter seksjonsrekkefølge og nettbrettregler. Faktiske fullsidebilder ved 600/768/860/375/1440 kontrollert. Begge P2-punkter lukkes faglig: nettbrettgrafikk er bedre dimensjonert, venstrejustering fungerer, to tjenestekolonner ved 600 er lesbare, lys–grå–lys fungerer og +29 px ved 600 aksepteres. Dette godkjenner ikke endelig grafikk eller fase 5. GitHub viser Build og Service route browser test success på f26e9fd. Claudes 28 bestått + 2 ikke kjørt og 86/86 er dokumenterte testkvitteringer, ikke nye ChatGPT-kjøringer. Safari/Firefox, ekte enhet og skjermleser er fortsatt ikke testet i denne runden. Eier formidler oppdrag mellom ChatGPT og Claude; mangel på direkte Claude-integrasjon er ikke en arbeidsflytblokkering.
