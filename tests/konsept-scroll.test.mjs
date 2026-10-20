// Fase 5 – tester for prototypen /konsept-scroll mot byggede dist/ (forløp etter eiers føring 2026-10-20):
// hvit åpning med CIDEA-knapp → første scroll/klikk åpner filmen over hele skjermen → scrollstyrt film med replikker →
// «Bli sett / Bli valgt», H1 og tjenester. Fast toppmeny hele veien.
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
const REPLIKKER = ['Noen trenger det dere tilbyr.', 'Gjør det enkelt å finne dere.', 'Og enkelt å ta neste steg.', 'Fra digital interesse til ekte møter.'];
const MIDT = [.1225, .28, .505, .74]; // midt i hver replikk (andel av festet lengde)
const b = await chromium.launch();
const frame = p => p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
const til = async (p, y) => { await p.evaluate(y => window.scrollTo(0, y), y); await frame(p); };
const filmInfo = p => p.evaluate(() => { const s = document.querySelector('.ks-film'); return { top: s.getBoundingClientRect().top + scrollY, len: s.offsetHeight - innerHeight }; });
const klar = p => p.waitForFunction(() => document.querySelector('video').readyState === 4, null, { timeout: 15000 });
// Scroller trinnvis (som vanlig scroll) til andel q av filmscenen og venter til filmen viser riktig bilde.
const tilFilm = async (p, f, q, trinn = 6) => {
  const fra = await p.evaluate(() => scrollY), mål = f.top + f.len * q;
  for (let i = 1; i <= trinn; i++) await til(p, fra + (mål - fra) * i / trinn);
  await p.waitForFunction(() => { const v = document.querySelector('video'); return v.readyState >= 2 && !v.seeking; }, null, { timeout: 4000 }).catch(() => {});
  await frame(p);
  return p.evaluate(() => ({ t: document.querySelector('video').currentTime, r: +(document.querySelector('.ks-film').dataset.replikk || 0) }));
};

// K1: rute, metadata, overskriftsrekkefølge, feil
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const feil = [];
  p.on('pageerror', e => feil.push(e.message)); p.on('console', m => (m.type() === 'error' || /hydrat|did not match/i.test(m.text())) && feil.push(m.text()));
  const r = await p.goto(url, { waitUntil: 'networkidle' });
  const d = await p.evaluate(() => ({ h1: document.querySelector('h1')?.textContent.trim(), h1n: document.querySelectorAll('h1').length, robots: document.querySelector('meta[name=robots]')?.content, hs: [...document.querySelectorAll('main h1, main h2, main h3')].map(h => +h.tagName[1]) }));
  const hopp = d.hs.some((n, i) => i > 0 && n > d.hs[i - 1] + 1) || d.hs[0] !== 1;
  check('K1', 'Rute, H1 (etter filmen), noindex, overskriftsrekkefølge, ingen feil', r.status() === 200 && d.h1 === H1 && d.h1n === 1 && /noindex/.test(d.robots) && !hopp && feil.length === 0, `HTTP ${r.status()}, H1 «${d.h1}», robots «${d.robots}», overskrifter ${d.hs.map(n => 'h' + n).join(' ')}, feil: ${feil.join('; ') || 'ingen'}`);
  await p.close();
}

// A1: før scroll – hvit flate, bare CIDEA-knappen (sentrert) og toppmenyen synlig
for (const [w, h] of [[1440, 900], [390, 844], [768, 1024]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const synlige = [...document.querySelectorAll('main *')].filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) || e.tagName === 'VIDEO' || e.tagName === 'IMG')
      .filter(e => { const r = e.getBoundingClientRect(); if (r.width < 1 || r.bottom <= 0 || r.top >= innerHeight) return false; if (!e.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false; const el = document.elementFromPoint(Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2)), Math.min(innerHeight - 1, Math.max(0, r.top + r.height / 2))); return !!el && (e.contains(el) || el.contains(e)); })
      .map(e => (e.textContent || e.tagName).trim().slice(0, 30));
    const k = document.querySelector('.ks-cidea').getBoundingClientRect();
    const bg = getComputedStyle(document.querySelector('.ks-apning')).backgroundColor;
    const topp = document.querySelector('.cm-topp').getBoundingClientRect();
    return { synlige, dx: Math.round(k.left + k.width / 2 - innerWidth / 2), dy: Math.round(k.top + k.height / 2 - innerHeight / 2), bg, topp: Math.round(topp.top), menyPos: getComputedStyle(document.querySelector('.cm-topp')).position };
  });
  check(`A1 ${w}`, 'Før scroll: hvit flate med bare CIDEA-knappen, sentrert, og fast toppmeny', r.synlige.join('|') === 'CIDEA' && Math.abs(r.dx) <= 2 && Math.abs(r.dy) <= 2 && r.bg === 'rgb(255, 255, 255)' && r.topp === 0 && r.menyPos === 'fixed',
    `synlig innhold i <main>: ${r.synlige.join(', ') || 'ingen'}; knappens senter avviker ${r.dx}/${r.dy} px fra skjermens senter; bakgrunn ${r.bg}; toppmeny ${r.menyPos} ved ${r.topp} px`);
  await c.close();
}

