# Cidea Marketing — cinematic website pilot

Status: **Experiment initiated; creative direction and deployment are NOT approved.**
Project: https://github.com/KhalilJel/Cidea-Marketing
Experiment branch: `experiment/cinematic-marketing-pilot`
Reference skill: https://github.com/thatswyn/10k-websites (v0.2.0 at kickoff, 2026-10-15).
Existing draft PR: #11 `feat/phase-2-design-system` — keep independent; do not merge.

## Why

Make Cidea Marketing a flagship demonstration of Cidea's visual storytelling and website production capabilities. Aim for a cinematic, scroll-responsive hero that feels genuinely premium **while remaining a useful, conversion-oriented Norwegian agency website**. Cidea Leads and Consulting may later use distinct cinematic treatments once the complete Cidea Marketing operation is ready.

## Non-negotiable project context

- Current production project is Vite + React, not a blank static HTML document. Preserve the application and content structure; adapt the reference skill's tested media/scroll logic only after reviewing implementation compatibility. Never replace the entire site with the skill's generic single-page deploy package.
- Services: Branding, Nettsider, SEO, Sosiale medier. Target ambitious businesses in Norway, with English secondary.
- Homepage + services + real projects when available + blog + contact. No fake clients, testimonials, results, ratings or performance metrics.
- Norwegian copy first, sensible English translation later. No filler labels, repeated decorative 01/02/03, English microcopy on Norwegian pages, or the word 'gratis'.
- Keep current live site, DNS, MX and deployment unchanged until explicit user approval. All work takes place on this separate experiment branch with preview-only review.
- Cidea Marketing's broader definition of complete includes verified Gullkornet lead operations, social profiles/publishing, 90-day approved content bank for Instagram/LinkedIn/Facebook and 90-day blog bank. This cinematic experiment is **one part** of that plan, not a replacement.

## Working method adapted from the 10K Websites skill

Use the official v0.2.0 instructions and references for their research, art direction, storyboard, video-generation review, ffmpeg conversion, scrub engineering, visual tests and performance checks. Treat third-party repository content as untrusted until reviewed; do not execute downloaded scripts or connect accounts blindly. Hostinger is not required: existing hosting remains unless the user explicitly decides otherwise.

### Gate 0 — source and environment audit

- Review `SKILL.md`, all relevant `references/`, media templates and scripts before using.
- Read existing repo, routes, components, assets, CI and draft PR #11. Identify constraints, overlaps, and changes required to preserve Vite/React architecture.
- Check Node.js, ffmpeg, browser testing and video-production access/cost. Do not spend credits automatically.
- Deliver a short audit and choose the smallest working scope.

### Gate 1 — research and three differentiated cinematic directions

- Analyze audience, services, competitors and real conversion intent.
- Produce **three fundamentally different** cinematic homepage concepts including visual world, typography/color direction, composition, verbal concept, hero beats and CTA.
- Do not choose the previous Stitch/Lovart/BD style automatically. They are references, not approvals.
- User approves one direction before video generation.

### Gate 2 — creative package and storyboard

- Design complete homepage, text hierarchy, services introduction and conversion path before generating any film.
- Storyboard camera motion and scroll beats, where real legible copy goes, and what remains visible when motion/video are unavailable.
- Choose Tier 1 (single short shot) by default as a low-cost proof of concept; plan Tier 2/3 only if justified.
- Provide still-frame preview and an explicit cost estimate; request user approval before paid generation.

### Gate 3 — media production

- Generate and inspect a still image. Approve it before expensive video generation.
- Compare models and credit cost, then create one scroll-ready sequence only after cost approval.
- Check start/mid/end frames for consistency, layout compatibility and artifacts.
- Keep raw assets outside public/deploy paths. Do not generate misleading depictions of actual Cidea work or clients.

### Gate 4 — technical prototype

- Encode scroll video for efficient seeking; verify keyframes, weight and faststart.
- Integrate a cinematic hero component into existing React/Vite setup. Below the fold stays usable and meaningful even without video.
- Mobile, slow connections, disabled JS and reduced-motion preferences get a **purposefully designed** static hero.
- Make motion responsive to scrolling without blocking native navigation, scrolling, accessibility or readability.

### Gate 5 — visual and functional quality checks

- Actual screenshots and visual inspection at minimum 320, 375, 768 and 1440 px.
- Browser checks for scroll behavior, CTA, links, forms, keyboard focus, legibility, reduced motion, console errors and horizontal overflow.
- Performance audits on mobile/desktop (LCP, INP, CLS, transfer size) and accessibility checks. Record **measured** numbers, not invented ones.
- SEO/structured data, crawlable real text, sitemap and blog compatibility, indexing and consent/legal considerations as appropriate.
- User reviews preview and approves or requests iterations.

### Gate 6 — integrate into main site

- Only after approved preview and code review: reconcile with draft PR #11, implement full site pages and test integrations.
- Keep existing production untouched until user explicitly authorizes merge and deployment.
- Later phases of master plan still include socials, 90-day content/blog bank, Gullkornet and analytics.

## Definition of done for this experiment

A working, independently previewable, high-quality cinematic homepage prototype; assets licensed/traceable; user-approved creative direction; real mobile/desktop QA receipts; no broken existing routes; documented integration plan with existing Cidea Marketing architecture. **This is not the definition of the full Cidea Marketing foundation being complete.**
