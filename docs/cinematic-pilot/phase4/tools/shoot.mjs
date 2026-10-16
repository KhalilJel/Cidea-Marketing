// Skjermbilder av forhåndsvisninger i 1440 (viewport) og 390 (helside, 2×) + målinger.
// Bruk: node shoot.mjs <ut-mappe> <html> [...]   (krever playwright)
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { basename } from 'node:path';
const [outDir, ...files] = process.argv.slice(2);
const b = await chromium.launch();
const rows = [];
for (const f of files) {
  const name = basename(f, '.html');
  for (const [tag, vp, full, dpr] of [['1440', { width: 1440, height: 900 }, false, 1], ['390', { width: 390, height: 844 }, true, 2]]) {
    const p = await b.newPage({ viewport: vp, deviceScaleFactor: dpr });
    await p.goto(pathToFileURL(f).href, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const m = await p.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1: getComputedStyle(document.querySelector('h1')).fontFamily.split(',')[0].replace(/"/g, ''),
      body: getComputedStyle(document.querySelector('p')).fontFamily.split(',')[0].replace(/"/g, ''),
      fontsLoaded: [...document.fonts].filter(x => x.status === 'loaded').map(x => x.family).join('+'),
    }));
    await p.screenshot({ path: `${outDir}/${name}-${tag}.png`, fullPage: full });
    rows.push(`| ${name} | ${tag} | ${m.overflow} px | ${m.h1} / ${m.body} | ${m.fontsLoaded} |`);
    await p.close();
  }
}
await b.close();
console.log('| Side | Bredde | Overflow | H1 / tekst (computed) | Lastede fonter |\n|---|---|---|---|---|\n' + rows.join('\n'));
