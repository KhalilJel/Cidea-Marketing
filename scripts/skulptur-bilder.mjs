// Lager de statiske reservebildene av skulpturen (public/konsept/skulptur-desktop.webp og -mobil.webp) fra selve
// WebGL-rendereren, i åpningsstillingen (forløp 0, hviletid 0). Kjør etter `npm run build`: node scripts/skulptur-bilder.mjs
// Krever playwright (npm install --no-save playwright@1.56.1) og ffmpeg med libwebp.
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { serve } from '../tests/serve-dist.mjs';

const ut = new URL('../public/konsept/', import.meta.url).pathname; mkdirSync(ut, { recursive: true });
const server = await serve(4192);
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
for (const [navn, w, h, dpr, mobil] of [['desktop', 1440, 990, 1, false], ['mobil', 390, 844, 1.5, true]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, ...(mobil ? { isMobile: true, hasTouch: true } : {}) });
  // Fast tid (ingen hvilebevegelse) og full partikkelmengde for bildet.
  await p.addInitScript(() => { Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 }); const ekte = performance.now.bind(performance); performance.now = () => 0; window.__ekte = ekte; });
  await p.goto('http://127.0.0.1:4192/konsept-scroll', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.cm-topp, .kp-tekst, .kp-bilde { visibility: hidden !important; }' });
  await p.evaluate(() => dispatchEvent(new Event('resize')));
  await p.waitForTimeout(1500);
  const png = `${ut}${navn}.png`;
  await p.locator('.kp-ramme').screenshot({ path: png });
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', png, '-c:v', 'libwebp', '-quality', '55', '-compression_level', '6', `${ut}skulptur-${navn}.webp`]);
  rmSync(png); await p.close();
}
await b.close(); server.close();
console.log('Reservebilder lagret i', ut);
