# Cidea Marketing — Locked Website Master Gameplan

**Date agreed:** 2026-10-15
**Owner:** Cidea
**Scope:** Transform the current cideamarketing.com from its existing Vite/React design into a fully professional, creatively distinctive, cinematic, fast, conversion-ready Norwegian agency website.
**Scope exclusions:** The separate 90-day social-media content bank, 90-day blog editorial bank, social publishing system and Gullkornet lead machine remain required for the **whole Cidea Marketing foundation**, but they are not reasons to prematurely call this website finished. Website must include a real functioning blog/publishing workflow and editorial templates before site launch.
**Priority:** This is the 100%-focus WEBSITE plan. Complete each phase and its acceptance gate before beginning the next; no unrelated AI-tool comparisons, redesigns or other Cidea sites.
**Technology for zero-spend build:** Claude Code + audited public `thatswyn/10k-websites` v0.2.0 creative/QA method + built-in CSS/SVG/JavaScript/React + GitHub + existing hosting. No Hostinger. Higgsfield and FFmpeg are OPTIONAL ONLY when the user explicitly approves a future video budget. No paid generation, subscriptions, new hosting or new domains.
**Branch:** `experiment/cinematic-marketing-pilot` — draft PR #13. Draft PR #11 remains isolated until integration review.
**Live production:** Do not merge, deploy, buy media credits, alter DNS/MX or change hosting without explicit approval.

**2026-10-15 budget-safe amendment:** The user reports very limited funds and suggests shelving AI video. We proceed with a **0 NOK additional-spend design path** and preserve video as a later, separately approved upgrade. This updates execution requirements, NOT the goal of a beautiful complete website. Keep phases 1–9, all content/conversion/SEO/QA gates and the independent draft PR. If existing tools have limits/usage costs, do not trigger chargeable use without consent.

## What finished means

A visitor should feel the 'wow' of a premium cinematic site AND rapidly understand services and trust Cidea enough to request a meeting. A site is not done unless desktop/mobile look polished, movie scrubbing is smooth when applicable, accessible fallback is strong, all real pages and contact conversion work, blog infrastructure is functional, SEO and performance are measured, and final preview has been approved before live deployment. Do not fake customers, testimonials, case studies, conversion claims or data. Clearly label internal sample work as concept work, not customers.

## The nine phases and completion gates

### Phase 1 — Environment and production setup [IN PROGRESS]

Steps:
- [x] Existing repo and audit documented in `docs/cinematic-pilot/INITIAL-AUDIT.md`.
- [x] Independent branch + draft PR #13 created; no production changes.
- [ ] Review and safely install newer 10K Websites skill; inspect instructions, scripts, licenses and applicability to React/Vite (not the older zip).
- [ ] Verify Claude Code workspace and project skill locally; Higgsfield MCP is **deferred and NOT a blocker**. Never expose credentials in repo; no paid generation without prior approval.
- [ ] Verify Node/build, screenshots/Playwright, preview workflow and current deployment configuration. FFmpeg only needed if/when video is approved.
- [ ] Document verified environment results and blockers.

**Gate:** Audited project skill, safe Claude Code checkout, successful build and usable preview/test setup; no Higgsfield login or video expense required.

### Phase 2 — Research and three premium creative concepts [NOT STARTED]

- [ ] Analyze Norwegian target audience, competitor sites, Cidea services, positioning and conversion goal.
- [ ] Inspect world-class cinematic / creative studio experiences for patterns, not copying.
- [ ] Produce three **genuinely different** directions: visual personality, typography/palette, original CSS/SVG graphics, scroll/interactions, navigation, mobile treatment, hero/copy and CTA. Show optional future-film opportunities without depending on them.
- [ ] Present actual visual boards/previews and strategic tradeoffs.
- [ ] User selects and approves ONE direction.

**Gate:** Documented and explicitly approved creative concept; no paid media generated beforehand.

### Phase 3 — Design system, all-page direction, storyboard [NOT STARTED]

