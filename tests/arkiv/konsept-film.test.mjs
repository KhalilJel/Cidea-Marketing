// Fase 5 – tester for prototypen /konsept-scroll mot byggede dist/ (forløp etter eiers føring 2026-10-21):
// hvit åpning med CIDEA og fast meny → første scrollforsøk nedover starter knappetrykk, sirkelåpning og filmen →
// filmen spiller sammenhengende i 1× til slutt (scroll styrer den ikke; scrollforsøk forkastes) → «Bli sett / Bli valgt»,
// H1 og tjenester. «Til tjenester», menyen og filmslutt frigjør sidescrollen.
// Kjør etter `npm run build`: node tests/konsept-scroll.test.mjs → tests/KONSEPT-SCROLL-RESULTAT.md
import { chromium, firefox, webkit } from 'playwright';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { serve } from '../serve-dist.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const server = await serve(4181);
const url = 'http://127.0.0.1:4181/konsept-scroll';
const res = []; let fail = 0; let ikkeKjort = 0;
const check = (id, navn, ok, mål) => { res.push(`| ${id} | ${navn} | ${ok ? 'OK' : '**FEIL**'} | ${mål} |`); if (!ok) fail++; console.log(ok ? 'OK  ' : 'FEIL', id, navn, '–', mål); };
const mobil = w => (w < 768 ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {});
const H1 = 'Nettsider og helhetlig markedsføring som utvikles over tid.';
const REPLIKKER = ['Noen trenger det dere tilbyr.', 'Gjør det enkelt å finne dere.', 'Og enkelt å ta neste steg.', 'Fra digital interesse til ekte møter.'];
const RANGER = [[.05, 1.42], [1.75, 4.95], [6.6, 9.05], [9.95, 15.05]]; // replikkenes filmtid (fra–til, s)
const MIDT = RANGER.map(([a, z]) => (a + z) / 2);
const b = await chromium.launch();
const frame = p => p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
const til = async (p, y) => { await p.evaluate(y => window.scrollTo(0, y), y); await frame(p); };
const klar = p => p.waitForFunction(() => document.querySelector('video').readyState === 4, null, { timeout: 15000 });
const tilstandFilm = p => p.evaluate(() => document.querySelector('.ks-film').dataset.tilstand || '');
const venteTilstand = (p, t, ms = 8000) => p.waitForFunction(t => document.querySelector('.ks-film').dataset.tilstand === t, t, { timeout: ms });
// Scrollforsøk slik en leser gjør det: hjul på desktop, sveip (ekte berøringshendelser via CDP) på mobil.
const sveip = async (p, dy) => {
  const cdp = await p.context().newCDPSession(p), x = 195, y0 = dy > 0 ? 640 : 240;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: y0 }] });
  for (let i = 1; i <= 5; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y0 - dy * i / 5 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await cdp.detach();
};
const scrollForsøk = async (p, w, dy) => { if (w < 768) await sveip(p, dy); else { await p.mouse.move(700, 450); await p.mouse.wheel(0, dy); } };
// Starter filmen med ett scrollforsøk og venter til den spiller.
const startFilm = async (p, w) => { await scrollForsøk(p, w, 120); await venteTilstand(p, 'spiller'); };
// For målinger av ett bestemt filmbilde (plassering, kontrast): filmen settes på pause på tidspunkt t, og testen venter
// til bildet som vises (data-vist) er dette tidspunktet. Endrer ikke sidens logikk; bare testens måleoppsett.
const påTid = async (p, t) => {
  await p.evaluate(t => { const v = document.querySelector('video'); v.pause(); v.currentTime = t; }, t);
  await p.waitForFunction(t => Math.abs(+document.querySelector('.ks-film').dataset.vist - t) < .05, t, { timeout: 5000 });
  await frame(p);
};
// Hopper til de siste 0,3 s av filmen og lar den spille ut (for tester av tilstanden etter filmslutt).
const tilSlutt = async p => { await p.evaluate(() => { const v = document.querySelector('video'); v.currentTime = v.duration - .3; v.play(); }); await venteTilstand(p, 'ferdig', 5000); await frame(p); };

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

// A2: første scrollforsøk (hjul på desktop, sveip på mobil) trykker knappen inn, åpner filmen over hele flaten og
// starter avspillingen; siden scroller ikke
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await klar(p);
  await scrollForsøk(p, w, 120); await p.waitForTimeout(80);
  const trykk = await p.evaluate(() => ({ apning: document.querySelector('.ks-film').dataset.apning, anim: document.querySelector('.ks-cidea').getAnimations().map(a => a.animationName) }));
  await p.waitForTimeout(1500);
  const apen = await p.evaluate(() => {
    const sentrum = document.elementFromPoint(innerWidth / 2, innerHeight / 2), v = document.querySelector('.ks-video'), r = v.getBoundingClientRect();
    return { klipp: getComputedStyle(document.querySelector('.ks-film-bilde')).clipPath, sentrum: sentrum?.className, dekker: r.left <= 0 && r.top <= 0 && r.right >= innerWidth && r.bottom >= innerHeight, knapp: getComputedStyle(document.querySelector('.ks-apning')).visibility, meny: document.querySelector('.cm').dataset.meny || '', tilstand: document.querySelector('.ks-film').dataset.tilstand, spiller: !v.paused && v.currentTime > .1, y: scrollY };
  });
  check(`A2 ${w}`, `Første scrollforsøk (${w < 768 ? 'sveip' : 'hjul'}): knappen trykkes inn, filmen fyller skjermen og spiller, siden står stille`, trykk.apning === 'apen' && trykk.anim.includes('ks-trykk') && /circle\(75%/.test(apen.klipp) && apen.sentrum === 'ks-video' && apen.dekker && apen.knapp === 'hidden' && apen.meny === 'film' && apen.tilstand === 'spiller' && apen.spiller && apen.y === 0,
    `etter 80 ms: ${trykk.apning}, animasjon ${trykk.anim.join(',') || 'ingen'}; etter 1,5 s: ${apen.klipp}, midt i bildet ${apen.sentrum}, film dekker skjermen ${apen.dekker}, knappelag ${apen.knapp}, meny «${apen.meny}», tilstand ${apen.tilstand}, spiller ${apen.spiller}, scrollY ${apen.y}`);
  await c.close();
}

