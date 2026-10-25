// Korte opptak for før/etter-sammenligning: (1) kald innlasting med 4× CPU og ca. «rask 3G», (2) rask scroll forbi
// klippgrensen replikk 4 → restaurant og tilbake. Ved 1440×900 og 390×844. Kjør etter `npm run build`:
// node tests/for-etter-opptak.mjs <utmappe> <prefiks>  (sett sammen før/etter med ffmpeg hstack, se FILM.md)
import { chromium } from 'playwright';
import { serve } from './serve-dist.mjs';
import { renameSync, mkdirSync } from 'node:fs';
const [ut, prefiks] = process.argv.slice(2); mkdirSync(ut + '/tmp', { recursive: true });
const server = await serve(4204); const b = await chromium.launch();
const raf = p => p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
for (const [w, h, m] of [[1440, 900, false], [390, 844, true]]) {
  const opts = { viewport: { width: w, height: h }, ...(m ? { isMobile: true, hasTouch: true } : {}), recordVideo: { dir: ut + '/tmp', size: { width: w, height: h } } };
  // 1) kald innlasting: 4× CPU, ca. «rask 3G» (1,6 Mbit/s, 150 ms)
  { const c = await b.newContext(opts); const p = await c.newPage(); const cdp = await c.newCDPSession(p);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 });
    await p.goto('http://127.0.0.1:4204/konsept-scroll', { waitUntil: 'load' }); await p.waitForTimeout(2500);
    const v = await p.video().path(); await c.close(); renameSync(v, `${ut}/${prefiks}-kald-${w}.webm`); }
  // 2) rask scroll forbi klippgrensen (replikk 4 → restaurant) og tilbake
  { const c = await b.newContext(opts); const p = await c.newPage();
    await p.goto('http://127.0.0.1:4204/konsept-scroll', { waitUntil: 'networkidle' });
    await p.waitForFunction(() => document.querySelector('video').readyState === 4, null, { timeout: 15000 });
    const f = await p.evaluate(() => { const s = document.querySelector('.ks-film'); return { top: s.getBoundingClientRect().top + scrollY, len: s.offsetHeight - innerHeight }; });
    let y = 0; const til = async (q, n) => { const m = f.top + f.len * q; const fra = y; for (let i = 1; i <= n; i++) { y = fra + (m - fra) * i / n; await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(16); } };
    await til(.74, 40); await p.waitForTimeout(900);  // rolig inn til replikk 4
    await til(.90, 5); await p.waitForTimeout(1200);  // rask scroll forbi klippet
    await til(.74, 5); await p.waitForTimeout(1200);  // rask scroll tilbake
    const v = await p.video().path(); await c.close(); renameSync(v, `${ut}/${prefiks}-rask-${w}.webm`); }
}
await b.close(); server.close();
