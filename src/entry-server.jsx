import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App.jsx";
import { resolve, routeId, htmlLang, indexablePaths, localize, langs } from "./routes.js";
import { getHead, headToHtml, sitemapXml } from "./seo.js";

export function render(url) {
  const route = resolve(url);
  return {
    html: renderToString(<App route={route} />),
    head: headToHtml(getHead(route)),
    lang: htmlLang[route.lang],
    id: routeId(route),
    page: route.page,
  };
}

// Every URL to prerender, plus the two 404 pages.
export function urls() {
  const list = [];
  for (const lang of langs) for (const path of indexablePaths()) list.push(localize(lang, path));
  return list;
}

export const notFoundUrls = { "404.html": "/404", "en/404.html": "/en/404" };

export { sitemapXml };