// A3: CIDEA er ikke et betjeningselement (ikke klikkbart, ikke fokuserbart, ingen knappesemantikk); scrolltaster starter filmen
{
  const c = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await klar(p);
  const sem = await p.evaluate(() => { const e = document.querySelector('.ks-cidea'); return { tag: e.tagName, rolle: e.getAttribute('role'), tab: e.tabIndex, href: e.hasAttribute('href'), peker: getComputedStyle(e).cursor }; });
  await p.click('.ks-cidea'); await p.waitForTimeout(1300);
  const etterKlikk = await tilstandFilm(p);
  let fokusert = false; for (let i = 0; i < 12; i++) { await p.keyboard.press('Tab'); if (await p.evaluate(() => !!document.activeElement?.closest('.ks-cidea'))) fokusert = true; }
  check('A3 CIDEA', 'CIDEA ser ut som en knapp, men er ikke klikkbar, fokuserbar eller en knapp', sem.tag === 'P' && !sem.rolle && sem.tab < 0 && !sem.href && sem.peker === 'default' && !fokusert && etterKlikk === 'klar',
    `element <${sem.tag.toLowerCase()}>, rolle ${sem.rolle || 'ingen'}, tabIndex ${sem.tab}, lenke ${sem.href}, peker ${sem.peker}; fikk fokus med Tab ${fokusert}; tilstand etter klikk ${etterKlikk}`);
  await c.close();
}
for (const tast of ['ArrowDown', 'PageDown', 'Space']) {
  const c = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await klar(p);
  await p.keyboard.press(tast); await p.waitForTimeout(1600);
  const r = await p.evaluate(() => ({ t: document.querySelector('.ks-film').dataset.tilstand, y: scrollY, ct: document.querySelector('video').currentTime }));
  check(`A3 ${tast}`, `Tasten ${tast} i åpningen starter filmen uten å scrolle`, r.t === 'spiller' && r.y === 0 && r.ct > .1, `tilstand ${r.t}, scrollY ${r.y}, filmtid ${r.ct.toFixed(2)} s`);
  await c.close();
}

// B1: oppstart – filmtekst og hoppelenke er aldri synlige før filmen er åpen: kald innlasting med 4× CPU og tregt nett,
// og treg JavaScript (hovedfilen holdes tilbake 2 s). Logger hvert bilde de første 3 s.
const loggInit = () => { window.__logg = []; const t0 = performance.now(); const f = () => { const s = document.querySelector('.ks-film'); if (s) { const vis = [...document.querySelectorAll('.ks-replikk, .ks-hopp, .ks-film-bilde')].filter(e => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.width > 0 && e.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && +getComputedStyle(e).opacity > .02 && (!e.classList.contains('ks-film-bilde') || !/circle\(0%/.test(getComputedStyle(e).clipPath)); }).map(e => e.className.split(' ')[0] + (e.dataset.nr || '')); window.__logg.push({ t: Math.round(performance.now() - t0), apen: s.dataset.apning === 'apen', vis }); } if (performance.now() - t0 < 3000) requestAnimationFrame(f); }; requestAnimationFrame(f); };
for (const [w, h] of [[1440, 900], [390, 844]]) {
  for (const måte of ['kald', 'treg JS']) {
    const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage(); const cdp = await c.newCDPSession(p);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 });
    if (måte === 'treg JS') await p.route(/\/assets\/index-.*\.js$/, async r => { await new Promise(x => setTimeout(x, 2000)); await r.continue(); });
    await p.addInitScript(loggInit);
    await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(3200);
    const l = await p.evaluate(() => window.__logg);
    const feil = l.filter(x => !x.apen && x.vis.length);
    const aktivEtter = await p.evaluate(() => document.querySelector('.ks-film').classList.contains('ks-film-aktiv'));
    check(`B1 ${w} ${måte}`, `Oppstart (${måte}): ingen filmtekst, hoppelenke eller film over åpningen`, l.length > 10 && feil.length === 0 && aktivEtter,
      `${l.length} bilder logget over 3 s; bilder med synlig filmtekst/kontroll/film før åpning: ${feil.length}${feil.length ? ' (først ' + feil[0].t + ' ms: ' + feil[0].vis.join(',') + ')' : ''}; JS styrer filmen etterpå: ${aktivEtter}`);
    await c.close();
  }
}

