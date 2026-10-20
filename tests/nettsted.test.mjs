// Fase 6 – struktur og funksjon for hele nettstedet mot byggede dist/ (Netlify-regel: fil → mappe/index.html → 404.html).
// Kjør etter `npm run build`: node tests/nettsted.test.mjs → tests/NETTSTED-RESULTAT.md + oversiktsbilder i
// docs/cinematic-pilot/phase6/bilder/. Automatiske målinger; estetisk godkjenning gjenstår uansett.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { serve } from './serve-dist.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const bilder = fileURLToPath(new URL('../docs/cinematic-pilot/phase6/bilder/', import.meta.url));
mkdirSync(bilder, { recursive: true });
const server = await serve(4183); const base = 'http://127.0.0.1:4183';
const res = []; let fail = 0;
const check = (id, navn, ok, mål) => { res.push(`| ${id} | ${navn} | ${ok ? 'OK' : '**FEIL**'} | ${mål} |`); if (!ok) fail++; console.log(ok ? 'OK  ' : 'FEIL', id, navn, '–', mål); };
const mobil = w => (w < 768 ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {});
const sider = ['/konsept-scroll', '/tjenester', '/websites', '/branding', '/seo', '/digital-marketing', '/om-oss', '/blog',
  '/blog/hvor-mye-koster-en-nettside', '/blog/hva-bor-en-god-bedriftsnettside-inneholde', '/blog/hvorfor-vises-ikke-nettsiden-pa-google', '/blog/hvordan-fa-flere-henvendelser-fra-nettsiden',
  '/kontakt', '/personvern', '/'];
const BANNED = /\b(Nettsteder|kompromissløs\w*|lynrask\w*|Les mer|gratis|garanti\w*)\b|(^|\s)0[1-9](\s|$)/gim;
const ENGELSK = /\b(Read more|Learn more|Contact us|Services|Our work|Get started|Insights|About us|Home|Submit|Menu|Close)\b/g;
const b = await chromium.launch();

// S1: direktelenke/oppdatering – hver side svarer 200 med én H1, uten nettleserfeil; ukjent sti gir 404-siden
for (const sti of [...sider, '/finnes-ikke', '/blog/finnes-ikke']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const feil = [];
  p.on('pageerror', e => feil.push(e.message)); p.on('console', m => (m.type() === 'error' && !/404/.test(m.text()) || /hydrat|did not match/i.test(m.text())) && feil.push(m.text()));
  const r = await p.goto(base + sti, { waitUntil: 'networkidle' }); await p.reload({ waitUntil: 'networkidle' });
  const d = await p.evaluate(() => ({ h1: [...document.querySelectorAll('h1')].map(h => h.textContent.trim()), robots: document.querySelector('meta[name=robots]')?.content, tittel: document.title, forhånd: document.getElementById('root').dataset.forhandsrendret }));
  const ukjent = sti.includes('finnes-ikke');
  const ok = (ukjent ? r.status() === 404 && d.h1[0] === 'Siden finnes ikke' && /noindex/.test(d.robots) : r.status() === 200 && !!d.forhånd) && d.h1.length === 1 && feil.length === 0;
  check(`S1 ${sti}`, ukjent ? 'Ukjent sti gir 404-side' : 'Direktelenke og oppdatering', ok, `HTTP ${r.status()}, H1 «${(d.h1[0] || '').slice(0, 50)}», tittel «${d.tittel.slice(0, 40)}», robots ${d.robots}, forhåndsrendret ${d.forhånd}, feil: ${feil.join('; ').slice(0, 120) || 'ingen'}`);
  await p.close();
}

