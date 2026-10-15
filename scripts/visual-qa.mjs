// Browser QA for the design-system preview. Requires playwright + @axe-core/playwright
// (installed with --no-save in CI) and a running server: BASE_URL (default vite preview).
//   node scripts/visual-qa.mjs
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const base = process.env.BASE_URL || 'http://127.0.0.1:4173';
const shots = root + 'docs/design-system/screenshots/';
mkdirSync(shots, { recursive: true });

const viewports = [
  { name: '320', width: 320, height: 720 },
  { name: '375', width: 375, height: 812 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
];
const results = [];
let failed = 0;
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); if (!ok) failed++; console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`); };

const browser = await chromium.launch();

for (const vp of viewports) {
  const vpCtx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await vpCtx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(base + '/design-system.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  check(`${vp.name}px: no runtime errors`, errors.length === 0, errors.join('; '));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(`${vp.name}px: no horizontal scroll`, overflow <= 0, `overflow ${overflow}px`);
  const clipped = await page.evaluate(() => [...document.querySelectorAll('.ds h1, .ds h2, .ds h3, .ds p, .ds a, .ds-button')]
    .filter(el => el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== 'visible')
    .map(el => el.textContent.trim().slice(0, 40)));
  check(`${vp.name}px: no clipped text`, clipped.length === 0, clipped.join(' | '));
  const offscreen = await page.evaluate(() => [...document.querySelectorAll('.ds h1, .ds h2, .ds h3, .ds p, .ds-button')]
    .filter(el => { const r = el.getBoundingClientRect(); return r.width && (r.right > innerWidth + 1 || r.left < -1); })
    .map(el => el.textContent.trim().slice(0, 40)));
  check(`${vp.name}px: no text outside viewport`, offscreen.length === 0, offscreen.join(' | '));
  // Tight heading line-height lets descenders spill outside the box, so require a real gap
  // (≥ 0.2 × font size) between a heading and the element after it.
  const overlaps = await page.evaluate(() => [...document.querySelectorAll('.ds h1, .ds h2, .ds h3')]
    .filter(el => el.nextElementSibling)
    .filter(el => el.nextElementSibling.getBoundingClientRect().top - el.getBoundingClientRect().bottom < 0.2 * parseFloat(getComputedStyle(el).fontSize))
    .map(el => el.textContent.trim().slice(0, 40)));
  check(`${vp.name}px: headings clear of following text`, overlaps.length === 0, overlaps.join(' | '));
  const small = await page.evaluate(() => [...document.querySelectorAll('.ds-button, .ds-card__link')]
    .filter(el => el.getBoundingClientRect().height < 24).length);
  check(`${vp.name}px: target size ≥ 24px (WCAG 2.5.8)`, small === 0, `${small} too small`);

  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  check(`${vp.name}px: axe WCAG A/AA`, axe.violations.length === 0,
    axe.violations.map(v => `${v.id} (${v.nodes.length})`).join(', '));

  await page.screenshot({ path: `${shots}design-system-${vp.name}.png`, fullPage: true });
  await vpCtx.close();
}

// Fonts: self-hosted variable fonts load and are the first family actually used.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const fontRequests = [];
  page.on('request', r => { if (/\.woff2/.test(r.url())) fontRequests.push(r.url()); });
  await page.goto(base + '/design-system.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const fonts = await page.evaluate(() => ({
    manrope: document.fonts.check('700 32px "Manrope Variable"', 'Æøå'),
    inter: document.fonts.check('400 16px "Inter Variable"', 'Æøå'),
    loaded: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family),
  }));
  check('fonts: Manrope Variable loaded', fonts.manrope && fonts.loaded.includes('Manrope Variable'));
  check('fonts: Inter Variable loaded', fonts.inter && fonts.loaded.includes('Inter Variable'));
  check('fonts: no third-party font requests', fontRequests.every(u => u.startsWith(base)), fontRequests.filter(u => !u.startsWith(base)).join(', '));
  check('fonts: only Latin subsets fetched', fontRequests.every(u => /-latin-/.test(u)), fontRequests.map(u => u.split('/').pop()).join(', '));

  // Fallback: block fonts, page must still render and lay out without overflow.
  const ctx = await browser.newContext({ viewport: { width: 320, height: 720 } });
  await ctx.route(/\.woff2/, r => r.abort());
  const fb = await ctx.newPage();
  await fb.goto(base + '/design-system.html', { waitUntil: 'networkidle' });
  const fbOverflow = await fb.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('fonts: fallback stack renders at 320px without overflow', fbOverflow <= 0, `overflow ${fbOverflow}px`);
  await fb.screenshot({ path: `${shots}design-system-320-fallback-fonts.png`, fullPage: true });
  await ctx.close();

  // Keyboard focus: first Tab hits the skip link; following tab stops show a visible outline.
  await page.keyboard.press('Tab');
  const skip = await page.evaluate(() => document.activeElement.className);
  check('keyboard: first Tab focuses skip link', skip.includes('ds-skip'), skip);
  const noRing = [];
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      const s = getComputedStyle(el), after = getComputedStyle(el, '::after');
      const visible = (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2) ||
                      (after.outlineStyle !== 'none' && parseFloat(after.outlineWidth) >= 2);
      return { visible, label: el.textContent.trim().slice(0, 30) };
    });
    if (!info.visible) noRing.push(info.label);
  }
  check('keyboard: visible focus indicator on every tab stop', noRing.length === 0, noRing.join(' | '));
  await page.close();
}

// Reduced motion: transitions are effectively disabled.
{
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base + '/design-system.html', { waitUntil: 'networkidle' });
  const d = await page.evaluate(() => ['.ds-button', '.ds-card'].map(s => getComputedStyle(document.querySelector(s)).transitionDuration));
  check('reduced motion: transitions disabled', d.every(v => v.split(',').every(x => parseFloat(x) <= 0.00001)), d.join(' / '));
  await ctx.close();
}

// Regression: the existing site still renders.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const res = await page.goto(base + '/', { waitUntil: 'networkidle' });
  const h1 = await page.locator('h1').first().textContent().catch(() => '');
  check('regression: existing homepage renders', res.ok() && !!h1.trim() && errors.length === 0, errors.join('; '));
  await page.close();
}

await browser.close();
writeFileSync(root + 'docs/design-system/qa-results.json', JSON.stringify({ base, date: new Date().toISOString(), results }, null, 2));
console.log(failed ? `${failed} check(s) failed` : 'All browser checks passed.');
process.exit(failed ? 1 : 0);
