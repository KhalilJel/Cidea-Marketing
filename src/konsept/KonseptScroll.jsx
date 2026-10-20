import React, { useEffect, useRef } from "react";
import "../forside/forside.css";
import "./konsept-scroll.css";
import { Ramme, useMeta } from "../forside/Ramme.jsx";
import { tjenester, steg, artikler } from "../forside/Forside.jsx";

// Prototype for retningen «Fra ord til gjennomslag» (fase 5, ikke godkjent). Isolert på /konsept-scroll.
// All tekst er eksisterende, godkjent innhold, bortsett fra «Bli sett» / «Bli valgt», som kommer fra briefen.
// Bevegelsen i startscenen er ren CSS (scroll-drevne animasjoner) på vanlig nettleserscroll, uten scrollmotor.
// Filmscenen er det eneste stedet med JavaScript: en passiv scroll-lytter setter filmens tidspunkt ut fra
// scrollposisjonen. Uten JS, uten videostøtte, ved feil eller med redusert bevegelse vises plakatbildet og
// alle replikkene som en vanlig, statisk liste.

// Higgsfield-utkast (480p), omkodet uten lyd til VP9/WebM (Chrome, Edge, Firefox) og H.264/MP4 (Safari);
// se docs/cinematic-pilot/phase5/konsept-scroll/FILM.md.
const FILM = {
  plakat: "/film/cidea-film-plakat.jpg", // statisk oppsett: paret på vei inn på restauranten
  start: "/film/cidea-film-start.jpg", // aktiv film: første bilde, vises til filmen er klar
  kilder: [
    { src: "/film/cidea-film-utkast-480p.webm", type: 'video/webm; codecs="vp9"' },
    { src: "/film/cidea-film-utkast-480p.mp4", type: 'video/mp4; codecs="avc1.640028"' },
  ],
};

// Replikkene er lagt på faktiske hendelser i filmen (sekunder i den omkodede filen):
// mannen i speilet 0–1,75 · finner salongen på telefonen 1,75–5,1 · bestiller i frisørstolen 6,6–9,2 ·
// elektrikeren møter kunden 9,95–15,25 · paret går inn på restauranten 17,45–21,25.
// fra/til er andel av den festede scrollengden; plass er hjørnet teksten står i på brede skjermer (nv = nede til venstre,
// ov = oppe til venstre, oh = oppe til høyre), valgt der filmen ikke viser ansikter, telefoner eller viktige handlinger.
export const replikker = [
  { tekst: "Noen trenger det dere tilbyr.", fra: .02, til: .16, plass: "nv" },
  { tekst: "Gjør det enkelt å finne dere.", fra: .18, til: .34, plass: "ov" },
  { tekst: "Og enkelt å ta neste steg.", fra: .41, til: .56, plass: "oh" },
  { tekst: "Fra digital interesse til ekte møter.", fra: .63, til: .80, plass: "nv" },
  { tekst: "Bli sett. Bli valgt.", fra: .87, til: 1, plass: "ov" },
];
// Scroll → filmtid, stykkevis lineært: hver replikk får omtrent like lang scroll uansett hvor lang hendelsen er,
// og klippene uten tekst (frisørsalongen, sikringsskapet, restaurantsiden på telefonen) går raskere.
export const tidskart = [[0, 0], [.02, 0], [.16, 1.75], [.34, 5.12], [.41, 6.6], [.56, 9.2], [.63, 9.95], [.80, 15.25], [.87, 17.45], [1, 21.25]];
const tidFra = p => { for (let i = 1; i < tidskart.length; i++) { const [p1, t1] = tidskart[i], [p0, t0] = tidskart[i - 1]; if (p <= p1) return t0 + (t1 - t0) * ((p - p0) / (p1 - p0 || 1)); } return tidskart[tidskart.length - 1][1]; };

