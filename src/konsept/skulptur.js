// Partikkelskulptur for /konsept-scroll (fase 5, ikke godkjent): en foldet flate i 3D der partiklene ligger på
// geometrien. Rå WebGL 1 uten avhengigheter. Formen beregnes i vertex-shaderen ut fra (u, v) per partikkel og fire
// verdier: hvile (tid, svak bevegelse gjennom foldene), apne (utfoldelse 0–1), band (sammentrekning til bånd 0–1) og
// ut (båndet trekker seg ut til siden 0–1). Hvilebevegelsen og scrollverdiene er adskilt, så begge virker uten rykk.
// Dybden kommer fra geometri, tetthet og blåtoner (én fargefamilie rundt #2457FF): mørkere i foldene, lysere på
// ryggene og kantene som vender mot lyset. Ingen glød, ingen tilfeldig sky.

const VS = `
attribute vec2 aUV;
attribute float aR;
uniform float uT, uApne, uBand, uUt, uAsp, uPx, uMobil;
uniform vec2 uSentrum;
uniform float uSkala;
varying vec3 vFarge;

// Flaten i modellrommet. q = (u, v) i [-1, 1]. Silhuetten er asymmetrisk: smal og lav til venstre, høy og bred til
// høyre, med en svakt bølgende midtlinje, så formen leses som en skulptur og ikke som et rektangel.
vec3 flate(vec2 q, out float profil) {
  float u = q.x;
  float apne = uApne, band = uBand;
  float hoyde = 0.92 * smoothstep(-1.08, 0.5, u);
  float v = q.y * hoyde + 0.16 * sin(u * 1.9 + 0.4) - 0.08 * u;
  // Bølgende over- og underkant (ikke rette snitt).
  v += q.y * hoyde * 0.10 * sin(u * 5.3 + q.y * 1.7);
  // Foldene går på skrå og bøyer seg; avstanden mellom dem øker mot høyre.
  float th = 0.62 + 0.12 * apne;
  float s = u * cos(th) + v * sin(th) + 0.34 * v * v - 0.12 * u * v;
  float k = mix(8.6, 7.2, apne) * (1.0 - 0.16 * u);
  // Hvile: langsom vandring gjennom foldene. Liten fase, så silhuetten holder seg.
  float hvile = 0.16 * sin(uT * 0.21) + 0.07 * sin(uT * 0.13 + v * 2.1);
  float w = sin(s * k + 0.7 + hvile);
  profil = sign(w) * pow(abs(w), 0.62); // skarpe rygger, bratte sider
  // Foldene er dypest i høyre del og flater ut mot den smale venstre enden.
  float konvolutt = smoothstep(-1.05, 0.25, u) * (0.80 + 0.20 * sin(v * 1.6 + 0.5));
  float a = mix(0.17, 0.26, apne) * konvolutt * mix(1.0, 0.35, band);
  vec3 p = vec3(u * 1.35, v * 1.1, a * profil);
  // Hele flaten krummer bakover og vris, som et draperi.
  p.z += 0.26 * u * u - 0.22 * u * v + 0.10 * v * v;
  // Bånd: smalere og lengre.
  p.y *= mix(1.0, 0.10, band);
  p.x *= mix(1.0, 1.55, band);
  p.z *= mix(1.0, 0.5, band);
  return p;
}

mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
mat3 rotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0); }

void main() {
  vec2 q = aUV;
  float profil, x;
  vec3 p = flate(q, profil);
  // Normal fra nabopunkter på flaten (partiklene følger flaten, og skyggen følger normalen).
  float e = 0.004;
  vec3 du = flate(q + vec2(e, 0.0), x) - p, dv = flate(q + vec2(0.0, e), x) - p;
  vec3 n = normalize(cross(du, dv));
  // Dreining: svak ved åpning, mer under utfoldelsen, tilbake til nesten flatt bånd. Mindre på mobil.
  float dreie = mix(1.0, 0.55, uMobil);
  mat3 r = rotZ(mix(-0.10, -0.04, uBand) + 0.06 * uApne * dreie)
         * rotX(mix(-0.30, -0.12, uBand) + 0.08 * uApne * dreie)
         * rotY((mix(-0.62, -0.44, uApne) * (1.0 - uBand) - 0.05 * uBand) * dreie);
  p = r * p; n = r * n;
  // Tosidig flate: lyset regnes på siden som vender mot betrakteren. Baksiden (der flaten folder seg bort) tynnes ut,
  // så overlappende folder ikke gir prikkete støy.
  float bak = n.z < 0.0 ? 1.0 : 0.0;
  if (n.z < 0.0) n = -n;
  // Plassering i bildet (sentrum i skjermandeler, -1–1) og avstand til kamera.
  vec3 w = p * uSkala;
  float avstand = 3.4;
  float f = 1.0 / tan(radians(30.0) * 0.5);
  float z = avstand - w.z;
  vec2 skjerm = vec2(w.x * f / uAsp, w.y * f) / z;
  skjerm += uSentrum + vec2(uUt * 1.6, -uUt * 0.05);
  gl_Position = vec4(skjerm, (z - 1.0) / 6.0, 1.0);
  gl_PointSize = uPx * (0.85 + 0.3 * aR) * (avstand / z);
  // Rom mellom foldene: dalbunnene tynnes ut, så foldene skilles av luft og ikke bare av farge. Kantene tynnes også.
  float tom = smoothstep(-0.45, -0.98, profil) * 0.62 + smoothstep(0.86, 1.0, abs(q.y)) * 0.5 + smoothstep(-0.6, -1.0, q.x) * 0.85 + bak * 0.45;
  if (aR < tom) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  // Blåtoner: dyp i foldene, #2457FF i flatene, lys på rygger og kanter mot lyset.
  vec3 lys = normalize(vec3(-0.65, 0.45, 0.55));
  // Tone fra både lys (normal) og foldhøyde, så ryggene og dalene leses tydelig også der flaten vender rett mot oss.
  float l = mix(dot(n, lys), profil * 0.55 + 0.35, 0.5);
  float kant = 1.0 - abs(n.z);
  vec3 dyp = vec3(0.039, 0.106, 0.420);   // #0A1B6B
  vec3 blaa = vec3(0.141, 0.341, 1.0);    // #2457FF
  vec3 lyseblaa = vec3(0.616, 0.706, 1.0); // #9DB4FF
  // Dalene er dype og mørke; ryggene som vender mot lyset er lyse.
  float dal = smoothstep(0.1, -0.8, profil);
  vec3 c = mix(dyp, blaa, smoothstep(-0.20, 0.45, l) * (1.0 - 0.6 * dal));
  c = mix(c, lyseblaa, clamp(smoothstep(0.74, 0.99, l) * 0.9 * (1.0 - dal) + kant * 0.2, 0.0, 0.85));
  // Luftperspektiv: det som ligger lengst bak, blir lysere (mot den hvite bakgrunnen).
  c = mix(c, vec3(0.86, 0.90, 1.0), clamp((z - 3.2) * 0.45, 0.0, 0.30));
  vFarge = c;
}`;

