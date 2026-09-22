import {defineType, defineField, defineArrayMember} from 'sanity';
export const galleryNames = {home:'Home / carrossel', illustrations:'Illustrations', 'background-design':'Background Design', 'animation-2d':'2D Animation', sketchbook:'Sketchbook'};
const artwork = defineType({
  name:'artwork', title:'Artes', type:'document',
  fields:[
    defineField({name:'title',title:'Nome da arte',type:'string',validation:r=>r.required()}),
    defineField({name:'alt',title:'Descrição da imagem (acessibilidade)',type:'string',validation:r=>r.required()}),
    defineField({name:'kind',title:'Tipo',type:'string',initialValue:'image',options:{list:[{title:'Imagem ou GIF',value:'image'},{title:'Vídeo',value:'video'}],layout:'radio'},validation:r=>r.required()}),
    defineField({name:'image',title:'Imagem / GIF',type:'image',options:{accept:'image/jpeg,image/png,image/webp,image/gif'},hidden:({document})=>document?.kind !== 'image'}),
    defineField({name:'video',title:'Vídeo',type:'file',options:{accept:'video/mp4,video/webm,video/ogg'},hidden:({document})=>document?.kind !== 'video'}),
    defineField({name:'legacyPath',title:'Arquivo original do site',type:'string',readOnly:true,description:'Importado do site atual. Ao enviar um novo arquivo acima, ele passa a ser utilizado.'})
  ],
  validation:r=>r.custom(doc=>{
    if (!doc) return true;
    const media = doc.kind === 'video' ? doc.video : doc.image;
    if (media?.asset?._ref) return true;
    const legacy=doc.legacyPath || '';
    const valid=doc.kind === 'video' ? /\.(mp4|webm|ogg)$/i.test(legacy) : /\.(png|jpe?g|gif|webp)$/i.test(legacy);
    return valid || 'Envie um arquivo correspondente ao tipo escolhido.';
  }),
  preview:{select:{title:'title',media:'image',subtitle:'kind'}}
});
const gallery = defineType({
  name:'gallery',title:'Galeria',type:'document',
  fields:[
    defineField({name:'title',title:'Seção',type:'string',readOnly:true}),
    defineField({name:'section',title:'Identificador',type:'string',readOnly:true,hidden:true,validation:r=>r.required().valid(Object.keys(galleryNames))}),
    defineField({name:'items',title:'Artes na ordem de exibição',type:'array',description:'Arraste para ordenar. Remover daqui não apaga a arte. Publique a galeria após editar.',of:[defineArrayMember({
      name:'placement',title:'Arte na galeria',type:'object',fields:[
        defineField({name:'artwork',title:'Arte',type:'reference',to:[{type:'artwork'}],options:{filter:({document})=>document?.section === 'animation-2d' ? {} : {filter:'kind == "image"'}},validation:r=>r.required()}),
        defineField({name:'hidden',title:'Ocultar desta seção',type:'boolean',initialValue:false})
      ],preview:{select:{title:'artwork.title',media:'artwork.image',hidden:'hidden'},prepare:({title,media,hidden})=>({title:title || 'Escolher arte',media,subtitle:hidden?'Oculta':'Visível'})}
    })]})
  ],preview:{select:{title:'title'}}
});
export const schemaTypes = [artwork,gallery];
