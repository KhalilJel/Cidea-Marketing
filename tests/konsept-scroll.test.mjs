// Fase 5 – tester for prototypen /konsept-scroll «Vi gir ideer form» (partikkelskulptur i WebGL, vanlig scroll).
// Kjør etter `npm run build`: node tests/konsept-scroll.test.mjs → tests/KONSEPT-SCROLL-RESULTAT.md
// WebGL kjøres med programvarerendering (SwiftShader) i skymiljøet; tegnetakt her sier lite om en ekte GPU.
// Den tidligere filmversjonen har egne tester i tests/arkiv/.
import { chromium, firefox, webkit } from 'playwright';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { serve } from './serve-dist.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const server = await serve(4181);
const url = 'http://127.0.0.1:4181/konsept-scroll';
const res = []; let fail = 0; let ikkeKjort = 0;
const check = (id, navn, ok, mål) => { res.push(`| ${id} | ${navn} | ${ok ? 'OK' : '**FEIL**'} | ${mål} |`); if (!ok) fail++; console.log(ok ? 'OK  ' : 'FEIL', id, navn, '–', mål); };
const mobil = w => (w < 768 ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {});
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const frame = p => p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
const til = async (p, y) => { await p.evaluate(y => window.scrollTo(0, y), y); await frame(p); };
const reise = p => p.evaluate(() => { const s = document.querySelector('.kp-scene'); return s.offsetHeight - innerHeight; });
const scene = p => p.evaluate(() => { const s = document.querySelector('.kp-scene'); return { apne: +s.dataset.apne, band: +s.dataset.band, forlop: +s.dataset.forlop, tekst: s.dataset.tekst, render: s.dataset.render, aktiv: s.classList.contains('kp-aktiv'), statisk: s.classList.contains('kp-statisk') }; });
// Andel ikke-hvite piksler i et område av skjermen (partikler er blå; bakgrunnen er hvit).
const farget = async (p, boks) => {
  const png = await p.screenshot({ clip: boks });
  return p.evaluate(async b64 => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data; let n = 0, f = 0;
    for (let i = 0; i < d.length; i += 4) { n++; if (d[i + 2] - d[i] > 30) f++; } // blått: B tydelig over R
    return f / n;
  }, png.toString('base64'));
};
const ny = async (w, h, ekstra = {}) => { const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w), ...ekstra }); const p = await c.newPage(); return { c, p }; };

// K1: rute, metadata, tekst, overskrifter og feil
{
  const { c, p } = await ny(1440, 900); const feil = [];
  p.on('pageerror', e => feil.push(e.message)); p.on('console', m => (m.type() === 'error' || /hydrat|did not match/i.test(m.text())) && feil.push(m.text()));
  const r = await p.goto(url, { waitUntil: 'networkidle' });
  const d = await p.evaluate(() => ({ h1: document.querySelector('h1')?.textContent.trim(), h1n: document.querySelectorAll('h1').length, ingress: document.querySelector('.kp-ingress')?.textContent.trim(), knapp: document.querySelector('.kp-tekst .kp-knapp')?.textContent.trim(), href: document.querySelector('.kp-tekst .kp-knapp')?.getAttribute('href'), robots: document.querySelector('meta[name=robots]')?.content, hs: [...document.querySelectorAll('main h1, main h2, main h3')].map(h => +h.tagName[1]), tjenester: [...document.querySelectorAll('.kp-tjenester h3')].map(h => h.textContent) }));
  const hopp = d.hs.some((n, i) => i > 0 && n > d.hs[i - 1] + 1) || d.hs[0] !== 1;
  check('K1', 'Rute, tekst, noindex, overskriftsrekkefølge, ingen feil', r.status() === 200 && d.h1 === 'Vi gir ideer form.' && d.h1n === 1 && d.ingress === 'Nettsider, merkevarebygging, SEO og digital markedsføring.' && /^La oss snakke/.test(d.knapp) && d.href === '/kontakt' && /noindex/.test(d.robots) && !hopp && d.tjenester.length === 4 && feil.length === 0,
    `HTTP ${r.status()}, H1 «${d.h1}», ingress «${d.ingress}», knapp «${d.knapp}» → ${d.href}, robots «${d.robots}», overskrifter ${d.hs.map(n => 'h' + n).join(' ')}, tjenester ${d.tjenester.join(' · ')}, feil: ${feil.join('; ') || 'ingen'}`);
  await c.close();
}

