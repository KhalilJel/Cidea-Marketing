// Fase 5 – tester for prototypen /konsept-scroll («Fra ord til gjennomslag») mot byggede dist/.
// Kjør etter `npm run build`: node tests/konsept-scroll.test.mjs → tests/KONSEPT-SCROLL-RESULTAT.md
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
const H1 = 'Nettsider og helhetlig markedsføring som utvikles over tid.';
const b = await chromium.launch();
const frame = p => p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
const til = async (p, y) => { await p.evaluate(y => window.scrollTo(0, y), y); await frame(p); };

// K1: rute, metadata, feil
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const feil = [];
  p.on('pageerror', e => feil.push(e.message)); p.on('console', m => (m.type() === 'error' || /hydrat|did not match/i.test(m.text())) && feil.push(m.text()));
  const r = await p.goto(url, { waitUntil: 'networkidle' });
  const d = await p.evaluate(() => ({ h1: document.querySelector('h1')?.textContent.trim(), h1n: document.querySelectorAll('h1').length, robots: document.querySelector('meta[name=robots]')?.content, tittel: document.title, hs: [...document.querySelectorAll('h1,h2,h3')].map(h => +h.tagName[1]) }));
  const hopp = d.hs.some((n, i) => i > 0 && n > d.hs[i - 1] + 1);
  check('K1', 'Rute, H1, noindex og ingen feil', r.status() === 200 && d.h1 === H1 && d.h1n === 1 && /noindex/.test(d.robots) && !hopp && feil.length === 0, `HTTP ${r.status()}, H1 «${d.h1}», robots «${d.robots}», overskrifter ${d.hs.map(n => 'h' + n).join(' ')}, feil: ${feil.join('; ') || 'ingen'}`);
  await p.close();
}

// K2: ingen horisontal overflow gjennom hele scrollen
for (const [w, h] of [[320, 640], [375, 812], [390, 844], [768, 1024], [1440, 900]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  const total = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight); let maks = 0, n = 0;
  for (let y = 0; y <= total; y += Math.round(h / 3)) { await til(p, y); maks = Math.max(maks, await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)); n++; }
  check(`K2 ${w}`, 'Ingen horisontal overflow', maks <= 0, `${maks} px, målt i ${n} scrollposisjoner over ${total} px`);
  await c.close();
}

