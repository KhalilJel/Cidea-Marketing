// WCAG AA contrast check for every token colour pair, plus a hard gate on the pairs the
// components actually use. Writes docs/design-system/contrast-report.md.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { contrast, grade } from './lib/contrast.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const { color, service } = JSON.parse(readFileSync(root + 'src/design-system/tokens.json', 'utf8'));
const names = Object.keys(color);

// [foreground, background, minimum ratio, where it is used]
const used = [
  ['navy', 'white', 4.5, 'body text'],
  ['navy', 'ivory', 4.5, 'body text on ivory sections'],
  ['navy', 'offWhite', 4.5, 'body text on off-white sections'],
  ['slate', 'white', 4.5, 'muted text'],
  ['slate', 'offWhite', 4.5, 'muted text on off-white'],
  ['navy', 'ivory', 4.5, 'muted text on ivory (slate fails here, see below)'],
  ['offWhite', 'navy', 4.5, 'text on dark sections (hero, CTA, footer)'],
  ['mist', 'navy', 4.5, 'muted text on dark sections'],
  ['white', 'blue', 4.5, 'primary button label'],
  ['blue', 'white', 4.5, 'links'],
  ['blue', 'ivory', 4.5, 'links on ivory'],
  ['blue', 'offWhite', 4.5, 'links on off-white'],
  ['blue', 'white', 3, 'focus ring on light surfaces'],
  ['white', 'navy', 3, 'focus ring on dark surfaces'],
  ['slate', 'white', 3, 'card border / input outline (UI)'],
];
// Per service: --accent-text on light surfaces and --on-accent on the accent fill.
for (const s of Object.values(service)) {
  const a = s.accent;
  const textSafe = Math.min(contrast(color[a], color.white), contrast(color[a], color.ivory)) >= 4.5;
  const textColor = textSafe ? a : 'navy';
  used.push([textColor, 'white', 4.5, `${s.label}: accent text on white`]);
  used.push([textColor, 'ivory', 4.5, `${s.label}: accent text on ivory`]);
  const on = contrast(color.white, color[a]) >= 4.5 ? 'white' : 'navy';
  used.push([on, a, 4.5, `${s.label}: text on accent fill`]);
}

const fmt = r => r.toFixed(2);
let md = '# Kontrastrapport (WCAG 2.2 AA)\n\nGenerert av `scripts/contrast-check.mjs` fra `src/design-system/tokens.json`.\n' +
  'Terskler: normal tekst 4.5:1, stor tekst (≥24px / ≥18.66px fet) og UI-elementer 3:1.\n\n';

md += '## Kombinasjoner brukt i komponentene\n\n| Forgrunn | Bakgrunn | Ratio | Krav | Status | Bruk |\n|---|---|---|---|---|---|\n';
let failures = 0;
for (const [fg, bg, min, where] of used) {
  const r = contrast(color[fg], color[bg]);
  const ok = r >= min;
  if (!ok) failures++;
  md += `| ${fg} ${color[fg]} | ${bg} ${color[bg]} | ${fmt(r)} | ${min} | ${ok ? 'PASS' : 'FAIL'} | ${where} |\n`;
}

md += '\n## Ikke tillatt for normal tekst\n\n' +
  `- \`slate\` på \`ivory\`: ${fmt(contrast(color.slate, color.ivory))}:1 — under 4.5. Dempet tekst på ivory bruker derfor navy (\`--text-muted\`).\n`;

md += '\n## Aksentfarger som tekst\n\n| Aksent | på white | på ivory | på offWhite | Normal tekst på lys flate? |\n|---|---|---|---|---|\n';
for (const s of Object.values(service)) {
  const h = color[s.accent];
  const [w, i, o] = ['white', 'ivory', 'offWhite'].map(b => contrast(h, color[b]));
  const lo = Math.min(w, i, o);
  const verdict = lo >= 4.5 ? 'Ja'
    : lo >= 3 ? 'Nei — navy for normal tekst; aksent tillatt for stor tekst og UI-elementer (≥3:1)'
    : 'Nei — navy for tekst; aksent kun dekorativt (under 3:1, heller ikke UI-grense)';
  md += `| ${s.label} (${s.accent} ${h}) | ${fmt(w)} | ${fmt(i)} | ${fmt(o)} | ${verdict} |\n`;
}

md += '\n## Full matrise (forgrunn → rad, bakgrunn → kolonne)\n\n| | ' + names.join(' | ') + ' |\n|' + '---|'.repeat(names.length + 1) + '\n';
for (const fg of names) {
  md += `| **${fg}** | ` + names.map(bg => fg === bg ? '–' : `${fmt(contrast(color[fg], color[bg]))} ${grade(contrast(color[fg], color[bg]))}`).join(' | ') + ' |\n';
}

mkdirSync(root + 'docs/design-system', { recursive: true });
writeFileSync(root + 'docs/design-system/contrast-report.md', md);
for (const [fg, bg, min, where] of used) {
  const r = contrast(color[fg], color[bg]);
  console.log(`${r >= min ? 'PASS' : 'FAIL'} ${fmt(r).padStart(5)} >= ${min}  ${fg} on ${bg}  (${where})`);
}
if (failures) { console.error(`${failures} contrast failure(s)`); process.exit(1); }
console.log('All used colour pairs meet WCAG AA.');
