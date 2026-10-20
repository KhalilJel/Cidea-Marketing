import React, { useEffect, useRef } from "react";
import "../forside/forside.css";
import "./konsept-scroll.css";
import { Ramme, useMeta } from "../forside/Ramme.jsx";
import { tjenester, steg, artikler } from "../forside/Forside.jsx";

// Prototype for retningen «Fra ord til gjennomslag» (fase 5, ikke godkjent). Isolert på /konsept-scroll.
// Forløp (eiers føring 2026-10-20): hvit flate med én CIDEA-knapp → første scroll eller klikk trykker knappen inn og
// åpner filmen over hele skjermen → videre scroll styrer filmen → «Bli sett / Bli valgt», H1, ingress og tjenester.
// En passiv scroll-lytter setter filmens tidspunkt ut fra scrollposisjonen; ingen scrollkapring. Uten JS, uten
// videostøtte, ved feil eller med redusert bevegelse vises plakatbildet og replikkene som en vanlig, statisk liste.

// Higgsfield-utkast (480p), omkodet uten lyd til VP9/WebM (Chrome, Edge, Firefox) og H.264/MP4 (Safari);
// se docs/cinematic-pilot/phase5/konsept-scroll/FILM.md.
const FILM = {
  plakat: "/film/cidea-film-plakat.jpg", // statisk oppsett: paret på vei inn på restauranten
  start: "/film/cidea-film-start.jpg", // aktiv film: første bilde, vises til filmen er klar
  bredde: 854, hoyde: 480,
  kilder: [
    { src: "/film/cidea-film-utkast-480p.webm", type: 'video/webm; codecs="vp9"' },
    { src: "/film/cidea-film-utkast-480p.mp4", type: 'video/mp4; codecs="avc1.640028"' },
  ],
};

// Replikkene er lagt på faktiske hendelser i filmen (sekunder i den omkodede filen):
// mannen i speilet 0–1,4 · finner salongen på telefonen 1,75–4,9 · bestiller i frisørstolen 6,6–9,0 ·
// elektrikeren møter kunden 9,95–15,0. Hver replikk slutter litt før klippet, så teksten ikke henger over neste scene. Paret ved restauranten (17,3–21,25) står uten tekst; «Bli sett / Bli valgt»
// kommer som stor overskrift etter filmen.
// fra/til er andel av den festede scrollengden. plass = hjørne på brede skjermer (nv = nede til venstre, ov = oppe til
// venstre, oh = oppe til høyre); mobil = bånd øverst eller nederst på stående skjermer. Valgt der filmen ikke viser
// ansikter, telefoner eller viktige handlinger (avvik på mobil er dokumentert i FILM.md).
export const replikker = [
  { tekst: "Noen trenger det dere tilbyr.", fra: .07, til: .175, plass: "nv", mobil: "bunn" },
  { tekst: "Gjør det enkelt å finne dere.", fra: .20, til: .35, plass: "ov", mobil: "topp" },
  { tekst: "Og enkelt å ta neste steg.", fra: .43, til: .57, plass: "oh", mobil: "bunn" },
  { tekst: "Fra digital interesse til ekte møter.", fra: .65, til: .82, plass: "nv", mobil: "bunn" },
];
// Første del (0–ÅPNING) er åpningen: knappen trykkes inn og filmen åpnes; filmen står på første bilde.
export const ÅPNING = .05;
// Scroll → filmtid, stykkevis lineært: hver replikk får omtrent like lang scroll uansett hvor lang hendelsen er,
// og klippene uten tekst (frisørsalongen, sikringsskapet, restaurantsiden på telefonen) går raskere.
export const tidskart = [[0, 0], [.07, 0], [.20, 1.75], [.36, 5.12], [.43, 6.6], [.58, 9.2], [.65, 9.95], [.83, 15.25], [.89, 17.3], [1, 21.25]];
// Utsnitt når filmen beskjæres mye (stående skjermer): hvor i bildebredden (0–1) det viktigste er, over filmtid.
// Hopper ved klippene (5,08 · 9,17 · 15,21 · 17,25 s) og i overtoningen ved 12,75–13,0 s.
export const utsnitt = [[0, .58], [1.0, .62], [1.6, .66], [1.8, .5], [2.1, .43], [2.6, .42], [3.0, .53], [3.5, .57], [5.08, .57], [5.09, .55], [5.8, .58], [6.1, .15], [6.6, .36], [7.0, .42], [7.5, .42], [8.5, .47], [9.16, .47], [9.17, .42], [9.9, .5], [10.3, .62], [10.6, .72], [11.0, .72], [11.6, .76], [12.2, .68], [12.8, .66], [12.95, .38], [13.6, .41], [14.2, .46], [14.7, .53], [15.2, .56], [15.21, .48], [16.0, .52], [17.24, .48], [17.25, .40], [18.5, .45], [19.5, .5], [21.3, .5]];
const interpoler = (kart, x) => { for (let i = 1; i < kart.length; i++) { const [x1, y1] = kart[i], [x0, y0] = kart[i - 1]; if (x <= x1) return y0 + (y1 - y0) * ((x - x0) / (x1 - x0 || 1)); } return kart[kart.length - 1][1]; };

