# Cidea Marketing — Master Gameplan (Approved production method)

**Decision date:** 2026-10-15
**Status:** PHASES 1–4 USER-APPROVED; **PHASE 5/9 IN PROGRESS** as of 2026-10-17. **4/9 phase gates approved**. Phase 4 approved with conditions in `phase4/CHATGPT-REVIEW.md`; phase 5 React implementation delivered by Claude; ChatGPT screenshot review completed 2026-10-17; Claude implemented both visual revisions the same day (`phase5/REVISJON-NETTBRETT.md`); awaiting ChatGPT QA and owner approval. No production changes.
**Objective:** Replace the existing weak cideamarketing.com experience with an extraordinary, original, professional, conversion-ready Norwegian digital-agency website. Distinctive art direction, real content, elegant code-based interactions, desktop/mobile quality, SEO, working contact and real blog publishing are non-negotiable.
**Selected workflow (user-approved 2026-10-17):** **ChatGPT — hjernen (strategy, creative direction, briefs, coordination and visual QA) → Higgsfield — artisten (images, film and visual assets) → Claude Code — koderen (React/Vite, integration, scroll choreography and technical QA) → ChatGPT/eier review**. Owner relays prompts and reports between ChatGPT and Claude. Google Stitch is no longer an active production stage; its exports and earlier decisions remain historical foundations.
**Other infrastructure:** GitHub and EXISTING hosting. Existing React + Vite repo and routes. User has authorized necessary paid visual tooling in principle and connected Higgsfield with an active three-day trial. Use current available credits for a bounded test; no new subscription, purchase or automatic renewal action by ChatGPT. No Hostinger or domain/DNS/MX changes. Older no-video/no-Higgsfield/zero-spend instructions below are historical and superseded for this new visual work.
**Experiment branch:** `experiment/cinematic-marketing-pilot`, draft PR #13. PR #11 (older design-system draft) must not be merged/changed without separate review. Production `main` stays untouched until approved launch.
**Sources for developer workflow:** https://github.com/google-labs-code/stitch-skills (Google Labs Code community-maintained open source; project README says not an officially supported Google product); https://stitch.withgoogle.com/docs/mcp/setup/ . Skills and MCP availability/limits must be verified locally before any claim of working integration. Don't execute downloaded scripts without review.

## Role responsibilities

### ChatGPT: Head of creative and website production
Own competitive/target audience research, positioning, brief and copy standards, approve user-facing creative directions with user, define design and content quality gates, maintain master status, visually QA actual renders rather than judge code alone. ChatGPT does not claim Stitch or Claude actions it hasn't verified.

### Higgsfield: Active visual artist
Produce art-directed keyframes, images and cinematic footage from ChatGPT briefs. Check credits and estimate costs before bounded runs; review actual results for continuity, legibility and mobile cropping. Existing trial does not authorize a new purchase or subscription change. Media generation is not website coding or hosting. Claude integrates approved assets into existing React/Vite.

### Google Stitch: Historical visual and content studio (no longer active)
Propose **THREE fundamentally different** visual worlds; typography including Norwegian glyph coverage, palette, layout, original illustrations / visual treatments, photography direction, homepage and inner-page layouts, mobile versions, CTA composition and image placements; create handoff assets and `DESIGN.md`. Draft copy can be developed in Stitch, but ChatGPT must edit and approve text, SEO and factual accuracy. AI-generated media must have appropriate commercial rights, or be replaced with clear-license assets/CSS/SVG.

### Claude Code: Engineering and integration
Work in existing React/Vite repo, safely fetch user-approved Stitch exports/URL/project through verified MCP or approved exports, extract tokens/illustration assets, implement components and routes, add motion with CSS/SVG/JS, working contact and blog, SEO, accessibility, performance, and run build/browser screenshot tests. Compare implementation pixel-wise/visually to approved Stitch references. NEVER independently reinterpret approved art direction without raising it.

## Scope: Website only
Completion of website does not mean whole Cidea Marketing foundation complete. The 90-day social post bank, 90-day full blog-content bank, social profiles/automation and Gullkornet lead generation are subsequent deliverables in the larger eight-phase Cidea business masterplan. But this website must include a complete usable blog/publishing workflow and all initial approved articles required for launch.

## The nine execution phases: one gate at a time

