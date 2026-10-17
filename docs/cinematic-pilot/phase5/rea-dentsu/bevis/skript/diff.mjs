import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
writeFileSync('out/_diff.html', '<html><body></body></html>');
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage();
await p.goto(pathToFileURL(resolve('out/_diff.html')).href);
const steps = ['aapning-0900ms', 'aapning-2500ms', 'steg-00', 'steg-02', 'steg-03', 'steg-05', 'steg-06', 'steg-08', 'steg-11', 'steg-14'];
const res = await p.evaluate(async steps => {
  const load = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
  const px = img => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(0, 0, c.width, c.height).data; };
  const out = [];
  for (const s of steps) { const [a, b] = await Promise.all([load(`forside-1440/${s}.png`), load(`forside-1440-redusert/${s}.png`)]); const A = px(a), B = px(b); let d = 0; for (let i = 0; i < A.length; i += 4) if (Math.abs(A[i] - B[i]) + Math.abs(A[i + 1] - B[i + 1]) + Math.abs(A[i + 2] - B[i + 2]) > 48) d++; out.push(`${s}: ${(100 * d / (A.length / 4)).toFixed(1)} % ulike piksler`); }
  return out;
}, steps);
console.log(res.join('\n')); await b.close();