// K3–K6: vanlig scroll, reversering, festing og lesetid for H1
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  // K3: nettleserens egen scroll og ingen blokkerende lyttere (scroll-hendelser kan ikke avbrytes, så bare hjul og berøring telles)
  const cdp = await c.newCDPSession(p); const blokk = [];
  for (const expr of ['window', 'document', 'document.getElementById("root")']) {
    const { result } = await cdp.send('Runtime.evaluate', { expression: expr });
    const { listeners } = await cdp.send('DOMDebugger.getEventListeners', { objectId: result.objectId });
    for (const l of listeners) if (/^(wheel|mousewheel|touchstart|touchmove)$/.test(l.type) && !l.passive) blokk.push(`${expr}:${l.type}`);
  }
  if (w === 1440) { await p.mouse.move(700, 450); await p.mouse.wheel(0, 600); } else { await p.evaluate(() => window.scrollBy(0, 600)); }
  await p.waitForTimeout(400);
  const y1 = await p.evaluate(() => scrollY); const ov = await p.evaluate(() => getComputedStyle(document.documentElement).overflowY + '/' + getComputedStyle(document.body).overflowY);
  check(`K3 ${w}`, 'Vanlig nettleserscroll, ingen blokkerende scroll-/hjul-/berøringslyttere', y1 > 0 && blokk.length === 0 && !/hidden/.test(ov), `scrollY etter scroll: ${Math.round(y1)}, overflow html/body: ${ov}, ikke-passive lyttere: ${blokk.join(', ') || 'ingen'}`);
  // K4: reversering (ordmerke og ordpar)
  const tf = sel => p.evaluate(s => { const t = getComputedStyle(document.querySelector(s)).transform; return t === 'matrix(1, 0, 0, 1, 0, 0)' ? 'none' : t; }, sel);
  const hero = await p.evaluate(() => { const s = document.querySelector('.ks-start'); return { top: s.offsetTop, h: s.offsetHeight }; });
  const ord = await p.evaluate(() => { const s = document.querySelector('.ks-ord'); return s.offsetTop; });
  await til(p, 0); const a0 = await tf('.ks-ordmerke');
  await til(p, hero.top + (hero.h - h) * .6); const a1 = await tf('.ks-ordmerke');
  await til(p, 0); const a2 = await tf('.ks-ordmerke');
  await til(p, ord - h * .8); const o0 = await tf('.ks-ord-1');
  await til(p, ord + h * .2); const o1 = await tf('.ks-ord-1');
  await til(p, ord - h * .8); const o2 = await tf('.ks-ord-1');
  check(`K4 ${w}`, 'Scroll opp reverserer bevegelsen', a0 === 'none' && a1 !== 'none' && a2 === a0 && o0 !== o1 && o2 === o0, `ordmerke ${a0} → ${a1} → ${a2}; «Bli sett» ${o0} → ${o1} → ${o2}`);
  // K5: begrenset festing
  const sticky = await p.evaluate(() => [...document.querySelectorAll('.ks *')].filter(e => getComputedStyle(e).position === 'sticky').length);
  const pin = (hero.h - h) / h;
  check(`K5 ${w}`, 'Én kort festet sekvens', sticky === 1 && pin <= (w < 768 ? .75 : 1.2), `${sticky} festet element, festet strekning ${Math.round(pin * 100)}vh`);
  // K6: hvor lenge H1 og ingress er helt synlige og udekket
  let fra = null, til_ = null;
  for (let y = hero.top; y <= hero.top + hero.h - h; y += 10) {
    await til(p, y);
    const ok = await p.evaluate(() => { const i = document.querySelector('.ks-intro'); if (+getComputedStyle(i).opacity < .99) return false; return [...i.querySelectorAll('h1, p')].every(e => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && [[.1, .1], [.9, .9], [.5, .5]].every(([fx, fy]) => { const el = document.elementFromPoint(r.left + r.width * fx, r.top + r.height * fy); return el && (e.contains(el) || el === e); }); }); });
    if (ok) { fra ??= y; til_ = y; }
  }
  const lese = fra === null ? 0 : til_ - fra;
  check(`K6 ${w}`, 'H1 og ingress får lesetid før overgangen', lese >= (w < 768 ? 180 : 240), `helt synlige og udekket over ${lese} px scroll (${fra}–${til_})`);
  // K12: ingen tom marine strekning – øvre del helt marine mens bildeområdet dekker under 25 % av skjermen
  let tom = 0;
  for (let y = 0; y <= ord; y += 10) {
    await til(p, y);
    const e = await p.evaluate(() => { const H = innerHeight, pl = document.querySelector('.ks-plassholder').getBoundingClientRect(); const plH = Math.max(0, Math.min(pl.bottom, H) - Math.max(pl.top, 0)) / H; const el = document.elementFromPoint(innerWidth / 2, H * .25); const tr = document.querySelector('.ks-teppe').getBoundingClientRect(); const marine = (getComputedStyle(document.querySelector('.ks-teppe')).display !== 'none' && tr.top <= H * .05 && tr.bottom >= H * .5) || (!!el && !!el.closest('.ks-bilde') && !el.closest('.ks-plassholder')); return marine && plH < .25; });
    if (e) tom += 10;
  }
  check(`K12 ${w}`, 'Ingen tom marine strekning mellom overgang og bilde', tom <= h * .15, `${tom} px (${Math.round(tom / h * 100)} % av skjermhøyden) med marine øverst og bildeområdet under 25 % av skjermen; krav ≤ 15 %`);
  // K13: hovedbudskap og kontakt i første skjermbilde (mobil: H1 og ingress synlige uten scrolling)
  await til(p, 0);
  const st = await p.evaluate(() => { const i = document.querySelector('.ks-intro'), k = document.querySelector('.ks-kontakt').getBoundingClientRect(), ir = i.getBoundingClientRect(); return { op: +getComputedStyle(i).opacity, iBunn: Math.round(ir.bottom), kTopp: Math.round(k.top), kBunn: Math.round(k.bottom) }; });
  const kontaktOk = st.kTopp >= 0 && st.kBunn <= h;
  check(`K13 ${w}`, w < 768 ? 'Mobil: H1, ingress og kontaktknapp synlige i første skjermbilde' : 'Kontaktknapp synlig i første skjermbilde', kontaktOk && (w < 768 ? st.op > .99 && st.iBunn <= st.kTopp : true), `intro opasitet ${st.op}, intro slutter ${st.iBunn} px, kontaktknapp ${st.kTopp}–${st.kBunn} px av ${h}`);
  await c.close();
}

