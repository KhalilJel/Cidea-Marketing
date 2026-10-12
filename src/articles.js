// Articles are the markdown files in /blog (Norwegian) and /blog/en (English).
const rawNo = import.meta.glob("../blog/*.md", { query: "?raw", import: "default", eager: true });
const rawEn = import.meta.glob("../blog/en/*.md", { query: "?raw", import: "default", eager: true });

// Display order on listing pages.
export const articleOrder = [
  "hva-bor-en-god-bedriftsnettside-inneholde",
  "hvorfor-vises-ikke-nettsiden-pa-google",
  "hvor-mye-koster-en-nettside",
  "hvordan-fa-flere-henvendelser-fra-nettsiden",
];

function slugOf(file) {
  return file.split("/").pop().replace(/\.md$/, "");
}

function stripInline(text) {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[(.+?)\]\((.+?)\)/g, "$1");
}

function parse(raw) {
  const text = raw.replace(/\r\n/g, "\n").trim();
  const lines = text.split("\n");
  const title = lines[0].replace(/^#\s+/, "").trim();
  const body = lines.slice(1).join("\n").trim();
  const intro = stripInline(body.split(/\n\s*\n/).find((block) => block.trim() && !block.startsWith("#")) || "");
  const words = body.split(/\s+/).filter(Boolean).length;
  return { title, body, intro, minutes: Math.max(1, Math.round(words / 200)) };
}

function collect(raw) {
  const out = {};
  for (const [file, content] of Object.entries(raw)) out[slugOf(file)] = parse(content);
  return out;
}

const byLang = { no: collect(rawNo), en: collect(rawEn) };

export const articleSlugs = articleOrder.filter((slug) => byLang.no[slug]);

export function getArticle(lang, slug) {
  const article = byLang[lang]?.[slug] || byLang.no[slug];
  return article ? { slug, ...article } : null;
}

export function listArticles(lang) {
  return articleSlugs.map((slug) => getArticle(lang, slug));
}
