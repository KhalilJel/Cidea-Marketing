// Production and review builds share the approved homepage.
import {readFileSync,writeFileSync,mkdirSync,readdirSync,cpSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
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
const html=readFileSync(new URL('../src/reference-home/index.html',import.meta.url),'utf8');
writeFileSync(new URL('../dist/index.html',import.meta.url),production ? html.replace('noindex,nofollow','index,follow') : html);
mkdirSync(new URL('../dist/konsept-scroll/',import.meta.url),{recursive:true});
writeFileSync(new URL('../dist/konsept-scroll/index.html',import.meta.url),html);
console.log(production ? 'Cidea production homepage built.' : 'Cidea review homepage built (noindex).');
