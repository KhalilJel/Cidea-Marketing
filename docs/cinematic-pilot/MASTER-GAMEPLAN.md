# Cidea Marketing — Master Gameplan (Approved production method)

**Decision date:** 2026-10-15
**Status:** PHASE 1/9 IN PROGRESS; 0/9 phases fully verified.
**Objective:** Replace the existing weak cideamarketing.com experience with an extraordinary, original, professional, conversion-ready Norwegian digital-agency website. Distinctive art direction, real content, elegant code-based interactions, desktop/mobile quality, SEO, working contact and real blog publishing are non-negotiable.
**Selected workflow (user-approved):** **ChatGPT (creative director and QA) → Google Stitch (visual design + graphic/content design) → Claude Code (React implementation + technical QA) → ChatGPT (visual approval and repeat)**.
**Other infrastructure:** GitHub and EXISTING hosting. Existing React + Vite repo and routes. **0 NOK additional spend** unless separately approved. No paid AI video, no Higgsfield, no Hostinger, no domain/DNS/MX changes.
**Experiment branch:** `experiment/cinematic-marketing-pilot`, draft PR #13. PR #11 (older design-system draft) must not be merged/changed without separate review. Production `main` stays untouched until approved launch.
**Sources for developer workflow:** https://github.com/google-labs-code/stitch-skills (Google Labs Code community-maintained open source; project README says not an officially supported Google product); https://stitch.withgoogle.com/docs/mcp/setup/ . Skills and MCP availability/limits must be verified locally before any claim of working integration. Don't execute downloaded scripts without review.

## Role responsibilities

### ChatGPT: Head of creative and website production
Own competitive/target audience research, positioning, brief and copy standards, approve user-facing creative directions with user, define design and content quality gates, maintain master status, visually QA actual renders rather than judge code alone. ChatGPT does not claim Stitch or Claude actions it hasn't verified.

### Google Stitch: Visual and content studio
Propose **THREE fundamentally different** visual worlds; typography including Norwegian glyph coverage, palette, layout, original illustrations / visual treatments, photography direction, homepage and inner-page layouts, mobile versions, CTA composition and image placements; create handoff assets and `DESIGN.md`. Draft copy can be developed in Stitch, but ChatGPT must edit and approve text, SEO and factual accuracy. AI-generated media must have appropriate commercial rights, or be replaced with clear-license assets/CSS/SVG.

### Claude Code: Engineering and integration
Work in existing React/Vite repo, safely fetch user-approved Stitch exports/URL/project through verified MCP or approved exports, extract tokens/illustration assets, implement components and routes, add motion with CSS/SVG/JS, working contact and blog, SEO, accessibility, performance, and run build/browser screenshot tests. Compare implementation pixel-wise/visually to approved Stitch references. NEVER independently reinterpret approved art direction without raising it.

## Scope: Website only
Completion of website does not mean whole Cidea Marketing foundation complete. The 90-day social post bank, 90-day full blog-content bank, social profiles/automation and Gullkornet lead generation are subsequent deliverables in the larger eight-phase Cidea business masterplan. But this website must include a complete usable blog/publishing workflow and all initial approved articles required for launch.

## The nine execution phases: one gate at a time

### PHASE 1 — Setup and integration audit [ACTIVE]
- [x] Existing React/Vite repository audited (see `INITIAL-AUDIT.md`).
- [x] Branch, draft PR and GitHub CI baseline established; prior records preserved.
- [x] User selected **ChatGPT → Stitch → Claude Code**, without paid video.
- [ ] Check the current Google Stitch workspace/access, generation allowance and free-tier limits; do not spend.
- [ ] Review Google Labs Stitch skills source & install **selectively** for Claude Code project (suggest `stitch::generate-design`, `stitch::design-md`/`extract-design-md`, `stitch::react-components`; names/availability must be verified). Configure Stitch MCP with official instructions / user OAuth; no credentials in repo.
- [ ] Confirm Claude Code local checkout, working tree and the updated project handoff documents on this branch; do not overwrite uncommitted work.
- [ ] Verify Node, React build, local preview and screenshot/browser QA baseline; record receipts and actual tool connections in `PHASE1-VERIFICATION.md`.
**Gate:** Stitch accessible, Claude Code & Stitch MCP/asset-export pathway demonstrably usable, clean React build and preview testable. If Stitch MCP cannot be enabled, an approved manual HTML/asset export is an acceptable fallback. No unverified checkmarks.

### PHASE 2 — Research, strategy and three design concepts [NOT STARTED]
- [ ] Research client audience, agency peers & outstanding visual references (design patterns, not copied designs).
- [ ] Finalize concise Norwegian positioning, audience, benefits, site goal (qualified consultations) and complete page structure.
- [ ] Send `STITCH-CREATIVE-BRIEF.md` to Stitch and produce three **clearly differentiated** creative directions, full desktop home mockups + first mobile composition, each with typography/palette/media direction, CTA and rationale.
- [ ] ChatGPT reviews aesthetics and commercial fit; user approves ONE direction, or gives one focused revision round.
**Gate:** Verifiable three designs, preview links/images, user-approved chosen concept. Do not move ahead on verbal descriptions alone.

