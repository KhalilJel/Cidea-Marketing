---
name: cidea-website
description: Run the approved ChatGPT → Google Stitch → Claude Code production method for Cidea Marketing, including visual quality gates, React integration and no-extra-cost constraints.
---

# Cidea Marketing website production

## Rule zero

Read:
- `docs/cinematic-pilot/MASTER-GAMEPLAN.md`
- `docs/cinematic-pilot/STATUS.md`
- `docs/cinematic-pilot/STITCH-CREATIVE-BRIEF.md`
- `docs/cinematic-pilot/STITCH-HANDOFF.md`
- `docs/cinematic-pilot/INITIAL-AUDIT.md`

**Approved workflow:** ChatGPT owns creative/strategy/QA, Google Stitch owns mockups/typography/visual direction/content composition, Claude Code implements approved design and checks it in the browser. This is a 9-phase, one-gate-at-a-time gameplan. No vendor exploration or shifting toolchain without user request. Existing React/Vite app, GitHub, and hosting. Zero additional NOK unless the user explicitly approves a charge. Paid AI video and Higgsfield are shelved, not required.

## Phase 1: tool & source verification

Confirm safe experiment branch; never overwrite user's local changes. Read official `google-labs-code/stitch-skills` docs and check what is available (especially `stitch::generate-design`, `stitch::design-md`, `stitch::react-components`). The Google Labs Code skill repo explicitly says it is not an officially supported Google product. Vet permissions/scripts before install.

Follow https://stitch.withgoogle.com/docs/mcp/setup/ to configure Stitch MCP in Claude Code or use manually approved Stitch design exports if MCP is unavailable. Never put OAuth/API secrets in repo or prompts. Verify actual read access by listing Stitch projects or exported screens, not merely seeing a connector entry. If auth requires the user, ask one practical question and wait.

Verify local Node, `npm run build` and browser screenshots/preview. Record exact results in `PHASE1-VERIFICATION.md`. Do not call Phase 1 done until design-to-code handoff is actually tested in a minimal smoke test.

## Phase 2: creative work

Give Stitch the FULL `STITCH-CREATIVE-BRIEF.md` and create three visually distinct homepage designs with desktop and mobile examples. The brand exists. All visible content Norwegian. Do not claim Stitch made designs before receiving actual images/project links. No fabricated customer examples or statistics. Get ChatGPT/user design approval before implementation.

## Phase 3: design system and content

After approved direction, create one canonical `DESIGN.md` (type family/fonts/æøå, palette, spacing, components, illustrations, imagery, page layouts, mobile states, animations and reduced-motion versions) and full page mockups. Export actual designs and assets to the repo under clearly named review folders and document licenses. ChatGPT reviews Norwegian copy.

## Phases 4 to 9

Use the detailed `MASTER-GAMEPLAN.md`. Code motion with CSS, SVG, React/JS; do not generate paid video. Implement against the approved Stitch screenshots and `DESIGN.md`, no independent aesthetic reinterpretation. Fix blog, services, contact inbox, visual filler, route metadata and trust elements. Browser QA against rendered design, build and Lighthouse; only deploy after explicit approval.

## Mandatory completion update after EVERY task

`Fase X/9 | Oppgave | Verifisert utført med lenke/screenshot/test | Gjenstår før fasegodkjenning | Neste steg | Blokkering`

**Always end every task (and every reply that closes a task or reports a status change) with a summary the owner can forward to ChatGPT, placed inside one fenced ```text code block so the app shows a copy button.** Write it in Norwegian and make it self-contained: status, branch and commit SHA, what changed and why, actual test results (including what was not run), evidence paths, known deviations, preview link, what ChatGPT should assess, and next step.

Never invent completion or treat passing CI as proof that a page looks polished. Stop all unrelated work until current phase gate passed. Do not merge PR #11 or #13 without approval.

## Work vs. ordinary ChatGPT mode

The user explicitly requests: Use Work only when needed for substantive external execution; **whenever Work is not necessary, always suggest switching to a normal ChatGPT/Instant conversation**. Include recommended next mode in progress updates. Never claim to control or change account UI mode automatically.
