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
| Lokal Claude Code-skill for valgt metode | OPPRETTET I GITHUB, lokal discovery IKKE verifisert | `.claude/skills/cidea-website/SKILL.md` |
| Konflikterende eldre 10K-skill | FJERNET fra aktiv prosjektsti på eksperimentgren; eldre docs beholdt som historikk | Git commit på PR #13 |
| Offisiell Google Labs Stitch skills repo / README inspisert | FERDIG KILDEGJENNOMGANG | https://github.com/google-labs-code/stitch-skills |
| Handoff/konfigurasjonsveiledning | FERDIG I GITHUB | `STITCH-HANDOFF.md` |
| Stitch workspace / MCP login | **IKKE VERIFISERT**; bruker OAuth kan trenges | — |
| Stitch → Claude asset/design read eller eksport-smoke-test | **IKKE UTFØRT** | — |
| Claude lokal workspace på trygg eksperimentgren | **IKKE VERIFISERT** | — |
| Local Node/build, preview og screenshot-test | **IKKE VERIFISERT I BRUKERS MILJØ**; GitHub CI/build er tidligere bekreftet | — |
| Tre ferdige Stitch-designs | **IKKE LAGET** (hører til fase 2 etter verifisert fase 1) | — |
| Betalte kjøp / live deploy | **INGEN** | — |

## Gate for å avslutte fase 1

[ ] Claude Code lokalt på trygg branch uten tap av lokale endringer.
[ ] `/cidea-website` eller direkte lesning av skill bekreftet.
[ ] Stitch innlogging + fungerende MCP eller verifiserbar eksport → Claude.
[ ] Vite-build, lokal preview, mobil/desktop screenshot test dokumentert.
[ ] `PHASE1-VERIFICATION.md` med ekte resultater, ingen oppdiktede tall.
[ ] Ingen betalinger eller produksjonsendringer.

## Neste konkrete handling

Bruk `STITCH-HANDOFF.md` sitt Claude Code kickoff. Hvis Stitch krever at brukeren autentiserer i nettleseren, be om det én gang, og verifiser deretter. Først etter oppnådd Phase 1-gate starter Phase 2 med `STITCH-CREATIVE-BRIEF.md` og tre *faktiske*, forskjellige visuelle konsepter.

## Statusregel: etter HVER arbeidsoppgave

Rapporter: Fase X/9 | Navn på oppgaven | **Verifisert utført** | Gjenstår | Neste konkrete steg | Bevis i GitHub/preview/screenshot. Ingen fullført fase uten bekreftede leveranser.

## Wider project

Dette gjelder bare nettsiden. Det større Cidea Marketing-prosjektet krever fortsatt 90 dagers publiseringsklart blogg- og SoMe-innhold, SoMe-flyt og Gullkornet; disse er ikke fullført ved nettsidelansering.
