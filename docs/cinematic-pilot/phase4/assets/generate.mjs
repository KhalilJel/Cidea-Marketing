// Fase 4: Cidea-motivet i sidespesifikke komposisjoner (samme DNA, ulik uttrykk).
// Regel (godkjent fase 3, se ../../phase3/motif/README.md): 2–4 sammenkoblede, aksejusterte
// fargeplan; nøyaktig ett plan med 45°-hakk nede til høyre, hakk = round(kortside/6);
// hakket alltid synlig; ingen strek, sirkel, tekst eller gradient.
// Hver komposisjon har en desktopversjon (560×640, enhet 20 px) og en egen mobilkomposisjon
// (390×280, enhet 10 px) – mobil er komponert på nytt for liggende format, ikke skalert.
// Planene får data-i (rekkefølge) slik at bevegelsesprototypen kan animere dem uten JS-endringer.
// Kjør: node docs/cinematic-pilot/phase4/assets/generate.mjs  (validér med ../tools/validate-motif.mjs)
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('./svg/', import.meta.url));
mkdirSync(out, { recursive: true });

export const C = { dyp: '#AD2C07', terrakotta: '#D84A26', marine: '#1E293B', skog: '#2D4A3E', svart: '#141619', stein: '#E4E6EC' };

const rect = (x, y, w, h, f, i) => `<rect data-i="${i}" x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/>`;
const notched = (x, y, w, h, f, i) => {
  const n = Math.round(Math.min(w, h) / 6);
  return `<polygon data-i="${i}" data-hakk="1" points="${x},${y} ${x + w},${y} ${x + w},${y + h - n} ${x + w - n},${y + h} ${x},${y + h}" fill="${f}"/>`;
};

// [type, x, y, w, h, farge] i enheter. 'n' = planet med hakk.
export const compositions = {
  forside: { idé: 'Sammenføyning – flere fagfelt låst sammen rundt én kjerne', dominant: 'dyp',
    desktop: [['n', 4, 5, 19, 21, C.dyp], ['r', 0, 19, 12, 13, C.marine], ['r', 16, 0, 12, 10, C.skog], ['r', 9, 11, 8, 8, C.stein]],
    mobil: [['n', 9, 3, 21, 21, C.dyp], ['r', 0, 13, 13, 15, C.marine], ['r', 25, 0, 14, 9, C.skog]] },
  nettsider: { idé: 'Rutenett – liggende flater forskjøvet som sider og skjermer', dominant: 'marine',
    desktop: [['r', 0, 3, 20, 12, C.stein], ['r', 4, 10, 20, 12, C.skog], ['n', 8, 17, 20, 13, C.marine], ['r', 17, 0, 6, 6, C.dyp]],
    mobil: [['r', 0, 0, 24, 11, C.stein], ['r', 6, 6, 24, 11, C.skog], ['n', 12, 12, 26, 14, C.marine], ['r', 28, 2, 7, 7, C.dyp]] },
  merkevarebygging: { idé: 'Stempel – ett tydelig kjennetegn med et lite merke festet i hjørnet', dominant: 'dyp',
    desktop: [['r', 0, 20, 10, 10, C.stein], ['n', 3, 5, 22, 22, C.dyp], ['r', 18, 1, 9, 9, C.marine]],
    mobil: [['r', 4, 16, 10, 10, C.stein], ['n', 10, 3, 22, 22, C.dyp], ['r', 26, 0, 9, 9, C.marine]] },
  seo: { idé: 'Trapp – synlighet som bygges trinn for trinn', dominant: 'skog',
    desktop: [['r', 0, 22, 9, 10, C.stein], ['r', 7, 15, 9, 17, C.marine], ['n', 14, 5, 14, 27, C.skog]],
    mobil: [['r', 0, 17, 12, 11, C.stein], ['r', 9, 9, 12, 19, C.marine], ['n', 18, 0, 20, 28, C.skog]] },
  'digital-markedsforing': { idé: 'Spredning – ett mål som fordeles ut i flere kanaler', dominant: 'svart',
    desktop: [['r', 12, 2, 14, 7, C.marine], ['r', 12, 12, 16, 7, C.dyp], ['r', 12, 22, 11, 7, C.skog], ['n', 0, 0, 14, 32, C.svart]],
    mobil: [['r', 8, 1, 22, 7, C.marine], ['r', 8, 10, 31, 7, C.dyp], ['r', 8, 19, 18, 7, C.skog], ['n', 0, 0, 10, 28, C.svart]] },
  tilnaerming: { idé: 'Bro – to parter forbundet over tid', dominant: 'skog',
    desktop: [['r', 0, 6, 10, 24, C.marine], ['r', 6, 14, 16, 7, C.dyp], ['n', 17, 2, 11, 27, C.skog]],
    mobil: [['r', 0, 4, 10, 22, C.marine], ['r', 6, 10, 24, 7, C.dyp], ['n', 26, 1, 13, 25, C.skog]] },
  konsepter: { idé: 'Diagram – regelen selv: plan, sammenheng og ett hakk', dominant: 'marine',
    desktop: [['r', 2, 2, 20, 20, C.marine], ['r', 4, 20, 8, 8, C.dyp], ['n', 15, 14, 13, 17, C.skog]],
    mobil: [['r', 0, 0, 18, 20, C.marine], ['r', 4, 18, 8, 8, C.dyp], ['n', 14, 8, 18, 18, C.skog]] },
  innsikt: { idé: 'Spalter – kolonner under en felles overskrift', dominant: 'dyp',
    desktop: [['r', 0, 8, 8, 22, C.stein], ['r', 9, 4, 8, 26, C.marine], ['r', 18, 10, 8, 20, C.skog], ['n', 0, 2, 26, 8, C.dyp]],
    mobil: [['r', 0, 8, 10, 20, C.stein], ['r', 12, 6, 10, 22, C.marine], ['r', 24, 8, 10, 20, C.skog], ['n', 0, 0, 36, 9, C.dyp]] },
  kontakt: { idé: 'Åpning – en dør inn i en større flate', dominant: 'marine',
    desktop: [['r', 0, 4, 22, 26, C.marine], ['r', 6, 12, 9, 18, C.stein], ['n', 15, 0, 13, 14, C.dyp]],
    mobil: [['r', 0, 2, 24, 26, C.marine], ['r', 6, 11, 8, 17, C.stein], ['n', 20, 0, 18, 14, C.dyp]] },
  404: { idé: 'Forskyvning – ett plan har glidd ut av rutenettet', dominant: 'dyp',
    desktop: [['r', 0, 4, 12, 12, C.marine], ['r', 12, 4, 12, 12, C.skog], ['r', 0, 16, 12, 12, C.stein], ['n', 13, 15, 13, 13, C.dyp]],
    mobil: [['r', 0, 2, 10, 12, C.marine], ['r', 10, 2, 10, 12, C.skog], ['r', 0, 14, 10, 12, C.stein], ['n', 11, 13, 13, 13, C.dyp]] },
};

