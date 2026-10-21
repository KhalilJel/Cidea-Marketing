import React, { useEffect, useRef } from "react";
import "../forside/forside.css";
import "./konsept-scroll.css";
import { Ramme, useMeta } from "../forside/Ramme.jsx";
import { tjenester, steg, artikler } from "../forside/Forside.jsx";

// Prototype for retningen «Fra ord til gjennomslag» (fase 5, ikke godkjent). Isolert på /konsept-scroll.
// Forløp (eiers føring 2026-10-21): hvit flate med CIDEA og fast meny → første forsøk på å scrolle nedover (hjul, sveip
// eller scrolltast) trykker CIDEA inn, åpner filmen som en sirkel og starter avspillingen → filmen spiller sammenhengende
// i 1× til slutt, mens scenen blir på skjermen → vanlig scroll videre til «Bli sett / Bli valgt», H1 og tjenester.
// Scroll styrer ikke filmen. Under avspillingen holdes sidescrollen igjen (scrollforsøk forkastes, ingenting samles opp);
// «Til tjenester», menyen, filmslutt og all annen scroll (rullefelt o.l.) frigjør den. Uten JS, uten videostøtte, ved feil eller med redusert bevegelse
// vises plakatbildet og replikkene som en vanlig, statisk liste.

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

// Replikkene er lagt på faktiske hendelser i filmen. fra/til er filmtid i sekunder i den omkodede filen:
// mannen i speilet · finner salongen på telefonen · bestiller i frisørstolen · elektrikeren møter kunden.
// Paret ved restauranten (17,25–21,25) står uten tekst; «Bli sett / Bli valgt» kommer som stor overskrift etter filmen.
// Hver replikk er helt borte senest ved til, som ligger før neste klipp (5,08 · 9,17 · 15,21 s). Synligheten regnes ut
// fra filmtiden til bildet som faktisk vises (se styrke), ikke fra en egen klokke.
// plass = hjørne på brede skjermer (nv = nede til venstre, ov = oppe til venstre, oh = oppe til høyre); mobil = bånd
// øverst eller nederst på stående skjermer. Valgt der filmen ikke viser ansikter, telefoner eller viktige handlinger
// (avvik på mobil er dokumentert i FILM.md).
export const replikker = [
  { tekst: "Noen trenger det dere tilbyr.", fra: .05, til: 1.42, plass: "nv", mobil: "bunn" },
  { tekst: "Gjør det enkelt å finne dere.", fra: 1.75, til: 4.95, plass: "ov", mobil: "topp" },
  { tekst: "Og enkelt å ta neste steg.", fra: 6.6, til: 9.05, plass: "oh", mobil: "bunn" },
  { tekst: "Fra digital interesse til ekte møter.", fra: 9.95, til: 15.05, plass: "nv", mobil: "bunn" },
];
// Inn- og uttoning i filmsekunder. 0 utenfor fra–til, 1 i midten, lineært over RAMPE i hver ende.
export const RAMPE = .4;
export const styrke = (r, t) => Math.max(0, Math.min(1, (t - r.fra) / RAMPE, (r.til - t) / RAMPE));
// Fra første scrollforsøk til avspillingen starter: knappetrykket (0,34 s) og sirkelåpningen (0,3 + 0,8 s).
export const ÅPNINGSTID = 1100;
// Står filmen stille så lenge mens den skal spille (treg forbindelse, dekoderfeil), frigjøres siden og «Spill av filmen» vises.
const STOPPGRENSE = 10000;
// Utsnitt når filmen beskjæres mye (stående skjermer): hvor i bildebredden (0–1) det viktigste er, over filmtid.
// Hopper ved klippene (5,08 · 9,17 · 15,21 · 17,25 s) og i overtoningen ved 12,75–13,0 s.
export const utsnitt = [[0, .58], [1.0, .62], [1.6, .66], [1.8, .5], [2.1, .43], [2.6, .42], [3.0, .53], [3.5, .57], [5.08, .57], [5.09, .55], [5.8, .58], [6.1, .15], [6.6, .36], [7.0, .42], [7.5, .42], [8.5, .47], [9.16, .47], [9.17, .42], [9.9, .5], [10.3, .62], [10.6, .72], [11.0, .72], [11.6, .76], [12.2, .68], [12.8, .66], [12.95, .38], [13.6, .41], [14.2, .46], [14.7, .53], [15.2, .56], [15.21, .48], [16.0, .52], [17.24, .48], [17.25, .40], [18.5, .45], [19.5, .5], [21.3, .5]];
const interpoler = (kart, x) => { for (let i = 1; i < kart.length; i++) { const [x1, y1] = kart[i], [x0, y0] = kart[i - 1]; if (x <= x1) return y0 + (y1 - y0) * ((x - x0) / (x1 - x0 || 1)); } return kart[kart.length - 1][1]; };

