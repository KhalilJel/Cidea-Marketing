// Internasjonalisering (oktober 2026): språkstruktur, SEO-metadata, sitemap, redirects, skjemaer, språkvelger,
// mobil/desktop og grunnleggende tilgjengelighet, mot byggede dist/.
// Kjør etter `npm run build`: node tests/internasjonal.test.mjs → tests/INTERNASJONAL-RESULTAT.md
// Del 1 leser bare filer. Del 2 bruker Chromium (Playwright) mot tests/serve-dist.mjs (samme fil-/404-regel som
// Netlify). Netlify-redirects og skjemamottak hos Netlify kan ikke kjøres lokalt; del 1 kontrollerer reglene og
// skjemamarkeringen, del 2 skjemaets oppførsel i nettleseren med simulert svar.
import { readFileSync, existsSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const DOMENE = 'https://cideamarketing.com';
const rader = []; let feil = 0;
const check = (id, navn, ok, detalj = '') => {
  rader.push(`| ${id} | ${navn} | ${ok ? 'OK' : '**FEIL**'} | ${String(detalj).replace(/\|/g, '/').slice(0, 300)} |`);
  if (!ok) feil++; console.log(ok ? 'OK  ' : 'FEIL', id, navn, detalj ? '– ' + String(detalj).slice(0, 200) : '');
};
const fil = sti => { const f = join(dist, sti === '/' ? 'index.html' : sti.endsWith('.html') ? sti : `${sti}/index.html`); return existsSync(f) ? readFileSync(f, 'utf8') : null; };
const attr = (html, re) => (html.match(re) || [])[1];

const NORSKE = ['/no', '/tjenester', '/websites', '/branding', '/seo', '/digital-marketing', '/om-oss', '/blog', '/kontakt', '/kontakt/takk', '/personvern',
  '/blog/hvor-mye-koster-en-nettside', '/blog/webbyra-abonnement-eller-gjore-det-selv', '/blog/hva-bor-en-god-bedriftsnettside-inneholde',
  '/blog/slik-foregar-et-nettsideprosjekt', '/blog/ny-nettside-uten-a-miste-synlighet-i-google', '/blog/hvordan-fa-flere-henvendelser-fra-nettsiden',
  '/blog/hvorfor-vises-ikke-nettsiden-pa-google'];
const ENGELSKE = ['/', '/services', '/services/branding', '/services/websites', '/services/seo', '/services/social-media', '/dubai', '/about',
  '/insights', '/insights/working-with-a-marketing-agency-in-another-country', '/insights/what-a-business-website-should-include',
  '/insights/rebuilding-your-website-without-losing-search-visibility', '/contact', '/contact/thanks', '/privacy'];
const NOINDEX = ['/kontakt/takk', '/contact/thanks'];

/* ---------- Del 1: filer ---------- */
const sider = {};
for (const sti of [...NORSKE, ...ENGELSKE]) {
  const html = fil(sti);
  check(`F1 ${sti}`, 'Siden finnes i dist', !!html);
  if (html) sider[sti] = html;
}
for (const [sti, html] of Object.entries(sider)) {
  const en = ENGELSKE.includes(sti);
  const lang = attr(html, /<html[^>]*\blang="([^"]+)"/);
  check(`F2 ${sti}`, 'Riktig lang-attributt', en ? lang === 'en' : ['no', 'nb'].includes(lang), lang);
  const canonical = attr(html, /<link[^>]*rel="canonical"[^>]*href="([^"]+)"/) || attr(html, /<link href="([^"]+)" rel="canonical"/);
  check(`F3 ${sti}`, 'Kanonisk adresse er sidens egen', canonical === DOMENE + (sti === '/' ? '/' : sti), canonical);
  const robots = attr(html, /<meta name="robots" content="([^"]+)"/) || attr(html, /<meta content="([^"]+)" name="robots"/);
  check(`F4 ${sti}`, NOINDEX.includes(sti) ? 'Takkesiden er noindex' : 'Indekserbar', NOINDEX.includes(sti) ? /noindex/.test(robots) : robots === 'index,follow', robots);
  check(`F5 ${sti}`, 'Én H1', (html.match(/<h1\b/g) || []).length === 1);
  const tittel = attr(html, /<title>([^<]*)<\/title>/) || '';
  const beskrivelse = attr(html, /<meta name="description" content="([^"]*)"/) || attr(html, /<meta content="([^"]*)" name="description"/) || '';
  if (!NOINDEX.includes(sti)) check(`F6 ${sti}`, (sti === '/personvern' ? 'KJENT FEIL fra main, rettes i PR #18: ' : '') + 'Tittel og beskrivelse finnes (tittel ≤ 70, beskrivelse 70–170 tegn)', tittel.length > 10 && tittel.length <= 70 && beskrivelse.length >= 70 && beskrivelse.length <= 170, `${tittel.length} / ${beskrivelse.length}: ${tittel}`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let ok = true; try { JSON.parse(m[1]); } catch { ok = false; }
    check(`F7 ${sti}`, 'Strukturerte data er gyldig JSON', ok);
  }
  if (en) {
    const tekst = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+lang="no"[^>]*>[^<]*<\/a>/g, '').replace(/<[^>]+>/g, ' ');
    const norsk = tekst.match(/\b(dere|ikke|bedriften|nettside\w*|tjenester|henvendelse\w*|Kontakt|Snakk med oss)\b/g);
    check(`F8 ${sti}`, 'Ingen norsk tekst på engelsk side (utenom lenker merket lang="no")', !norsk, norsk?.join(', '));
    const pris = tekst.match(/(\d[\d.,\s]*\s?(kr|NOK|AED|USD|EUR|€|\$)\b)|((AED|USD|EUR|NOK|\$|€)\s?\d)/g);
    check(`F9 ${sti}`, 'Ingen priser på engelsk side', !pris, pris?.join(', '));
    check(`F10 ${sti}`, 'Strukturerte data på engelsk', /"description":"A creative agency based in Norway/.test(html));
  }
}

