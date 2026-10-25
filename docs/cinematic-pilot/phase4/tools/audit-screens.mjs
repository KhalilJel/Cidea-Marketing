// Måler visuelle svakheter i godkjente fase 3-skjermer (Stitch-HTML rendret i Chromium):
//  - rammede bokser: elementer ≥120×60 px med synlig ramme på alle fire sider
//  - hero-gjenbruk: fingeravtrykk av første SVG på siden (identisk geometri = samme bilde)
//  - mobil: horisontal overflow og høyde per seksjon (tunge kort)
// Bruk: node audit-screens.mjs <navn>=<html> ... (krever playwright)
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
const b = await chromium.launch();
const out = [];
for (const arg of process.argv.slice(2)) {
  const [name, html] = arg.split('=');
  const mobile = /-M$/.test(name);
  const p = await b.newPage({ viewport: { width: mobile ? 390 : 1440, height: 900 } });
  await p.goto(pathToFileURL(html).href, { waitUntil: 'networkidle', timeout: 60000 });
  const r = await p.evaluate(() => {
    let boxed = 0, whiteBoxed = 0;
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el); const rc = el.getBoundingClientRect();
      if (rc.width < 120 || rc.height < 60) continue;
      const sides = ['Top', 'Right', 'Bottom', 'Left'].every(s => parseFloat(cs['border' + s + 'Width']) >= 1 && !/rgba\(0, 0, 0, 0\)|transparent/.test(cs['border' + s + 'Color']));
      if (sides) { boxed++; if (/rgb\(255, 255, 255\)|rgb\(250, 250, 253\)|rgb\(244, 245, 248\)/.test(cs.backgroundColor)) whiteBoxed++; }
    }
    const svg = document.querySelector('main svg, section svg, svg');
    const geo = svg ? [...svg.querySelectorAll('rect,polygon')].map(e => e.getAttribute('points') || ['x', 'y', 'width', 'height'].map(a => e.getAttribute(a)).join(',')).join('|') : '';
    const sections = [...document.querySelectorAll('section')].map(s => Math.round(s.getBoundingClientRect().height));
    return { boxed, whiteBoxed, geo, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, sections, height: document.body.scrollHeight };
  });
  r.hero = r.geo ? createHash('sha1').update(r.geo).digest('hex').slice(0, 8) : '–';
  out.push({ name, ...r });
  await p.close();
}
await b.close();
const heroCount = out.reduce((m, r) => (m[r.hero] = (m[r.hero] || 0) + 1, m), {});
console.log('| Skjerm | Rammede bokser (hvite/lyse) | Hero-fingeravtrykk (antall sider med samme) | Overflow | Sidehøyde | Høyeste seksjon |\n|---|---|---|---|---|---|');
for (const r of out) console.log(`| ${r.name} | ${r.boxed} (${r.whiteBoxed}) | ${r.hero} (${heroCount[r.hero]}) | ${r.overflow} px | ${r.height} px | ${Math.max(0, ...r.sections)} px |`);