// P1–P3: hele avspillingen, ved 1440 (hjul og taster) og 390 (sveip). Ett scrollforsøk starter filmen; deretter
// raske scrollforsøk begge veier ved ca. 3 s og 12 s. Hvert bilde logges: filmtid, bildet som vises, scrollposisjon,
// lås, synlige replikker og utsnitt. Etter filmslutt: vanlig scroll, og tilbake til toppen starter ikke filmen på nytt.
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage(); const feil = [];
  p.on('pageerror', e => feil.push(e.message));
  await p.goto(url, { waitUntil: 'networkidle' }); await klar(p);
  await p.evaluate(RANGER => {
    const v = document.querySelector('video'), s = document.querySelector('.ks-film'), d = document.documentElement;
    window.__h = { play: 0, pause: 0, seeking: 0, rate: 0 }; for (const n of ['play', 'pause', 'seeking', 'ratechange']) v.addEventListener(n, () => window.__h[n === 'ratechange' ? 'rate' : n]++);
    window.__l = []; const t0 = performance.now();
    const g = () => {
      const vist = +(s.dataset.vist || 0), k = getComputedStyle(document.querySelector('.ks-film-bilde')).clipPath, rad = +(k.match(/circle\(([\d.]+)%/) || [0, 0])[1];
      const sk = +getComputedStyle(document.querySelector('.ks-replikker')).opacity;
      const lis = [...document.querySelectorAll('.ks-replikk')].map((e, i) => [i, sk * +getComputedStyle(e).opacity]).filter(([, o]) => o > .01);
      const hopp = getComputedStyle(document.querySelector('.ks-hopp')); const hoppSynlig = hopp.visibility === 'visible' && +hopp.opacity > .01;
      window.__l.push({ ms: performance.now() - t0, ct: v.currentTime, vist, utsnittTid: +(s.dataset.utsnittTid || 0), pos: v.style.objectPosition, y: scrollY, lås: d.classList.contains('ks-las'), tilstand: s.dataset.tilstand, rep: +(s.dataset.replikk || 0), rad, tekst: lis.length > 0 || hoppSynlig, feil: lis.filter(([i]) => vist < RANGER[i][0] || vist > RANGER[i][1]).map(([i]) => `replikk ${i + 1} ved ${vist.toFixed(2)} s`), rate: v.playbackRate });
      if (s.dataset.tilstand !== 'ferdig' && performance.now() - t0 < 45000) requestAnimationFrame(g);
    };
    requestAnimationFrame(g);
  }, RANGER);
  await scrollForsøk(p, w, 120); // ett kort scrollforsøk
  const bølge = async () => { for (let i = 0; i < 6; i++) { await scrollForsøk(p, w, i % 2 ? -600 : 600); if (w >= 768) await p.keyboard.press(['PageDown', 'ArrowUp', 'Space', 'Home', 'End', 'ArrowDown'][i]); await p.waitForTimeout(60); } };
  await p.waitForTimeout(3000); await bølge(); await p.waitForTimeout(8000); await bølge();
  await venteTilstand(p, 'ferdig', 40000); await p.waitForTimeout(300);
  const l = await p.evaluate(() => window.__l), hend = await p.evaluate(() => window.__h);
  const dur = await p.evaluate(() => document.querySelector('video').duration);
  const spill = l.filter(x => x.tilstand === 'spiller'), førsteSpill = spill[0], sisteSpill = spill.at(-1);
  // Hastighet: filmtid mot veggtid over hele avspillingen, og lengste stopp i filmtiden mens den skulle spille.
  const fart = (sisteSpill.ct - førsteSpill.ct) / ((sisteSpill.ms - førsteSpill.ms) / 1000);
  let stopp = 0; for (let i = 1, s0 = spill[0]; i < spill.length; i++) { if (spill[i].ct > s0.ct + .001) s0 = spill[i]; else stopp = Math.max(stopp, spill[i].ms - s0.ms); }
  const maksY = Math.max(...l.map(x => x.y)), låstUnder = spill.every(x => x.lås);
  const rekke = l.map(x => x.rep).filter((r, i, a) => r && r !== a[i - 1]);
  const brudd = l.flatMap(x => x.feil), førSirkel = l.filter(x => x.tekst && x.rad < 70 && x.tilstand !== 'ferdig');
  const utsnittAvvik = l.filter(x => x.tilstand === 'spiller' && Math.abs(x.utsnittTid - x.vist) > .001).length, posisjoner = [...new Set(spill.map(x => x.pos))].length;
  check(`P1 ${w}`, 'Ett scrollforsøk starter filmen; den spiller sammenhengende i 1× til slutt uten flere innspill', hend.play === 1 && hend.pause === 1 && hend.seeking === 0 && hend.rate === 0 && fart > .95 && fart < 1.05 && l.at(-1).tilstand === 'ferdig' && Math.abs(sisteSpill.ct - dur) < .3 && feil.length === 0,
    `play ${hend.play}, pause ${hend.pause} (ved filmslutt), spolinger ${hend.seeking}, hastighetsendringer ${hend.rate}; filmtid/veggtid ${fart.toFixed(3)} over ${((sisteSpill.ms - førsteSpill.ms) / 1000).toFixed(1)} s; lengste stopp i filmtiden ${Math.round(stopp)} ms; siste filmtid ${sisteSpill.ct.toFixed(2)} av ${dur.toFixed(2)} s; feil: ${feil.join('; ') || 'ingen'}`);
  check(`P2 ${w}`, `Raske scrollforsøk begge veier under filmen (${w < 768 ? 'sveip' : 'hjul og taster'}) påvirker ikke avspillingen og flytter ikke siden`, maksY === 0 && låstUnder && hend.seeking === 0 && hend.pause === 1 && spill.every(x => x.rate === 1),
    `største scrollY under forløpet ${maksY}; låst i alle ${spill.length} bilder under avspilling ${låstUnder}; spolinger ${hend.seeking}, pauser før slutt ${hend.pause - 1}`);
  check(`P3 ${w}`, 'Replikker og utsnitt følger bildet som faktisk vises', rekke.join() === '1,2,3,4' && brudd.length === 0 && førSirkel.length === 0 && utsnittAvvik === 0 && (w < 768 ? posisjoner >= 5 : true),
    `replikker i rekkefølge ${rekke.join('→')}; ${l.length} bilder, replikk over feil filmtid: ${brudd.length ? [...new Set(brudd)].slice(0, 4).join('; ') : 'ingen'}; tekst/lenke før sirkelen dekker: ${førSirkel.length}; utsnitt fra annen tid enn bildet som vises: ${utsnittAvvik}${w < 768 ? `; ulike utsnitt ${posisjoner}` : ''}`);
  // Etter filmslutt: siden frigjort, siste bilde står, vanlig scroll videre; tilbake til toppen gir ingen ny avspilling.
  const før = await p.evaluate(() => ({ lås: document.documentElement.classList.contains('ks-las'), ct: document.querySelector('video').currentTime, synlig: document.querySelector('.ks-film-bilde').getBoundingClientRect().top }));
  await scrollForsøk(p, w, 500); await p.waitForTimeout(700);
  const y1 = await p.evaluate(() => scrollY);
  await scrollForsøk(p, w, -3000); await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(900); await scrollForsøk(p, w, 120); await p.waitForTimeout(1500);
  const etter = await p.evaluate(() => ({ t: document.querySelector('.ks-film').dataset.tilstand, ct: document.querySelector('video').currentTime, paused: document.querySelector('video').paused, play: window.__h.play }));
  check(`P4 ${w} slutt`, 'Filmslutt frigjør scroll, siste bilde står, ingen ny avspilling ved scroll tilbake til toppen', !før.lås && før.synlig === 0 && Math.abs(før.ct - dur) < .1 && y1 > 100 && etter.t === 'ferdig' && etter.paused && etter.play === 1 && Math.abs(etter.ct - før.ct) < .01,
    `ved slutt: låst ${før.lås}, filmtid ${før.ct.toFixed(2)} s; scroll etterpå: scrollY ${Math.round(y1)}; tilbake til toppen og nytt scrollforsøk: tilstand ${etter.t}, pauset ${etter.paused}, avspillinger totalt ${etter.play}, filmtid ${etter.ct.toFixed(2)} s`);
  await c.close();
}

