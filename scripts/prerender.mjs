// Renders every route to static HTML after `vite build`, so each URL ships
// with its own title, description, canonical and hreflang tags and full content.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const dist = path.resolve("dist");
const server = path.resolve("dist-server/entry-server.js");
const { render, urls, notFoundUrls, sitemapXml } = await import(pathToFileURL(server).href);
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

function page(url) {
  const r = render(url);
  return template
    .replace(/<html lang="[^"]*">/, `<html lang="${r.lang}">`)
    .replace("<!--app-head-->", r.head)
    .replace('<div id="root"><!--app-html--></div>', `<div id="root" data-route="${r.id}">${r.html}</div>`);
}

function write(file, html) {
  const target = path.join(dist, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
}

let count = 0;
for (const url of urls()) {
  const file = url === "/" ? "index.html" : path.join(url.slice(1), "index.html");
  write(file, page(url));
  count++;
}
for (const [file, url] of Object.entries(notFoundUrls)) {
  write(file, page(url));
  count++;
}
write("sitemap.xml", sitemapXml());
fs.rmSync(path.resolve("dist-server"), { recursive: true, force: true });
console.log(`Prerendered ${count} pages and sitemap.xml`);