// Tilstander (data-tilstand på scenen): klar (hvit åpning) → starter (knappetrykk og sirkel) → spiller → ferdig.
// Sidespor: avbrutt («Til tjenester», menyvalg, fokus utenfor scenen, sidebytte), blokkert (nettleseren stoppet
// avspillingen eller filmen sto stille; «Spill av filmen» vises), hoppet (siden ble scrollet uten at filmen startet,
// f.eks. gjenopprettet scrollposisjon eller rullefelt: plakatbildet vises, ingen avspilling).
function useFilm(ref) {
  useEffect(() => {
    const sek = ref.current, video = sek?.querySelector("video"), ramme0 = sek?.closest(".cm"), html = document.documentElement;
    const rolig = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!video || rolig.matches) return; // redusert bevegelse: statisk oppsett via CSS
    if (!FILM.kilder.some(k => video.canPlayType(k.type))) { sek.classList.add("ks-statisk"); return; }
    // Hovedskriptet kom etter at oppstartsskriptet hadde slått på reserven (js-reserve, se index.html). Står leseren
    // fortsatt i åpningen, byttes det til film uten overganger (åpningen ser lik ut i begge oppsett). Har leseren
    // scrollet, beholdes det statiske oppsettet for denne visningen, så innholdet ikke flytter seg.
    if (html.classList.contains("js-reserve")) {
      if (html.classList.contains("js-feil") || window.scrollY > 2) { sek.classList.add("ks-statisk"); return; }
      const m = ramme0 || sek; m.classList.add("ks-direkte"); html.classList.remove("js-reserve");
      requestAnimationFrame(() => requestAnimationFrame(() => m.classList.remove("ks-direkte")));
    }
    const linjer = [...sek.querySelectorAll(".ks-replikk")], spill = sek.querySelector(".ks-spill"), hopp = sek.querySelector(".ks-hopp");
    let tilstand = "", ramme = 0, aktiv = -1, vist = 0, posisjon = "", startId = 0, vaktId = 0, fremgang = 0, berøring = null;
    const sett = t => { tilstand = t; sek.dataset.tilstand = t; planlegg(); };
    const opptatt = () => tilstand === "starter" || tilstand === "spiller";
    // Scrollås bare mens filmen starter eller spiller: scrollforsøk forkastes i hjul-, berørings- og tastelytterne under.
    // Klassen ks-las markerer tilstanden (og demper sprett i kantene, se konsept-scroll.css).
    const lås = på => html.classList.toggle("ks-las", på);
    const direkte = () => { const m = ramme0 || sek; m.classList.add("ks-direkte"); requestAnimationFrame(() => requestAnimationFrame(() => m.classList.remove("ks-direkte"))); };
    // Beskjæring: andel av bildebredden som vises. Under 0,75 (stående skjermer) følger utsnittet handlingen.
    const settUtsnitt = t => {
      const synlig = (sek.clientWidth / window.innerHeight) / (FILM.bredde / FILM.hoyde);
      let p = "50% 50%";
      if (synlig < .75) { const s = Math.min(1 - synlig, Math.max(0, interpoler(utsnitt, t) - synlig / 2)); p = `${(s / (1 - synlig) * 100).toFixed(1)}% 50%`; }
      if (p !== posisjon) { video.style.objectPosition = p; posisjon = p; }
      sek.dataset.utsnittTid = t.toFixed(3);
    };
    // Replikker, mobilutsnitt og menyfarge følger filmtiden til bildet som faktisk vises (vist).
    const oppdater = () => {
      ramme = 0;
      const apen = sek.dataset.apning === "apen", r = sek.getBoundingClientRect();
      let nr = 0, best = .5;
      replikker.forEach((x, i) => {
        const o = apen ? styrke(x, vist) : 0, v = o.toFixed(3);
        if (linjer[i].style.getPropertyValue("--o") !== v) linjer[i].style.setProperty("--o", v);
        if (o > best) { best = o; nr = i + 1; }
      });
      if (nr !== aktiv) { sek.dataset.replikk = nr; aktiv = nr; }
      if (ramme0) { const film = apen && r.top <= 0 && r.bottom > 80; if ((ramme0.dataset.meny === "film") !== film) { if (film) ramme0.dataset.meny = "film"; else delete ramme0.dataset.meny; } }
      settUtsnitt(vist);
    };
    function planlegg() { if (!ramme) ramme = requestAnimationFrame(oppdater); }
    let vfc = 0;
    // Nytt bilde: replikker og utsnitt oppdateres med en gang, i samme tegning som bildet vises (ikke ett bilde etter).
    const nyttBilde = t => {
      if (t > vist + .001 || t < vist - .001) fremgang = performance.now();
      vist = t; sek.dataset.vist = t.toFixed(3);
      if (ramme) { cancelAnimationFrame(ramme); ramme = 0; }
      oppdater();
    };
    const vistBilde = (_, md) => { nyttBilde(md.mediaTime); vfc = video.requestVideoFrameCallback(vistBilde); };
    const tidOppdatert = () => nyttBilde(video.currentTime);
    // Filmen (ca. 2 MB) lastes etter at resten av siden er ferdig lastet og nettleseren er ledig, eller straks
    // avspillingen startes. Med datasparing på lastes den først ved start.
    const last = () => { if (video.preload !== "auto") { video.preload = "auto"; video.load(); } };
    const vakt = () => {
      clearInterval(vaktId);
      vaktId = setInterval(() => { if (tilstand !== "spiller") clearInterval(vaktId); else if (performance.now() - fremgang > STOPPGRENSE) blokker(); }, 500);
    };
    const spillAv = () => {
      clearTimeout(startId); last(); sett("spiller"); lås(true); fremgang = performance.now(); vakt();
      video.playbackRate = 1;
      const løfte = video.play();
      if (løfte) løfte.catch(() => { if (tilstand === "spiller") blokker(); });
    };
    // Første scrollforsøk nedover: knappetrykk og sirkel (CSS), deretter avspilling fra start.
    const start = () => {
      if (tilstand !== "klar") return;
      last(); sek.dataset.apning = "apen"; sett("starter"); lås(true);
      startId = setTimeout(spillAv, ÅPNINGSTID);
    };
    // Nettleseren stoppet avspillingen (play() avvist) eller filmen står stille: siden frigjøres, «Spill av filmen» vises.
    function blokker() { clearInterval(vaktId); video.pause(); sett("blokkert"); lås(false); }
    // Leseren forlater filmen («Til tjenester», menyvalg, fokus utenfor scenen, sidebytte): filmen stopper, siden frigjøres.
    const avbryt = () => {
      if (!opptatt() && tilstand !== "blokkert") return;
      clearTimeout(startId); clearInterval(vaktId); video.pause(); if (sek.dataset.apning !== "apen") sek.dataset.apning = "apen";
      sett("avbrutt"); lås(false);
    };
    const slutt = () => { clearInterval(vaktId); nyttBilde(video.currentTime); sett("ferdig"); lås(false); };
    // Siden scrollet uten at filmen startet (gjenopprettet posisjon, rullefelt, fokus): ingen avspilling, plakatbildet vises.
    const hoppet = () => { direkte(); video.poster = FILM.plakat; sek.dataset.apning = "apen"; sett("hoppet"); };

    // Innspill. Bare i åpningen (start) og under start/avspilling (forkastes); ellers vanlig scroll.
    const nedTaster = /^( |PageDown|ArrowDown|End)$/, scrollTaster = /^( |PageDown|PageUp|ArrowDown|ArrowUp|End|Home)$/;
    const iÅpningen = () => tilstand === "klar" && window.scrollY <= 2;
    const hjul = e => {
      if (opptatt()) { e.preventDefault(); return; }
      if (iÅpningen() && e.deltaY > 0) { e.preventDefault(); start(); }
    };
    const berørStart = e => { berøring = e.touches.length === 1 ? e.touches[0].clientY : null; };
    const berørFlytt = e => {
      if (opptatt()) { if (e.cancelable) e.preventDefault(); return; }
      if (iÅpningen() && berøring !== null && berøring - e.touches[0].clientY > 8) { if (e.cancelable) e.preventDefault(); berøring = null; start(); }
    };
    const tast = e => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const m = e.target instanceof Element ? e.target : null;
      if (m?.closest("input, textarea, select, [contenteditable]") || (e.key === " " && m?.closest("button, a, summary"))) return;
      if (opptatt() && scrollTaster.test(e.key)) { e.preventDefault(); return; }
      if (iÅpningen() && nedTaster.test(e.key) && !(e.key === " " && e.shiftKey)) { e.preventDefault(); start(); }
    };
    // Scroller siden likevel (rullefelt, søk i siden, fokus), frigjøres den: under avspilling stoppes filmen, og i
    // åpningen vises plakatbildet uten avspilling.
    const scroll = () => { if (window.scrollY > 2) { if (tilstand === "klar") hoppet(); else if (opptatt()) avbryt(); } planlegg(); };
    // Fokus som flyttes ut av filmscenen (Tab forbi «Til tjenester») under avspillingen: filmen stoppes og siden frigjøres.
    const fokus = e => { if (opptatt() && e.target instanceof Element && !sek.contains(e.target) && !e.target.closest(".cm-topp")) avbryt(); };
    const meny = e => { if (e.target instanceof Element && e.target.closest(".cm-topp a")) avbryt(); };
    const forlat = () => avbryt();
    const tilbake = e => { if (e.persisted) lås(opptatt()); };
    const spillKlikk = () => { if (tilstand === "blokkert") spillAv(); };

    const stopp = () => {
      clearTimeout(startId); clearInterval(vaktId); lås(false); video.pause();
      sek.classList.remove("ks-film-aktiv"); sek.classList.add("ks-statisk"); delete sek.dataset.replikk; delete sek.dataset.apning; delete sek.dataset.tilstand; if (ramme0) delete ramme0.dataset.meny;
      linjer.forEach(l => l.style.removeProperty("--o"));
      video.poster = FILM.plakat; video.style.objectPosition = ""; posisjon = "";
      window.removeEventListener("wheel", hjul); window.removeEventListener("touchstart", berørStart); window.removeEventListener("touchmove", berørFlytt);
      window.removeEventListener("keydown", tast); window.removeEventListener("scroll", scroll); window.removeEventListener("resize", planlegg);
      document.removeEventListener("focusin", fokus); document.removeEventListener("click", meny, true);
      window.removeEventListener("pagehide", forlat); window.removeEventListener("pageshow", tilbake);
      hopp?.removeEventListener("click", avbryt); spill?.removeEventListener("click", spillKlikk);
      video.removeEventListener("ended", slutt); video.removeEventListener("timeupdate", tidOppdatert); video.removeEventListener("progress", vakt);
      if (vfc) video.cancelVideoFrameCallback(vfc);
      cancelAnimationFrame(ramme); ramme = 0;
    };
    // Når ingen kilde kan brukes, står videoen uten kilde (NETWORK_NO_SOURCE). Nettlesere sender ikke alltid feil for
    // hver kilde (Chromium hopper stille over en kilde med ukjent type), så tilstanden sjekkes etter hver feil.
    const feil = () => setTimeout(() => { if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) stopp(); });
    const endret = () => { if (rolig.matches) stopp(); };

    // ks-film-aktiv markerer at JS styrer filmen; selve oppsettet gjelder fra første tegning (se konsept-scroll.css).
    sek.classList.add("ks-film-aktiv"); sek.dataset.apning = "lukket"; video.poster = FILM.start; video.loop = false;
    sett("klar");
    if (window.scrollY > 2) hoppet();
    if ("requestVideoFrameCallback" in video) vfc = video.requestVideoFrameCallback(vistBilde); else video.addEventListener("timeupdate", tidOppdatert);
    window.addEventListener("wheel", hjul, { passive: false });
    window.addEventListener("touchstart", berørStart, { passive: true });
    window.addEventListener("touchmove", berørFlytt, { passive: false });
    window.addEventListener("keydown", tast);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", planlegg, { passive: true });
    document.addEventListener("focusin", fokus);
    document.addEventListener("click", meny, true);
    window.addEventListener("pagehide", forlat);
    window.addEventListener("pageshow", tilbake);
    hopp?.addEventListener("click", avbryt);
    spill?.addEventListener("click", spillKlikk);
    video.addEventListener("ended", slutt);
    // Nedlasting som går framover teller som framdrift, så en treg forbindelse ikke regnes som stopp.
    video.addEventListener("progress", () => { if (tilstand === "spiller") fremgang = performance.now(); });
    video.addEventListener("error", feil, true); // feil på <source> bobler ikke, derfor capture
    rolig.addEventListener("change", endret);
    let ventId = 0;
    const ledig = () => { ventId = (window.requestIdleCallback || setTimeout)(last, { timeout: 2000 }); };
    if (!navigator.connection?.saveData) { if (document.readyState === "complete") ledig(); else window.addEventListener("load", ledig, { once: true }); }
    return () => {
      stopp(); window.removeEventListener("load", ledig); (window.cancelIdleCallback || clearTimeout)(ventId);
      video.removeEventListener("error", feil, true); rolig.removeEventListener("change", endret);
    };
  }, [ref]);
}

