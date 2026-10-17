import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const [outDir, ...pairs] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage();
for (const pair of pairs) { const [src, name, w] = pair.split('|'); const hf = resolve('out/_s.html'); writeFileSync(hf, `<html><body style="margin:0"><img id=i src="${pathToFileURL(resolve(src)).href}" style="width:${w}px;display:block"></body></html>`); await p.goto(pathToFileURL(hf).href, { waitUntil: 'load' }); await p.locator('#i').screenshot({ path: `${outDir}/${name}.jpg`, type: 'jpeg', quality: 75 }); }
await b.close(); console.log('ok', pairs.length);