function useFilmscroll(ref) {
  useEffect(() => {
    const sek = ref.current, video = sek?.querySelector("video");
    const rolig = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!video || rolig.matches || !FILM.kilder.some(k => video.canPlayType(k.type))) return;
    let ramme = 0, aktiv = -1, mål = 0;
    const sok = () => { if (video.readyState >= 1 && !video.seeking && Math.abs(video.currentTime - mål) > .02) video.currentTime = mål; };
    const oppdater = () => {
      ramme = 0;
      const lengde = sek.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -sek.getBoundingClientRect().top / lengde));
      const nr = replikker.findIndex(r => p >= r.fra && p <= r.til) + 1;
      if (nr !== aktiv) { sek.dataset.replikk = nr; aktiv = nr; }
      mål = Math.min(tidFra(p), (video.duration || 99) - .05);
      sok();
    };
    const planlegg = () => { if (!ramme) ramme = requestAnimationFrame(oppdater); };
    const stopp = () => {
      sek.classList.remove("ks-film-aktiv"); delete sek.dataset.replikk; video.poster = FILM.plakat;
      window.removeEventListener("scroll", planlegg); window.removeEventListener("resize", planlegg);
      video.removeEventListener("seeked", sok); video.removeEventListener("loadedmetadata", planlegg);
      cancelAnimationFrame(ramme); ramme = 0;
    };
    // Når ingen kilde kan brukes, står videoen uten kilde (NETWORK_NO_SOURCE). Nettlesere sender ikke alltid feil for
    // hver kilde (Chromium hopper stille over en kilde med ukjent type), så tilstanden sjekkes etter hver feil.
    const feil = () => setTimeout(() => { if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) stopp(); });
    const endret = () => { if (rolig.matches) stopp(); };
    sek.classList.add("ks-film-aktiv"); video.poster = FILM.start;
    window.addEventListener("scroll", planlegg, { passive: true });
    window.addEventListener("resize", planlegg, { passive: true });
    video.addEventListener("seeked", sok);
    video.addEventListener("loadedmetadata", planlegg);
    video.addEventListener("error", feil, true); // feil på <source> bobler ikke, derfor capture
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
    <Ramme>
      <div className="ks">
        <section className="ks-start" aria-labelledby="ks-h1">
          <div className="ks-scene">
            <p className="ks-ordmerke" aria-hidden="true">CIDEA</p>
            <div className="ks-intro">
              <h1 id="ks-h1">Nettsider og helhetlig markedsføring som utvikles over tid.</h1>
              <p className="ks-ingress">Vi bygger nettsider, former merkevarer og driver målrettet SEO og digital markedsføring for bedrifter som ønsker kontinuerlig forbedring.</p>
            </div>
            <a className="cm-knapp ks-kontakt" href="/kontakt">Snakk med oss <span aria-hidden="true">→</span></a>
            <div className="ks-teppe" aria-hidden="true" />
          </div>
        </section>

        <section className="ks-bilde ks-film" aria-label="Film" ref={filmRef}>
          <div className="ks-film-scene">
            <figure className="ks-film-bilde">
              <video className="ks-video" muted playsInline preload="none" poster={FILM.plakat} aria-hidden="true" tabIndex={-1} disablePictureInPicture>
                {FILM.kilder.map(k => <source key={k.src} src={k.src} type={k.type} />)}
              </video>
            </figure>
            <ol className="ks-replikker">
              {replikker.map((r, i) => <li key={r.tekst} className={`ks-replikk ks-plass-${r.plass}`} data-nr={i + 1}>{r.tekst}</li>)}
            </ol>
            <a className="ks-hopp" href="#tjenester">Hopp til tjenestene <span aria-hidden="true">↓</span></a>
          </div>
        </section>

        <section className="ks-ord" id="tjenester" aria-labelledby="ks-ord-tittel">
          <h2 id="ks-ord-tittel" className="ks-ordpar">
            <span className="ks-ord-1">Bli sett</span>
            <span className="ks-ord-2">Bli valgt</span>
          </h2>
          <div className="cm-wrap">
            <p className="ks-under">Vi hjelper bedrifter med nettsider, merkevare, SEO og digital markedsføring.</p>
            <ul className="ks-tjenester">
              {tjenester.map(t => (
                <li key={t.href}>
                  <a href={t.href}>
                    <h3>{t.tittel}</h3>
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