// S2: alle interne lenker på alle sider fører til en side med 200 og H1 (ankere må finnes)
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const lenker = new Map();
  for (const sti of sider) { await p.goto(base + sti, { waitUntil: 'load' }); for (const h of await p.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')))) if (!lenker.has(h)) lenker.set(h, sti); }
  const brutt = []; let interne = 0;
  for (const [h, fra] of lenker) {
    if (/^(mailto:|https?:)/.test(h)) { if (h.startsWith('mailto:') && h !== 'mailto:jelassi@cideamarketing.com') brutt.push(`${h} (${fra})`); continue; }
    interne++;
    const [sti, anker] = h.startsWith('#') ? [fra, h.slice(1)] : h.split('#');
    const r = await p.goto(base + (sti || fra), { waitUntil: 'load' });
    const ok = r.status() === 200 && await p.evaluate(a => !!document.querySelector('h1') && (!a || !!document.getElementById(a)), anker);
    if (!ok) brutt.push(`${h} (fra ${fra}, HTTP ${r.status()})`);
  }
  check('S2', 'Alle interne lenker virker', brutt.length === 0, `${interne} unike interne lenker og ${lenker.size - interne} eksterne/e-post kontrollert${brutt.length ? ' – brutt: ' + brutt.join(', ') : ''}`);
  await p.close();
}

// S3: meny og logo – samme meny overalt, logoen leder til arbeidsforsiden, /konsept-scroll har noindex
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const avvik = [];
  for (const sti of sider) {
    await p.goto(base + sti, { waitUntil: 'load' });
    const m = await p.evaluate(() => ({ meny: [...document.querySelectorAll('.cm-meny a')].map(a => `${a.textContent.trim()}=${a.getAttribute('href')}`).join(' '), logo: document.querySelector('.cm-topp .cm-ordmerke').getAttribute('href') }));
    if (m.meny !== 'Tjenester=/tjenester Om oss=/om-oss Innsikt=/blog Snakk med oss=/kontakt' || m.logo !== '/konsept-scroll') avvik.push(`${sti}: ${m.meny} logo ${m.logo}`);
  }
  await p.goto(base + '/konsept-scroll'); const robots = await p.evaluate(() => document.querySelector('meta[name=robots]').content);
  check('S3', 'Lik meny på alle sider, logo til arbeidsforsiden, prototypen har noindex', avvik.length === 0 && /noindex/.test(robots), `${sider.length} sider, meny «Tjenester · Om oss · Innsikt · Snakk med oss», logo → /konsept-scroll, /konsept-scroll robots «${robots}»${avvik.length ? ' – avvik: ' + avvik.join('; ') : ''}`);
  await p.close();
}

// S4: overflow, avkuttet tekst, språk og oversiktsbilder ved 390, 768 og 1440
for (const w of [390, 768, 1440]) {
  const c = await b.newContext({ viewport: { width: w, height: w < 768 ? 844 : 900 }, ...mobil(w), reducedMotion: 'reduce' });
  const p = await c.newPage(); const avvik = [];
  for (const sti of [...sider, '/finnes-ikke']) {
    await p.goto(base + sti, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
    const r = await p.evaluate(() => ({ ov: document.documentElement.scrollWidth - document.documentElement.clientWidth, kutt: [...document.querySelectorAll('.cm h1,.cm h2,.cm h3,.cm p,.cm a,.cm li,.cm label,.cm button')].filter(e => !e.closest('[aria-hidden=true]') && e.getBoundingClientRect().width && e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflowX !== 'visible').length, tekst: document.body.innerText, lang: document.documentElement.lang }));
    // Gullkornet-teksten på /personvern er låst og eiergodkjent; «garantier» (SCC) og «gratis» (protest) er juridiske begreper der.
    const ord = [...new Set([...(sti === '/personvern' ? [] : r.tekst.match(BANNED) || []), ...(r.tekst.match(ENGELSK) || [])])];
    if (r.ov > 0 || r.kutt || ord.length || r.lang !== 'no') avvik.push(`${sti}: overflow ${r.ov}, avkuttet ${r.kutt}, ord ${ord.join('/') || '–'}, lang ${r.lang}`);
    if (!['/', '/konsept-scroll'].includes(sti) && w !== 768) await p.screenshot({ path: `${bilder}${sti === '/finnes-ikke' ? '404' : sti.replace(/^\//, '').replace(/\//g, '-')}-${w}.png`, fullPage: true });
  }
  check(`S4 ${w}`, 'Ingen overflow, avkuttet tekst, engelske etiketter eller nummerering', avvik.length === 0, `${sider.length + 1} sider${avvik.length ? ' – ' + avvik.join('; ') : ''}`);
  await c.close();
}

// S5: mobilmeny med tastatur på en underside
{
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, ...mobil(390) }); const p = await c.newPage();
  await p.goto(base + '/tjenester', { waitUntil: 'networkidle' });
  await p.locator('.cm-menyknapp').focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(80);
  const åpen = await p.evaluate(() => ({ exp: document.querySelector('.cm-menyknapp').getAttribute('aria-expanded'), fokus: document.activeElement.textContent.trim(), lenker: [...document.querySelectorAll('.cm-meny a')].filter(a => a.getBoundingClientRect().height).map(a => a.textContent.trim()) }));
  await p.keyboard.press('Escape'); await p.waitForTimeout(80);
  const lukket = await p.evaluate(() => ({ exp: document.querySelector('.cm-menyknapp').getAttribute('aria-expanded'), fokus: document.activeElement.classList.contains('cm-menyknapp') }));
  check('S5', 'Mobilmeny: Enter åpner, Escape lukker og gir fokus tilbake', åpen.exp === 'true' && åpen.fokus === 'Tjenester' && åpen.lenker.length === 4 && lukket.exp === 'false' && lukket.fokus, `åpen ${åpen.exp}, fokus «${åpen.fokus}», lenker ${åpen.lenker.join(' · ')}; Escape → ${lukket.exp}, fokus tilbake ${lukket.fokus}`);
  await c.close();
}

