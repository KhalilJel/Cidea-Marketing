// Regresjonskontroll for norske sider (internasjonalisering, oktober 2026): sammenligner dist/ med et bygg av main.
// Kjør: (1) bygg main i en egen mappe, f.eks. `git worktree add /tmp/main main && cd /tmp/main && npm ci && npm run build`,
// (2) `npm run build` her, (3) `node tests/norsk-regresjon.mjs /tmp/main/dist` → tests/NORSK-REGRESJON-RESULTAT.md.
// For hver norske side sammenlignes tittel, beskrivelse, kanonisk adresse, robots, H1 og tekstinnholdet i <main>.
// Forventede endringer (språkvelger, hreflang, logo/forside-lenke til /no) står i FORVENTET og rapporteres for seg.
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const ny = join(root, 'dist'), gammel = process.argv[2];
if (!gammel || !existsSync(gammel)) { console.error('Bruk: node tests/norsk-regresjon.mjs <dist fra main>'); process.exit(2); }

// Norske sider. Forsiden lå på / i main og ligger nå på /no.
const sider = [['/', '/no'], ...['/tjenester', '/websites', '/branding', '/seo', '/digital-marketing', '/om-oss', '/blog', '/kontakt', '/kontakt/takk', '/personvern',
  '/blog/hvor-mye-koster-en-nettside', '/blog/webbyra-abonnement-eller-gjore-det-selv', '/blog/hva-bor-en-god-bedriftsnettside-inneholde',
  '/blog/slik-foregar-et-nettsideprosjekt', '/blog/ny-nettside-uten-a-miste-synlighet-i-google', '/blog/hvordan-fa-flere-henvendelser-fra-nettsiden',
  '/blog/hvorfor-vises-ikke-nettsiden-pa-google', '/konsept-scroll'].map(s => [s, s])];
const FORVENTET = {
  '/websites': 'Lenken «Se forsiden» peker på /no (norsk forside) i stedet for /.',
};
const les = (d, s) => { const f = join(d, s === '/' ? 'index.html' : `${s}/index.html`); return existsSync(f) ? readFileSync(f, 'utf8') : ''; };
const felt = html => ({
  tittel: (html.match(/<title>([^<]*)/) || [])[1],
  beskrivelse: (html.match(/name="description" content="([^"]*)"/) || html.match(/content="([^"]*)" name="description"/) || [])[1],
  robots: (html.match(/name="robots" content="([^"]*)"/) || html.match(/content="([^"]*)" name="robots"/) || [])[1],
  canonical: (html.match(/rel="canonical" href="([^"]*)"/) || html.match(/href="([^"]*)" rel="canonical"/) || [])[1],
  h1: ((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
  // Tekst i <main> uten språkvelgeren og 404-sidens engelske linje
  tekst: ((html.match(/<main[\s\S]*<\/main>/) || [''])[0]).replace(/<a[^>]*cidea-lang[^>]*>[^<]*<\/a>/g, '').replace(/<p lang="en"[\s\S]*?<\/p>/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
  lenker: [...((html.match(/<main[\s\S]*<\/main>/) || [''])[0]).matchAll(/href="([^"]+)"/g)].map(m => m[1]).filter(h => !/cidea-lang/.test(h)).join(' '),
});
const rader = []; let feil = 0;
for (const [før, nå] of sider) {
  const a = felt(les(gammel, før)), b = felt(les(ny, nå));
  const avvik = [];
  for (const k of ['tittel', 'beskrivelse', 'robots', 'h1', 'tekst']) if (a[k] !== b[k]) avvik.push(k);
  const kanonOk = før === '/' ? b.canonical === 'https://cideamarketing.com/no' : a.canonical === b.canonical;
  if (!kanonOk) avvik.push(`canonical ${a.canonical} → ${b.canonical}`);
  const lenkeEndring = a.lenker !== b.lenker;
  const ok = !avvik.length && (!lenkeEndring || FORVENTET[nå] || før === '/');
  if (!ok) feil++;
  rader.push(`| ${før === nå ? nå : `${før} → ${nå}`} | ${ok ? 'OK' : '**AVVIK**'} | ${avvik.join(', ') || 'tittel, beskrivelse, robots, H1 og tekst like'}${lenkeEndring ? `; lenker endret${FORVENTET[nå] ? ` (forventet: ${FORVENTET[nå]})` : før === '/' ? ' (forventet: språkvelger og logo til /no)' : ''}` : ''} |`);
  console.log(ok ? 'OK   ' : 'AVVIK', nå, avvik.join(', '), lenkeEndring ? '(lenker endret)' : '');
}
writeFileSync(join(root, 'tests/NORSK-REGRESJON-RESULTAT.md'), `# Norske sider – regresjon mot main\n\nKjørt ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC. ` +
  `Sammenligner dist/ med bygg av main. Utenfor <main> er forventede endringer: språkvelger («English») i toppmeny og bunnmeny, ` +
  `hreflang-lenker i <head>, og at logoen leder til /no.\n\n**${sider.length - feil} OK, ${feil} AVVIK**\n\n| Side | Resultat | Detaljer |\n|---|---|---|\n${rader.join('\n')}\n`);
console.log(`${sider.length - feil} OK, ${feil} AVVIK`);
process.exit(feil ? 1 : 0);
