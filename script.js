// document.addEventListener("DOMContentLoaded", () => {
//   const panel = document.getElementById("info-panel");
//   const kickerEl = document.querySelector("[data-panel-kicker]");
//   const titleEl = document.querySelector("[data-panel-title]");
//   const textEl = document.querySelector("[data-panel-text]");
//   const linkEl = document.querySelector("[data-panel-link]");
//   const closeBtn = document.querySelector(".info-panel-close");
//   const triggers = document.querySelectorAll(".panel-trigger");

//   if (!panel || !kickerEl || !titleEl || !textEl || !linkEl || !closeBtn || !triggers.length) {
//     return;
//   }

//   const panelContent = {
//     youtube: {
//       kicker: "*SOCIALS*",
//       title: "YouTube",
//       text: "Aqui podemos futuramente colocar o link oficial do canal, uma pequena descrição do conteúdo e até uma prévia dos vídeos em destaque. Por enquanto, esta seção funciona como espaço temporário para apresentar essa rede.",
//       linkLabel: "",
//       linkHref: ""
//     },
//     linkedin: {
//       kicker: "*SOCIALS*",
//       title: "LinkedIn",
//       text: "Esta área pode receber depois um resumo profissional do artista, experiência, contatos e um botão para o perfil oficial. No momento ela está servindo como conteúdo provisório dentro da própria home.",
//       linkLabel: "",
//       linkHref: ""
//     },
//     behance: {
//       kicker: "*SOCIALS*",
//       title: "Behance",
//       text: "Aqui podemos mostrar depois uma breve introdução dos projetos publicados no Behance, com um botão direto para o portfólio completo. Por enquanto, esta é uma versão temporária usando o painel deslizante.",
//       linkLabel: "",
//       linkHref: ""
//     },
//     artstation: {
//       kicker: "*SOCIALS*",
//       title: "Art Station",
//       text: "Esta seção poderá futuramente destacar trabalhos mais visuais, concept art, ilustrações e coleções publicadas no ArtStation. Por agora, ela aparece aqui como conteúdo placeholder dentro da mesma página.",
//       linkLabel: "",
//       linkHref: ""
//     },
//     projects: {
//       kicker: "*WORK*",
//       title: "Projects",
//       text: "Aqui podemos futuramente abrir uma listagem real de projetos, com thumbnails, categorias e descrições curtas. Nesta primeira versão, o painel serve para ocupar o espaço inferior e já dar mais vida e interatividade ao site.",
//       linkLabel: "",
//       linkHref: ""
//     },
//     "background-design": {
//       kicker: "*WORK*",
//       title: "Background Design",
//       text: "Esta área poderá mostrar futuramente cenários, composições e estudos de ambiente. No momento, estamos usando esse conteúdo provisório para estruturar a navegação sem precisar criar todas as páginas finais agora.",
//       linkLabel: "",
//       linkHref: ""
//     },
//     "frame-by-frame": {
//       kicker: "*WORK*",
//       title: "2D Frame by Frame",
//       text: "Depois podemos transformar esta seção em uma galeria com GIFs, vídeos curtos ou imagens de processo. Por enquanto, ela aparece neste painel com animação de subida para aproveitar melhor o espaço da home.",
//       linkLabel: "",
//       linkHref: ""
//     },
//     rigging: {
//       kicker: "*WORK*",
//       title: "2D Rigging",
//       text: "Aqui você poderá futuramente incluir exemplos de rigging, breakdowns de personagens e pequenos estudos técnicos. Nesta etapa inicial, o conteúdo ainda é temporário, mas a estrutura do painel já fica pronta.",
//       linkLabel: "",
//       linkHref: ""
//     },
//     "character-design": {
//       kicker: "*WORK*",
//       title: "Character Design",
//       text: "Esta seção poderá virar depois uma vitrine com personagens, poses, variações e estudos visuais. Por enquanto, ela utiliza este painel embutido na home, deixando o site mais dinâmico sem exigir páginas separadas agora.",
//       linkLabel: "",
//       linkHref: ""
//     }
//   };

//   function setPanelContent(panelKey) {
//     const content = panelContent[panelKey];

//     if (!content) return;

//     kickerEl.textContent = content.kicker;
//     titleEl.textContent = content.title;
//     textEl.textContent = content.text;

//     if (content.linkLabel && content.linkHref) {
//       linkEl.textContent = content.linkLabel;
//       linkEl.href = content.linkHref;
//       linkEl.hidden = false;
//     } else {
//       linkEl.hidden = true;
//       linkEl.removeAttribute("href");
//       linkEl.textContent = "";
//     }
//   }

//   function openPanel(panelKey) {
//     setPanelContent(panelKey);
//     panel.classList.add("is-open");
//     panel.setAttribute("aria-hidden", "false");

//     setTimeout(() => {
//       panel.scrollIntoView({
//         behavior: "smooth",
//         block: "start"
//       });
//     }, 120);
//   }

//   function closePanel() {
//     panel.classList.remove("is-open");
//     panel.setAttribute("aria-hidden", "true");
//   }

//   triggers.forEach((trigger) => {
//     trigger.addEventListener("click", (event) => {
//       event.preventDefault();
//       const panelKey = trigger.dataset.panel;
//       openPanel(panelKey);
//     });
//   });

//   closeBtn.addEventListener("click", closePanel);

//   document.addEventListener("keydown", (event) => {
//     if (event.key === "Escape" && panel.classList.contains("is-open")) {
//       closePanel();
//     }
//   });
// });


const galleryItems = [
  {
    thumb: "images/thumb-01.jpg",
    full: "images/full-01.jpg",
    alt: "Background design 1"
  },
  {
    thumb: "images/thumb-02.jpg",
    full: "images/full-02.jpg",
    alt: "Background design 2"
  },
  {
    thumb: "images/thumb-03.jpg",
    full: "images/full-03.jpg",
    alt: "Background design 3"
  },
  {
    thumb: "images/thumb-04.gif",
    full: "images/full-04.gif",
    alt: "Background animado"
  }
];

const thumbsTrack = document.getElementById("thumbsTrack");
const mainViewer = document.getElementById("mainViewer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;

function renderThumbnails() {
  thumbsTrack.innerHTML = "";

  galleryItems.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = "thumb";
    if (index === currentIndex) button.classList.add("active");
    button.setAttribute("aria-label", `Abrir item ${index + 1}`);

    const img = document.createElement("img");
    img.src = item.thumb;
    img.alt = item.alt;

    button.appendChild(img);

    button.addEventListener("click", () => {
      currentIndex = index;
      updateViewer();
      updateActiveThumb();
    });

    thumbsTrack.appendChild(button);
  });
}

function updateViewer() {
  const currentItem = galleryItems[currentIndex];
  mainViewer.src = currentItem.full;
  mainViewer.alt = currentItem.alt;
}

function updateActiveThumb() {
  const thumbs = document.querySelectorAll(".thumb");
  thumbs.forEach((thumb, index) => {
    thumb.classList.toggle("active", index === currentIndex);
  });
}

prevBtn.addEventListener("click", () => {
  thumbsTrack.scrollBy({
    left: -220,
    behavior: "smooth"
  });
});

nextBtn.addEventListener("click", () => {
  thumbsTrack.scrollBy({
    left: 220,
    behavior: "smooth"
  });
});

renderThumbnails();
updateViewer();