// S6: tastaturnavigasjon – synlig fokus på alle mål på tjenesteside, artikkel og kontakt
for (const sti of ['/websites', '/blog/hvor-mye-koster-en-nettside', '/kontakt']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.goto(base + sti, { waitUntil: 'networkidle' });
  const uten = []; let n = 0;
  for (let i = 0; i < 60; i++) {
    await p.keyboard.press('Tab');
    const f = await p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const cs = getComputedStyle(e); return { t: (e.textContent || e.name || e.id).trim().slice(0, 20), ring: (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2) || e.type === 'radio', bunn: !!e.closest('footer'), sist: e.getAttribute('href') === '/personvern' && !!e.closest('footer') }; });
    if (!f) break; n++; if (!f.ring) uten.push(f.t); if (f.sist) break;
  }
  check(`S6 ${sti}`, 'Tastatur: synlig fokus helt til bunnteksten', uten.length === 0 && n > 5, `${n} fokusmål${uten.length ? ' – uten synlig fokus: ' + uten.join(', ') : ''}`);
  await p.close();
}

// S7: kontaktskjema – validering, lasting, feil uten mottak, aldri falsk suksess; honningfelle
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.goto(base + '/kontakt', { waitUntil: 'networkidle' });
  await p.click('button[type=submit]'); await p.waitForTimeout(100);
  const tom = await p.evaluate(() => ({ felt: [...document.querySelectorAll('[aria-invalid=true]')].map(e => e.name), fokus: document.activeElement.getAttribute('role'), feil: [...document.querySelectorAll('.sd-feltfeil')].map(e => e.textContent) }));
  check('S7a', 'Skjema: tomt skjema gir feilmelding per felt og fokus på oppsummering', tom.felt.includes('navn') && tom.felt.includes('email') && tom.felt.includes('melding') && tom.feil.length === 4 && tom.fokus === 'alert', `ugyldige felt: ${[...new Set(tom.felt)].join(', ')}; ${tom.feil.length} feilmeldinger; fokus på ${tom.fokus}`);
  await p.fill('#k-navn', 'Test Testesen'); await p.fill('#k-email', 'ikke-en-adresse'); await p.check('#k-tema-0'); await p.fill('#k-melding', 'Dette er en testmelding.');
  await p.click('button[type=submit]'); await p.waitForTimeout(100);
  const epost = await p.evaluate(() => document.querySelector('#k-email-feil')?.textContent || '');
  await p.fill('#k-email', 'test@eksempel.no');
  // Svaret forsinkes 600 ms (fortsatt 405, som lokalt) slik at lastetilstanden kan leses pålitelig underveis.
  await p.route('**/', async r => { if (r.request().method() !== 'POST') return r.continue(); await new Promise(x => setTimeout(x, 600)); await r.fulfill({ status: 405, body: 'Ingen skjemamottak lokalt' }); });
  const [post] = await Promise.all([p.waitForRequest(r => r.method() === 'POST'), p.click('button[type=submit]')]);
  await p.waitForTimeout(250);
  const underveis = await p.evaluate(() => ({ knapp: document.querySelector('button[type=submit]').textContent.trim(), deaktivert: document.querySelector('button[type=submit]').disabled }));
  await p.waitForTimeout(700);
  const etter = await p.evaluate(() => ({ feil: document.querySelector('.sd-melding-feil h3')?.textContent || '', ok: !!document.querySelector('.sd-melding-ok'), notis: !!document.querySelector('.sd-hull') }));
  const body = new URLSearchParams(post.postData());
  check('S7b', 'Skjema: ugyldig e-post avvises', /E-postadressen ser ikke riktig ut/.test(epost), `«${epost}»`);
  check('S7c', 'Skjema: sender riktige felt; uten mottak (HTTP 405 lokalt) vises feil, ikke suksess', body.get('form-name') === 'kontakt' && body.get('navn') === 'Test Testesen' && body.get('tema') === 'Nettsider' && body.get('email') === 'test@eksempel.no' && /%\{submissionId\}/.test(body.get('subject') || '') && etter.feil === 'Henvendelsen ble ikke sendt' && !etter.ok && etter.notis && underveis.deaktivert && /Sender/.test(underveis.knapp), `POST ${new URL(post.url()).pathname} med felt ${[...body.keys()].join(', ')}; resultat «${etter.feil}», suksess vist: ${etter.ok}; merknad om ubekreftet mottak synlig: ${etter.notis}; under sending: «${underveis.knapp}», deaktivert ${underveis.deaktivert}`);
  await p.close();
  // Suksess bare ved HTTP 2xx: simuler et vellykket svar fra skjemamottaket
  const q = await b.newPage({ viewport: { width: 390, height: 844 } }); await q.route('**/', r => r.request().method() === 'POST' ? r.fulfill({ status: 200, body: 'ok' }) : r.continue());
  await q.goto(base + '/kontakt', { waitUntil: 'networkidle' });
  await q.fill('#k-navn', 'Test'); await q.fill('#k-email', 'test@eksempel.no'); await q.check('#k-tema-4'); await q.fill('#k-melding', 'Simulert vellykket innsending.');
  await q.click('button[type=submit]'); await q.waitForTimeout(300);
  const sim = await q.evaluate(() => ({ ok: document.querySelector('.sd-melding-ok h3')?.textContent, fokus: document.activeElement.textContent }));
  await q.screenshot({ path: `${bilder}kontakt-bekreftelse-simulert-390.png`, fullPage: true });
  check('S7d', 'Skjema: bekreftelse vises bare ved HTTP 2xx (simulert svar)', sim.ok === 'Henvendelsen er sendt' && sim.fokus === 'Henvendelsen er sendt', `simulert 200 → «${sim.ok}», fokus på bekreftelsen`);
  await q.close();
  // Honningfelle: skjult felt utfylt sendes ikke
  const h = await b.newPage({ viewport: { width: 1440, height: 900 } }); await h.goto(base + '/kontakt', { waitUntil: 'networkidle' }); let sendt = false; h.on('request', r => { if (r.method() === 'POST') sendt = true; });
  await h.fill('#k-navn', 'Robot'); await h.fill('#k-email', 'r@eksempel.no'); await h.check('#k-tema-1'); await h.fill('#k-melding', 'Søppelpost søppelpost.');
  await h.evaluate(() => { document.querySelector('[name=bot-felt]').value = 'x'; }); await h.click('button[type=submit]'); await h.waitForTimeout(300);
  const hp = await h.evaluate(() => ({ synlig: document.querySelector('[name=bot-felt]').getBoundingClientRect().left >= 0, tab: document.querySelector('[name=bot-felt]').tabIndex }));
  check('S7e', 'Skjema: honningfelle er skjult og stopper innsending', !sendt && !hp.synlig && hp.tab === -1, `innsending stoppet: ${!sendt}, feltet utenfor skjermen: ${!hp.synlig}, tabIndex ${hp.tab}`);
  await h.close();
}

