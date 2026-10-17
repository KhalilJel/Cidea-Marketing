# Fase 5 — utføringsbrief til Claude Code

Dato: 2026-10-17. Fase 4 uttrykkelig eiergodkjent med samtlige vilkår i fase 4 CHATGPT-REVIEW.md. Fase 5 pågår; ikke godkjent. All koding utføres av Claude Code. ChatGPT har kun auditert og oppdatert dokumentasjon.

## 5.1 Verifisert statisk audit og plan

Auditert eksperimentgren ved HEAD 8e1c45fdb8d68429f9a9f892df324182705ddbc8 i separat checkout. Ingen applikasjonsfiler endret. Ingen build eller nettlesertest kjørt i denne oppgaven.

- `src/main.jsx`: hele appen i én fil; React createRoot, Home, Header, Service, Blog, Meta og enkel location.pathname-ruting. Del opp komponenter ved behov uten rammeverksmigrering.
- `src/styles.css`: globale stiler med eksisterende engelske etiketter, annen typografi/fargeverden og eldre komponentklasser. Unngå stil-lekkasje til eksisterende undersider ved å avgrense nye forsidestiler.
- `package.json`: React/Vite, JSX og ren CSS; dev/build/preview. Ingen eksisterende testscript. Ingen grunn til TypeScript/Tailwind eller nye betalte avhengigheter.
- Eksisterende tjenestestier: `/websites`, `/branding`, `/seo`, `/digital-marketing`. Blogg: `/blog` og `/blog/:slug`; fire faktiske markdownartikler i `blog/`, mens React-artiklene fortsatt er korte hardkodede utdrag.
- `Meta`-elementet står som ubrukt uttrykk før App sin return og monteres ikke. Monter det som del av appen og kontroller metadata.
- Header har ufullstendig NO/EN-bryter og gammel SmartSvar-mailto. Ukjente stier faller tilbake til Home. `/kontakt` er dermed ikke en ekte kontaktside. Ikke innfør døde CTA-er eller finn på en e-postmottaker. Et ærlig kontaktsteg uten innsending og med tydelig status kan brukes lokalt inntil ekte mottaker er bekreftet; dokumenter begrensningen. Live krever verifisert kontaktflyt.
- Dagens Home inneholder engelske etiketter og gamle påstander/prosjektfelt som må erstattes av godkjent norsk innhold. Ingen oppdiktede kundecaser eller resultater.
- `public/robots.txt`, `public/sitemap.xml`, `index.html`, `netlify.toml` finnes. Bevar hosting og ruter; ikke deploy.
- `.github/workflows/build.yml` og `service-route-browser-test.yml` finnes; sistnevnte tester de fire tjenestestiene. Byggesuksess alene beviser ikke visuelt samsvar.

## Låst referanse og kilder

Les prosjekt-skill `.claude/skills/cidea-website/SKILL.md` og dokumentene den peker på. Deretter `phase3/DESIGN.md`, `phase3/README.md`, godkjente forsidebilder i `phase3/screens/`, `phase3/CHATGPT-REVIEW-UTKAST2.md`, `phase4/CHATGPT-REVIEW.md`, `phase4/ASSETS.md`, `phase4/QA.md`, `phase4/motion/README.md`, `motion/motion.css` og testkildene.

Fase 3-konsept C er låst: Outfit + DM Sans selvhostet, lys grunnflate, presise mettede plan, ingen gradienter/fotografi/skygger. Farge- og kontrastroller følger DESIGN.md. Bruk eksisterende fase 4 `assets/svg/forside-desktop.svg` og `forside-mobil.svg`, ikke én skalert desktopillustrasjon på mobil. Bevar ett synlig 45°-hakk. Ingen ny designretning, nye motiver eller Stitch-generering.

