// QA-revisjon (issue #19, 27.10.2026) av det som faktisk bygges for produksjon med `npm run build`:
// den statiske forsiden (src/reference-home + reference-assets/cidea-scene) og de forhåndsrendrede React-undersidene.
// Kjør etter `npm run build` og `npm install --no-save playwright@<versjon som passer /opt/pw-browsers> axe-core`:
//   node tests/revisjon.test.mjs            → tests/REVISJON-RESULTAT.md (+ JSON) og skjermbilder i $BILDER (valgfritt)
// Målinger i Chromium. Firefox, Safari og ekte telefoner er ikke dekket. Tilgjengelighet måles med axe-core; det er
// ingen WCAG-samsvarserklæring.
import { chromium } from 'playwright';
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { serve } from './serve-dist.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const axe = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const bilder = process.env.BILDER; if (bilder) mkdirSync(bilder, { recursive: true });
const BREDDER = [320, 375, 390, 768, 1024, 1440];
const server = await serve(4191); const base = 'http://127.0.0.1:4191';
const rader = []; let feil = 0;
const sjekk = (id, navn, ok, mål) => { rader.push({ id, navn, ok: !!ok, mål }); if (!ok) feil++; console.log(ok ? 'OK  ' : 'FEIL', id, navn, '–', mål); };

// Sidene som publiseres (sitemap) + takk-, 404- og prototypesiden.
const sitemap = [...readFileSync(join(dist, 'sitemap.xml'), 'utf8').matchAll(/<loc>https:\/\/cideamarketing\.com([^<]*)<\/loc>/g)].map(m => m[1] || '/');
const sider = [...sitemap, '/kontakt/takk'];
const filAv = sti => join(dist, sti === '/' ? 'index.html' : `${sti.slice(1)}/index.html`);

