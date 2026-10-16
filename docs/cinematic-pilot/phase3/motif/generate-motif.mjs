// Cidea-motivet: genererer SVG-varianter fra én geometrisk regel (fase 3, utkast 2).
// Kilde: Stitch-skjermen «Tilnærming» (292e808f…), forenklet etter ChatGPT-review utkast 1, punkt 1.
//
// Regel:
//  1. Komposisjonen består av 2–4 aksejusterte, flate fargeplan på et rutenett (enhet u).
//  2. Planene overlapper hverandre og deler minst én kant- eller hjørnesone (de henger sammen).
//  3. Nøyaktig ÉN plan (det dominerende) har et 45°-hakk i nedre høyre hjørne.
//     Hakkets side = round(kortside / 6) – samme proporsjon i alle størrelser.
//     Hakket skal alltid være synlig: ingen plan tegnet etter hakkplanet kan dekke hakkhjørnet.
//  4. Ingen strek, ingen gradient, ingen sirkler, ingen tekst. Fargerekkefølge fra paletten.
//  5. Liten skala (markør/ikon): ett plan med hakk + ett støtteplan.
//
// Kjør: node docs/cinematic-pilot/phase3/motif/generate-motif.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('./svg/', import.meta.url));
mkdirSync(out, { recursive: true });

const C = { terrakotta: '#D84A26', dyp: '#AD2C07', marine: '#1E293B', skog: '#2D4A3E', svart: '#141619', stein: '#EEEFF4', lys: '#FAFAFD' };

const rect = (x, y, w, h, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
// Plan med 45°-hakk nede til høyre (regel 3).
const notched = (x, y, w, h, fill) => {
  const n = Math.round(Math.min(w, h) / 6);
  return `<polygon points="${x},${y} ${x + w},${y} ${x + w},${y + h - n} ${x + w - n},${y + h} ${x},${y + h}" fill="${fill}"/>`;
};
const svg = (w, h, body, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">${body}</svg>\n`;

// Hver variant: navn, størrelse, valgfri bakgrunn (bg = tjenestens fargefelt), plan [type, x, y, w, h, farge] i enheter (u = 20 px).
const u = 20;
const variants = [
  { name: 'hero-desktop', w: 460, h: 560, label: 'Cidea-motiv, hero', planes: [
    ['r', 1, 2, 17, 19, C.marine], ['n', 6, 6, 15, 18.5, C.dyp], ['r', 3, 12, 11, 13, C.skog], ['r', 9, 9, 7, 8, C.stein] ] },
  { name: 'hero-mobil', w: 390, h: 260, label: 'Cidea-motiv, hero mobil', planes: [
    ['r', 0, 1, 11, 11, C.marine], ['n', 6, 0, 13.5, 12, C.dyp], ['r', 3, 6, 8, 7, C.skog] ] },
  { name: 'tjeneste-nettsider', w: 120, h: 120, bg: C.marine, label: 'Motivmarkør Nettsider', planes: [
    ['r', 0, 2, 4, 4, C.terrakotta], ['n', 2, 0, 4, 4, C.lys] ] },
  { name: 'tjeneste-merkevare', w: 120, h: 120, bg: C.dyp, label: 'Motivmarkør Merkevarebygging', planes: [
    ['r', 0, 2, 4, 4, C.marine], ['n', 2, 0, 4, 4, C.lys] ] },
  { name: 'tjeneste-seo', w: 120, h: 120, bg: C.skog, label: 'Motivmarkør SEO', planes: [
    ['r', 0, 2, 4, 4, C.terrakotta], ['n', 2, 0, 4, 4, C.stein] ] },
  { name: 'tjeneste-digital', w: 120, h: 120, bg: C.svart, label: 'Motivmarkør Digital markedsføring', planes: [
    ['r', 0, 2, 4, 4, C.skog], ['n', 2, 0, 4, 4, C.lys] ] },
  { name: 'artikkel', w: 640, h: 280, label: 'Motiv for artikkel', planes: [
    ['r', 0, 3, 18, 11, C.stein], ['n', 14, 0, 18, 11, C.marine], ['r', 10, 6, 8, 8, C.terrakotta] ] },
  { name: 'konsept-kort', w: 400, h: 240, label: 'Motiv for konseptkort', planes: [
    ['r', 2, 2, 12, 9, C.terrakotta], ['r', 6, 7, 6, 3, C.lys], ['n', 10, 5, 8, 6, C.skog] ] },
  { name: '404', w: 460, h: 360, label: 'Motiv for 404-side', planes: [
    ['r', 1, 1, 9, 14, C.marine], ['r', 12, 3, 9, 13, C.skog], ['n', 6, 8, 10, 9, C.terrakotta] ] },
  { name: 'ikon-48', w: 48, h: 48, label: 'Cidea-motiv, ikonstørrelse', unit: 6, planes: [
    ['r', 0, 3, 5, 5, C.marine], ['n', 3, 0, 5, 5, C.dyp] ] },
];

for (const v of variants) {
  const k = v.unit || u;
  const body = (v.bg ? rect(0, 0, v.w, v.h, v.bg) : '') + v.planes.map(([t, x, y, w, h, f]) => (t === 'n' ? notched : rect)(x * k, y * k, w * k, h * k, f)).join('');
  const notches = v.planes.filter(p => p[0] === 'n').length;
  if (notches !== 1) throw new Error(`${v.name}: regel 3 brutt (${notches} hakk)`);
  // Regel 3: hakkhjørnet (nede til høyre på hakkplanet) må ikke dekkes av et senere plan.
  const i = v.planes.findIndex(p => p[0] === 'n'); const [, nx, ny, nw, nh] = v.planes[i];
  const cx = nx + nw - 0.01, cy = ny + nh - 0.01;
  for (const [, x, y, w, h] of v.planes.slice(i + 1)) if (cx > x && cx < x + w && cy > y && cy < y + h) throw new Error(`${v.name}: hakket er dekket`);
  writeFileSync(`${out}${v.name}.svg`, svg(v.w, v.h, body, v.label));
  console.log('skrev', v.name);
}