// S1: ankomst – skulpturen er synlig fra første øyeblikk (stillbilde til første WebGL-bilde, deretter WebGL), tekst og
// knapp tilgjengelige, og ingen partikler over tekst eller meny
for (const [w, h] of [[1440, 900], [1280, 720], [390, 844], [768, 1024]]) {
  const { c, p } = await ny(w, h);
  await p.addInitScript(() => { window.__start = []; const t0 = performance.now(); const g = () => { const s = document.querySelector('.kp-scene'); if (s) { const img = document.querySelector('.kp-bilde img'); window.__start.push({ t: performance.now() - t0, bilde: !!img && img.complete && img.naturalWidth > 0 && getComputedStyle(document.querySelector('.kp-bilde')).visibility === 'visible', tegnet: s.classList.contains('kp-tegnet') }); } if (performance.now() - t0 < 2500) requestAnimationFrame(g); }; requestAnimationFrame(g); });
  await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
  const l = await p.evaluate(() => window.__start);
  const tom = l.filter(x => !x.bilde && !x.tegnet).length; // bilder der verken stillbilde eller WebGL viser formen
  const s = await scene(p);
  const bokser = await p.evaluate(() => { const r = e => { const q = document.querySelector(e).getBoundingClientRect(); return { x: Math.max(0, q.left), y: Math.max(0, q.top), width: Math.min(innerWidth, q.right) - Math.max(0, q.left), height: q.height }; }; return { tekst: r('.kp-tekst'), meny: r('.cm-topp') }; });
  // Teksten og menyen skjules for målingen; partikkelgrensen følger tekstfeltets plassering, ikke synligheten.
  await p.addStyleTag({ content: '.kp-tekst, .cm-topp { visibility: hidden !important; }' }); await p.waitForTimeout(300);
  const overTekst = await farget(p, bokser.tekst), overMeny = await farget(p, bokser.meny);
  const skulptur = await farget(p, { x: w < 768 || w / h <= 1 ? 0 : w * .55, y: w < 768 || w / h <= 1 ? h * .5 : 80, width: w < 768 || w / h <= 1 ? w : w * .45, height: w < 768 || w / h <= 1 ? h * .5 : h - 80 });
  check(`S1 ${w}×${h}`, 'Ankomst: skulpturen synlig fra start, tekst og knapp tilgjengelige, ingen partikler over tekst eller meny', s.aktiv && !s.statisk && tom <= 1 && skulptur > .04 && overTekst < .002 && overMeny < .002,
    `WebGL aktiv ${s.aktiv}; bilder uten form under innlastingen ${tom} av ${l.length}; blå andel i skulpturområdet ${(skulptur * 100).toFixed(1)} %, over tekstfeltet ${(overTekst * 100).toFixed(2)} %, over menyen ${(overMeny * 100).toFixed(2)} %`);
  await c.close();
}

// S2: forløpet – utfoldelse, tekst ut, bånd, øyeblikk uten tekst, båndet ut og tjenestene inn (desktop og mobil)
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const { c, p } = await ny(w, h);
  await p.goto(url, { waitUntil: 'networkidle' }); const R = await reise(p);
  const ut = [];
  for (const q of [0, .3, .55, .75, .95]) {
    for (let i = 1; i <= 4; i++) await til(p, await p.evaluate(() => scrollY) + (q * R - await p.evaluate(() => scrollY)) * i / 4);
    await p.waitForTimeout(900);
    const s = await scene(p); const t = await p.evaluate(() => { const e = document.querySelector('.kp-tekst'); return { o: +getComputedStyle(e).opacity, inert: e.hasAttribute('inert') }; });
    ut.push({ q, ...s, ...t });
  }
  await til(p, R + h * .7); await p.waitForTimeout(900);
  const tj = await p.evaluate(() => { const r = document.querySelector('.kp-tjenester h2').getBoundingClientRect(); return { inne: r.top < innerHeight && r.bottom > 0 }; });
  const sut = await p.evaluate(() => +document.querySelector('.kp-scene').dataset.forlop);
  const [a, b2, c2, d, e] = ut;
  const ok = a.apne < .05 && a.band < .05 && a.o > .99 && !a.inert && b2.apne > .3 && b2.o > .9 && c2.apne > .9 && d.band > .4 && d.o < .02 && d.inert && e.band > .97 && e.o < .02 && tj.inne;
  const m = ut.map(x => `${x.q}: åpne ${x.apne.toFixed(2)}, bånd ${x.band.toFixed(2)}, tekst ${x.o.toFixed(2)}${x.inert ? ' (inert)' : ''}`).join('; ');
  check(`S2 ${w}`, 'Forløp: utfoldelse → tekst ut → bånd → båndet alene → tjenester i vanlig flyt', ok, `aktiv reise ${R} px (${(R / h).toFixed(2)} skjermhøyder); ${m}; tjenester i bildet etter reisen ${tj.inne} (forløp ${sut})`);
  await c.close();
}

