import React, { useEffect, useRef, useState } from "react";
import "../forside/forside.css";
import "../sider/sider.css";
import "./en.css";
import { Ramme, useMeta } from "../forside/Ramme.jsx";
import { selskap } from "../sider/tjenester-innhold.js";
import { metaEn } from "./meta.js";
import { booking, bookingEkstern } from "./booking.js";

// Engelsk kontaktskjema for internasjonale henvendelser (fase D). Samme oppsett som det norske skjemaet
// (src/kontakt/Kontakt.jsx), som er uendret: Netlify Forms uten egne nøkler eller nye tjenester. Eget skjemanavn
// («contact»), slik at internasjonale henvendelser kan skilles fra norske i Netlify. Varselet går til samme
// innboks («any form» i Netlify). Uten JavaScript sendes skjemaet vanlig til /contact/thanks; med JavaScript sendes det
// med fetch og bekreftelse vises bare ved HTTP 2xx.
// Dataminimering: bare det som trengs for å svare og vurdere henvendelsen. Bedrift er valgfritt. Ingen budsjett,
// telefon eller adresse. Land brukes til å forstå markedet og tidssonen.
const tjenester = ["Branding", "Websites", "SEO", "Social media", "Not sure yet"];
const oppfolging = [["email", "Reply by email"], ["call", "Schedule a video call"]];
const land = ["United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman", "Norway", "United Kingdom"];

function valider(data) {
  const f = {};
  if (!data.get("name")?.trim()) f.name = "Enter your name.";
  const e = data.get("email")?.trim() || "";
  if (!e) f.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) f.email = "This email address does not look right. Example: name@company.com";
  if (!data.get("country")?.trim()) f.country = "Enter your country.";
  if (!data.get("service")) f.service = "Choose what your enquiry is about.";
  const m = data.get("message")?.trim() || "";
  if (m.length < 20) f.message = "Describe the project briefly (at least 20 characters).";
  return f;
}

