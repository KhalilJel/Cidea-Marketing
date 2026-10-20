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
  // K5: begrenset festing – startscenen og filmscenen er de eneste festede scenene, begge med begrenset lengde
  const sticky = await p.evaluate(() => [...document.querySelectorAll('.ks *')].filter(e => getComputedStyle(e).position === 'sticky').map(e => e.className));
  const pin = (hero.h - h) / h;
  const filmPin = await p.evaluate(() => (document.querySelector('.ks-film').offsetHeight - innerHeight) / innerHeight);
  check(`K5 ${w}`, 'To korte festede sekvenser (start og film)', sticky.length === 2 && sticky.includes('ks-scene') && sticky.includes('ks-film-scene') && pin <= (w < 768 ? .75 : 1.2) && filmPin <= (w < 768 ? 2.45 : 3.05), `festet: ${sticky.join(', ')}; startscenen ${Math.round(pin * 100)}vh, filmscenen ${Math.round(filmPin * 100)}vh`);
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
  // Måles fra toppen til filmscenen er festet. Inne i den festede filmscenen er marine flate rundt filmbildet en del av oppsettet (mobil).
  const filmTopp = await p.evaluate(() => document.querySelector('.ks-film').getBoundingClientRect().top + scrollY);
  for (let y = 0; y <= filmTopp; y += 10) {
    await til(p, y);
    const e = await p.evaluate(() => { const H = innerHeight, pl = document.querySelector('.ks-film-bilde').getBoundingClientRect(); const plH = Math.max(0, Math.min(pl.bottom, H) - Math.max(pl.top, 0)) / Math.min(pl.height, H); const el = document.elementFromPoint(innerWidth / 2, H * .25); const tr = document.querySelector('.ks-teppe').getBoundingClientRect(); const marine = (getComputedStyle(document.querySelector('.ks-teppe')).display !== 'none' && tr.top <= H * .05 && tr.bottom >= H * .5) || (!!el && !!el.closest('.ks-bilde') && !el.closest('.ks-film-bilde')); return marine && plH < .5; });
    if (e) tom += 10;
  }
  check(`K12 ${w}`, 'Ingen tom marine strekning mellom overgang og bilde', tom <= h * .15, `${tom} px (${Math.round(tom / h * 100)} % av skjermhøyden) med marine øverst og under halvparten av filmbildet synlig; krav ≤ 15 %`);
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
// ---------- Filmscenen (F1–F9) ----------
const filmInfo = p => p.evaluate(() => { const s = document.querySelector('.ks-film'); return { top: s.getBoundingClientRect().top + scrollY, len: s.offsetHeight - innerHeight }; });
// Scroller til andel q av filmscenens festede lengde og venter til filmen har funnet riktig bilde.
const tilFilm = async (p, f, q) => {
  await til(p, f.top + f.len * q);
  await p.waitForFunction(() => { const v = document.querySelector('video'); return v.readyState >= 2 && !v.seeking; }, null, { timeout: 4000 }).catch(() => {});
  await frame(p);
  return p.evaluate(() => ({ t: document.querySelector('video').currentTime, r: +(document.querySelector('.ks-film').dataset.replikk || 0) }));
};
const vent = async (p, f) => { await til(p, f.top - 200); await p.waitForFunction(() => document.querySelector('video').readyState >= 3, null, { timeout: 15000 }); };
const replikkMidt = [.09, .26, .485, .715, .935];
const H5 = ['Noen trenger det dere tilbyr.', 'Gjør det enkelt å finne dere.', 'Og enkelt å ta neste steg.', 'Fra digital interesse til ekte møter.', 'Bli sett. Bli valgt.'];