// P4: «Til tjenester» midt i filmen (mus og tastatur) og menyvalg frigjør siden og stopper filmen
for (const [w, h, måte] of [[1440, 900, 'klikk'], [1440, 900, 'tastatur'], [390, 844, 'trykk']]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await klar(p); await startFilm(p, w); await p.waitForTimeout(2500);
  const hopp = await p.evaluate(() => { const e = document.querySelector('.ks-hopp'), r = e.getBoundingClientRect(), el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { tekst: e.textContent.trim(), venstre: r.left < innerWidth * .3, nede: r.bottom > innerHeight * .85, udekket: !!el && (e.contains(el) || el === e) }; });
  let ring = true;
  if (måte === 'tastatur') { await p.focus('.ks-hopp'); ring = await p.evaluate(() => getComputedStyle(document.activeElement).outlineStyle !== 'none'); await p.keyboard.press('Enter'); }
  else if (måte === 'trykk') await p.tap('.ks-hopp'); else await p.click('.ks-hopp');
  await p.waitForTimeout(700);
  const r = await p.evaluate(() => ({ t: document.querySelector('.ks-film').dataset.tilstand, paused: document.querySelector('video').paused, lås: document.documentElement.classList.contains('ks-las'), topp: Math.round(document.getElementById('tjenester').getBoundingClientRect().top), meny: Math.round(document.querySelector('.cm-topp').getBoundingClientRect().bottom), hash: location.hash, ct: document.querySelector('video').currentTime }));
  await scrollForsøk(p, w, 400); await p.waitForTimeout(500); const y2 = await p.evaluate(() => scrollY);
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(800); await scrollForsøk(p, w, 120); await p.waitForTimeout(1300);
  const igjen = await p.evaluate(() => ({ t: document.querySelector('.ks-film').dataset.tilstand, paused: document.querySelector('video').paused }));
  check(`P4 ${w} ${måte}`, `«Til tjenester» (${måte}) stopper filmen, frigjør siden og går til tjenestene`, hopp.tekst.startsWith('Til tjenester') && hopp.venstre && hopp.nede && hopp.udekket && ring && r.t === 'avbrutt' && r.paused && !r.lås && r.topp >= r.meny - 2 && r.topp <= r.meny + 40 && r.hash === '#tjenester' && y2 > 0 && igjen.t === 'avbrutt' && igjen.paused,
    `«${hopp.tekst}» nede til venstre ${hopp.venstre && hopp.nede}, udekket ${hopp.udekket}${måte === 'tastatur' ? `, fokusring ${ring}` : ''}; etter: tilstand ${r.t}, pauset ${r.paused} ved ${r.ct.toFixed(2)} s, låst ${r.lås}, tjenestene ${r.topp} px fra toppen (menyen slutter ${r.meny} px), ${r.hash}; scroll videre ${y2 > 0}; tilbake til toppen: ${igjen.t}, pauset ${igjen.paused}`);
  await c.close();
}
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await klar(p); await startFilm(p, w); await p.waitForTimeout(2000);
  if (w < 768) { await p.tap('.cm-menyknapp'); await p.waitForTimeout(250); }
  const meny = await p.evaluate(() => [...document.querySelectorAll('.cm-meny ul a')].filter(a => a.getBoundingClientRect().height > 0).map(a => a.textContent.trim()));
  await Promise.all([p.waitForURL('**/om-oss'), w < 768 ? p.tap('.cm-meny a[href="/om-oss"]') : p.click('.cm-meny a[href="/om-oss"]')]);
  const ny = await p.evaluate(() => ({ sti: location.pathname, lås: document.documentElement.classList.contains('ks-las') }));
  await p.goBack({ waitUntil: 'load' }); await p.waitForTimeout(600);
  const tilbake = await p.evaluate(() => ({ lås: document.documentElement.classList.contains('ks-las'), t: document.querySelector('.ks-film')?.dataset.tilstand, y: Math.round(scrollY) }));
  // Tilbake gir en ny sidevisning: enten den hvite åpningen (et scrollforsøk starter filmen) eller en frigjort side.
  await scrollForsøk(p, w, 400); await p.waitForTimeout(1600);
  const så = await p.evaluate(() => ({ y: Math.round(scrollY), t: document.querySelector('.ks-film').dataset.tilstand }));
  check(`P5 ${w}`, 'Menyvalg midt i filmen forlater filmen uten gjenværende scrollås, også etter Tilbake', meny.length >= 3 && ny.sti === '/om-oss' && !ny.lås && !tilbake.lås && (tilbake.t === 'klar' ? så.t === 'spiller' : så.y > tilbake.y),
    `menylenker ${meny.join(', ')}; ny side ${ny.sti}, låst ${ny.lås}; etter Tilbake: låst ${tilbake.lås}, tilstand ${tilbake.t}, scrollY ${tilbake.y}; etter et scrollforsøk: tilstand ${så.t}, scrollY ${så.y}`);
  await c.close();
}

