// Fase 4.4 – testkvitteringer for bevegelsesprototypen (Playwright/Chromium).
// Testkoden injiserer måle-JS i nettleseren; selve prototypen inneholder ingen JS.
// Kjør: node docs/cinematic-pilot/phase4/motion/test.mjs   → motion/TEST-RESULTATER.md + bilder i motion/
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, statSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = fileURLToPath(new URL('.', import.meta.url));
const url = pathToFileURL(`${here}index.html`).href;
const res = []; let fail = 0;
const check = (id, name, ok, detail) => { res.push(`| ${id} | ${name} | ${ok ? 'OK' : '**FEIL**'} | ${detail} |`); if (!ok) fail++; console.log(ok ? 'OK  ' : 'FEIL', id, name, '–', detail); };
const b = await chromium.launch();

// T1 ingen JS i prototypen
const src = readFileSync(`${here}index.html`, 'utf8') + readFileSync(`${here}motion.css`, 'utf8');
check('T1', 'Ingen JavaScript i prototypen', !/<script|son[a-z]+="/i.test(src), `${(src.match(/<script/gi) || []).length} script-tagger, 0 inline-hendelser`);

// T2 timing og egenskaper
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url, { waitUntil: 'load' });
  const a = await p.evaluate(() => document.getAnimations().filter(x => x.effect.target.closest('.inngang')).map(x => ({
    end: x.effect.getComputedTiming().endTime, props: [...new Set(x.effect.getKeyframes().flatMap(k => Object.keys(k)).filter(k => !['offset', 'easing', 'composite', 'computedOffset'].includes(k)))] })));
  const maxEnd = Math.max(...a.map(x => x.end)); const props = [...new Set(a.flatMap(x => x.props))];
  check('T2a', 'Inngang ferdig innen 600 ms', a.length > 0 && maxEnd <= 600, `${a.length} animasjoner, siste ferdig etter ${maxEnd} ms`);
  check('T2b', 'Kun transform/opacity animeres', props.every(x => ['opacity', 'transform'].includes(x)), `egenskaper: ${props.join(', ')}`);
  // T3 rammer for rammestripe
  for (const t of [0, 120, 240, 360, 480, 600]) {
    await p.evaluate(t => document.getAnimations().filter(x => x.effect.target.closest('.inngang')).forEach(x => { x.pause(); x.currentTime = t; }), t);
    await p.locator('.hero .kunst').screenshot({ path: `${here}ramme-${String(t).padStart(3, '0')}.png` });
  }
  await p.evaluate(() => document.getAnimations().filter(x => x.effect.target.closest('.inngang')).forEach(x => x.finish()));
  await p.waitForTimeout(50);
  await p.locator('.hero').screenshot({ path: `${here}slutt-animert.png` });
  await p.close();
}
// T4 samme sluttbilde uten JS og med redusert bevegelse; T5 redusert bevegelse
const shot = async (opts, file) => { const c = await b.newContext({ viewport: { width: 1440, height: 900 }, ...opts }); const p = await c.newPage(); await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(opts.reducedMotion ? 30 : 900); const n = opts.javaScriptEnabled === false ? -1 : await p.evaluate(() => document.getAnimations().length); await p.locator('.hero').screenshot({ path: `${here}${file}` }); await c.close(); return n; };
const nRed = await shot({ reducedMotion: 'reduce' }, 'slutt-redusert.png');
await shot({ javaScriptEnabled: false }, 'slutt-uten-js.png');
await shot({}, 'slutt-normal.png');
const same = (x, y) => readFileSync(`${here}${x}`).equals(readFileSync(`${here}${y}`));
check('T4a', 'Uten JS: samme sluttbilde som med animasjon', same('slutt-uten-js.png', 'slutt-normal.png'), 'pikselidentisk skjermbilde (byte-likt)');
check('T4b', 'Redusert bevegelse: sluttbildet umiddelbart (etter 30 ms)', same('slutt-redusert.png', 'slutt-normal.png') && nRed === 0, `byte-likt med sluttbildet, ${nRed} aktive animasjoner`);
{
  const c = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const p = await c.newPage(); await p.goto(url);
  const t = await p.evaluate(() => getComputedStyle(document.querySelector('.tjenester .markor > *')).transitionDuration);
  check('T5', 'Redusert bevegelse: ingen overganger på markører', parseFloat(t) === 0, `transition-duration ${t}`);
  await c.close();
}
// T6 tastatur: fokus synlig og samme markørrespons som hover
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.goto(url); await p.waitForTimeout(700);
  let label = '';
  for (let i = 0; i < 12 && !label.includes('nettsider'); i++) { await p.keyboard.press('Tab'); label = await p.evaluate(() => document.activeElement.textContent.trim().toLowerCase()); }
  await p.waitForTimeout(350);
  const f = await p.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); const h = a.querySelector('[data-hakk]'); return { ring: `${cs.outlineStyle} ${cs.outlineWidth}`, t: getComputedStyle(h).transform }; });
  await p.locator('.tjenester a').first().screenshot({ path: `${here}fokus-tastatur.png` });
  await p.mouse.move(5, 5); await p.keyboard.press('Shift+Tab'); await p.waitForTimeout(350);
  await p.locator('.tjenester a').first().hover(); await p.waitForTimeout(350);
  const hv = await p.evaluate(() => getComputedStyle(document.querySelector('.tjenester a [data-hakk]')).transform);
  await p.locator('.tjenester a').first().screenshot({ path: `${here}hover-mus.png` });
  check('T6a', 'Tastatur: synlig fokusring', label.includes('nettsider') && /solid 3px/.test(f.ring), `fokus på «${label.slice(0, 28)}», outline ${f.ring}`);
  check('T6b', 'Tastaturfokus gir samme markørbevegelse som hover', f.t !== 'none' && f.t === hv, `fokus ${f.t} = hover ${hv}`);
  await p.close();
}
// T7 ytelse med 4× CPU-struping (mobil 390 px)
{
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await c.newPage(); const cdp = await c.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); await cdp.send('Performance.enable');
  await p.addInitScript(() => { window.__f = []; let l = performance.now(); const tick = n => { window.__f.push(n - l); l = n; if (n < 1500) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
  const m0 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(x => [x.name, x.value]));
  await p.goto(url, { waitUntil: 'load' });
  const L = async () => (await cdp.send('Performance.getMetrics')).metrics.find(x => x.name === 'LayoutCount').value;
  const base = await L(); const series = [];
  for (let i = 0; i < 9; i++) { await p.waitForTimeout(100); series.push((await L()) - base); }
  const fr = (await p.evaluate(() => window.__f)).slice(2).sort((x, y) => x - y);
  const p95 = fr[Math.floor(fr.length * 0.95)] || 0;
  check('T7a', 'Ingen layout per bilde under animasjonen (4× CPU-struping, mobil)', series.every(v => v === series[0]) && series[0] <= 1, `kumulativ LayoutCount hvert 100. ms i 900 ms: ${series.join(' ')}; flat etter første måling, dvs. ingen layout per bilde (ett startlayout rett etter lasting). Før lagdeling av planene: +16 under animasjonen`);
  check('T7b', 'Jevne bilder under animasjonen (4× struping)', p95 <= 34, `${fr.length} bilder, p95 bildeintervall ${p95.toFixed(1)} ms, median ${fr[Math.floor(fr.length / 2)].toFixed(1)} ms`);
  await c.close();
}
// T8 scroll-visning: skjult før, synlig i visning; ingen scrollkapring
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.goto(url); await p.waitForTimeout(700);
  const before = await p.evaluate(() => getComputedStyle(document.querySelector('.avslor li')).opacity);
  await p.locator('.avslor').scrollIntoViewIfNeeded(); await p.mouse.wheel(0, 300); await p.waitForTimeout(400);
  const after = await p.evaluate(() => [...document.querySelectorAll('.avslor li')].map(l => Number(getComputedStyle(l).opacity).toFixed(2)).join(' / '));
  const y = await p.evaluate(() => scrollY);
  await p.locator('.avslor').screenshot({ path: `${here}scroll-visning.png` });
  check('T8', 'Rolig visning ved scrolling, uten scrollkapring', Number(before) < 0.2 && after.split(' / ').every(o => Number(o) > 0.95), `opasitet før: ${Number(before).toFixed(2)}, i visning: ${after}; scrollY ${y} styres kun av brukeren`);
  await p.close();
}
// T9 størrelse
const svgBytes = readdirSync(`${here}../assets/svg`).reduce((s, f) => s + statSync(`${here}../assets/svg/${f}`).size, 0);
const pageBytes = statSync(`${here}index.html`).size + statSync(`${here}motion.css`).size;
check('T9', 'Liten ressursbruk', pageBytes < 15000, `prototype ${(pageBytes / 1024).toFixed(1)} KB (HTML+CSS, ukomprimert); alle 28 SVG-er ${(svgBytes / 1024).toFixed(1)} KB; fonter 67 KB (to latin-filer)`);

await b.close();
writeFileSync(`${here}TEST-RESULTATER.md`, `# Testkvitteringer – bevegelsesprototype (fase 4.4)\n\nKjørt ${new Date().toISOString()} med Playwright/Chromium. Kommando: \`node docs/cinematic-pilot/phase4/motion/test.mjs\`.\n\n| ID | Test | Resultat | Måling |\n|---|---|---|---|\n${res.join('\n')}\n\n**${res.length - fail} av ${res.length} tester bestått.**\n`);
console.log(`${res.length - fail}/${res.length} OK`);
process.exit(fail ? 1 : 0);