// F1: filfiler – størrelse, faststart (moov før mdat), uten lyd, plakat
{
  const boks = buf => { const ut = []; for (let i = 0; i + 8 <= buf.length;) { const n = buf.readUInt32BE(i), t = buf.toString('latin1', i + 4, i + 8); ut.push(t); if (n < 8) break; i += n; } return ut; };
  const hent = async f => { const r = await fetch('http://127.0.0.1:4181' + f); return { s: r.status, type: r.headers.get('content-type'), buf: Buffer.from(await r.arrayBuffer()) }; };
  const [mp4, webm, plakat, del] = [await hent('/film/cidea-film-utkast-480p.mp4'), await hent('/film/cidea-film-utkast-480p.webm'), await hent('/film/cidea-film-plakat.jpg'), await fetch('http://127.0.0.1:4181/film/cidea-film-utkast-480p.mp4', { headers: { range: 'bytes=100-199' } })];
  const toppbokser = boks(mp4.buf); const faststart = toppbokser.indexOf('moov') > -1 && toppbokser.indexOf('moov') < toppbokser.indexOf('mdat');
  const mp4Lyd = mp4.buf.includes(Buffer.from('soun')); const webmLyd = /A_OPUS|A_VORBIS|A_AAC/.test(webm.buf.toString('latin1'));
  const mb = b => (b.length / 1048576).toFixed(2);
  check('F1', 'Filmfiler: små, faststart, uten lyd, plakat og byteområder', mp4.s === 200 && webm.s === 200 && plakat.s === 200 && mp4.buf.length < 3.5 * 1048576 && webm.buf.length < 3 * 1048576 && faststart && !mp4Lyd && !webmLyd && del.status === 206,
    `MP4 ${mb(mp4.buf)} MB (bokser ${toppbokser.join(' ')}), WebM ${mb(webm.buf)} MB, plakat ${(plakat.buf.length / 1024).toFixed(0)} kB, lydspor MP4 ${mp4Lyd} / WebM ${webmLyd}, Range-svar ${del.status}`);
}

// F2: filmen følger scrollen begge veier, replikkene kommer i riktig rekkefølge og reverseres
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage(); const feil = [];
  p.on('pageerror', e => feil.push(e.message));
  await p.goto(url, { waitUntil: 'networkidle' }); const f = await filmInfo(p); await vent(p, f);
  const fram = [], bak = [];
  for (let q = 0; q <= 1.0001; q += .025) fram.push(await tilFilm(p, f, Math.min(q, 1)));
  for (let q = 1; q >= -.0001; q -= .025) bak.push(await tilFilm(p, f, Math.max(q, 0)));
  const rekke = a => a.map(x => x.r).filter((r, i, arr) => r && r !== arr[i - 1]);
  const mono = fram.every((x, i) => i === 0 || x.t >= fram[i - 1].t - .03);
  const avvik = Math.max(...bak.slice().reverse().map((x, i) => Math.abs(x.t - fram[i].t)));
  check(`F2 ${w}`, 'Filmen følger scrollen fram og tilbake, replikker i rekkefølge', mono && rekke(fram).join() === '1,2,3,4,5' && rekke(bak.slice().reverse()).join() === '1,2,3,4,5' && avvik < .1 && fram.at(-1).t > 20 && feil.length === 0,
    `fram: replikker ${rekke(fram).join('→')}, tid ${fram[0].t.toFixed(2)}→${fram.at(-1).t.toFixed(2)} s, stigende ${mono}; tilbake: største tidsavvik ${avvik.toFixed(3)} s; feil: ${feil.join('; ') || 'ingen'}`);
  await c.close();
}

