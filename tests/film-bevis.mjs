// Bevis for /konsept-scroll (forløp etter eiers føring 2026-10-20): opptak av hele opplevelsen med naturlig scrolltempo
// (åpning → knappetrykk → film → «Bli sett / Bli valgt», H1 og tjenester) og skjermbilder av hvert steg,
// ved 1440×900 og 390×844. Kjør etter `npm run build`: node tests/film-bevis.mjs
// Playwright tar opp WebM; konverter til MP4 (H.264) med ffmpeg for avspilling på telefon (se FILM.md).
import { chromium } from 'playwright';
import { mkdirSync, renameSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { serve } from './serve-dist.mjs';

const ut = fileURLToPath(new URL('../docs/cinematic-pilot/phase5/konsept-scroll/bevis/film/', import.meta.url));
const tmp = ut + 'tmp/'; mkdirSync(tmp, { recursive: true });
const server = await serve(4185); const b = await chromium.launch();
const ease = t => 1 - Math.pow(1 - t, 3);
const raf = p => p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
const midt = [.1225, .28, .505, .74];

for (const [navn, w, h, mobil, rykk, rykkMs] of [['1440', 1440, 900, false, 360, 650], ['390', 390, 844, true, 420, 750]]) {
  // Opptak: naturlig tempo – rykk som ved hjul/sveip med myk utbremsing, pauser for lesing ved hver replikk
  const c = await b.newContext({ viewport: { width: w, height: h }, ...(mobil ? { isMobile: true, hasTouch: true } : {}), recordVideo: { dir: tmp, size: { width: w, height: h } } });
  const p = await c.newPage();
  await p.goto('http://127.0.0.1:4185/konsept-scroll', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForFunction(() => document.querySelector('video').readyState === 4, null, { timeout: 15000 });
  const m = await p.evaluate(() => { const f = document.querySelector('.ks-film'), o = document.querySelector('.ks-ord'); return { top: f.getBoundingClientRect().top + scrollY, len: f.offsetHeight - innerHeight, ord: o.getBoundingClientRect().top + scrollY }; });
  let y = 0;
  const glid = async (til, ms) => { const fra = y, n = Math.max(1, Math.round(ms / 33)); for (let i = 1; i <= n; i++) { y = fra + (til - fra) * ease(i / n); await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(33); } y = til; };
  await p.waitForTimeout(2500);                 // åpningen: hvit flate med CIDEA
  await glid(60, 300); await p.waitForTimeout(1600); // første scroll: knappetrykk og filmen åpnes
  const pauser = midt.map(q => m.top + m.len * q);
  const slutt = m.ord + h * 1.1;
  while (y < slutt - 1) {
    await glid(Math.min(slutt, y + rykk), rykkMs);
    await p.waitForTimeout(pauser.some(q => q > y - rykk && q <= y) ? 1300 : 350);
  }
  await p.waitForTimeout(2000);
  const video = await p.video().path(); await c.close();
  renameSync(video, `${ut}opptak-film-${navn}.webm`);

  // Skjermbilder: samme side, trinnvis scroll (store direkte hopp gir utdaterte bilder i headless-opptak)
  const p2 = await b.newPage({ viewport: { width: w, height: h }, ...(mobil ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}) });
  await p2.goto('http://127.0.0.1:4185/konsept-scroll', { waitUntil: 'networkidle' });
  await p2.waitForFunction(() => document.querySelector('video').readyState === 4, null, { timeout: 15000 });
  let y2 = 0;
  const steg = async (til, vent = 900) => { for (let i = 1; i <= 10; i++) { await p2.evaluate(v => scrollTo(0, v), y2 + (til - y2) * i / 10); await raf(p2); } y2 = til; await p2.waitForTimeout(vent); };
  const skudd = n => p2.screenshot({ path: `${ut}${navn}-${n}.jpg`, type: 'jpeg', quality: 76 });
  await skudd('1-apning');
  await p2.evaluate(() => scrollTo(0, 40)); y2 = 40; await p2.waitForTimeout(140); await skudd('2-knappetrykk');
  await p2.waitForTimeout(420); await skudd('3-filmen-apnes');
  await p2.waitForTimeout(900); await skudd('4-filmen-apen');
  for (const [i, q] of midt.entries()) { await steg(m.top + m.len * q); await skudd(`${5 + i}-replikk-${i + 1}`); }
  await steg(m.top + m.len * .95); await skudd('9-paret-uten-tekst');
  await steg(m.ord); await skudd('10-bli-sett-bli-valgt');
  await steg(m.ord + h * .55); await skudd('11-h1-og-tjenester');
  await p2.close();
}
rmSync(tmp, { recursive: true, force: true });
await b.close(); server.close();
console.log('Bevis lagret i', ut);
