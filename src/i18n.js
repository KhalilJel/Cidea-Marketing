// Språkstruktur (internasjonalisering, oktober 2026). Engelsk er hovedspråket for det internasjonale markedet og ligger
// på rotnivå; norsk forside er /no. De norske undersidene beholder sine etablerte adresser (/tjenester, /websites,
// /seo, /personvern …) for å beskytte norsk SEO og lenker fra Gullkornet. Se docs/internasjonal/URL-STRATEGI.md.
// Brukes ved forhåndsrendring (hreflang, canonical, lang, sitemap) og i Ramme (språkvelgeren).

export const DOMENE = "https://cideamarketing.com";

// Norsk adresse → engelsk adresse for sider med likeverdig innhold. Sider uten motpart (artikler, /dubai)
// får ingen hreflang-par, og språkvelgeren leder da til forsiden på det andre språket.
export const sprakPar = [
  ["/no", "/"],
  ["/tjenester", "/services"],
  ["/websites", "/services/websites"],
  ["/branding", "/services/branding"],
  ["/seo", "/services/seo"],
  ["/digital-marketing", "/services/social-media"],
  ["/om-oss", "/about"],
  ["/blog", "/insights"],
  ["/kontakt", "/contact"],
  ["/kontakt/takk", "/contact/thanks"],
  ["/personvern", "/privacy"],
];

const tilEn = new Map(sprakPar);
const tilNo = new Map(sprakPar.map(([no, en]) => [en, no]));

// Engelske stier: forsiden (statisk) og sidene i src/en/ruter-en.jsx.
const ENGELSKE_PREFIKS = ["/services", "/about", "/insights", "/contact", "/dubai", "/privacy"];
export function erEngelsk(sti) {
  return sti === "/" || ENGELSKE_PREFIKS.some(p => sti === p || sti.startsWith(`${p}/`));
}
export const sprakFor = sti => (erEngelsk(sti) ? "en" : "no");

/** Motparten på det andre språket, eller null. */
export function motpart(sti) {
  return erEngelsk(sti) ? tilNo.get(sti) ?? null : tilEn.get(sti) ?? null;
}

/** Lenken i språkvelgeren: motparten hvis den finnes, ellers forsiden på det andre språket. */
export function sprakLenke(sti) {
  const en = erEngelsk(sti);
  return { href: motpart(sti) || (en ? "/no" : "/"), lang: en ? "no" : "en", tekst: en ? "Norsk" : "English",
    etikett: en ? "Les på norsk" : "Read in English" };
}

/** hreflang-sett for en side: seg selv, motparten og x-default (engelsk versjon). Tomt når siden ikke har motpart. */
export function hreflang(sti) {
  const andre = motpart(sti);
  if (!andre) return [];
  const [no, en] = erEngelsk(sti) ? [andre, sti] : [sti, andre];
  return [["no", no], ["en", en], ["x-default", en]].map(([hl, s]) => ({ hreflang: hl, href: `${DOMENE}${s}` }));
}

export const url = sti => `${DOMENE}${sti === "/" ? "/" : sti}`;
