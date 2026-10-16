# Cidea Marketing – Status / verificerbar fremdrift

**Oppdatert:** 2026-10-15
**Nå:** FASE **3/9 PÅGÅR – utkast 2 klart for endelig visuell vurdering** (2026-10-16). Konsept C beholdt. 13 sidemaler / 22 skjermer, Cidea-motivet som eget SVG, DESIGN.md v0.2, oppdatert SIDEPLAN og RETTIGHETER. 21 Stitch-kall i utkast 2 (ramme 100 kreditter); forbruk venter på brukerens avlesning. Fase 3 er **ikke godkjent**. Ingen kode, merge eller deploy.
**Godkjent metode:** ChatGPT → Google Stitch → Claude Code → ChatGPT QA.
**Kostnadsgrense:** 0 NOK i nye abonnementer/mediekreditter uten eksplisitt brukerbeslutning.
**Eksperimentgren:** `experiment/cinematic-marketing-pilot`; [draft PR #13](https://github.com/KhalilJel/Cidea-Marketing/pull/13); ingen produksjonsendring.
**PR #11:** gammel design system-draft, ikke merge eller endre før gjennomgang.

## Phase 1/9 – konkrete oppgaver

| Oppgave | Verifisert status | Dokumentasjon |
| --- | --- | --- |
| Baseline-audit av eksisterende Vite/React-kode | FERDIG (read-only audit, ikke visuell QA) | `INITIAL-AUDIT.md` |
| Master Gameplan oppdatert til valgt metode | FERDIG I GITHUB | `MASTER-GAMEPLAN.md` |
| Godkjent innholds-/designbrief med 3 tydelig ulike retninger | FERDIG SOM BRIEF; ingen faktiske mockups generert | `STITCH-CREATIVE-BRIEF.md` |
| Lokal Claude Code-skill for valgt metode | VERIFISERT: automatisk oppdaget sammen med 4 Stitch-skills | `PHASE1-VERIFICATION.md` § 2 |
| Konflikterende eldre 10K-skill | FJERNET fra aktiv prosjektsti på eksperimentgren; eldre docs beholdt som historikk | Git commit på PR #13 |
| Offisiell Google Labs Stitch skills repo / README inspisert | FERDIG KILDEGJENNOMGANG | https://github.com/google-labs-code/stitch-skills |
| Handoff/konfigurasjonsveiledning | FERDIG I GITHUB | `STITCH-HANDOFF.md` |
| Stitch-skills (4 stk, festet commit) | INSTALLERT prosjektlokalt etter kodegjennomgang | `PHASE1-VERIFICATION.md` § 3 |
| Stitch workspace / MCP login | VERIFISERT: API-nøkkel satt av bruker; `list_projects` HTTP 200 (2 prosjekter) | `PHASE1-VERIFICATION.md` § 4 |
| Stitch → Claude asset/design read eller eksport-smoke-test | VERIFISERT: get_screen → HTML 55 kB + skjermbilde 1440×8697 → lokal rendring uten feil | `PHASE1-VERIFICATION.md` § 4 |
| Claude lokal workspace på trygg eksperimentgren | VERIFISERT (ren arbeidskopi, HEAD `b17bafa`) | `PHASE1-VERIFICATION.md` § 1 |
| Local Node/build, preview og screenshot-test | VERIFISERT: Node 24.21.0, build OK, preview+dev 200, 14/14 rute-sjekker 390/1440 | `PHASE1-VERIFICATION.md` § 5, `evidence/phase1/` |
| Tre ferdige Stitch-designs | **3 av 3 generert**; **brukeren valgte C (v2)** 2026-10-15; 34/400 kreditter | `phase2/README.md` § Beslutning, `phase2/CREATIVE-REVIEW.md` |
| Betalte kjøp / live deploy | **INGEN** | — |

## Gate for å avslutte fase 1

[x] Claude Code lokalt på trygg branch uten tap av lokale endringer.
[x] `/cidea-website` eller direkte lesning av skill bekreftet.
[x] Stitch innlogging + fungerende MCP eller verifiserbar eksport → Claude.
[x] Vite-build, lokal preview, mobil/desktop screenshot test dokumentert.
[x] `PHASE1-VERIFICATION.md` med ekte resultater, ingen oppdiktede tall.
[x] Ingen betalinger eller produksjonsendringer.

## Neste konkrete handling

1. Bruker: les av sluttforbruket i Stitch (forventet godt under 200).
2. ChatGPT + bruker: visuell vurdering av A, B og C ut fra `phase2/oversikt-runde1.png`, skjermbildene og Stitch-lenkene i `phase2/README.md`, med vektingen i `STITCH-CREATIVE-BRIEF.md`. Gjenstående innholdsfunn står i README-ens tabell.
3. Bruker velger én retning, eller ber om én fokusert revisjonsrunde. Først da er fase 2-gaten nådd. Ingen koding, merge eller deploy før det.

*(Tidligere instruks til Claude om å generere B/C er utført 2026-10-15 17:32–17:47.)*

## Statusregel: etter HVER arbeidsoppgave

Rapporter: Fase X/9 | Navn på oppgaven | **Verifisert utført** | Gjenstår | Neste konkrete steg | Bevis i GitHub/preview/screenshot. Ingen fullført fase uten bekreftede leveranser.

## Wider project

Dette gjelder bare nettsiden. Det større Cidea Marketing-prosjektet krever fortsatt 90 dagers publiseringsklart blogg- og SoMe-innhold, SoMe-flyt og Gullkornet; disse er ikke fullført ved nettsidelansering.

## Latest verification and mode rule (2026-10-15)

Claude's completed PHASE1-VERIFICATION.md confirms Phase 1 gate items passed:
- Safe local checkout, four Stitch skills and automatic discovery of /cidea-website verified.
- Stitch API key read from local Windows environment; authenticated MCP read tested with list_projects, list_screens, get_screen, downloaded HTML/screenshots and rendered successfully.
- Node/Vite build and preview passed; 14/14 browser route/viewport smoke tests passed.
- **Phase 1 fully verified. Phase 2 NOT started** pending user approval to consume Stitch's unknown free quota.
- Existing Stitch screens are historical, NOT the three approved concept directions. Fact-check "OSLO • BERGEN" and remove unusable NO/EN switch during design/content QA.

**Standing mode preference:** Use Work for external multi-step execution. When Work is unnecessary, proactively suggest ordinary ChatGPT/Instant. After each task recommend the next mode. This does not alter the nine-phase plan.
