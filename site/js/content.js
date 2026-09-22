/* Cards use exactly the existing gallery classes. No CMS CSS reaches the site. */
(() => {
  const content = window.TUCA_CONTENT;
  if (!content) return;
  for (const section of ['illustrations', 'background-design', 'animation-2d']) {
    const items = content[section];
    const grid = document.querySelector(`#${section} .gallery-grid`);
    if (!grid || !Array.isArray(items)) continue;
    const fragment = document.createDocumentFragment();
    for (const item of items) {
      const figure = document.createElement('figure');
      figure.className = 'gallery-item';
      const link = document.createElement('a');
      link.className = 'gallery-lightbox-link';
      link.href = item.src;
      link.dataset.lightbox = '';
      link.dataset.mediaType = item.kind;
      link.setAttribute('aria-label', `Ampliar ${item.alt}`);
      const media = document.createElement(item.kind === 'video' ? 'video' : 'img');
      if (item.kind === 'video') {
        media.className = 'gallery-media gallery-video';
        media.autoplay = true;
        media.muted = true;
        media.loop = true;
        media.playsInline = true;
        media.preload = 'metadata';
        media.setAttribute('aria-label', item.alt);
        const source = document.createElement('source');
        source.src = item.src;
        source.type = item.mimeType || 'video/mp4';
        media.appendChild(source);
      } else {
        media.className = 'gallery-media';
        media.src = item.src;
        media.alt = item.alt;
        media.loading = 'lazy';
        media.decoding = 'async';
      }
      link.appendChild(media);
      figure.appendChild(link);
      fragment.appendChild(figure);
    }
    if (!items.length) {
      const empty = document.createElement('p');
      empty.textContent = 'Nenhuma arte publicada nesta seção.';
      fragment.appendChild(empty);
    }
    grid.replaceChildren(fragment);
  }
})();
