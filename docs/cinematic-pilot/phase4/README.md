# Fase 4/9 – visuelle ressurser, motivvariasjoner og bevegelse

**Status:** GODKJENT MED VILKÅR av eier 2026-10-17. Se `CHATGPT-REVIEW.md`; betingelsene videreføres i fase 5 og før publisering.
**Kostnad:** 0 NOK. 0 Stitch-kreditter (ingen Stitch-kall i fase 4). Ingen video, ingen nye abonnementer, ingen ny hosting.
**Gren:** `experiment/cinematic-marketing-pilot`, draft PR #13. Ingen merge, deploy eller endring i produksjon/DNS/MX. React-forsiden er senere implementert i fase 5; se `../phase5/README.md`.
**Brief:** [`EXECUTION-BRIEF.md`](EXECUTION-BRIEF.md)

## Oppgaver

| # | Oppgave | Verifisert resultat | Dokumentasjon / bevis |
|---|---|---|---|
| 4.1 | Revisjon, katalog, akseptkriterier | Validator for motivregelen (6 regler) + negativ kontroll (6/6 feil fanget); 10/10 fase 3-SVG OK. Målt baseline på 22 skjermer: samme hero på 8, opptil 12 rammede bokser per side, mobilseksjoner opptil 1 382 px. Katalog per sideområde og 10 målbare kriterier (K1–K10) | [AUDIT.md](AUDIT.md) |
| 4.2 | Motivet i karakteristiske komposisjoner | **10** sidekomposisjoner (Sammenføyning, Rutenett, Stempel, Trapp, Spredning, Bro, Diagram, Spalter, Åpning, Forskyvning), hver med desktop 560×640 og egen mobilkomposisjon 390×280. Alle validert. Vist i sidekontekst 1440/390 med ekte tekst og selvhostede fonter | [variants-overview.png](variants-overview.png), `assets/`, `preview/*.html`, `screens/` |
| 4.3 | Grafikk for hele sidefamilien | 4 artikkelkomposisjoner (én idé per artikkel), 4 tjenesteglyfer, «Hva vi leverer» uten hvite rammer (12 → 0), Innsikt uten nestede kvadrater og rammer, konsept-detalj med regel og «familie». Leveransekort på mobil 396–485 → 143 px | [ASSETS.md](ASSETS.md) |
| 4.4 | Bevegelse uten videokreditter | Isolert prototype i ren CSS + inline SVG, **ingen JS**: inngang 580 ms, markør med lik respons på hover og tastaturfokus, scroll-visning uten scrollkapring, redusert bevegelse. **12/12 nettlesertester.** Ytelsesfeil funnet og rettet (lagdelte SVG-plan: +16 → 0 layout per bilde) | [motion/README.md](motion/README.md), [motion/TEST-RESULTATER.md](motion/TEST-RESULTATER.md), [motion/oversikt.png](motion/oversikt.png) |
| 4.5 | Visuell, språklig og lisensmessig QA | 30 kontroller (15 sider × 2 bredder): 0 kontrastavvik (laveste 6,42:1), 0 overflow, 0 forbudte/engelske ord, 0 nummerering, riktig CTA-tekst, æøå OK, synlig fokus. Ett funn rettet (manglende fokus på «Meny»). Lisensoversikt; Stitch-vilkår må bekreftes av eier | [QA.md](QA.md) |

## Mapper

| Mappe / fil | Innhold |
|---|---|
| `assets/generate.mjs`, `assets/svg/` | Generator og 28 egne SVG-er (kanonisk kilde for fase 5) |
| `assets/manifest.json` | Hver fil med idé og brukssted |
| `fonts/` | Selvhostede Outfit og DM Sans (latin, 67 KB) + OFL-lisenser |
| `preview/` | Statiske forhåndsvisninger (hero per side, seksjoner) – ikke produksjonskode |
| `motion/` | Bevegelsesprototype, tester, rammebilder |
| `screens/` | Skjermbilder 1440 og 390 |
| `tools/` | Validator, revisjon, skjermbilder, QA |

**Åpne lokalt:** `docs/cinematic-pilot/phase4/preview/forside.html` eller `docs/cinematic-pilot/phase4/motion/index.html` i en nettleser.

## Til godkjenning

Se [QA.md § 5](QA.md): K5 (lange listeseksjoner på mobil), komposisjonene, bevegelsene, og eierfakta før lansering.