### PHASE 1 — Setup and integration audit [VERIFIED 2026-10-15]
- [x] Existing React/Vite repository audited (see `INITIAL-AUDIT.md`).
- [x] Branch, draft PR and GitHub CI baseline established; prior records preserved.
- [x] User selected **ChatGPT → Stitch → Claude Code**, without paid video.
- [x] Check the current Google Stitch workspace/access; do not spend. (Access verified; free-tier limits are not exposed via the API — check them in the Stitch account.)
- [x] Review Google Labs Stitch skills source & install **selectively** for Claude Code project (suggest `stitch::generate-design`, `stitch::design-md`/`extract-design-md`, `stitch::react-components`; names/availability must be verified). Configure Stitch MCP with official instructions / user OAuth; no credentials in repo.
- [x] Confirm Claude Code local checkout, working tree and the updated project handoff documents on this branch; do not overwrite uncommitted work.
- [x] Verify Node, React build, local preview and screenshot/browser QA baseline; record receipts and actual tool connections in `PHASE1-VERIFICATION.md`.
**Gate:** Stitch accessible, Claude Code & Stitch MCP/asset-export pathway demonstrably usable, clean React build and preview testable. If Stitch MCP cannot be enabled, an approved manual HTML/asset export is an acceptable fallback. No unverified checkmarks.

### PHASE 2 — Research, strategy and three design concepts [GATE MET 2026-10-15 – user chose concept C]
- [ ] Research client audience, agency peers & outstanding visual references (design patterns, not copied designs).
- [ ] Finalize concise Norwegian positioning, audience, benefits, site goal (qualified consultations) and complete page structure.
- [x] Send `STITCH-CREATIVE-BRIEF.md` to Stitch and produce three **clearly differentiated** creative directions, full desktop home mockups + first mobile composition, each with typography/palette/media direction, CTA and rationale.
- [x] ChatGPT reviews aesthetics and commercial fit; user approves ONE direction, or gives one focused revision round. (ChatGPT: `phase2/CREATIVE-REVIEW.md` recommends C; user chose C, 34/400 credits.)
**Gate:** Verifiable three designs, preview links/images, user-approved chosen concept. Do not move ahead on verbal descriptions alone.
_Note (Claude): the two research/positioning items above are ChatGPT deliverables; Claude has not verified them and leaves them for ChatGPT to tick._

### PHASE 3 — Final visual identity, content/design system & all-page mockups [USER APPROVED 2026-10-16, see `phase3/README.md` and `phase3/CHATGPT-REVIEW-UTKAST2.md`]
- [ ] Stitch refines chosen direction into logo/wordmark treatment, type scale, color tokens, responsive spacing, buttons, icon language, image style, reusable components.
- [ ] Stitch designs homepage, agreed service pages, about, truthful portfolio/concepts, blog index, article and contact in desktop and mobile variants.
- [ ] ChatGPT approves Norwegian headings/body copy, customer path and content accuracy. Avoid repetitive copy, numbered decorative labels, English microcopy, fake testimonials/projects/metrics and forbidden `gratis` copy.
- [ ] Export validated `DESIGN.md`, layouts, styles/tokens and asset inventory with licenses.
**Gate:** User-approved complete visual blueprint with source assets and exportable handoff; no unresolved placeholders.

### PHASE 4 — Produce licensed media and code-based motion [USER APPROVED WITH CONDITIONS 2026-10-17]
- [ ] Create/refine key graphics via Stitch where included at zero additional cost, and produce CSS/SVG illustrations, abstract assets, photographic art direction.
- [ ] Choose licensed images; document provenance and commercial reuse rights; avoid watermarked/unclear license outputs.
- [ ] Define simple original scroll/hover/reveal interactions with reduced motion, keyboard handling and mobile fallbacks. No paid film required.
- [ ] Match every visual asset to final page content and crops.
**Gate:** CLOSED by explicit owner approval with `phase4/CHATGPT-REVIEW.md` conditions. Asset/motion package accepted as foundation. Stitch/Labs commercial-rights review remains OPEN before publication; approval does not assert legal clearance. Delivered evidence: `phase4/README.md`, `ASSETS.md`, `QA.md`, `motion/TEST-RESULTATER.md`. Historical unchecked subtasks above are superseded by this gate decision; prototype test results are Claude reports, not newly rerun tests.

### PHASE 5 — Build and perfect homepage [IN PROGRESS — CINEMATIC SCROLL EXPERIENCE 2026-10-17]
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

## Historical initial snapshot (superseded)
At selection, Stitch integration had not yet been confirmed. The verified Phase 1 integration, chosen Phase 2 concept C, approved Phase 3 blueprint, and active Phase 4 brief now supersede that initial state. Existing production remains unaffected.

## ChatGPT mode choice — user's standing preference (2026-10-15)

**Use Work only when the task genuinely benefits from multi-step execution**, such as navigating external services, researching across several resources, producing/reviewing design assets, running the Cidea gameplan across GitHub and Stitch, or substantial implementation coordination. If a conversation shifts to straightforward Q&A, brainstorming, brief advice, explanations, or a simple decision that doesn't need Work, **ALWAYS proactively suggest switching from Work to normal ChatGPT/Instant mode**. Do not demand a mode switch for a task that clearly benefits from Work. The assistant cannot directly switch the user's mode; suggest the change plainly at the right moment. Respect the user's chosen mode if they continue there.

This is part of the after-task update: `Recommended mode for next task: Work / normal chat`, with a one-phrase reason. Keep it unobtrusive.