// Artikkelgrafikk (640×280, enhet 20 px) – én idé per artikkel.
export const articles = {
  'hvor-mye-koster-en-nettside': { idé: 'Byggeklosser i ulik størrelse – omfang avgjør prisen',
    planes: [['r', 0, 6, 8, 8, C.stein], ['r', 7, 3, 10, 11, C.marine], ['n', 16, 0, 14, 14, C.dyp]] },
  'hvorfor-vises-ikke-nettsiden-pa-google': { idé: 'Et plan som hever seg over grunnflaten – synlighet',
    planes: [['r', 0, 9, 32, 5, C.stein], ['r', 24, 5, 5, 5, C.marine], ['n', 10, 1, 12, 10, C.skog]] },
  'hva-bor-en-god-bedriftsnettside-inneholde': { idé: 'Tre deler: hvem dere er, hva dere tilbyr, neste steg',
    planes: [['r', 0, 2, 11, 12, C.marine], ['r', 10, 1, 11, 12, C.skog], ['n', 20, 0, 11, 13, C.dyp]] },
  'hvordan-fa-flere-henvendelser-fra-nettsiden': { idé: 'Flater som samles mot ett punkt – henvendelsen',
    planes: [['r', 0, 0, 14, 6, C.stein], ['r', 0, 8, 14, 6, C.marine], ['n', 12, 2, 18, 10, C.dyp]] },
};

const svg = (w, h, body, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">${body}</svg>\n`;
const draw = (planes, k) => planes.map(([t, x, y, w, h, f], i) => (t === 'n' ? notched : rect)(x * k, y * k, w * k, h * k, f, i)).join('');

const manifest = [];
for (const [name, c] of Object.entries(compositions)) {
  writeFileSync(`${out}${name}-desktop.svg`, svg(560, 640, draw(c.desktop, 20), `Cidea-motiv: ${c.idé}`));
  writeFileSync(`${out}${name}-mobil.svg`, svg(390, 280, draw(c.mobil, 10), `Cidea-motiv: ${c.idé}`));
  manifest.push({ name, idé: c.idé, dominant: c.dominant, filer: [`${name}-desktop.svg`, `${name}-mobil.svg`] });
}
for (const [slug, a] of Object.entries(articles)) {
  writeFileSync(`${out}artikkel-${slug}.svg`, svg(640, 280, draw(a.planes, 20), `Artikkelgrafikk: ${a.idé}`));
  manifest.push({ name: `artikkel-${slug}`, idé: a.idé, filer: [`artikkel-${slug}.svg`] });
}
writeFileSync(`${out}../manifest.json`, JSON.stringify(manifest, null, 2));
console.log(`skrev ${manifest.reduce((n, m) => n + m.filer.length, 0)} SVG-er`);
