// Checks generated output and source invariants without launching a browser.
import {readFileSync,existsSync,readdirSync,writeFileSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));
const dist=join(root,'dist');
const production=process.argv.includes('--production');
const results=[];
function check(name,ok,detail=''){results.push({name,passed:!!ok,detail});console.log(`${ok?'PASS':'FAIL'} ${name} ${detail}`);}
function files(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]);}
const pages=files(dist).filter(f=>f.endsWith('.html'));
const missing=[];let links=0;
for(const path of pages){
 const html=readFileSync(path,'utf8');
 check(`One H1: ${path.slice(dist.length)}`,(html.match(/<h1\b/g)||[]).length===1);
 if(!production) check(`Review noindex: ${path.slice(dist.length)}`,/<meta[^>]*name="robots"[^>]*content="noindex/.test(html)||/<meta[^>]*content="noindex[^>]*name="robots"/.test(html));
 for(const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)){
  let url=match[1].split('?')[0];if(!url.startsWith('/')||url.startsWith('//'))continue;
  links++;
  const f=join(dist,decodeURIComponent(url));
  if(!existsSync(f)&&!existsSync(join(f,'index.html')))missing.push({from:path.slice(dist.length),url});
 }
}
check('All local links and resources resolve',missing.length===0,JSON.stringify({links,missing}));
const home=readFileSync(join(dist,'index.html'),'utf8');
if(production){check('Homepage indexable',home.includes('index,follow')&&!home.includes('noindex'));check('Prototype stays noindex',readFileSync(join(dist,'konsept-scroll/index.html'),'utf8').includes('noindex'));}
check('No reference brand, people or external destinations in homepage',!/(askdala|dala\.ai|Haroun|Poppy|Seedcamp|googletagmanager|intercom)/i.test(home));
const runtime=readFileSync(join(dist,'cidea-scene/scripts/theme.js'),'utf8');
check('Tracking bootstrap removed',!/(widget\.intercom|window\.Intercom|posthog|googletagmanager)/.test(runtime));
check('Console diagnostics are not suppressed',!runtime.includes('console.error=()=>{}'));
check('Motion attributes parse without unsafe eval',runtime.includes('function ve(e){return JSON.parse(e)}'));
check('Contact receipt remains unconfirmed',readFileSync(join(root,'src/kontakt/Kontakt.jsx'),'utf8').includes('const MOTTAK_BEKREFTET = false'));
const privacy='src/sider/personvern-gullkornet.js';
check('Locked privacy source unchanged',execFileSync('git',['diff','af014772fd990f69581b584d58796c89650ef834','--',privacy],{cwd:root,encoding:'utf8'}).trim()==='');
function luminance(hex){const a=hex.match(/\w\w/g).map(x=>parseInt(x,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*a[0]+.7152*a[1]+.0722*a[2];}
for(const [name,fg,bg] of [['Button','ffffff','0077b6'],['Body','bcc6d2','030812'],['Heading','f5f8fc','030812']]){const a=luminance(fg),b=luminance(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);check(`${name} solid colour contrast`,ratio>=4.5,ratio.toFixed(2)+':1');}
writeFileSync(join(root,production?'docs/dala-rebuild/production-checks.json':'docs/dala-rebuild/static-checks.json'),JSON.stringify(results,null,2));
if(results.some(r=>!r.passed))process.exitCode=1;
