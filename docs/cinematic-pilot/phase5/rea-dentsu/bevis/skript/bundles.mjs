import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const b = await chromium.connectOverCDP('http://127.0.0.1:9222');
const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await c.newPage();
const js = new Set();
p.on('response', r => { if (r.url().includes('/_next/static/') && r.url().endsWith('.js')) js.add(r.url()); });
for (const u of ['https://www.dentsucreative.com/', 'https://www.dentsucreative.com/services/brand', 'https://www.dentsucreative.com/cases/a-piece-of-me']) { await p.goto(u, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {}); await p.waitForTimeout(2500); }
const sig = { gsap: /gsap|GreenSock/i, ScrollTrigger: /ScrollTrigger/, ScrollSmoother: /ScrollSmoother/, 'pin-spacer': /pin-spacer/, Lenis: /lenis/i, SplitText: /SplitText/, Flip: /\bFlip\b.{0,40}(getState|from)/, Observer: /Observer\.create|gsap\.Observer/, lottie: /lottie|bodymovin/i, three: /THREE\.|WebGLRenderer/, swiper: /swiper/i, 'framer-motion': /framer-motion|useAnimation|motionValue/, 'embla': /embla/i, 'keen-slider': /keen-slider/i, hls: /hls\.js|Hls\.isSupported/, vimeo: /player\.vimeo|vimeocdn/i, youtube: /youtube\.com\/embed|ytimg/i, mux: /mux\.com|stream\.mux/i, contentful: /contentful|ctfassets/i, sanity: /sanity\.io|cdn\.sanity/i, storyblok: /storyblok/i, prismic: /prismic/i, datocms: /datocms/i, 'prefers-reduced-motion': /prefers-reduced-motion/, matchMedia: /matchMedia\(/, IntersectionObserver: /IntersectionObserver/, requestAnimationFrame: /requestAnimationFrame/, 'scroll-snap': /scroll-snap/, 'animation-timeline': /animation-timeline|ViewTimeline|ScrollTimeline/ };
const hits = {}; const where = {}; let bytes = 0;
for (const u of js) {
  const t = await p.evaluate(async x => (await fetch(x)).text(), u);
  bytes += t.length;
  for (const [k, re] of Object.entries(sig)) if (re.test(t)) { hits[k] = (hits[k] || 0) + 1; (where[k] ||= []).push(u.split('/').pop()); }
  const v = t.match(/gsap.{0,6}version.{0,4}["'](\d+\.\d+\.\d+)/) || t.match(/version:"(3\.\d+\.\d+)"/); if (v) hits.gsap_version = v[1];
  const l = t.match(/lenis.{0,80}?(\d+\.\d+\.\d+)/i); if (l) hits.lenis_version_hint = l[1];
  const css = t.match(/ScrollSmoother.{0,200}/); if (css) hits.smoother_excerpt = css[0].slice(0, 160);
}
writeFileSync('bundles.json', JSON.stringify({ files: js.size, bytes, hits, where }, null, 1));
console.log(js.size, 'filer', Math.round(bytes / 1024), 'KiB'); console.log(hits);
await c.close(); await b.close();
