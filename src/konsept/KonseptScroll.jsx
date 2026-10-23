import React, { useEffect, useRef } from "react";
import "../forside/forside.css";
import "./konsept-scroll.css";
import { Ramme, useMeta } from "../forside/Ramme.jsx";
import { tjenester } from "../forside/Forside.jsx";
import { lagSkulptur } from "./skulptur.js";

// Prototype «Vi gir ideer form» (fase 5, ikke godkjent). Isolert på /konsept-scroll. Hvit flate, stor lett typografi og
// en blå partikkelskulptur (foldet 3D-flate i WebGL, se skulptur.js). Forløp med vanlig scroll, uten scrollås:
// 1 ankomst (skulpturen er ferdig synlig, svak hvilebevegelse) → 2 utfoldelse (foldene åpner seg, formen dreier) →
// 3 overgang (teksten går ut, formen trekker seg sammen til et bånd, et kort øyeblikk uten tekst) → 4 tjenester (båndet
// trekker seg ut til siden mens tjenestene kommer i vanlig sideflyt). Alt er en funksjon av scrollposisjonen, så scroll
// opp reverserer forløpet. Uten JS, uten WebGL, ved feil og ved redusert bevegelse vises et statisk bilde av skulpturen.
// Den tidligere filmversjonen ligger i src/konsept/arkiv/ (se README der).

const BILDE = { desktop: "/konsept/skulptur-desktop.webp", mobil: "/konsept/skulptur-mobil.webp" };

// Andeler av den aktive scrollreisen (scenens høyde minus én skjermhøyde).
export const FORLØP = {
  apne: [0, .55],     // utfoldelse
  tekstUt: [.40, .66], // åpningsteksten forlater scenen
  band: [.56, .90],   // sammentrekning til bånd
  // .90–1: båndet alene, uten ny tekst; deretter trekker det seg ut mens tjenestene kommer inn.
};
// Største endring i utfoldelse/bånd per sekund (hele utfoldelsen tar minst 0,4 s, uansett hvor fort det scrolles).
export const MAKS_FART = 2.5;
const glatt = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

function useSkulptur(ref) {
  useEffect(() => {
    const scene = ref.current, html = document.documentElement;
    const lerret = scene?.querySelector("canvas"), tekst = scene?.querySelector(".kp-tekst");
    if (!lerret) return;
    const rolig = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (rolig.matches) return; // rolig komposisjon via CSS (statisk bilde, vanlig sideflyt)
    // Hovedskriptet kom etter at oppstartsskriptet slo på reserven (js-reserve, se index.html): står leseren fortsatt
    // øverst, tas det aktive oppsettet i bruk; ellers beholdes det statiske for denne visningen.
    if (html.classList.contains("js-reserve")) {
      if (html.classList.contains("js-feil") || window.scrollY > 2) return;
      html.classList.remove("js-reserve");
    }
    const mobilMq = window.matchMedia("(max-width: 860px), (max-aspect-ratio: 1/1)");
    const lav = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
    let sk, mobil = mobilMq.matches;
    const statisk = () => { scene.classList.add("kp-statisk"); scene.classList.remove("kp-aktiv"); };
    try { sk = lagSkulptur(lerret, { mobil, lav }); } catch { statisk(); return; }
    scene.classList.add("kp-aktiv"); scene.dataset.partikler = sk.antall;

    // Mål (fra scroll) og viste verdier (glattet mot målet). Hvilebevegelsen går på egen klokke.
    const mål = { apne: 0, band: 0, ut: 0, tekst: 1 }, vist = { ...mål };
    let synlig = true, ramme = 0, sist = performance.now(), t0 = sist, klipp = [0, 0], tekstSynlig = true, første = true;
    const måleScroll = () => {
      const r = scene.getBoundingClientRect(), reise = Math.max(1, scene.offsetHeight - window.innerHeight);
      const q = Math.min(1, Math.max(0, -r.top / reise));
      mål.apne = glatt(...FORLØP.apne, q);
      mål.band = glatt(...FORLØP.band, q);
      mål.tekst = 1 - glatt(...FORLØP.tekstUt, q);
      // Etter reisen: scenen scroller ut, og båndet trekker seg ut til siden.
      mål.ut = glatt(0, window.innerHeight * .9, -r.top - reise);
      scene.dataset.forlop = q.toFixed(3);
      // Teksten følger scrollposisjonen direkte (ikke tegnetakten), så den aldri henger igjen. Usynlig tekst er inert:
      // den fanger verken klikk eller tastaturfokus.
      tekst.style.setProperty("--ut", (1 - mål.tekst).toFixed(4));
      const nySynlig = mål.tekst > .02;
      if (nySynlig !== tekstSynlig) { tekstSynlig = nySynlig; tekst.toggleAttribute("inert", !nySynlig); scene.dataset.tekst = nySynlig ? "synlig" : "borte"; }
    };
    // Grenser for partiklene (CSS-px): til høyre for teksten (desktop) og under teksten (mobil), alltid under menyen.
    const måleKlipp = () => {
      const topp = document.querySelector(".cm-topp")?.getBoundingClientRect().bottom || 0;
      const lr = lerret.getBoundingClientRect(), tr = tekst.getBoundingClientRect();
      const åpen = mål.tekst > .02;
      klipp = mobil
        ? [0, Math.max(topp, åpen ? tr.bottom + 8 : topp) - lr.top]
        : [åpen ? Math.max(0, tr.right + 24 - lr.left) * Math.min(1, mål.tekst * 3) : 0, topp - lr.top];
    };
    const størrelse = () => {
      const ny = mobilMq.matches;
      if (ny !== mobil) { mobil = ny; sk.rydd(); try { sk = lagSkulptur(lerret, { mobil, lav }); } catch { statisk(); stopp(); return; } scene.dataset.partikler = sk.antall; }
      const r = lerret.getBoundingClientRect();
      sk.storrelse(r.width, r.height, Math.min(window.devicePixelRatio || 1, mobil ? 2 : 1.5));
    };
    // Komposisjon: desktop – formen til høyre, delvis utenfor høyre kant; mobil – under teksten, større og lavere.
    const komposisjon = () => mobil
      ? { sentrum: [.16 - .16 * vist.band, -.52 + .30 * vist.band], skala: .60 }
      : { sentrum: [.55 - .45 * vist.band, -.12 - .05 * vist.band], skala: .70 - .06 * vist.band };
    const tegn = nå => {
      ramme = 0;
      const dt = Math.min(.1, (nå - sist) / 1000); sist = nå;
      // Myk tilnærming mot målet (ca. 0,12 s) med fartsgrense (MAKS_FART per sekund): store scrollhopp og raske
      // retningsendringer gir en rolig, sammenhengende bevegelse uten rykk, og formen reverserer fra der den er.
      const k = første ? 1 : 1 - Math.exp(-dt / .12), grense = første ? 1 : MAKS_FART * dt; første = false;
      for (const x in mål) vist[x] += Math.max(-grense, Math.min(grense, (mål[x] - vist[x]) * k));
      måleKlipp();
      sk.tegn({ t: (nå - t0) / 1000, apne: vist.apne, band: vist.band, ut: vist.ut, ...komposisjon(), klipp, alfa: 1 - vist.ut * .9 });
      scene.dataset.apne = vist.apne.toFixed(3); scene.dataset.band = vist.band.toFixed(3);
      if (synlig && !document.hidden) ramme = requestAnimationFrame(tegn);
    };
    const start = () => { if (!ramme && synlig && !document.hidden) { sist = performance.now(); ramme = requestAnimationFrame(tegn); } };
    const scroll = () => { måleScroll(); start(); };
    // Rendering bare når scenen er synlig og fanen er aktiv.
    const io = new IntersectionObserver(([e]) => { synlig = e.isIntersecting; scene.dataset.render = synlig ? "på" : "av"; if (synlig) start(); else { cancelAnimationFrame(ramme); ramme = 0; } });
    const fane = () => { if (document.hidden) { cancelAnimationFrame(ramme); ramme = 0; } else start(); };
    const tapt = e => { e.preventDefault(); statisk(); stopp(); };
    const endret = () => { if (rolig.matches) { statisk(); stopp(); } };
    function stopp() {
      cancelAnimationFrame(ramme); ramme = 0; io.disconnect();
      window.removeEventListener("scroll", scroll); window.removeEventListener("resize", størrelse);
      document.removeEventListener("visibilitychange", fane); lerret.removeEventListener("webglcontextlost", tapt);
      rolig.removeEventListener("change", endret);
      tekst.removeAttribute("inert"); tekst.style.removeProperty("--ut");
    }
    størrelse(); måleScroll();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", størrelse, { passive: true });
    document.addEventListener("visibilitychange", fane);
    lerret.addEventListener("webglcontextlost", tapt);
    rolig.addEventListener("change", endret);
    io.observe(scene);
    // Første bilde tegnes før det statiske bildet skjules, så skulpturen er synlig hele tiden.
    tegn(performance.now()); scene.classList.add("kp-tegnet");
    return () => { stopp(); try { sk.rydd(); } catch { /* allerede ryddet */ } };
  }, [ref]);
}

