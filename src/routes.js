import { serviceKeys } from "./content.js";
import { articleSlugs } from "./articles.js";

export const langs = ["no", "en"];
export const htmlLang = { no: "nb", en: "en" };

// Norwegian lives at the root, English under /en.
export function localize(lang, path) {
  if (lang !== "en") return path;
  return path === "/" ? "/en" : "/en" + path;
}

export function resolve(pathname) {
  let path = decodeURI(pathname).replace(/\/index\.html$/, "").replace(/\.html$/, "").replace(/\/+$/, "") || "/";
  let lang = "no";
  if (path === "/en" || path.startsWith("/en/")) {
    lang = "en";
    path = path.slice(3) || "/";
  }
  const parts = path.split("/").filter(Boolean);
  if (path === "/") return { lang, page: "home", path };
  if (parts.length === 1 && serviceKeys.includes(parts[0])) return { lang, page: "service", key: parts[0], path };
  if (path === "/blog") return { lang, page: "blog", path };
  if (parts[0] === "blog" && parts.length === 2 && articleSlugs.includes(parts[1])) return { lang, page: "article", slug: parts[1], path };
  if (path === "/contact") return { lang, page: "contact", path };
  return { lang, page: "notfound", path };
}

export function routeId(route) {
  return [route.lang, route.page, route.key || route.slug || ""].join(":");
}

// Every indexable path (language-neutral form).
export function indexablePaths() {
  return ["/", ...serviceKeys.map((k) => "/" + k), "/blog", ...articleSlugs.map((s) => "/blog/" + s), "/contact"];
}