// A2: første scroll trykker knappen inn og åpner filmen over hele flaten; tilbake til toppen lukker
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await klar(p);
  await p.evaluate(() => scrollTo(0, 40)); await p.waitForTimeout(80);
  const trykk = await p.evaluate(() => ({ apning: document.querySelector('.ks-film').dataset.apning, anim: document.querySelector('.ks-cidea').getAnimations().map(a => a.animationName) }));
  await p.waitForTimeout(1500);
  const apen = await p.evaluate(() => {
    const sentrum = document.elementFromPoint(innerWidth / 2, innerHeight / 2), v = document.querySelector('.ks-video').getBoundingClientRect();
    return { klipp: getComputedStyle(document.querySelector('.ks-film-bilde')).clipPath, sentrum: sentrum?.className, dekker: v.left <= 0 && v.top <= 0 && v.right >= innerWidth && v.bottom >= innerHeight, knapp: getComputedStyle(document.querySelector('.ks-apning')).visibility, meny: document.querySelector('.cm').dataset.meny || '' };
  });
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(1200);
  const lukket = await p.evaluate(() => { const k = document.querySelector('.ks-cidea').getBoundingClientRect(), el = document.elementFromPoint(k.left + k.width / 2, k.top + k.height / 2); return { apning: document.querySelector('.ks-film').dataset.apning, knappSynlig: !!el && el.closest('.ks-cidea') !== null, meny: document.querySelector('.cm').dataset.meny || '' }; });
  check(`A2 ${w}`, 'Første scroll: knappen trykkes inn, filmen fyller skjermen; tilbake lukker', trykk.apning === 'apen' && trykk.anim.includes('ks-trykk') && /circle\(75%/.test(apen.klipp) && apen.sentrum === 'ks-video' && apen.dekker && apen.knapp === 'hidden' && apen.meny === 'film' && lukket.apning === 'lukket' && lukket.knappSynlig && lukket.meny === '',
    `etter 80 ms: ${trykk.apning}, animasjon ${trykk.anim.join(',') || 'ingen'}; etter 1,5 s: ${apen.klipp}, midt i bildet ${apen.sentrum}, film dekker skjermen ${apen.dekker}, knappelag ${apen.knapp}, meny «${apen.meny}»; tilbake til toppen: ${lukket.apning}, knappen synlig ${lukket.knappSynlig}, meny «${lukket.meny}»`);
  await c.close();
}

// A3: CIDEA med klikk og med tastatur (Tab + Enter) åpner filmen og går til filmens start; fokus flyttes til filmscenen
for (const [w, h, måte] of [[1440, 900, 'klikk'], [1440, 900, 'tastatur'], [390, 844, 'klikk'], [390, 844, 'tastatur']]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await klar(p); const f = await filmInfo(p);
  let tab = 0;
  if (måte === 'klikk') await p.click('.ks-cidea');
  else { for (; tab < 20; tab++) { await p.keyboard.press('Tab'); if (await p.evaluate(() => document.activeElement?.classList.contains('ks-cidea'))) break; } await p.keyboard.press('Enter'); }
  await p.waitForTimeout(1600);
  const r = await p.evaluate(() => ({ y: Math.round(scrollY), apning: document.querySelector('.ks-film').dataset.apning, fokus: document.activeElement?.id, hash: location.hash }));
  const forventet = Math.round(f.top + f.len * .05 + 4);
  check(`A3 ${w} ${måte}`, `CIDEA aktiveres med ${måte}`, r.apning === 'apen' && Math.abs(r.y - forventet) <= 30 && r.fokus === 'film' && r.hash === '', `${måte === 'tastatur' ? `fokus på knappen etter ${tab + 1} Tab, ` : ''}filmen ${r.apning}, scrollY ${r.y} (forventet ca. ${forventet}), fokus på #${r.fokus}, adresse uendret: ${r.hash === ''}`);
  await c.close();
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

// K3 og K5: vanlig nettleserscroll uten blokkerende lyttere; én festet scene med begrenset lengde
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' });
  const cdp = await c.newCDPSession(p); const blokk = [];
  for (const expr of ['window', 'document', 'document.getElementById("root")', 'document.querySelector(".ks-film")']) {
    const { result } = await cdp.send('Runtime.evaluate', { expression: expr });
    const { listeners } = await cdp.send('DOMDebugger.getEventListeners', { objectId: result.objectId });
    for (const l of listeners) if (/^(wheel|mousewheel|touchstart|touchmove)$/.test(l.type) && !l.passive) blokk.push(`${expr}:${l.type}`);
  }
  if (w === 1440) { await p.mouse.move(700, 450); await p.mouse.wheel(0, 600); } else { await p.evaluate(() => window.scrollBy(0, 600)); }
  await p.waitForTimeout(400);
  const y1 = await p.evaluate(() => scrollY); const ov = await p.evaluate(() => getComputedStyle(document.documentElement).overflowY + '/' + getComputedStyle(document.body).overflowY);
  check(`K3 ${w}`, 'Vanlig nettleserscroll, ingen blokkerende hjul-/berøringslyttere', y1 > 0 && blokk.length === 0 && !/hidden/.test(ov), `scrollY etter scroll: ${Math.round(y1)}, overflow html/body: ${ov}, ikke-passive lyttere: ${blokk.join(', ') || 'ingen'}`);
  const sticky = await p.evaluate(() => [...document.querySelectorAll('.ks *')].filter(e => getComputedStyle(e).position === 'sticky').map(e => e.className));
  const pin = await p.evaluate(() => (document.querySelector('.ks-film').offsetHeight - innerHeight) / innerHeight);
  check(`K5 ${w}`, 'Én festet scene (åpning + film) med begrenset lengde', sticky.join() === 'ks-film-scene' && pin <= (w < 768 ? 2.65 : 3.25), `festet: ${sticky.join(', ')}; festet strekning ${Math.round(pin * 100)}vh (grense ${w < 768 ? 265 : 325}vh)`);
  await c.close();
}

