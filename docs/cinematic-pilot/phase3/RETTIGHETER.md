# Rettigheter og ressursoversikt – konsept C (fase 3)

**Status:** utkast 2, 2026-10-16 (Claude Code). Punkter merket **«Må avklares»** er ikke verifisert, og må avklares av bruker før lansering.

| Ressurs | Brukes til | Kilde | Lisens / vilkår | Status |
|---|---|---|---|---|
| Outfit (skrift) | Overskrifter | Google Fonts | SIL Open Font License 1.1: fri kommersiell bruk, kan selvhostes | OK. Lisensfil legges ved når fontene selvhostes |
| DM Sans (skrift) | Brødtekst, etiketter | Google Fonts | SIL Open Font License 1.1 | OK. Lisensfil legges ved når fontene selvhostes |
| Material Symbols Outlined (ikoner) | Tjenesteikoner, piler, meny | Google (via Stitch-HTML) | Apache License 2.0: fri kommersiell bruk med lisensmerknad | OK. Lisensmerknad legges ved. Alternativ: egne SVG-ikoner |
| Cidea-motivet (fargeplan) og heltekunst | Hero, markører på kort, konsept, 404, ikon | **Tegnet på nytt som egne SVG-filer** i `motif/svg/` fra en dokumentert regel (`motif/generate-motif.mjs`). Opprinnelig idé fra en Stitch-skisse | Cideas eget materiale | OK for egne SVG-er. Selve idéen stammer fra en Stitch-generering. Stitch-vilkårene bør likevel leses av bruker |
| Illustrasjoner på konseptkort | Konsepter | Erstattet av motivets `konsept-kort.svg` i utkast 2 | Cideas eget | OK |
| Fotografi | – | – | – | **Ingen** brukes i konsept C |
| AI-bilder fra konsept A og B (`phase2/concept-A/A-bilde-*.png`, B-grafikk) | – | Stitch | – | **Brukes ikke.** Ligger kun som dokumentasjon av forkastede retninger |
| Tekst i Stitch-skissene | Utkast | Generert av Stitch og bearbeidet via prompts | – | Utkast. Endelig tekst skrives og godkjennes av ChatGPT/bruker |
| Artikkeltekst «Hvor mye koster en nettside?» | Artikkelmal | Eget innhold (`blog/hvor-mye-koster-en-nettside.md`) | Cideas eget | OK |
| Ordmerke «CIDEA MARKETING» | Toppmeny, bunntekst | Satt i Outfit med terrakotta-kvadrat | Font: OFL | **Må avklares:** ingen godkjent logofil finnes. Varemerke/navn må bekreftes av bruker |
| Personverntekst | Personvern | Utkast med tydelige hull | – | **Må fullføres og kvalitetssikres av eier** før publisering |

**Prinsipp for lansering:** alt som vises på nettsiden, skal enten være eget materiale (egne SVG-er, egen tekst) eller ha dokumentert lisens. Ingen Stitch-skjermbilder publiseres som bilder på nettsiden; skissene er kun referanse for implementeringen.
