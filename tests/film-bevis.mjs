// Bevis for filmscenen på /konsept-scroll: korte opptak (fram og delvis tilbake) og ett skjermbilde per replikk,
// ved 1440×900 og 390×844. Kjør etter `npm run build`: node tests/film-bevis.mjs
import { chromium } from 'playwright';
import { mkdirSync, renameSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { serve } from './serve-dist.mjs';

const ut = fileURLToPath(new URL('../docs/cinematic-pilot/phase5/konsept-scroll/bevis/film/', import.meta.url));
const tmp = ut + 'tmp/'; mkdirSync(tmp, { recursive: true });
const server = await serve(4185); const b = await chromium.launch();
const midt = [.09, .26, .485, .715, .935];
for (const [navn, w, h, mobil, opptak] of [['1440', 1440, 900, false, { width: 960, height: 600 }], ['390', 390, 844, true, { width: 390, height: 844 }]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...(mobil ? { isMobile: true, hasTouch: true } : {}), recordVideo: { dir: tmp, size: opptak } });
  const p = await c.newPage();
  await p.goto('http://127.0.0.1:4185/konsept-scroll', { waitUntil: 'networkidle' });
  const f = await p.evaluate(() => { const s = document.querySelector('.ks-film'); return { top: s.getBoundingClientRect().top + scrollY, len: s.offsetHeight - innerHeight }; });
  await p.waitForFunction(() => document.querySelector('video').readyState === 4, null, { timeout: 15000 });
  // Opptak: fra like før filmen, jevn scroll gjennom hele filmscenen, så et stykke tilbake
  const scroll = async (fra, til, ms) => { const n = Math.round(ms / 33); for (let i = 1; i <= n; i++) { await p.evaluate(y => scrollTo(0, y), fra + (til - fra) * i / n); await p.waitForTimeout(33); } };
  await p.evaluate(y => scrollTo(0, y), f.top - h * .6); await p.waitForTimeout(600);
  await scroll(f.top - h * .6, f.top + f.len + h * .4, 14000);
  await p.waitForTimeout(400);
  await scroll(f.top + f.len + h * .4, f.top + f.len * .45, 4500);
  await p.waitForTimeout(600);
  const video = await p.video().path();
  for (const [i, q] of midt.entries()) {
    await p.evaluate(y => scrollTo(0, y), f.top + f.len * q);
    await p.waitForFunction(() => { const v = document.querySelector('video'); return v.readyState >= 2 && !v.seeking; });
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${ut}replikk-${i + 1}-${navn}.jpg`, type: 'jpeg', quality: 72 });
  }
  await c.close();
  renameSync(video, `${ut}opptak-film-${navn}.webm`); // konverteres til MP4 (H.264) med ffmpeg for avspilling på telefon
}
rmSync(tmp, { recursive: true, force: true });
await b.close(); server.close();
console.log('Bevis lagret i', ut);
