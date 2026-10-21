# P2 «Jevne bilder, 4× struping» – analyse og tiltak (Claude Code skyøkt, 2026-10-20)

## Hva testen måler

`tests/forside.test.mjs` P2 laster `/` på mobil (390×844) med 4× CPU-struping. Den registrerer tiden mellom bilder (requestAnimationFrame) de første 1,5 s fra navigasjonsstart, og krever p95 ≤ 34 ms. I en normal kjøring blir det 53–72 bilder, så de 3–4 lengste bildene (JS-kjøring og hydrering) faller utenfor p95. Kommer det færre bilder, blir p95 i praksis det lengste bildet.

## Funn

- Den kjente feilen (også sett i denne økten): **10 bilder, p95 550 ms, median 16,7 ms**. Nesten alle bilder er normale, men ett eller to stopp på ca. 550 ms (ca. 140 ms ustrupet) sluker vinduet.
- **Kunne ikke gjenskapes** i 50 nye kjøringer:
  - Isolert P2, 15 kjøringer per bygg: 0/15 feil før og 0/15 etter kodesplitting. p95 16,7–16,8 ms, 66–72 bilder.
  - Hele `test:forside`, 10 kjøringer per bygg: 0/10 feil på det gamle bygget (HEAD 69931b0, i egen worktree) og 0/10 på det nye. 52–58 bilder.
- **Lange oppgaver ved innlasting** (PerformanceObserver `longtask`, 4× struping), per kjøring:
  - Før: JS-kjøring 82–116 ms, hydrering 90–152 ms, iblant en tredje på 57–71 ms. Ca. 210 ms i snitt for de to første.
  - Etter kodesplitting: 71–119 ms og 82–148 ms. Ca. 198 ms i snitt.
- Den delte JS-filen var 282 kB (minifisert). Det meste er React 19 (react-dom). Vår egen kode er ca. 60 kB kilde.

## Vurdering

- **Ikke en vedvarende produktfeil.** Feilen oppstår når et enkelt stopp i skymiljøet (VM-planlegging, søppelinnsamling, en nettleser fra forrige test som lukkes) treffer det korte målevinduet. Med få bilder slår stoppet direkte ut i p95. Testen er korrekt, men følsom for støy i miljøet.
- **Den reelle produktkostnaden** er to lange oppgaver på ca. 0,1 s hver ved innlasting under 4× struping. På en svak telefon gir det ca. 0,2 s der siden ikke svarer på trykk mens React hydrerer. Det er innenfor vanlige mål (Total Blocking Time < 200 ms), men på grensen.
- Testen er **ikke** endret: ingen svekket grense og ingen nye forsøk.

## Tiltak gjennomført: kodesplitting per side

- `vite.config.js`: én felles CSS-fil i `<head>` (`cssCodeSplit: false`), som før, så forhåndsrendrede sider er ferdig stilt uten JS. Manifestet brukes ved forhåndsrendring og slettes etterpå.
- `src/ruter-klient.js`: forsiden, prototypen og kontaktsiden er egne JS-deler. Undersidene deler én del (`src/ruter-sider.jsx`). `src/ruter.jsx` er fortsatt den fullstendige tabellen for forhåndsrendring.
- `scripts/prerender.mjs` legger inn `modulepreload` for sidens egen del, så den hentes parallelt med hovedfilen.
- Resultat (minifisert JS per side):

  | Side | Før | Etter |
  |---|---|---|
  | `/` | 282 kB | 246 kB (felles 223 + Forside 13 + Ramme 10) |
  | `/konsept-scroll` | 282 kB | 253 kB |
  | Undersider | 282 kB | 257 kB |
  | `/kontakt` | 282 kB | 240 kB |

  Filmkoden lastes nå bare på `/konsept-scroll`.
- Kontrollert: alle 17 sider hydrerer uten feil eller advarsler, mobilmenyen virker etter hydrering på hver side, og hver side laster bare sin egen del. Testsuitene etterpå: nettsted 35/35, QA 86/86, konsept-scroll 48/50 + 2 ikke kjørt, forside 28/30 + 2 ikke kjørt (P2 bestått).

## Gjenstår (til vurdering, ikke gjort)

- Større gevinst krever at mindre JavaScript hydreres: de fleste undersidene er statiske, og bare menyen, skjemaet og filmen trenger JS. Delvis hydrering («øyer») eller et lettere rammeverk er en arkitekturendring og bør besluttes eksplisitt.
- P2 kan gjøres robust uten å svekkes, for eksempel ved å måle et fast antall bilder etter første opptegning i stedet for et tidsvindue fra navigasjonsstart. Det endrer hva testen måler og bør godkjennes først.
- Firefox/WebKit og ekte telefon er ikke målt.
