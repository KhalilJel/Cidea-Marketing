// Fase 5 – revisjon etter phase5/CHATGPT-REVIEW.md: måler grafikk- og seksjonshøyder og tar fullsidebilder
// ved de berørte bredder. Kjør etter `npm run build`: node tests/nettbrett.mjs <før|etter>
// → docs/cinematic-pilot/phase5/screens/revisjon/<før|etter>-<bredde>.png og <før|etter>-maal.json
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { serve } from './serve-dist.mjs';

const runde = process.argv[2] === 'for' || process.argv[2] === 'før' ? 'for' : 'etter';
const ut = fileURLToPath(new URL('../docs/cinematic-pilot/phase5/screens/revisjon/', import.meta.url));
mkdirSync(ut, { recursive: true });
const server = await serve(4181); const base = 'http://127.0.0.1:4181';
const b = await chromium.launch();
const resultat = {};
for (const w of [320, 375, 390, 600, 768, 860, 1024, 1440]) {
  const c = await b.newContext({ viewport: { width: w, height: w < 768 ? 844 : 1024 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const p = await c.newPage(); await p.goto(base + '/', { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `${ut}${runde}-${w}.png`, fullPage: true });
  resultat[w] = await p.evaluate(() => {
    const boks = s => { const e = [...document.querySelectorAll(s)].find(x => x.getBoundingClientRect().height > 0); if (!e) return null; const r = e.getBoundingClientRect(); return { b: Math.round(r.width), h: Math.round(r.height) }; };
    const kolonner = s => new Set([...document.querySelectorAll(s)].map(e => Math.round(e.getBoundingClientRect().left))).size;
    return {
      side: document.documentElement.scrollHeight,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      rekkefolge: [...document.querySelectorAll('main > section, main > aside')].map(s => s.id || s.getAttribute('aria-labelledby') || s.className),
      seksjoner: Object.fromEntries([...document.querySelectorAll('main > section, main > aside')].map(s => [s.id || s.getAttribute('aria-labelledby') || s.className, Math.round(s.getBoundingClientRect().height)])),
      heroGrafikk: boks('.cm-hero-kunst .cm-motiv'),
      heroTekstBunn: Math.round(document.querySelector('.cm-handling').getBoundingClientRect().bottom + scrollY),
      konseptGrafikk: boks('.cm-konsept-kunst svg'),
      konseptFlate: boks('.cm-konsept-kunst'),
      tjenesteKolonner: kolonner('.cm-tjenester li'),
      stegKolonner: kolonner('.cm-steg li'),
      artikkelKolonner: kolonner('.cm-artikler li'),
    };
  });
  console.log(w, JSON.stringify(resultat[w]));
  await c.close();
}
await b.close(); server.close();
writeFileSync(`${ut}${runde}-maal.json`, JSON.stringify(resultat, null, 2) + '\n');
