# Internasjonal SEO og søkeordsundersøkelse for Dubai/UAE (fase B/C)

## 1. Teknisk SEO – implementert

| Område | Før | Nå |
|---|---|---|
| Språk | Bare norsk | Engelsk på `/` og engelske undersider, norsk beholdt |
| `lang` | `no` / `nb` | `en` på engelske sider, uendret på norske |
| hreflang | Ingen | Gjensidige par `no`/`en` + `x-default` for 11 sidepar (22 sider), i `<head>` og i sitemap |
| Kanonisk adresse | Per side | Per side, `/no` for norsk forside |
| Sitemap | Håndskrevet, 17 adresser | Generert ved bygg, 31 adresser med språkalternativer, bare indekserbare sider |
| Strukturerte data | Norsk `Organization` | Engelsk graf på engelske sider: `Organization` (adresse, org.nr., språk), `Service` (tjenester, `areaServed` UAE), `BreadcrumbList`, `Article`, `WebSite` på forsiden. Norske sider uendret. |
| Metadata | Norsk | Unik engelsk tittel (≤ 70 tegn) og beskrivelse (70–170 tegn) per side |
| Internlenking | – | Forside → tjenester, Dubai, artikler. Tjenester ↔ relaterte tjenester og artikler. Dubai → alle tjenester. Artikler → tjenester. |
| Mobil | Fungerer | Kontrollert 390 px og 1440 px, ingen horisontal overflyt (QA.md) |
| Core Web Vitals | – | Lighthouse lokalt (indikativt, se QA.md). CLS 0,12 på `/dubai` (font-bytte) bør rettes sammen med fontarbeidet i PR #20. |

Ikke gjort (krever tilgang eller beslutning): Google Search Console (ny sitemap, internasjonal målretting, overvåking),
Google Business Profile, katalogoppføringer.

## 2. Søkeordsundersøkelse – metode og begrensninger

**Ingen søkevolumer er oppgitt i dette dokumentet.** Skymiljøet har ikke tilgang til søkeordsverktøy med volumdata
(Google Keyword Planner, Ahrefs, Semrush), og ingen betalt tjeneste er opprettet. Undersøkelsen bygger på manuelle søk
(28.10.2026) for å se hvem og hva som rangerer, og på offentlige kilder. Alt som handler om volum eller konkurranse er
merket som **hypotese** og må testes.

### Verifisert (med kilde)

| Funn | Kilde |
|---|---|
| UAE hadde ca. 11,1 mill. internettbrukere (99,0 % av befolkningen) og 11,3 mill. identiteter på sosiale medier ved starten av 2025. | [DataReportal – Digital 2025: The United Arab Emirates](https://datareportal.com/reports/digital-2025-united-arab-emirates). (En 2026-utgave finnes; tallene bør oppdateres fra den.) |
| Google anbefaler gjensidige hreflang-sett per side, og `x-default` for språknøytral standardversjon. Ikke alle sider trenger lokalisert versjon. | [Google Search Central – Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions), [How x-default can help you (2023)](https://developers.google.com/search/blog/2023/05/x-default) |
| Søkeresultatene for «web design agency Dubai», «branding agency Dubai UAE» og «SEO agency Dubai» domineres av listeartikler og kataloger (Clutch, DesignRush, ninjapromo m.fl.) og byråenes egne blogger. | Manuelle søk 28.10.2026, f.eks. [Clutch – Branding agencies Dubai](https://clutch.co/ae/agencies/branding/dubai), [DesignRush](https://www.designrush.com/agency/profile/seo-agency-in-dubai), [ninjapromo – web design Dubai](https://ninjapromo.io/best-web-design-agencies-in-dubai), [Element8 – how to choose a website design agency Dubai](https://go.element8.ae/blog/how-to-choose-a-website-design-agency-dubai/) |
| Clutch lister i størrelsesorden 800 brandingbyråer i Dubai, de fleste små. | Sammendrag av Clutch-katalogen i søk 28.10.2026; tallet er ikke kontrollert på Clutch direkte. |
| UAE har en føderal personvernlov (Federal Decree-Law No. 45 of 2021) med visse ekstraterritorielle virkninger; finansielle frisoner (DIFC, ADGM) har egne regler. | [Clyde & Co](https://www.clydeco.com/en/insights/2021/11/uae-issues-landmark-personal-data-protection-law), [Herbert Smith Freehills](https://www.herbertsmithfreehills.com/latest-thinking/new-data-protection-law-introduced-in-the-uae-%E2%80%93-10-key-takeaways). Juridisk vurdering for Cidea er **ikke** gjort. |

Ikke verifisert fra primærkilde: at arabisk er offisielt språk og engelsk dominerende forretningsspråk i UAE. Det er
allment kjent, men søket ga bare sekundærkilder av lav kvalitet. Formuleringen i artikkelen er holdt generell.

### Hypoteser som skal testes

| # | Hypotese | Hvordan teste |
|---|---|---|
| H1 | Kommersielle hovedord («web design agency Dubai», «branding agency Dubai», «SEO agency Dubai») har høy konkurranse og domineres av kataloger. Et nytt, utenlandsk domene vil ikke rangere på dem på kort sikt. | Keyword Planner (gratis med Google Ads-konto, uten annonsering) for volum; Search Console etter lansering for visninger og posisjon. |
| H2 | Det er mer realistisk å bli funnet på lange, beskrivende søk: «Scandinavian design agency», «Nordic branding agency», «European web design agency for UAE company», «bilingual Arabic English website design», «hreflang multilingual website». | Search Console: visninger per søk etter 8–12 uker. |
| H3 | Katalogoppføringer (Clutch, DesignRush, Sortlist) gir mer synlighet i Dubai-søk enn egen SEO de første månedene. | Krever eiergodkjenning (gratis profiler finnes; betalte oppgraderinger skal ikke kjøpes). Mål henvendelser per kilde. |
| H4 | Kjøpere i UAE søker etter «company» like ofte som «agency» («web design company Dubai»). | Keyword Planner. Juster titler etter funn. |
| H5 | Innhold om flerspråklige nettsider og relansering uten tap av synlighet gir kvalifiserte besøk fra flere markeder. | Search Console per artikkel. |

### Søkeintensjon brukt i innholdet nå

- `/dubai`: «branding, websites and marketing for UAE businesses», «Norwegian creative agency», «remote», «English». Tittelen
  bruker ikke «Dubai» som hovedord fordi siden ikke skal antyde lokal tilstedeværelse; «UAE businesses» og «Dubai» står i
  beskrivelse og tekst.
- Tjenestesidene: generelle engelske tjenesteord (branding and visual identity, website design and development, SEO for
  businesses, social media strategy) uten stedsnavn, slik at de kan rangere internasjonalt.
- Artikler: rådgivende long tail (H2/H5).

## 3. Anbefalte neste steg (SEO)

1. Etter publisering: send `sitemap.xml` i Google Search Console, sjekk hreflang-rapport og dekning for `/` og `/no`.
2. Hent volumdata fra Keyword Planner for listen i H1–H4 før nye landingssider eller titler endres.
3. Beslutt katalogstrategi (H3) – gratis profiler først.
4. Følg norske nøkkelsider i Search Console de første fire ukene (særlig merkenavnsøk og `/no`).
