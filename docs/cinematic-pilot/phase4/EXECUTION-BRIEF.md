# Cidea Marketing — FASE 4/9: visuelle ressurser, motivvariasjoner og bevegelse

**Start:** 2026-10-16. **Status:** KLAR TIL UTFØRELSE I CLAUDE CODE (fase 3 uttrykkelig godkjent av bruker).
**Valgt retning:** Konsept C «Fremtidig håndverk». **Ikke** lag ny retning.
**Arbeidsdeling:** ChatGPT leder, prioriterer og kontrollerer; Claude Code utvikler/koder og tester; Stitch brukes bare for spesifikt nødvendige designreferanser uten betaling.
**Budsjett:** **0 NOK ekstra**. Bruk egne SVG-er, eksisterende React/Vite, CSS og tilgjengelige testverktøy. Ingen video, generativt betalt materiale, nye abonnementer eller hosting.
**Gren:** `experiment/cinematic-marketing-pilot`, draft PR #13. Ingen merge, deploy eller endringer i DNS/MX.
**Kilder:** `../MASTER-GAMEPLAN.md`, `../phase3/DESIGN.md`, `../phase3/SIDEPLAN.md`, `../phase3/RETTIGHETER.md`, `../phase3/motif/README.md`, `../phase3/CHATGPT-REVIEW-UTKAST2.md`, `../phase3/screens/`.

## Omfang og rekkefølge

### Oppgave 4.1 — Visual asset-audit og målbare akseptkriterier
- Verifiser alle SVG-ene i `phase3/motif/svg/` og generatoren uten å overskrive eksisterende designfiler.
- Lag katalog: hvilket motiv hvert sideområde trenger (forside, fire tjenester, Konsepter, Tilnærming, Innsikt, Kontakt, 404, artikkel).
- Kartlegg visuelle svakheter som fremgår av de godkjente skissene: samme hero mange steder, for mange rammer, tunge mobilkort, tomme seksjoner, utilgjengelig kontrast.
- Noter før-bilder og behold en konkret revisjonslogg.

**Ferdig når:** baseline, visuell katalog og arbeidsspesifikasjon ligger i denne mappen med sporbare lenker og null ny kostnad.

### Oppgave 4.2 — Eget Cidea-motiv i flere karakteristiske komposisjoner
- **Behold designregelen:** 2–4 sammenkoblede rette fargeplan; ett synlig 45° hakk nederst til høyre, lengde lik kortside / 6; ingen tekst/sirkler/streker/gradienter inne i motivet.
- Lag **minst fire markant ulike hero-komposisjoner** som ikke bare bytter farge: varierende størrelse/proporsjoner, utsnitt, overlapp, orientering på planene, asymmetri og romlighet. Oppretthold samme grafiske DNA.
- Lag responsive 390px- og 1440px-referanser som viser hvilke komposisjoner som passer hvilken side. Avoid å bare gjenbruke identisk grafikk.
- Kildekod SVG-er i `phase4/assets/` eller utvid generatoren på en dokumentert og testet måte. Valider at hakket ikke dekkes.

**Ferdig når:** en visuelt vurderbar kontaktflate/oversikt viser varianter og per-side-bruk.

### Oppgave 4.3 — Illustrasjoner og grafikk til hele sidefamilien
- Utarbeid særpreget, rettighetsklart SVG-motiv for nettstedets hovedhero, tjenesteområdene, konseptdetalj og Innsikt/artikkelgrafikk. Knytt hvert bilde til konkret informasjon og sideinnhold.
- For Innsikt: skift ut rammete, nestede rektangler uten vedtatt hakk; behold lesbarhet og tydelig artikkelhierarki.
- For «Hva vi leverer» på Merkevarebygging og Digital markedsføring: utarbeid bedre modulære komposisjoner, uten generiske hvite rammer.
- For Konsepter: behold én ekte intern studie tydelig merket «Konsept – ikke kundeprosjekt». Ikke lag eller framstill falske kunder.
- Ikke lag ny logo som impliserer at bruker har godkjent rettigheter. Dokumenter midlertidig ordmerke som utkast.

