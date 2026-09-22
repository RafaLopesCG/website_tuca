import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {normalize, serialize, sections, safeMediaPath} from '../scripts/content.mjs';
const initial=JSON.parse(await readFile(new URL('../content/initial.json',import.meta.url)));
function fixture(){return sections.map(section=>({section,items:initial[section].map(a=>({hidden:false,art:{_id:a.id,kind:a.kind,alt:a.alt,legacyPath:a.src}}))}));}
test('import preserves every placement and ordering',()=>{const out=normalize(fixture());for(const s of sections) assert.deepEqual(out[s].map(x=>x.src),initial[s].map(x=>x.src));});
test('order and hidden placements are independent of shared files',()=>{const f=fixture();f[0].items.reverse();f[0].items[1].hidden=true;const out=normalize(f);assert.equal(out.home.length,8);assert.equal(out.home[0].src,initial.home.at(-1).src);assert.equal(out['background-design'].length,12);});
test('empty remains empty',()=>{const f=fixture();f[4].items=[];assert.deepEqual(normalize(f).sketchbook,[]);});
test('missing references and galleries stop publication',()=>{const f=fixture();f[0].items[0].art=null;assert.throws(()=>normalize(f),/referenciada/);assert.throws(()=>normalize([]),/galeria/);});
test('uploads override legacy files',()=>{const f=fixture();f[0].items[0].art.imageUrl='https://cdn.sanity.io/images/test/production/test.png';assert.match(normalize(f).home[0].src,/cdn.sanity.io/);});
test('videos restricted to animation',()=>{const f=fixture();f[0].items[0].art.kind='video';assert.throws(()=>normalize(f),/Vídeos/);});
test('unsafe URLs and markup rejected',()=>{for(const u of ['javascript:alert(1)','data:text/html,x','assets/../secret','https://evil.example/x','https://cdn.sanity.io.evil.example/x']) assert.throws(()=>safeMediaPath(u));assert.ok(!serialize({alt:'</script><script>alert(1)</script>'}).includes('<'));});
test('seed references exist and IDs are unique',async()=>{const docs=(await readFile(new URL('../content/import.ndjson',import.meta.url),'utf8')).trim().split('\n').map(JSON.parse);const ids=new Set(docs.map(x=>x._id));assert.equal(ids.size,docs.length);for(const g of docs.filter(x=>x._type==='gallery')) for(const p of g.items) assert.ok(ids.has(p.artwork._ref));});
