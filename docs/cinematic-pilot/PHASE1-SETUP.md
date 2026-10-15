# Phase 1 — handoff to the user's Claude Code desktop workspace

**Status:** Cidea's GitHub experiment branch has the custom project skill, plan, initial repository audit and video notes. It does **not** mean the user's local Claude session is configured or Higgsfield is authenticated.

## Workspace and branch

Use the existing local working copy of `KhalilJel/Cidea-Marketing` (last reported under `C:\Users\khali\Cidea-Marketing`). Do NOT start from the unrelated Gullkornet repository.

1. Read `git status --short`, current branch and remote. If there are uncommitted local changes, do not discard, overwrite, reset, stash or switch past them silently; report the blocker.
2. Fetch `origin experiment/cinematic-marketing-pilot` and switch to that **remote-tracking experiment branch only** once the working tree is safe.
3. Verify `.claude/skills/10k-websites/SKILL.md`, `docs/cinematic-pilot/MASTER-GAMEPLAN.md` and `.gitignore` are present.
4. Confirm Claude Code recognizes `/10k-websites` (restart or invoke it explicitly if needed).

## Pin the original newer public skill (not the old ZIP)

Reference source: https://github.com/thatswyn/10k-websites
Pinned commit (2026-10-15): `b5874f88e1c3b8f3da0ecadcec0c27a5e92eb254`
License: MIT, preserve attribution.

After checking that `.cidea-tools/10k-websites` is absent or safely reusable, let Claude Code clone the public repository into this ignored local reference directory and check out the exact commit. Verify `git -C .cidea-tools/10k-websites rev-parse HEAD` returns the pinned SHA. If unable to access GitHub, report it instead of running unknown downloads.

Read and audit the source `SKILL.md`, `references/setup.md`, the relevant scripts and templates. Do NOT run its static HTML deploy/packaging scripts against the React/Vite project and do NOT install the upstream skill into a global Claude location that would conflict with Cidea's adapted project skill.

## Verify technical prerequisites

- `node --version` and `npm --version`; verify Vite project's `npm run build` in isolation (install dependencies only after checking project lockfile and existing package state).
- `ffmpeg -version` and `ffprobe -version`; install only if missing and with user's normal permission flow.
- Preview server accessible; verify browser test support, screenshots, responsive widths and compatibility with PR #11.
- Record real versions, errors and logs under `docs/cinematic-pilot/PHASE1-VERIFICATION.md` (do not claim verified without logs).

## Higgsfield auth, locked provider

Official Higgsfield documentation (2026-08 / 2026-09):
https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-connect-higgsfield-to-ai-agent
https://higgsfield.ai/mcp?tab=claude-code

- **Claude Code terminal:** Higgsfield currently recommends CLI: `npm i -g @higgsfield/cli`, then `higgsfield auth login` and browser OAuth. Only install from the official package. Authenticate interactively; never copy tokens/secrets into source or chat. Companion Higgsfield website skills are **optional** and should not replace the selected 10K Websites workflow.
- **Claude Desktop connector UI:** Alternative is a custom connector named Higgsfield at `https://mcp.higgsfield.ai/mcp`. Do not assume adding a Desktop chat connector means the CLI is already working in Code mode.
- Verify authentication and actual credit balance with a read-only official command. A valid login is not the same as available image/video credits. Higgsfield notes that automated MCP/CLI requests consume credits, even if website promotional plans advertise unlimited web generations.
- Do not subscribe to a paid plan or generate chargeable media without explicit user approval.

## Exit gate

Phase 1 is complete only when:
- [ ] Claude Code local workspace is on safe experiment branch.
- [ ] Adapted skill discovered and pinned upstream v0.2.0 source checked.
- [ ] Real Node, FFmpeg/FFprobe and React build/preview checks recorded.
- [ ] Higgsfield auth & read-only balance verified.
- [ ] No production, DNS, MX, Hosting or PR #11 modification.

After each task send: **Fase 1/9 | oppgave | verifisert utført | gjenstår | neste steg | bevis**.

## Copy-paste prompt for the user's Claude Code window

> We are working exclusively on the Cidea Marketing cinematic website gameplan. Repo: `KhalilJel/Cidea-Marketing`, local working copy under `C:\Users\khali\Cidea-Marketing`. Read GitHub draft PR #13 and `docs/cinematic-pilot/MASTER-GAMEPLAN.md`. Work only in Phase 1/9. First inspect git status and safely fetch/check out `experiment/cinematic-marketing-pilot`, preserving all local work. Invoke the project skill `/10k-websites`, safely pin and review the official `thatswyn/10k-websites` source at commit `b5874f88e1c3b8f3da0ecadcec0c27a5e92eb254` in the ignored `.cidea-tools/10k-websites` folder. Verify Node, FFmpeg/FFprobe, build and local preview. Then install/authenticate the official Higgsfield CLI only after checking official docs, ask me to complete OAuth, and verify actual available credits without spending any. Use only Claude Code + Higgsfield, keep existing hosting and React app, no Hostinger, no production changes, no paid generations. Record evidence in GitHub and report phase/task/done/remaining/next after every task. Do not proceed to Phase 2 until the Phase 1 gate is verified.
