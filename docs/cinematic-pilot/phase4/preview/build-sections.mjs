// Fase 4.3: seksjonsforhåndsvisninger med egne SVG-er. Tekst: godkjent fase 3-tekst; leveransetekster
// hentet fra fase 3-skjermene (Stitch) med to rettelser dokumentert i QA.md. Ikke produksjonskode.
// Kjør: node docs/cinematic-pilot/phase4/preview/build-sections.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const here = fileURLToPath(new URL('.', import.meta.url));
const svg = (f, cls = '') => readFileSync(`${here}../assets/svg/${f}`, 'utf8').trim()
  .replace(/ width="\d+" height="\d+"/, cls ? ` class="${cls}" aria-hidden="true"` : '').replace(cls ? / role="img" aria-label="[^"]*"/ : /$^/, '');
const page = (title, nav, body) => `<!doctype html>
<html lang="nb"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} – forhåndsvisning fase 4</title><link rel="stylesheet" href="preview.css"><link rel="stylesheet" href="sections.css"></head>
<body><header class="top"><div class="wrap"><a class="ordmerke" href="#">CIDEA MARKETING</a>
<nav class="hoved" aria-label="Hovedmeny">${['Tjenester', 'Konsepter', 'Tilnærming', 'Innsikt', 'Kontakt'].map(n => `<a href="#"${n === nav ? ' aria-current="page"' : ''}>${n}</a>`).join('')}</nav>
<a class="knapp" href="#kontakt">Snakk med oss</a><button class="meny" type="button">Meny</button></div></header>
<main>${body}</main></body></html>
`;

const leveranser = {
  merkevarebygging: { felt: 'var(--dyp)', glyf: 'glyf-merkevarebygging.svg', tittel: 'Merkevarebygging', items: [
    ['Visuell retning', 'Vi etablerer et helhetlig visuelt rammeverk som formidler hvem bedriften er på en tydelig måte.'],
    ['Logobruk', 'Vi definerer klare regler for proporsjoner, plassering og varianter slik at logoen alltid fungerer.'],
    ['Typografi', 'Vi velger og setter opp skrifttyper som sikrer god lesbarhet og et tydelig uttrykk.'],
    ['Farger', 'Vi setter sammen et funksjonelt fargesystem tilpasset skjerm, universell utforming og kontrastkrav.'],
    ['Kjerneuttrykk og tone', 'Vi klargjør hvordan formspråk og ordvalg samspiller for å bygge gjenkjennelighet.'],
    ['Retningslinjer for videre bruk', 'Vi oppsummerer prinsipper og regler i enkle retningslinjer som er lette å følge i praksis.'] ] },
  'digital-markedsforing': { felt: 'var(--svart)', glyf: 'glyf-digital-markedsforing.svg', tittel: 'Digital markedsføring', items: [
    ['Strategi og mål', 'Vi definerer konkrete kommersielle mål og velger kanalene som passer målet.'],
    ['Innhold for sosiale medier', 'Vi utformer tekster og visuelt materiell som formidler bedriftens kjernebudskap.'],
    ['Kampanjer', 'Vi bygger fokuserte kampanjer med tydelig budskap og klar handling.'],
    ['Annonsering', 'Vi setter opp målrettet distribusjon og administrerer annonsene i valgte kanaler.'],
    ['Optimalisering', 'Vi justerer målgrupper, budskap og budsjettfordeling løpende basert på resultater.'],
    ['Rapportering', 'Vi oppsummerer effekten i oversiktlige rapporter uten unødvendig sjargong.'] ] },
};
for (const [slug, l] of Object.entries(leveranser)) {
  const items = l.items.map(([t, s]) => `<li>${svg(l.glyf, 'glyf')}<h3>${t}</h3><p>${s}</p></li>`).join('');
  writeFileSync(`${here}leveranser-${slug}.html`, page(`Hva vi leverer – ${l.tittel}`, 'Tjenester',
    `<section class="seksjon"><div class="wrap"><h2>Hva vi leverer</h2><p class="under">${l.tittel}: seks leveranser, samlet i ett tjenestefelt.</p><ul class="leveranser" style="--felt:${l.felt}">${items}</ul></div></section>`));
}