// hreflang: gjensidige par, x-default, og hvert mål finnes
{
  const par = {}; let brudd = [];
  for (const [sti, html] of Object.entries(sider)) {
    const alt = [...html.matchAll(/<link[^>]*rel="alternate"[^>]*>/g)].map(m => ({ hl: attr(m[0], /hreflang="([^"]+)"/), href: attr(m[0], /href="([^"]+)"/) }));
    if (!alt.length) continue;
    par[sti] = alt;
    const selv = DOMENE + (sti === '/' ? '/' : sti);
    if (!alt.some(a => a.href === selv)) brudd.push(`${sti}: mangler seg selv`);
    if (!alt.some(a => a.hl === 'x-default')) brudd.push(`${sti}: mangler x-default`);
    for (const a of alt) {
      const mål = a.href.replace(DOMENE, '') || '/';
      const html2 = fil(mål);
      if (!html2) { brudd.push(`${sti} → ${mål} finnes ikke`); continue; }
      if (!html2.includes(`"${selv}"`) || !/hreflang/.test(html2)) brudd.push(`${mål} lenker ikke tilbake til ${sti}`);
    }
  }
  check('F11', 'hreflang: gjensidige par med x-default for alle sider med motpart', brudd.length === 0 && Object.keys(par).length >= 22, `${Object.keys(par).length} sider med hreflang; ${brudd.join('; ') || 'ingen brudd'}`);
}

// Sitemap: hver adresse finnes og er indekserbar; hver indekserbar side er med
{
  const xml = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(DOMENE, '') || '/');
  const mangler = [...NORSKE, ...ENGELSKE].filter(s => !NOINDEX.includes(s) && !locs.includes(s));
  const robotsFor = s => attr(fil(s) || '', /<meta name="robots" content="([^"]+)"/) || attr(fil(s) || '', /<meta content="([^"]+)" name="robots"/) || '';
  const ugyldige = locs.filter(s => !fil(s) || /noindex/.test(robotsFor(s)));
  check('F12', 'Sitemap: alle indekserbare sider er med, ingen døde eller noindex-adresser', !mangler.length && !ugyldige.length && !locs.includes('/konsept-scroll'), `${locs.length} adresser; mangler: ${mangler.join(', ') || '–'}; ugyldige: ${ugyldige.join(', ') || '–'}`);
  check('F13', 'Sitemap har språkalternativer (xhtml:link)', (xml.match(/xhtml:link/g) || []).length >= 60, `${(xml.match(/xhtml:link/g) || []).length} alternativer`);
  check('F14', 'robots.txt peker på sitemap', /Sitemap: https:\/\/cideamarketing\.com\/sitemap\.xml/.test(readFileSync(join(dist, 'robots.txt'), 'utf8')));
}