// P6: nettleseren avviser avspilling (simulert: play() gir NotAllowedError, slik en nettleser med blokkert autoavspilling
// gjør) – egen «Spill av filmen»-kontroll vises, siden er frigjort, og kontrollen starter filmen
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.addInitScript(() => { const ekte = HTMLMediaElement.prototype.play; window.__avvis = true; HTMLMediaElement.prototype.play = function () { if (window.__avvis) return Promise.reject(new DOMException('blokkert i testen', 'NotAllowedError')); return ekte.call(this); }; });
  await p.goto(url, { waitUntil: 'networkidle' }); await klar(p);
  await scrollForsøk(p, w, 120); await p.waitForTimeout(1700);
  const r = await p.evaluate(() => { const k = document.querySelector('.ks-spill'), q = k.getBoundingClientRect(), el = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return { t: document.querySelector('.ks-film').dataset.tilstand, synlig: q.width > 0 && !!el && (k === el || k.contains(el)), navn: k.textContent.trim(), tag: k.tagName, lås: document.documentElement.classList.contains('ks-las'), hopp: getComputedStyle(document.querySelector('.ks-hopp')).visibility }; });
  await p.focus('.ks-spill'); const ring = await p.evaluate(() => getComputedStyle(document.activeElement).outlineStyle !== 'none');
  await p.evaluate(() => { window.__avvis = false; }); await p.keyboard.press('Enter'); await p.waitForTimeout(1200);
  const etter = await p.evaluate(() => ({ t: document.querySelector('.ks-film').dataset.tilstand, ct: document.querySelector('video').currentTime, lås: document.documentElement.classList.contains('ks-las'), skjult: getComputedStyle(document.querySelector('.ks-spill')).display }));
  check(`P6 ${w}`, 'Blokkert avspilling: «Spill av filmen» vises, siden er frigjort, kontrollen starter filmen', r.t === 'blokkert' && r.synlig && r.tag === 'BUTTON' && r.navn === 'Spill av filmen' && !r.lås && r.hopp === 'visible' && ring && etter.t === 'spiller' && etter.ct > .3 && etter.lås && etter.skjult === 'none',
    `etter scrollforsøk: tilstand ${r.t}, <${r.tag.toLowerCase()}> «${r.navn}» synlig ${r.synlig}, fokusring ${ring}, låst ${r.lås}, «Til tjenester» ${r.hopp}; etter Enter: ${etter.t}, filmtid ${etter.ct.toFixed(2)} s, låst ${etter.lås}, kontrollen ${etter.skjult}`);
  await c.close();
}