### PHASE 3 — Final visual identity, content/design system & all-page mockups [NOT STARTED]
- [ ] Stitch refines chosen direction into logo/wordmark treatment, type scale, color tokens, responsive spacing, buttons, icon language, image style, reusable components.
- [ ] Stitch designs homepage, agreed service pages, about, truthful portfolio/concepts, blog index, article and contact in desktop and mobile variants.
- [ ] ChatGPT approves Norwegian headings/body copy, customer path and content accuracy. Avoid repetitive copy, numbered decorative labels, English microcopy, fake testimonials/projects/metrics and forbidden `gratis` copy.
- [ ] Export validated `DESIGN.md`, layouts, styles/tokens and asset inventory with licenses.
**Gate:** User-approved complete visual blueprint with source assets and exportable handoff; no unresolved placeholders.

### PHASE 4 — Produce licensed media and code-based motion [NOT STARTED]
- [ ] Create/refine key graphics via Stitch where included at zero additional cost, and produce CSS/SVG illustrations, abstract assets, photographic art direction.
- [ ] Choose licensed images; document provenance and commercial reuse rights; avoid watermarked/unclear license outputs.
- [ ] Define simple original scroll/hover/reveal interactions with reduced motion, keyboard handling and mobile fallbacks. No paid film required.
- [ ] Match every visual asset to final page content and crops.
**Gate:** All core visual assets/patterns finished, approved and rights-checked.

### PHASE 5 — Build and perfect homepage [NOT STARTED]
- [ ] Claude takes approved Stitch design + `DESIGN.md`, implements in **existing Vite/React**, preserving routes and codebase.
- [ ] Builds hero, navigation, social proof only when factual, services, capability showcase, blog preview and one clear CTA.
- [ ] React/CSS/SVG motion with mobile-first quality and accessible fallback.
- [ ] Browser renders at 320/375/768/1440; compare to Stitch screens and fix visual drift.
**Gate:** Live test preview of homepage works, visual fidelity is documented, user approves.

### PHASE 6 — All inner pages and actual content [NOT STARTED]
- [ ] Implement Nettsider, Branding, SEO, Sosiale medier / Digital markedsføring, About, relevant honest Work/Concepts, Blog index, article template, Contact.
- [ ] Genuine complete Norwegian copy; secondary English only if actually translated end-to-end.
- [ ] Working blog creation/update/publishing process, not static lorem ipsum; real initial articles reviewed.
- [ ] Working contact channel to **verified Cidea Marketing inbox** rather than old SmartSvar mailto; test submissions.
**Gate:** All agreed routes complete, no placeholders, fake examples or dead links.

### PHASE 7 — Technical SEO, analytics and performance [NOT STARTED]
- [ ] Titles/descriptions/canonical/OG/schema per route, sitemap, robots and proper crawlable text/HTML; fix current `Meta` rendering issue if confirmed.
- [ ] Optimize assets/fonts, code splitting and loading; measure CWV/Lighthouse on real builds.
- [ ] Accessible navigation/forms/focus, keyboard/reduced-motion, consent/privacy and privacy-conscious analytics.
- [ ] Test actual inbound contact → response workflow and ensure service inquiries reach intended destination.
**Gate:** Documented SEO and functional readiness, measurements and exception log.

### PHASE 8 — Aesthetic & functional QA loop [NOT STARTED]
- [ ] Compare EVERY finished route desktop and mobile to chosen approved Stitch reference.
- [ ] Audit typography, crops, spacing, repeated words, filler, inconsistent labels, scroll rhythm, animation and interactions.
- [ ] Run automated build/browser/visual/functional/accessibility smoke checks, measure speed, manually inspect screenshots.
- [ ] User reviews actual preview, iterative improvements until approved.
**Gate:** User approves complete site and all critical issues closed with test receipts.

### PHASE 9 — Controlled release & verify [NOT STARTED]
- [ ] Review PR #11 design-system work for conflicts, resolve only useful pieces with user approval.
- [ ] User explicitly approves merge and production release.
- [ ] Deploy using current hosting, without DNS/MX changes.
- [ ] Verify live domain, mobile and desktop, links, contact test, SEO, assets and analytics; document rollback and maintenance.
**Gate:** Site verified live and approved by user.

## Progress discipline
After **every individual completed work item**, report: **Phase X/9, current task, verified completed with proof, incomplete current gate, next concrete task, blockers/user decision**. NEVER mark phase complete without all gated deliverables. Keep change history committed to GitHub.
Website production always has priority until this plan is finished. Do not restart research into other vendors without user explicitly reopening the decision.

## Initial snapshot at selection
Phase 1/9 remains OPEN. ChatGPT/Stitch/Claude methodology SELECTED. Stitch design workspace/MCP integration not yet confirmed, no new Stitch designs generated, no new working code submitted for launch. Existing production unaffected. Next deliverable: `STITCH-CREATIVE-BRIEF.md`, developer handoff and verification of Stitch connection/preview path.

## ChatGPT mode choice — user's standing preference (2026-10-15)

**Use Work only when the task genuinely benefits from multi-step execution**, such as navigating external services, researching across several resources, producing/reviewing design assets, running the Cidea gameplan across GitHub and Stitch, or substantial implementation coordination. If a conversation shifts to straightforward Q&A, brainstorming, brief advice, explanations, or a simple decision that doesn't need Work, **ALWAYS proactively suggest switching from Work to normal ChatGPT/Instant mode**. Do not demand a mode switch for a task that clearly benefits from Work. The assistant cannot directly switch the user's mode; suggest the change plainly at the right moment. Respect the user's chosen mode if they continue there.

This is part of the after-task update: `Recommended mode for next task: Work / normal chat`, with a one-phrase reason. Keep it unobtrusive.
