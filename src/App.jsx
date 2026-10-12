import React, { useEffect } from "react";
import { ui } from "./content.js";
import { htmlLang } from "./routes.js";
import { getHead } from "./seo.js";
import { Header, Footer } from "./components/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { Service } from "./pages/Service.jsx";
import { BlogIndex, Article } from "./pages/Journal.jsx";
import { Contact } from "./pages/Contact.jsx";
import { NotFound } from "./pages/NotFound.jsx";

function Page({ route }) {
  const { lang } = route;
  switch (route.page) {
    case "home":
      return <Home lang={lang} />;
    case "service":
      return <Service lang={lang} serviceKey={route.key} />;
    case "blog":
      return <BlogIndex lang={lang} />;
    case "article":
      return <Article lang={lang} slug={route.slug} />;
    case "contact":
      return <Contact lang={lang} />;
    default:
      return <NotFound lang={lang} />;
  }
}

export default function App({ route }) {
  // Prerendered HTML already carries the right <head>; this keeps the dev
  // server (which serves an empty shell) accurate too.
  useEffect(() => {
    document.documentElement.lang = htmlLang[route.lang];
    document.title = getHead(route).title;
  }, [route]);

  return (
    <div className={"site page-" + route.page}>
      <a className="skipLink" href="#main">
        {ui[route.lang].skip}
      </a>
      <Header route={route} />
      <main id="main" tabIndex={-1}>
        <Page route={route} />
      </main>
      <Footer route={route} />
    </div>
  );
}
