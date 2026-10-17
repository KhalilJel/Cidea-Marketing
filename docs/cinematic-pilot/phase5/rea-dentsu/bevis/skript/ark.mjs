// node ark.mjs <dir> <kolonner> <bredde-per-bilde> <utfil>  – kontaktark av steg-*.png og aapning-*.png
import { chromium } from 'playwright';
import { readdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const [dir, cols = '4', w = '360', out] = process.argv.slice(2);
const files = readdirSync(dir).filter(f => /^(aapning|steg|tilbake).*\.png$/.test(f)).sort();
const html = `<html><body style="margin:0;background:#222;font:12px sans-serif;color:#ddd;display:grid;grid-template-columns:repeat(${cols},${w}px);gap:6px;padding:6px">${files.map(f => `<figure style="margin:0"><img src="${pathToFileURL(resolve(dir, f)).href}" style="width:${w}px;display:block"><figcaption>${f.replace('.png', '')}</figcaption></figure>`).join('')}</body></html>`;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +cols * (+w + 6) + 6, height: 400 } });
const hf = resolve(dir, '_ark.html'); writeFileSync(hf, html); await p.goto(pathToFileURL(hf).href, { waitUntil: 'load' }); await p.screenshot({ path: out, fullPage: true, ...(out.endsWith('.jpg') ? { type: 'jpeg', quality: 72 } : {}) }); await b.close(); console.log(out, files.length);