// R1–R5: hovedskriptet tar ikke over som normalt. Siden skal da vise det statiske alternativet (ingen tom, festet
// strekning), og et skript som kommer sent skal ikke gi overlappende oppsett eller hopp.
const HOVED = /\/assets\/index-[^/]*\.js$/;
const vent = ms => new Promise(r => setTimeout(r, ms));
const tilstand = p => p.evaluate(() => {
  const d = document.documentElement, s = document.querySelector('.ks-film'), k = document.querySelector('.ks-cidea').getBoundingClientRect();
  const synligeFilmdeler = [...document.querySelectorAll('.ks-replikk, .ks-hopp')].filter(e => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && e.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && +getComputedStyle(e).opacity > .02; }).length;
  return { reserve: d.classList.contains('js-reserve'), feil: d.classList.contains('js-feil'), klar: d.hasAttribute('data-js-klar'), aktiv: s.classList.contains('ks-film-aktiv'), statisk: s.classList.contains('ks-statisk'),
    sticky: getComputedStyle(s.querySelector('.ks-film-scene')).position, seksjonVh: +(s.offsetHeight / innerHeight).toFixed(2), y: Math.round(scrollY), knapp: [Math.round(k.left + k.width / 2), Math.round(k.top + k.height / 2)], synligeFilmdeler,
    h1: Math.round(document.querySelector('h1').getBoundingClientRect().top + scrollY) };
});
// Største sammenhengende scrollstrekning der skjermen bare viser tom flate (ingen tekst, bilde eller video i midtlinjen)
const tomStrekning = p => p.evaluate(async () => {
  const raf = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const tot = document.documentElement.scrollHeight - innerHeight; let maks = 0, nå = 0;
  for (let y = 0; y <= tot; y += 50) {
    scrollTo(0, y); await raf();
    const innhold = [.2, .35, .5, .65, .8].some(fy => { for (const fx of [.1, .3, .5, .7, .9]) { const el = document.elementFromPoint(innerWidth * fx, innerHeight * fy); if (!el || el.closest('.cm-topp')) continue; if (el.closest('video, img, figure, a, button, h1, h2, h3, p, li, span')) return true; } return false; });
    if (innhold) nå = 0; else { nå += 50; maks = Math.max(maks, nå); }
  }
  scrollTo(0, 0); return maks;
});
for (const [w, h] of [[1440, 900], [390, 844]]) {
  // R1: hovedskriptet blokkeres (nettverksfeil) – statisk alternativ straks, menyen virker uten JS, ingen film lastes
  {
    const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage(); const film = [];
    p.on('request', q => /\/film\/.*\.(mp4|webm)$/.test(q.url()) && film.push(q.url()));
    await p.route(HOVED, r => r.abort());
    await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(400);
    const t = await tilstand(p); const tom = await tomStrekning(p);
    const meny = await p.evaluate(() => ({ lenker: [...document.querySelectorAll('.cm-meny ul a')].filter(a => a.getBoundingClientRect().height > 0).length, knapp: getComputedStyle(document.querySelector('.cm-menyknapp')).display }));
    const innhold = await p.evaluate(() => [...document.querySelectorAll('.ks-replikk, .ks-film-bilde, h1')].every(e => { e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(), el = document.elementFromPoint(r.left + Math.min(20, r.width / 2), r.top + Math.min(12, r.height / 2)); return +getComputedStyle(e).opacity > .99 && !!el && (e.contains(el) || el.contains(e)); }));
    check(`R1 ${w}`, 'Hovedskript blokkert: statisk alternativ uten tom strekning, meny uten JS, ingen filmnedlasting', t.reserve && t.feil && !t.klar && t.sticky !== 'sticky' && t.seksjonVh < 2.6 && tom <= h * 1.05 && innhold && (w < 768 ? meny.lenker >= 3 && meny.knapp === 'none' : true) && film.length === 0,
      `reserve ${t.reserve}, js-feil ${t.feil}, scene ${t.sticky}, filmseksjonen ${t.seksjonVh} skjermhøyder (aktivt oppsett: 1,0); lengste tomme strekning ${tom} px (åpningen er én skjermhøyde, ${h} px); plakat, replikker og H1 synlige ${innhold}; ${w < 768 ? `menylenker synlige ${meny.lenker}, menyknapp ${meny.knapp}; ` : ''}filmforespørsler ${film.length}`);
    await c.close();
  }
  // R2: hovedskriptet henger (svarer aldri) – ren åpning til reserven slår inn etter 5 s, deretter statisk uten hopp
  {
    const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
    await p.route(HOVED, () => {}); // aldri besvart
    await p.addInitScript(loggInit);
    await p.goto(url, { waitUntil: 'commit' }); await p.waitForSelector('.ks-cidea'); await p.waitForTimeout(1200);
    const før = await tilstand(p); await p.waitForTimeout(4300); const etter = await tilstand(p);
    const l = await p.evaluate(() => window.__logg); const tom = await tomStrekning(p);
    check(`R2 ${w}`, 'Hovedskript henger: ren åpning, reserve etter 5 s, knappen flytter seg ikke', !før.reserve && før.synligeFilmdeler === 0 && etter.reserve && !etter.klar && etter.sticky !== 'sticky' && etter.knapp.join() === før.knapp.join() && l.every(x => !x.vis.length) && tom <= h * 1.05,
      `ved 1,2 s: reserve ${før.reserve}, filmtekst/kontroller synlige ${før.synligeFilmdeler}; ved 5,5 s: reserve ${etter.reserve}, scene ${etter.sticky}; CIDEA-knappens senter ${før.knapp.join(',')} → ${etter.knapp.join(',')}; bilder med filmtekst over åpningen: ${l.filter(x => x.vis.length).length} av ${l.length}; lengste tomme strekning ${tom} px`);
    await c.close();
  }
  // R3: leseren scroller før hovedskriptet er klart (skriptet henger) – statisk med en gang, ingen tom strekning å scrolle gjennom
  {
    const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
    await p.route(HOVED, () => {});
    await p.goto(url, { waitUntil: 'commit' }); await p.waitForSelector('.ks-cidea'); await p.waitForTimeout(800);
    if (w === 1440) { await p.mouse.move(700, 450); await p.mouse.wheel(0, h * 1.3); } else { await p.dispatchEvent('body', 'touchmove'); await p.evaluate(h => scrollBy(0, h * 1.3), h); }
    await p.waitForTimeout(500);
    const t = await tilstand(p);
    const ser = await p.evaluate(() => { const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2); return el?.closest('figure, .ks-replikker, .ks-ord, video') ? (el.closest('figure, .ks-replikker, .ks-ord, video').className || el.tagName) : (el?.className || 'ingenting'); });
    check(`R3 ${w}`, 'Leseren scroller før skriptet er klart: statisk innhold, ikke tom hvit flate', t.reserve && t.sticky !== 'sticky' && /ks-film-bilde|ks-replikker|ks-ord|ks-video/.test(ser),
      `reserve ${t.reserve}, scene ${t.sticky}, scrollY ${t.y}; midt i skjermen: ${ser}`);
    await c.close();
  }
  // R4: hovedskriptet kommer etter 7 s mens leseren står i åpningen – bytter til film uten hopp og uten tekstblink
  {
    const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
    await p.route(HOVED, async r => { await vent(7000); await r.continue().catch(() => {}); });
    await p.addInitScript(() => { window.__r4 = []; const t0 = performance.now(); const g = () => { const s = document.querySelector('.ks-film'); if (s) { const k = document.querySelector('.ks-cidea').getBoundingClientRect(); window.__r4.push({ t: Math.round(performance.now() - t0), k: Math.round(k.top + k.height / 2) + ',' + Math.round(k.left + k.width / 2), vis: [...document.querySelectorAll('.ks-replikk, .ks-hopp')].filter(e => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && e.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && +getComputedStyle(e).opacity > .02; }).length, y: Math.round(scrollY) }); } if (performance.now() - t0 < 9500) requestAnimationFrame(g); }; requestAnimationFrame(g); });
    await p.goto(url, { waitUntil: 'commit' }); await p.waitForSelector('.ks-cidea'); await p.waitForTimeout(5600);
    const før = await tilstand(p);
    await p.waitForFunction(() => document.documentElement.hasAttribute('data-js-klar'), null, { timeout: 15000 }); await p.waitForTimeout(800);
    const etter = await tilstand(p); const l = await p.evaluate(() => window.__r4);
    const posisjoner = [...new Set(l.map(x => x.k))], blink = l.filter(x => x.vis).length;
    await klar(p); await scrollForsøk(p, w, 120); await p.waitForTimeout(1600);
    const åpnet = await p.evaluate(() => document.querySelector('.ks-film').dataset.apning + '/' + document.querySelector('.ks-film').dataset.tilstand);
    check(`R4 ${w}`, 'Skript kommer etter 7 s, leseren i åpningen: reserve → film uten hopp eller tekstblink, filmen virker', før.reserve && !etter.reserve && etter.aktiv && etter.y === 0 && posisjoner.length === 1 && blink === 0 && åpnet === 'apen/spiller',
      `ved 5,6 s: reserve ${før.reserve} (scene ${før.sticky}); etter skriptet: reserve ${etter.reserve}, film styrt av JS ${etter.aktiv}, scrollY ${etter.y}; CIDEA-knappens posisjoner gjennom hele forløpet: ${posisjoner.join(' | ')}; bilder med filmtekst/kontroller over åpningen: ${blink} av ${l.length}; første scrollforsøk etterpå: ${åpnet}`);
    await c.close();
  }
  // R5: hovedskriptet kommer etter 7 s, men leseren har scrollet inn i det statiske innholdet – oppsettet beholdes
  {
    const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage(); const film = [];
    p.on('request', q => /\/film\/.*\.(mp4|webm)$/.test(q.url()) && film.push(q.url()));
    await p.route(HOVED, async r => { await vent(7000); await r.continue().catch(() => {}); });
    await p.goto(url, { waitUntil: 'commit' }); await p.waitForSelector('.ks-cidea'); await p.waitForTimeout(1000);
    if (w === 1440) { await p.mouse.move(700, 450); await p.mouse.wheel(0, h * 1.4); } else { await p.dispatchEvent('body', 'touchmove'); await p.evaluate(h => scrollBy(0, h * 1.4), h); }
    await p.waitForTimeout(600);
    const før = await tilstand(p);
    const plakatFør = await p.evaluate(() => Math.round(document.querySelector('.ks-film-bilde').getBoundingClientRect().top));
    await p.waitForFunction(() => document.documentElement.hasAttribute('data-js-klar'), null, { timeout: 15000 }); await p.waitForTimeout(1000);
    const etter = await tilstand(p);
    const plakatEtter = await p.evaluate(() => Math.round(document.querySelector('.ks-film-bilde').getBoundingClientRect().top));
    check(`R5 ${w}`, 'Skript kommer etter 7 s, leseren har scrollet: statisk oppsett beholdes, ingenting flytter seg', før.reserve && etter.statisk && etter.reserve && etter.sticky !== 'sticky' && etter.y === før.y && plakatEtter === plakatFør && etter.h1 === før.h1 && film.length === 0,
      `før skriptet: scrollY ${før.y}, plakat ${plakatFør} px, H1 ved ${før.h1}; etter: statisk ${etter.statisk}, scene ${etter.sticky}, scrollY ${etter.y}, plakat ${plakatEtter} px, H1 ved ${etter.h1}; filmforespørsler ${film.length}`);
    await c.close();
  }
}