// F1: filfiler – størrelse, faststart (moov før mdat), uten lyd, plakat, byteområder
{
  const boks = buf => { const ut = []; for (let i = 0; i + 8 <= buf.length;) { const n = buf.readUInt32BE(i), t = buf.toString('latin1', i + 4, i + 8); ut.push(t); if (n < 8) break; i += n; } return ut; };
  const hent = async f => { const r = await fetch('http://127.0.0.1:4181' + f); return { s: r.status, buf: Buffer.from(await r.arrayBuffer()) }; };
  const [mp4, webm, plakat, del] = [await hent('/film/cidea-film-utkast-480p.mp4'), await hent('/film/cidea-film-utkast-480p.webm'), await hent('/film/cidea-film-plakat.jpg'), await fetch('http://127.0.0.1:4181/film/cidea-film-utkast-480p.mp4', { headers: { range: 'bytes=100-199' } })];
  const toppbokser = boks(mp4.buf); const faststart = toppbokser.indexOf('moov') > -1 && toppbokser.indexOf('moov') < toppbokser.indexOf('mdat');
  const mp4Lyd = mp4.buf.includes(Buffer.from('soun')); const webmLyd = /A_OPUS|A_VORBIS|A_AAC/.test(webm.buf.toString('latin1'));
  const mb = b => (b.length / 1048576).toFixed(2);
  check('F1', 'Filmfiler: små, faststart, uten lyd, plakat og byteområder', mp4.s === 200 && webm.s === 200 && plakat.s === 200 && mp4.buf.length < 3.5 * 1048576 && webm.buf.length < 3 * 1048576 && faststart && !mp4Lyd && !webmLyd && del.status === 206,
    `MP4 ${mb(mp4.buf)} MB (bokser ${toppbokser.join(' ')}), WebM ${mb(webm.buf)} MB, plakat ${(plakat.buf.length / 1024).toFixed(0)} kB, lydspor MP4 ${mp4Lyd} / WebM ${webmLyd}, Range-svar ${del.status}`);
}

