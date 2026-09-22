import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {schemaTypes,galleryNames} from './schema/index.js';
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
if (!projectId) throw new Error('Preencha SANITY_STUDIO_PROJECT_ID em studio/.env.local.');
export default defineConfig({
  name:'tuca',title:'TUCA — Conteúdo',projectId,dataset:process.env.SANITY_STUDIO_DATASET || 'production',
  plugins:[structureTool({structure:S=>S.list().title('Portfólio').items([
    ...Object.entries(galleryNames).map(([id,title])=>S.listItem().id(id).title(title).child(S.document().schemaType('gallery').documentId(`gallery-${id}`))),
    S.divider(),S.documentTypeListItem('artwork').title('Todas as artes')
  ])})],
  schema:{types:schemaTypes,templates:templates=>templates.filter(t=>t.schemaType !== 'gallery')},
  document:{actions:(actions,ctx)=>ctx.schemaType==='gallery' ? actions.filter(a=>!['delete','duplicate','unpublish'].includes(a.action)) : actions}
});
