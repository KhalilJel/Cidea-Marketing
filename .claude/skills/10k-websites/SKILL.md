---
name: 10k-websites
description: Follow the 10K Websites v0.2.0 cinematic design methodology for Cidea Marketing, adapted to the existing React/Vite site and its nine-phase master gameplan. Use for the cinematic website pilot.
---

# Cidea Marketing: 10K Websites (v0.2.0)

This is the Cidea project-specific entry point for the official upstream skill at https://github.com/thatswyn/10k-websites (v0.2.0, commit `b5874f88e1c3b8f3da0ecadcec0c27a5e92eb254`, MIT license).

**Before any work:**
1. Read `docs/cinematic-pilot/MASTER-GAMEPLAN.md`, `docs/cinematic-pilot/INITIAL-AUDIT.md` and `docs/cinematic-pilot/VIDEO-NOTES.md`.
2. Fetch/pin and inspect the upstream skill from the exact repository above in a **separate local, ignored reference directory** (`.cidea-tools/10k-websites`; do not auto-execute downloaded scripts). Read its `SKILL.md` and `references/setup.md` first, then phase-specific references and templates as they become needed. Preserve the upstream MIT license. Do not use an arbitrary zip, fork or newer version without a diff review.
3. Keep to the **nine-phase Cidea master gameplan**: Phase X/9, one task at a time, user approval gates. The upstream's 11 phases are reference material, not Cidea progress reporting.

**Current budget-safe technology:** Claude Code, React/Vite, CSS/SVG/JavaScript animation, GitHub and **existing hosting**. Preserve the upstream 10K Websites creative-direction, research, copy, storyboard and QA methodology, but **SKIP all paid AI video generation and Higgsfield auth/CLI setup until the user explicitly reauthorizes a budget**. No new subscriptions, credits, paid media, Hostinger or DNS/MX changes. Higgsfield and FFmpeg remain optional for a future upgrade, not requirements of the current plan.

**Architecture overrides over upstream:** Preserve the current React/Vite application, service routes, blog and SEO; don't replace it with the upstream vanilla-HTML one-page deployment model. Use React-compatible scroll/visual animation and accessible HTML text, preferably CSS/SVG and lightweight JavaScript. Upstream `templates/hero-scrub.js` and FFmpeg/video tooling are references for a future paid-video upgrade, not current requirements. The upstream static `verify-build.sh index.html` is **not** an adequate check of a React/Vite build; use `npm run build`, Playwright/browser tests, Lighthouse, visual screenshots and media validation instead. Keep mobile, low-bandwidth, no-video and reduced-motion experiences high quality. Build a full premium homepage **without video**. Keep no fictitious clients, false results or unlabeled case studies. Norwegian copy first, no pointless 01/02/03, English micro-labels or `gratis`.

**Protect work:** Do not merge draft PR #11 or #13, spend credits, deploy, or alter production without user approval. Document verifiable deliverables on the experiment branch and link evidence.

**Progress format after every task:**
`Fase X/9 | Oppgave | Verifisert utført | Gjenstår | Neste steg | Dokumentasjon`

**Begin with Phase 1/9 only.** Audit environment, confirm upstream reference is safely present, verify Node/build/browser preview. No Higgsfield OAuth/credits or FFmpeg verification is required in the no-video route. No spending without explicit approval.