H1: «Nettsider og helhetlig markedsføring som utvikles over tid.»
Tjenesteoverskrift: «Dette kan vi hjelpe deg med».
CTA: «Snakk med oss».
Slutt-CTA: «Klar for et overbevisende digitalt uttrykk?» og «Fortell kort om bedriften og hva du trenger hjelp med, så svarer vi deg på e-post.» Kontaktløftet må være faktisk støttet før live.
Ordmerket er midlertidig, ingen påstand om ferdig godkjent logo.

## Oppgaver i rekkefølge

### 5.2 React-forside og navigasjon
Bekreft riktig branch og arbeidskopi uten å overskrive endringer. Implementer eksisterende React/Vite-forside etter referansene: navigasjon, hero, fire tjenester, prosess, ett ekte konsept tydelig merket «Konsept – ikke kundeprosjekt», ekte artikkelutdrag og felles CTA. Fjern ufullstendig språkbytter på forsiden. Lag tilgjengelig mobilmeny med navngitt knapp, aria-expanded, Escape, fokusretur og riktig tastaturrekkefølge. Bevar eksisterende tjeneste- og bloggstier; dokumenter eventuell URL-kobling til nye norske sidenavn. Ingen nye faktapåstander, bynavn eller juridiske opplysninger.
Rapporter commit, endrede filer, lokal preview og kjente mangler før neste oppgave.

### 5.3 Motion og fallback
580 ms inngang én gang, kun transform/opacity; ryddig React-lifecycle. Reduced-motion viser sluttbildet umiddelbart. Hover og fokus gir samme affordance. Ingen scrolljacking; CSS view-timeline må ha synlig fallback uten støtte. Kontroller faktisk no-JS-adferd i Vite-SPA: isolert HTML-prototype beviser ikke at React rendrer uten JavaScript. Dokumenter eller løs avviket eksplisitt, uten å hevde at en tom React-root er godkjent fallback. Ingen skjult nødvendig tekst.

### 5.4 Visuell og tilgjengelighets-QA
Rendre 320/375/390/768/1440 px, lag fullsidebilder desktop/mobil og sammenlign visuelt med låste referanser. Kontroller norsk tekst/æøå, headingrekkefølge, kontrast, fokus, menytastatur, målområder, lenkemål og null horisontal overflow. Mål mobilseksjoner og scroll-rytme; lange nyttige lister er tillatt, unødvendig luft og gjentatte store fargefelt skal strammes inn. Ikke hevde WCAG-samsvar ut fra en enkelt automatisk sjekk.

### 5.5 Testing og overlevering
Kjør build og eksisterende relevante rutesjekker; dokumenter feil før/etter. Kjør reelle motion/reduced-motion/fallback-tester og mobil performance-måling på faktisk side. Dokumenter verktøy, viewport, målt resultat og begrensninger. Oppdater QA, STATUS og PR #13 etter hver oppgave; push kun til eksperimentgrenen. Lever faktisk lokal forhåndsvisning og skjermbilder til ChatGPT/eier for vurdering. Fase 5 forblir åpen til eier godkjenner.

## Absolutte rammer og rapportering

Ingen merge, deploy, DNS/MX-endring, nye kjøp, betalte API-kall eller endring av PR #11. Bruk eksisterende abonnement/tilgang; stopp ved nødvendig ekstra kostnad. Rettighets-, firma-, kontakt-, data- og personvernfakta er åpne publiseringsvilkår, aldri fyll inn antakelser.

Etter hver oppgave: Fase 5/9 | oppgave | verifisert utført med lenke/commit/skjermbilde/test | gjenstår | neste oppgave | blokkering. Anbefal Work mens utføring/QA gjenstår, vanlig ChatGPT når kun råd/beslutninger gjenstår.

## Delegeringsstatus
Brief klargjort; ingen autentisert kjørende Claude Code-økt bekreftet fra denne Work-økten. Å opprette brief eller poste den i PR er ikke bevis på at Claude har mottatt eller startet arbeidet.