// F2: filmen følger scrollen begge veier, fire replikker i rekkefølge, «Bli sett. Bli valgt.» finnes ikke i filmen
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage(); const feil = [];
  p.on('pageerror', e => feil.push(e.message));
  await p.goto(url, { waitUntil: 'networkidle' }); await klar(p); const f = await filmInfo(p);
  const fram = [], bak = [];
  for (let q = 0; q <= 1.0001; q += .025) fram.push(await tilFilm(p, f, Math.min(q, 1), 2));
  for (let q = 1; q >= -.0001; q -= .025) bak.push(await tilFilm(p, f, Math.max(q, 0), 2));
  const rekke = a => a.map(x => x.r).filter((r, i, arr) => r && r !== arr[i - 1]);
  // Toleranse på ett filmbilde (1/24 s): ved start melder nettleseren første bilde som 0,04 s og deretter 0,00 s.
  const mono = fram.every((x, i) => i === 0 || x.t >= fram[i - 1].t - .045);
  const avvik = Math.max(...bak.slice().reverse().map((x, i) => Math.abs(x.t - fram[i].t)));
  const tekst = await p.evaluate(() => ({ film: [...document.querySelectorAll('.ks-replikk')].map(e => e.textContent), etter: document.querySelector('.ks-ordpar')?.textContent }));
  check(`F2 ${w}`, 'Filmen følger scrollen fram og tilbake; fire replikker; ingen gjentakelse av «Bli sett. Bli valgt.»', mono && rekke(fram).join() === '1,2,3,4' && rekke(bak.slice().reverse()).join() === '1,2,3,4' && avvik < .1 && fram.at(-1).t > 20 && feil.length === 0 && tekst.film.join('|') === REPLIKKER.join('|') && /Bli sett\s*Bli valgt/.test(tekst.etter),
    `fram: replikker ${rekke(fram).join('→')}, tid ${fram[0].t.toFixed(2)}→${fram.at(-1).t.toFixed(2)} s, stigende ${mono}; tilbake: største tidsavvik ${avvik.toFixed(3)} s; replikker i filmen: ${tekst.film.length}; overskrift etter filmen «${tekst.etter}»; feil: ${feil.join('; ') || 'ingen'}`);
  await c.close();
}

// F3: brede skjermer – hver replikk i sitt hjørne, oppå filmen, under toppmenyen og utenfor hoppelenken
for (const [w, h] of [[1440, 900], [1280, 720], [1920, 1080], [1024, 768]]) {
  const c = await b.newContext({ viewport: { width: w, height: h } }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); await klar(p); const f = await filmInfo(p);
  const ut = [];
  for (const [i, q] of MIDT.entries()) {
    await tilFilm(p, f, q); await p.waitForTimeout(700);
    ut.push(await p.evaluate(nr => {
      const li = document.querySelector(`.ks-replikk[data-nr="${nr}"]`), r = li.getBoundingClientRect(), W = innerWidth, H = innerHeight, hopp = document.querySelector('.ks-hopp').getBoundingClientRect(), topp = document.querySelector('.cm-topp').getBoundingClientRect(), v = document.querySelector('.ks-video').getBoundingClientRect();
      const plass = [...li.classList].find(k => k.startsWith('ks-plass-')).slice(9);
      const hjørne = (plass[1] === 'v' ? r.right <= W * .42 : r.left >= W * .58) && (plass[0] === 'o' ? r.bottom <= H * .40 : r.top >= H * .58);
      const synlige = [...document.querySelectorAll('.ks-replikk')].filter(e => +getComputedStyle(e).opacity > .5).length;
      const krysser = a => !(r.right < a.left || r.left > a.right || r.bottom < a.top || r.top > a.bottom);
      const oppå = r.left >= v.left && r.right <= v.right && r.top >= v.top && r.bottom <= v.bottom;
      return { nr, plass, ok: hjørne && oppå && r.top >= topp.bottom && r.bottom <= H && synlige === 1 && +getComputedStyle(li).opacity > .99 && !krysser(hopp), boks: `${Math.round(r.left / W * 100)}–${Math.round(r.right / W * 100)} % × ${Math.round(r.top / H * 100)}–${Math.round(r.bottom / H * 100)} %` };
    }, i + 1));
  }
  check(`F3 ${w}×${h}`, 'Replikkene står i avtalt hjørne oppå filmen, én om gangen', ut.every(x => x.ok), ut.map(x => `${x.nr} ${x.plass} ${x.boks}${x.ok ? '' : ' FEIL'}`).join('; '));
  await c.close();
}

// F4: stående skjermer – filmen fyller skjermen, teksten ligger oppå filmen i et bånd under menyen og over hoppelenken,
// og utsnittet følger handlingen (object-position endres)
for (const [w, h] of [[320, 640], [375, 812], [390, 844], [768, 1024]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); await klar(p); const f = await filmInfo(p);
  const ut = [];
  for (const [i, q] of MIDT.entries()) {
    await tilFilm(p, f, q); await p.waitForTimeout(700);
    ut.push(await p.evaluate(nr => {
      const v = document.querySelector('.ks-video'), vr = v.getBoundingClientRect(), li = document.querySelector(`.ks-replikk[data-nr="${nr}"]`), r = li.getBoundingClientRect(), hopp = document.querySelector('.ks-hopp').getBoundingClientRect(), topp = document.querySelector('.cm-topp').getBoundingClientRect();
      const fyller = vr.left <= 0 && vr.top <= 0 && vr.right >= innerWidth && vr.bottom >= innerHeight;
      const oppå = r.top >= topp.bottom && r.bottom <= hopp.top && r.left >= 0 && r.right <= innerWidth;
      return { nr, ok: fyller && oppå && +getComputedStyle(li).opacity > .99, pos: v.style.objectPosition, m: `tekst ${Math.round(r.top)}–${Math.round(r.bottom)} px, meny til ${Math.round(topp.bottom)}, lenke fra ${Math.round(hopp.top)}` };
    }, i + 1));
  }
  const posisjoner = [...new Set(ut.map(x => x.pos))];
  const bad = ut.filter(x => !x.ok);
  check(`F4 ${w}×${h}`, 'Filmen fyller skjermen, teksten oppå filmen, utsnittet følger handlingen', bad.length === 0 && posisjoner.length >= 3 && ut.every(x => /%/.test(x.pos)),
    `${bad.length ? bad.map(x => `${x.nr}: ${x.m}`).join('; ') + '; ' : ''}utsnitt (object-position) ved replikk 1–4: ${ut.map(x => x.pos).join(' / ')}`);
  await c.close();
}

