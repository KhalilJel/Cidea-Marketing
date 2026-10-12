// Static checks on the prerendered build (run `npm run build` first).
// Verifies every route: one <h1>, unique title, description, canonical,
// hreflang pairs, html lang, no leaked "undefined", internal links resolve,
// and the sitemap lists every indexable page.
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const origin = (fs.readFileSync("src/content.js", "utf8").match(/origin:\s*"([^"]+)"/) || [])[1];
const failures = [];
const fail = (where, msg) => failures.push(`${where}: ${msg}`);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));
}

const htmlFiles = walk(dist).filter((f) => f.endsWith(".html"));
const toUrl = (file) => {
  const rel = "/" + path.relative(dist, file).split(path.sep).join("/");
  return rel.replace(/\/index\.html$/, "") || "/";
};
const pages = new Map(htmlFiles.map((f) => [toUrl(f), fs.readFileSync(f, "utf8")]));
const routes = [...pages.keys()].filter((u) => !u.endsWith("404.html"));
const titles = new Map();

for (const url of routes) {
  const html = pages.get(url);
  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) fail(url, `expected 1 <h1>, found ${h1s.length}`);
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title) fail(url, "missing <title>");
  else if (titles.has(title)) fail(url, `duplicate title with ${titles.get(title)}`);
  else titles.set(title, url);
  if (!/<meta name="description" content="[^"]{40,}"/.test(html)) fail(url, "missing or short meta description");
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  if (canonical !== origin + url) fail(url, `canonical ${canonical} != ${origin + url}`);
  const isEn = url === "/en" || url.startsWith("/en/");
  if (!html.includes(`<html lang="${isEn ? "en" : "nb"}">`)) fail(url, "wrong html lang");
  for (const lang of ["nb", "en", "x-default"]) if (!html.includes(`hreflang="${lang}"`)) fail(url, `missing hreflang ${lang}`);
  if (/>undefined<|"undefined"|>null</.test(html)) fail(url, "leaked undefined/null in markup");
  if (!/<a[^>]+href="mailto:[^"]+"/.test(html)) fail(url, "no email contact link");
  for (const [, href] of html.matchAll(/<a[^>]+href="(\/[^"#]*)(#[^"]*)?"/g)) {
    const target = href.replace(/\/$/, "") || "/";
    if (!pages.has(target)) fail(url, `broken internal link ${href}`);
  }
}

for (const file of ["404.html", "en/404.html", "robots.txt", "sitemap.xml", "favicon.svg"]) {
  if (!fs.existsSync(path.join(dist, file))) fail("dist", `missing ${file}`);
}
const notFound = pages.get("/404.html");
if (notFound && !notFound.includes('content="noindex"')) fail("/404.html", "404 page must be noindex");

const sitemap = fs.existsSync(path.join(dist, "sitemap.xml")) ? fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8") : "";
for (const url of routes) if (!sitemap.includes(`<loc>${origin + url}</loc>`)) fail("sitemap.xml", `missing ${url}`);

if (failures.length) {
  console.error(`✗ ${failures.length} problem(s):\n  ` + failures.join("\n  "));
  process.exit(1);
}
console.log(`✓ ${routes.length} pages checked: headings, titles, meta, canonical, hreflang, links and sitemap all OK`);
