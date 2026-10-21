import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const { where } = JSON.parse(readFileSync('bundles.json'));
const b = await chromium.connectOverCDP('http://127.0.0.1:9222');
const c = await b.newContext(); const p = await c.newPage();
await p.goto('https://www.dentsucreative.com/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3000);
const urls = await p.evaluate(() => performance.getEntriesByType('resource').map(r => r.name).filter(u => u.includes('/_next/static/') && u.endsWith('.js')));
const find = async (re, n = 3, w = 140) => { const out = []; for (const u of urls) { const t = await p.evaluate(async x => (await fetch(x)).text(), u); let m; const g = new RegExp(re, 'g'); while ((m = g.exec(t)) && out.length < n) out.push(u.split('/').pop() + ': ' + t.slice(Math.max(0, m.index - w), m.index + w).replace(/\s+/g, ' ')); } return out; };
for (const [k, re] of [['three', 'THREE\.|WebGLRenderer'], ['reduced', 'prefers-reduced-motion'], ['smoother.create', 'ScrollSmoother\.create|smooth:\s*[\d.]+|smoothTouch'], ['scrub', 'scrub:'], ['pin', 'pin:\s*(!0|true)'], ['snap', 'scroll-snap']]) { console.log('==', k); for (const s of await find(re)) console.log('  ', s); }
await c.close(); await b.close();
