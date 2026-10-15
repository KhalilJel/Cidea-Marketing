// Technical preview of the Phase 2 design-system components (not a page design).
// All copy is reused verbatim from the current site (src/main.jsx); where no approved
// copy or image exists, the component shows a visible gap instead of invented content.
import React from "react";
import { createRoot } from "react-dom/client";
import "./fonts.css";
import "./tokens.css";
import "./components.css";
import { Hero, ServiceCard, ArticleCard, Cta, Footer, Logo, Media } from "./components.jsx";

const mail = "mailto:jelassi@smartsvar.no?subject=Uforpliktende%20vurdering%20Cidea%20Marketing";

const services = [
  { service: "branding", label: "Branding", title: "En merkevare folk husker", text: "Visuell identitet og kommunikasjon som gjør bedriften tydeligere og mer gjenkjennelig.", href: "/branding" },
  { service: "nettsider", label: "Nettsider", title: "Nettsider som gjør jobben sin", text: "Vi designer og bygger nettsider som gjør bedriften enklere å forstå, finne og velge.", href: "/websites" },
  { service: "seo", label: "SEO", title: "SEO som bygger synlighet over tid", text: "Vi bygger en søkestrategi rundt spørsmål og behov kundene faktisk har.", href: "/seo" },
  { service: "sosiale-medier", label: "Sosiale medier", title: "Sosiale medier", text: null, href: null },
];

const articles = [
  { slug: "hva-bor-en-god-bedriftsnettside-inneholde", title: "Hva bør en god bedriftsnettside inneholde?", intro: "En god bedriftsnettside skal gjøre det enkelt å forstå hva dere tilbyr, hvorfor dere er relevante og hva kunden bør gjøre videre." },
  { slug: "hvorfor-vises-ikke-nettsiden-pa-google", title: "Hvorfor vises ikke nettsiden på Google?", intro: "Synlighet handler om mer enn å ha en nettside. Struktur, innhold, teknisk SEO og relevans spiller sammen." },
  { slug: "hvor-mye-koster-en-nettside", title: "Hvor mye koster en nettside?", intro: "Prisen bør henge sammen med hva nettsiden skal oppnå. Her er hva som faktisk påvirker kostnaden." },
];

function Preview() {
  return (
    <div className="ds">
      <a className="ds-skip" href="#innhold">Hopp til innhold</a>
      <header className="ds-container" style={{ paddingBlock: "var(--space-5)" }}><Logo /></header>
      <main id="innhold">
        <Hero
          title="Gjør bedriften vanskelig å ignorere."
          lead="Vi bygger merkevarer og digitale opplevelser som gjør det enklere å bli funnet, forstått og valgt."
          primary={{ href: mail, label: "Få en uforpliktende vurdering" }}
          note="Ingen kostnad. Ingen forpliktelser."
          media={<Media ratio="4 / 5" missingLabel="Godkjent heltebilde mangler" />}
        />
        <Hero tone="dark" headingLevel={2}
          title="Det handler ikke om å være overalt. Det handler om å være tydelig."
          lead="En god digital tilstedeværelse har en rød tråd fra første inntrykk til første henvendelse." />

        <section className="ds-section" id="tjenester" aria-labelledby="tjenester-tittel">
          <div className="ds-container">
            <div className="ds-section__head">
              <h2 className="ds-section__title" id="tjenester-tittel">Én digital tilstedeværelse. Mange kontaktpunkter.</h2>
            </div>
            <div className="ds-grid">{services.map(s => <ServiceCard key={s.service} {...s} />)}</div>
          </div>
        </section>

        <section className="ds-section ds-surface-white" aria-labelledby="blogg-tittel">
          <div className="ds-container">
            <div className="ds-section__head">
              <h2 className="ds-section__title" id="blogg-tittel">Vi skriver om ting folk faktisk lurer på.</h2>
            </div>
            <div className="ds-grid">{articles.map(a => <ArticleCard key={a.slug} href={"/blog/" + a.slug} title={a.title} intro={a.intro} />)}</div>
          </div>
        </section>

        <Cta title="Hva skal kunden din se?"
          text="Vi hjelper deg å gjøre det tydeligere hvem dere er, hva dere tilbyr og hvorfor det er verdt å velge dere."
          action={{ href: mail, label: "Få en uforpliktende vurdering →" }} />
      </main>
      <Footer
        columns={[
          { title: "Tjenester", links: [
            { href: "/websites", label: "Nettsider" }, { href: "/branding", label: "Branding" },
            { href: "/seo", label: "SEO" }, { href: "/digital-marketing", label: "Digital markedsføring" } ] },
          { title: "Ressurser", links: [{ href: "/blog", label: "Blogg" }, { href: mail, label: "Få en vurdering" }] },
        ]}
        legal="© 2026 Cidea Marketing" />
    </div>
  );
}

createRoot(document.getElementById("root")).render(<Preview />);