// K7: redusert bevegelse og K8: uten JavaScript
for (const [id, navn, opts] of [['K7', 'Redusert bevegelse: statisk og lesbar', { reducedMotion: 'reduce' }], ['K8', 'Uten JavaScript: innhold og lenker lesbare', { javaScriptEnabled: false }]]) {
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w), ...opts }); const p = await c.newPage();
    await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(200);
    const r = await p.evaluate(() => {
      // Elementer i den festede startscenen kontrolleres i sin egen scene (toppen av startscenen): under overgangen glir bildescenen
      // bevisst over dem. Fokus i den situasjonen kontrolleres i K14.
      const synlig = sel => [...document.querySelectorAll(sel)].every(e => { if (e.closest('.ks-start')) window.scrollTo(0, e.closest('.ks-start').offsetTop); else e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); const el = document.elementFromPoint(r.left + Math.min(20, r.width / 2), r.top + Math.min(12, r.height / 2)); return +getComputedStyle(e).opacity > .99 && el && (e.contains(el) || el === e || el.contains(e)); });
      return { anim: document.getAnimations().length, sticky: getComputedStyle(document.querySelector('.ks-scene')).position, h1: synlig('h1'), ingress: synlig('.ks-ingress'), h2: synlig('.ks h2'), h2feil: [...document.querySelectorAll('.ks h2')].filter(e => { e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); const el = document.elementFromPoint(r.left + Math.min(20, r.width / 2), r.top + Math.min(12, r.height / 2)); return !(+getComputedStyle(e).opacity > .99 && el && (e.contains(el) || el === e || el.contains(e))); }).map(e => e.id + '→' + (document.elementFromPoint(e.getBoundingClientRect().left + 20, e.getBoundingClientRect().top + 12)?.className || 'null')), lenker: [...document.querySelectorAll('.ks a')].length, lenkerSynlige: synlig('.ks a'), menyLenker: [...document.querySelectorAll('.cm-meny a')].filter(a => a.getBoundingClientRect().height > 0).length };
    });
    const krav = id === 'K7' ? r.anim === 0 && r.sticky !== 'sticky' : true;
    check(`${id} ${w}`, navn, krav && r.h1 && r.ingress && r.h2 && r.lenkerSynlige && r.lenker >= 9 && (id === 'K8' && w < 768 ? r.menyLenker >= 4 : true), `animasjoner ${r.anim}, scene ${r.sticky}, H1 ${r.h1}, ingress ${r.ingress}, alle h2 ${r.h2}${r.h2feil.length ? ' (' + r.h2feil.join(', ') + ')' : ''}, ${r.lenker} lenker synlige: ${r.lenkerSynlige}${id === 'K8' ? `, synlige menylenker ${r.menyLenker}` : ''}`);
    await c.close();
  }
}

// K9: tastatur – rekkefølge, synlig fokus, ikke skjult bak andre lag
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' });
  const rekke = [], skjult = [];
  for (let i = 0; i < 45; i++) {
    await p.keyboard.press('Tab'); await p.waitForTimeout(60);
    const f = await p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const cs = getComputedStyle(e), r = e.getBoundingClientRect(); const el = document.elementFromPoint(r.left + r.width / 2, r.top + Math.min(r.height / 2, 20)); return { t: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 26), ring: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2, inne: r.top >= 0 && r.bottom <= innerHeight, over: !!el && (e.contains(el) || el === e) , bunn: !!e.closest('footer') }; });
    if (!f) break; rekke.push(f.t); if (!f.ring || !f.inne || !f.over) skjult.push(`${f.t}${f.ring ? '' : ' (ring)'}${f.inne ? '' : ' (utenfor)'}${f.over ? '' : ' (dekket)'}`);
    if (f.bunn && f.t === 'Personvern') break;
  }
  check(`K9 ${w}`, 'Tastatur: logisk rekkefølge og synlig, udekket fokus', skjult.length === 0 && rekke.includes('Snakk med oss →') && rekke.includes('Personvern'), `${skjult.length ? 'problemer: ' + skjult.join(', ') + ' – ' : ''}${rekke.length} fokusmål: ${rekke.join(' · ')}`);
  await c.close();
}

// K14: kontaktknappen i startscenen er udekket når den får fokus mens bildescenen ligger over den
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(async () => {
    const k = document.querySelector('.ks-kontakt'), s = document.querySelector('.ks-start'); const ut = [];
    const raf = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    for (const f of [.75, .85, .95]) {
      window.scrollTo(0, s.offsetTop + (s.offsetHeight - innerHeight) * f); await raf();
      const r0 = k.getBoundingClientRect(); const før = document.elementFromPoint(r0.left + 20, r0.top + 12);
      k.focus(); await raf(); const r1 = k.getBoundingClientRect(); const el = document.elementFromPoint(r1.left + r1.width / 2, r1.top + Math.min(r1.height / 2, 20));
      ut.push({ f, dekketFør: !(før && (k.contains(før) || før === k)), udekket: !!el && (k.contains(el) || el === k), inne: r1.top >= 0 && r1.bottom <= innerHeight });
      k.blur(); await raf();
    }
    return ut;
  });
  check(`K14 ${w}`, 'Kontaktknappen er udekket når den har fokus under overgangen', r.every(x => x.udekket && x.inne), r.map(x => `${Math.round(x.f * 100)} %: ${x.dekketFør ? 'dekket uten fokus' : 'udekket uten fokus'}, med fokus ${x.udekket && x.inne ? 'udekket' : 'DEKKET/UTENFOR'}`).join('; '));
  await c.close();
}

