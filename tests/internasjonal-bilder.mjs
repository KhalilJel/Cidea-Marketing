// Skjermbilder til visuell kontroll av den internasjonale delen (oktober 2026). Kjør etter `npm run build`:
// node tests/internasjonal-bilder.mjs → docs/internasjonal/bilder/*.jpg (helside, redusert bevegelse).
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { serve } from './serve-dist.mjs';
const ut = fileURLToPath(new URL('../docs/internasjonal/bilder/', import.meta.url));
const server = await serve(4192); const b = await chromium.launch();
const sider = [['forside-en', '/'], ['forside-no', '/no'], ['dubai', '/dubai'], ['services', '/services'], ['websites-en', '/services/websites'], ['contact', '/contact'], ['about', '/about'], ['insights', '/insights'], ['tjenester-no', '/tjenester']];
for (const [navn, sti] of sider) for (const w of [390, 1440]) {
  const p = await b.newPage({ viewport: { width: w, height: w < 768 ? 844 : 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce', ...(w < 768 ? { isMobile: true, hasTouch: true } : {}) });
  await p.goto('http://127.0.0.1:4192' + sti, { waitUntil: 'networkidle' });
  await p.screenshot({ path: `${ut}${navn}-${w}.jpg`, fullPage: true, quality: 60, type: 'jpeg' });
  if (w < 768 && navn === 'dubai') { await p.locator('.cm-menyknapp').click(); await p.screenshot({ path: `${ut}meny-dubai-390.jpg`, quality: 60, type: 'jpeg' }); }
  await p.close();
}
await b.close(); server.close(); console.log('bilder lagret i', ut);