// F3: brede skjermer – hver replikk står i sitt hjørne, innenfor filmbildet, og overlapper ikke hoppelenken
for (const [w, h] of [[1440, 900], [1280, 720], [1920, 1080], [1024, 768]]) {
  const c = await b.newContext({ viewport: { width: w, height: h } }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); const f = await filmInfo(p); await vent(p, f);
  const ut = [];
  for (const [i, q] of replikkMidt.entries()) {
    await tilFilm(p, f, q); await p.waitForTimeout(800);
    ut.push(await p.evaluate(nr => {
      const li = document.querySelector(`.ks-replikk[data-nr="${nr}"]`), r = li.getBoundingClientRect(), W = innerWidth, H = innerHeight, hopp = document.querySelector('.ks-hopp').getBoundingClientRect();
      const plass = [...li.classList].find(k => k.startsWith('ks-plass-')).slice(9);
      const hjørne = (plass[1] === 'v' ? r.right <= W * .42 : r.left >= W * .58) && (plass[0] === 'o' ? r.bottom <= H * .38 : r.top >= H * .58);
      const synlige = [...document.querySelectorAll('.ks-replikk')].filter(e => +getComputedStyle(e).opacity > .5).length;
      const krysser = !(r.right < hopp.left || r.left > hopp.right || r.bottom < hopp.top || r.top > hopp.bottom);
      return { nr, plass, ok: hjørne && r.top >= 0 && r.bottom <= H && r.left >= 0 && r.right <= W && synlige === 1 && +getComputedStyle(li).opacity > .99 && !krysser, boks: `${Math.round(r.left / W * 100)}–${Math.round(r.right / W * 100)} % × ${Math.round(r.top / H * 100)}–${Math.round(r.bottom / H * 100)} %` };
    }, i + 1));
  }
  check(`F3 ${w}×${h}`, 'Replikkene står i avtalt hjørne, én om gangen', ut.every(x => x.ok), ut.map(x => `${x.nr} ${x.plass} ${x.boks}${x.ok ? '' : ' FEIL'}`).join('; '));
  await c.close();
}

// F4: smale og stående skjermer – hele filmbildet vises (ingen beskjæring) og teksten ligger under filmen
for (const [w, h] of [[320, 640], [375, 812], [390, 844], [768, 1024]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); const f = await filmInfo(p); await vent(p, f);
  const ut = [];
  for (const [i, q] of replikkMidt.entries()) {
    await tilFilm(p, f, q); await p.waitForTimeout(800);
    ut.push(await p.evaluate(nr => {
      const v = document.querySelector('.ks-video'), vr = v.getBoundingClientRect(), li = document.querySelector(`.ks-replikk[data-nr="${nr}"]`), r = li.getBoundingClientRect(), hopp = document.querySelector('.ks-hopp').getBoundingClientRect();
      const forhold = vr.width / vr.height, helt = Math.abs(forhold - v.videoWidth / v.videoHeight) < .02 && vr.left >= -1 && vr.right <= innerWidth + 1 && vr.top >= 0 && vr.bottom <= innerHeight;
      const under = r.top >= vr.bottom && r.bottom <= hopp.top && r.right <= innerWidth;
      return { nr, ok: helt && under && +getComputedStyle(li).opacity > .99, m: `film ${Math.round(vr.width)}×${Math.round(vr.height)} (${forhold.toFixed(3)}), ${Math.round(vr.top)}–${Math.round(vr.bottom)}, tekst ${Math.round(r.top)}–${Math.round(r.bottom)}, lenke fra ${Math.round(hopp.top)}` };
    }, i + 1));
  }
  const bad = ut.filter(x => !x.ok);
  check(`F4 ${w}×${h}`, 'Hele filmbildet synlig, teksten under filmen', bad.length === 0, bad.length ? bad.map(x => `${x.nr}: ${x.m}`).join('; ') : ut[0].m.replace(/, tekst.*/, '') + `; alle fem replikker under filmen`);
  await c.close();
}