// ---------- Statisk SEO-kontroll av HTML-filene ----------
const meta = {};
for (const sti of sider) {
  const h = readFileSync(filAv(sti), 'utf8');
  const attr = (re) => (h.match(re) || [])[1];
  meta[sti] = {
    tittel: attr(/<title>([^<]*)<\/title>/),
    beskrivelse: attr(/<meta[^>]*name="description"[^>]*content="([^"]*)"/) || attr(/<meta content="([^"]*)" name="description"/),
    canonical: attr(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/) || attr(/<link href="([^"]*)" rel="canonical"/),
    robots: attr(/<meta[^>]*name="robots"[^>]*content="([^"]*)"/) || attr(/<meta content="([^"]*)" name="robots"/),
    ogBilde: attr(/property="og:image" content="([^"]*)"/) || attr(/<meta content="([^"]*)" property="og:image"/),
    ogTittel: attr(/property="og:title" content="([^"]*)"/) || attr(/<meta content="([^"]*)" property="og:title"/),
    jsonld: /application\/ld\+json/.test(h),
    lang: attr(/<html[^>]*lang="([^"]*)"/),
    h1: (h.match(/<h1\b/g) || []).length,
    bilderUtenAlt: (h.match(/<img\b(?![^>]*\balt=)[^>]*>/g) || []).length,
  };
}
const forventetUrl = sti => `https://cideamarketing.com${sti === '/' ? '/' : sti}`;
for (const sti of sitemap) {
  const m = meta[sti];
  sjekk(`SEO ${sti}`, 'Tittel, beskrivelse, canonical, robots, én H1',
    m.tittel && m.tittel.length <= 70 && m.beskrivelse && m.beskrivelse.length >= 70 && m.beskrivelse.length <= 165 && m.canonical === forventetUrl(sti) && /^index/.test(m.robots || '') && m.h1 === 1,
    `tittel ${m.tittel?.length} tegn, beskrivelse ${m.beskrivelse?.length} tegn, canonical ${m.canonical}, robots ${m.robots}, H1 ${m.h1}`);
  sjekk(`DEL ${sti}`, 'Delingsbilde (og:image) og og:title', !!m.ogBilde && !!m.ogTittel, `og:image ${m.ogBilde || 'mangler'}, og:title ${m.ogTittel ? 'finnes' : 'mangler'}`);
}
const dupl = (felt) => { const sett = {}; for (const s of sitemap) (sett[meta[s][felt]] ||= []).push(s); return Object.values(sett).filter(v => v.length > 1); };
sjekk('SEO unik', 'Unike titler og beskrivelser', !dupl('tittel').length && !dupl('beskrivelse').length, `like titler: ${JSON.stringify(dupl('tittel'))}, like beskrivelser: ${JSON.stringify(dupl('beskrivelse'))}`);
sjekk('SEO lang', 'Samme språkkode på alle sider', new Set(sitemap.map(s => meta[s].lang)).size === 1, [...new Set(sitemap.map(s => `${s === '/' ? 'forsiden' : 'undersider'}=${meta[s].lang}`))].join(', '));
{
  // Søkemotorer og skjermlesere leser H1 som tekst: blokkspennene i forsidens H1 må ha mellomrom mellom seg.
  const h1 = readFileSync(filAv('/'), 'utf8').match(/<h1[^>]*>(.*?)<\/h1>/)[1].replace(/<[^>]+>/g, '');
  sjekk('SEO H1', 'Forsidens H1 leses som hele ord', h1 === 'Vi gir ideer form.', `«${h1}»`);
  const farger = new Set(sitemap.map(s => readFileSync(filAv(s), 'utf8').match(/theme-color"[^>]*content="([^"]*)"|content="([^"]*)" name="theme-color"/)?.slice(1).find(Boolean)));
  sjekk('SEO farge', 'Samme theme-color (nettleserlinje på mobil) på alle sider', farger.size === 1, [...farger].join(', '));
}
sjekk('SEO prototype', '/konsept-scroll og /kontakt/takk har noindex og står ikke i sitemap',
  /noindex/.test(readFileSync(filAv('/konsept-scroll'), 'utf8').match(/robots"[^>]*content="([^"]*)"|content="([^"]*)" name="robots"/)[0]) && /noindex/.test(meta['/kontakt/takk'].robots) && !sitemap.includes('/konsept-scroll'), 'kontrollert i dist');

// Alle HTML-filer i dist skal finnes i sitemap eller ha noindex (ellers er sitemap ufullstendig).
{
  const filer = (d) => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? filer(join(d, e.name)) : e.name === 'index.html' ? [join(d, e.name)] : []);
  const mangler = filer(dist).map(f => '/' + f.slice(dist.length).replace(/\/?index\.html$/, '')).map(s => s === '/' ? '/' : s.replace(/\/$/, ''))
    .filter(s => !sitemap.includes(s) && !/noindex/.test(readFileSync(filAv(s), 'utf8')));
  sjekk('SEO sitemap', 'Alle indekserbare sider står i sitemap.xml', mangler.length === 0, mangler.length ? `mangler: ${mangler.join(', ')}` : `${sitemap.length} adresser`);
}

// ---------- CSS-ressurser: url() i forsidens stilark skal peke på filer som finnes ----------
{
  const css = readFileSync(join(dist, 'cidea-scene/css/style.css'), 'utf8');
  const brutt = [...css.matchAll(/url\(([^)"']+)\)/g)].map(m => m[1].split('?')[0]).filter(u => !u.startsWith('data:'))
    .map(u => u.startsWith('/') ? u : new URL(u, 'http://x/cidea-scene/css/').pathname)
    .filter(p => { try { readFileSync(join(dist, p)); return false; } catch { return true; } });
  // dala-bullet.svg brukes bare av .standard-page, som ikke finnes i markeringen; den hentes derfor aldri.
  const ekte = brutt.filter(p => !p.endsWith('dala-bullet.svg'));
  sjekk('R1', 'Forsidens stilark peker på skrifter og bilder som finnes', ekte.length === 0, ekte.length ? `mangler: ${[...new Set(ekte)].join(', ')}` : 'alle url() finnes (ubrukt dala-bullet.svg holdt utenfor)');
}

// ---------- Nettleser ----------
const b = await chromium.launch();
const mobil = w => (w < 768 ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {});
const filnavn = sti => (sti === '/' ? 'forside' : sti.slice(1).replace(/\//g, '_'));

for (const sti of sider) for (const w of BREDDER) {
  const c = await b.newContext({ viewport: { width: w, height: w < 768 ? 800 : 900 }, ...mobil(w), bypassCSP: true }); // CSP-unntak bare for å kunne injisere axe-core
  const p = await c.newPage(); const nettfeil = []; const konsoll = [];
  p.on('response', r => { if (r.status() >= 400) nettfeil.push(`${r.status()} ${r.url().replace(base, '')}`); });
  p.on('pageerror', e => konsoll.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) konsoll.push(m.text().slice(0, 160)); });
  await p.goto(base + sti, { waitUntil: 'load' });
  await p.waitForTimeout(sti === '/' ? 6000 : 400); // forsiden: vent på intro og partikkelscene
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const synlig = e => { const cs = getComputedStyle(e), rc = e.getBoundingClientRect(); return rc.width > 0 && rc.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0'; };
    const vw = document.documentElement.clientWidth;
    const utenfor = [...document.querySelectorAll('h1,h2,h3,p,a,button,li,img,input,textarea,table')].filter(synlig)
      .filter(e => !e.closest('.cm-meny[data-apen="0"], .nav, .sd-honning, .cm-hopp, .cidea-skip, .sd-tabell'))
      .filter(e => { const rc = e.getBoundingClientRect(); return rc.right > vw + 1 || rc.left < -1; })
      .map(e => `${e.tagName.toLowerCase()} «${(e.textContent || '').trim().slice(0, 30)}»`);
    // WCAG 2.5.8: et mål under 24×24 er greit når en sirkel med diameter 24 px rundt midten ikke treffer andre mål
    // (avstandsunntaket). Et felt inne i <label> måles som hele etiketten, fordi etiketten også kan trykkes.
    const mål = [...document.querySelectorAll('a,button,input,summary')].filter(synlig)
      .filter(e => !e.closest('p,li p,dd,td,.sd-artikkel li,.sd-brod li') && !e.closest('.sd-honning'))
      .map(e => { const rc = (e.tagName === 'INPUT' && e.closest('label') || e).getBoundingClientRect(); return { t: (e.textContent.trim() || e.getAttribute('aria-label') || e.name || '').slice(0, 24), rc }; });
    const avstand = (a, b) => Math.hypot(Math.max(b.left - a.x, 0, a.x - b.right), Math.max(b.top - a.y, 0, a.y - b.bottom));
    const sma = mål.filter(m => m.rc.width < 24 || m.rc.height < 24).filter(m => {
      const midt = { x: m.rc.left + m.rc.width / 2, y: m.rc.top + m.rc.height / 2 };
      const liten = n => n.rc.width < 24 || n.rc.height < 24;
      return mål.some(n => n !== m && (avstand(midt, n.rc) < 12 || (liten(n) && Math.hypot(midt.x - n.rc.left - n.rc.width / 2, midt.y - n.rc.top - n.rc.height / 2) < 24)));
    }).map(m => `${m.t} ${Math.round(m.rc.width)}×${Math.round(m.rc.height)}`);
    return { overflow: document.documentElement.scrollWidth - vw, utenfor, sma, h1: document.querySelectorAll('h1').length, scene: document.documentElement.dataset.scene || '' };
  });
  if (bilder) await p.screenshot({ path: `${bilder}/${filnavn(sti)}-${w}.jpg`, type: 'jpeg', quality: 60, fullPage: sti !== '/' });
  sjekk(`V ${sti} ${w}`, 'Ingen 404/konsollfeil, ingen horisontal overflyt eller elementer utenfor skjermen',
    !nettfeil.length && !konsoll.length && r.overflow <= 0 && !r.utenfor.length,
    `overflyt ${r.overflow} px${r.utenfor.length ? ', utenfor: ' + r.utenfor.slice(0, 4).join('; ') : ''}${nettfeil.length ? ', HTTP: ' + [...new Set(nettfeil)].slice(0, 3).join('; ') : ''}${konsoll.length ? ', konsoll: ' + konsoll.slice(0, 2).join('; ') : ''}${sti === '/' ? `, scene=${r.scene || 'laster'}` : ''}`);
  if (w === 375 || w === 1440) sjekk(`T ${sti} ${w}`, 'Trykkflater ≥ 24×24 px (WCAG 2.5.8, lenker i løpende tekst unntatt)', !r.sma.length, r.sma.length ? r.sma.slice(0, 6).join('; ') : 'ingen under 24 px');
  if (w === 375 || w === 1440) {
    await p.addScriptTag({ content: axe });
    const a = await p.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] })).violations.map(v => `${v.id}(${v.nodes.length}): ${v.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' | ')}`));
    sjekk(`A ${sti} ${w}`, 'axe-core WCAG 2.1 A/AA uten brudd', !a.length, a.length ? a.join(' · ').slice(0, 400) : 'ingen brudd');
  }
  await c.close();
}

// Ukjent adresse gir 404-siden med status 404.
{
  const p = await b.newPage(); const r = await p.goto(base + '/finnes-ikke');
  sjekk('L404', 'Ukjent adresse gir status 404 og 404-side', r.status() === 404 && (await p.textContent('h1')).includes('Siden finnes ikke'), `HTTP ${r.status()}`);
  await p.close();
}

// Interne lenker på alle sider svarer 200 (ankere må finnes).
{
  const p = await b.newPage(); const lenker = new Map();
  for (const sti of sider) { await p.goto(base + sti, { waitUntil: 'domcontentloaded' }); for (const h of await p.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')))) if (!lenker.has(h)) lenker.set(h, sti); }
  const brutt = []; let interne = 0; const eksterne = [];
  for (const [h, fra] of lenker) {
    if (/^(mailto:|https?:)/.test(h)) { eksterne.push(h); continue; }
    interne++;
    const [s, anker] = h.startsWith('#') ? [fra, h.slice(1)] : h.split('#');
    const r = await p.goto(base + (s || fra), { waitUntil: 'domcontentloaded' });
    if (r.status() !== 200 || !(await p.evaluate(a => !a || !!document.getElementById(a), anker))) brutt.push(`${h} (fra ${fra}, HTTP ${r.status()})`);
  }
  sjekk('L1', 'Alle interne lenker og ankere virker', !brutt.length, `${interne} unike interne lenker${brutt.length ? ' – brutt: ' + brutt.join(', ') : ''}; eksterne/e-post: ${[...new Set(eksterne)].join(', ')}`);
  await p.close();
}

// Mobilmeny på forsiden og undersidene: åpner, viser lenker, Escape lukker og gir fokus tilbake.
for (const [sti, knapp, panel] of [['/', '.nav-toggle', '.nav a'], ['/websites', '.cm-menyknapp', '.cm-meny a']]) {
  const c = await b.newContext({ viewport: { width: 375, height: 800 }, ...mobil(375) }); const p = await c.newPage();
  await p.goto(base + sti, { waitUntil: 'load' }); await p.waitForTimeout(sti === '/' ? 6000 : 300);
  await p.click(knapp); await p.waitForTimeout(800);
  const åpen = await p.evaluate(s => [...document.querySelectorAll(s)].filter(a => { const r = a.getBoundingClientRect(); return r.width > 0 && r.top >= 0 && r.top < innerHeight && getComputedStyle(a).visibility !== 'hidden'; }).map(a => a.textContent.trim()), panel);
  if (bilder) await p.screenshot({ path: `${bilder}/meny-${filnavn(sti)}-375.jpg`, type: 'jpeg', quality: 60 });
  await p.keyboard.press('Escape'); await p.waitForTimeout(500);
  const etter = await p.evaluate(k => ({ fokus: document.activeElement === document.querySelector(k), utvidet: document.querySelector(k).getAttribute('aria-expanded') }), knapp);
  sjekk(`M ${sti}`, 'Mobilmeny åpner med synlige lenker, Escape lukker og gir fokus tilbake', åpen.length >= 4 && etter.fokus && etter.utvidet === 'false', `synlige lenker: ${åpen.join(', ')}; etter Escape fokus på knappen ${etter.fokus}, aria-expanded ${etter.utvidet}`);
  await c.close();
}

// Punktlister i tjenestetekstene (f.eks. «Hva påvirker prisen?») skal vise punkttegn; `.cm ul` nullstiller dem ellers.
{
  const p = await b.newPage(); await p.goto(base + '/websites', { waitUntil: 'load' });
  const stil = await p.evaluate(() => getComputedStyle(document.querySelector('.sd-liste')).listStyleType);
  sjekk('P1', 'Prislisten på /websites vises med punkttegn', stil === 'disc', `list-style-type ${stil}`);
  await p.close();
}

// Kontaktskjemaet: tom innsending viser feiloppsummering; utfylt innsending lokalt (POST → 405) viser feilmelding,
// aldri falsk bekreftelse. Ekte mottak hos Netlify kan bare bekreftes i produksjon.
{
  const c = await b.newContext({ viewport: { width: 375, height: 800 }, ...mobil(375) }); const p = await c.newPage();
  await p.goto(base + '/kontakt', { waitUntil: 'networkidle' });
  await p.click('.sd-send'); await p.waitForTimeout(300);
  const tom = await p.evaluate(() => ({ felt: document.querySelectorAll('.sd-feltfeil').length, fokus: document.activeElement?.getAttribute('role') }));
  await p.fill('#k-navn', 'Test'); await p.fill('#k-email', 'test@eksempel.no'); await p.check('#k-tema-0'); await p.fill('#k-melding', 'Dette er en lokal test.');
  await p.click('.sd-send'); await p.waitForTimeout(800);
  const sendt = await p.evaluate(() => ({ feil: !!document.querySelector('.sd-melding-feil h3')?.textContent.includes('ble ikke sendt'), ok: !!document.querySelector('.sd-melding-ok') }));
  if (bilder) await p.screenshot({ path: `${bilder}/kontakt-lokal-sending-375.jpg`, type: 'jpeg', quality: 60, fullPage: true });
  sjekk('K1', 'Skjema: tom innsending gir 4 feltfeil og fokus på oppsummering; mislykket sending gir feilmelding, ikke bekreftelse', tom.felt === 4 && tom.fokus === 'alert' && sendt.feil && !sendt.ok, `feltfeil ${tom.felt}, fokus ${tom.fokus}, feilmelding ${sendt.feil}, falsk bekreftelse ${sendt.ok}`);
  await c.close();
}

await b.close(); server.close();
const md = `# QA-revisjon – resultat\n\nGenerert av \`node tests/revisjon.test.mjs\` (Chromium ${b.version?.() || ''}). ${rader.length - feil} OK, ${feil} FEIL.\n\n| ID | Kontroll | Resultat | Måling |\n|---|---|---|---|\n${rader.map(r => `| ${r.id} | ${r.navn} | ${r.ok ? 'OK' : '**FEIL**'} | ${String(r.mål).replace(/\|/g, '\\|')} |`).join('\n')}\n`;
writeFileSync(join(here, 'REVISJON-RESULTAT.md'), md);
console.log(`\n${rader.length - feil} OK, ${feil} FEIL`);
process.exit(feil ? 1 : 0);