// B3: siden lastes på nytt nede på siden (gjenopprettet scrollposisjon) – filmen starter ikke av seg selv, ingen
// scrollås, plakatbildet i scenen; heller ikke når leseren scroller tilbake til toppen
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' });
  await til(p, await p.evaluate(() => document.getElementById('tjenester').getBoundingClientRect().top + scrollY));
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(2500);
  const r = await p.evaluate(() => ({ y: Math.round(scrollY), t: document.querySelector('.ks-film').dataset.tilstand, lås: document.documentElement.classList.contains('ks-las'), paused: document.querySelector('video').paused, plakat: document.querySelector('video').poster.endsWith('cidea-film-plakat.jpg') }));
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(600); await scrollForsøk(p, w, 120); await p.waitForTimeout(1500);
  const topp = await p.evaluate(() => ({ t: document.querySelector('.ks-film').dataset.tilstand, paused: document.querySelector('video').paused, y: Math.round(scrollY) }));
  check(`B3 ${w}`, 'Ny innlasting nede på siden: ingen automatisk avspilling eller lås, heller ikke ved scroll til toppen', r.y > 0 && r.t === 'hoppet' && !r.lås && r.paused && r.plakat && topp.t === 'hoppet' && topp.paused && topp.y > 0,
    `etter ny innlasting: scrollY ${r.y}, tilstand ${r.t}, låst ${r.lås}, pauset ${r.paused}, plakat ${r.plakat}; til toppen og nytt scrollforsøk: tilstand ${topp.t}, pauset ${topp.paused}, siden scrollet ${topp.y} px`);
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

// K3: scroll styrer ikke filmen – filmscenen er én skjermhøyde uten festet strekning, og scroll i hele siden
// (uten at filmen er startet) endrer ikke filmtiden
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await klar(p);
  const r = await p.evaluate(async () => {
    const raf = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))), v = document.querySelector('video'), tider = new Set();
    for (let y = 0; y <= document.documentElement.scrollHeight; y += 200) { scrollTo(0, y); await raf(); tider.add(v.currentTime.toFixed(2)); }
    return { festet: [...document.querySelectorAll('.ks *')].filter(e => getComputedStyle(e).position === 'sticky').length, høyde: +(document.querySelector('.ks-film').offsetHeight / innerHeight).toFixed(2), tider: [...tider] };
  });
  check(`K3 ${w}`, 'Scroll styrer ikke filmen: scenen er én skjermhøyde, ingen festet strekning', r.festet === 0 && r.høyde <= 1.01 && r.tider.length === 1, `festede elementer ${r.festet}; filmscenen ${r.høyde} skjermhøyder (før 4,2 / 3,6); filmtider sett under scroll gjennom hele siden: ${r.tider.join(', ')}`);
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

// F2: fire replikker i filmen; «Bli sett. Bli valgt.» står bare som stor overskrift etter filmen
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url, { waitUntil: 'networkidle' });
  const t = await p.evaluate(() => ({ film: [...document.querySelectorAll('.ks-replikk')].map(e => e.textContent), etter: document.querySelector('.ks-ordpar')?.textContent, alle: document.body.textContent.match(/Bli sett/gi)?.length || 0 }));
  check('F2', 'Fire replikker i filmen; «Bli sett / Bli valgt» bare som overskrift etter filmen', t.film.join('|') === REPLIKKER.join('|') && /Bli sett\s*Bli valgt/.test(t.etter) && t.alle === 1, `replikker: ${t.film.join(' · ')}; overskrift etter filmen «${t.etter}»; «Bli sett» forekommer ${t.alle} gang(er)`);
  await p.close();
}

