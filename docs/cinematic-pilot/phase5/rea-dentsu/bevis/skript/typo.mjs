import { chromium } from 'playwright';
const b = await chromium.connectOverCDP('http://127.0.0.1:9222');
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h } }); const p = await c.newPage();
  await p.goto('https://www.dentsucreative.com/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  const rej = p.getByRole('button', { name: /reject all/i }); if (await rej.count()) await rej.first().click().catch(() => {});
  const r = await p.evaluate(() => {
    const pick = re => { const e = [...document.querySelectorAll('body *')].find(x => x.children.length === 0 && re.test(x.textContent.trim())); if (!e) return null; const cs = getComputedStyle(e); return { txt: e.textContent.trim().slice(0, 40), size: cs.fontSize, weight: cs.fontWeight, lh: cs.lineHeight, ls: cs.letterSpacing, tt: cs.textTransform, stroke: cs.webkitTextStroke || cs.getPropertyValue('-webkit-text-stroke'), color: cs.color, family: cs.fontFamily.split(',')[0] }; };
    return { wehelp: pick(/^We help/i), grow: pick(/^grow through/i), transf: pick(/^Transformative/i), latest: pick(/^Latest/i), services: pick(/^Our$|^Our services/i), invent: pick(/^Invent the/i), nav: pick(/^Work$/), brand: pick(/^Brand$/), dc: pick(/^Dentsu creative$/i) };
  });
  console.log(w, JSON.stringify(r, null, 0));
  await c.close();
}
await b.close();