const art = [
  ['hvor-mye-koster-en-nettside', 'Nettsider', 'Hvor mye koster en nettside?', 'Prisen på en nettside varierer mye. Det viktigste er ikke antall sider eller hvor avansert designet er, men hva nettsiden skal gjøre for virksomheten.'],
  ['hva-bor-en-god-bedriftsnettside-inneholde', 'Nettsider', 'Hva bør en god bedriftsnettside inneholde?', 'En god bedriftsnettside skal gjøre det enkelt for en besøkende å forstå tre ting: hvem dere er, hva dere tilbyr og hva neste steg er.'],
  ['hvorfor-vises-ikke-nettsiden-pa-google', 'SEO', 'Hvorfor vises ikke nettsiden på Google?', 'Det kan være mange grunner til at en nettside får lite synlighet i Google. Teknisk struktur, innhold, søkeintensjon, konkurranse og autoritet spiller alle en rolle.'],
  ['hvordan-fa-flere-henvendelser-fra-nettsiden', 'Nettsider', 'Hvordan få flere henvendelser fra nettsiden?', 'En nettside trenger ikke bare å se bra ut. Den må gjøre det enkelt for riktig besøkende å forstå tilbudet, føle tillit og ta neste steg.'],
];
const [f0, ...rest] = art;
writeFileSync(`${here}innsikt-liste.html`, page('Innsikt – artikler', 'Innsikt',
  `<section class="seksjon"><div class="wrap"><h2>Innsikt</h2><p class="under">Artikler om nettsider, synlighet og merkevare.</p>
<article class="fremhevet"><div class="tekst"><span class="tema">${f0[1]}</span><h3>${f0[2]}</h3><p>${f0[3]}</p><a class="lenke-lys" href="#">Les artikkelen →</a></div><div class="bilde">${svg(`artikkel-${f0[0]}.svg`, 'a')}</div></article>
<ul class="artikler">${rest.map(([s, t, h, p]) => `<li>${svg(`artikkel-${s}.svg`, 'a')}<span class="tema">${t}</span><h3>${h}</h3><p>${p}</p><a class="lenke" href="#">Les artikkelen →</a></li>`).join('')}</ul></div></section>`));

const fam = ['forside', 'nettsider', 'merkevarebygging', 'seo', 'digital-markedsforing', 'tilnaerming', 'konsepter', 'innsikt', 'kontakt', '404'];
const navn = { forside: 'Forside – Sammenføyning', nettsider: 'Nettsider – Rutenett', merkevarebygging: 'Merkevarebygging – Stempel', seo: 'SEO – Trapp', 'digital-markedsforing': 'Digital markedsføring – Spredning', tilnaerming: 'Tilnærming – Bro', konsepter: 'Konsepter – Diagram', innsikt: 'Innsikt – Spalter', kontakt: 'Kontakt – Åpning', 404: '404 – Forskyvning' };
writeFileSync(`${here}konsept-detalj.html`, page('Konsept: Cidea-motivet', 'Konsepter',
  `<section class="hero"><div class="wrap"><div class="tekst"><p class="krumme">Konsepter / Cidea-motivet · Konsept – ikke kundeprosjekt</p><h1>Cidea-motivet – et geometrisk system</h1><p class="ingress">En undersøkelse av hvordan sammenkoblede fargeplan og ett diagonalt hakk kan bære en hel visuell identitet.</p></div><div class="kunst"><div class="desktop">${svg('konsepter-desktop.svg', 'k')}</div><div class="mobil">${svg('konsepter-mobil.svg', 'k')}</div></div></div></section>
<section class="seksjon" style="background:#F4F5F8"><div class="wrap regel"><div class="stor">${svg('forside-desktop.svg', 'r')}</div><div><h2>Regelen</h2><ol>
<li><b>To til fire plan</b>Rette fargeplan som henger sammen.</li><li><b>Ett hakk</b>Ett plan har et 45°-hakk i nedre høyre hjørne.</li><li><b>Fast proporsjon</b>Hakket er en sjettedel av planets korteste side.</li><li><b>Alltid synlig</b>Ingen streker, sirkler eller tekst i grafikken.</li></ol></div></div></section>
<section class="seksjon"><div class="wrap"><h2>Familien</h2><p class="under">Samme regel, ulik komposisjon etter hva hver side skal uttrykke.</p><ul class="familie">${fam.map(f => `<li>${svg(`${f}-desktop.svg`, 'f')}<span><b>${navn[f].split(' – ')[0]}</b> – ${navn[f].split(' – ')[1]}</span></li>`).join('')}</ul></div></section>`));
console.log('skrev 4 seksjonsforhåndsvisninger');
