import React from "react";
import "../forside/forside.css";
import "../sider/sider.css";
import { Ramme, SluttCta, useMeta } from "../forside/Ramme.jsx";
import { ArtikkelTekst, inline } from "../sider/artikler.jsx";
import { selskap } from "../sider/tjenester-innhold.js";
import { tjenesterEn, tjenesteEn, omCidea } from "./innhold.js";
import { artiklerEn } from "./artikler-en.js";
import { bookingHref, bookingEkstern, booking } from "./booking.js";
import { metaEn } from "./meta.js";
import "./en.css";

// Engelske sider for det internasjonale markedet (oktober 2026). Samme komponenter, klasser og designsystem som de
// norske undersidene (src/sider/Sider.jsx); bare tekst og struktur er nye. Ingen nye bilder, farger eller figurer.

const ekstern = bookingEkstern ? { target: "_blank", rel: "noopener" } : {};
const CTA = { knapp: "Discuss a project", href: "/contact" };

function Sidehode({ sti, etikett, tittel, ingress, children }) {
  return (
    <header className="sd-hode">
      <div className="cm-wrap">
        {sti && <nav className="sd-sti" aria-label="Breadcrumb"><ol>{sti.map(([t, h]) => <li key={t}>{h ? <a href={h}>{t}</a> : <span aria-current="page">{t}</span>}</li>)}</ol></nav>}
        {etikett && <p className="sd-tema en-etikett">{etikett}</p>}
        <h1 id="h1">{tittel}</h1>
        {ingress && <p className="sd-ingress">{ingress}</p>}
        {children}
      </div>
    </header>
  );
}

function Steg({ steg, tittel = "How we work together", id = "steps" }) {
  const farger = ["marine", "dyp", "skog"];
  return (
    <section className="cm-seksjon cm-lys sd-seksjon" aria-labelledby={id}>
      <div className="cm-wrap">
        <h2 id={id}>{tittel}</h2>
        <ol className="cm-steg">{steg.map(([t, x], i) => <li key={t} className={`cm-steg-${farger[i % 3]}`}><h3>{t}</h3><p>{x}</p></li>)}</ol>
      </div>
    </section>
  );
}

function Rader({ id, tittel, rader, lys }) {
  return (
    <section className={`cm-seksjon sd-seksjon${lys ? " cm-lys" : ""}`} aria-labelledby={id}>
      <div className="cm-wrap sd-to">
        <h2 id={id}>{tittel}</h2>
        <dl className="sd-rader">{rader.map(([n, x]) => <div key={n}><dt>{n}</dt><dd>{inline(x, n)}</dd></div>)}</dl>
      </div>
    </section>
  );
}