function useFilmscroll(ref) {
  useEffect(() => {
    const sek = ref.current, video = sek?.querySelector("video"), knapp = sek?.querySelector(".ks-cidea"), ramme0 = sek?.closest(".cm");
    const rolig = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!video || rolig.matches || !FILM.kilder.some(k => video.canPlayType(k.type))) return;
    let ramme = 0, aktiv = -1, mål = 0, apen = false, posisjon = "";
    const sok = () => { if (video.readyState >= 1 && !video.seeking && Math.abs(video.currentTime - mål) > .02) video.currentTime = mål; };
    // Beskjæring: andel av bildebredden som vises. Under 0,75 (stående skjermer) følger utsnittet handlingen.
    const settUtsnitt = t => {
      const synlig = (sek.clientWidth / window.innerHeight) / (FILM.bredde / FILM.hoyde);
      let p = "50% 50%";
      if (synlig < .75) { const s = Math.min(1 - synlig, Math.max(0, interpoler(utsnitt, t) - synlig / 2)); p = `${(s / (1 - synlig) * 100).toFixed(1)}% 50%`; }
      if (p !== posisjon) { video.style.objectPosition = p; posisjon = p; }
    };
    const åpne = verdi => { if (verdi === apen) return; apen = verdi; sek.dataset.apning = verdi ? "apen" : "lukket"; };
    const oppdater = () => {
      ramme = 0;
      const r = sek.getBoundingClientRect(), lengde = sek.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / lengde));
      // Første scroll åpner filmen; tilbake helt til toppen lukker den igjen.
      åpne(-r.top > 2);
      const nr = apen ? replikker.findIndex(x => p >= x.fra && p <= x.til) + 1 : 0;
      if (nr !== aktiv) { sek.dataset.replikk = nr; aktiv = nr; }
      // Mørk toppmeny mens filmen fyller skjermen, lys ellers (kontrast i begge tilstander).
      if (ramme0) { const film = apen && r.top <= 0 && r.bottom > 80; if ((ramme0.dataset.meny === "film") !== film) { if (film) ramme0.dataset.meny = "film"; else delete ramme0.dataset.meny; } }
      mål = Math.min(interpoler(tidskart, p), (video.duration || 99) - .05);
      settUtsnitt(mål);
      sok();
    };
    const planlegg = () => { if (!ramme) ramme = requestAnimationFrame(oppdater); };
    // Klikk eller Enter på CIDEA-knappen: samme inntrykk som første scroll, deretter til filmens start.
    const trykk = e => {
      e.preventDefault(); åpne(true);
      const topp = sek.getBoundingClientRect().top + window.scrollY, lengde = sek.offsetHeight - window.innerHeight;
      window.scrollTo({ top: topp + lengde * ÅPNING + 4, behavior: "smooth" });
      sek.focus({ preventScroll: true });
    };
    const stopp = () => {
      sek.classList.remove("ks-film-aktiv"); delete sek.dataset.replikk; delete sek.dataset.apning; if (ramme0) delete ramme0.dataset.meny;
      video.poster = FILM.plakat; video.style.objectPosition = ""; posisjon = "";
      window.removeEventListener("scroll", planlegg); window.removeEventListener("resize", planlegg);
      video.removeEventListener("seeked", sok); video.removeEventListener("loadedmetadata", planlegg);
      knapp?.removeEventListener("click", trykk);
      cancelAnimationFrame(ramme); ramme = 0;
    };
    // Når ingen kilde kan brukes, står videoen uten kilde (NETWORK_NO_SOURCE). Nettlesere sender ikke alltid feil for
    // hver kilde (Chromium hopper stille over en kilde med ukjent type), så tilstanden sjekkes etter hver feil.
    const feil = () => setTimeout(() => { if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) stopp(); });
    const endret = () => { if (rolig.matches) stopp(); };
    sek.classList.add("ks-film-aktiv"); sek.dataset.apning = "lukket"; video.poster = FILM.start;
    window.addEventListener("scroll", planlegg, { passive: true });
    window.addEventListener("resize", planlegg, { passive: true });
    video.addEventListener("seeked", sok);
    video.addEventListener("loadedmetadata", planlegg);
    video.addEventListener("error", feil, true); // feil på <source> bobler ikke, derfor capture
    knapp?.addEventListener("click", trykk);
    rolig.addEventListener("change", endret);
    // Filmen (ca. 2 MB) er sidens hovedinnhold. Den lastes etter at resten av siden er ferdig lastet og nettleseren er
    // ledig, så den ikke konkurrerer med tekst, skrift og CSS. Med datasparing på lastes den først når scenen er nær.
    let ventId = 0;
    const last = () => { if (video.preload !== "auto") { video.preload = "auto"; video.load(); } };
    const nær = new IntersectionObserver(([e]) => { if (e.isIntersecting) { nær.disconnect(); last(); } }, { rootMargin: "50% 0px" });
    const ledig = () => { ventId = (window.requestIdleCallback || setTimeout)(last, { timeout: 2000 }); };
    if (navigator.connection?.saveData) nær.observe(sek);
    else if (document.readyState === "complete") ledig();
    else window.addEventListener("load", ledig, { once: true });
    planlegg();
    return () => {
      stopp(); nær.disconnect(); window.removeEventListener("load", ledig); (window.cancelIdleCallback || clearTimeout)(ventId);
      video.removeEventListener("error", feil, true); rolig.removeEventListener("change", endret);
    };
  }, [ref]);
}