// Redirects i netlify.toml: målene finnes, og ingen eksisterende side skygges av en regel
{
  const toml = readFileSync(join(root, 'netlify.toml'), 'utf8');
  const regler = [...toml.matchAll(/from = "([^"]+)"\s*\n\s*to = "([^"]+)"\s*\n\s*status = (\d+)/g)].map(m => ({ fra: m[1], til: m[2], status: +m[3] }));
  const feilRegler = regler.filter(r => r.status !== 301 || (!r.til.includes(':splat') && !fil(r.til)) || (!r.fra.includes('*') && fil(r.fra)));
  check('F15', 'Redirects: 301, mål finnes, ingen regel overstyrer en eksisterende side', regler.length >= 5 && !feilRegler.length, regler.map(r => `${r.fra}→${r.til}`).join(', '));
  const splat = { '/no/tjenester': '/tjenester', '/no/personvern': '/personvern', '/en/services': '/services', '/en/dubai': '/dubai' };
  check('F16', 'Splat-redirects (/no/*, /en/*) peker på eksisterende sider', Object.values(splat).every(s => fil(s)) && !toml.includes('force = true'), Object.entries(splat).map(([a, b]) => `${a}→${b}`).join(', '));
}

// Skjemaer: det norske er uendret, det engelske er eget Netlify-skjema med de avtalte feltene
{
  const k = sider['/kontakt'] || '';
  check('F17', 'Norsk skjema «kontakt» finnes med Netlify-markering', /<form[^>]*name="kontakt"[^>]*data-netlify="true"/.test(k) && /name="form-name" value="kontakt"/.test(k));
  const c = sider['/contact'] || '';
  const felt = ['name', 'company', 'email', 'country', 'service', 'message', 'next-step', 'bot-field'];
  const mangler = felt.filter(f => !new RegExp(`name="${f}"`).test(c));
  check('F18', 'Engelsk skjema «contact» med navn, bedrift, e-post, land, tjeneste, beskrivelse, oppfølging og honningfelle', /<form[^>]*name="contact"[^>]*data-netlify="true"[^>]*netlify-honeypot="bot-field"/.test(c) && /action="\/contact\/thanks"/.test(c) && !mangler.length, `mangler: ${mangler.join(', ') || '–'}`);
  const labels = [...c.matchAll(/<input[^>]*id="(c-[a-z]+)"/g)].map(m => m[1]).filter(id => !new RegExp(`for="${id}"`).test(c));
  check('F19', 'Engelske tekstfelt har etiketter', !labels.length, labels.join(', '));
  check('F20', 'Kildekoden til norsk skjema er urørt', !/name="(country|next-step)"/.test(k));
}

// Gullkornet og norsk personvern: /personvern finnes med Gullkornet-delen og egen kanonisk adresse
{
  const p = sider['/personvern'] || '';
  check('F21', '/personvern (lenket fra Gullkornet) er uendret tilgjengelig med Gullkornet-delen', /Bedriftshenvendelser gjennom Gullkornet/.test(p) && /href="https:\/\/cideamarketing\.com\/personvern"/.test(p));
}

// Interne lenker på alle sider (inkl. statiske forsider) løses opp
{
  const filer = d => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? filer(join(d, e.name)) : e.name.endsWith('.html') ? [join(d, e.name)] : []);
  const døde = []; let n = 0;
  for (const f of filer(dist)) {
    const html = readFileSync(f, 'utf8');
    for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
      if (m[1].startsWith('//')) continue; n++;
      const p = join(dist, decodeURIComponent(m[1]));
      if (!existsSync(p) && !existsSync(join(p, 'index.html'))) døde.push(`${f.slice(dist.length)} → ${m[1]}`);
    }
  }
  check('F22', 'Ingen døde interne lenker eller ressurser', !døde.length, `${n} lenker; ${døde.slice(0, 8).join('; ') || 'ingen døde'}`);
}

/* ---------- Del 2: nettleser ---------- */
const { chromium } = await import('playwright');
const { serve } = await import('./serve-dist.mjs');
const server = await serve(4191); const base = 'http://127.0.0.1:4191';
const b = await chromium.launch();
const mobil = w => (w < 768 ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {});
let kjentFont = 0;

