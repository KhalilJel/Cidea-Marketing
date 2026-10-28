# Internasjonalisering og Dubai/UAE (oktober 2026)

Gren `claude/affectionate-archimedes-3rmjxb`, Draft PR mot `main`. Ikke publisert.

| Dokument | Innhold |
|---|---|
| [AUDIT.md](AUDIT.md) | Fase A: produksjonsstatus, ruter, skjema, tester, åpne PR-er, Gullkornet |
| [URL-STRATEGI.md](URL-STRATEGI.md) | Fase B: språkstruktur, hreflang, sitemap, redirects, konsekvens for `/` |
| [SEO.md](SEO.md) | Teknisk SEO og søkeordsundersøkelse for UAE: verifisert vs. hypoteser, kilder |
| [BOOKING.md](BOOKING.md) | Fase D: møtebooking, alternativer, hvordan den aktiveres |
| [INNHOLDSSTRATEGI.md](INNHOLDSSTRATEGI.md) + [innholdsplan-30-dager.csv](innholdsplan-30-dager.csv) | Fase E: pilarer, målgrupper, kanaler, 30-dagersplan, temaer, visuelle retningslinjer |
| [DESIGN-FREMTID.md](DESIGN-FREMTID.md) | Fremtidig designretning, kun dokumentasjon |
| [QA.md](QA.md) | Fase F: testresultater, Lighthouse, funn |

Kode: `src/i18n.js` (språkpar), `src/en/` (engelske sider, innhold, skjema, booking), `insights/` (engelske artikler),
`src/reference-home/en.html` (engelsk forside), `scripts/reference-home.mjs`, `scripts/prerender.mjs`,
`scripts/strukturerte-data.mjs`, `netlify.toml` (redirects). Tester: `tests/internasjonal.test.mjs`, `tests/norsk-regresjon.mjs`,
`tests/internasjonal-bilder.mjs`.
