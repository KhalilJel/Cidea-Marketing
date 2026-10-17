// node observe.mjs <url> <label> <width> <height> <mobile 0|1> <reduced 0|1> <video 0|1> [maxSteps]
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readdirSync, renameSync } from 'node:fs';
const [url, label, W, H, mob, red, vid, maxS = '30'] = process.argv.slice(2);
const dir = `out/${label}`; mkdirSync(dir, { recursive: true });
const b = await chromium.connectOverCDP('http://127.0.0.1:9222');
const opts = { viewport: { width: +W, height: +H }, reducedMotion: red === '1' ? 'reduce' : 'no-preference' };
if (mob === '1') Object.assign(opts, { isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: undefined });
if (vid === '1') opts.recordVideo = { dir: `${dir}/video`, size: { width: Math.min(+W, 1280), height: Math.round(Math.min(+W, 1280) * +H / +W) } };
const c = await b.newContext(opts); const p = await c.newPage();
const t0 = Date.now(); const log = [];
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
// åpningssekvens: bilder ved faste tidspunkter før noen interaksjon
for (const ms of [300, 900, 1600, 2500, 4000]) { await p.waitForTimeout(ms - (Date.now() - t0) > 0 ? ms - (Date.now() - t0) : 0); await p.screenshot({ path: `${dir}/aapning-${String(ms).padStart(4, '0')}ms.png` }); }
const rej = p.getByRole('button', { name: /reject all/i }); if (await rej.count()) { await rej.first().click().catch(() => {}); await p.waitForTimeout(700); }
const measure = () => p.evaluate(() => {
  const vh = innerHeight; const vis = [...document.querySelectorAll('[class*="_"]')].filter(e => { const r = e.getBoundingClientRect(); return r.top < vh * .5 && r.bottom > vh * .5 && r.width > innerWidth * .8; }).map(e => (e.getAttribute('class') || '').split(' ')[0].replace(/__\w+$/, '')).slice(-3);
  const vids = [...document.querySelectorAll('video')].filter(v => { const r = v.getBoundingClientRect(); return r.bottom > 0 && r.top < vh; }).map(v => ({ src: (v.currentSrc || '').split('/').pop().slice(0, 50), paused: v.paused, t: +v.currentTime.toFixed(2), loop: v.loop, autoplay: v.autoplay, muted: v.muted }));
  const pinned = [...document.querySelectorAll('.pin-spacer > *')].map(e => ({ cls: (e.getAttribute('class') || '').split(' ')[0].slice(0, 40), top: Math.round(e.getBoundingClientRect().top), pos: getComputedStyle(e).position, tf: getComputedStyle(e).transform.slice(0, 40) }));
  const content = document.querySelector('.scroll-content, #smooth-content, .ScrollSmoother-content');
  const ty = content ? -Math.round(new DOMMatrix(getComputedStyle(content).transform).m42) : 0;
  return { y: Math.round(scrollY) + ty, ty, docH: document.documentElement.scrollHeight, bodyH: document.body.scrollHeight, contentTf: content ? getComputedStyle(content).transform.slice(0, 60) : null, vis, vids, canvas: [...document.querySelectorAll('canvas')].filter(cv => { const r = cv.getBoundingClientRect(); return r.bottom > 0 && r.top < vh && r.width > 50; }).length, lottie: document.querySelectorAll('svg[preserveAspectRatio] g[clip-path]').length, pinned, anims: document.getAnimations().length };
});
log.push({ step: 0, ...(await measure()) });
await p.screenshot({ path: `${dir}/steg-00.png` });
const N = +maxS; let last = -1, same = 0;
for (let i = 1; i <= N; i++) {
  if (mob === '1') { const cdp = await c.newCDPSession(p); const x = Math.round(+W / 2), y0 = Math.round(+H * .8); await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: y0 }] }); for (let k = 1; k <= 10; k++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y0 - k * Math.round(+H * .03) }] }); await p.waitForTimeout(30); } await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await cdp.detach(); } else { for (let k = 0; k < 5; k++) { await p.mouse.wheel(0, 100); await p.waitForTimeout(40); } }
  await p.waitForTimeout(1100);
  const m = await measure(); log.push({ step: i, ...m });
  await p.screenshot({ path: `${dir}/steg-${String(i).padStart(2, '0')}.png` });
  if (m.y === last) { if (++same >= 2) break; } else same = 0; last = m.y;
}
// tilbake opp: sjekk om bevegelsen spilles baklengs
if (mob !== '1') { for (let k = 0; k < 10; k++) { await p.mouse.wheel(0, -100); await p.waitForTimeout(40); } await p.waitForTimeout(1100); await p.screenshot({ path: `${dir}/tilbake.png` }); log.push({ step: 'tilbake', ...(await measure()) }); }
writeFileSync(`${dir}/logg.json`, JSON.stringify(log, null, 1));
await c.close();
if (vid === '1') { const f = readdirSync(`${dir}/video`)[0]; if (f) renameSync(`${dir}/video/${f}`, `${dir}/video/opptak.webm`); }
await b.close();
console.log(label, 'steg:', log.length - 1, 'maks y:', Math.max(...log.map(l => l.y)), 'docH:', log.at(-1).docH);
for (const l of log) console.log(l.step, l.y, l.contentTf, JSON.stringify(l.vis), 'vid', JSON.stringify(l.vids), 'cv', l.canvas, 'pin', JSON.stringify(l.pinned.map(x => x.top + ':' + x.pos)));