- [ ] Finalize brand identity treatment, logo deliverables, fonts (æøå support/licensing), palette, iconography and layout systems.
- [ ] Design the homepage beyond the hero, including services, proof of ability, value proposition, blog and CTA.
- [ ] Outline every required inner page and mobile layouts, with precise Norwegian text hierarchy.
- [ ] Create a motion/interaction storyboard for CSS/SVG/React, including start/middle/end scroll states, text safe zones, keyboard/motion-accessibility and optional video insertion points.
- [ ] List reusable existing assets, rights/licenses and a **0 NOK incremental cost** implementation plan; obtain approval before any new paid asset.

**Gate:** Approved brand kit, page direction, storyboard, asset list and budget.

### Phase 4 — Premium visual assets and motion without paid AI video [NOT STARTED]

- [ ] Create first-class visual assets using licensed existing material, CSS/SVG, typography and code-based motion, without external media charges.
- [ ] Develop original hero compositions and supporting graphic elements; inspect desktop and mobile frames.
- [ ] Implement/test polished lightweight interactions, scroll-linked transitions and reduced-motion alternatives, with accessible non-animated fallbacks.
- [ ] Keep a documented OPTIONAL future-video insertion point. Higgsfield integration, paid video and FFmpeg checks are deferred until the user separately approves a budget; they are NOT acceptance criteria now.
- [ ] Verify asset licensing, legibility and measured transfer size.

**Gate:** A premium, coherent, reviewed **zero-extra-cost** visual and motion asset package; video not required.

### Phase 5 — Premium interactive homepage implementation [NOT STARTED]

- [ ] Implement as React/Vite component(s) inside existing site, not overwrite app with one-file HTML template.
- [ ] Integrate lightweight code-driven visual motion, scroll interactions and real, crawlable headline/CTA without requiring AI video.
- [ ] Finish all homepage sections with meaningful content and polished layout.
- [ ] Deliberate first-class mobile, data-saving and reduced-motion experiences; no heavy assets required.
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
- [ ] Asset/image loading and caching, real Lighthouse/Core Web Vitals mobile/desktop results; no imaginary claims. Test video delivery only if video is eventually approved.
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
- [ ] Validate cideamarketing.com HTTPS, page routes, SEO/indexability, graphics/animation fallbacks, analytics, live contact/test lead, desktop/mobile performance. Video delivery only if applicable.
- [ ] Fix launch issues, document handover, operational ownership and routine improvement process.

**Gate:** All live checks passed and user explicitly accepts launch.

## Project discipline and status updates

At each work session and progress reply, show:
- **Website plan:** Current phase X/9 and the one concrete step being worked on.
- **Verified completed:** Facts with URLs, screenshots, CI/test receipts.
- **Remaining to pass the current gate:** Compact checklist.
- **Blocker or explicit user decision:** Only where actually necessary.
- Do not claim a phase complete until all gate criteria are demonstrated.
- Never chase vendors based on curiosity. The current path is **0 NOK extra spend**, Claude Code plus built-in web technologies; Higgsfield remains optional and on hold until explicit budget approval.
- Keep each phase's deliverables committed to GitHub, with draft previews and clearly marked experimental content.
- Keep the wider 8-phase Cidea Marketing program separate; this is its website-specific execution plan.

## Initial progress snapshot (2026-10-15)

- Phase 1: IN PROGRESS. Existing React/Vite repo audited, isolated experimental branch and PR #13 opened, reference workflow documented. Claude skill **not verified installed**, Higgsfield MCP **not verified connected**, runtime/preview testing **not yet done**.
- Phases 2–9: NOT STARTED.
- Production website: unchanged by this plan.

## First next action

Verify Claude Code's current workspace, safely install/audit 10K Websites v0.2.0, verify Node/build and preview toolchain. Do **not** block on Higgsfield, credits, or FFmpeg. Start Phase 2 only after Phase 1 acceptance criteria are met.
