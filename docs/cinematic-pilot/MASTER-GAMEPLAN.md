# Cidea Marketing — Locked Website Master Gameplan

**Date agreed:** 2026-10-15
**Owner:** Cidea
**Scope:** Transform the current cideamarketing.com from its existing Vite/React design into a fully professional, creatively distinctive, cinematic, fast, conversion-ready Norwegian agency website.
**Scope exclusions:** The separate 90-day social-media content bank, 90-day blog editorial bank, social publishing system and Gullkornet lead machine remain required for the **whole Cidea Marketing foundation**, but they are not reasons to prematurely call this website finished. Website must include a real functioning blog/publishing workflow and editorial templates before site launch.
**Priority:** This is the 100%-focus WEBSITE plan. Complete each phase and its acceptance gate before beginning the next; no unrelated AI-tool comparisons, redesigns or other Cidea sites.
**Technology locked:** Claude Code + audited public `thatswyn/10k-websites` v0.2.0 skill + Higgsfield (MCP) + FFmpeg + GitHub + existing hosting. No Hostinger.
**Branch:** `experiment/cinematic-marketing-pilot` — draft PR #13. Draft PR #11 remains isolated until integration review.
**Live production:** Do not merge, deploy, buy media credits, alter DNS/MX or change hosting without explicit approval.

## What finished means

A visitor should feel the 'wow' of a premium cinematic site AND rapidly understand services and trust Cidea enough to request a meeting. A site is not done unless desktop/mobile look polished, movie scrubbing is smooth when applicable, accessible fallback is strong, all real pages and contact conversion work, blog infrastructure is functional, SEO and performance are measured, and final preview has been approved before live deployment. Do not fake customers, testimonials, case studies, conversion claims or data. Clearly label internal sample work as concept work, not customers.

## The nine phases and completion gates

### Phase 1 — Environment and production setup [IN PROGRESS]

Steps:
- [x] Existing repo and audit documented in `docs/cinematic-pilot/INITIAL-AUDIT.md`.
- [x] Independent branch + draft PR #13 created; no production changes.
- [ ] Review and safely install newer 10K Websites skill; inspect instructions, scripts, licenses and applicability to React/Vite (not the older zip).
- [ ] Configure/verify Claude Code workspace and Higgsfield MCP access. Never expose credentials in repo; no paid generation without prior approval.
- [ ] Verify Node/build, FFmpeg, screenshots/Playwright, preview workflow and current deployment configuration.
- [ ] Document verified environment results and blockers.

**Gate:** Audited skill, verified Higgsfield connection and safe working preview environment; no production changes.

### Phase 2 — Research and three cinematic creative concepts [NOT STARTED]

- [ ] Analyze Norwegian target audience, competitor sites, Cidea services, positioning and conversion goal.
- [ ] Inspect world-class cinematic / creative studio experiences for patterns, not copying.
- [ ] Produce three **genuinely different** directions: visual personality, type/colors, graphics, film subject, camera/scroll narrative, mobile alternative, navigation, hero/copy and CTA.
- [ ] Present actual visual boards/previews and strategic tradeoffs.
- [ ] User selects and approves ONE direction.

**Gate:** Documented and explicitly approved creative concept; no paid media generated beforehand.

### Phase 3 — Design system, all-page direction, storyboard [NOT STARTED]

- [ ] Finalize brand identity treatment, logo deliverables, fonts (æøå support/licensing), palette, iconography and layout systems.
- [ ] Design the homepage beyond the hero, including services, proof of ability, value proposition, blog and CTA.
- [ ] Outline every required inner page and mobile layouts, with precise Norwegian text hierarchy.
- [ ] Create annotated storyboard specifying first/middle/final frames and scroll beats, text safe zones and animation fallbacks.
- [ ] Set expected media quantity and cost ceiling for user approval.

**Gate:** Approved brand kit, page direction, storyboard, asset list and budget.

### Phase 4 — Higgsfield production and media finishing [NOT STARTED]

- [ ] Produce sample still(s), inspect, and request approval.
- [ ] Generate one short film (Tier 1 proof of concept), only after explicit credit/cost approval.
- [ ] Review artifacts, flicker, composition, camera motion and alignment with storyboard.
- [ ] Extend beyond Tier 1 only if visual storytelling benefits and budget approved.
- [ ] Optimize video with FFmpeg; check seek behavior, GOP/keyframes, responsive poster assets, licensing and file size.

**Gate:** Approved, documented, optimized, legally usable media package with fallback poster.

### Phase 5 — Cinematic homepage implementation [NOT STARTED]

