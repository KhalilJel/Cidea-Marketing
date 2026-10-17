// Liten statisk server for dist/ med samme regel som netlify.toml:
// eksisterende fil (eller mappe/index.html) serveres direkte, alt annet får /spa.html (status 200).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.txt': 'text/plain', '.xml': 'application/xml', '.json': 'application/json' };
const isFile = async p => { try { return (await stat(p)).isFile(); } catch { return false; } };

export function serve(port = 4174) {
  const server = createServer(async (req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '');
    let file = join(dist, path);
    if (!(await isFile(file))) file = (await isFile(join(file, 'index.html'))) ? join(file, 'index.html') : join(dist, 'spa.html');
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  });
  return new Promise(r => server.listen(port, '127.0.0.1', () => r(server)));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await serve(Number(process.env.PORT || 4174));
  console.log('dist/ på http://127.0.0.1:' + (process.env.PORT || 4174));
}
