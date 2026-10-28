// Production and review builds share the approved homepage.
// Internasjonalisering (oktober 2026): den engelske forsiden (src/reference-home/en.html) skrives til dist/index.html
// (/), og den godkjente norske forsiden (src/reference-home/index.html) til dist/no/index.html (/no). Den norske kilden
// endres ikke; kanonisk adresse, hreflang og språkvelger legges inn her ved bygg. /konsept-scroll er uendret.
import {readFileSync,writeFileSync,mkdirSync,readdirSync,cpSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {jsonLdForside} from './strukturerte-data.mjs';
const production=process.argv.includes('--production');
const dist=fileURLToPath(new URL('../dist/',import.meta.url));
cpSync(new URL('../reference-assets/cidea-scene/',import.meta.url),join(dist,'cidea-scene'),{recursive:true});
function stylePages(dir){
  for(const entry of readdirSync(dir,{withFileTypes:true})){
    const path=join(dir,entry.name);
    if(entry.isDirectory()) stylePages(path);
    else if(entry.name.endsWith('.html')){
      let page=readFileSync(path,'utf8');
      page=page.replace('</head>','<link rel="stylesheet" href="/cidea-scene/pages.css"></head>');
      if(!production) page=page.replace(/(<meta name="robots" content=")[^"]*/, '$1noindex,nofollow');
      writeFileSync(path,page);
    }
  }
}
stylePages(dist);
// Erstatter nøyaktig én forekomst; feiler bygget hvis den norske kilden er endret slik at innsettingen ikke treffer.
function once(html,a,b){
  const n=html.split(a).length-1;
  if(n!==1) throw new Error(`reference-home: forventet én forekomst av ${JSON.stringify(a.slice(0,80))}, fant ${n}`);
  return html.replace(a,b);
}
const robots=html=>production ? html.replace('noindex,nofollow','index,follow') : html;
const html=readFileSync(new URL('../src/reference-home/index.html',import.meta.url),'utf8');
const lang=(href,tekst,hl,etikett,klasse)=>`<li class="${klasse}"><a class="nav__link cidea-lang" href="${href}" hreflang="${hl}" lang="${hl}" aria-label="${etikett}">${tekst}</a></li>`;
const alternativer='<link href="https://cideamarketing.com/no" hreflang="no" rel="alternate"/><link href="https://cideamarketing.com/" hreflang="en" rel="alternate"/><link href="https://cideamarketing.com/" hreflang="x-default" rel="alternate"/>';
// Norsk forside på /no: egen kanonisk adresse, hreflang, logo til /no og lenke til engelsk versjon i meny og bunnmeny.
let norsk=once(html,'<link href="https://cideamarketing.com/" rel="canonical"/>',`<link href="https://cideamarketing.com/no" rel="canonical"/>\n${alternativer}`);
norsk=once(norsk,'<meta content="https://cideamarketing.com/" property="og:url"/>','<meta content="https://cideamarketing.com/no" property="og:url"/>');
norsk=once(norsk,'class="cidea-wordmark" href="/"','class="cidea-wordmark" href="/no"');
norsk=once(norsk,'<li class="nav__item"><a class="nav__link" href="/kontakt">Kontakt</a></li>',`<li class="nav__item"><a class="nav__link" href="/kontakt">Kontakt</a></li>${lang('/','English','en','Read in English','nav__item')}`);
const fot=norsk.indexOf('<ul class="footer__nav">'), slutt=norsk.indexOf('</ul>',fot);
if(fot<0||slutt<0) throw new Error('reference-home: fant ikke bunnmenyen i den norske forsiden');
norsk=norsk.slice(0,slutt)+`<li class="footer__nav__item"><a class="footer__nav__link cidea-lang t-16 t-lh-1.2 t-14@xs t-lh-1.4@xs t-16@sm t-lh-1.2@sm -t-ls-0.025 t-600 t-uppercase" href="/" hreflang="en" lang="en" aria-label="Read in English">English</a></li>`+norsk.slice(slutt);
mkdirSync(join(dist,'no'),{recursive:true});
writeFileSync(join(dist,'no/index.html'),robots(norsk));
// Engelsk forside på /.
const engelsk=readFileSync(new URL('../src/reference-home/en.html',import.meta.url),'utf8')
  .replace('@@JSONLD@@',JSON.stringify(jsonLdForside).replace(/</g,'\\u003c'));
writeFileSync(join(dist,'index.html'),robots(engelsk));
mkdirSync(new URL('../dist/konsept-scroll/',import.meta.url),{recursive:true});
writeFileSync(new URL('../dist/konsept-scroll/index.html',import.meta.url),html);
console.log(production ? 'Cidea production homepages built (/ English, /no Norwegian).' : 'Cidea review homepages built (noindex).');