- [ ] Implement as React/Vite component(s) inside existing site, not overwrite app with one-file HTML template.
- [ ] Integrate video scroll timing and written, crawlable headline/CTA.
- [ ] Finish all homepage sections with meaningful content and polished layout.
- [ ] Deliberate still-first mobile/data-saving/reduced-motion/video-failure experience.
- [ ] Inspect real desktop/mobile screenshots and interactions.

**Gate:** Homepage is visually approved and fully interactive in an isolated preview.

### Phase 6 — Complete all other website pages [NOT STARTED]

- [ ] Services: Nettsider, Branding, SEO, Sosiale medier (and map existing digital-marketing route to approved IA).
- [ ] About/positioning; real work/case studies or explicitly labeled examples, never fake client results.
- [ ] Blog index, article template, initial approved editorial content, and functional publishing process/CMS decision.
- [ ] Contact conversion page, verified branded destination (current mailto wrongly points to SmartSvar address), tested end-to-end submission/response flow.
- [ ] Norwegian-first coherent copy; optional English experience must truly translate the supported pages or remove misleading toggle until ready.
- [ ] Resolve visual and content issues documented in the initial audit, including generic English labels and decorative numbered UI.

**Gate:** All agreed routes real, consistent, complete and navigable; no placeholders masquerading as finished services/content.

### Phase 7 — SEO, technical quality and conversion [NOT STARTED]

- [ ] Metadata for every route, canonical, Open Graph/social previews, accessible headings and semantic markup.
- [ ] Fix/verify per-route `Meta` behavior, sitemap, robots and appropriate structured data.
- [ ] Image/video loading and caching, real Lighthouse/Core Web Vitals mobile/desktop results; no imaginary claims.
- [ ] Contact CTA and form/mailbox/CRM integration as appropriate; no dead endpoints.
- [ ] Add measurement/analytics with appropriate privacy considerations.

**Gate:** Verified crawlability, lead intake, SEO configuration and measured performance with documented exceptions.

### Phase 8 — Visual & functional QA with user [NOT STARTED]

- [ ] Real screenshots at 320, 375, 768, 1440 px (and other relevant sizes).
- [ ] Visual QA: art direction, rhythm, spacing, font hierarchy, overlap, crop, links, copy, video fallback.
- [ ] Browser tests: keyboard, accessibility, reduced motion, mobile scroll, loading/network failures, pages and contact submission.
- [ ] Check Lighthouse / axe / Playwright findings and fix critical issues.
- [ ] User reviews actual preview, requests iterative improvements, grants final visual sign-off.

**Gate:** Explicit user approval of complete website preview and recorded QA results.

### Phase 9 — Controlled launch and post-launch verification [NOT STARTED]

- [ ] Review differences and reconcile relevant PR #11 design system with cinematic branch; avoid unapproved styles or merge conflicts.
- [ ] User explicitly approves production release; preserve rollback route.
- [ ] Merge and deploy using existing hosting; do not change DNS/MX unnecessarily.
- [ ] Validate cideamarketing.com HTTPS, page routes, SEO/indexability, video delivery, analytics, live contact/test lead, desktop/mobile performance.
- [ ] Fix launch issues, document handover, operational ownership and routine improvement process.

**Gate:** All live checks passed and user explicitly accepts launch.

## Project discipline and status updates

At each work session and progress reply, show:
- **Website plan:** Current phase X/9 and the one concrete step being worked on.
- **Verified completed:** Facts with URLs, screenshots, CI/test receipts.
- **Remaining to pass the current gate:** Compact checklist.
- **Blocker or explicit user decision:** Only where actually necessary.
- Do not claim a phase complete until all gate criteria are demonstrated.
- Never switch vendor or scope based on curiosity. The user explicitly locked Claude Code + Higgsfield. Reopen only for proven blocker and user consent.
- Keep each phase's deliverables committed to GitHub, with draft previews and clearly marked experimental content.
- Keep the wider 8-phase Cidea Marketing program separate; this is its website-specific execution plan.

## Initial progress snapshot (2026-10-15)

- Phase 1: IN PROGRESS. Existing React/Vite repo audited, isolated experimental branch and PR #13 opened, reference workflow documented. Claude skill **not verified installed**, Higgsfield MCP **not verified connected**, runtime/preview testing **not yet done**.
- Phases 2–9: NOT STARTED.
- Production website: unchanged by this plan.

## First next action

Verify Claude Code's current workspace, safely install/audit 10K Websites v0.2.0, verify Higgsfield MCP and preview toolchain. Do not start media production until phases 2 and 3 are approved.