const FS = `
precision mediump float;
varying vec3 vFarge;
uniform vec4 uKlipp; // x: venstre grense (px), y: øvre grense (px fra toppen), z: mykhet (px), w: skjermhøyde (px)
uniform float uAlfa;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  if (dot(d, d) > 0.25) discard;
  // Ingen partikler over tekst eller meny: myk grense mot tekstfeltet (venstre) og menyen/teksten (topp).
  float fraTopp = uKlipp.w - gl_FragCoord.y;
  float a = smoothstep(uKlipp.x, uKlipp.x + uKlipp.z, gl_FragCoord.x) * smoothstep(uKlipp.y, uKlipp.y + uKlipp.z, fraTopp) * uAlfa;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vFarge * a + (1.0 - a), 1.0); // blandet mot hvit bakgrunn
}`;

function lagShader(gl, type, kilde) {
  const s = gl.createShader(type); gl.shaderSource(s, kilde); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shaderfeil");
  return s;
}

// Partikler i et stratifisert rutenett med tilfeldig forskyvning i hver celle: jevn dekning av flaten uten
// synlige rader, og tettheten på skjermen følger geometrien (skrå flater og folder blir tettere).
function partikler(nu, nv) {
  const uv = new Float32Array(nu * nv * 2), r = new Float32Array(nu * nv);
  let frø = 1234567;
  const tilf = () => ((frø = (frø * 16807) % 2147483647) / 2147483647);
  for (let j = 0, i = 0; j < nv; j++) for (let k = 0; k < nu; k++, i++) {
    uv[i * 2] = -1 + 2 * (k + tilf()) / nu;
    uv[i * 2 + 1] = -1 + 2 * (j + tilf()) / nv;
    r[i] = tilf();
  }
  return { uv, r, n: nu * nv };
}

