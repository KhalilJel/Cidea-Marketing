// Phase 1 browser smoke test: renders every existing route on a running server
// (BASE_URL, default vite preview on 4173), fails on HTTP errors, browser errors or a
// missing H1, and saves screenshots at 390px and 1440px.
// Needs playwright (npm install --no-save playwright).
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const base = process.env.BASE_URL || 'http://127.0.0.1:4173';
const out = root + 'docs/cinematic-pilot/evidence/phase1/';
mkdirSync(out, { recursive: true });

const routes = ['/', '/websites', '/branding', '/seo', '/digital-marketing', '/blog', '/blog/hvor-mye-koster-en-nettside'];
const viewports = [{ w: 390, h: 844 }, { w: 1440, h: 900 }];
const results = [];
const browser = await chromium.launch();

for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
  const page = await ctx.newPage();
  for (const route of routes) {
    const errors = [];
    const onErr = e => errors.push(e.message);
    page.on('pageerror', onErr);
    const res = await page.goto(base + route, { waitUntil: 'networkidle' });
    const h1 = (await page.locator('h1').first().textContent({ timeout: 3000 }).catch(() => '')).trim();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    page.off('pageerror', onErr);
    const ok = !!res && res.ok() && !!h1 && errors.length === 0;
    results.push({ viewport: vp.w, route, status: res?.status(), h1, horizontalOverflowPx: overflow, errors, ok });
    console.log(`${ok ? 'PASS' : 'FAIL'} ${vp.w}px ${route} — HTTP ${res?.status()} — H1: "${h1}"${overflow > 0 ? ` — overflow ${overflow}px` : ''}${errors.length ? ' — ' + errors.join('; ') : ''}`);
    const name = (route === '/' ? 'home' : route.slice(1).replace(/\//g, '_')) + `-${vp.w}.png`;
    if (route === '/' || route === '/websites') await page.screenshot({ path: out + name, fullPage: true });
  }
  await ctx.close();
}
await browser.close();
writeFileSync(out + 'smoke-results.json', JSON.stringify({ base, date: new Date().toISOString(), results }, null, 2));
const failed = results.filter(r => !r.ok).length;
console.log(failed ? `${failed} route check(s) failed` : 'All route checks passed.');
process.exit(failed ? 1 : 0);