for (const w of [390, 1440]) {
  for (const sti of [...ENGELSKE, ...NORSKE]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 }, ...mobil(w), reducedMotion: 'reduce' }); const err = [];
    p.on('pageerror', e => err.push(e.message));
    const kjent = u => (u || '').includes('/cidea-scene/cidea-scene/fonts/'); // kjent font-404 fra main, se B11
    p.on('console', m => { if ((m.type() === 'error' || /hydrat|did not match/i.test(m.text())) && !kjent(m.location()?.url)) err.push(m.text()); });
    p.on('response', r => { if (r.status() === 404 && kjent(r.url())) kjentFont++; });
    const r = await p.goto(base + sti, { waitUntil: 'networkidle' });
    const d = await p.evaluate(() => ({ h1: document.querySelectorAll('h1').length, over: document.documentElement.scrollWidth - innerWidth,
      bilder: [...document.images].filter(i => !i.hasAttribute('alt')).length, lang: document.documentElement.lang }));
    check(`B1 ${w} ${sti}`, 'Laster uten feil, én H1, ingen horisontal overflyt, bilder har alt', r.status() === 200 && d.h1 === 1 && d.over <= 0 && !d.bilder && !err.length,
      `HTTP ${r.status()}, overflyt ${d.over}px, lang ${d.lang}, feil: ${err.join('; ').slice(0, 140) || 'ingen'}`);
    await p.close();
  }
}

// Kjent, eksisterende feil på main (ikke innført her): de statiske forsidene ber om fonter under
// /cidea-scene/cidea-scene/fonts/ (404). Rettes i PR #20. Holdes utenfor B1 og rapporteres for seg i B11.
check('B11', 'KJENT FEIL fra main, rettes i PR #20: font-404 på statiske forsider (/ og /no)', kjentFont === 0, `${kjentFont} font-forespørsler med 404`);

// Språkvelger: samme side på andre språk, desktop og mobil (via menyen)
for (const [fra, til, tekst] of [['/services/websites', '/websites', 'Norsk'], ['/websites', '/services/websites', 'English'], ['/dubai', '/no', 'Norsk'], ['/blog/hvor-mye-koster-en-nettside', '/', 'English'], ['/', '/no', 'Norsk'], ['/no', '/', 'English']]) {
  for (const w of [1440, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 }, ...mobil(w), reducedMotion: 'reduce' });
    await p.goto(base + fra, { waitUntil: 'networkidle' });
    const statisk = fra === '/' || fra === '/no';
    const meny = statisk ? p.locator('.nav-toggle') : p.locator('.cm-menyknapp');
    if (await meny.isVisible()) await meny.click();
    const lenke = (statisk ? p.locator('header .nav a.cidea-lang') : p.locator('header a.cm-sprak')).first();
    let ok = false, detalj = '';
    try {
      await lenke.waitFor({ state: 'visible', timeout: 4000 });
      detalj = `${await lenke.textContent()} → ${await lenke.getAttribute('href')}`;
      await Promise.all([p.waitForURL(u => new URL(u).pathname.replace(/\/$/, '') === til.replace(/\/$/, ''), { timeout: 8000 }), lenke.click()]);
      ok = (await lenke.evaluate(() => true).catch(() => true)) && detalj.startsWith(tekst);
    } catch (e) { detalj += ` ${e.message.split('\n')[0]}`; }
    check(`B2 ${w} ${fra}`, `Språkvelger fører til ${til}`, ok, detalj);
    await p.close();
  }
}

// Engelsk kontaktskjema: feiloppsummering, vellykket sending (simulert Netlify-svar), feil ved avvist sending, #call
{
  const p = await b.newPage({ viewport: { width: 390, height: 900 }, ...mobil(390) });
  await p.goto(base + '/contact', { waitUntil: 'networkidle' });
  await p.locator('button[type=submit]').click();
  const oppsummering = await p.locator('[role=alert]').first().textContent().catch(() => '');
  const fokus = await p.evaluate(() => document.activeElement?.getAttribute('role'));
  check('B3', 'Tomt skjema gir feiloppsummering med fokus (5 felt)', /5 fields need attention/.test(oppsummering) && fokus === 'alert', oppsummering.slice(0, 80));
  let sendt = '';
  await p.route('**/', async (route, req) => { if (req.method() === 'POST') { sendt = req.postData(); await route.fulfill({ status: 200, body: 'ok' }); } else await route.continue(); });
  await p.fill('#c-name', 'Test Person'); await p.fill('#c-email', 'test@example.com'); await p.fill('#c-country', 'United Arab Emirates');
  await p.locator('#c-service-1').check(); await p.fill('#c-message', 'We are planning a new website for our consultancy.');
  await p.locator('button[type=submit]').click();
  await p.locator('.sd-melding-ok').waitFor({ timeout: 5000 }).catch(() => {});
  const felt = new URLSearchParams(sendt);
  check('B4', 'Gyldig skjema sendes som form-name=contact med alle felt og viser bekreftelse', felt.get('form-name') === 'contact' && felt.get('country') === 'United Arab Emirates' && felt.get('service') === 'Websites' && felt.get('next-step') === 'Reply by email' && await p.locator('.sd-melding-ok').isVisible(),
    [...felt.keys()].join(', '));
  await p.close();
  const q = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await q.goto(base + '/contact#call', { waitUntil: 'networkidle' });
  check('B5', '/contact#call forhåndsvelger videosamtale', await q.locator('input[name=next-step][value="Schedule a video call"]').isChecked());
  await q.fill('#c-name', 'Test'); await q.fill('#c-email', 'test@example.com'); await q.fill('#c-country', 'Norway');
  await q.locator('#c-service-0').check(); await q.fill('#c-message', 'A short description of the project.');
  await q.locator('button[type=submit]').click();
  await q.locator('[role=alert]').waitFor({ timeout: 5000 }).catch(() => {});
  check('B6', 'Avvist sending (lokal server svarer 405) viser feilmelding, ingen falsk bekreftelse', /was not sent/.test(await q.locator('[role=alert]').textContent().catch(() => '')) && !(await q.locator('.sd-melding-ok').count()));
  await q.close();
}

