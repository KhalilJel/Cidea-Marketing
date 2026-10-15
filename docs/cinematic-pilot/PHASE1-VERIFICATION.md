# Fase 1/9 – verifikasjon (Claude Code)

**Dato:** 2026-10-15 · **Gren:** `experiment/cinematic-marketing-pilot` · **PR:** #13 (draft)
**Status:** FASE 1 **IKKE FERDIG**. 4 av 6 gate-punkter er verifisert. Det som gjenstår krever brukerens Stitch-innlogging.

## 1. Lokal Git – VERIFISERT

| Sjekk | Resultat |
|---|---|
| `C:\Users\khali\Cidea-Marketing` før bytte | Ren arbeidskopi på `feat/phase-2-design-system` (PR #11). Eneste ignorerte fil var `package-lock.json`. Ingen stash. |
| `C:\Users\khali\cidea-sites\Cidea-Marketing` | Ikke rørt (gren `fix/marketing-claims`) |
| Bytte | `git switch -c experiment/cinematic-marketing-pilot --track origin/...` → HEAD `b17bafa`. Ingen reset, ingen tap. |

## 2. Prosjekt-skill – DELVIS VERIFISERT

- `.claude/skills/cidea-website/SKILL.md` er lest og fulgt (regel null: alle fem dokumenter er lest).
- Automatisk oppdagelse av `/cidea-website` er **ikke** bekreftet. Den kjørende økten ble startet i en annen mappe, og skills lastes ikke på nytt når en mappe legges til. Den medfølgende CLI-en (`claude.exe` 2.1.295) er ikke innlogget.
- **Brukersjekk:** åpne en Claude Code-økt i `C:\Users\khali\Cidea-Marketing` og skriv `/cidea-website` (se § 4).

## 3. Stitch-skills – INSTALLERT (prosjektlokalt, gjennomgått)

Kilde: https://github.com/google-labs-code/stitch-skills · Apache-2.0 · festet til commit `0337446dadde6f8c94210444e2aa9d546126480f`. Upstream oppgir at prosjektet ikke er et offisielt støttet Google-produkt.
Installert ved å kopiere fire skill-mapper uendret til `.claude/skills/`. `npx plugins add` ble **ikke** kjørt, så ingen tredjeparts installasjonskode er utført. `package-lock.json` er utelatt.

| Mappe | Upstream-navn | Hvorfor |
|---|---|---|
| `stitch-generate-design` | `stitch::generate-design` | Fase 2: tre konsepter, varianter |
| `stitch-manage-design-system` | `stitch::manage-design-system` | Påkrevd av generate-design (DESIGN.md → Stitch) |
| `stitch-design-md` | `design-md` | Fase 3: kanonisk `DESIGN.md` |
| `stitch-react-components` | `stitch::react-components` | Fase 5: hente skjerm/HTML, kartlegge til komponenter |

**Gjennomgang av skript:** `fetch-stitch.sh` gjør bare `curl -L` til en oppgitt URL. `validate.js` er en lokal AST-sjekk (`@swc/core`). Ingen nettverkskall utover dette, ingen sletting, ingen hemmeligheter.

**Avvik å være klar over:**
- `stitch-react-components` forutsetter TypeScript og Tailwind. Repoet er JSX og ren CSS. Skillen brukes til henting og struktur, og resultatet tilpasses eksisterende `src/main.jsx` og `src/styles.css`. Det gjøres ingen migrering til TS/Tailwind uten godkjenning.
- `stitch-manage-design-system` alternativ A viser til et Python-opplastingsskript som tar `--api-key` på kommandolinjen. Skriptet er **ikke** installert. Vi bruker bare MCP-verktøyene (`create_design_system_from_design_md` osv.).
- Ikke installert: `remotion` (video, utenfor rammen), `react-native`, `shadcn-ui`, `react-vite-dashboard`, `code-to-design`, `extract-static-html`, `upload-to-stitch`.

## 4. Stitch MCP – KONFIGURERT, TILKOBLING IKKE VERIFISERT

**Endepunkt (målt 2026-10-15 med curl):**
- `POST https://stitch.googleapis.com/mcp` `initialize` → `200`, `protocolVersion 2025-06-18`.
- `tools/list` uten autentisering → 15 verktøy: `create_project`, `get_project`, `delete_project`, `list_projects`, `list_screens`, `get_screen`, `generate_screen_from_text`, `edit_screens`, `generate_variants`, `upload_design_md`, `create_design_system`, `create_design_system_from_design_md`, `update_design_system`, `list_design_systems`, `apply_design_system`.
- `tools/call list_projects` uten autentisering → `401 Unauthorized` (`WWW-Authenticate: Bearer`, autorisasjonsserver `accounts.google.com`).
- Google OAuth støtter ikke dynamisk klientregistrering. Den praktiske veien for Claude Code er derfor en **API-nøkkel** i headeren `X-Goog-Api-Key`.
- **Bekreftet mot offisiell dokumentasjon** (https://stitch.withgoogle.com/docs/mcp/setup/, innhold limt inn av brukeren 2026-10-15, siden rendres ikke i Claudes nettleser): offisiell Claude Code-oppskrift er `claude mcp add stitch --transport http https://stitch.googleapis.com/mcp --header "X-Goog-Api-Key: <nøkkel>" -s user`. Endepunkt, transport og header er identiske med vår `.mcp.json`.
- **Avvik fra den offisielle oppskriften (bevisst):** vi bruker prosjektomfang og `${STITCH_API_KEY}` i stedet for å lagre nøkkelen i klartekst i `~/.claude.json` (`-s user`). Det følger dokumentasjonens egen regel: «Never commit your API key to a public repository».
- **OAuth-alternativet er valgt bort:** det krever Google Cloud SDK (`gcloud`), et GCP-prosjekt med Stitch-API aktivert og en IAM-rolle. Tilgangstokenet varer ca. 1 time og må limes inn i konfigurasjonen manuelt hver gang. API-nøkkel er dokumentasjonens anbefalte standard for klienter som Claude Code.

**Konfigurasjon:** `.mcp.json` (prosjekt) med `"X-Goog-Api-Key": "${STITCH_API_KEY}"`. Nøkkelen leses fra en miljøvariabel og ligger **aldri** i repoet.
`claude mcp list` → `stitch: https://stitch.googleapis.com/mcp (HTTP) - Pending approval`, med varsel `Missing environment variables: STITCH_API_KEY`. Dette er forventet.

**Gjenstår (krever bruker):**
1. Logg inn på https://stitch.withgoogle.com → profilmeny → Stitch settings → API key → opprett nøkkel. Stitch er gratis, og det skal ikke velges noe betalt.
2. Legg nøkkelen i en brukervariabel på Windows, ikke i chat eller repo: Innstillinger → System → Om → Avanserte systeminnstillinger → Miljøvariabler → Ny: `STITCH_API_KEY`.
3. Åpne en ny Claude Code-økt i `C:\Users\khali\Cidea-Marketing`, godkjenn MCP-serveren `stitch`, og kjør `/cidea-website`.
4. Claude kjører da en ufarlig lesetest (`list_projects`, deretter `get_screen` på en eksisterende skjerm hvis det finnes en) og fører resultatet inn her.

**Gratisgrenser:** ikke verifisert. Kvoten vises i Stitch-kontoen etter innlogging. Ingen generering er gjort i fase 1.

## 5. Node/Vite/React – VERIFISERT

| Sjekk | Resultat |
|---|---|
| `node --version` / `npm --version` | v24.21.0 / 11.19.0 |
| Ren `npm install` (node_modules slettet først) | OK, 0 sårbarheter. vite 8.3.4, react 19.3.1, react-dom 19.3.1, @vitejs/plugin-react 6.1.2 |
| `npm run build` | OK. `index.html` 1.25 kB, CSS 16.01 kB, JS 234.66 kB (gzip 72.58 kB) |
| `vite preview` (4173) / `vite` dev (5173) | Begge HTTP 200 |
| `node scripts/phase1-smoke.mjs` (Playwright 1.56, Chromium) | **14/14 PASS**: 7 ruter × 390/1440 px, HTTP 200, H1 til stede, ingen JS-feil, 0 px horisontal overflow. Se `evidence/phase1/smoke-results.json` |
| Skjermbilder | `evidence/phase1/home-390.png`, `home-1440.png`, `websites-390.png`, `websites-1440.png` |

**Observasjon i baseline (rettes ikke i fase 1):** på 1440 px stikker «MEMORABLE.» utenfor heltekortet. Siden har engelske etiketter (SELECTED WORK, WHAT WE DO, THE IDEA …) og 01/02/03-nummerering, i strid med briefen. Avsender er fortsatt mailto til smartsvar.no. Alt dette hører til fase 5–7.

## 6. Kostnad og produksjon – VERIFISERT

Ingen betalte tjenester, ingen video, ingen merge, ingen deploy, ingen endringer i DNS eller MX. `main` er uendret.

## Gate-sjekkliste fase 1

- [x] Claude Code lokalt på trygg gren uten tap av lokale endringer
- [ ] `/cidea-website` oppdaget automatisk (skill lest og fulgt manuelt; brukersjekk i § 4)
- [x] Stitch-skills gjennomgått og installert selektivt
- [ ] Stitch-innlogging og fungerende MCP-lesing (konfigurert; venter på `STITCH_API_KEY`)
- [x] Vite-build, lokal preview og skjermbilder for mobil/desktop dokumentert
- [x] Ingen betalinger eller produksjonsendringer
