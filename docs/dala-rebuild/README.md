# Produksjonsoppdatering

Eier har i samtalen eksplisitt bekreftet tillatelse til original kode, 3D-ressurser og PP Neue Montreal-font og bedt om publisering p� cideamarketing.com. Bekreftelsen legges til grunn; ingen separat lisensavtale er kontrollert. `npm run build` bygger n� den nye forsiden for produksjon. `build:reference` beholder noindex-pr�ven, og `build:legacy` bevarer gammel byggeflyt. Kontaktmottak forblir ubekreftet, med synlig e-postalternativ. 29 produksjonskontroller best�tt. Teksten nedenfor beskriver tidligere lokal pr�vestatus.

# Cidea – lokal referanseprøve

Dato: 2026-10-25. Gren: `redesign/dala-reference`, grunnlag `af014772`.

## Leveranse

Lokal Dala-prøve med original partikkelgeometri, kamera og scrollsekvens, Cideas blå palett og norsk innhold. Dette er tilpasning av offentlig leverte nettleserressurser, ikke en uavhengig rekonstruksjon. Ingen push eller publisering. Tidligere arbeid er bevart.

Forsiden og `/konsept-scroll` bruker prøven. Eksisterende tjenester, artikler, kontakt og personvern er beholdt med mørk stil. Originalens team/investorer er erstattet med tjenester/innsikt. Ordmerket er tekst, ikke endelig logo. Bunnsekvensens originale geometriske symbol er fortsatt del av animasjonen og må vurderes som del av Cidea-identiteten.

## Kjør

```sh
npm ci
npm run build:reference
node tests/reference-static.mjs
node tests/serve-dist.mjs
```

Åpne http://127.0.0.1:4174/. `?motion=off` viser statisk reservevisning. Vanlig `npm run build` bygger tidligere forside. Referanseressurser ligger utenfor `public/` og kopieres bare av referansebygget. Alle sider har noindex i prøvebygget; dette er ikke tilgangskontroll.

## Referanse og tilpasning

Referanse: https://dala.craftedbygc.com/ og Refero-stil e5f5f8cf-e68d-4ed1-bbf5-6b67569af648. Originalens pos-33.exr, sc-33.png, cd-33.png og trekantmodeller driver geometrien. Palett: #030812, #F5F8FC, #BCC6D2, #0077B6, #66CFFF. Partiklenes farge omregnes i shaderen; bevegelse og seksjonskroker beholdes.

Egen mobilmeny, fokusretur, pauseknapp og statisk reservevisning. Redusert bevegelse/manglende WebGL hindrer lasting av scenen. Intercom-bootstrap og diagnostikkundertrykking fjernet. Animasjonsattributter bruker JSON i stedet for Function/eval. Ugyldig posisjonsdimensjon og customUniforms-advarsel rettet. Lisenskommentarer bevart.

Kontaktmottak er fortsatt `MOTTAK_BEKREFTET=false`; direkte e-post vises som alternativ. Ingen henvendelse sendt. Låst personvernfil er uendret.

## Verifisert

- Bygg bestått: 17 forhåndsrendrede sider.
- 44 statiske kontroller bestått, inkludert 348 lokale lenke-/ressursreferanser, H1, noindex og låst personvern. Se static-checks.json.
- Nettleser: partikkelscene, scroll til tjenester/bunn og logo tilbake til hero fungerer. Pause ga to identiske skjermbilder tatt med mellomrom; avspilling kan gjenopptas.
- Mobilmeny fokuserer første lenke; Escape lukker og returnerer fokus. Tom kontaktinnsending viste fire valideringsfeil uten å sende noe.
- Ni undersider åpnet med riktig H1 og uten horisontal overflow ved 1200 px. Se evidence/route-checks.json.
- Hero kontrollert ved 320, 390 og 1200 px. 1440 ble målt i DOM, men skjermbildet klippet til 1248 av panelet; ikke fullbreddebevis.
- Fersk oppstart på port 4189 ga ingen nye konsolladvarsler/feil. Port 4188 viste eldre mellomlagrede filer og rettede advarsler.
- Statisk reserve testet via `?motion=off`, ikke ekte deaktivert JavaScript/GPU.
- Ensfarget kontrast: knapp 4,87:1, brødtekst 11,60:1, overskrift 18,82:1. Ikke målt over alle animerte partikler.

## Før lansering

Bruk av originalens kode, modeller og PP Neue Montreal-font er ikke lisensavklart. Ikke push referansematerialet til offentlig repo. Ingen kontaktes uten instruksjon. Endelig logo, visuell godkjenning, ekte telefon/Safari/Firefox/svak maskinvare, tilgjengelighet og faktisk kontaktmottak gjenstår. Prøven er ikke dokumentert pikselidentisk på alle skjermer. Meny, tekstlengder, tjenester og undersider er tilpasninger. Tidligere Claude-testresultater gjelder ikke denne leveransen.

## Bevaring

`reference-assets.json` registrerer opprinnelse og SHA-256. `evidence/` inneholder skjermbilder, også mellomstadier; `final` og 1200-filer er nyest. Tidligere checkout er urørt. `../cidea-backups/cidea-before-dala.bundle` bevarer tilgjengelig Git-historikk før arbeidet. Claude-skycommitene bff3a11 og 09de614 fantes ikke i klonen og inngår ikke. Ingen Claude-delegering er utført; visuelt arbeid er gjort av ChatGPT.
