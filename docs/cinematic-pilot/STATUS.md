# Cidea Marketing – Status / verificerbar fremdrift

**Oppdatert:** 2026-10-17
**Nå:** FASE **5/9 – IMPLEMENTERT, VENTER PÅ EIERVURDERING AV FORHÅNDSVISNING**. **4/9 faseporter godkjent**. Fase 4 godkjent med vilkår (`phase4/CHATGPT-REVIEW.md`). Claude Code har implementert 5.2–5.5 på eksperimentgrenen. Fase 5 er **ikke godkjent** før eier har vurdert faktisk forhåndsvisning. Ingen merge, deploy eller nye kjøp.
**Godkjent metode:** ChatGPT → Google Stitch → Claude Code → ChatGPT QA.
**Kostnadsgrense:** 0 NOK i nye abonnementer/mediekreditter uten eksplisitt brukerbeslutning.
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

## Neste konkrete oppgave

1. Eier vurderer lokal forhåndsvisning av `/` og `/kontakt` (desktop og mobil) og tar stilling til avvikene i `phase5/README.md` (seksjonsrekkefølge, mobilhero, «Slik jobber vi»-flate, tekstvalg).
2. Etter eiervurdering: eventuelle justeringer, deretter fase 6 (undersider) etter godkjenning.

## Åpne vilkår

- Kontroller Stitch/Labs-spesifikke kommersielle rettigheter før publisering.
- Bekreft juridiske opplysninger, skjemamottak, kontaktprosess, datalagring og personverntekst før live. Ikke bruk den gamle SmartSvar-adressen som antatt Cidea-mottaker.
- Mål mobil scroll-rytme, null horisontal overflow, visuell sammenheng og lesbarhet i faktisk React-side.
- Verifiser 580 ms inngang én gang, transform/opacity, reduced-motion, fokus/hover og umiddelbart synlig fallback. Ingen skjult SEO-tekst eller scrolljacking.
- Ingen merge, deploy, DNS/MX-endring, nye betalte verktøy eller endring av PR #11.

## Rapportregel

Etter hver arbeidsoppgave: fase/oppgave, verifisert utført med bevis, gjenstår, neste konkrete oppgave og lenke. Fase 5 krever faktisk forhåndsvisning, dokumentert visuell samsvar og eiergodkjenning.
Anbefalt neste modus: **Work**, fordi ekstern koordinering, implementering og browser-QA gjenstår. Foreslå vanlig ChatGPT når bare råd eller beslutninger gjenstår.

Dette gjelder nettsiden. Den større Cidea-planens innholdsbanker, SoMe og Gullkornet er ikke dermed fullført.
