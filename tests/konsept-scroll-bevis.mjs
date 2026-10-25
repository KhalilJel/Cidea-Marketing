// Bevis for prototypen /konsept-scroll: fullsidebilder, scrollrammer (kontaktark) og skjermopptak.
// Kjør etter `npm run build`: node tests/konsept-scroll-bevis.mjs → docs/cinematic-pilot/phase5/konsept-scroll/bevis/
import { chromium } from 'playwright';
import { mkdirSync, readdirSync, renameSync, readFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { serve } from './serve-dist.mjs';

const ut = fileURLToPath(new URL('../docs/cinematic-pilot/phase5/konsept-scroll/bevis/', import.meta.url));
mkdirSync(ut, { recursive: true });
const server = await serve(4182); const url = 'http://127.0.0.1:4182/konsept-scroll';
const mobil = w => (w < 768 ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {});
const b = await chromium.launch();

// 1. Fullsidebilder av sluttilstanden (redusert bevegelse = statisk side, samme innhold som uten støtte)
for (const [w, h] of [[1440, 900], [768, 1024], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w), reducedMotion: 'reduce' }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `${ut}fullside-redusert-${w}.png`, fullPage: true }); await c.close();
}

// 2. Scrollrammer med bevegelse → kontaktark per bredde
for (const [w, h, kol, bredde] of [[1440, 900, 5, 280], [768, 1024, 7, 190], [390, 844, 9, 140]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  const total = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight); const rammer = [];
  for (let y = 0; ; y = Math.min(total, y + Math.round(h * .35))) {
    await p.evaluate(y => window.scrollTo(0, y), y); await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    rammer.push({ y, png: (await p.screenshot()).toString('base64') });
    if (y >= total) break;
  }
  const ark = await b.newPage({ viewport: { width: kol * (bredde + 6) + 6, height: 400 } });
  await ark.setContent(`<body style="margin:0;background:#222;color:#ddd;font:12px sans-serif;display:grid;grid-template-columns:repeat(${kol},${bredde}px);gap:6px;padding:6px">${rammer.map(r => `<figure style="margin:0"><img src="data:image/png;base64,${r.png}" style="width:${bredde}px;display:block"><figcaption>scrollY ${r.y}</figcaption></figure>`).join('')}</body>`);
  await ark.waitForLoadState('load'); await ark.screenshot({ path: `${ut}bevegelse-${w}.jpg`, type: 'jpeg', quality: 78, fullPage: true }); await ark.close();
  // utvalgte enkeltrammer i full oppløsning
  const valgt = { 0: 'start', 1: 'ordmerke-flyttet', 2: 'overgang-marine' };
  for (const [i, navn] of Object.entries(valgt)) if (rammer[i]) await import('node:fs').then(fs => fs.writeFileSync(`${ut}ramme-${w}-${i}-${navn}.png`, Buffer.from(rammer[i].png, 'base64')));
  await c.close();
}

// 3. Skjermopptak: ekte musehjul (1440) og ekte berøringssveip (390), ned og litt opp igjen
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const dir = `${ut}_video-${w}`; rmSync(dir, { recursive: true, force: true });
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w), recordVideo: { dir, size: w < 768 ? { width: 390, height: 844 } : { width: 1280, height: 800 } } });
  const p = await c.newPage(); await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  const total = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  if (w >= 768) {
    await p.mouse.move(w / 2, h / 2);
    for (let i = 0; i < 400 && (await p.evaluate(() => scrollY)) < total - 2; i++) { await p.mouse.wheel(0, 40); await p.waitForTimeout(30); }
    await p.waitForTimeout(700);
    for (let i = 0; i < 90; i++) { await p.mouse.wheel(0, -40); await p.waitForTimeout(30); }
  } else {
    const cdp = await c.newCDPSession(p);
    const sveip = async dy => { const x = 195, y0 = dy > 0 ? 650 : 250; await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: y0 }] }); for (let k = 1; k <= 12; k++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y0 - dy * k / 12 }] }); await p.waitForTimeout(16); } await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(450); };
    for (let i = 0; i < 60 && (await p.evaluate(() => scrollY)) < total - 2; i++) await sveip(260);
    await p.waitForTimeout(600);
    for (let i = 0; i < 6; i++) await sveip(-260);
  }
  await p.waitForTimeout(800); await c.close();
  const f = readdirSync(dir)[0]; renameSync(`${dir}/${f}`, `${ut}opptak-${w}.webm`); rmSync(dir, { recursive: true, force: true });
}
await b.close(); server.close();
console.log('bevis skrevet til', ut, readdirSync(ut).join(', '));
