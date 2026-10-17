// Fase 5.4 – visuell QA og tilgjengelighetsmålinger på den faktiske, byggede siden.
// Samme kontrastmetode som phase4/tools/qa.mjs. Dette er målinger, ikke en WCAG-samsvarserklæring.
// Kjør etter `npm run build`: node tests/qa.mjs → tests/QA-RESULTAT.md + fullsidebilder i docs/cinematic-pilot/phase5/screens/qa/
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { serve } from './serve-dist.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const shots = fileURLToPath(new URL('../docs/cinematic-pilot/phase5/screens/qa/', import.meta.url));
mkdirSync(shots, { recursive: true });
const server = await serve(4175); const base = 'http://127.0.0.1:4175';
const BANNED = /\b(Nettsteder|kompromissløs\w*|lynrask\w*|aldri stagnerer|Les mer|fast kontaktperson|gratis)\b/gi;
const ENGLISH = /\b(Read more|Learn more|Contact us|Services|Our work|Get started|Insights|About us|Home|Submit|Menu|Close|Skip to)\b/g;
const NUMBERING = /(^|\s)(0[1-9]|Fase \d|Steg \d)(\s|$|\.)/gm;
const rows = []; const notes = []; let fail = 0;
const row = (side, w, navn, ok, mål) => { rows.push(`| ${side} | ${w} | ${navn} | ${ok ? 'OK' : '**FEIL**'} | ${mål} |`); if (!ok) fail++; console.log(ok ? 'OK  ' : 'FEIL', side, w, navn, '–', mål); };
const b = await chromium.launch();

