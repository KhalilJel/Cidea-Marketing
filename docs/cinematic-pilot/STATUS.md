# Cidea Marketing – Status / verificerbar fremdrift

**Oppdatert:** 2026-10-15
**Nå:** FASE **1/9**, IN PROGRESS; **0/9** hele faser verifisert.
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
| Lokal Claude Code-skill for valgt metode | LEST OG FULGT av Claude Code 2026-10-15; automatisk `/cidea-website`-oppdagelse venter på brukersjekk | `PHASE1-VERIFICATION.md` § 2 |
| Konflikterende eldre 10K-skill | FJERNET fra aktiv prosjektsti på eksperimentgren; eldre docs beholdt som historikk | Git commit på PR #13 |
| Offisiell Google Labs Stitch skills repo / README inspisert | FERDIG KILDEGJENNOMGANG | https://github.com/google-labs-code/stitch-skills |
| Handoff/konfigurasjonsveiledning | FERDIG I GITHUB | `STITCH-HANDOFF.md` |
| Stitch-skills (4 stk, festet commit) | INSTALLERT prosjektlokalt etter kodegjennomgang | `PHASE1-VERIFICATION.md` § 3 |
| Stitch workspace / MCP login | KONFIGURERT i `.mcp.json` (nøkkel via `STITCH_API_KEY`); endepunkt målt (200, 15 verktøy, 401 uten nøkkel); **venter på brukerens API-nøkkel** | `PHASE1-VERIFICATION.md` § 4 |
| Stitch → Claude asset/design read eller eksport-smoke-test | **IKKE UTFØRT** – krever nøkkel | — |
| Claude lokal workspace på trygg eksperimentgren | VERIFISERT (ren arbeidskopi, HEAD `b17bafa`) | `PHASE1-VERIFICATION.md` § 1 |
| Local Node/build, preview og screenshot-test | VERIFISERT: Node 24.21.0, build OK, preview+dev 200, 14/14 rute-sjekker 390/1440 | `PHASE1-VERIFICATION.md` § 5, `evidence/phase1/` |
| Tre ferdige Stitch-designs | **IKKE LAGET** (hører til fase 2 etter verifisert fase 1) | — |
| Betalte kjøp / live deploy | **INGEN** | — |

## Gate for å avslutte fase 1

[x] Claude Code lokalt på trygg branch uten tap av lokale endringer.
[ ] `/cidea-website` eller direkte lesning av skill bekreftet.
[ ] Stitch innlogging + fungerende MCP eller verifiserbar eksport → Claude.
[x] Vite-build, lokal preview, mobil/desktop screenshot test dokumentert.
[ ] `PHASE1-VERIFICATION.md` med ekte resultater, ingen oppdiktede tall.
[x] Ingen betalinger eller produksjonsendringer.

## Neste konkrete handling

Bruk `STITCH-HANDOFF.md` sitt Claude Code kickoff. Hvis Stitch krever at brukeren autentiserer i nettleseren, be om det én gang, og verifiser deretter. Først etter oppnådd Phase 1-gate starter Phase 2 med `STITCH-CREATIVE-BRIEF.md` og tre *faktiske*, forskjellige visuelle konsepter.

## Statusregel: etter HVER arbeidsoppgave

Rapporter: Fase X/9 | Navn på oppgaven | **Verifisert utført** | Gjenstår | Neste konkrete steg | Bevis i GitHub/preview/screenshot. Ingen fullført fase uten bekreftede leveranser.

## Wider project

Dette gjelder bare nettsiden. Det større Cidea Marketing-prosjektet krever fortsatt 90 dagers publiseringsklart blogg- og SoMe-innhold, SoMe-flyt og Gullkornet; disse er ikke fullført ved nettsidelansering.

## Latest progress interpretation / mode rule

Claude's detailed `PHASE1-VERIFICATION.md` on the experiment branch confirms:
- Local branch checkout, selective Stitch skills, Node/Vite build and preview, 14/14 two-viewport browser checks **verified**.
- Stitch MCP is configured but **not authenticated**: `STITCH_API_KEY` not yet available; `list_projects` cannot yet be authenticated. User must create/store a key privately in their local environment and restart/authorize Claude.
- The `/cidea-website` command has not yet been confirmed automatically discovered in a fresh Claude session.
- **Fase 1 is therefore still open**, no Phase 2 designs exist yet.

**Standing mode preference:** Use Work for real cross-tool project execution; when it is not needed, proactively suggest switching to ordinary ChatGPT/Instant mode. After each task recommend mode for what comes next. This preference is about ChatGPT mode and does not alter the 9-phase website plan.