// F5: kontrast for replikkene over filmen, målt på faktiske piksler bak teksten (lyseste 5 %), midt i og ved start/slutt
for (const [w, h] of [[1440, 900], [1920, 1080], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); await klar(p); const f = await filmInfo(p);
  const ut = [];
  for (const [i, q] of MIDT.entries()) {
    for (const dq of [-.04, 0, .04]) {
      await tilFilm(p, f, q + dq); await p.waitForTimeout(700);
      const r = await p.evaluate(nr => { const li = document.querySelector(`.ks-replikk[data-nr="${nr}"]`); li.style.color = 'transparent'; li.style.textShadow = 'none'; const b = li.getBoundingClientRect(); return { x: Math.max(0, b.left), y: Math.max(0, b.top), width: Math.min(b.width, innerWidth - Math.max(0, b.left)), height: b.height }; }, i + 1);
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
  check(`F5 ${w}`, 'Kontrast: hvit replikk mot filmbildet bak (lyseste 5 %)', min >= 4.5, ut.filter(x => x.dq === 0).map(x => `${x.nr}: ${x.k.toFixed(2)}:1`).join(', ') + `; laveste inkl. start/slutt ${min.toFixed(2)}:1 (krav 4,5:1)`);
  await c.close();
}

// M1: toppmenyen er fast og udekket i hele forløpet, og lesbar i lys og mørk tilstand (kontrast mot bakgrunnen
// lagt over både hvitt og svart, dvs. verste tilfelle over filmen)
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await klar(p); const f = await filmInfo(p);
  const ut = [];
  for (const [navn, y] of [['åpning', 0], ['film', f.top + f.len * .5], ['filmslutt', f.top + f.len * .99], ['tjenester', f.top + f.len + h], ['bunn', 1e6]]) {
    const fra = await p.evaluate(() => scrollY); for (let i = 1; i <= 6; i++) await til(p, fra + (Math.min(y, await p.evaluate(() => document.documentElement.scrollHeight - innerHeight)) - fra) * i / 6);
    await p.waitForTimeout(1300);
    ut.push(await p.evaluate(navn => {
      const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
      const lum = ({ r, g, b }) => [r, g, b].map(x => x / 255).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4).reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
      const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a) });
      const kontrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + .05) / (y + .05); };
      const topp = document.querySelector('.cm-topp'), tr = topp.getBoundingClientRect(), bg = parse(getComputedStyle(topp).backgroundColor);
      const tekster = [...topp.querySelectorAll('.cm-ordmerke, .cm-meny ul a, .cm-menyknapp')].filter(e => e.getBoundingClientRect().width > 0);
      let min = 99, dekket = [];
      for (const e of tekster) {
        const cs = getComputedStyle(e); let egen = parse(cs.backgroundColor); const fg = parse(cs.color);
        for (const under of [{ r: 255, g: 255, b: 255, a: 1 }, { r: 0, g: 0, b: 0, a: 1 }]) { const flate = egen.a > .9 ? egen : over(bg, under); min = Math.min(min, kontrast(over(fg, flate), flate)); }
        const r = e.getBoundingClientRect(), el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); if (!el || !(e.contains(el) || el === e)) dekket.push(e.textContent.trim());
      }
      return { navn, topp: Math.round(tr.top), synlig: tr.bottom > 0, modus: document.querySelector('.cm').dataset.meny || 'lys', min: +min.toFixed(2), dekket };
    }, navn));
  }
  check(`M1 ${w}`, 'Fast toppmeny: alltid øverst, udekket og lesbar (lys og mørk tilstand)', ut.every(x => x.topp === 0 && x.synlig && x.dekket.length === 0 && x.min >= 4.5) && ut.some(x => x.modus === 'film') && ut.some(x => x.modus === 'lys'),
    ut.map(x => `${x.navn}: ${x.modus}, topp ${x.topp} px, laveste kontrast ${x.min}:1${x.dekket.length ? ', dekket: ' + x.dekket.join(',') : ''}`).join('; '));
  await c.close();
}