// F5: kontrast for replikkene over filmen (brede skjermer). Måler faktiske piksler bak teksten (teksten skjult, mørk flate med),
// og regner kontrast mot hvit tekst for det lyseste 5 % av pikslene.
for (const [w, h] of [[1440, 900], [1920, 1080]]) {
  const c = await b.newContext({ viewport: { width: w, height: h } }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); const f = await filmInfo(p); await vent(p, f);
  const ut = [];
  for (const [i, q] of replikkMidt.entries()) {
    for (const dq of [-.05, 0, .05]) {
      await tilFilm(p, f, q + dq); await p.waitForTimeout(700);
      const r = await p.evaluate(nr => { const li = document.querySelector(`.ks-replikk[data-nr="${nr}"]`); li.style.color = 'transparent'; li.style.textShadow = 'none'; const b = li.getBoundingClientRect(); return { x: Math.max(0, b.left), y: Math.max(0, b.top), width: b.width, height: b.height }; }, i + 1);
      const png = await p.screenshot({ clip: r });
      await p.evaluate(nr => { const li = document.querySelector(`.ks-replikk[data-nr="${nr}"]`); li.style.color = ''; li.style.textShadow = ''; }, i + 1);
      const k = await p.evaluate(async b64 => {
        const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
        const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height; const x = cv.getContext('2d'); x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, cv.width, cv.height).data, L = [];
        const lin = v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
        for (let j = 0; j < d.length; j += 16) L.push(.2126 * lin(d[j]) + .7152 * lin(d[j + 1]) + .0722 * lin(d[j + 2]));
        L.sort((a, b) => a - b); return 1.05 / (L[Math.floor(L.length * .95)] + .05);
      }, png.toString('base64'));
      ut.push({ nr: i + 1, dq, k });
    }
  }
  const min = Math.min(...ut.map(x => x.k));
  check(`F5 ${w}`, 'Kontrast: hvit replikk mot filmbildet bak (lyseste 5 %)', min >= 4.5, ut.filter(x => x.dq === 0).map(x => `${x.nr}: ${x.k.toFixed(2)}:1`).join(', ') + `; laveste inkl. start/slutt av hver replikk ${min.toFixed(2)}:1 (krav 4,5:1)`);
  await c.close();
}

// F6: hoppelenken – tastatur og klikk fører rett til tjenestene
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); const f = await filmInfo(p);
  await til(p, f.top + f.len * .3);
  await p.focus('.ks-hopp'); await frame(p);
  const før = await p.evaluate(() => { const e = document.activeElement, r = e.getBoundingClientRect(), el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { tekst: e.textContent.trim(), ring: getComputedStyle(e).outlineStyle !== 'none', udekket: !!el && (e.contains(el) || el === e), inne: r.top >= 0 && r.bottom <= innerHeight }; });
  await p.keyboard.press('Enter'); await p.waitForTimeout(400);
  const etter = await p.evaluate(() => ({ topp: Math.round(document.getElementById('tjenester').getBoundingClientRect().top), hash: location.hash }));
  check(`F6 ${w}`, 'Hoppelenken er synlig med fokus og fører til tjenestene', før.ring && før.udekket && før.inne && Math.abs(etter.topp) <= 30 && etter.hash === '#tjenester', `«${før.tekst}» fokusring ${før.ring}, udekket ${før.udekket}, i bildet ${før.inne}; etter Enter: tjenestene ${etter.topp} px fra toppen, ${etter.hash}`);
  await c.close();
}

// F7: uten videostøtte eller når filene ikke kan lastes: statisk oppsett med plakat og alle replikker
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.route(/\/film\/.*\.(mp4|webm)$/, r => r.abort());
  await p.goto(url, { waitUntil: 'networkidle' }); const f = await filmInfo(p); await til(p, f.top); await p.waitForTimeout(1500);
  const r = await p.evaluate(() => { const s = document.querySelector('.ks-film'); return { aktiv: s.classList.contains('ks-film-aktiv'), sticky: getComputedStyle(s.querySelector('.ks-film-scene')).position, synlige: [...s.querySelectorAll('.ks-replikk')].filter(e => +getComputedStyle(e).opacity > .99 && e.getBoundingClientRect().height > 0).length, h: Math.round(s.offsetHeight / innerHeight * 100), plakat: document.querySelector('.ks-video').poster.endsWith('cidea-film-plakat.jpg') }; });
  check(`F7 ${w}`, 'Filmen kan ikke lastes: statisk oppsett med alle replikker', !r.aktiv && r.sticky !== 'sticky' && r.synlige === 5 && r.plakat && r.h < 200, `aktiv ${r.aktiv}, scene ${r.sticky}, ${r.synlige}/5 replikker synlige, seksjonen ${r.h}vh, plakat ${r.plakat}`);
  await c.close();
}