// Norsk kontaktskjema fungerer som før (form-name=kontakt)
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); let sendt = '';
  await p.route('**/', async (route, req) => { if (req.method() === 'POST') { sendt = req.postData(); await route.fulfill({ status: 200, body: 'ok' }); } else await route.continue(); });
  await p.goto(base + '/kontakt', { waitUntil: 'networkidle' });
  await p.fill('#k-navn', 'Test'); await p.fill('#k-email', 'test@example.no'); await p.locator('#k-tema-0').check(); await p.fill('#k-melding', 'Dette er en testmelding.');
  await p.locator('button[type=submit]').click();
  await p.locator('.sd-melding-ok').waitFor({ timeout: 5000 }).catch(() => {});
  check('B7', 'Norsk skjema sender form-name=kontakt og viser bekreftelse', new URLSearchParams(sendt).get('form-name') === 'kontakt' && await p.locator('.sd-melding-ok').isVisible());
  await p.close();
}

// Statisk engelsk forside: engelske knappetekster i bootstrap.js, mobilmeny åpner og lukker
{
  const p = await b.newPage({ viewport: { width: 390, height: 900 }, ...mobil(390), reducedMotion: 'reduce' });
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  await p.locator('.nav-toggle').click();
  const etikett = await p.locator('.nav-toggle').getAttribute('aria-label');
  await p.keyboard.press('Escape');
  check('B8', 'Engelsk forside: mobilmeny med engelske etiketter', etikett === 'Close menu' && await p.locator('.nav-toggle').getAttribute('aria-expanded') === 'false', etikett);
  await p.goto(base + '/no', { waitUntil: 'networkidle' });
  await p.locator('.nav-toggle').click();
  check('B9', 'Norsk forside (/no): mobilmeny med norske etiketter som før', await p.locator('.nav-toggle').getAttribute('aria-label') === 'Lukk meny');
  await p.close();
}

// Ukjent engelsk sti gir 404-siden med engelsk vei videre
{
  const p = await b.newPage(); const r = await p.goto(base + '/services/finnes-ikke', { waitUntil: 'networkidle' });
  check('B10', 'Ukjent sti gir 404 med lenke til engelsk forside', r.status() === 404 && await p.locator('main a[hreflang="en"][href="/"]').count() === 1);
  await p.close();
}

await b.close(); server.close();
const md = `# Internasjonalisering – testresultat\n\nKjørt ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC mot \`dist/\` (\`npm run build\`), Chromium (Playwright). ` +
  `Firefox, WebKit og ekte telefoner er **ikke kjørt**. Netlify-redirects og skjemamottak hos Netlify er **ikke kjørt** lokalt (reglene og markeringen er kontrollert, se F15–F18).\n\n` +
  `**${rader.length - feil} OK, ${feil} FEIL**\n\n| ID | Kontroll | Resultat | Detaljer |\n|---|---|---|---|\n${rader.join('\n')}\n`;
writeFileSync(join(root, 'tests/INTERNASJONAL-RESULTAT.md'), md);
console.log(`\n${rader.length - feil} OK, ${feil} FEIL`);
process.exit(feil ? 1 : 0);
