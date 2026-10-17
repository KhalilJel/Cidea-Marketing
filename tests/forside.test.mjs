// Fase 5 – tester mot den faktiske, byggede siden (dist/ servert med Netlify-regelen).
// Krav: `npm run build` først, og playwright tilgjengelig (CI: npm install --no-save playwright).
// Kjør: node tests/forside.test.mjs   → tests/RESULTAT.md + skjermbilder i tests/bilder/
import { chromium, firefox, webkit } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { serve } from './serve-dist.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
mkdirSync(`${here}bilder`, { recursive: true });
const server = await serve(4180);
const base = 'http://127.0.0.1:4180';
const res = []; let fail = 0;
const check = (id, navn, ok, mål) => { res.push(`| ${id} | ${navn} | ${ok ? 'OK' : '**FEIL**'} | ${mål} |`); if (!ok) fail++; console.log(ok ? 'OK  ' : 'FEIL', id, navn, '–', mål); };
const b = await chromium.launch();

// R: ruter, H1, nettleserfeil og hydreringsadvarsler
for (const [sti, h1Forvent] of [['/', 'Nettsider og helhetlig markedsføring som utvikles over tid.'], ['/kontakt', 'Ta kontakt for en uforpliktende fagprat.'], ['/websites'], ['/branding'], ['/seo'], ['/digital-marketing'], ['/blog'], ['/blog/hvor-mye-koster-en-nettside'], ['/personvern']]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const feil = [];
  p.on('pageerror', e => feil.push(e.message)); p.on('console', m => (m.type() === 'error' || /hydrat|did not match/i.test(m.text())) && feil.push(m.text()));
  const r = await p.goto(base + sti, { waitUntil: 'networkidle' });
  const h1 = (await p.locator('h1').first().textContent().catch(() => '')).trim();
  const forside = await p.evaluate(() => !!document.querySelector('.cm'));
  check(`R ${sti}`, 'Rute rendres uten feil', r.status() === 200 && h1 && feil.length === 0 && (!h1Forvent || h1 === h1Forvent) && (h1Forvent ? forside : !forside), `HTTP ${r.status()}, H1 «${h1.slice(0, 40)}», ${h1Forvent ? 'ny side' : 'gammel side'}, feil: ${feil.length ? feil.join('; ').slice(0, 120) : 'ingen'}`);
  await p.close();
}

// N: uten JavaScript – forhåndsrendret innhold er synlig og lenkene virker
for (const [sti, bredde] of [['/', 1440], ['/', 390], ['/kontakt', 390]]) {
  const c = await b.newContext({ javaScriptEnabled: false, viewport: { width: bredde, height: 900 } }); const p = await c.newPage();
  await p.goto(base + sti, { waitUntil: 'load' });
  const r = await p.evaluate(() => ({ h: [...document.querySelectorAll('h1,h2')].map(x => x.textContent.trim()), menyLenker: [...document.querySelectorAll('.cm-meny a')].filter(a => a.getBoundingClientRect().height > 0).length, knapp: getComputedStyle(document.querySelector('.cm-menyknapp')).display, tekst: document.body.innerText.length }));
  await p.screenshot({ path: `${here}bilder/uten-js${sti === '/' ? '-forside' : sti.replace('/', '-')}-${bredde}.png`, fullPage: true });
  check(`N ${sti} ${bredde}`, 'Uten JavaScript: innhold og navigasjon synlig', r.h.length >= (sti === '/' ? 6 : 2) && r.menyLenker >= 6 && r.knapp === 'none' && r.tekst > 300, `${r.h.length} overskrifter (${r.h.slice(0, 3).join(' · ').slice(0, 70)} …), ${r.menyLenker} synlige menylenker, menyknapp ${r.knapp}, ${r.tekst} tegn tekst`);
  await c.close();
}

