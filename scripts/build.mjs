import {readFile, writeFile, cp, mkdir, rm, access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {normalize, query, sections, serialize} from './content.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const projectId = process.env.SANITY_PROJECT_ID?.trim();
const dataset = process.env.SANITY_DATASET?.trim() || 'production';
let content;
if (projectId) {
  if (!/^[a-z0-9]+$/.test(projectId) || !/^[a-z0-9_-]+$/.test(dataset)) throw new Error('Projeto ou dataset inválido.');
  const url = new URL(`https://${projectId}.api.sanity.io/v2025-02-19/data/query/${dataset}`);
  url.searchParams.set('query', query);
  url.searchParams.set('$ids', JSON.stringify(sections.map(s => `gallery-${s}`)));
  url.searchParams.set('perspective', 'published');
  const response = await fetch(url, {signal: AbortSignal.timeout(20000)});
  if (!response.ok) throw new Error(`Falha no CMS (${response.status}). A versão anterior do site deve continuar publicada.`);
  content = normalize((await response.json()).result);
} else {
  content = JSON.parse(await readFile(path.join(root, 'content/initial.json'), 'utf8'));
  console.log('Modo inicial: conteúdo existente; CMS ainda não conectado.');
}
// Only replace the build output after a successful CMS fetch and validation.
await rm(path.join(root, 'dist'), {recursive:true, force:true});
await mkdir(path.join(root, 'dist'), {recursive:true});
await cp(path.join(root, 'site'), path.join(root, 'dist'), {recursive:true});
// Existing repositories can retain their assets/ folder at the project root.
try { await access(path.join(root, 'assets')); await cp(path.join(root,'assets'), path.join(root,'dist/assets'), {recursive:true}); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
await writeFile(path.join(root, 'dist/js/content-data.js'), serialize(content));
console.log(`Build concluído: ${Object.values(content).reduce((n,a)=>n+a.length,0)} inclusões em cinco seções.`);