// S3: scroll fram og tilbake, også raske retningsendringer – ingen hopp i formen (største endring per bilde), og
// tilbake til toppen gir åpningsstillingen med tekst og knapp
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const { c, p } = await ny(w, h);
  await p.goto(url, { waitUntil: 'networkidle' }); const R = await reise(p);
  await p.evaluate(() => { window.__l = []; const s = document.querySelector('.kp-scene'); let f; const g = ts => { window.__l.push([+s.dataset.apne, +s.dataset.band, ts]); f = requestAnimationFrame(g); }; f = requestAnimationFrame(g); /* ts: bildets tidsstempel, som siden også bruker */ });
  const mønster = [.2, .5, .3, .8, .6, .95, .4, .7, .1, .9, 0];
  for (const q of mønster) { if (w < 768) { await p.evaluate(y => scrollTo(0, y), q * R); } else { await p.mouse.move(700, 450); await p.mouse.wheel(0, q * R - await p.evaluate(() => scrollY)); } await p.waitForTimeout(160); }
  await p.waitForTimeout(1200);
  const l = await p.evaluate(() => window.__l);
  // Fart: endring per sekund mellom to bilder (uavhengig av tegnetakten). Fartsgrensen i siden er 2,5/s.
  let maks = 0, maksBilde = 0; for (let i = 1; i < l.length; i++) { const d = Math.max(Math.abs(l[i][0] - l[i - 1][0]), Math.abs(l[i][1] - l[i - 1][1])), dt = Math.max(.008, (l[i][2] - l[i - 1][2]) / 1000); maksBilde = Math.max(maksBilde, d); maks = Math.max(maks, (d - .002) / Math.min(dt, .1)); }
  const slutt = await scene(p); const t = await p.evaluate(() => { const e = document.querySelector('.kp-tekst'); return { o: +getComputedStyle(e).opacity, inert: e.hasAttribute('inert') }; });
  check(`S3 ${w}`, 'Raske retningsendringer: formen følger uten hopp og reverserer helt', maks <= 2.6 && slutt.apne < .02 && slutt.band < .02 && t.o > .99 && !t.inert && l.length > 20,
    `${mønster.length} retningsendringer, ${l.length} bilder; største fart ${maks.toFixed(2)}/s (grense 2,5/s), største endring i ett bilde ${maksBilde.toFixed(3)} (utfoldelse/bånd, 0–1); tilbake øverst: åpne ${slutt.apne.toFixed(3)}, bånd ${slutt.band.toFixed(3)}, tekst ${t.o}, inert ${t.inert}`);
  await c.close();
}

// S4: hvilebevegelse – bildet endrer seg over tid uten scroll, men silhuetten holder seg (omriss endres lite)
{
  const { c, p } = await ny(1440, 900);
  await p.goto(url, { waitUntil: 'networkidle' }); await p.addStyleTag({ content: '.kp-tekst, .cm-topp { visibility: hidden !important; }' });
  const bilde = async () => p.evaluate(async b64 => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height; const x = cv.getContext('2d'); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, cv.width, cv.height).data; let x0 = 1e9, x1 = 0, y0 = 1e9, y1 = 0, n = 0, sum = 0;
    for (let y = 0; y < cv.height; y += 2) for (let xx = 0; xx < cv.width; xx += 2) { const i = (y * cv.width + xx) * 4; if (d[i + 2] - d[i] > 30) { n++; x0 = Math.min(x0, xx); x1 = Math.max(x1, xx); y0 = Math.min(y0, y); y1 = Math.max(y1, y); sum += d[i] * (xx + y); } }
    return { n, boks: [x0, y0, x1, y1], sum };
  }, (await p.screenshot()).toString('base64'));
  const a = await bilde(); await p.waitForTimeout(4000); const z = await bilde();
  const flytt = Math.max(...a.boks.map((v, i) => Math.abs(v - z.boks[i])));
  check('S4', 'Hvilebevegelse: bildet lever uten scroll, silhuetten holder seg', a.sum !== z.sum && flytt <= 40 && Math.abs(a.n - z.n) / a.n < .08,
    `endret bilde etter 4 s: ${a.sum !== z.sum}; omriss flyttet maks ${flytt} px; blå piksler ${a.n} → ${z.n}`);
  await c.close();
}

