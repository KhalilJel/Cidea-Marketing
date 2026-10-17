// Lager statiske hero-forhåndsvisninger (én HTML per side) med inline SVG fra ../assets/svg.
// Godkjent tekst fra fase 3 (DESIGN.md § 8 og ChatGPT-review utkast 2). Ikke produksjonskode.
// Kjør: node docs/cinematic-pilot/phase4/preview/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const here = fileURLToPath(new URL('.', import.meta.url));
const svg = f => readFileSync(`${here}../assets/svg/${f}`, 'utf8').trim().replace(/ width="\d+" height="\d+"/, '');

export const pages = [
  { side: 'forside', nav: null, krumme: '', h1: 'Nettsider og helhetlig markedsføring som utvikles over tid.', ingress: 'Vi bygger nettsider, former merkevarer og driver målrettet SEO og digital markedsføring for bedrifter som ønsker kontinuerlig forbedring.', sekundær: 'Se konseptet' },
  { side: 'nettsider', nav: 'Tjenester', krumme: 'Tjenester / Nettsider', h1: 'Nettsider som gjør bedriften enklere å forstå, finne og velge.', ingress: 'Vi lager strategi, struktur, design og utvikling for en fokusert bedriftsnettside – og kan videreutvikle den etter lansering.', sekundær: 'Hva vi leverer' },
  { side: 'merkevarebygging', nav: 'Tjenester', krumme: 'Tjenester / Merkevarebygging', h1: 'Merkevarebygging som gjør bedriften lettere å kjenne igjen.', ingress: 'Vi lager et praktisk visuelt fundament med retning for logobruk, typografi, farger og hvordan merkevaren uttrykker seg.', sekundær: 'Hva vi leverer' },
  { side: 'seo', nav: 'Tjenester', krumme: 'Tjenester / SEO', h1: 'SEO som bygger synlighet over tid.', ingress: 'Vi jobber løpende med teknisk helse, nyttig innhold og søkeintensjon, og måler synligheten underveis.', sekundær: 'Hva vi leverer' },
  { side: 'digital-markedsforing', nav: 'Tjenester', krumme: 'Tjenester / Digital markedsføring', h1: 'Digital markedsføring rundt et tydelig mål.', ingress: 'Vi lager strategi, innhold og kampanjer og optimaliserer dem rundt et definert kommersielt mål. Annonsebudsjett kommer i tillegg.', sekundær: 'Hva vi leverer' },
  { side: 'tilnaerming', nav: 'Tilnærming', krumme: '', h1: 'Slik jobber vi – fra første avklaring til videreutvikling.', ingress: 'Vi avklarer behov, designer og utvikler løsningen, og kan videreutvikle den etter lansering.', sekundær: 'Les om nettsider' },
  { side: 'konsepter', nav: 'Konsepter', krumme: '', h1: 'Konseptuelle formstudier og digitale utforskninger.', ingress: 'Konseptene viser hvordan vi utforsker visuelle løsninger. De er ikke kundeprosjekter.', sekundær: 'Se konseptet' },
  { side: 'innsikt', nav: 'Innsikt', krumme: '', h1: 'Innsikt om nettsider, merkevare og digital vekst.', ingress: 'Artikler om nettsider, merkevarebygging, SEO og digital markedsføring for norske bedrifter.', sekundær: null },
  { side: 'kontakt', nav: 'Kontakt', krumme: '', h1: 'Ta kontakt for en uforpliktende fagprat.', ingress: 'Skriv til oss om nettsider, merkevarebygging, SEO eller digital markedsføring for bedriften.', sekundær: null, ingenCta: true },
  { side: '404', nav: null, krumme: '', h1: 'Vi finner ikke denne siden', ingress: 'Siden kan være flyttet eller slettet. Gå til forsiden eller ta kontakt med oss.', sekundær: 'Til forsiden' },
];
const navs = ['Tjenester', 'Konsepter', 'Tilnærming', 'Innsikt', 'Kontakt'];
// Godkjent CTA (ChatGPT-review utkast 2, punkt 1; EXECUTION-BRIEF 4.5). Løftet «Vi tar kontakt» brukes live først etter testet skjemamottak (fase 6).
const cta = `<section class="cta" id="kontakt"><div class="wrap"><h2>Klar for et overbevisende digitalt uttrykk?</h2><p>Fortell oss kort om bedriften og hva dere ønsker hjelp med. Vi tar kontakt på e-post.</p><a class="knapp lys" href="#">Snakk med oss →</a></div></section>`;

for (const p of pages) {
  const html = `<!doctype html>
<html lang="nb"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.h1} – forhåndsvisning fase 4</title><link rel="stylesheet" href="preview.css"></head>
<body>
<header class="top"><div class="wrap"><a class="ordmerke" href="#">CIDEA MARKETING</a>
<nav class="hoved" aria-label="Hovedmeny">${navs.map(n => `<a href="#"${n === p.nav ? ' aria-current="page"' : ''}>${n}</a>`).join('')}</nav>
<a class="knapp" href="#kontakt">Snakk med oss</a><button class="meny" type="button">Meny</button></div></header>
<main><section class="hero"><div class="wrap">
<div class="tekst">${p.krumme ? `<p class="krumme">${p.krumme}</p>` : ''}<h1>${p.h1}</h1><p class="ingress">${p.ingress}</p>
<div class="handling">${p.ingenCta ? '' : '<a class="knapp" href="#kontakt">Snakk med oss →</a>'}${p.sekundær ? `<a class="lenke" href="#">${p.sekundær} →</a>` : ''}</div></div>
<div class="kunst"><div class="desktop">${svg(`${p.side}-desktop.svg`)}</div><div class="mobil">${svg(`${p.side}-mobil.svg`)}</div></div>
</div></section>${p.ingenCta ? '' : cta}</main>
<footer class="bunn"><div class="wrap"><span class="ordmerke">CIDEA MARKETING</span><small>© 2026 Cidea Marketing</small></div></footer></body></html>
`;
  writeFileSync(`${here}${p.side}.html`, html);
}
console.log(`skrev ${pages.length} forhåndsvisninger`);
