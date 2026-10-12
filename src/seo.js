import { site, services, meta } from "./content.js";
import { getArticle } from "./articles.js";
import { localize, langs, htmlLang, indexablePaths } from "./routes.js";

const ogLocale = { no: "nb_NO", en: "en_GB" };

export function getHead(route) {
  const { lang, page } = route;
  const m = meta[lang];
  let title = m.homeTitle;
  let description = m.homeDesc;
  let type = "website";
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: site.name,
      url: site.origin + "/",
      email: site.email,
      description: meta[lang].homeDesc,
      address: { "@type": "PostalAddress", addressLocality: "Oslo", addressCountry: "NO" },
    },
  ];

  if (page === "service") {
    const s = services.find((x) => x.key === route.key)[lang];
    title = `${s.title.replace(/\.$/, "")} | ${site.name}`;
    description = s.lead.split(". ")[0].replace(/\.?$/, ".");
    schema.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.name,
      description: s.lead,
      provider: { "@type": "Organization", name: site.name, url: site.origin + "/" },
      areaServed: "NO",
    });
  } else if (page === "blog") {
    title = `${m.blogTitle} | ${site.name}`;
    description = lang === "en" ? "Practical answers about websites, SEO, branding and digital marketing." : "Praktiske svar om nettsider, SEO, branding og digital markedsføring.";
  } else if (page === "article") {
    const a = getArticle(lang, route.slug);
    title = `${a.title} | ${site.name}`;
    description = a.intro;
    type = "article";
    schema.push({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: a.title,
      description: a.intro,
      inLanguage: htmlLang[lang],
      mainEntityOfPage: site.origin + localize(lang, route.path),
      publisher: { "@type": "Organization", name: site.name },
    });
  } else if (page === "contact") {
    title = `${m.contactTitle} | ${site.name}`;
    description = m.contactDesc;
  } else if (page === "notfound") {
    title = `${m.notFoundTitle} | ${site.name}`;
  }

  const indexable = page !== "notfound";
  const canonical = indexable ? site.origin + localize(lang, route.path) : null;
  const alternates = indexable
    ? [...langs.map((l) => ({ hreflang: htmlLang[l], href: site.origin + localize(l, route.path) })), { hreflang: "x-default", href: site.origin + route.path }]
    : [];

  return { lang, title, description, canonical, alternates, robots: indexable ? "index,follow" : "noindex", type, schema };
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function headToHtml(head) {
  const tags = [
    `<title>${esc(head.title)}</title>`,
    `<meta name="description" content="${esc(head.description)}" />`,
    `<meta name="robots" content="${head.robots}" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:title" content="${esc(head.title)}" />`,
    `<meta property="og:description" content="${esc(head.description)}" />`,
    `<meta property="og:type" content="${head.type}" />`,
    `<meta property="og:locale" content="${ogLocale[head.lang]}" />`,
    `<meta name="twitter:card" content="summary" />`,
  ];
  if (head.canonical) {
    tags.push(`<link rel="canonical" href="${head.canonical}" />`, `<meta property="og:url" content="${head.canonical}" />`);
    for (const alt of head.alternates) tags.push(`<link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`);
  }
  for (const s of head.schema) tags.push(`<script type="application/ld+json">${JSON.stringify(s).replace(/</g, "\\u003c")}</script>`);
  return tags.join("\n    ");
}

export function sitemapXml() {
  const urls = indexablePaths().map((path) => {
    const links = langs.map((l) => `    <xhtml:link rel="alternate" hreflang="${htmlLang[l]}" href="${site.origin + localize(l, path)}"/>`).join("\n");
    return langs.map((l) => `  <url>\n    <loc>${site.origin + localize(l, path)}</loc>\n${links}\n  </url>`).join("\n");
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
}
