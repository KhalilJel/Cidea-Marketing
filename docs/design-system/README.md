# Cidea designsystem – teknisk implementering (fase 2)

Versjon 0.1.0 · Grunnlag: [issue #10](https://github.com/KhalilJel/Cidea-Marketing/issues/10), inkl. «Approved refinements — 2026-10-14».

Dette er **kun teknisk implementering** av spesifikasjonen i issue #10. Den eksisterende nettsiden (`index.html`, `src/main.jsx`, `src/styles.css`) er **ikke endret**. Komponentene ligger isolert under `src/design-system/` med `ds-`-prefiks og vises på en egen forhåndsvisning (`/design-system.html`, `noindex`).

## Filer

| Fil | Innhold |
|---|---|
| `src/design-system/tokens.json` | Kilde for alle tokens (farger, fonter, tjeneste-aksenter, skalaer) |
| `src/design-system/tokens.css` | Generert fra `tokens.json` (`node scripts/build-tokens.mjs`) – ikke rediger for hånd |
| `src/design-system/fonts.css` | Selvhostet Manrope og Inter (variable fonter) |
| `src/design-system/components.css` | Hero, tjenestekort, artikkelkort, CTA, footer, knapper, fokus, redusert bevegelse |
| `src/design-system/components.jsx` | React-komponenter: `Logo`, `Media`, `Button`, `Hero`, `ServiceCard`, `ArticleCard`, `Cta`, `Footer` |
| `src/design-system/preview.jsx`, `design-system.html` | Teknisk forhåndsvisning |
| `scripts/contrast-check.mjs` | WCAG AA-kontrastsjekk → `contrast-report.md` |
| `scripts/visual-qa.mjs` | Nettleser-QA → `screenshots/`, `qa-results.json` |

## Hva som er implementert fra spesifikasjonen

**Farger (godkjent):** navy `#0F172A`, blue `#2563EB`, off-white `#F8FAFC`, white `#FFFFFF`, slate `#64748B`, mist `#CBD5E1`, ivory `#F8F5F0`, burgundy `#762D35`, terracotta `#D96532`, forest `#245B43`, coral `#FF7059`.

**Tjeneste-aksenter:** `data-service="branding|nettsider|seo|sosiale-medier"` setter `--accent`, `--accent-text` og `--on-accent`. Generatoren regner ut kontrasten. Når en aksent ikke når 4.5:1 som normal tekst på hvit **og** ivory, faller `--accent-text` tilbake til navy. Det gjelder terracotta og coral, i tråd med issue #10.

**Fonter:** Manrope (overskrifter) og Inter (brødtekst), begge **SIL Open Font License 1.1**. Det betyr fri bruk, også kommersielt og selvhostet. Lisensen følger med i `node_modules/@fontsource-variable/*/LICENSE`. Fontene er selvhostet via Fontsource, så besøkendes IP-adresser ikke sendes til Google. Nettleseren laster bare de latinske undersettene (verifisert). `font-display: swap` er satt. Reserve: `ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif`.

**Fokus:** 3px outline med 3px offset. Blå på lyse flater (5.17:1), hvit på mørke (17.85:1). Bare `:focus-visible`. Hopp-til-innhold-lenke. Hele kortet er klikkbart med ett tabulatorstopp.

**Redusert bevegelse:** Alle overganger og transformasjoner slås av ved `prefers-reduced-motion: reduce`. Støtte for `forced-colors` (høykontrast i Windows) er også lagt inn.

**Bilder:** `Media`-komponenten støtter `<picture>` med AVIF/WebP-kilder, `srcset`/`sizes` og påkrevd `width`/`height` mot layoutforskyvning. Den har også `aspect-ratio`, `loading="lazy"` og `fetchpriority="high"` for heltebilde. Uten godkjent bilde vises en tydelig merket tom flate, aldri et tilfeldig bilde.

## Tekniske avgjørelser som bør godkjennes av design

Følgende er **ikke definert i spesifikasjonen**. De er lagt inn som provisoriske tekniske standardverdier under `provisional` i `tokens.json` og kan endres på ett sted:

- Typografisk skala (flytende `clamp()`, utledet fra størrelsene på dagens nettside), linjehøyder og bokstavavstand
- Avstandsskala, gutter og maksbredder
- Radius (4/8/16/pill) og bevegelse (150/200 ms, én easing)
- Komponentuttrykk: aksent som 6px topplinje på tjenestekort, navy for hero-, CTA- og footerflater
- **Dempet tekst på ivory:** slate gir bare 4.38:1 på ivory (under AA). `--text-muted` er derfor navy på ivory og slate på hvit/off-white. Dette ble oppdaget i nettlesertesten (axe), ikke i mockupen.
- UI-etiketter som måtte ha en tekst: «Hopp til innhold», «Tjenester», «Ressurser», «Artikkel», «Utforsk». Ingen markedsføringstekst er skrevet. All annen tekst er hentet ordrett fra dagens nettside.

## Manglende designressurser

Disse er **ikke implementert**, fordi godkjente filer ikke finnes i repoet, i noen gren eller i noen PR:

1. **Logo:** godkjent SVG-ordmerke «cidea» (lys, mørk, mono, transparent), monogram og favicon. Forhåndsvisningen bruker dagens tekstlogo fra nettsiden. `public/favicon.svg` på `redesign/dala-marketing` hører til et tidligere konsept og er ikke brukt.
2. **Bilder:** heltebilder/redaksjonelle foto, merkevaredemonstrasjoner, nettsidemockups, søkeillustrasjoner og konsepter for sosiale medier, med dokumenterte rettigheter.
3. **Tekst:** godkjent beskrivelse for tjenesten **Sosiale medier**. Kortet viser «Tekst mangler». Dagens nettside har bare «Digital markedsføring».
4. **Maler** for Instagram, LinkedIn, Facebook og bloggforsider: krever godkjente formater, layout og bilder.
5. **Merkevaremanual:** frisone, minstestørrelser og logobruk kan ikke dokumenteres før logofilene finnes.
6. **Komponentspesifikasjon:** layout, typografisk skala og avstand er ikke spesifisert (se provisoriske verdier over).
7. **Fem sidekonsepter** (forside, Branding, Nettsider, SEO, Sosiale medier): ingen godkjente skisser finnes. Hører uansett til fase 3.

Når en ressurs leveres: legg filen i `public/brand/` (logo) eller `src/assets/` (bilder). Bytt så ut `Logo` i `components.jsx` / send `src`/`sources` til `Media`, og kjør QA på nytt.

## Tester

```bash
node scripts/build-tokens.mjs --check   # tokens.css er i synk med tokens.json
node scripts/contrast-check.mjs         # WCAG AA for alle fargepar komponentene bruker
npm run build
npx vite preview --port 4173 &
node scripts/visual-qa.mjs              # krever playwright + @axe-core/playwright (--no-save)
```

`visual-qa.mjs` sjekker ved 320/375/768/1440 px:
- ingen JS-feil, horisontal scroll, klippet tekst eller tekst utenfor skjermen
- overskrifter kolliderer ikke med teksten under
- klikkflater ≥ 24 px
- axe WCAG 2.2 A/AA

I tillegg sjekker den:
- at fontene lastes, ingen tredjeparts fontforespørsler, kun latinske undersett
- at reservefonter fungerer ved 320 px
- at tastaturfokus er synlig på alle stopp
- at redusert bevegelse virker
- at dagens forside fortsatt rendres

CI kjører alt i `.github/workflows/design-system.yml`.