// M2: mobilmenyen (hamburger) med tastatur midt i filmen – åpner, første lenke får fokus og er lesbar, Escape lukker
{
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, ...mobil(390) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await klar(p); const f = await filmInfo(p);
  await tilFilm(p, f, .5); await p.waitForTimeout(1300);
  await p.focus('.cm-menyknapp'); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  const apen = await p.evaluate(() => {
    const e = document.activeElement, r = e.getBoundingClientRect(), el = document.elementFromPoint(r.left + 20, r.top + r.height / 2), cs = getComputedStyle(e);
    const lenker = [...document.querySelectorAll('.cm-meny ul a, .cm-meny-cta')].map(a => { const q = a.getBoundingClientRect(), x = document.elementFromPoint(q.left + 20, q.top + q.height / 2); return !!x && (a.contains(x) || x === a); });
    return { utvidet: document.querySelector('.cm-menyknapp').getAttribute('aria-expanded'), fokus: e.textContent.trim(), farge: cs.color, ring: cs.outlineStyle !== 'none', udekket: !!el && (e.contains(el) || el === e), alle: lenker.every(Boolean), n: lenker.length };
  });
  await p.keyboard.press('Escape'); await p.waitForTimeout(150);
  const lukket = await p.evaluate(() => ({ utvidet: document.querySelector('.cm-menyknapp').getAttribute('aria-expanded'), fokus: document.activeElement?.classList.contains('cm-menyknapp') }));
  check('M2', 'Mobilmeny med tastatur over filmen', apen.utvidet === 'true' && apen.fokus === 'Tjenester' && apen.farge === 'rgb(20, 22, 25)' && apen.ring && apen.udekket && apen.alle && lukket.utvidet === 'false' && lukket.fokus,
    `åpnet: aria-expanded ${apen.utvidet}, fokus på «${apen.fokus}» (farge ${apen.farge}, fokusring ${apen.ring}, udekket ${apen.udekket}), ${apen.n} lenker udekket: ${apen.alle}; Escape: aria-expanded ${lukket.utvidet}, fokus tilbake på knappen ${lukket.fokus}`);
  await c.close();
}

// F6: hoppelenken – vises når filmen er åpen, synlig med fokus, fører til tjenestene
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await klar(p); const f = await filmInfo(p);
  const skjultFør = await p.evaluate(() => getComputedStyle(document.querySelector('.ks-hopp')).visibility);
  await tilFilm(p, f, .3); await p.waitForTimeout(1500);
  await p.focus('.ks-hopp'); await frame(p);
  const før = await p.evaluate(() => { const e = document.activeElement, r = e.getBoundingClientRect(), el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { tekst: e.textContent.trim(), ring: getComputedStyle(e).outlineStyle !== 'none', udekket: !!el && (e.contains(el) || el === e), inne: r.top >= 0 && r.bottom <= innerHeight }; });
  await p.keyboard.press('Enter'); await p.waitForTimeout(500);
  const etter = await p.evaluate(() => ({ topp: Math.round(document.getElementById('tjenester').getBoundingClientRect().top), meny: Math.round(document.querySelector('.cm-topp').getBoundingClientRect().bottom), hash: location.hash }));
  check(`F6 ${w}`, 'Hoppelenken: skjult i åpningen, synlig med fokus i filmen, fører til tjenestene under menyen', skjultFør === 'hidden' && før.ring && før.udekket && før.inne && etter.topp >= etter.meny - 2 && etter.topp <= etter.meny + 40 && etter.hash === '#tjenester',
    `i åpningen: ${skjultFør}; «${før.tekst}» fokusring ${før.ring}, udekket ${før.udekket}; etter Enter: tjenestene ${etter.topp} px fra toppen (menyen slutter ${etter.meny} px), ${etter.hash}`);
  await c.close();
}