// M: bevegelse i den faktiske React-siden
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.goto(base + '/', { waitUntil: 'load' });
  const a = await p.evaluate(() => document.getAnimations().filter(x => x.effect.target.closest('.cm-inngang')).map(x => ({ end: x.effect.getComputedTiming().endTime, props: [...new Set(x.effect.getKeyframes().flatMap(k => Object.keys(k)).filter(k => !['offset', 'easing', 'composite', 'computedOffset'].includes(k)))] })));
  const synlige = a.length; const maxEnd = Math.max(...a.map(x => x.end)); const props = [...new Set(a.flatMap(x => x.props))];
  check('M1', 'Inngang ≤ 600 ms, én gang', synlige > 0 && maxEnd <= 600, `${synlige} animasjoner (desktop- og mobilmotiv), siste ferdig etter ${maxEnd} ms; ingen iterasjoner`);
  check('M2', 'Kun transform/opacity', props.every(x => ['opacity', 'transform'].includes(x)), props.join(', '));
  await p.waitForTimeout(800);
  // hover = fokus på tjenestemarkør
  await p.locator('.cm-tjenester a').first().hover(); await p.waitForTimeout(350);
  const hv = await p.evaluate(() => getComputedStyle(document.querySelector('.cm-tjenester a .cm-markor g[data-hakk]')).transform);
  await p.mouse.move(2, 2); await p.waitForTimeout(350);
  await p.locator('.cm-tjenester a').first().focus(); await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab'); await p.waitForTimeout(350);
  const fo = await p.evaluate(() => ({ t: getComputedStyle(document.querySelector('.cm-tjenester a .cm-markor g[data-hakk]')).transform, ring: getComputedStyle(document.activeElement).outlineStyle + ' ' + getComputedStyle(document.activeElement).outlineWidth }));
  await p.locator('.cm-tjenester li').first().screenshot({ path: `${here}bilder/fokus-tjeneste.png` });
  check('M3', 'Hover og tastaturfokus gir samme markørbevegelse', hv !== 'none' && hv === fo.t && /solid 3px/.test(fo.ring), `hover ${hv}, fokus ${fo.t}, fokusring ${fo.ring}`);
  // scroll-visning i Chromium
  const før = await p.evaluate(() => getComputedStyle(document.querySelector('.cm-artikler li')).opacity);
  await p.locator('.cm-artikler').scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
  const etter = await p.evaluate(() => [...document.querySelectorAll('.cm-artikler li')].map(l => Number(getComputedStyle(l).opacity).toFixed(2)).join('/'));
  check('M4', 'Scroll-visning: kort synlige i visning, ingen scrollkapring', Number(før) < 0.2 && etter.split('/').every(o => Number(o) > 0.95), `opasitet før ${Number(før).toFixed(2)}, i visning ${etter}`);
  await p.close();
}
{
  const c = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const p = await c.newPage(); await p.goto(base + '/', { waitUntil: 'load' }); await p.waitForTimeout(30);
  const r = await p.evaluate(() => ({ n: document.getAnimations().length, op: [...document.querySelectorAll('.cm-motiv > svg, .cm-artikler li')].every(e => getComputedStyle(e).opacity === '1'), tr: getComputedStyle(document.querySelector('.cm-markor g')).transitionDuration }));
  check('M5', 'Redusert bevegelse: sluttbildet umiddelbart', r.n === 0 && r.op && parseFloat(r.tr) === 0, `${r.n} animasjoner etter 30 ms, alle plan og kort opasitet 1: ${r.op}, overgang ${r.tr}`);
  await c.close();
}
// F: andre motorer (faktisk Firefox og WebKit). Uten view()-støtte skal artiklene være synlige
// uten scrolling (fallback); med støtte (WebKit 26) skal de bli synlige når de scrolles inn.
for (const t of [firefox, webkit]) {
  const bb = await t.launch(); const p = await bb.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(base + '/', { waitUntil: 'load' }); await p.waitForTimeout(800);
  const les = () => p.evaluate(() => ({ stotte: CSS.supports('animation-timeline: view()'), op: [...document.querySelectorAll('.cm-artikler li')].map(l => Number(getComputedStyle(l).opacity).toFixed(2)).join('/'), motiv: [...document.querySelectorAll('.cm-kun-desktop > svg')].map(s => getComputedStyle(s).opacity).join('/') }));
  const r = await les();
  await p.locator('.cm-artikler').scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
  const r2 = await les();
  const synlig = s => s.split('/').every(o => Number(o) > 0.95);
  const ok = r.motiv.split('/').every(o => o === '1') && (r.stotte ? synlig(r2.op) : synlig(r.op) && synlig(r2.op));
  check(`F ${t.name()}`, r.stotte ? 'Med view()-støtte: artikler synlige i visning' : 'Uten view()-støtte: artikler synlige uten scrolling', ok, `animation-timeline støttet: ${r.stotte}; artikler før scroll ${r.op}, i visning ${r2.op}; heroplan ${r.motiv}`);
  await bb.close();
}
// P: ytelse mobil, 4× CPU-struping
{
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); const p = await c.newPage(); const cdp = await c.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); await cdp.send('Performance.enable');
  await p.addInitScript(() => { window.__f = []; let l = performance.now(); const t = n => { window.__f.push(n - l); l = n; if (n < 1500) requestAnimationFrame(t); }; requestAnimationFrame(t); });
  await p.goto(base + '/', { waitUntil: 'load' });
  const L = async () => (await cdp.send('Performance.getMetrics')).metrics.find(x => x.name === 'LayoutCount').value;
  const b0 = await L(); const serie = []; for (let i = 0; i < 9; i++) { await p.waitForTimeout(100); serie.push((await L()) - b0); }
  const fr = (await p.evaluate(() => window.__f)).slice(2).sort((x, y) => x - y); const p95 = fr[Math.floor(fr.length * .95)] || 0;
  check('P1', 'Ingen layout per bilde under inngangen (4× struping, mobil)', serie.every(v => v === serie[0]) && serie[0] <= 2, `kumulativ LayoutCount hvert 100. ms: ${serie.join(' ')}`);
  check('P2', 'Jevne bilder (4× struping)', p95 <= 34, `${fr.length} bilder, p95 ${p95.toFixed(1)} ms, median ${(fr[Math.floor(fr.length / 2)] || 0).toFixed(1)} ms`);
  await c.close();
}
// O: overflow ved fem bredder
for (const w of [320, 375, 390, 768, 1440]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } }); await p.goto(base + '/', { waitUntil: 'networkidle' });
  const o = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(`O ${w}`, 'Ingen horisontal overflow', o <= 0, `${o} px`); await p.close();
}

await b.close(); server.close();
writeFileSync(`${here}RESULTAT.md`, `# Testresultat – fase 5 (faktisk side)\n\nKjørt ${new Date().toISOString()} mot \`dist/\` servert med Netlify-regelen (\`tests/serve-dist.mjs\`). Chromium (Playwright), Firefox 142 og WebKit 26 for fallback.\n\n| ID | Test | Resultat | Måling |\n|---|---|---|---|\n${res.join('\n')}\n\n**${res.length - fail} av ${res.length} bestått.**\n`);
console.log(`${res.length - fail}/${res.length} OK`);
process.exit(fail ? 1 : 0);