## Decision record — 2026-10-16: user approved phase 3
User explicitly accepted **phase 3 and concept C as the design foundation**, and instructed execution of phase 4 at **0 NOK additional cost**. The full Phase 3 blueprint gate is therefore **CLOSED/APPROVED AS FOUNDATION**; aesthetic refinements, motif diversity, accessibility fixes and rights review documented in `phase3/CHATGPT-REVIEW-UTKAST2.md` carry forward as **Phase 4/5/8 acceptance criteria**, rather than reopening Phase 3. Unknown legal/contact/company facts are **launch blockers**, never permission to fabricate. Claude owns all coding. Phase 4 may produce isolated SVG/motion prototypes but must **not** build the full site prematurely. Phase 4 is not complete until actual assets, visual QA, licenses and user review are demonstrated.

## Decision record — 2026-10-17: explicit phase 4 approval and phase 5 start
Owner explicitly approved phase 4 with all conditions in `phase4/CHATGPT-REVIEW.md`, and authorized the actual React/Vite homepage on the experiment branch. Four phase gates approved; phase 5 remains unapproved. Claude Code owns ALL code changes and technical browser QA; ChatGPT owns coordination, documents and review. See `phase5/EXECUTION-BRIEF.md` for verified structure audit and ordered tasks. No merge, deploy, purchases, new Stitch usage or DNS/MX changes. Before live: resolve Stitch/Labs rights, company facts, contact recipient/process, data retention and privacy. K5 permits useful long sections but requires measured rhythm and zero horizontal overflow. Re-test 580ms motion, reduced-motion and fallbacks in the real page. Report evidence, remaining work, next task and link after every task; recommend normal ChatGPT when execution is no longer needed.

## Phase 5 review — 2026-10-17, Work continuation
Claude implementation exists at a26e7f7. ChatGPT independently ran npm ci and npm run build successfully and inspected committed screenshots at 320/375/768/1440 against phase 3 references. Browser suites remain Claude-reported (26/26 and 56/56); fresh browser rerun blocked by unavailable browser binaries. Two visual revisions remain: tablet graphic scale and concepts-before-process ordering. See phase5/CHATGPT-REVIEW.md for evidence and actionable Claude tasks. No Claude Code session is exposed in this Work environment; handoff prepared, execution NOT claimed. Phase 5 remains open.

## Governing decision — 2026-10-17: three-AI method and cinematic homepage
Owner explicitly chose: ChatGPT hjernen, Claude koderen, Higgsfield artisten. Trial started by owner; connection and read-only balance confirmed (110 available credits, including 100 trial credits, trial ends 2026-10-20 14:41 UTC). This supersedes earlier active Stitch workflow and no-Higgsfield/no-video limits; preserve earlier records as history. Do not infer authority for renewals or purchases. Owner is the relay to Claude, so lack of direct Claude access is not a blocker.

Homepage itself must be a cinematic sequence driven forward/backward by native scrolling, with real readable HTML copy/navigation/CTA. No website-within-website mockups; ROM trial rejected. Service/blog/contact pages may use normal layouts. Both earlier tablet P2 revisions are accepted by ChatGPT, but overall phase 5 remains open. Current visual trial: one coherent camera pullback from macro ceramic C to full physical CIDEA typography. Storyboard is a proposal, not approved final logo/art direction. Higgsfield keyframe job 4bf5a2f9-583a-4d5d-9ff3-d8e369a7b027 submitted; estimated 0.25 credit. A six-second 720p no-audio Seedance 2.5 test is quoted at 42 credits but NOT yet submitted at this record. Do not count queued work as complete.

Next: complete/review keyframes, one continuity film test, owner creative review, Claude scroll prototype on experiment branch, actual mobile/performance/reduced-motion/failure tests, ChatGPT and owner review. No phase 6 until owner phase 5 approval; no merge/production deploy. Motion duration 580ms remains for existing UI transitions, not a cap on the newly requested film. Preserve functional layout/code and build fallback for reduced motion/loading failure.

## Reference decision — 2026-10-17: Dentsu Creative (proposal stage, not approved)
Owner selected https://www.dentsucreative.com/ as the main reference for a living, cinematic homepage with motion and crafted transitions; service, blog and contact pages may stay plain and clear. Earlier abstract geometry, the ROM mockup and the CIDEA storyboard no longer steer the next proposal. Previously approved work (phases 1–4, tablet revision f26e9fd) stays as history and comparison baseline; the new direction is NOT approved. Claude must deliver an evidence-based REA analysis (`phase5/rea-dentsu/ANALYSE.md`) and one Cidea proposal with storyboard (`CIDEA-FORSLAG.md`) before any production. Status at this record: REA 6.5.0 installed and verified locally; analysis blocked because the cloud environment's network policy denies www.dentsucreative.com (see `phase5/rea-dentsu/README.md`). No site code change, no Higgsfield generation, no merge or deploy.
