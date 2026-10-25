// Bevis for /konsept-scroll (forløp etter eiers føring 2026-10-21): ett opptak ved 1440×900 (hjul) og ett ved 390×844
// (sveip): ett kort scrollforsøk starter filmen, deretter ingen innspill til filmen er ferdig, så vanlig scroll videre
// til «Bli sett / Bli valgt», H1 og tjenester. Kjør etter `npm run build`: node tests/film-bevis.mjs
// Playwright tar opp WebM; konverteres til MP4 (H.264) med ffmpeg for avspilling på telefon (se FILM.md).
import { chromium } from 'playwright';
import { mkdirSync, renameSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { serve } from './serve-dist.mjs';

const ut = fileURLToPath(new URL('../docs/cinematic-pilot/phase5/konsept-scroll/bevis/film/', import.meta.url));
const tmp = ut + 'tmp/'; mkdirSync(tmp, { recursive: true });
const server = await serve(4185); const b = await chromium.launch();
const ease = t => 1 - Math.pow(1 - t, 3);

for (const [navn, w, h, mobil] of [['1440', 1440, 900, false], ['390', 390, 844, true]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...(mobil ? { isMobile: true, hasTouch: true } : {}), recordVideo: { dir: tmp, size: { width: w, height: h } } });
  const p = await c.newPage();
  await p.goto('http://127.0.0.1:4185/konsept-scroll', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForFunction(() => document.querySelector('video').readyState === 4, null, { timeout: 15000 });
  await p.waitForTimeout(2000); // åpningen: hvit flate med CIDEA
  // Ett kort scrollforsøk: hjul på desktop, sveip (ekte berøringshendelser) på mobil
  if (mobil) {
    const cdp = await c.newCDPSession(p);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: 620 }] });
    for (let i = 1; i <= 5; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y: 620 - 24 * i }] }); await p.waitForTimeout(16); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else { await p.mouse.move(720, 450); await p.mouse.wheel(0, 120); }
  // Ingen innspill til filmen er ferdig
  await p.waitForFunction(() => document.querySelector('.ks-film').dataset.tilstand === 'ferdig', null, { timeout: 40000 });
  await p.waitForTimeout(1500); // siste bilde står
  // Vanlig scroll videre i rolig tempo
  const mål = await p.evaluate(() => document.querySelector('.ks-ord').getBoundingClientRect().top + scrollY + innerHeight * .9);
  let y = 0; const n = 70;
  for (let i = 1; i <= n; i++) { const ny = mål * ease(i / n); await p.mouse.wheel(0, ny - y); y = ny; await p.waitForTimeout(33); }
  await p.waitForTimeout(1800);
  const video = await p.video().path(); await c.close();
  const webm = `${tmp}opptak-${navn}.webm`; renameSync(video, webm);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', webm, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '28', '-preset', 'slow', '-movflags', '+faststart', '-an', `${ut}opptak-film-${navn}.mp4`]);
}
rmSync(tmp, { recursive: true, force: true });
await b.close(); server.close();
console.log('Opptak lagret i', ut);
