// Strukturerte data (schema.org, JSON-LD) for de forhåndsrendrede sidene. Norske sider beholder Organization-blokken
// fra index.html uendret; engelske sider får en engelsk graf. Bare dokumenterte opplysninger (Enhetsregisteret),
// ingen vurderinger, priser eller kunder. Se docs/internasjonal/SEO.md.
import { DOMENE, url } from '../src/i18n.js';

export const organisasjon = {
  '@type': 'Organization', '@id': `${DOMENE}/#organization`, name: 'Cidea Marketing', legalName: 'CIDEA AS',
  url: `${DOMENE}/`, email: 'jelassi@cideamarketing.com', logo: `${DOMENE}/delingsbilde.png`,
  description: 'A creative agency based in Norway working with branding, websites, SEO and social media for clients internationally.',
  address: { '@type': 'PostalAddress', streetAddress: 'Gunnar Schjelderups vei 13A', postalCode: '0485', addressLocality: 'Oslo', addressCountry: 'NO' },
  identifier: { '@type': 'PropertyValue', propertyID: 'Organisasjonsnummer (NO)', value: '927394391' },
  knowsLanguage: ['en', 'no'],
};
const uae = { '@type': 'Country', name: 'United Arab Emirates' };

function smuler(ledd) {
  return { '@type': 'BreadcrumbList', itemListElement: ledd.map(([navn, sti], i) => ({ '@type': 'ListItem', position: i + 1, name: navn, item: url(sti) })) };
}

/** JSON-LD for en engelsk side, eller null for norske sider (de beholder blokken fra index.html). */
export function jsonLdEn(sti, { tittel, beskrivelse, tjeneste, artikkel }) {
  const graf = [organisasjon];
  if (tjeneste) {
    graf.push({ '@type': 'Service', name: tjeneste.navn, serviceType: tjeneste.navn, description: beskrivelse, url: url(sti),
      provider: { '@id': organisasjon['@id'] }, areaServed: [uae, { '@type': 'Place', name: 'Worldwide' }] });
    graf.push(smuler([['Home', '/'], ['Services', '/services'], [tjeneste.navn, sti]]));
  } else if (artikkel) {
    graf.push({ '@type': 'Article', headline: artikkel.tittel, description: beskrivelse, inLanguage: 'en', url: url(sti),
      author: { '@id': organisasjon['@id'] }, publisher: { '@id': organisasjon['@id'] } });
    graf.push(smuler([['Home', '/'], ['Insights', '/insights'], [artikkel.tittel, sti]]));
  } else if (sti === '/dubai') {
    graf.push({ '@type': 'Service', name: 'Branding, websites, SEO and social media for UAE businesses', description: beskrivelse, url: url(sti),
      provider: { '@id': organisasjon['@id'] }, areaServed: uae, availableLanguage: 'en' });
  }
  return { '@context': 'https://schema.org', '@graph': graf };
}

/** For den statiske engelske forsiden. */
export const jsonLdForside = {
  '@context': 'https://schema.org',
  '@graph': [organisasjon, { '@type': 'WebSite', '@id': `${DOMENE}/#website`, url: `${DOMENE}/`, name: 'Cidea Marketing', inLanguage: ['en', 'no'], publisher: { '@id': organisasjon['@id'] } }],
};
