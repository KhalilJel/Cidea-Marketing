// Etter `vite build` og SSR-bygg av src/entry-server.jsx: skriv ferdig HTML for de nye sidene.
//  dist/index.html          → forsiden, forhåndsrendret (vises uten JS, hydreres med JS)
//  dist/kontakt/index.html  → /kontakt, forhåndsrendret
//  dist/spa.html            → tomt skall for alle andre stier (gamle sider), brukt av netlify.toml
// Gamle sider får dermed ikke forsidens HTML, og forsiden er ikke lenger en tom React-rot.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const shell = readFileSync(`${root}dist/index.html`, 'utf8');
if (!shell.includes('<div id="root"></div>')) throw new Error('Fant ikke tom #root i dist/index.html');
const { render } = await import(pathToFileURL(`${root}dist-ssr/entry-server.js`).href);

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
function side(sti) {
  const { html, tittel, beskrivelse } = render(sti);
  const url = `https://cideamarketing.com${sti === '/' ? '/' : sti}`;
  return shell
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(tittel)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(beskrivelse)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(tittel)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(beskrivelse)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace('<div id="root"></div>', `<div id="root" data-forhandsrendret="${sti}">${html}</div>`);
}

writeFileSync(`${root}dist/spa.html`, shell);
writeFileSync(`${root}dist/index.html`, side('/'));
mkdirSync(`${root}dist/kontakt`, { recursive: true });
writeFileSync(`${root}dist/kontakt/index.html`, side('/kontakt'));
rmSync(`${root}dist-ssr`, { recursive: true, force: true });
console.log('forhåndsrendret: / og /kontakt; skall for øvrige stier: dist/spa.html');
