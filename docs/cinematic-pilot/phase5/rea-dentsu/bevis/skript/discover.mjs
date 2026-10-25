import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const url = process.argv[2] || 'https://www.dentsucreative.com/';
const b = await chromium.connectOverCDP('http://127.0.0.1:9222');
const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await c.newPage();
const net = [];
p.on('response', r => net.push({ u: r.url().slice(0, 160), t: r.request().resourceType(), s: r.status(), ct: (r.headers()['content-type'] || '').slice(0, 40) }));
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
await p.waitForTimeout(5000);
const rej = p.getByRole('button', { name: /reject all/i });
if (await rej.count()) { await rej.first().click(); await p.waitForTimeout(800); }
const info = await p.evaluate(() => {
  const libs = {}; for (const k of ['gsap', 'ScrollTrigger', 'Lenis', 'lenis', 'THREE', 'lottie', 'bodymovin', 'Swiper', 'barba', 'Flip', 'SplitText', 'locomotiveScroll', 'LocomotiveScroll', 'Vimeo', 'YT', 'Hls', 'videojs', 'Framer', 'React', 'next', '__NEXT_DATA__', '__NUXT__', 'Vue', '$', 'jQuery', 'Webflow', 'Alpine', 'Stimulus', 'Swup', 'Taxi', 'Highway', 'PIXI', 'OGL', 'Rive', 'rive']) if (window[k] !== undefined) libs[k] = typeof window[k] === 'object' && window[k] && window[k].version ? window[k].version : typeof window[k];
  if (window.gsap) { libs.gsap_version = gsap.version; libs.gsap_plugins = Object.keys(gsap.core?.globals?.() || {}).filter(x => /Trigger|Smoother|Split|Flip|Observer|Draggable|Motion/.test(x)); }
  if (window.ScrollTrigger) libs.scrolltriggers = ScrollTrigger.getAll().map(t => ({ trig: t.trigger?.className?.toString().slice(0, 60) || t.trigger?.tagName, pin: !!t.pin, scrub: t.vars?.scrub ?? null, start: String(t.vars?.start ?? ''), end: String(t.vars?.end ?? '') }));
  const html = document.documentElement;
  const all = [...document.querySelectorAll('body *')];
  const sticky = all.filter(e => ['sticky', 'fixed'].includes(getComputedStyle(e).position)).map(e => ({ tag: e.tagName, cls: (e.className?.toString() || '').slice(0, 70), pos: getComputedStyle(e).position, h: Math.round(e.getBoundingClientRect().height) })).slice(0, 30);
  const vids = [...document.querySelectorAll('video')].map(v => ({ src: (v.currentSrc || v.src || v.querySelector('source')?.src || '').slice(0, 140), autoplay: v.autoplay, loop: v.loop, muted: v.muted, playsinline: v.playsInline, paused: v.paused, t: +v.currentTime.toFixed(2), dur: +(v.duration || 0).toFixed(2), w: v.videoWidth, h: v.videoHeight, poster: !!v.poster, preload: v.preload, rect: (r => [Math.round(r.width), Math.round(r.height)])(v.getBoundingClientRect()) }));
  const fonts = [...new Set([...document.fonts].map(f => `${f.family.replace(/"/g, '')} ${f.weight} ${f.style} ${f.status}`))];
  const ff = sel => { const e = document.querySelector(sel); if (!e) return null; const cs = getComputedStyle(e); return { sel, txt: e.textContent.trim().slice(0, 60), font: cs.fontFamily.slice(0, 60), size: cs.fontSize, weight: cs.fontWeight, lh: cs.lineHeight, ls: cs.letterSpacing, tt: cs.textTransform, color: cs.color }; };
  const colors = {}; for (const e of all) { const cs = getComputedStyle(e); if (e.getBoundingClientRect().width < 2) continue; for (const v of [cs.backgroundColor, cs.color]) if (!/rgba\(0, 0, 0, 0\)/.test(v)) colors[v] = (colors[v] || 0) + 1; }
  const animTimeline = [...document.styleSheets].flatMap(s => { try { return [...s.cssRules].map(r => r.cssText).filter(t => /animation-timeline|view-timeline|scroll-timeline/.test(t)).slice(0, 5); } catch { return ['(cross-origin sheet)']; } });
  return {
    title: document.title, htmlClass: html.className.toString().slice(0, 200), bodyClass: document.body.className.toString().slice(0, 200), generator: document.querySelector('meta[name=generator]')?.content || null,
    libs, sticky, vids, fonts: fonts.slice(0, 30), canvas: document.querySelectorAll('canvas').length, webgl: [...document.querySelectorAll('canvas')].map(cv => { try { return !!(cv.getContext('webgl2') || cv.getContext('webgl')); } catch { return 'err'; } }),
    imgs: document.images.length, imgFormats: [...new Set([...document.images].map(i => (i.currentSrc.match(/\.(\w{3,4})(\?|$)/) || [])[1] || (i.currentSrc.match(/fm=(\w+)|format=(\w+)/) || []).slice(1).find(Boolean) || '?'))], lazy: [...document.images].filter(i => i.loading === 'lazy').length,
    type: [ff('h1'), ff('h2'), ff('h3'), ff('p'), ff('nav a'), ff('header a')].filter(Boolean),
    colors: Object.entries(colors).sort((a, b) => b[1] - a[1]).slice(0, 12),
    animTimeline: animTimeline.slice(0, 10), scrollH: document.documentElement.scrollHeight,
    links: [...new Set([...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')))].filter(h => h.startsWith('/') || h.includes('dentsucreative.com')).slice(0, 80),
    scripts: [...document.scripts].map(s => s.src).filter(Boolean).map(s => s.slice(0, 140)),
    sections: [...document.querySelectorAll('main > *, body > div > section, section')].slice(0, 25).map(s => ({ tag: s.tagName, cls: (s.className?.toString() || '').slice(0, 60), h: Math.round(s.getBoundingClientRect().height) }))
  };
});
const cdp = await c.newCDPSession(p);
const listeners = {};
for (const expr of ['window', 'document']) {
  const { result } = await cdp.send('Runtime.evaluate', { expression: expr });
  const { listeners: ls } = await cdp.send('DOMDebugger.getEventListeners', { objectId: result.objectId });
  listeners[expr] = [...new Set(ls.map(l => `${l.type}${l.passive ? '(passive)' : ''}`))];
}
info.listeners = listeners;
info.net = { total: net.length, byType: net.reduce((a, r) => (a[r.t] = (a[r.t] || 0) + 1, a), {}), hosts: [...new Set(net.map(r => new URL(r.u).host))], media: net.filter(r => r.t === 'media' || /video|mp4|webm|m3u8/.test(r.ct + r.u)).slice(0, 15) };
const out = process.argv[3] || 'discover.json';
writeFileSync(out, JSON.stringify(info, null, 1));
console.log(JSON.stringify({ title: info.title, libs: info.libs, htmlClass: info.htmlClass, vids: info.vids.length, canvas: info.canvas, sticky: info.sticky.length, listeners, hosts: info.net.hosts, scrollH: info.scrollH }, null, 1));
await c.close(); await b.close();
