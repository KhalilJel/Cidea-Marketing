# Stitch → Claude Code handoff and setup (Phase 1)

**Selected by user:** ChatGPT (creative leader) → Google Stitch (design/content) → Claude Code (code) → ChatGPT (visual QA). **No new paid tools.** Existing React/Vite site and hosting.

## External references verified in GitHub
- Official Stitch product: https://stitch.withgoogle.com/
- Stitch MCP setup instructions: https://stitch.withgoogle.com/docs/mcp/setup/
- Google Labs Code community skill repository: https://github.com/google-labs-code/stitch-skills
- Repository README documents Claude Code project installation: `npx plugins add google-labs-code/stitch-skills --scope project --target claude-code`. This executes third-party package/plugin installation: review first; do not blindly install globally.
- Relevant skills documented in the README:
  - `stitch::generate-design` produces/edit screens and multiple design variants.
  - `stitch::design-md` documents design language.
  - `stitch::react-components` translates Stitch screens into React components and runs a validator.
  - `stitch::extract-design-md` analyzes existing frontend code (useful for understanding old design, not for preserving it).
- The upstream repository explicitly states its project is **not an officially supported Google product**. Read all third-party skill/script instructions before invoking.

## Setup tasks (real verification, not optimistic assumptions)

1. **Safe checkout:** Claude Code in local `KhalilJel/Cidea-Marketing`; inspect `git status`, then safely fetch/check out `experiment/cinematic-marketing-pilot`. Do not reset or discard existing work.
2. **Read project skill:** `.claude/skills/cidea-website/SKILL.md`; verify Claude recognizes `/cidea-website` or explicitly loads it. Old `/10k-websites` is a historical source, NOT the active project workflow.
3. **Review source and install selected Stitch skills:** Inspect the Google Labs repository/plugin manifests and execution requirements. Add project-local skills if desired using documented command, subject to permissions and account. Do not use unrelated skills or bulk install if unnecessary.
4. **Stitch MCP:** Follow official setup in Claude Code. User completes needed Google/Stitch login or OAuth. Never paste tokens into GitHub, docs or chat; do not bypass auth. If no MCP access available under existing usage allowance, prefer approved manual export from Stitch.
5. **Prove connectivity:** List an existing Stitch project or fetch a harmless test screen via authorized MCP. If using manual method, export one HTML/screenshot asset and verify Claude can read it. Record exact outputs.
6. **Node/build:** `node --version`, `npm --version`, `npm run build`, `npm run dev` or preview in local branch; open a browser and capture screenshots at 390px and 1440px. See existing `.github/workflows/` tests.
7. **Document result:** Add `docs/cinematic-pilot/PHASE1-VERIFICATION.md`: date, actual verified versions, build pass/fail, Stitch MCP or export proof, Claude skill proof, restrictions and user auth blocker.

Phase 1 gate is NOT passed until the above real checks are recorded. If unblocked, then (and ONLY then) begin Phase 2 design exploration.

## Approved workflow after Phase 1

**Concepts (ChatGPT → Stitch):**
- Use `STITCH-CREATIVE-BRIEF.md` in its entirety.
- Produce 3 genuinely different full-page Norwegian desktop concepts and mobile versions with actual visible mockups.
- ChatGPT and user choose a concept; no coding before approval.

**Detailed design (Stitch):**
- Export `DESIGN.md`, all pages, type/palette/layout tokens and asset rights.
- Confirm all reusable media can be deployed commercially, not just visually displayed in a preview.
- Freeze the approved visual decisions and actual copy.

**Implementation (Stitch → Claude):**
- Claude reads design through MCP or approved exports, maps it into existing `src/main.jsx` and `src/styles.css`; refactor carefully, preserve app routing, SEO, and blog.
- Build real components, not screenshots masquerading as working websites.
- Compare rendered desktop/mobile screenshots to Stitch references; fix discrepancies with a visible before/after record.
- All source changes in draft PR with CI, never merge without user approval.

## Copy-ready Claude Code kickoff

> Cidea Marketing only. We're implementing the approved ChatGPT → Google Stitch → Claude Code production method. Repository `KhalilJel/Cidea-Marketing`, experimental branch `experiment/cinematic-marketing-pilot`, draft PR #13. Read `docs/cinematic-pilot/MASTER-GAMEPLAN.md`, `STITCH-CREATIVE-BRIEF.md`, `STITCH-HANDOFF.md` and `.claude/skills/cidea-website/SKILL.md`. Start **Phase 1/9 only**. Check `git status` and safely switch to the branch without losing local changes. Review Google Labs Stitch skills and current official Stitch MCP setup, install only trusted needed project-level skills, let me authenticate if necessary. Verify a real Stitch connection or export handoff, Node/Vite build and real preview/browser screenshots. No paid services, no AI video, no production deploy, no DNS/MX edits, no merge. Record factual proof in `PHASE1-VERIFICATION.md` and report completed/remaining/next after every task. Do not enter Phase 2 until Phase 1 gate verified.

## Kredittkontroll (verifisert 2026-10-16)

Stitch MCP-API-et oppgir ikke kredittforbruk. Claude Code leser telleren selv via **Claude in Chrome** (brukerens innloggede Chrome) på https://stitch.withgoogle.com/settings, kortet «Usage Today – Daily Credits N / 400». Siden har ingen lesbar tekst (JS/canvas), så telleren leses fra et skjermbilde. Kun lesing: Claude endrer aldri API-nøkler, innstillinger eller e-postvalg på siden. Kontroll gjøres før og etter hver Stitch-runde og logges i GitHub. Krav: Chrome er åpen med Claude-utvidelsen tilkoblet, og brukeren er innlogget i Stitch.
