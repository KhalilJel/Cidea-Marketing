# Video-derived implementation notes — 10K Websites workflow

Source supplied by user: `Innlimt markdown.md` (timestamped summary of https://www.youtube.com/watch?v=snErQUyqwCU). This is a secondary summary of the video, **not an independently verified playback or current product documentation**. Preserve distinctions between the video workflow and Cidea implementation decisions.

## Reproducible workflow from the notes

1. **00:00–05:02 — Claude environment**: Claude account, Claude Desktop, Code mode. Video gives plan and model suggestions; **verify actual available plan/model names in account** rather than blindly using the video's labels (it calls one model "Fable"). Avoid changing the user's plan without approval.
2. **05:02–06:38 — Workspace**: Use Claude Desktop > Code > selected local project. For Cidea, use a separate branch of the existing Vite/React repo, not an empty workspace that might accidentally replace the application. Claude's Auto mode should still be scoped to repository work; require explicit approval for credits, secrets, hosting and production actions.
3. **06:38–08:57 — Higgsfield integration**: Connect Higgsfield via **MCP / CLI** connector shown in the video, authorize if service/credits are confirmed. Verify actual service URL and access from official console, never copy a secret into GitHub or PR. The video labels connector `higsfield` (typo), no need to preserve this.
4. **08:57–09:39 — Install 10K Websites skill**: The video describes dragging a skill package into a project. Cidea will review and use the **newer public `thatswyn/10k-websites` version**; review skill instructions/scripts before execution and keep dependencies localized.
5. **09:39–13:59 — Creative brief / animation choices**: Original video demo is a coffee brand and asks the user about new vs existing brand, vibe, brand name, assets and scroll story. Cidea is an **existing agency**; run 3 independent creative directions then approve one, and preserve authentic agency positioning. Start with Tier 1 short hero video as small-budget proof. Generate first frame and get approval BEFORE paid film generation.
6. **14:46–14:59 — Other assets**: Generate/inspect any supporting images after film direction agreed; require rights and coherent visual art direction.
7. **14:59–18:37 — Build and iterate**: Claude builds the website (video claims 20–60+ minutes, not guaranteed). Open a real browser preview, scroll through, check responsiveness and typography; use text or voice dictation for targeted visual corrections; visually re-test after fixes.
8. **18:37–24:58 — Hosting**: Video uses Hostinger and its extension to deploy and update through Claude. **Cidea keeps existing hosting and DNS/MX unchanged.** No Hostinger purchase, domain purchase or deployment is necessary for the pilot. Use GitHub draft PR and preview, deploy to production only with explicit approval.

## Cidea-specific improvements over the video's demonstration

- Complete 3 concepts + storyboard + still approval before paying for generation.
- Keep the React/Vite app, the services/blog structure and SEO/lead-generation requirements.
- Design mobile and prefers-reduced-motion still experiences deliberately; do not assume desktop cinematic animation works well on phones.
- Make a fast-loading HTML-text/CTA first paint and lazy-load video; validate real mobile performance.
- A short visual proof of concept does not satisfy Marketing's entire foundation (social profiles, 90-day content/blog inventory and functioning Gullkornet also required).
- Prevent unsubstantiated case-study claims or performance metrics.
- No automatic merges, production deploys, account purchases, DNS or MX changes.

## Source timestamp index

- 02:50–04:34 Claude account/model/Desktop
- 04:57–06:38 Code mode/workspace
- 07:08–08:57 Higgsfield MCP
- 08:57–09:39 skill import
- 09:39–14:52 website prompt, brand and media approval
- 15:05–18:10 build, browser preview, voice revisions
- 18:38–24:58 Hostinger purchase/deployment (NOT adopted for Cidea)

## Current status

Documentation only. Higgsfield is not yet connected/verified in this project, no video generated, no creative concept approved. Experiment branch `experiment/cinematic-marketing-pilot`, draft PR #13.