// F3: brede skjermer – hver replikk i sitt hjørne, oppå filmen, under toppmenyen og utenfor hoppelenken
for (const [w, h] of [[1440, 900], [1280, 720], [1920, 1080], [1024, 768]]) {
  const c = await b.newContext({ viewport: { width: w, height: h } }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); await klar(p); await startFilm(p, w); await p.waitForTimeout(400);
  const ut = [];
  for (const [i, t] of MIDT.entries()) {
    await påTid(p, t);
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
  await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); await klar(p); await startFilm(p, w); await p.waitForTimeout(400);
  const ut = [];
  for (const [i, t] of MIDT.entries()) {
    await påTid(p, t);
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
  await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); await klar(p); await startFilm(p, w); await p.waitForTimeout(400);
  // Målepunkter: midten og første/siste tidspunkt der replikken er helt synlig (inn-/uttoning er 0,4 filmsekunder).
  // Under inn- og uttoningen er teksten delvis gjennomsiktig; der måles ikke kontrast.
  const ut = [];
  for (const [i, [fra, tilT]] of RANGER.entries()) {
    for (const [t, dq] of [[fra + .47, -1], [(fra + tilT) / 2, 0], [tilT - .47, 1]]) {
      await påTid(p, t);
      if (!(await p.evaluate(nr => +getComputedStyle(document.querySelector(`.ks-replikk[data-nr="${nr}"]`)).opacity >= .99, i + 1))) { ut.push({ nr: i + 1, dq, k: 0 }); continue; }
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
  check(`F5 ${w}`, 'Kontrast: hvit replikk mot filmbildet bak (lyseste 5 %) der replikken er helt synlig', min >= 4.5, ut.filter(x => x.dq === 0).map(x => `${x.nr}: ${x.k.toFixed(2)}:1`).join(', ') + `; laveste inkl. start og slutt av fullt synlig del ${min.toFixed(2)}:1 (krav 4,5:1)`);
  await c.close();
}

// M1: toppmenyen er fast og udekket i hele forløpet, og lesbar i lys og mørk tilstand (kontrast mot bakgrunnen
// lagt over både hvitt og svart, dvs. verste tilfelle over filmen)
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await klar(p);
  const ut = [];
  for (const navn of ['åpning', 'film', 'filmslutt', 'tjenester', 'bunn']) {
    if (navn === 'film') { await startFilm(p, w); await p.waitForTimeout(1500); }
    if (navn === 'filmslutt') await tilSlutt(p);
    if (navn === 'tjenester') await til(p, await p.evaluate(() => document.getElementById('tjenester').getBoundingClientRect().top + scrollY));
    if (navn === 'bunn') await til(p, 1e6);
    await p.waitForTimeout(400);
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
  await p.goto(url, { waitUntil: 'networkidle' }); await klar(p); await startFilm(p, 390); await p.waitForTimeout(1300);
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

// F6: «Til tjenester» – skjult i den hvite åpningen, synlig gjennom filmscenen (også etter filmslutt)
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, ...mobil(w) }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await klar(p);
  const synlig = () => p.evaluate(() => { const e = document.querySelector('.ks-hopp'), cs = getComputedStyle(e); return cs.visibility === 'visible' && +cs.opacity > .99; });
  const før = await synlig(); await startFilm(p, w); await p.waitForTimeout(600); const under = await synlig(); await tilSlutt(p); const slutt = await synlig();
  check(`F6 ${w}`, '«Til tjenester»: skjult i åpningen, synlig under filmen og ved filmslutt', !før && under && slutt, `åpning ${før}, under filmen ${under}, ved filmslutt ${slutt}`);
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
  check(`K9 ${w}`, 'Tastatur: logisk rekkefølge og synlig, udekket fokus', skjult.length === 0 && !rekke.includes('CIDEA') && rekke.includes('Snakk med oss →') && rekke.includes('Personvern'), `${skjult.length ? 'problemer: ' + skjult.join(', ') + ' – ' : ''}${rekke.length} fokusmål: ${rekke.join(' · ')}`);
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
  const r = await p.evaluate(() => { const s = document.querySelector('.ks-film'); return { aktiv: s.classList.contains('ks-film-aktiv'), statisk: s.classList.contains('ks-statisk'), apning: s.dataset.apning || '', sticky: getComputedStyle(s.querySelector('.ks-film-scene')).position, synlige: [...s.querySelectorAll('.ks-replikk')].filter(e => +getComputedStyle(e).opacity > .99 && e.getBoundingClientRect().height > 0).length, meny: document.querySelector('.cm').dataset.meny || '', plakat: document.querySelector('.ks-video').poster.endsWith('cidea-film-plakat.jpg') }; });
  check(`F7 ${w}`, 'Filmen kan ikke lastes: statisk oppsett med alle replikker', !r.aktiv && r.statisk && !r.apning && r.sticky !== 'sticky' && r.synlige === 4 && r.plakat && !r.meny, `aktiv ${r.aktiv}, apning «${r.apning}», scene ${r.sticky}, ${r.synlige}/4 replikker synlige, plakat ${r.plakat}, menytilstand «${r.meny || 'lys'}»`);
  await c.close();
}

// F9: lastetid – ingen filmforespørsel før siden er lastet; med strupet nett (ca. 4G: 9 Mbit/s, 85 ms) og en leser som
// ser på åpningen i 1,5 s før første scrollforsøk, spiller filmen innen sirkelåpningen er ferdig og stopper ikke underveis
{
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, ...mobil(390) }); const p = await c.newPage();
  const cdp = await c.newCDPSession(p); await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 85, downloadThroughput: 9e6 / 8, uploadThroughput: 1.5e6 / 8 });
  const film = []; p.on('request', q => /\/film\/.*\.(mp4|webm)$/.test(q.url()) && film.push({ u: q.url().split('/').pop(), t: Date.now() }));
  const t0 = Date.now(); let lastet = 0; p.once('load', () => { lastet = Date.now(); });
  await p.goto(url, { waitUntil: 'load' }); lastet ||= Date.now();
  await p.evaluate(() => { window.__vent = 0; document.querySelector('video').addEventListener('waiting', () => window.__vent++); });
  await p.waitForTimeout(1500);
  const tStart = Date.now(); await sveip(p, 120);
  await p.waitForFunction(() => +document.querySelector('.ks-film').dataset.vist > .2, null, { timeout: 20000 }); const tSpill = Date.now();
  await venteTilstand(p, 'ferdig', 40000);
  const vent = await p.evaluate(() => window.__vent);
  check('F9', 'Lastetid: filmen lastes etter siden, spiller innen åpningen er ferdig og stopper ikke (strupet 4G)', film.length >= 1 && film[0].t >= lastet && tSpill - tStart < 1100 + 900 && vent <= 1,
    `siden lastet etter ${((lastet - t0) / 1000).toFixed(1)} s; første filmforespørsel (${film[0]?.u}) etter ${film[0] ? ((film[0].t - t0) / 1000).toFixed(1) + ' s' : 'ingen'}; fra scrollforsøk til filmen går: ${tSpill - tStart} ms (åpningen tar 1100 ms); venting på data under avspillingen: ${vent}`);
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
writeFileSync(`${here}KONSEPT-FILM-RESULTAT.md`, `# Testresultat – prototype /konsept-scroll\n\nKjørt ${new Date().toISOString()} mot \`dist/\` (Netlify-regel). Chromium, og Firefox og WebKit fra Playwright der de er installert. Automatiske målinger, ikke en WCAG-samsvarserklæring.\n\n| ID | Test | Resultat | Måling |\n|---|---|---|---|\n${res.join('\n')}\n\n**${res.length - fail - ikkeKjort} av ${res.length} bestått${ikkeKjort ? `, ${ikkeKjort} ikke kjørt` : ''}.**\n`);
console.log(`${res.length - fail - ikkeKjort}/${res.length} OK${ikkeKjort ? `, ${ikkeKjort} ikke kjørt` : ''}`);
process.exit(fail ? 1 : 0);