// S5: rendering stopper når scenen ikke er synlig, og starter igjen
{
  const { c, p } = await ny(1440, 900);
  await p.goto(url, { waitUntil: 'networkidle' });
  const tell = () => p.evaluate(() => new Promise(r => { const s = document.querySelector('.kp-scene'); let n = 0, sist = s.dataset.apne + s.dataset.band; const mo = new MutationObserver(() => n++); mo.observe(s, { attributes: true, attributeFilter: ['data-apne', 'data-band'] }); setTimeout(() => { mo.disconnect(); r(n); }, 1500); }));
  await til(p, 1e6); await p.waitForTimeout(1200); const av = await scene(p);
  // Under stillstand utenfor bildet skal ingen nye bilder tegnes: lerretets innhold endres ikke.
  const gl = await p.evaluate(() => { const g = document.querySelector('.kp-lerret'); return g.width + 'x' + g.height; });
  await til(p, 0); await p.waitForTimeout(900); const på = await scene(p);
  check('S5', 'Rendering stopper når scenen er ute av bildet og starter igjen', av.render === 'av' && på.render === 'på', `nederst på siden: render ${av.render}; tilbake øverst: render ${på.render}; lerret ${gl}`);
  await c.close();
}

// S6: ingen horisontal overflow gjennom hele scrollen
for (const [w, h] of [[320, 640], [375, 812], [390, 844], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]]) {
  const { c, p } = await ny(w, h);
  await p.goto(url, { waitUntil: 'networkidle' });
  const tot = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight); let maks = 0, n = 0;
  for (let y = 0; y <= tot; y += Math.round(h / 2)) { await til(p, y); maks = Math.max(maks, await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)); n++; }
  check(`S6 ${w}`, 'Ingen horisontal overflow', maks <= 0, `${maks} px i ${n} scrollposisjoner`);
  await c.close();
}

// S7: tastatur – knappen nås og har synlig fokus; når teksten er borte, fanges ikke fokus av den; menyen virker
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const { c, p } = await ny(w, h);
  await p.goto(url, { waitUntil: 'networkidle' }); const R = await reise(p);
  const rekke = [];
  for (let i = 0; i < 12; i++) { await p.keyboard.press('Tab'); const f = await p.evaluate(() => { const e = document.activeElement, r = e.getBoundingClientRect(), el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { t: e.textContent.trim().slice(0, 20), ring: getComputedStyle(e).outlineStyle !== 'none', udekket: !!el && (e.contains(el) || el === e) }; }); rekke.push(f); if (f.t.startsWith('La oss snakke')) break; }
  const knapp = rekke.at(-1);
  await p.evaluate(() => document.activeElement.blur());
  await til(p, R * .8); await p.waitForTimeout(500);
  const fokuserbar = await p.evaluate(() => { const k = document.querySelector('.kp-tekst .kp-knapp'); k.focus(); return document.activeElement === k; });
  const klikkbar = await p.evaluate(() => { const r = document.querySelector('.kp-tekst .kp-knapp').getBoundingClientRect(), el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!el?.closest('.kp-tekst'); });
  let meny = 'skrivebord';
  if (w < 768) { await p.click('.cm-menyknapp'); await p.waitForTimeout(200); meny = await p.evaluate(() => [...document.querySelectorAll('.cm-meny a')].filter(a => { const r = a.getBoundingClientRect(), el = document.elementFromPoint(r.left + 10, r.top + r.height / 2); return r.height > 0 && !!el && (a.contains(el) || el === a); }).length + ' synlige menylenker'); }
  check(`S7 ${w}`, 'Tastatur og meny: knappen nås med synlig fokus; usynlig tekst fanger ikke fokus eller klikk', knapp.t.startsWith('La oss snakke') && knapp.ring && knapp.udekket && !fokuserbar && !klikkbar && (w >= 768 || /^[4-9] /.test(meny)),
    `fokusrekke ${rekke.map(x => x.t).join(' · ')}; knappen fokusring ${knapp.ring}, udekket ${knapp.udekket}; ved 80 % av reisen: kan få fokus ${fokuserbar}, tar imot klikk ${klikkbar}; meny: ${meny}`);
  await c.close();
}

