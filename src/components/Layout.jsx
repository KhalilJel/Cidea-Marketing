import React, { useEffect, useRef, useState } from "react";
import { services, ui, site } from "../content.js";
import { localize } from "../routes.js";

export function Arrow({ dir = "right" }) {
  const d = { right: "M5 12h14M13 6l6 6-6 6", down: "M12 5v14M6 13l6 6 6-6", left: "M19 12H5M11 6l-6 6 6 6", up: "M7 17 17 7M8 7h9v9" }[dir];
  return (
    <svg className="arrow" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Logo({ lang }) {
  return (
    <a className="logo" href={localize(lang, "/")} aria-label={lang === "en" ? "Cidea Marketing — home" : "Cidea Marketing — forside"}>
      cidea<span>marketing</span>
    </a>
  );
}

function navItems(lang) {
  return [...services.map((s) => ({ href: localize(lang, "/" + s.key), label: s[lang].nav, path: "/" + s.key })), { href: localize(lang, "/blog"), label: ui[lang].journal, path: "/blog" }];
}

function isActive(itemPath, routePath) {
  return routePath === itemPath || (itemPath !== "/" && routePath.startsWith(itemPath + "/"));
}

export function Header({ route }) {
  const { lang } = route;
  const t = ui[lang];
  const other = lang === "en" ? "no" : "en";
  const switchPath = localize(other, route.page === "notfound" ? "/" : route.path);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector("a")?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const items = [toggleRef.current, ...panelRef.current.querySelectorAll("a")];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const onResize = () => window.innerWidth > 980 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const items = navItems(lang);

  return (
    <header className={"siteHeader" + (scrolled ? " isScrolled" : "") + (open ? " menuOpen" : "")}>
      <div className="headerInner">
        <Logo lang={lang} />
        <nav className="desktopNav" aria-label={t.mainNav}>
          {items.map((item) => (
            <a key={item.href} href={item.href} aria-current={isActive(item.path, route.path) ? "page" : undefined}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="headerActions">
          <a className="langSwitch" href={switchPath} hrefLang={other === "en" ? "en" : "nb"} lang={other === "en" ? "en" : "nb"} aria-label={t.langAria}>
            {t.langLabel}
          </a>
          <a className="button primary small headerCta" href={localize(lang, "/contact")}>
            {t.ctaShort}
          </a>
          <button
            ref={toggleRef}
            className="menuToggle"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.closeMenu : t.openMenu}
            onClick={() => setOpen(!open)}
          >
            <span>{open ? t.close : t.menu}</span>
            <i aria-hidden="true" />
          </button>
        </div>
      </div>
      <div id="mobile-menu" className="mobileMenu" ref={panelRef} hidden={!open}>
        <nav aria-label={t.mainNav}>
          {items.map((item) => (
            <a key={item.href} href={item.href} aria-current={isActive(item.path, route.path) ? "page" : undefined} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href={localize(lang, "/contact")} onClick={() => setOpen(false)}>
            {t.contact}
          </a>
        </nav>
        <div className="mobileMenuFoot">
          <a className="button primary" href={localize(lang, "/contact")}>
            {t.cta} <Arrow />
          </a>
          <a className="langSwitch" href={switchPath} hrefLang={other === "en" ? "en" : "nb"} lang={other === "en" ? "en" : "nb"} aria-label={t.langAria}>
            {t.langLabel}
          </a>
        </div>
      </div>
    </header>
  );
}

export function Footer({ route }) {
  const { lang } = route;
  const t = ui[lang];
  const other = lang === "en" ? "no" : "en";
  return (
    <footer className="siteFooter">
      <div className="footerTop">
        <div className="footerBrand">
          <Logo lang={lang} />
          <p>{t.footerTag}</p>
          <a className="footerMail" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
        <nav className="footerCol" aria-label={t.services}>
          <h2>{t.services}</h2>
          {services.map((s) => (
            <a key={s.key} href={localize(lang, "/" + s.key)}>
              {s[lang].nav}
            </a>
          ))}
        </nav>
        <nav className="footerCol" aria-label="Cidea">
          <h2>Cidea</h2>
          <a href={localize(lang, "/blog")}>{t.journal}</a>
          <a href={localize(lang, "/contact")}>{t.contact}</a>
          <a href={localize(other, route.page === "notfound" ? "/" : route.path)} hrefLang={other === "en" ? "en" : "nb"} lang={other === "en" ? "en" : "nb"}>
            {t.langLabel}
          </a>
        </nav>
        <nav className="footerCol" aria-label={t.sisterSites}>
          <h2>{t.sisterSites}</h2>
          <a href="https://cideaconsulting.com/">Cidea Consulting</a>
          <a href="https://cidealeads.com/">Cidea Leads</a>
        </nav>
      </div>
      <div className="footerBottom">
        <span suppressHydrationWarning>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span>{t.location}</span>
      </div>
    </footer>
  );
}