export default function KonseptScroll() {
  const sceneRef = useRef(null);
  useSkulptur(sceneRef);
  useMeta({
    tittel: "Konsept: Vi gir ideer form | Cidea Marketing",
    beskrivelse: "Prototype av en forside for Cidea Marketing med en blå partikkelskulptur. Ikke publisert som forside.",
    sti: "/konsept-scroll",
  });
  return (
    <Ramme sti="/konsept-scroll" fastMeny>
      <div className="kp">
        <section className="kp-scene" ref={sceneRef} aria-labelledby="kp-h1">
          <div className="kp-ramme">
            <picture className="kp-bilde">
              <source media="(max-width: 860px), (max-aspect-ratio: 1/1)" srcSet={BILDE.mobil} />
              <img src={BILDE.desktop} alt="" width="1440" height="990" decoding="async" fetchpriority="high" />
            </picture>
            <canvas className="kp-lerret" aria-hidden="true" />
            <div className="kp-tekst">
              <h1 id="kp-h1">Vi gir ideer form.</h1>
              <p className="kp-ingress">Nettsider, merkevarebygging, SEO og digital markedsføring.</p>
              <a className="kp-knapp" href="/kontakt">La oss snakke <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>

        <section className="kp-tjenester" id="tjenester" aria-labelledby="kp-tjenester-tittel">
          <div className="cm-wrap">
            <h2 id="kp-tjenester-tittel">Tjenester</h2>
            <ul>
              {tjenester.map(t => (
                <li key={t.href}>
                  <a href={t.href}>
                    <h3>{t.tittel}</h3>
                    <p>{t.tekst}</p>
                    <span className="kp-lenketekst">{t.lenke} <span aria-hidden="true">→</span></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="kp-slutt" aria-labelledby="kp-slutt-tittel">
          <div className="cm-wrap kp-slutt-rad">
            <h2 id="kp-slutt-tittel">Klar for et overbevisende digitalt uttrykk?</h2>
            <p>Fortell oss kort om bedriften og hva dere ønsker hjelp med. Vi tar kontakt på e-post.</p>
            <a className="kp-knapp" href="/kontakt">La oss snakke <span aria-hidden="true">→</span></a>
          </div>
        </section>
      </div>
    </Ramme>
  );
}