// S8: redusert bevegelse og uten JavaScript – rolig, statisk komposisjon og vanlig innholdsflyt
for (const [id, navn, opts] of [['S8', 'Redusert bevegelse: stillbilde og vanlig flyt, ingen WebGL', { reducedMotion: 'reduce' }], ['S9', 'Uten JavaScript: stillbilde, tekst og lenker', { javaScriptEnabled: false }]]) {
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const { c, p } = await ny(w, h, opts);
    await p.goto(url, { waitUntil: 'networkidle' });
    const r = await p.evaluate(() => { const img = document.querySelector('.kp-bilde img'); const synlig = e => { const q = e.getBoundingClientRect(), el = document.elementFromPoint(q.left + Math.min(20, q.width / 2), q.top + Math.min(12, q.height / 2)); return !!el && (e.contains(el) || el === e); };
      return { lerret: getComputedStyle(document.querySelector('.kp-lerret')).display, bilde: img.complete && img.naturalWidth > 0 && getComputedStyle(document.querySelector('.kp-bilde')).visibility === 'visible', h1: synlig(document.querySelector('h1')), knapp: synlig(document.querySelector('.kp-tekst .kp-knapp')), hoyde: +(document.querySelector('.kp-scene').offsetHeight / innerHeight).toFixed(2), anim: document.getAnimations().length }; });
    check(`${id} ${w}`, navn, r.lerret === 'none' && r.bilde && r.h1 && r.knapp && r.hoyde <= 1.05 && (id === 'S8' ? r.anim === 0 : true), `lerret ${r.lerret}, stillbilde ${r.bilde}, H1 ${r.h1}, knapp ${r.knapp}, scenen ${r.hoyde} skjermhøyder, animasjoner ${r.anim}`);
    await c.close();
  }
}

// S10: ingen WebGL, tapt WebGL-kontekst og blokkert hovedskript – statisk alternativ med fungerende tekst og lenker
for (const [id, navn, forbered, etter] of [
  ['S10', 'Ingen WebGL: statisk alternativ', p => p.addInitScript(() => { const ekte = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { return /webgl/.test(t) ? null : ekte.call(this, t, ...a); }; }), null],
  ['S11', 'Tapt WebGL-kontekst (renderfeil): statisk alternativ', null, p => p.evaluate(() => { const ext = document.createElement('canvas'); document.querySelector('.kp-lerret').getContext('webgl').getExtension('WEBGL_lose_context').loseContext(); })],
  ['S12', 'Hovedskript blokkert: statisk alternativ (reserve)', p => p.route(/\/assets\/index-[^/]*\.js$/, r => r.abort()), null],
]) {
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const { c, p } = await ny(w, h); const feil = []; p.on('pageerror', e => feil.push(e.message));
    if (forbered) await forbered(p);
    await p.goto(url, { waitUntil: 'networkidle' }); if (etter) { await etter(p); await p.waitForTimeout(400); }
    const r = await p.evaluate(() => { const img = document.querySelector('.kp-bilde img'), s = document.querySelector('.kp-scene'); const synlig = e => { const q = e.getBoundingClientRect(), el = document.elementFromPoint(q.left + Math.min(20, q.width / 2), q.top + Math.min(12, q.height / 2)); return !!el && (e.contains(el) || el === e); };
      return { statisk: s.classList.contains('kp-statisk') || document.documentElement.classList.contains('js-reserve'), lerret: getComputedStyle(document.querySelector('.kp-lerret')).display, bilde: img.complete && img.naturalWidth > 0 && getComputedStyle(document.querySelector('.kp-bilde')).visibility === 'visible', knapp: synlig(document.querySelector('.kp-tekst .kp-knapp')), hoyde: +(s.offsetHeight / innerHeight).toFixed(2), inert: document.querySelector('.kp-tekst').hasAttribute('inert') }; });
    await til(p, 1e6); const bunn = await p.evaluate(() => scrollY > 0);
    check(`${id} ${w}`, navn, r.statisk && r.lerret === 'none' && r.bilde && r.knapp && !r.inert && r.hoyde <= 1.05 && bunn, `statisk ${r.statisk}, lerret ${r.lerret}, stillbilde ${r.bilde}, knapp synlig ${r.knapp}, scenen ${r.hoyde} skjermhøyder, siden kan scrolles ${bunn}${feil.length ? ', sidefeil: ' + feil.join('; ').slice(0, 120) : ''}`);
    await c.close();
  }
}

