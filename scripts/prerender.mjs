// Etter `vite build` og SSR-bygg av src/entry-server.jsx: skriv ferdig HTML for alle sider (src/ruter.jsx).
//  dist/index.html            → forsiden
//  dist/<sti>/index.html      → hver side, også tjenester, artikler og /konsept-scroll (noindex)
//  dist/404.html              → ukjente stier; Netlify serverer den med status 404
// Alle sider vises uten JavaScript og hydreres med JS. Direktelenker og oppdatering fungerer uten omskriving.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { erEngelsk, hreflang, sprakFor, url as fullUrl } from '../src/i18n.js';
import { jsonLdEn } from './strukturerte-data.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const shell = readFileSync(`${root}dist/index.html`, 'utf8');
if (!shell.includes('<div id="root"></div>')) throw new Error('Fant ikke tom #root i dist/index.html');
const { render, sider } = await import(pathToFileURL(`${root}dist-ssr/entry-server.js`).href);

// Modulepreload for sidens egen JS-del (se src/ruter-klient.js), slik at den hentes parallelt med hovedfilen
// i stedet for etter at hovedfilen har kjørt. Kildene her må samsvare med egneDeler i src/ruter-klient.js.
const manifest = JSON.parse(readFileSync(`${root}dist/.vite/manifest.json`, 'utf8'));
const delKilde = { '/': 'src/forside/Forside.jsx', '/konsept-scroll': 'src/konsept/KonseptScroll.jsx', '/kontakt': 'src/kontakt/Kontakt.jsx' };
function forhånd(sti) {
  const filer = new Set();
  const besøk = nøkkel => { const m = manifest[nøkkel]; if (!m || m.isEntry || filer.has(m.file)) return; filer.add(m.file); (m.imports || []).forEach(besøk); };
  besøk(delKilde[sti] || (erEngelsk(sti) && sti !== '/404' ? 'src/en/ruter-en.jsx' : 'src/ruter-sider.jsx'));
  if (!filer.size) throw new Error(`Fant ingen JS-del for ${sti} i manifestet`);
  return [...filer].map(f => `<link rel="modulepreload" crossorigin href="/${f}">`).join('');
}

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
// Språk: lang, og:locale og hreflang (src/i18n.js). Engelske sider får engelske strukturerte data; norske sider
// beholder Organization-blokken fra index.html. "/" skrives her bare som mellomtrinn (se scripts/reference-home.mjs).
const lenker = sti => hreflang(sti).map(h => `<link rel="alternate" hreflang="${h.hreflang}" href="${h.href}">`).join('');
function side(sti) {
  const { html, tittel, beskrivelse, robots, tjeneste, artikkel } = render(sti);
  const url = fullUrl(sti);
  const en = sprakFor(sti) === 'en' && sti !== '/404';
  let ut = shell;
  if (en) {
    ut = ut.replace('<html lang="no">', '<html lang="en">')
      .replace(/(<meta property="og:locale" content=")[^"]*(")/, '$1en_GB$2')
      .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(jsonLdEn(sti, { tittel, beskrivelse, tjeneste, artikkel })).replace(/</g, '\\u003c')}</script>`);
    if (!ut.includes('<html lang="en">')) throw new Error(`Fant ikke <html lang="no"> i skallet (${sti})`);
  }
  return ut
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(tittel)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(beskrivelse)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(tittel)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(beskrivelse)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta name="robots" content=")[^"]*(")/, robots ? `$1${robots}$2` : '$1index,follow$2')
    .replace('</head>', `${lenker(sti)}${forhånd(sti)}</head>`)
    .replace('<div id="root"></div>', `<div id="root" data-forhandsrendret="${sti}">${html}</div>`);
}

for (const sti of Object.keys(sider)) {
  if (sti === '/') continue;
  if (sti === '/404') { writeFileSync(`${root}dist/404.html`, side('/404')); continue; }
  mkdirSync(`${root}dist${sti}`, { recursive: true });
  writeFileSync(`${root}dist${sti}/index.html`, side(sti));
}
writeFileSync(`${root}dist/index.html`, side('/')); // sist: skallet over leses fra dist/index.html

// Sitemap med språkalternativer (xhtml:link), generert fra rutetabellen: alle indekserbare sider, pluss /no (norsk
// forside, skrevet av scripts/reference-home.mjs). Erstatter public/sitemap.xml som ble kopiert inn av Vite.
const indekserbare = ['/', '/no', ...Object.keys(sider).filter(s => s !== '/' && s !== '/404' && !sider[s].robots)];
const sitemap = ['<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...indekserbare.map(s => `  <url><loc>${fullUrl(s)}</loc>${hreflang(s).map(h => `<xhtml:link rel="alternate" hreflang="${h.hreflang}" href="${h.href}"/>`).join('')}</url>`),
  '</urlset>', ''].join('\n');
writeFileSync(`${root}dist/sitemap.xml`, sitemap);
rmSync(`${root}dist-ssr`, { recursive: true, force: true });
rmSync(`${root}dist/.vite`, { recursive: true, force: true }); // manifestet trengs bare her, ikke på nettstedet
console.log(`forhåndsrendret ${Object.keys(sider).length} sider: ${Object.keys(sider).join(', ')}`);
console.log(`sitemap: ${indekserbare.length} adresser`);
