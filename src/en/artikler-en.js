// Engelske artikler (Insights): filene i insights/*.md, lest ved bygg. Samme markdown-format som blog/*.md og samme
// visning (ArtikkelTekst). Rekkefølge, tema, dato og metadata står i tabellen under.
const filer = import.meta.glob("../../insights/*.md", { query: "?raw", import: "default", eager: true });

const metadata = {
  "working-with-a-marketing-agency-in-another-country": { tema: "Collaboration", dato: "28 October 2026",
    metaTittel: "Working with a marketing agency in another country | Cidea",
    beskrivelse: "What to agree before you hire an agency abroad: scope, communication, feedback, language and ownership. A practical guide to remote agency projects." },
  "what-a-business-website-should-include": { tema: "Websites", dato: "28 October 2026",
    metaTittel: "What a business website should include | Cidea Marketing",
    beskrivelse: "Page by page: what the homepage, service pages, about page and contact page should answer, plus language, speed and a checklist before launch." },
  "rebuilding-your-website-without-losing-search-visibility": { tema: "SEO", dato: "28 October 2026",
    metaTittel: "Rebuild your website without losing search visibility | Cidea",
    beskrivelse: "How to protect your search visibility during a website rebuild or new language launch: inventory, content, 301 redirects, hreflang and a launch checklist." },
};

export const artiklerEn = Object.keys(metadata).map(slug => {
  const kilde = filer[`../../insights/${slug}.md`];
  if (!kilde) throw new Error(`Missing article: ${slug}`);
  const linjer = kilde.replace(/\r/g, "").split("\n");
  const tittel = linjer.find(l => l.startsWith("# ")).slice(2).trim();
  const utdrag = linjer.find(l => l.trim() && !/^[#\-*|\d]/.test(l.trim())).trim();
  const m = metadata[slug];
  return { slug, sti: `/insights/${slug}`, tittel, utdrag, kilde, ...m };
});
