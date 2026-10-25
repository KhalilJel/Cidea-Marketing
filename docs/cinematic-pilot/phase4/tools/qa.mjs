// Fase 4.5 – samlet visuell QA av alle fase 4-forhåndsvisninger i Chromium, 1440 og 390 px.
// Måler: WCAG-kontrast for hvert synlige tekstelement, horisontal overflow, språkregler,
// æøå i begge fonter, CTA-tekst og synlig tastaturfokus. Bruk: node qa.mjs <html> ... (playwright)
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { basename } from 'node:path';
const CTA_H = 'Klar for et overbevisende digitalt uttrykk?';
const CTA_P = 'Fortell oss kort om bedriften og hva dere ønsker hjelp med. Vi tar kontakt på e-post.';
const BANNED = /\b(Nettsteder|kompromissløs\w*|lynrask\w*|aldri stagnerer|Les mer|fast kontaktperson|autoritær\w*|gratis|stabilitet)\b/gi;
const ENGLISH = /\b(Read more|Learn more|Contact us|Services|Our work|Get started|Insights|About us|Home|Submit|Explore|Case studies?)\b/g;
const NUMBERING = /(^|\s)(0[1-9]|Fase \d|Steg \d)(\s|$|\.)/gm;
const b = await chromium.launch();
const rows = []; let issues = 0;
for (const f of process.argv.slice(2)) {
  for (const w of [1440, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(pathToFileURL(f).href, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.evaluate(() => document.getAnimations().forEach(a => { try { a.finish(); } catch { a.cancel(); } }));
    const r = await p.evaluate(() => {
      const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
      const lum = ({ r, g, b }) => [r, g, b].map(x => x / 255).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4).reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
      const ratio = (a, c) => { const [x, y] = [lum(a), lum(c)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
      const bgOf = el => { for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0.9) return c; } return { r: 250, g: 250, b: 253 }; };
      let checked = 0, min = 99; const fails = [];
      for (const el of document.querySelectorAll('body *')) {
        if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1)) continue;
        const cs = getComputedStyle(el); const rc = el.getBoundingClientRect();
        if (!rc.width || !rc.height || cs.visibility === 'hidden' || cs.display === 'none') continue;
        const fg = parse(cs.color); if (!fg) continue;
        const size = parseFloat(cs.fontSize), large = size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight) >= 700);
        const k = ratio(fg, bgOf(el)); checked++; min = Math.min(min, k);
        if (k < (large ? 3 : 4.5)) fails.push(`${k.toFixed(2)} «${el.textContent.trim().slice(0, 30)}»`);
      }
      const text = document.body.innerText;
      return { checked, min, fails, text, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        aeoeaa: ['Outfit', 'DM Sans'].every(ff => document.fonts.check(`700 20px "${ff}"`, 'æøåÆØÅ')), hasAeoeaa: /[æøåÆØÅ]/.test(text) };
    });
    const banned = [...new Set((r.text.match(BANNED) || []))];
    const english = [...new Set((r.text.match(ENGLISH) || []))];
    const numbering = [...new Set((r.text.match(NUMBERING) || []).map(s => s.trim()))];
    const hasCta = r.text.includes(CTA_H);
    const ctaOk = !hasCta || r.text.includes(CTA_P);
    // Tastatur: Tab gjennom inntil 6 elementer, alle skal ha synlig fokus (outline ≥ 2 px)
    let focusOk = true, tabs = 0;
    for (let i = 0; i < 6; i++) {
      await p.keyboard.press('Tab');
      const fo = await p.evaluate(() => { const a = document.activeElement; if (!a || a === document.body) return null; const cs = getComputedStyle(a); return cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2; });
      if (fo === null) break; tabs++; if (!fo) focusOk = false;
    }
    const bad = r.fails.length || r.overflow > 0 || banned.length || english.length || numbering.length || !ctaOk || !r.aeoeaa || !focusOk;
    if (bad) issues++;
    rows.push(`| ${basename(f, '.html')} | ${w} | ${r.checked} / min ${r.min.toFixed(2)} / ${r.fails.length ? '**' + r.fails.length + ' under AA**: ' + r.fails.slice(0, 3).join('; ') : '0 under AA'} | ${r.overflow} px | ${banned.concat(english, numbering).join(', ') || 'ingen'} | ${hasCta ? (ctaOk ? 'OK' : '**feil tekst**') : '–'} | ${r.aeoeaa ? 'OK' : '**mangler**'}${r.hasAeoeaa ? '' : ' (ingen æøå i tekst)'} | ${focusOk ? `OK (${tabs})` : '**mangler**'} |`);
    await p.close();
  }
}
await b.close();
console.log('| Side | Bredde | Kontrast: elementer / laveste / avvik | Overflow | Forbudt/engelsk/nummerering | CTA-tekst | æøå i Outfit + DM Sans | Fokus (Tab) |\n|---|---|---|---|---|---|---|---|\n' + rows.join('\n'));
console.log(`\n${rows.length} kontroller, ${issues} med avvik`);
process.exit(issues ? 1 : 0);
