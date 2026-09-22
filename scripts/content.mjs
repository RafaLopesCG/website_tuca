export const sections = ['home', 'illustrations', 'background-design', 'animation-2d', 'sketchbook'];
export const query = `*[_type == "gallery" && _id in $ids]{section, "items": coalesce(items, [])[]{hidden, "art": artwork->{_id, title, alt, kind, legacyPath, "imageUrl": image.asset->url, "fileUrl": video.asset->url, "mimeType": video.asset->mimeType}}}`;

export function safeMediaPath(value) {
  if (typeof value !== 'string') throw new Error('Arquivo de mídia ausente.');
  if (/^assets\/[a-zA-Z0-9_./ -]+$/.test(value) && !value.split('/').includes('..')) return value;
  let url;
  try { url = new URL(value); } catch { throw new Error('Endereço de mídia inválido.'); }
  if (url.protocol !== 'https:' || url.hostname !== 'cdn.sanity.io' || url.username || url.password) {
    throw new Error('A mídia precisa pertencer ao armazenamento do Sanity.');
  }
  return url.href;
}
export function normalize(galleries) {
  if (!Array.isArray(galleries)) throw new Error('Resposta inválida do CMS.');
  const result = {};
  for (const section of sections) {
    const matches = galleries.filter(g => g.section === section);
    if (matches.length !== 1) throw new Error(`Publique exatamente uma galeria para ${section}.`);
    if (!Array.isArray(matches[0].items)) throw new Error(`Lista inválida em ${section}.`);
    result[section] = matches[0].items.filter(i => i && i.hidden !== true).map(({art}) => {
      if (!art) throw new Error(`Uma arte referenciada em ${section} ainda não foi publicada ou foi removida.`);
      if (!['image', 'video'].includes(art.kind)) throw new Error('Tipo de mídia inválido.');
      if (art.kind === 'video' && section !== 'animation-2d') throw new Error(`Vídeos só são permitidos em 2D Animation nesta etapa.`);
      const src = safeMediaPath((art.kind === 'video' ? art.fileUrl : art.imageUrl) || art.legacyPath);
      const alt = (art.alt || art.title || '').trim();
      if (!alt) throw new Error('Preencha a descrição da arte.');
      if (art.kind === 'video' && art.mimeType && !['video/mp4','video/webm','video/ogg'].includes(art.mimeType)) throw new Error('Formato de vídeo não suportado.');
      return {id:art._id, src, alt, kind:art.kind, ...(art.kind === 'video' ? {mimeType:art.mimeType || 'video/mp4'} : {})};
    });
  }
  return result;
}
export function serialize(content) {
  return 'window.TUCA_CONTENT = ' + JSON.stringify(content).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029') + ';\n';
}
