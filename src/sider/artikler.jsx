import React from "react";

// Artiklene er filene i blog/*.md. De leses ved bygg og vises i sin helhet.
// Rekkefølge, tema, metadata og oppdatert-dato står i tabellen under. Datoen er satt bare der artikkelen er skrevet
// eller oppdatert med tekstene eier godkjente i oktober 2026; den eldste artikkelen har ingen dato.
const filer = import.meta.glob("../../blog/*.md", { query: "?raw", import: "default", eager: true });

const metadata = {
  "hvor-mye-koster-en-nettside": { tema: "Nettsider", oppdatert: "26. oktober 2026",
    metaTittel: "Hvor mye koster en nettside for bedrift? | Cidea Marketing",
    beskrivelse: "Hva betaler dere for når dere kjøper nettside? Prismodeller, hva som påvirker prisen, hva som kommer i tillegg og hvordan dere sammenligner tilbud." },
  "webbyra-abonnement-eller-gjore-det-selv": { tema: "Nettsider", oppdatert: "26. oktober 2026",
    beskrivelse: "Tre måter å få nettside på, med fordeler, ulemper og spørsmål å stille. Slik finner dere ut hva som passer bedriften, budsjettet og tiden dere har." },
  "hva-bor-en-god-bedriftsnettside-inneholde": { tema: "Nettsider", oppdatert: "26. oktober 2026",
    beskrivelse: "Side for side: hva forsiden, tjenestesidene, om oss og kontaktsiden bør svare på, og hvordan dere skriver tekst som gjør det lett å velge dere." },
  "slik-foregar-et-nettsideprosjekt": { tema: "Nettsider", oppdatert: "26. oktober 2026",
    metaTittel: "Slik foregår et nettsideprosjekt, steg for steg | Cidea",
    beskrivelse: "Hva skjer fra første samtale til lansering, hva må dere bidra med, og hva gjør at prosjekter tar lengre tid? En praktisk gjennomgang før dere starter." },
  "ny-nettside-uten-a-miste-synlighet-i-google": { tema: "SEO", oppdatert: "26. oktober 2026",
    metaTittel: "Ny nettside uten å miste synligheten i Google | Cidea",
    beskrivelse: "Bytter dere nettside? Slik beholder dere synligheten i Google: videresending, innhold som bør beholdes og en sjekkliste før og etter lansering." },
  "hvordan-fa-flere-henvendelser-fra-nettsiden": { tema: "Nettsider", oppdatert: "26. oktober 2026",
    beskrivelse: "Får nettsiden besøk, men få henvendelser? Slik gjør dere budskapet tydeligere, bygger tillit og gjør neste steg enkelt. Med sjekkliste." },
  "hvorfor-vises-ikke-nettsiden-pa-google": { tema: "SEO",
    beskrivelse: "Teknisk struktur, innhold, søkeintensjon, konkurranse og autoritet avgjør synligheten i Google. Slik finner dere ut hvorfor nettsiden ikke vises." },
};

export const artikler = Object.keys(metadata).map(slug => {
  const kilde = filer[`../../blog/${slug}.md`];
  if (!kilde) throw new Error(`Mangler artikkel: ${slug}`);
  const linjer = kilde.replace(/\r/g, "").split("\n");
  const tittel = linjer.find(l => l.startsWith("# ")).slice(2).trim();
  const utdrag = linjer.find(l => l.trim() && !/^[#\-*|\d]/.test(l.trim())).trim();
  const m = metadata[slug];
  return { slug, tema: m.tema, oppdatert: m.oppdatert, tittel, utdrag,
    metaTittel: m.metaTittel || `${tittel} | Cidea Marketing`, beskrivelse: m.beskrivelse || utdrag, kilde };
});

// Interne lenker i artiklene: ./slug.md blir /blog/slug. (/contact er nå den engelske kontaktsiden og rettes ikke
// lenger til /kontakt; ingen norske artikler lenker dit, kontrollert ved internasjonaliseringen i oktober 2026.)
function lenkemål(href) {
  const md = href.match(/^\.\/([a-z0-9-]+)\.md$/);
  return md ? `/blog/${md[1]}` : href;
}

// Inline: **fet** og [tekst](lenke). Alt annet er ren tekst.
export function inline(tekst, nøkkel = "i") {
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

/** Kort tekst fra innholdsfilene: avsnitt skilt med tom linje, med **fet** og [lenker](/sti). */
export function RikTekst({ tekst }) {
  return tekst.split(/\n{2,}/).map((b, i) => <p key={i}>{inline(b, `r${i}`)}</p>);
}

const celler = linje => linje.trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim());

/** Brødteksten i en artikkel (alt etter H1), som React-elementer. Støtter ##, ###, lister, nummererte lister og tabeller. */
export function ArtikkelTekst({ kilde }) {
  const blokker = kilde.replace(/\r/g, "").split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
  return blokker.filter(b => !b.startsWith("# ")).map((b, i) => {
    if (b.startsWith("### ")) return <h3 key={i}>{inline(b.slice(4), i)}</h3>;
    if (b.startsWith("## ")) return <h2 key={i}>{inline(b.slice(3), i)}</h2>;
    const linjer = b.split("\n");
    if (linjer.every(l => l.startsWith("- "))) return <ul key={i}>{linjer.map((l, j) => <li key={j}>{inline(l.slice(2), `${i}-${j}`)}</li>)}</ul>;
    if (linjer.every(l => /^\d+\. /.test(l))) return <ol key={i}>{linjer.map((l, j) => <li key={j}>{inline(l.replace(/^\d+\. /, ""), `${i}-${j}`)}</li>)}</ol>;
    if (linjer.length > 2 && linjer.every(l => l.trim().startsWith("|")) && /^\|?\s*-/.test(linjer[1].trim())) {
      const [hode, , ...rader] = linjer;
      return (
        <div key={i} className="sd-tabell"><table>
          <thead><tr>{celler(hode).map((c, j) => <th key={j} scope="col">{inline(c, `${i}-h${j}`)}</th>)}</tr></thead>
          <tbody>{rader.map((r, k) => <tr key={k}>{celler(r).map((c, j) => j === 0
            ? <th key={j} scope="row">{inline(c, `${i}-${k}-${j}`)}</th>
            : <td key={j}>{inline(c, `${i}-${k}-${j}`)}</td>)}</tr>)}</tbody>
        </table></div>
      );
    }
    return <p key={i}>{inline(linjer.join(" "), i)}</p>;
  });
}