// S13: kontrast for tekst og knapper (hvit flate og blå avslutning)
for (const w of [1440, 390]) {
  const { c, p } = await ny(w, 900, { reducedMotion: 'reduce' });
  await p.goto(url, { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => {
    const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
    const lum = ({ r, g, b }) => [r, g, b].map(x => x / 255).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4).reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
    const bgOf = el => { for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0.9) return c; } return { r: 255, g: 255, b: 255 }; };
    let n = 0, min = 99; const fails = [];
    for (const el of document.querySelectorAll('.kp *')) {
      if (![...el.childNodes].some(x => x.nodeType === 3 && x.textContent.trim().length > 1)) continue;
      const cs = getComputedStyle(el); if (!el.getBoundingClientRect().width) continue;
      const bg = bgOf(el), fg = parse(cs.color); const [x, y] = [lum(fg), lum(bg)].sort((a, b) => b - a); const k = (x + .05) / (y + .05);
      const stor = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700); n++; min = Math.min(min, k);
      if (k < (stor ? 3 : 4.5)) fails.push(`${k.toFixed(2)} «${el.textContent.trim().slice(0, 24)}»`);
    }
    return { n, min: min.toFixed(2), fails };
  });
  check(`S13 ${w}`, 'Kontrast for all tekst i prototypen', r.fails.length === 0, `${r.n} tekstelementer, laveste ${r.min}:1${r.fails.length ? ' – ' + r.fails.join('; ') : ''}`);
  await c.close();
}

// P1: tegnetakt og ressursbruk (måling, ikke krav: programvarerendering i skymiljøet er ikke representativ for en GPU)
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const { c, p } = await ny(w, h);
  await p.goto(url, { waitUntil: 'networkidle' }); const R = await reise(p);
  const m = await p.evaluate(async R => {
    const t = []; let sist = performance.now(), go = true; const g = n => { t.push(n - sist); sist = n; if (go) requestAnimationFrame(g); }; requestAnimationFrame(g);
    for (let i = 0; i <= 40; i++) { scrollTo(0, R * i / 40); await new Promise(r => setTimeout(r, 50)); }
    go = false; t.sort((a, b) => a - b);
    const s = document.querySelector('.kp-scene'), lr = document.querySelector('.kp-lerret');
    return { median: t[Math.floor(t.length / 2)], p95: t[Math.floor(t.length * .95)], n: t.length, partikler: +s.dataset.partikler, lerret: `${lr.width}×${lr.height}`, dpr: devicePixelRatio, kjerner: navigator.hardwareConcurrency };
  }, R);
  check(`P1 ${w}`, 'Tegnetakt under scroll (måling)', m.partikler > 0, `${m.partikler} partikler (${m.kjerner} kjerner → ${m.kjerner <= 4 ? 'redusert' : 'full'} mengde), lerret ${m.lerret} (pikseltetthet ${m.dpr}, begrenset), ${m.n} bilder: median ${m.median.toFixed(1)} ms, p95 ${m.p95.toFixed(1)} ms – programvarerendering`);
  await c.close();
}
await b.close();

// K11: andre motorer – Firefox og WebKit
for (const t of [firefox, webkit]) {
  const bb = await t.launch().catch(() => null);
  if (!bb) { res.push(`| K11 ${t.name()} | ${t.name()} | IKKE KJØRT | nettleseren er ikke installert i dette miljøet |`); ikkeKjort++; console.log('IKKE KJØRT K11', t.name()); continue; }
  const p = await bb.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(500);
  const r = await p.evaluate(() => ({ aktiv: document.querySelector('.kp-scene').className, ow: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
  check(`K11 ${t.name()}`, 'Siden laster uten overflow', r.ow <= 0, `scene ${r.aktiv}, overflow ${r.ow} px`);
  await bb.close();
}

server.close();
writeFileSync(`${here}KONSEPT-SCROLL-RESULTAT.md`, `# Testresultat – prototype /konsept-scroll «Vi gir ideer form»\n\nKjørt ${new Date().toISOString()} mot \`dist/\`. Chromium med programvarerendering av WebGL (SwiftShader); Firefox og WebKit der de er installert. Automatiske målinger, ikke estetisk godkjenning eller WCAG-samsvarserklæring.\n\n| ID | Test | Resultat | Måling |\n|---|---|---|---|\n${res.join('\n')}\n\n**${res.length - fail - ikkeKjort} av ${res.length} bestått${ikkeKjort ? `, ${ikkeKjort} ikke kjørt` : ''}.**\n`);
console.log(`${res.length - fail - ikkeKjort}/${res.length} OK${ikkeKjort ? `, ${ikkeKjort} ikke kjørt` : ''}`);
process.exit(fail ? 1 : 0);
