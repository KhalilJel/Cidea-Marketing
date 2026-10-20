// Etter `vite build` og SSR-bygg av src/entry-server.jsx: skriv ferdig HTML for alle sider (src/ruter.jsx).
//  dist/index.html            → forsiden
//  dist/<sti>/index.html      → hver side, også tjenester, artikler og /konsept-scroll (noindex)
//  dist/404.html              → ukjente stier; Netlify serverer den med status 404
// Alle sider vises uten JavaScript og hydreres med JS. Direktelenker og oppdatering fungerer uten omskriving.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

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
  besøk(delKilde[sti] || 'src/ruter-sider.jsx');
  if (!filer.size) throw new Error(`Fant ingen JS-del for ${sti} i manifestet`);
  return [...filer].map(f => `<link rel="modulepreload" crossorigin href="/${f}">`).join('');
}

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
function side(sti) {
  const { html, tittel, beskrivelse, robots } = render(sti);
  const url = `https://cideamarketing.com${sti === '/' ? '/' : sti}`;
  return shell
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(tittel)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(beskrivelse)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(tittel)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(beskrivelse)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta name="robots" content=")[^"]*(")/, robots ? `$1${robots}$2` : '$1index,follow$2')
    .replace('</head>', `${forhånd(sti)}</head>`)
    .replace('<div id="root"></div>', `<div id="root" data-forhandsrendret="${sti}">${html}</div>`);
}

for (const sti of Object.keys(sider)) {
  if (sti === '/') continue;
  if (sti === '/404') { writeFileSync(`${root}dist/404.html`, side('/404')); continue; }
  mkdirSync(`${root}dist${sti}`, { recursive: true });
  writeFileSync(`${root}dist${sti}/index.html`, side(sti));
}
writeFileSync(`${root}dist/index.html`, side('/')); // sist: skallet over leses fra dist/index.html
rmSync(`${root}dist-ssr`, { recursive: true, force: true });
rmSync(`${root}dist/.vite`, { recursive: true, force: true }); // manifestet trengs bare her, ikke på nettstedet
console.log(`forhåndsrendret ${Object.keys(sider).length} sider: ${Object.keys(sider).join(', ')}`);
