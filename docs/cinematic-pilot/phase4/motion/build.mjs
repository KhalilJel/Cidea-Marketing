// Fase 4.4: isolert bevegelsesprototype. Bygger motion/index.html med inline SVG fra ../assets/svg.
// Ren CSS, ingen JavaScript i den ferdige siden. Kjør: node docs/cinematic-pilot/phase4/motion/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const here = fileURLToPath(new URL('.', import.meta.url));
const svg = (f, cls) => readFileSync(`${here}../assets/svg/${f}`, 'utf8').trim()
  .replace(/ width="\d+" height="\d+"/, ` class="${cls}"`);
const decor = s => s.replace(/ role="img" aria-label="[^"]*"/, ' aria-hidden="true" focusable="false"');
// Lagdelt motiv: hvert plan blir en egen <svg> stablet i samme ramme. Da kan transform på
// hvert plan kjøres av kompositoren (transform inne i én SVG gir layout/maling per bilde i Chromium).
const layered = (f, cls) => {
  const s = readFileSync(`${here}../assets/svg/${f}`, 'utf8');
  const [, , W, H] = s.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
  const label = (s.match(/aria-label="([^"]*)"/) || [])[1] || 'Cidea-motiv';
  const planes = [...s.matchAll(/<(rect|polygon)([^>]*)\/>/g)];
  return `<div class="${cls}" role="img" aria-label="${label}" style="aspect-ratio:${W}/${H}">` + planes.map(m => {
    const attrs = m[2]; const di = (attrs.match(/data-i="(\d+)"/) || [])[1]; const hk = /data-hakk/.test(attrs);
    return `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false" data-i="${di}"${hk ? ' data-hakk="1"' : ''}><${m[1]}${attrs.replace(/ data-[a-z]+="[^"]*"/g, '')}/></svg>`;
  }).join('') + '</div>';
};

const tjenester = [
  ['Nettsider', 'var(--marine)', 'glyf-nettsider.svg', 'Les om nettsider'],
  ['Merkevarebygging', 'var(--dyp)', 'glyf-merkevarebygging.svg', 'Les om merkevarebygging'],
  ['SEO', 'var(--skog)', 'glyf-seo.svg', 'Les om SEO'],
  ['Digital markedsføring og sosiale medier', 'var(--svart)', 'glyf-digital-markedsforing.svg', 'Les om digital markedsføring'],
];
const artikler = [
  ['hvor-mye-koster-en-nettside', 'Hvor mye koster en nettside?'],
  ['hva-bor-en-god-bedriftsnettside-inneholde', 'Hva bør en god bedriftsnettside inneholde?'],
  ['hvorfor-vises-ikke-nettsiden-pa-google', 'Hvorfor vises ikke nettsiden på Google?'],
  ['hvordan-fa-flere-henvendelser-fra-nettsiden', 'Hvordan få flere henvendelser fra nettsiden?'],
];

const html = `<!doctype html>
<html lang="nb"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bevegelsesprototype – Cidea-motivet (fase 4)</title>
<link rel="stylesheet" href="../preview/preview.css"><link rel="stylesheet" href="motion.css"></head>
<body>
<header class="top"><div class="wrap"><a class="ordmerke" href="#">CIDEA MARKETING</a>
<nav class="hoved" aria-label="Hovedmeny"><a href="#">Tjenester</a><a href="#">Konsepter</a><a href="#">Tilnærming</a><a href="#">Innsikt</a><a href="#">Kontakt</a></nav>
<a class="knapp" href="#kontakt">Snakk med oss</a><button class="meny" type="button">Meny</button></div></header>
<main>
<section class="hero"><div class="wrap">
<div class="tekst"><p class="krumme">Bevegelse 1 – inngang (≤ 600 ms, én gang)</p><h1>Nettsider og helhetlig markedsføring som utvikles over tid.</h1>
<p class="ingress">Vi bygger nettsider, former merkevarer og driver målrettet SEO og digital markedsføring for bedrifter som ønsker kontinuerlig forbedring.</p>
<div class="handling"><a class="knapp" href="#kontakt">Snakk med oss →</a></div></div>
<div class="kunst inngang"><div class="desktop">${layered('forside-desktop.svg', 'motiv')}</div><div class="mobil">${layered('forside-mobil.svg', 'motiv')}</div></div>
</div></section>

<section class="seksjon"><div class="wrap"><p class="krumme">Bevegelse 2 – hover og tastaturfokus på motivmarkører</p><h2>Dette kan vi hjelpe dere med</h2>
<ul class="tjenester">${tjenester.map(([t, felt, g, l]) => `<li style="--felt:${felt}"><a href="#">${decor(svg(g, 'markor'))}<h3>${t}</h3><span>${l} →</span></a></li>`).join('')}</ul></div></section>

<section class="seksjon"><div class="wrap"><p class="krumme">Bevegelse 3 – rolig visning ved scrolling (ren CSS, ingen scrollkapring)</p><h2>Innsikt</h2>
<ul class="avslor">${artikler.map(([s, t]) => `<li><a href="#">${decor(svg(`artikkel-${s}.svg`, 'a'))}<h3>${t}</h3><span>Les artikkelen →</span></a></li>`).join('')}</ul></div></section>
</main></body></html>
`;
writeFileSync(`${here}index.html`, html);
console.log('skrev motion/index.html', Buffer.byteLength(html), 'B');