/** Lager skulpturen i lerretet. Kaster feil hvis WebGL mangler eller shaderne ikke kan kompileres. */
export function lagSkulptur(lerret, { mobil, lav }) {
  const gl = lerret.getContext("webgl", { antialias: false, alpha: false, depth: true, powerPreference: "low-power", preserveDrawingBuffer: false });
  if (!gl) throw new Error("WebGL er ikke tilgjengelig");
  const prog = gl.createProgram();
  gl.attachShader(prog, lagShader(gl, gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, lagShader(gl, gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || "lenkefeil");
  gl.useProgram(prog);
  // Partikkelmengde etter enhet: færre på mobil og på svake enheter.
  const [nu, nv] = mobil ? (lav ? [250, 170] : [310, 210]) : (lav ? [380, 260] : [480, 340]);
  const { uv, r, n } = partikler(nu, nv);
  const buf = (data, navn, str) => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); const loc = gl.getAttribLocation(prog, navn); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, str, gl.FLOAT, false, 0, 0); return b; };
  const buffere = [buf(uv, "aUV", 2), buf(r, "aR", 1)];
  const U = {}; for (const navn of ["uT", "uApne", "uBand", "uUt", "uAsp", "uPx", "uMobil", "uSentrum", "uSkala", "uKlipp", "uAlfa"]) U[navn] = gl.getUniformLocation(prog, navn);
  gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
  gl.clearColor(1, 1, 1, 1);
  let px = 1, b = 0, h = 0;
  return {
    antall: n,
    // Størrelse i CSS-piksler og pikseltetthet (begrenset etter enhet).
    storrelse(bredde, hoyde, dpr) {
      px = dpr; b = Math.max(1, Math.round(bredde * dpr)); h = Math.max(1, Math.round(hoyde * dpr));
      if (lerret.width !== b || lerret.height !== h) { lerret.width = b; lerret.height = h; }
      gl.viewport(0, 0, b, h);
    },
    // Tegner ett bilde. sentrum og skala gir komposisjonen; klipp holder partiklene unna tekst og meny (CSS-px).
    tegn({ t, apne, band, ut, sentrum, skala, klipp, alfa = 1 }) {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform1f(U.uT, t); gl.uniform1f(U.uApne, apne); gl.uniform1f(U.uBand, band); gl.uniform1f(U.uUt, ut);
      gl.uniform1f(U.uAsp, b / h); gl.uniform1f(U.uMobil, mobil ? 1 : 0);
      // Punktstørrelse: litt større på små skjermer, så formen leses som flate og ikke som støv.
      gl.uniform1f(U.uPx, (mobil ? 1.75 : 1.5) * px * Math.min(1.25, Math.max(.85, Math.sqrt(b * h) / px / 1100)));
      gl.uniform2f(U.uSentrum, sentrum[0], sentrum[1]); gl.uniform1f(U.uSkala, skala);
      gl.uniform4f(U.uKlipp, klipp[0] * px, klipp[1] * px, 36 * px, h);
      gl.uniform1f(U.uAlfa, alfa);
      gl.drawArrays(gl.POINTS, 0, n);
    },
    rydd() {
      buffere.forEach(x => gl.deleteBuffer(x)); gl.deleteProgram(prog);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