// K9: tastatur gjennom hele siden – logisk rekkefølge, synlig fokus, ikke dekket av den faste menyen
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' });
  const rekke = [], skjult = [];
  for (let i = 0; i < 45; i++) {
    await p.keyboard.press('Tab'); await p.waitForTimeout(80);
    const f = await p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const cs = getComputedStyle(e), r = e.getBoundingClientRect(); const el = document.elementFromPoint(r.left + r.width / 2, r.top + Math.min(r.height / 2, 20)); return { t: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 26), ring: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2, inne: r.top >= 0 && r.bottom <= innerHeight, over: !!el && (e.contains(el) || el === e), bunn: !!e.closest('footer') }; });
    if (!f) break; rekke.push(f.t); if (!f.ring || !f.inne || !f.over) skjult.push(`${f.t}${f.ring ? '' : ' (ring)'}${f.inne ? '' : ' (utenfor)'}${f.over ? '' : ' (dekket)'}`);
    if (f.bunn && f.t === 'Personvern') break;
  }
  check(`K9 ${w}`, 'Tastatur: logisk rekkefølge og synlig, udekket fokus', skjult.length === 0 && rekke.includes('CIDEA') && rekke.indexOf('CIDEA') < rekke.indexOf('Snakk med oss →') && rekke.includes('Personvern'), `${skjult.length ? 'problemer: ' + skjult.join(', ') + ' – ' : ''}${rekke.length} fokusmål: ${rekke.join(' · ')}`);
  await c.close();
}

// K4: «Bli sett / Bli valgt» etter filmen beveger seg med scrollen og går tilbake ved scroll opp
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' });
  const ord = await p.evaluate(() => document.querySelector('.ks-ord').getBoundingClientRect().top + scrollY);
  const tf = () => p.evaluate(() => getComputedStyle(document.querySelector('.ks-ord-1')).transform);
  await til(p, ord - h * .8); const o0 = await tf(); await til(p, ord + h * .2); const o1 = await tf(); await til(p, ord - h * .8); const o2 = await tf();
  check(`K4 ${w}`, 'Scroll opp reverserer bevegelsen etter filmen', o0 !== o1 && o2 === o0, `«Bli sett» ${o0} → ${o1} → ${o2}`);
  await c.close();
}

// K7: redusert bevegelse og K8: uten JavaScript – statisk og lesbar: åpning med CIDEA, plakat, alle replikker, H1, lenker
for (const [id, navn, opts] of [['K7', 'Redusert bevegelse: statisk og lesbar', { reducedMotion: 'reduce' }], ['K8', 'Uten JavaScript: innhold og lenker lesbare', { javaScriptEnabled: false }]]) {
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w), ...opts }); const p = await c.newPage(); const film = [];
    p.on('request', q => /\/film\/.*\.(mp4|webm)$/.test(q.url()) && film.push(q.url()));
    await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(300);
    const r = await p.evaluate(() => {
      const synlig = sel => [...document.querySelectorAll(sel)].every(e => { e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); const el = document.elementFromPoint(r.left + Math.min(20, r.width / 2), r.top + Math.min(12, r.height / 2)); return +getComputedStyle(e).opacity > .99 && el && (e.contains(el) || el === e || el.contains(e)); });
      return { aktiv: document.querySelector('.ks-film').classList.contains('ks-film-aktiv'), sticky: getComputedStyle(document.querySelector('.ks-film-scene')).position, cidea: synlig('.ks-cidea'), plakat: document.querySelector('.ks-video').poster.endsWith('cidea-film-plakat.jpg') && synlig('.ks-film-bilde'), replikker: synlig('.ks-replikk'), h1: synlig('h1'), h2: synlig('.ks h2'), lenker: [...document.querySelectorAll('.ks a')].length, lenkerSynlige: synlig('.ks a'), anim: document.getAnimations().length };
    });
    check(`${id} ${w}`, navn, !r.aktiv && r.sticky !== 'sticky' && r.cidea && r.plakat && r.replikker && r.h1 && r.h2 && r.lenkerSynlige && r.lenker >= 10 && film.length === 0 && (id === 'K7' ? r.anim === 0 : true),
      `aktiv film ${r.aktiv}, scene ${r.sticky}, CIDEA ${r.cidea}, plakat ${r.plakat}, replikker ${r.replikker}, H1 ${r.h1}, h2 ${r.h2}, ${r.lenker} lenker synlige ${r.lenkerSynlige}, filmforespørsler ${film.length}, animasjoner ${r.anim}`);
    await c.close();
  }
}

// F7: filene kan ikke lastes – statisk oppsett med plakat og alle replikker, ingen festing
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.route(/\/film\/.*\.(mp4|webm)$/, r => r.abort());
  await p.goto(url, { waitUntil: 'networkidle' }); await til(p, 300); await p.waitForTimeout(1500);
  const r = await p.evaluate(() => { const s = document.querySelector('.ks-film'); return { aktiv: s.classList.contains('ks-film-aktiv'), apning: s.dataset.apning || '', sticky: getComputedStyle(s.querySelector('.ks-film-scene')).position, synlige: [...s.querySelectorAll('.ks-replikk')].filter(e => +getComputedStyle(e).opacity > .99 && e.getBoundingClientRect().height > 0).length, meny: document.querySelector('.cm').dataset.meny || '', plakat: document.querySelector('.ks-video').poster.endsWith('cidea-film-plakat.jpg') }; });
  check(`F7 ${w}`, 'Filmen kan ikke lastes: statisk oppsett med alle replikker', !r.aktiv && !r.apning && r.sticky !== 'sticky' && r.synlige === 4 && r.plakat && !r.meny, `aktiv ${r.aktiv}, apning «${r.apning}», scene ${r.sticky}, ${r.synlige}/4 replikker synlige, plakat ${r.plakat}, menytilstand «${r.meny || 'lys'}»`);
  await c.close();
}