for (const side of ['/', '/kontakt']) for (const w of [320, 375, 390, 600, 768, 860, 1024, 1440]) {
  const c = await b.newContext({ viewport: { width: w, height: w < 768 ? 844 : 900 }, deviceScaleFactor: w < 768 ? 2 : 1, reducedMotion: 'reduce' });
  const p = await c.newPage(); await p.goto(base + side, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  const navn = side === '/' ? 'forside' : 'kontakt';
  await p.screenshot({ path: `${shots}${navn}-${w}.png`, fullPage: true });
  const r = await p.evaluate(() => {
    const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
    const lum = ({ r, g, b }) => [r, g, b].map(x => x / 255).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4).reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
    const ratio = (a, c) => { const [x, y] = [lum(a), lum(c)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
    const bgOf = el => { for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0.9) return c; } return { r: 250, g: 250, b: 253 }; };
    const synlig = el => { const cs = getComputedStyle(el), rc = el.getBoundingClientRect(); return rc.width > 0 && rc.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
    let checked = 0, min = 99; const fails = [];
    for (const el of document.querySelectorAll('body *')) {
      if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1) || !synlig(el)) continue;
      const cs = getComputedStyle(el); const fg = parse(cs.color); if (!fg) continue;
      const size = parseFloat(cs.fontSize), large = size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight) >= 700);
      const k = ratio(fg, bgOf(el)); checked++; min = Math.min(min, k);
      if (k < (large ? 3 : 4.5)) fails.push(`${k.toFixed(2)} «${el.textContent.trim().slice(0, 30)}»`);
    }
    const hs = [...document.querySelectorAll('h1,h2,h3,h4')].filter(synlig).map(h => +h.tagName[1]);
    const hopp = hs.some((n, i) => i > 0 && n > hs[i - 1] + 1);
    const mål = [...document.querySelectorAll('a,button')].filter(synlig).map(e => { const rc = e.getBoundingClientRect(); return { t: (e.textContent.trim() || e.getAttribute('aria-label') || '').slice(0, 24), w: Math.round(rc.width), h: Math.round(rc.height), inline: !!e.closest('p') }; });
    const sma = mål.filter(m => !m.inline && (m.w < 24 || m.h < 24));
    const under44 = mål.filter(m => !m.inline && (m.w < 44 || m.h < 44)).map(m => `${m.t} ${m.w}×${m.h}`);
    const lenker = [...new Set([...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')))];
    const seksjoner = [...document.querySelectorAll('main > section, main > *')].filter(synlig).map(s => Math.round(s.getBoundingClientRect().height));
    const ord = [...document.querySelectorAll('h1,h2,h3,p,a,li,button')].filter(synlig).filter(e => e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflowX !== 'visible').length;
    return { checked, min, fails, hs, hopp, h1: hs.filter(n => n === 1).length, sma, under44, lenker, seksjoner, ord, text: document.body.innerText,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, lang: document.documentElement.lang,
      aeoeaa: ['Outfit', 'DM Sans'].every(ff => document.fonts.check(`700 20px "${ff}"`, 'æøåÆØÅ')), hoyde: document.documentElement.scrollHeight };
  });
  const språk = [...new Set([...(r.text.match(BANNED) || []), ...(r.text.match(ENGLISH) || []), ...(r.text.match(NUMBERING) || []).map(s => s.trim())])];
  row(side, w, 'Kontrast (alle synlige tekstnoder)', r.fails.length === 0, `${r.checked} elementer, laveste ${r.min.toFixed(2)}:1${r.fails.length ? ', feil: ' + r.fails.join('; ') : ''}`);
  row(side, w, 'Overskriftsrekkefølge', r.h1 === 1 && !r.hopp, `${r.hs.map(n => 'h' + n).join(' ')}`);
  row(side, w, 'Målstørrelse ≥ 24×24 (WCAG 2.5.8)', r.sma.length === 0, r.sma.length ? r.sma.map(m => `${m.t} ${m.w}×${m.h}`).join('; ') : `${r.under44.length} under 44 px${r.under44.length ? ': ' + r.under44.join('; ') : ''}`);
  row(side, w, 'Overflow og avkuttet tekst', r.overflow <= 0 && r.ord === 0, `side ${r.overflow} px, avkuttede elementer ${r.ord}`);
  row(side, w, 'Språk, æøå og fonter', r.lang === 'nb' || r.lang === 'no' ? språk.length === 0 && r.aeoeaa : false, `lang=${r.lang}, æøå i Outfit og DM Sans: ${r.aeoeaa}, avviste ord/engelsk/nummerering: ${språk.join(', ') || 'ingen'}`);
  if (w === 390 || w === 1440) notes.push(`- ${side} ${w}px: sidehøyde ${r.hoyde} px, seksjonshøyder ${r.seksjoner.join(' / ')}`);
  if (w === 1440) {
    // lenkemål: alle interne lenker svarer 200 og ankerne finnes
    const brutt = [];
    for (const h of r.lenker) {
      if (h.startsWith('#') || h.startsWith('/#')) { const id = h.split('#')[1]; const fins = await p.evaluate(i => !!document.getElementById(i), id); if (side === '/' && !fins) brutt.push(h); continue; }
      if (!h.startsWith('/')) { brutt.push(h + ' (ekstern)'); continue; }
      const q = await b.newPage(); const svar = await q.goto(base + h, { waitUntil: 'networkidle' }); const h1 = await q.locator('h1').count(); await q.close();
      if (svar.status() !== 200 || !h1) brutt.push(h);
    }
    row(side, w, 'Lenkemål', brutt.length === 0, `${r.lenker.length} unike: ${r.lenker.join(', ')}${brutt.length ? ' – brutt: ' + brutt.join(', ') : ''}`);
    // tastatur: hvert fokusmål får synlig fokus og ligger i visning
    const usynlig = []; let n = 0; const rekke = [];
    await p.keyboard.press('Tab');
    for (let i = 0; i < 40; i++) {
      const f = await p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const cs = getComputedStyle(e), rc = e.getBoundingClientRect(); return { t: (e.textContent.trim() || '').slice(0, 22), ring: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2, inne: rc.bottom > 0 && rc.top < innerHeight }; });
      if (!f) break; n++; rekke.push(f.t); if (!f.ring || !f.inne) usynlig.push(f.t);
      await p.keyboard.press('Tab');
      if (n > 1 && rekke[0] === (await p.evaluate(() => (document.activeElement.textContent || '').trim().slice(0, 22)))) break;
    }
    row(side, w, 'Tastaturfokus synlig på alle mål', usynlig.length === 0 && n > 3, `${n} fokusmål i rekkefølge: ${rekke.join(' · ')}${usynlig.length ? ' – uten synlig fokus: ' + usynlig.join(', ') : ''}`);
  }
  if (w === 390) {
    // mobilmeny med tastatur
    const knapp = p.locator('.cm-menyknapp'); await knapp.focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(50);
    const åpen = await p.evaluate(() => ({ exp: document.querySelector('.cm-menyknapp').getAttribute('aria-expanded'), fokus: document.activeElement.textContent.trim(), label: document.querySelector('.cm-menyknapp').textContent.trim() }));
    await p.screenshot({ path: `${shots}${navn}-meny-apen-390.png` });
    await p.keyboard.press('Escape'); await p.waitForTimeout(50);
    const lukket = await p.evaluate(() => ({ exp: document.querySelector('.cm-menyknapp').getAttribute('aria-expanded'), fokus: document.activeElement.classList.contains('cm-menyknapp') }));
    row(side, w, 'Mobilmeny med tastatur', åpen.exp === 'true' && åpen.fokus === 'Tjenester' && åpen.label === 'Lukk' && lukket.exp === 'false' && lukket.fokus, `Enter → aria-expanded ${åpen.exp}, fokus «${åpen.fokus}», knapp «${åpen.label}»; Escape → ${lukket.exp}, fokus tilbake på knappen: ${lukket.fokus}`);
  }
  await c.close();
}
await b.close(); server.close();
writeFileSync(`${here}QA-RESULTAT.md`, `# QA-resultat – fase 5.4 (faktisk side)\n\nKjørt ${new Date().toISOString()} i Chromium mot \`dist/\` (Netlify-regel), med \`prefers-reduced-motion: reduce\` (sluttbildet). Automatiske målinger – **ikke en WCAG-samsvarserklæring**; skjermleser og manuell gjennomgang gjenstår.\n\n| Side | Bredde | Kontroll | Resultat | Måling |\n|---|---|---|---|---|\n${rows.join('\n')}\n\n**${rows.length - fail} av ${rows.length} bestått.**\n\n## Mobil seksjonsrytme\n\n${notes.join('\n')}\n`);
console.log(`${rows.length - fail}/${rows.length} OK`); process.exit(fail ? 1 : 0);
