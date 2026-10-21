import React from "react";

// Cidea-motivet som stablede lag: hvert plan blir en egen <svg> i samme ramme, slik at
// inngangsanimasjonen kan kjøres med transform/opacity på kompositoren (fase 4.4, T7).
// Kilde-SVG-ene er fase 4-filene i src/assets/motiv (validert mot motivregelen).
const kilder = import.meta.glob("../assets/motiv/*.svg", { query: "?raw", import: "default", eager: true });

function les(navn) {
  const svg = kilder[`../assets/motiv/${navn}.svg`];
  if (!svg) throw new Error(`Mangler motiv: ${navn}`);
  const [, , w, h] = svg.match(/viewBox="([^"]+)"/)[1].split(" ").map(Number);
  const etikett = (svg.match(/aria-label="([^"]*)"/) || [])[1] || "Cidea-motiv";
  const plan = [...svg.matchAll(/<(rect|polygon)([^>]*)\/>/g)].map(m => {
    const a = Object.fromEntries([...m[2].matchAll(/([a-z-]+)="([^"]*)"/g)].map(x => [x[1], x[2]]));
    return { type: m[1], a };
  });
  return { w, h, etikett, plan };
}

function Plan({ type, a }) {
  const { "data-i": _i, "data-hakk": _h, ...attrs } = a;
  return type === "rect" ? <rect {...attrs} /> : <polygon {...attrs} />;
}

/** Lagdelt motiv med inngangsanimasjon (CSS). `pynt` = dekorativ (aria-hidden). */
export function Motiv({ navn, className = "", pynt = false }) {
  const m = les(navn);
  const tilgjengelighet = pynt ? { "aria-hidden": true } : { role: "img", "aria-label": m.etikett };
  return (
    <div className={`cm-motiv ${className}`} style={{ aspectRatio: `${m.w} / ${m.h}` }} {...tilgjengelighet}>
      {m.plan.map((p, i) => (
        <svg key={i} viewBox={`0 0 ${m.w} ${m.h}`} aria-hidden="true" focusable="false"
          data-i={p.a["data-i"]} data-hakk={p.a["data-hakk"] ? "1" : undefined}>
          <Plan {...p} />
        </svg>
      ))}
    </div>
  );
}

/** Enkel inline SVG (små glyfer og artikkelgrafikk), alltid dekorativ. */
export function Grafikk({ navn, className = "" }) {
  const m = les(navn);
  return (
    <svg className={className} viewBox={`0 0 ${m.w} ${m.h}`} aria-hidden="true" focusable="false">
      {m.plan.map((p, i) => <g key={i} data-hakk={p.a["data-hakk"] ? "1" : undefined}><Plan {...p} /></g>)}
    </svg>
  );
}