function Faq({ id = "faq", tittel = "Questions", faq, lys = true }) {
  return (
    <section className={`cm-seksjon sd-seksjon${lys ? " cm-lys" : ""}`} aria-labelledby={id}>
      <div className="cm-wrap sd-to">
        <h2 id={id}>{tittel}</h2>
        <div className="sd-faq">
          {faq.map(([s, svar]) => (
            <details key={s}>
              <summary><h3>{s}</h3></summary>
              <p>{inline(svar, s)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Kontaktvalg: skjema, møte og e-post. Brukes på tjenestesidene og Dubai-siden. */
function Kontaktvalg({ id = "get-in-touch", tittel = "How to get in touch" }) {
  return (
    <section className="cm-seksjon sd-seksjon" aria-labelledby={id}>
      <div className="cm-wrap sd-to">
        <h2 id={id}>{tittel}</h2>
        <dl className="sd-rader">
          <div><dt><a href="/contact">Send a project enquiry</a></dt><dd>Tell us briefly about the business and what you need. We reply by email.</dd></div>
          <div><dt><a href={bookingHref} {...ekstern}>Book a {booking.varighet} call</a></dt><dd>A short video call to talk through your goals and whether we are the right fit.</dd></div>
          <div><dt><a href={`mailto:${selskap.epost}`}>{selskap.epost}</a></dt><dd>Prefer email? Write to us directly.</dd></div>
        </dl>
      </div>
    </section>
  );
}

function ArtikkelKort({ liste, overskrift, id, stor }) {
  if (!liste.length) return null;
  const H = stor ? "h2" : "h3";
  const innhold = (
    <ul className={stor ? "sd-artikler sd-artikler-stor" : "sd-artikler"}>
      {liste.map(a => (
        <li key={a.slug}>
          <a href={a.sti}>
            <span className="sd-tema">{a.tema}</span>
            <H>{a.tittel}</H>
            <p>{a.utdrag}</p>
            <span className="sd-lenke">Read the article <span aria-hidden="true">→</span></span>
          </a>
        </li>
      ))}
    </ul>
  );
  if (stor) return innhold;
  return (
    <section className="cm-seksjon sd-seksjon" aria-labelledby={id}>
      <div className="cm-wrap"><h2 id={id}>{overskrift}</h2>{innhold}</div>
    </section>
  );
}

/* ---------- Services ---------- */
export function Services() {
  useMeta({ ...metaEn["/services"], sti: "/services" });
  return (
    <Ramme sti="/services" lang="en">
      <Sidehode tittel="Branding, websites, SEO and social media" ingress="Four services that work best together. Take one on its own, or combine them when a brand, a website and its marketing need to move in the same direction." />
      <section className="cm-seksjon sd-seksjon sd-tett" aria-label="Services">
        <div className="cm-wrap">
          <ul className="sd-tjenester">
            {tjenesterEn.map(t => (
              <li key={t.sti} className={`sd-strek-${t.farge}`}>
                <h2><a href={t.sti}>{t.navn}</a></h2>
                <p className="sd-tjeneste-ingress">{t.kort}</p>
                <p><strong>Suits:</strong> {t.passer}</p>
                <a className="sd-lenke" href={t.sti} aria-hidden="true" tabIndex={-1}>Read about {t.navn} <span>→</span></a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="cm-seksjon cm-lys sd-seksjon" aria-labelledby="unsure">
        <div className="cm-wrap sd-smal">
          <h2 id="unsure">Not sure where to start?</h2>
          <p>Many businesses start with the website, because that is where customers check you out before they get in touch. Sometimes the brand needs attention first. Tell us briefly about the business, and we will suggest a sensible first step.</p>
          <a className="cm-knapp" href="/contact">Discuss a project <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </Ramme>
  );
}

export function ServicePage({ t }) {
  useMeta({ tittel: t.metaTittel, beskrivelse: t.beskrivelse, sti: t.sti });
  const relatert = t.relatert.map(s => tjenesteEn(s) || artiklerEn.find(a => a.sti === s)).filter(Boolean);
  return (
    <Ramme sti={t.sti} seksjon="/services" lang="en">
      <Sidehode sti={[["Services", "/services"], [t.navn]]} tittel={t.tittel} ingress={t.ingress}>
        <div className="sd-handling">
          <a className="cm-knapp" href="/contact">Discuss a project <span aria-hidden="true">→</span></a>
          <a className="cm-lenke" href="#deliverables">What you get <span aria-hidden="true">↓</span></a>
        </div>
      </Sidehode>
      <Rader id="challenges" tittel="Where we help" rader={t.utfordringer} />
      <section className="cm-seksjon sd-seksjon sd-tett" aria-labelledby="who">
        <div className="cm-wrap sd-to">
          <h2 id="who">Who it is for</h2>
          <p className="sd-brod">{t.passer}</p>
        </div>
      </section>
      <section id="deliverables">
        <Rader id="deliverables-title" tittel="What you get" rader={t.leveranse} />
      </section>
      <Steg steg={t.steg} />
      <Faq faq={t.faq} lys={false} />
      <Kontaktvalg />
      {relatert.length > 0 && (
        <section className="cm-seksjon cm-lys sd-seksjon" aria-labelledby="related">
          <div className="cm-wrap">
            <h2 id="related">Related</h2>
            <ul className="sd-punkter sd-punkter-lenker">
              {relatert.map(r => <li key={r.sti}><a href={r.sti}>{r.navn || r.tittel} <span aria-hidden="true">→</span></a></li>)}
            </ul>
          </div>
        </section>
      )}
      <SluttCta tittel="Tell us about your project" tekst="A few lines about the business and what you want to achieve is enough to start. We reply by email." {...CTA} />
    </Ramme>
  );
}

/* ---------- Dubai & UAE ---------- */
const fordeler = [
  ["Clarity before creativity", "We start by agreeing what the work must achieve and for whom. Project work begins with a written scope and a fixed quote, so you know what you are getting before anything starts."],
  ["A Nordic design sensibility", "Our work is clear, functional and carefully considered. It suits businesses that want to look confident and credible rather than loud."],
  ["One team for brand, website and marketing", "Identity, website and campaigns are planned together, so the message stays consistent from the first impression to the enquiry."],
  ["Working hours that overlap", omCidea.tidssone],
  ["Honest recommendations", "We recommend what supports your goals, not the largest possible project, and we tell you when a smaller step is enough."],
  ["You own the result", "Your domain is registered in your company's name. You receive the final files and guidelines, and the website source code on request."],
];

const dubaiFaq = [
  ["Do you have an office in Dubai?", "No. Cidea Marketing is based in Oslo, Norway, and works with clients in the UAE remotely. We meet on video calls scheduled within UAE business hours."],
  ["Which language do you work in?", "English. If you also need Arabic, we plan the structure, typography and layout for both languages from the start, and the Arabic copy is written or reviewed by a native speaker."],
  ["Who do we sign the agreement with?", "Projects are agreed in writing with CIDEA AS, the Norwegian company behind Cidea Marketing (org. no. 927 394 391)."],
  ["Can you work with our in-house team or other suppliers?", "Yes. We can work alongside your marketing team, developers or other agencies, and hand over files and guidelines they can use."],
];

export function Dubai() {
  useMeta({ ...metaEn["/dubai"], sti: "/dubai" });
  return (
    <Ramme sti="/dubai" lang="en">
      <Sidehode etikett="Dubai & UAE" tittel="A Norwegian creative agency for ambitious businesses in the UAE." ingress="We build brands, websites and digital marketing for companies in Dubai and across the Emirates that want to be understood quickly and chosen with confidence. Based in Oslo, working with you remotely, in English.">
        <div className="sd-handling">
          <a className="cm-knapp" href="/contact">Discuss a project <span aria-hidden="true">→</span></a>
          <a className="cm-lenke" href={bookingHref} {...ekstern}>Book a {booking.varighet} call <span aria-hidden="true">→</span></a>
        </div>
      </Sidehode>
      <section className="cm-seksjon sd-seksjon sd-tett" aria-labelledby="about-cidea">
        <div className="cm-wrap sd-to">
          <h2 id="about-cidea">Who we are</h2>
          <div className="sd-brod">
            <p>Cidea Marketing is a creative agency based in Oslo, Norway. We bring strategy, design, copy and technology together in one team, so the brand, the website and the marketing pull in the same direction.</p>
            <p>Working across borders is part of how we operate: clear written scopes, shared files, regular check-ins and decisions recorded in one place. You always know what happens next.</p>
          </div>
        </div>
      </section>
      <section className="cm-seksjon cm-lys sd-seksjon" aria-labelledby="services">
        <div className="cm-wrap">
          <h2 id="services">What we can help with</h2>
          <ul className="sd-tjenester en-tjenester">
            {tjenesterEn.map(t => (
              <li key={t.sti} className={`sd-strek-${t.farge}`}>
                <h3><a href={t.sti}>{t.navn}</a></h3>
                <p className="sd-tjeneste-ingress">{t.kort}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Rader id="why" tittel="Why work with us" rader={fordeler} />
      <Steg tittel="How a project works" id="process" steg={[
        ["Introductory call", "A video call to understand your business, your customers and what you want to achieve."],
        ["Proposal", "A written scope, a timeline and a fixed quote for the work we agree on. Nothing starts until you approve it."],
        ["Delivery and launch", "We work in clear stages with shared files and regular check-ins. You review and approve along the way, and we follow up after launch."],
      ]} />
      <Faq id="dubai-faq" tittel="Good to know" faq={dubaiFaq} lys={false} />
      <Kontaktvalg id="contact-options" tittel="Start with a conversation" />
      <SluttCta tittel="Planning a launch, a rebrand or a new website?" tekst="Tell us where the business is today and where you want it to be. We reply by email and can set up a call at a time that suits you." {...CTA} />
    </Ramme>
  );
}

/* ---------- About ---------- */
const verdier = [
  ["Clarity", "A website or a brand should make it easy to understand what you offer. We hold our own work and communication to the same standard."],
  ["Honesty", "We recommend what you need, even when it is less than you asked for."],
  ["Predictability", "You know what is included, what it costs and when it will be ready, before we start."],
  ["The long view", "A website is never quite finished. We are happy to stay involved and improve it over time."],
];

export function About() {
  useMeta({ ...metaEn["/about"], sti: "/about" });
  return (
    <Ramme sti="/about" lang="en">
      <Sidehode tittel="A creative agency based in Norway, working internationally." ingress="Cidea Marketing helps businesses become easier to find, understand and choose. We work with branding, websites, SEO and social media, and stay involved after launch when our clients want us to." />
      <Rader id="values" tittel="What we stand for" rader={verdier} />
      <section className="cm-seksjon cm-lys sd-seksjon" aria-labelledby="how">
        <div className="cm-wrap sd-to">
          <h2 id="how">How we work</h2>
          <div className="sd-brod">
            <p>We start with the business, not the design. What do your customers need to know, what makes you the right choice, and what should happen after someone visits the website? The answers shape everything we make.</p>
            <p>We work with clients in Norway and internationally, including businesses in the United Arab Emirates. Projects run remotely, in English or Norwegian, with written scopes and regular check-ins.</p>
          </div>
        </div>
      </section>
      <section className="cm-seksjon sd-seksjon" aria-labelledby="company">
        <div className="cm-wrap sd-to">
          <h2 id="company">The company</h2>
          <div className="sd-brod">
            <p>Cidea Marketing is operated by {selskap.navn}, org. no. {selskap.orgnr}, {selskap.adresse}, Norway.</p>
            <p>Contact: <a href={`mailto:${selskap.epost}`}>{selskap.epost}</a></p>
          </div>
        </div>
      </section>
      <SluttCta tittel="Would you like to get to know us?" tekst="Tell us briefly about the business and what you need help with. We reply by email." {...CTA} />
    </Ramme>
  );
}

/* ---------- Insights ---------- */
export function Insights() {
  useMeta({ ...metaEn["/insights"], sti: "/insights" });
  return (
    <Ramme sti="/insights" lang="en">
      <Sidehode tittel="Insights" ingress="Practical articles on websites, search visibility and working with an agency across borders." />
      <section className="cm-seksjon sd-seksjon sd-tett" aria-label="Articles">
        <div className="cm-wrap"><ArtikkelKort liste={artiklerEn} stor /></div>
      </section>
      <section className="cm-seksjon cm-lys sd-seksjon" aria-labelledby="norwegian">
        <div className="cm-wrap sd-smal">
          <h2 id="norwegian">Reading Norwegian?</h2>
          <p>More articles are available in Norwegian on <a className="cm-lenke" href="/blog" hrefLang="no" lang="no">Innsikt</a>.</p>
        </div>
      </section>
      <SluttCta tittel="Have a question about your website?" tekst="Tell us briefly about the business and what you want to improve. We reply by email." {...CTA} />
    </Ramme>
  );
}

export function Article({ a }) {
  useMeta({ tittel: a.metaTittel, beskrivelse: a.beskrivelse, sti: a.sti });
  const andre = artiklerEn.filter(x => x.slug !== a.slug);
  return (
    <Ramme sti={a.sti} seksjon="/insights" lang="en">
      <article>
        <Sidehode sti={[["Insights", "/insights"], [a.tittel]]} tittel={a.tittel}>
          <p className="sd-tema">{a.tema}<span className="sd-dato"> · {a.dato} · Cidea Marketing</span></p>
        </Sidehode>
        <div className="cm-wrap">
          <div className="sd-artikkel"><ArtikkelTekst kilde={a.kilde} /></div>
          <p className="sd-tilbake"><a className="cm-lenke" href="/insights"><span aria-hidden="true">←</span> All articles</a></p>
        </div>
      </article>
      <ArtikkelKort liste={andre} overskrift="Read next" id="read-next" />
      <SluttCta tittel="Want a second opinion on your website?" tekst="Tell us briefly about the business and what you want to achieve. We reply by email." {...CTA} />
    </Ramme>
  );
}

/* ---------- Privacy ---------- */
export function Privacy() {
  useMeta({ ...metaEn["/privacy"], sti: "/privacy" });
  return (
    <Ramme sti="/privacy" lang="en">
      <Sidehode tittel="Privacy" ingress="How we handle personal data on this website and in the contact form." />
      <div className="cm-wrap">
        <div className="sd-artikkel">
          <p>The controller is {selskap.navn}, org. no. {selskap.orgnr}, {selskap.adresse}, Norway, which operates Cidea Marketing. Privacy contact: <a href={`mailto:${selskap.epost}`}>{selskap.epost}</a>.</p>

          <h2>This website</h2>
          <p>The website does not use cookies, analytics tools, tracking pixels or advertising networks. Fonts are served from our own server, so your browser does not fetch files from Google or other third parties to display the pages.</p>
          <p>The website is hosted by Netlify. When pages load, Netlify processes technical information such as IP address and browser type to deliver the pages and protect the service.</p>
          <p>If you follow a link to a booking page or another external service, that service's own privacy terms apply.</p>

          <h2>The contact form</h2>
          <p>The form collects your name, email address, country, optionally your company name, the service you are interested in, how you would like us to follow up, and your message. We use this information only to reply to your enquiry and for any further dialogue you ask for. The legal basis is our legitimate interest in responding to enquiries and, where relevant, steps taken at your request before entering into an agreement (GDPR Article 6(1)(f) and (b)).</p>
          <p>The form is submitted through Netlify's form service and stored by Netlify, which processes it on our behalf as a data processor. Netlify is a US company, and data may be processed in the United States. We receive a notification by email.</p>
          <p>Enquiries that do not lead to a client relationship are deleted no later than six months after the conversation has ended. If an enquiry leads to an assignment, we keep the correspondence needed for the agreement and our accounts for as long as necessary or required by law.</p>
          <p>You can ask for access to, correction of or deletion of the information you have sent us by writing to <a href={`mailto:${selskap.epost}`}>{selskap.epost}</a>. You can also complain to the Norwegian Data Protection Authority, <a href="https://www.datatilsynet.no/en/">Datatilsynet</a>.</p>

          <h2>Business outreach in Norway</h2>
          <p>Cidea also contacts Norwegian businesses by email. How that data is handled is described in Norwegian on <a href="/personvern" hrefLang="no" lang="no">Personvern</a>.</p>
        </div>
      </div>
    </Ramme>
  );
}

/* ---------- Thanks ---------- */
export function Thanks() {
  useMeta({ tittel: "Enquiry sent | Cidea Marketing", beskrivelse: "Confirmation of your enquiry.", sti: "/contact/thanks" });
  return (
    <Ramme sti="/contact/thanks" seksjon="/contact" lang="en">
      <Sidehode tittel="Your enquiry has been sent" ingress="Thank you. We have received your enquiry and will reply by email. If we have questions, we will include them in our reply." />
      <div className="cm-wrap sd-avslutt"><a className="cm-lenke" href="/services">See our services <span aria-hidden="true">→</span></a></div>
    </Ramme>
  );
}