**Ferdig når:** alle nødvendige sideillustrasjoner finnes, har sjekkbare kildefiler, brukssted og rettighetsnotat.

### Oppgave 4.4 — Bevegelses-/interaksjonsspesifikasjon uten videokreditter
- Lag fungerende **isolert prototypetest** av inngangssekvens (≤600 ms), forsiktig hovring/fokus på motivmarkører og rolig reveal ved scroll. Prosjektsidene må ennå ikke bygges.
- Krav: `prefers-reduced-motion: reduce` viser ferdig motiv umiddelbart; fungerer uten JS; ingen autoplay/video; tastaturnavigasjon viser fokus uten hoveravhengighet; ingen scrolljacking.
- Hold grafikken liten og mål reell ressursstørrelse og enkel avspillingsytelse på mobil. Bruk CSS/inline SVG, ingen ny animasjonsplattform.
- Vis to bevegelser med faktisk nettleserpreview samt statiske fallbacks.

**Ferdig når:** reproducérbar prototyp, testkvitteringer og dokumentasjon foreligger, ikke bare et storyboard.

### Oppgave 4.5 — Endelig visuell og lisensmessig QA for fase 4
- Vis kontaktflate/oversikt med **1440px og 390px** for hero-varianter og grafikk i sidekontekst; se hele designfamilien og rapportér feil.
- Bekreft visuell konsistens, særpreg, lesbarhet, æøå, riktig navngivning («Nettsider»), ingen dekorativ 01/02/03-nummerering eller engelsk på NO-sider.
- **Kontrast:** små mobiltekster skal ikke under WCAG AA; bruk `#4A4E54` eller annen målt kontrastkorrekt tone. Hvit normaltekst på `#D84A26` er ikke godkjent; benytt dyp `#AD2C07` eller kontrastverifisert alternativ.
- Lisens/attributt: OFL-fonter og Apache-ikoner med dokumenterte vilkår; egne SVG-er med kilde, gjennomgå Stitch-vilkår før live. Ikke anta automatisk full rettighetsoverføring.
- Sørg for at CTA-undertekst er revidert til: «Fortell oss kort om bedriften og hva dere ønsker hjelp med. Vi tar kontakt på e-post.» Løftet brukes på live først etter verifisert kontaktmottak. Hoved-CTA «Snakk med oss» → `/kontakt`.
- Fiks «Slik jobber vi – fra første avklaring til videreutvikling.» på Tilnærming og «Hva er et konsept?» på Konsepter, men tekst implementeres først i senere fase.
- Ingen produksjonsnettsted-endring på dette trinnet. Ingen merge/deploy.

**Ferdig når:** godkjent design/animert prototypesett, visuell QA og rettighetsoversikt er kontrollert av ChatGPT og bruker.

## Fase 4-utganger
1. `phase4/README.md` – oppgaver, status, faktisk verifisert bevis, kostnad 0.
2. `phase4/assets/` – selvstendige, responsive SVG-er.
3. `phase4/variants-overview.png` – ekte 1440/390 komposisjonsbilder, ikke tekstbeskrivelser.
4. `phase4/motion/` – en isolert forhåndsvisning/prototyp for animasjonsforslag med redusert bevegelse.
5. `phase4/QA.md` – testliste/kontrast/avvik/rettigheter og rettelser.
6. Oppdatert `STATUS.md` og PR #13 med konkrete commit- og screenshotbevis.

## Stoppregler og overlevering
- **Fase 4 starter nå**, men er ikke ferdig fordi en plan finnes.
- Alle kodeoppgaver utføres av Claude Code, ikke ChatGPT.
- Ingen implementering av hele React-forsiden før fase 4-gaten er godkjent. Den isolerte visual/motion-prototypen er tillatt i fase 4.
- Jobb én stor, målrettet oppgave om gangen (4.1 → 4.5); lever en kort status etter hver.
- Dersom brukerfakta mangler, marker «eier må bekrefte» og hold den ukjente teksten ute av produksjon. Ikke stopp grafikkarbeidet for manglende selskapsopplysninger som først kreves før lansering.
- Ikke bruk Stitch-kreditter uten et konkret behov og ny kostnadskontroll; prioriter egne SVG/CSS-teknikker.