// F9: lastetid – ingen filmforespørsel før siden er lastet; med strupet nett (ca. 4G: 9 Mbit/s, 85 ms) er filmen bufret
// før en leser i vanlig tempo har scrollet halvveis gjennom filmscenen
{
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, ...mobil(390) }); const p = await c.newPage();
  const cdp = await c.newCDPSession(p); await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 85, downloadThroughput: 9e6 / 8, uploadThroughput: 1.5e6 / 8 });
  const film = []; p.on('request', q => /\/film\/.*\.(mp4|webm)$/.test(q.url()) && film.push({ u: q.url().split('/').pop(), t: Date.now() }));
  const t0 = Date.now(); let lastet = 0; p.once('load', () => { lastet = Date.now(); });
  await p.goto(url, { waitUntil: 'load' }); lastet ||= Date.now();
  const f = await filmInfo(p);
  await p.waitForTimeout(1500); // ser på åpningen
  let y = 0; const halv = f.top + f.len * .5, bufferVed = [];
  while (y < halv) { y = Math.min(halv, y + 300); await til(p, y); await p.waitForTimeout(700); bufferVed.push(await p.evaluate(() => { const v = document.querySelector('video'), b = v.buffered; return b.length ? b.end(b.length - 1) : 0; })); }
  const helt = await p.evaluate(() => { const v = document.querySelector('video'), b = v.buffered; return b.length > 0 && b.end(b.length - 1) >= v.duration - .1; });
  check('F9', 'Lastetid: filmen lastes etter siden og er bufret før halve filmscenen (strupet 4G)', film.length >= 1 && film[0].t >= lastet && helt,
    `siden lastet etter ${((lastet - t0) / 1000).toFixed(1)} s; første filmforespørsel (${film[0]?.u}) etter ${film[0] ? ((film[0].t - t0) / 1000).toFixed(1) + ' s' : 'ingen'}; bufret filmtid underveis: ${bufferVed.map(x => x.toFixed(1)).join(', ')} s; hele filmen bufret ved halvveis: ${helt}`);
  await c.close();
}

// K10: kontrast for all tekst i statisk tilstand (redusert bevegelse)
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
  check(`K10 ${w}`, 'Kontrast for all tekst i prototypen (statisk)', r.fails.length === 0, `${r.n} tekstelementer, laveste ${r.min}:1${r.fails.length ? ' – ' + r.fails.join('; ') : ''}`);
  await c.close();
}
await b.close();

// K11: andre motorer – Firefox og WebKit
for (const t of [firefox, webkit]) {
  const bb = await t.launch().catch(() => null);
  // Mangler motoren i miljøet, registreres testen som ikke kjørt – aldri som bestått.
  if (!bb) { res.push(`| K11 ${t.name()} | ${t.name()} | IKKE KJØRT | nettleseren er ikke installert i dette miljøet |`); ikkeKjort++; console.log('IKKE KJØRT K11', t.name()); continue; }
  const p = await bb.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(300);
  const r = await p.evaluate(() => ({ knapp: !!document.querySelector('.ks-cidea'), ow: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
  check(`K11 ${t.name()}`, 'Siden laster med åpning og uten overflow', r.knapp && r.ow <= 0, `CIDEA-knapp ${r.knapp}, overflow ${r.ow} px`);
  await bb.close();
}

server.close();
writeFileSync(`${here}KONSEPT-SCROLL-RESULTAT.md`, `# Testresultat – prototype /konsept-scroll\n\nKjørt ${new Date().toISOString()} mot \`dist/\` (Netlify-regel). Chromium, og Firefox og WebKit fra Playwright der de er installert. Automatiske målinger, ikke en WCAG-samsvarserklæring.\n\n| ID | Test | Resultat | Måling |\n|---|---|---|---|\n${res.join('\n')}\n\n**${res.length - fail - ikkeKjort} av ${res.length} bestått${ikkeKjort ? `, ${ikkeKjort} ikke kjørt` : ''}.**\n`);
console.log(`${res.length - fail - ikkeKjort}/${res.length} OK${ikkeKjort ? `, ${ikkeKjort} ikke kjørt` : ''}`);
process.exit(fail ? 1 : 0);