export default function KonseptScroll() {
  const filmRef = useRef(null);
  useFilm(filmRef);
  useMeta({
    tittel: "Konsept: Fra ord til gjennomslag | Cidea Marketing",
    beskrivelse: "Prototype av en filmatisk forside for Cidea Marketing. Ikke publisert som forside.",
    sti: "/konsept-scroll",
  });
  return (
    <Ramme sti="/konsept-scroll" fastMeny>
      <div className="ks">
        <section className="ks-film" id="film" aria-label="Film: fra digital interesse til ekte møter" ref={filmRef}>
          <div className="ks-film-scene">
            <div className="ks-apning">
              {/* Ser ut som en knapp, men er bare et bilde på åpningen: ikke klikkbar, ikke fokuserbar, ingen knappesemantikk. */}
              <p className="ks-cidea">CIDEA</p>
            </div>
            <figure className="ks-film-bilde" id="film-bilde">
              <video className="ks-video" muted playsInline preload="none" poster={FILM.plakat} aria-hidden="true" tabIndex={-1} disablePictureInPicture>
                {FILM.kilder.map(k => <source key={k.src} src={k.src} type={k.type} />)}
              </video>
            </figure>
            <ol className="ks-replikker">
              {replikker.map((r, i) => <li key={r.tekst} className={`ks-replikk ks-plass-${r.plass} ks-mobil-${r.mobil}`} data-nr={i + 1}>{r.tekst}</li>)}
            </ol>
            <button className="ks-spill" type="button">Spill av filmen</button>
            <a className="ks-hopp" href="#tjenester">Til tjenester <span aria-hidden="true">↓</span></a>
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