export default function KonseptScroll() {
  const filmRef = useRef(null);
  useFilmscroll(filmRef);
  useMeta({
    tittel: "Konsept: Fra ord til gjennomslag | Cidea Marketing",
    beskrivelse: "Prototype av en scrollstyrt forside for Cidea Marketing. Ikke publisert som forside.",
    sti: "/konsept-scroll",
  });
  return (
    <Ramme sti="/konsept-scroll" fastMeny>
      <div className="ks">
        <section className="ks-film" id="film" aria-label="Film: fra digital interesse til ekte møter" ref={filmRef} tabIndex={-1}>
          <div className="ks-film-scene">
            <div className="ks-apning">
              <a className="ks-cidea" href="#film-bilde" aria-label="CIDEA – se filmen">CIDEA</a>
            </div>
            <figure className="ks-film-bilde" id="film-bilde">
              <video className="ks-video" muted playsInline preload="none" poster={FILM.plakat} aria-hidden="true" tabIndex={-1} disablePictureInPicture>
                {FILM.kilder.map(k => <source key={k.src} src={k.src} type={k.type} />)}
              </video>
            </figure>
            <ol className="ks-replikker">
              {replikker.map((r, i) => <li key={r.tekst} className={`ks-replikk ks-plass-${r.plass} ks-mobil-${r.mobil}`} data-nr={i + 1}>{r.tekst}</li>)}
            </ol>
            <a className="ks-hopp" href="#tjenester">Hopp til tjenestene <span aria-hidden="true">↓</span></a>
          </div>
        </section>

        <section className="ks-ord" id="tjenester" aria-labelledby="ks-h1">
          <p className="ks-ordpar">
            <span className="ks-ord-1">Bli sett</span>
            <span className="ks-ord-2">Bli valgt</span>
          </p>
          <div className="cm-wrap">
            <div className="ks-intro">
              <h1 id="ks-h1">Nettsider og helhetlig markedsføring som utvikles over tid.</h1>
              <p className="ks-ingress">Vi bygger nettsider, former merkevarer og driver målrettet SEO og digital markedsføring for bedrifter som ønsker kontinuerlig forbedring.</p>
              <a className="cm-knapp cm-knapp-lys ks-kontakt" href="/kontakt">Snakk med oss <span aria-hidden="true">→</span></a>
            </div>
            <ul className="ks-tjenester">
              {tjenester.map(t => (
                <li key={t.href}>
                  <a href={t.href}>
                    <h2>{t.tittel}</h2>
                    <p>{t.tekst}</p>
                    <span className="ks-lenketekst">{t.lenke} <span aria-hidden="true">→</span></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ks-rolig" aria-labelledby="ks-steg-tittel">
          <div className="cm-wrap">
            <h2 id="ks-steg-tittel">Slik jobber vi</h2>
            <p className="ks-under">Vi avklarer behov, designer og utvikler nettsiden, og kan videreutvikle løsningen etter lansering.</p>
            <ol className="ks-steg">
              {steg.map(s => <li key={s.tittel}><h3>{s.tittel}</h3><p>{s.tekst}</p></li>)}
            </ol>
          </div>
          <div className="cm-wrap ks-innsikt">
            <h2 id="ks-innsikt-tittel">Innsikt</h2>
            <p className="ks-under">Artikler om nettsider, synlighet og merkevare.</p>
            <ul className="ks-artikler" aria-labelledby="ks-innsikt-tittel">
              {artikler.map(a => (
                <li key={a.slug}>
                  <a href={`/blog/${a.slug}`}>
                    <span className="ks-tema">{a.tema}</span>
                    <h3>{a.tittel}</h3>
                    <p>{a.utdrag}</p>
                    <span className="ks-lenketekst">Les artikkelen <span aria-hidden="true">→</span></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ks-slutt" aria-labelledby="ks-cta-tittel">
          <p className="ks-slutt-merke" aria-hidden="true">CIDEA</p>
          <div className="cm-wrap ks-slutt-rad">
            <h2 id="ks-cta-tittel">Klar for et overbevisende digitalt uttrykk?</h2>
            <p>Fortell oss kort om bedriften og hva dere ønsker hjelp med. Vi tar kontakt på e-post.</p>
            <a className="cm-knapp cm-knapp-lys" href="/kontakt">Snakk med oss <span aria-hidden="true">→</span></a>
          </div>
        </section>
      </div>
    </Ramme>
  );
}
