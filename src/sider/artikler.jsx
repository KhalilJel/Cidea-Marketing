import React from "react";

// Artiklene er de eksisterende filene i blog/*.md. De leses ved bygg og vises i sin helhet.
// Ingen nye artikler, datoer eller forfattere er lagt til (ingen slike opplysninger finnes).
const filer = import.meta.glob("../../blog/*.md", { query: "?raw", import: "default", eager: true });

// Tema per artikkel (samme inndeling som forsiden). Rekkefølgen er den forsiden allerede bruker.
const tema = {
  "hvor-mye-koster-en-nettside": "Nettsider",
  "hva-bor-en-god-bedriftsnettside-inneholde": "Nettsider",
  "hvorfor-vises-ikke-nettsiden-pa-google": "SEO",
  "hvordan-fa-flere-henvendelser-fra-nettsiden": "Nettsider",
};

export const artikler = Object.keys(tema).map(slug => {
  const kilde = filer[`../../blog/${slug}.md`];
  if (!kilde) throw new Error(`Mangler artikkel: ${slug}`);
  const linjer = kilde.replace(/\r/g, "").split("\n");
  const tittel = linjer.find(l => l.startsWith("# ")).slice(2).trim();
  const utdrag = linjer.find(l => l.trim() && !/^[#\-*]/.test(l.trim())).trim();
  return { slug, tema: tema[slug], tittel, utdrag, kilde };
});

// Interne lenker i artiklene peker til gamle eller ikke-eksisterende stier; de rettes til gjeldende sider.
function lenkemål(href) {
  if (href === "/contact") return "/kontakt";
  const md = href.match(/^\.\/([a-z0-9-]+)\.md$/);
  return md ? `/blog/${md[1]}` : href;
}

// Inline: **fet** og [tekst](lenke). Alt annet er ren tekst.
function inline(tekst, nøkkel) {
  const deler = []; const mønster = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g; let sist = 0, m, i = 0;
  while ((m = mønster.exec(tekst))) {
    if (m.index > sist) deler.push(tekst.slice(sist, m.index));
    deler.push(m[1] !== undefined
      ? <strong key={`${nøkkel}-${i++}`}>{inline(m[1], `${nøkkel}-${i}`)}</strong>
      : <a key={`${nøkkel}-${i++}`} href={lenkemål(m[3])}>{m[2]}</a>);
    sist = mønster.lastIndex;
  }
  if (sist < tekst.length) deler.push(tekst.slice(sist));
  return deler;
}

/** Brødteksten i en artikkel (alt etter H1), som React-elementer. */
export function ArtikkelTekst({ kilde }) {
  const blokker = kilde.replace(/\r/g, "").split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
  return blokker.filter(b => !b.startsWith("# ")).map((b, i) => {
    if (b.startsWith("## ")) return <h2 key={i}>{inline(b.slice(3), i)}</h2>;
    const linjer = b.split("\n");
    if (linjer.every(l => l.startsWith("- "))) return <ul key={i}>{linjer.map((l, j) => <li key={j}>{inline(l.slice(2), `${i}-${j}`)}</li>)}</ul>;
    return <p key={i}>{inline(linjer.join(" "), i)}</p>;
  });
}