export default function Contact() {
  useMeta({ ...metaEn["/contact"], sti: "/contact" });
  const [status, setStatus] = useState("klar"); // klar | sender | sendt | feil
  const [feil, setFeil] = useState({});
  const [js, setJs] = useState(false);
  const [neste, setNeste] = useState("email");
  useEffect(() => { setJs(true); if (location.hash === "#call") setNeste("call"); }, []);
  const oppsummering = useRef(null);
  const bekreftelse = useRef(null);
  const feilmelding = useRef(null);

  async function send(ev) {
    ev.preventDefault();
    const skjema = ev.currentTarget; const data = new FormData(skjema);
    const f = valider(data); setFeil(f);
    if (Object.keys(f).length) { setStatus("klar"); requestAnimationFrame(() => oppsummering.current?.focus()); return; }
    if (data.get("bot-field")) { setStatus("feil"); return; }
    setStatus("sender");
    try {
      const svar = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(data).toString() });
      if (!svar.ok) throw new Error(`HTTP ${svar.status}`);
      setStatus("sendt"); requestAnimationFrame(() => bekreftelse.current?.focus());
    } catch {
      setStatus("feil"); requestAnimationFrame(() => feilmelding.current?.focus());
    }
  }

  const felt = (navn, hjelp) => ({
    id: `c-${navn}`, name: navn, "aria-invalid": feil[navn] ? "true" : undefined,
    "aria-describedby": [hjelp && `c-${navn}-help`, feil[navn] && `c-${navn}-error`].filter(Boolean).join(" ") || undefined,
  });
  const Feil = ({ navn }) => feil[navn] ? <p className="sd-feltfeil en-feltfeil" id={`c-${navn}-error`}>{feil[navn]}</p> : null;
  const antallFeil = Object.keys(feil).length;

  return (
    <Ramme sti="/contact" lang="en">
      <header className="sd-hode">
        <div className="cm-wrap">
          <h1 id="h1">Tell us about your project</h1>
          <p className="sd-ingress">Whether it is a new brand, a website, search visibility or social media, a few lines about the business and what you want to achieve is enough to start. We read every enquiry and reply by email.</p>
        </div>
      </header>

      <div className="cm-wrap sd-kontakt">
        <section className="sd-skjemaflate" aria-labelledby="enquiry">
          <h2 id="enquiry">Project enquiry</h2>

          {status === "sendt" ? (
            <div className="sd-melding sd-melding-ok" role="status">
              <h3 ref={bekreftelse} tabIndex={-1}>Your enquiry has been sent</h3>
              <p>Thank you. We have received your enquiry and will reply by email. {neste === "call" && "We will suggest times for a video call in our reply."}</p>
            </div>
          ) : (
            <form name="contact" method="POST" action="/contact/thanks" data-netlify="true" netlify-honeypot="bot-field" noValidate={js} onSubmit={send}>
              <input type="hidden" name="form-name" value="contact" />
              <input type="hidden" name="subject" value="New international enquiry from cideamarketing.com (%{submissionId})" />
              <p className="sd-honning" aria-hidden="true"><label>Do not fill in this field <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>

              {antallFeil > 0 && (
                <div className="sd-melding sd-melding-feil" ref={oppsummering} tabIndex={-1} role="alert">
                  <h3>{antallFeil === 1 ? "One field needs attention" : `${antallFeil} fields need attention`}</h3>
                  <ul>{Object.entries(feil).map(([n, x]) => <li key={n}><a href={n === "service" ? "#c-service-0" : `#c-${n}`}>{x}</a></li>)}</ul>
                </div>
              )}

              <div className="sd-felt">
                <label htmlFor="c-name">Name</label>
                <input {...felt("name")} type="text" autoComplete="name" required />
                <Feil navn="name" />
              </div>
              <div className="sd-felt">
                <label htmlFor="c-company">Company <span className="sd-valgfritt">(optional)</span></label>
                <input {...felt("company")} type="text" autoComplete="organization" />
              </div>
              <div className="sd-felt">
                <label htmlFor="c-email">Email</label>
                <input {...felt("email", true)} type="email" autoComplete="email" inputMode="email" required />
                <p className="sd-hjelp" id="c-email-help">We reply to this address.</p>
                <Feil navn="email" />
              </div>
              <div className="sd-felt">
                <label htmlFor="c-country">Country</label>
                <input {...felt("country")} type="text" autoComplete="country-name" list="c-country-list" required />
                <datalist id="c-country-list">{land.map(l => <option key={l} value={l} />)}</datalist>
                <Feil navn="country" />
              </div>
              <fieldset className="sd-felt" aria-describedby={feil.service ? "c-service-error" : undefined}>
                <legend>What can we help with?</legend>
                <div className="sd-valg">
                  {tjenester.map((t, i) => (
                    <label key={t} className="sd-valg-alt"><input type="radio" id={`c-service-${i}`} name="service" value={t} required aria-invalid={feil.service ? "true" : undefined} /> {t}</label>
                  ))}
                </div>
                <Feil navn="service" />
              </fieldset>
              <div className="sd-felt">
                <label htmlFor="c-message">About the project</label>
                <textarea {...felt("message", true)} rows={6} required minLength={20} />
                <p className="sd-hjelp" id="c-message-help">What does the business do, what would you like to achieve, and is there a timeframe? If you have a website, feel free to include the link.</p>
                <Feil navn="message" />
              </div>
              <fieldset className="sd-felt" id="call">
                <legend>How would you like to continue?</legend>
                <div className="sd-valg">
                  {oppfolging.map(([v, t]) => (
                    <label key={v} className="sd-valg-alt"><input type="radio" name="next-step" value={t} checked={neste === v} onChange={() => setNeste(v)} /> {t}</label>
                  ))}
                </div>
                {bookingEkstern && <p className="sd-hjelp">Prefer to pick a time yourself? <a href={booking.url} target="_blank" rel="noopener">Book a {booking.varighet} call</a>.</p>}
              </fieldset>

              <p className="sd-hjelp">We use this information only to reply to your enquiry. See our <a href="/privacy">privacy notice</a> for how we handle it.</p>

              {status === "feil" && (
                <div className="sd-melding sd-melding-feil" ref={feilmelding} tabIndex={-1} role="alert">
                  <h3>Your enquiry was not sent</h3>
                  <p>Something went wrong while sending. Please try again, or email us directly at <a href={`mailto:${selskap.epost}`}>{selskap.epost}</a>.</p>
                </div>
              )}

              <button className="cm-knapp sd-send" type="submit" disabled={status === "sender"} aria-describedby="c-sendstatus">
                {status === "sender" ? "Sending …" : <>Send enquiry <span aria-hidden="true">→</span></>}
              </button>
              <p className="cm-skjult" id="c-sendstatus" role="status" aria-live="polite">{status === "sender" ? "Sending your enquiry" : ""}</p>
            </form>
          )}
        </section>

        <aside className="sd-kontaktinfo" aria-labelledby="direct">
          <h2 id="direct">Direct contact</h2>
          <p><a href={`mailto:${selskap.epost}`}>{selskap.epost}</a></p>
          <h2>What happens next?</h2>
          <p>We read your enquiry and reply by email. If it is a good fit, we suggest a short video call to understand the business and your goals. For project work, you then receive a written scope and a fixed quote before anything starts.</p>
          <h2>Where we are</h2>
          <p>Cidea Marketing is based in Oslo, Norway, and works with clients internationally, including in the United Arab Emirates. Calls are scheduled within your business hours.</p>
          <h2>The company</h2>
          <p>{selskap.navn}<br />Org. no. {selskap.orgnr}<br />{selskap.adresse}, Norway</p>
        </aside>
      </div>
    </Ramme>
  );
}