// S8: uten JavaScript – innhold, meny og skjema finnes (vanlig POST til /kontakt/takk)
{
  const c = await b.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 }, ...mobil(390) }); const p = await c.newPage(); const avvik = [];
  for (const sti of ['/tjenester', '/websites', '/om-oss', '/blog', '/blog/hvorfor-vises-ikke-nettsiden-pa-google', '/kontakt', '/personvern']) {
    await p.goto(base + sti, { waitUntil: 'load' });
    const r = await p.evaluate(() => ({ h1: !!document.querySelector('h1'), tekst: document.querySelector('main').innerText.length, meny: [...document.querySelectorAll('.cm-meny a')].filter(a => a.getBoundingClientRect().height).length, skjema: document.querySelector('form[name=kontakt]')?.getAttribute('action') }));
    if (!r.h1 || r.tekst < 200 || r.meny < 4 || (sti === '/kontakt' && r.skjema !== '/kontakt/takk')) avvik.push(`${sti}: ${JSON.stringify(r)}`);
  }
  check('S8', 'Uten JavaScript: innhold, meny og skjema tilgjengelig', avvik.length === 0, `7 sider${avvik.length ? ' – ' + avvik.join('; ') : ''}`);
  await c.close();
}

// S10: validering uten JavaScript (nettleserens egen) og med JavaScript (egen, tilgjengelig validering)
{
  const c = await b.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 }, ...mobil(390) }); const p = await c.newPage();
  await p.goto(base + '/kontakt', { waitUntil: 'load' }); let poster = 0; p.on('request', r => { if (r.method() === 'POST') poster++; });
  const steg = [];
  const forsøk = async navn => { const før = poster; await p.click('button[type=submit]'); await p.waitForTimeout(400); const r = await p.evaluate(() => { const f = document.querySelector('form[name=kontakt]'); return { gyldig: f.checkValidity(), ugyldige: [...f.elements].filter(e => e.willValidate && !e.validity.valid).map(e => e.name) }; }).catch(() => ({ gyldig: null, ugyldige: [] })); steg.push(`${navn}: sendt ${poster > før}, ugyldige ${[...new Set(r.ugyldige)].join('/') || 'ingen'}`); return poster > før; };
  const tomSendt = await forsøk('tomt');
  await p.fill('#k-navn', 'Test'); await p.fill('#k-email', 'ikke-epost'); await p.check('#k-tema-2'); await p.fill('#k-melding', 'Kort');
  const ugyldigSendt = await forsøk('ugyldig e-post og kort melding');
  await p.fill('#k-email', 'test@eksempel.no'); await p.fill('#k-melding', 'Gyldig melding uten JavaScript.');
  const [svar] = await Promise.all([p.waitForResponse(r => r.request().method() === 'POST').catch(() => null), p.click('button[type=submit]')]);
  steg.push(`gyldig: sendt til ${svar ? new URL(svar.url()).pathname + ' (HTTP ' + svar.status() + ' lokalt)' : 'ingen'}`);
  const novalidateUtenJs = await p.goto(base + '/kontakt').then(() => p.evaluate(() => document.querySelector('form[name=kontakt]').noValidate));
  check('S10a', 'Uten JavaScript: nettleserens validering stopper ugyldig skjema, gyldig skjema sendes', !tomSendt && !ugyldigSendt && !!svar && new URL(svar.url()).pathname === '/kontakt/takk' && novalidateUtenJs === false, `novalidate uten JS: ${novalidateUtenJs}; ${steg.join('; ')}`);
  await c.close();
  const q = await b.newPage({ viewport: { width: 1440, height: 900 } }); await q.goto(base + '/kontakt', { waitUntil: 'networkidle' });
  await q.fill('#k-navn', 'Test'); await q.fill('#k-email', 'test@eksempel.no'); await q.check('#k-tema-0'); await q.fill('#k-melding', 'Kort');
  await q.click('button[type=submit]'); await q.waitForTimeout(150);
  const r = await q.evaluate(() => ({ nv: document.querySelector('form[name=kontakt]').noValidate, feil: document.querySelector('#k-melding-feil')?.textContent }));
  check('S10b', 'Med JavaScript: novalidate satt, egen validering (meldingslengde) med feltfeil', r.nv === true && /minst 10 tegn/.test(r.feil || ''), `novalidate ${r.nv}, feil «${r.feil}»`);
  await q.close();
}

