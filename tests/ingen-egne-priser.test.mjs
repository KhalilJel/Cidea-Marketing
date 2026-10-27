// Innholdsregel (godkjent 27.10.2026): Cideas egne priser vises ikke offentlig på nettsiden.
// Kjør etter `npm run build`: node tests/ingen-egne-priser.test.mjs. Leser bare dist/, ingen nettleser.
// Artiklene under /blog/ kan forklare generelle markedspriser, så der stoppes bare beløpene Cidea tidligere brukte;
// alle andre sider skal ikke ha kronebeløp i det hele tatt.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const filer = d => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? filer(join(d, e.name)) : e.name.endsWith('.html') ? [join(d, e.name)] : []);
const KRONEBELØP = /\d[\d\s .]*\s?(kr\b|kroner\b|,-)/gi;
const TIDLIGERE = /14[\s ]?900|\b490 kr|20[\s ]?780/g;
let feil = 0;
for (const fil of filer(dist)) {
  const sti = '/' + fil.slice(dist.length).replace(/\\/g, '/');
  const tekst = readFileSync(fil, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  const treff = [...new Set([...(tekst.match(TIDLIGERE) || []), ...(sti.startsWith('/blog/') ? [] : tekst.match(KRONEBELØP) || [])])];
  if (treff.length) { feil++; console.log('FEIL', sti, '–', treff.join(', ')); }
}
console.log(feil ? `${feil} sider viser Cideas egne priser` : 'OK   ingen sider viser Cideas egne priser');
process.exit(feil ? 1 : 0);
