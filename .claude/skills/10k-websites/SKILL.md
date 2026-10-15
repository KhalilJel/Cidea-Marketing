---
name: 10k-websites
description: Follow the 10K Websites v0.2.0 cinematic design methodology for Cidea Marketing, adapted to the existing React/Vite site and its nine-phase master gameplan. Use for the cinematic website pilot.
---

# Cidea Marketing: 10K Websites (v0.2.0)

This is the Cidea project-specific entry point for the official upstream skill at https://github.com/thatswyn/10k-websites (v0.2.0, tree `b5874f88e1c3b8f3da0ecadcec0c27a5e92eb254`, MIT license).

**Before any work:**
1. Read `docs/cinematic-pilot/MASTER-GAMEPLAN.md`, `docs/cinematic-pilot/INITIAL-AUDIT.md` and `docs/cinematic-pilot/VIDEO-NOTES.md`.
2. Fetch/pin and inspect the upstream skill from the exact repository above in a **separate local, ignored reference directory** (`.cidea-tools/10k-websites`; do not auto-execute downloaded scripts). Read its `SKILL.md` and `references/setup.md` first, then phase-specific references and templates as they become needed. Preserve the upstream MIT license. Do not use an arbitrary zip, fork or newer version without a diff review.
3. Keep to the **nine-phase Cidea master gameplan**: Phase X/9, one task at a time, user approval gates. The upstream's 11 phases are reference material, not Cidea progress reporting.

**Locked technology:** Claude Code + Higgsfield + FFmpeg + GitHub + **existing hosting**. Do not compare or migrate to other tools, buy Hostinger or change DNS/MX. Higgsfield's official 2026 instructions distinguish Claude Desktop MCP (`https://mcp.higgsfield.ai/mcp`) from Claude Code CLI (`npm i -g @higgsfield/cli`; `higgsfield auth login`). Verify current instructions at https://higgsfield.ai/mcp before installation; do not assume account credits or CLI access are active. Never expose secrets. Ask for user approval before paid media generation or changes to hosting.

**Architecture overrides over upstream:** Preserve the current React/Vite application, service routes, blog and SEO; don't replace it with the upstream vanilla-HTML one-page deployment model. Adapt `templates/hero-scrub.js` and CSS to a React component with proper cleanup and accessible HTML text. The upstream static `verify-build.sh index.html` is **not** an adequate check of a React/Vite build; use `npm run build`, Playwright/browser tests, Lighthouse, visual screenshots and media validation instead. Keep mobile, low-bandwidth, no-video and reduced-motion experiences high quality. Keep no fictitious clients, false results or unlabeled case studies. Norwegian copy first, no pointless 01/02/03, English micro-labels or `gratis`.

**Protect work:** Do not merge draft PR #11 or #13, spend credits, deploy, or alter production without user approval. Document verifiable deliverables on the experiment branch and link evidence.

**Progress format after every task:**
`Fase X/9 | Oppgave | Verifisert utført | Gjenstår | Neste steg | Dokumentasjon`

**Begin with Phase 1/9 only.** Audit environment, confirm upstream reference is safely present, verify Node/FFmpeg/preview and set up Higgsfield with the user's OAuth step. No generation before creative and budget approval.
