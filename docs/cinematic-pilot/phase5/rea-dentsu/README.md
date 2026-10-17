# REA-analyse av Dentsu Creative – status

**Dato:** 2026-10-17 · **Utført av:** Claude Code (skymiljø) · **Referanse valgt av eier:** https://www.dentsucreative.com/
**Status (2026-10-18, lokalt):** **ANALYSE OG FORSLAG LEVERT.** Analysen er gjort lokalt på eiers PC i vanlig nettleser. Se [ANALYSE.md](ANALYSE.md), [CIDEA-FORSLAG.md](CIDEA-FORSLAG.md) og [STORYBOARD.png](STORYBOARD.png). REA er installert lokalt, men selve kommandoene ble stoppet av Claude Codes tillatelseskontroll. Observasjonene er derfor gjort med Playwright via CDP (se ANALYSE.md § 1 og § 9). Teksten under beskriver den første, blokkerte skyøkten og beholdes som historikk.

## Hva som er gjort og verifisert

| Steg | Resultat | Bevis |
|---|---|---|
| Arbeidsgren og HEAD | `experiment/cinematic-marketing-pilot` @ `53122e7`, ingen lokale endringer før oppdraget | `git status` |
| AGENTS.md | Finnes ikke i repoet. Prosjektinstruksjon er `.claude/skills/cidea-website/SKILL.md` | `ls` |
| REA-versjon | `rea-agents` **6.5.0** fra npm (MIT). Installert lokalt i et midlertidig arbeidsområde: ikke globalt, ikke i nettsidens `package.json`, ingen agentregistrering endret | `npx rea --version` |
| `npx rea-agents setup` | **Ikke kjørt.** Setup registrerer REA som MCP-server i agenten og krever omstart av agenten, noe denne skyøkten ikke kan. CLI-en gir de samme nettanalysekommandoene uten registrering | REA README § Setup |
| Relevante REA-funksjoner | `capture-browser-scenario` (Playwright-scenario), `capture-web-screenshot`, `analyze-web-bundle` (skript, chunks, ruter, endepunkter, bibliotekgjenkjenning), `export-web-scripts`, `compare-web-captures`, `compare-web-screenshots`. Alle krever en Chrome-nettleser via CDP | `npx rea --help` |
| `rea doctor` | Node 22.22.0 og Ubuntu 24.04 OK. Hopper, Ghidra, IDA og jadx mangler, men brukes bare til native-/Android-analyse, ikke nettsider | `npx rea doctor` |
| **Verifisert analyseoperasjon** | `rea analyze-web-bundle` mot vår egen forhåndsvisning (`http://127.0.0.1:4174/`, Chromium 1194 headless via CDP, 1 500 ms observasjon): 2 skript fanget og analysert, 79 644 AST-noder, 0 parsefeil, status `complete`. Gjenkjente **Vite** og **React**, som stemmer med prosjektet. Det viser at bibliotekgjenkjenningen gir riktige svar | [`bevis/rea-verifisering-cidea-lokal.json`](bevis/rea-verifisering-cidea-lokal.json) |

## Blokkering

- **Host:** `www.dentsucreative.com:443`
- **Feil:** proxyen svarer `403 to CONNECT (policy denial)` (proxystatus 2026-10-17T16:24:31Z). Dette er miljøets nettverkspolicy, ikke en feil på siden. Den er ikke forsøkt omgått.
- **Også avvist:** `https://github.com/morluto/rea` (403). REA-dokumentasjonen er derfor lest fra npm-pakken (`README.md` i 6.5.0), ikke fra GitHub-repoet.

**Slik åpner eier tilgang:** åpne skymiljøets meny i tittellinjen til økten → **Edit** → **Network access**. Legg til `www.dentsucreative.com` og `dentsucreative.com` under **Allowed domains**, og la **Allow package managers** stå på. Dokumentasjon: https://code.claude.com/docs/en/cloud-environments#network-access.

Dentsu-siden henter sannsynligvis bilder, video og skript fra andre domener (CDN, videotjeneste). Hvilke vet vi ikke før siden er åpnet. Det enkleste er å velge et bredere tilgangsnivå mens analysen pågår, eller legge til de ekstra domenene når første kjøring viser hvilke som avvises.

## Plan når tilgang er åpnet (ingen endring i nettsiden)

1. Start Chromium headless med `--proxy-server` mot miljøets proxy og `--remote-debugging-port`, og kjør REA-kommandoene mot Dentsu-siden.
2. `analyze-web-bundle` på forsiden, én tjenesteside og én prosjektside. Det gir bibliotekene som faktisk kan bekreftes (f.eks. GSAP/ScrollTrigger, Lenis, Three.js, Lottie, Swiper) og hvilke som bare er hypoteser.
3. `capture-browser-scenario` og Playwright ved 1440, 768 og 390 px med skjermbilder på faste scrollposisjoner, både med og uten `prefers-reduced-motion`.
4. Kort skjermopptak (Playwright-video) av åpning, scroll og menyhover. Det skiller autoavspilt video, scrollstyrt video/bildesekvens, scrollutløste animasjoner, sticky/pinned-seksjoner og vanlig scrolling.
5. Målinger: `<video>`-elementer (autoplay, loop, muted, `currentTime` mot scrollposisjon), `position: sticky`/pinning, `animation-timeline`, scrollhendelser og transform-endringer per scrollsteg.
6. Deretter skrives `ANALYSE.md` og `CIDEA-FORSLAG.md` med storyboard, Higgsfield-liste, byggeplan, mobil- og redusert-bevegelse-versjon, der hver anbefaling er knyttet til en observasjon.

Ingen endringer i nettsidens implementering, ingen Higgsfield-generering, ingen merge eller deploy.
