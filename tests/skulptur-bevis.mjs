// Bevis for /konsept-scroll «Vi gir ideer form»: skjermbilder av start, utfoldet form, bånd og tjenesteinngang ved
// 1440×900 og 390×844, og korte opptak (scroll ned gjennom forløpet og tilbake opp). Kjør etter `npm run build`:
// node tests/skulptur-bevis.mjs. WebGL kjøres med programvarerendering i skymiljøet, så tegnetakten i opptakene er
// lavere enn på en vanlig GPU.
import { chromium } from 'playwright';
import { mkdirSync, renameSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { serve } from './serve-dist.mjs';

const ut = fileURLToPath(new URL('../docs/cinematic-pilot/phase5/konsept-scroll/bevis/skulptur/', import.meta.url));
const tmp = ut + 'tmp/'; mkdirSync(tmp, { recursive: true });
const server = await serve(4186);
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const url = 'http://127.0.0.1:4186/konsept-scroll';
const ease = t => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

for (const [navn, w, h, mobil] of [['1440', 1440, 900, false], ['390', 390, 844, true]]) {
  // Skjermbilder
  const p = await b.newPage({ viewport: { width: w, height: h }, ...(mobil ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}) });
  await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
  const R = await p.evaluate(() => document.querySelector('.kp-scene').offsetHeight - innerHeight);
  let y = 0;
  const gå = async mål => { for (let i = 1; i <= 8; i++) { await p.evaluate(v => scrollTo(0, v), y + (mål - y) * i / 8); await p.waitForTimeout(60); } y = mål; await p.waitForTimeout(1200); };
  const skudd = n => p.screenshot({ path: `${ut}${navn}-${n}.jpg`, type: 'jpeg', quality: 84 });
  await skudd('1-start');
  await gå(R * .5); await skudd('2-utfoldet');
  await gå(R * .93); await skudd('3-band');
  await gå(R + h * .55); await skudd('4-tjenesteinngang');
  await p.close();
  // Opptak: ned gjennom forløpet i rolig tempo, kort stans, og tilbake opp
  const c = await b.newContext({ viewport: { width: w, height: h }, ...(mobil ? { isMobile: true, hasTouch: true } : {}), recordVideo: { dir: tmp, size: { width: w, height: h } } });
  const q = await c.newPage();
  await q.goto(url, { waitUntil: 'networkidle' }); await q.evaluate(() => document.fonts.ready); await q.waitForTimeout(2200);
  const glid = async (fra, til, ms) => { const n = Math.round(ms / 40); for (let i = 1; i <= n; i++) { await q.evaluate(v => scrollTo(0, v), fra + (til - fra) * ease(i / n)); await q.waitForTimeout(40); } };
  const slutt = R + h * .75;
  await glid(0, R * .55, 2600); await q.waitForTimeout(700);
  await glid(R * .55, R * .95, 2000); await q.waitForTimeout(900);
  await glid(R * .95, slutt, 1600); await q.waitForTimeout(1000);
  await glid(slutt, 0, 3200); await q.waitForTimeout(1500);
  const video = await q.video().path(); await c.close();
  const webm = `${tmp}${navn}.webm`; renameSync(video, webm);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', webm, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '27', '-preset', 'slow', '-movflags', '+faststart', '-an', `${ut}opptak-${navn}.mp4`]);
}
rmSync(tmp, { recursive: true, force: true });
await b.close(); server.close();
console.log('Bevis lagret i', ut);