// S9: artiklene viser hele teksten fra blog/*.md
{
  const p = await b.newPage(); const avvik = [];
  for (const [slug, setning] of [['hvor-mye-koster-en-nettside', 'En billig nettside som ikke blir funnet eller forstått'], ['hva-bor-en-god-bedriftsnettside-inneholde', 'Innhold og design må samarbeide'], ['hvorfor-vises-ikke-nettsiden-pa-google', 'Se på kommersiell relevans'], ['hvordan-fa-flere-henvendelser-fra-nettsiden', 'Test før dere bygger mer']]) {
    await p.goto(`${base}/blog/${slug}`, { waitUntil: 'load' });
    if (!(await p.evaluate(s => document.querySelector('main').innerText.includes(s), setning))) avvik.push(slug);
  }
  check('S9', 'Artikkelsidene viser hele artikkelen', avvik.length === 0, `4 artikler kontrollert mot tekst fra blog/*.md${avvik.length ? ' – mangler: ' + avvik.join(', ') : ''}`);
  await p.close();
}

// S11: aria-current – "page" bare på lenken til siden man står på, "true" på overordnet seksjon (topp- og bunnmeny, logo)
{
  const forventet = {
    '/konsept-scroll': { page: ['CIDEA MARKETING'], true: [] },
    '/tjenester': { page: ['Tjenester'], true: [] },
    '/websites': { page: [], true: ['Tjenester'] },
    '/seo': { page: [], true: ['Tjenester'] },
    '/om-oss': { page: ['Om oss'], true: [] },
    '/blog': { page: ['Innsikt'], true: [] },
    '/blog/hvor-mye-koster-en-nettside': { page: [], true: ['Innsikt'] },
    '/kontakt': { page: ['Snakk med oss', 'Kontakt'], true: [] },
    '/kontakt/takk': { page: [], true: ['Snakk med oss', 'Kontakt'] },
    '/personvern': { page: ['Personvern'], true: [] },
    '/': { page: [], true: [] },
  };
  const avvik = [];
  for (const [sti, f] of Object.entries(forventet)) {
    for (const js of [true, false]) {
      const c = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: js }); const p = await c.newPage();
      await p.goto(base + sti, { waitUntil: js ? 'networkidle' : 'load' });
      const r = await p.evaluate(() => { const ut = { page: new Set(), true: new Set(), annet: [] }; for (const a of document.querySelectorAll('header a[aria-current], footer a[aria-current]')) { const v = a.getAttribute('aria-current'), t = a.textContent.trim(); (ut[v] ? ut[v].add(t) : ut.annet.push(`${t}=${v}`)); } return { page: [...ut.page].sort(), true: [...ut.true].sort(), annet: ut.annet }; });
      const lik = (x, y) => x.join('|') === [...y].sort().join('|');
      if (!lik(r.page, f.page) || !lik(r.true, f.true) || r.annet.length) avvik.push(`${sti}${js ? '' : ' (uten JS)'}: page [${r.page}] true [${r.true}]${r.annet.length ? ' annet ' + r.annet : ''}`);
      await c.close();
    }
  }
  check('S11', 'aria-current: «page» på eksakt side, «true» på overordnet seksjon', avvik.length === 0, avvik.length ? avvik.join('; ') : `${Object.keys(forventet).length} sider kontrollert med og uten JS (topp- og bunnmeny, logo): tjenestesider markerer Tjenester, artikler markerer Innsikt, takkesiden markerer Kontakt som seksjon`);
}

await b.close(); server.close();
writeFileSync(`${here}NETTSTED-RESULTAT.md`, `# Testresultat – fase 6, hele nettstedet\n\nKjørt ${new Date().toISOString()} i Chromium (Playwright) mot \`dist/\` med Netlify-regelen (fil → mappe/index.html → 404.html; POST → 405 fordi det ikke finnes skjemamottak lokalt). Automatiske målinger – ikke estetisk godkjenning og ikke en WCAG-samsvarserklæring.\n\n| ID | Test | Resultat | Måling |\n|---|---|---|---|\n${res.join('\n')}\n\n**${res.length - fail} av ${res.length} bestått.**\n`);
console.log(`${res.length - fail}/${res.length} OK`); process.exit(fail ? 1 : 0);
