// Validerer Cidea-motiv-SVG-er mot regelen (fase 3 godkjent, fase 4 kanonisk):
//  R1 2–4 fargeplan (et helflate-bakgrunnsrektangel teller ikke)
//  R2 planene henger sammen (overlapper eller deler kant)
//  R3 nøyaktig ett plan med 45°-hakk nede til høyre, hakkets side = round(kortside/6) (±1 px)
//  R4 hakkhjørnet er synlig: ingen plan tegnet etter hakkplanet dekker hakkområdet
//  R5 ingen strek, sirkel, tekst, gradient, bilde eller filter
//  R6 viewBox finnes og alle plan ligger innenfor lerretet
// Bruk: node validate-motif.mjs <fil-eller-mappe> [...]  → skriver tabell, exit 1 ved feil.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const files = process.argv.slice(2).flatMap(p => statSync(p).isDirectory()
  ? readdirSync(p).filter(f => f.endsWith('.svg')).map(f => join(p, f)) : [p]);

const num = s => Number(s);
function parse(svg) {
  const vb = (svg.match(/viewBox="([^"]+)"/) || [])[1];
  const [, , W, H] = vb ? vb.split(/[ ,]+/).map(num) : [0, 0, 0, 0];
  const shapes = [];
  for (const m of svg.matchAll(/<(rect|polygon)\b([^>]*)\/?>/g)) {
    const a = Object.fromEntries([...m[2].matchAll(/([a-z-]+)="([^"]*)"/g)].map(x => [x[1], x[2]]));
    if (m[1] === 'rect') shapes.push({ t: 'rect', x: num(a.x || 0), y: num(a.y || 0), w: num(a.width), h: num(a.height), fill: a.fill, stroke: a.stroke });
    else {
      const pts = a.points.trim().split(/\s+/).map(p => p.split(',').map(num));
      shapes.push({ t: 'poly', pts, fill: a.fill, stroke: a.stroke });
    }
  }
  return { W, H, vb, shapes };
}

// Gjenkjenner et rektangel med 45°-hakk nede til høyre: 5 punkter (x,y)(x+w,y)(x+w,y+h-n)(x+w-n,y+h)(x,y+h)
function asNotched(p) {
  if (p.pts.length !== 5) return null;
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3], [x4, y4]] = p.pts;
  const w = x1 - x0, h = y4 - y0, n = (y0 + h) - y2;
  const ok = y0 === y1 && x1 === x2 && x4 === x0 && y3 === y4 && Math.abs((x1 - x3) - n) < 0.01 && n > 0;
  return ok ? { x: x0, y: y0, w, h, n } : null;
}
const inside = (px, py, r) => px > r.x + 0.01 && px < r.x + r.w - 0.01 && py > r.y + 0.01 && py < r.y + r.h - 0.01;
const touch = (a, b) => a.x <= b.x + b.w && b.x <= a.x + a.w && a.y <= b.y + b.h && b.y <= a.y + a.h;

let failed = 0;
const rows = [];
for (const f of files) {
  const svg = readFileSync(f, 'utf8');
  const errs = [];
  const { W, H, vb, shapes } = parse(svg);
  if (!vb) errs.push('R6 mangler viewBox');
  if (/<(circle|ellipse|line|path|text|image|linearGradient|radialGradient|filter)\b/.test(svg) || /stroke="(?!none)/.test(svg)) errs.push('R5 forbudt element/strek');
  // Bakgrunn: rektangel som dekker hele lerretet
  const planes = shapes.filter(s => !(s.t === 'rect' && s.x === 0 && s.y === 0 && s.w === W && s.h === H));
  const boxes = planes.map(s => s.t === 'rect' ? { ...s } : (() => { const n = asNotched(s); return n ? { ...n, notched: true } : { bad: true }; })());
  if (boxes.some(b => b.bad)) errs.push('R3 ukjent polygonform');
  if (planes.length < 2 || planes.length > 4) errs.push(`R1 ${planes.length} plan`);
  const ni = boxes.findIndex(b => b.notched);
  const notchCount = boxes.filter(b => b.notched).length;
  if (notchCount !== 1) errs.push(`R3 ${notchCount} hakk`);
  if (ni >= 0) {
    const b = boxes[ni], expect = Math.round(Math.min(b.w, b.h) / 6);
    if (Math.abs(b.n - expect) > 1) errs.push(`R3 hakk ${b.n} ≠ ${expect}`);
    // R4: punkter langs hakkets diagonal og like innenfor hakkplanet nær hjørnet må ikke dekkes
    const probes = [[b.x + b.w - b.n * 0.25, b.y + b.h - b.n * 1.25], [b.x + b.w - b.n * 1.25, b.y + b.h - b.n * 0.25], [b.x + b.w - b.n * 0.6, b.y + b.h - b.n * 0.6]];
    for (const later of boxes.slice(ni + 1)) if (!later.bad && probes.some(([px, py]) => inside(px, py, later))) errs.push('R4 hakket dekkes');
  }
  // R2: sammenheng (graf over planer som berører hverandre)
  const good = boxes.filter(b => !b.bad);
  if (good.length) {
    const seen = new Set([0]); const q = [0];
    while (q.length) { const i = q.pop(); good.forEach((b, j) => { if (!seen.has(j) && touch(good[i], b)) { seen.add(j); q.push(j); } }); }
    if (seen.size !== good.length) errs.push('R2 planer henger ikke sammen');
  }
  if (good.some(b => b.x < 0 || b.y < 0 || b.x + b.w > W + 0.01 || b.y + b.h > H + 0.01)) errs.push('R6 utenfor lerret');
  const bytes = Buffer.byteLength(svg);
  if (errs.length) failed++;
  rows.push(`| ${f.split(/[\\/]/).pop()} | ${W}×${H} | ${planes.length} | ${ni >= 0 ? boxes[ni].n : '–'} | ${bytes} B | ${errs.length ? 'FEIL: ' + [...new Set(errs)].join('; ') : 'OK'} |`);
}
console.log('| Fil | Lerret | Plan | Hakk (px) | Størrelse | Resultat |\n|---|---|---|---|---|---|\n' + rows.join('\n'));
console.log(`\n${files.length} filer, ${failed} med feil`);
process.exit(failed ? 1 : 0);
