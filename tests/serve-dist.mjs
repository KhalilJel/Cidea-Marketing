// Liten statisk server for dist/ med samme regel som Netlify (netlify.toml):
// eksisterende fil, eller mappe/index.html, serveres med 200; alt annet får dist/404.html med status 404.
// POST besvares med 405: lokalt finnes ingen skjemamottak, så kontaktskjemaet skal vise feil, aldri falsk suksess.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.txt': 'text/plain', '.xml': 'application/xml', '.json': 'application/json' };
const isFile = async p => { try { return (await stat(p)).isFile(); } catch { return false; } };

export function serve(port = 4174) {
  const server = createServer(async (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { 'content-type': 'text/plain; charset=utf-8' }); res.end('Ingen skjemamottak lokalt'); return; }
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '');
    let file = join(dist, path), status = 200;
    if (!(await isFile(file))) {
      if (await isFile(join(file, 'index.html'))) file = join(file, 'index.html');
      else { file = join(dist, '404.html'); status = 404; }
    }
    res.writeHead(status, { 'content-type': types[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  });
  return new Promise(r => server.listen(port, '127.0.0.1', () => r(server)));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await serve(Number(process.env.PORT || 4174));
  console.log('dist/ på http://127.0.0.1:' + (process.env.PORT || 4174));
}