// K10: kontrast (sluttilstand, redusert bevegelse)
for (const w of [1440, 390]) {
  const c = await b.newContext({ viewport: { width: w, height: 900 }, ...mobil(w), reducedMotion: 'reduce' }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
    const lum = ({ r, g, b }) => [r, g, b].map(x => x / 255).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4).reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
    const bgOf = el => { for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0.9) return c; } return { r: 250, g: 250, b: 253 }; };
    const mix = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a) });
    let n = 0, min = 99; const fails = [];
    for (const el of document.querySelectorAll('.ks *')) {
      if (![...el.childNodes].some(x => x.nodeType === 3 && x.textContent.trim().length > 1)) continue;
      const cs = getComputedStyle(el); if (cs.display === 'none' || !el.getBoundingClientRect().width) continue;
      const bg = bgOf(el); const fg = mix(parse(cs.color), bg); const [x, y] = [lum(fg), lum(bg)].sort((a, b) => b - a); const k = (x + .05) / (y + .05);
      const large = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700); n++; min = Math.min(min, k);
      if (k < (large ? 3 : 4.5)) fails.push(`${k.toFixed(2)} «${el.textContent.trim().slice(0, 24)}»`);
    }
    return { n, min: min.toFixed(2), fails };
  });
  check(`K10 ${w}`, 'Kontrast for all tekst i prototypen', r.fails.length === 0, `${r.n} tekstelementer, laveste ${r.min}:1${r.fails.length ? ' – ' + r.fails.join('; ') : ''}`);
  await c.close();
}
await b.close();

// K11: andre motorer – Firefox (uten view()) skal vise statisk side, WebKit (med view()) skal bevege seg
for (const t of [firefox, webkit]) {
  const bb = await t.launch().catch(() => null);
  // Mangler motoren i miljøet, registreres testen som ikke kjørt – aldri som bestått.
  if (!bb) { res.push(`| K11 ${t.name()} | ${t.name()} | IKKE KJØRT | nettleseren er ikke installert i dette miljøet |`); ikkeKjort++; console.log('IKKE KJØRT K11', t.name()); continue; }
  const p = await bb.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(300);
  const r = await p.evaluate(async () => {
    const st = CSS.supports('animation-timeline: view()'); const id = t => t === 'matrix(1, 0, 0, 1, 0, 0)' ? 'none' : t; const tf0 = id(getComputedStyle(document.querySelector('.ks-ordmerke')).transform);
    const s = document.querySelector('.ks-start'); window.scrollTo(0, s.offsetTop + (s.offsetHeight - innerHeight) * .6);
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const tf1 = getComputedStyle(document.querySelector('.ks-ordmerke')).transform;
    window.scrollTo(0, 0); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const h1 = document.querySelector('h1').getBoundingClientRect();
    return { st, tf0, tf1, scene: getComputedStyle(document.querySelector('.ks-scene')).position, h1synlig: h1.top < innerHeight && h1.bottom > 0, ow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  });
  const ok = r.ow <= 0 && (r.st ? r.tf0 === 'none' && r.tf1 !== 'none' : r.scene !== 'sticky' && r.h1synlig);
  check(`K11 ${t.name()}`, r.st ? 'Med view()-støtte: bevegelse virker' : 'Uten view()-støtte: statisk, lesbar side', ok, `view() støttet: ${r.st}, scene ${r.scene}, ordmerke ${r.tf0} → ${r.tf1}, H1 synlig øverst: ${r.h1synlig}, overflow ${r.ow} px`);
  await bb.close();
}

server.close();
writeFileSync(`${here}KONSEPT-SCROLL-RESULTAT.md`, `# Testresultat – prototype /konsept-scroll\n\nKjørt ${new Date().toISOString()} mot \`dist/\` (Netlify-regel). Chromium, og Firefox og WebKit fra Playwright der de er installert. Automatiske målinger, ikke en WCAG-samsvarserklæring.\n\n| ID | Test | Resultat | Måling |\n|---|---|---|---|\n${res.join('\n')}\n\n**${res.length - fail - ikkeKjort} av ${res.length} bestått${ikkeKjort ? `, ${ikkeKjort} ikke kjørt` : ''}.**\n`);
console.log(`${res.length - fail - ikkeKjort}/${res.length} OK${ikkeKjort ? `, ${ikkeKjort} ikke kjørt` : ''}`);
process.exit(fail ? 1 : 0);