// F8: redusert bevegelse og uten JavaScript – ingen filmnedlasting, plakat og alle replikker
for (const [navn, opts] of [['redusert bevegelse', { reducedMotion: 'reduce' }], ['uten JavaScript', { javaScriptEnabled: false }]]) {
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, ...mobil(390), ...opts }); const p = await c.newPage(); const film = [];
  p.on('request', q => /\/film\/.*\.(mp4|webm)$/.test(q.url()) && film.push(q.url()));
  await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => { const s = document.querySelector('.ks-film'); scrollTo(0, s.getBoundingClientRect().top + scrollY); }); await p.waitForTimeout(1200);
  const r = await p.evaluate(() => { const s = document.querySelector('.ks-film'); return { aktiv: s.classList.contains('ks-film-aktiv'), tekster: [...s.querySelectorAll('.ks-replikk')].filter(e => +getComputedStyle(e).opacity > .99).map(e => e.textContent), hopp: !!s.querySelector('a.ks-hopp[href="#tjenester"]') }; });
  check(`F8 ${navn}`, `${navn[0].toUpperCase() + navn.slice(1)}: ingen film lastet, alle replikker som tekst`, !r.aktiv && film.length === 0 && r.tekster.join('|') === H5.join('|') && r.hopp, `aktiv ${r.aktiv}, filmforespørsler ${film.length}, replikker: ${r.tekster.length}/5, hoppelenke ${r.hopp}`);
  await c.close();
}

// F9: lastetid – filmen konkurrerer ikke med sidens første innlasting (ingen filmforespørsel før load-hendelsen), og med
// strupet nett (ca. 4G: 9 Mbit/s, 85 ms) er den klar før en leser i vanlig tempo når filmscenen
{
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, ...mobil(390) }); const p = await c.newPage();
  const cdp = await c.newCDPSession(p); await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 85, downloadThroughput: 9e6 / 8, uploadThroughput: 1.5e6 / 8 });
  const film = []; p.on('request', q => /\/film\/.*\.(mp4|webm)$/.test(q.url()) && film.push({ u: q.url().split('/').pop(), t: Date.now() }));
  const t0 = Date.now(); let lastet = 0; p.once('load', () => { lastet = Date.now(); });
  await p.goto(url, { waitUntil: 'load' }); lastet ||= Date.now();
  const f = await filmInfo(p);
  // Vanlig lesetempo ned mot filmen: H1 og ingress leses (3 s), deretter ett halvt skjermbilde hvert sekund
  await p.waitForTimeout(3000);
  let y = 0; while (y < f.top) { y = Math.min(f.top, y + 422); await til(p, y); await p.waitForTimeout(1000); }
  const nådd = Date.now();
  const bufret = await p.evaluate(() => { const v = document.querySelector('video'), b = v.buffered; return b.length > 0 && b.end(b.length - 1) >= v.duration - .1; });
  // Tid fra scenen nås til filmen viser et bilde (Chromium kan kort melde readyState 1 mens et bilde hentes fram fra bufferen)
  await p.waitForFunction(() => { const v = document.querySelector('video'); return v.readyState >= 2 && !v.seeking; }, null, { timeout: 10000, polling: 16 }).catch(() => {});
  const bilde = Date.now() - nådd;
  const plakat = await p.evaluate(() => document.querySelector('video').poster.split('/').pop());
  // Ytterkant: hopp rett til siste replikk og mål tiden til riktig bilde vises
  const fr = Date.now(); await tilFilm(p, f, .95); const hopp = Date.now() - fr;
  check('F9', 'Lastetid: filmen lastes etter siden, er bufret når scenen nås, og riktig bilde vises (strupet 4G)', film.length >= 1 && film[0].t >= lastet && bufret && plakat === 'cidea-film-start.jpg' && bilde <= 1000 && hopp <= 500,
    `siden lastet etter ${((lastet - t0) / 1000).toFixed(1)} s; første filmforespørsel (${film[0]?.u}) ${film[0] ? ((film[0].t - t0) / 1000).toFixed(1) + ' s' : 'ingen'}; filmscenen nådd etter ${((nådd - t0) / 1000).toFixed(1)} s, hele filmen bufret da: ${bufret}; plakat i mellomtiden ${plakat} (filmens første bilde); filmbildet dekodet ${bilde} ms etter ankomst; hopp til 95 % vist etter ${hopp} ms`);
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
