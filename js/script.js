/* =========================
   CARROSSEL HORIZONTAL
========================= */

const slides = [
  "assets/images/bg/nlc2.png",
  "assets/images/bg/carrossel_face.png",
  "assets/images/bg/carrosel_estabelecendo_escritorio.png",
  "assets/images/bg/carrosel_mercado_open.png",
  "assets/images/bg/carrosel_montanhas.png",
  "assets/images/bg/carrosel_previa_aberto_predios.png",
  "assets/images/bg/carrosel_sala_chefe.png",
  "assets/images/bg/carrosel_previa_transicao_cidade.png",
  "assets/images/bg/carrosel_preto_branco.png",
];

let currentSlide = 0;
let carouselInterval = null;

const carousel = document.querySelector(".carousel");
const heroTrack = document.querySelector(".hero-track");
const previousButton = document.querySelector(".hero-arrow-left");
const nextButton = document.querySelector(".hero-arrow-right");

const slideIntervalTime = 3000;

function createSlides() {
  if (!heroTrack || slides.length === 0) return;

  heroTrack.innerHTML = "";

  slides.forEach((slideSrc, index) => {
    const image = document.createElement("img");

    image.classList.add("hero-slide");
    image.src = slideSrc;
    image.alt = `Imagem ${index + 1} do carrossel`;

    heroTrack.appendChild(image);
  });
}

function showSlide(index) {
  if (!heroTrack || slides.length === 0) return;

  currentSlide = (index + slides.length) % slides.length;

  heroTrack.style.transform =
    `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function previousSlide() {
  showSlide(currentSlide - 1);
}

function startCarousel() {
  if (slides.length <= 1) return;

  stopCarousel();

  carouselInterval = setInterval(
    nextSlide,
    slideIntervalTime
  );
}

function stopCarousel() {
  if (!carouselInterval) return;

  clearInterval(carouselInterval);
  carouselInterval = null;
}

function restartCarousel() {
  stopCarousel();
  startCarousel();
}

createSlides();
showSlide(0);
startCarousel();

previousButton?.addEventListener("click", () => {
  previousSlide();
  restartCarousel();
});

nextButton?.addEventListener("click", () => {
  nextSlide();
  restartCarousel();
});

carousel?.addEventListener(
  "mouseenter",
  stopCarousel
);

carousel?.addEventListener(
  "mouseleave",
  startCarousel
);

/* =========================
   NAVEGAÇÃO INTERNA
========================= */

const sections = document.querySelectorAll(
  ".page-section"
);

const sectionTriggers = document.querySelectorAll(
  "[data-section]"
);

const originalWorkGroup = document.querySelector(
  ".original-work-group"
);

const originalWorkButton = document.querySelector(
  ".nav-link-parent"
);

const navSubLinks = document.querySelectorAll(
  ".nav-sub-link"
);

const navMainLinks = document.querySelectorAll(
  ".side-nav > .nav-link"
);

const sectionParentMap = {
  "zoey-detail": "character-design",
};

function clearMenuState() {
  navMainLinks.forEach((link) => {
    link.classList.remove("is-active");
  });

  navSubLinks.forEach((link) => {
    link.classList.remove("is-active");
  });
}

function openOriginalWorkMenu() {
  if (!originalWorkGroup || !originalWorkButton) return;

  originalWorkGroup.classList.add("is-open");

  originalWorkButton.setAttribute(
    "aria-expanded",
    "true"
  );
}

function closeOriginalWorkMenu() {
  if (!originalWorkGroup || !originalWorkButton) return;

  originalWorkGroup.classList.remove("is-open");

  originalWorkButton.setAttribute(
    "aria-expanded",
    "false"
  );
}

function showSection(sectionId, updateUrl = true) {
  const targetSection =
    document.getElementById(sectionId);

  if (!targetSection) return;

  closeLightbox();

  sections.forEach((section) => {
    section.classList.remove("active");
  });

  targetSection.classList.add("active");
  targetSection.scrollTop = 0;

  clearMenuState();

  const clickedMainLink =
    document.querySelector(
      `.side-nav > .nav-link[data-section="${sectionId}"]`
    );

  const clickedSubLink =
    document.querySelector(
      `.nav-sub-link[data-section="${sectionId}"]`
    );

  const parentSectionId =
    sectionParentMap[sectionId];

  const parentSubLink =
    parentSectionId
      ? document.querySelector(
          `.nav-sub-link[data-section="${parentSectionId}"]`
        )
      : null;

  const isHome = sectionId === "home";

  if (isHome) {
    closeOriginalWorkMenu();
    startCarousel();
  } else {
    stopCarousel();
  }

  if (clickedMainLink) {
    clickedMainLink.classList.add(
      "is-active"
    );

    closeOriginalWorkMenu();
  }

  if (clickedSubLink) {
    clickedSubLink.classList.add(
      "is-active"
    );

    openOriginalWorkMenu();
  }

  if (parentSubLink) {
    parentSubLink.classList.add(
      "is-active"
    );

    openOriginalWorkMenu();
  }

  if (!updateUrl) return;

  if (isHome) {
    history.pushState(
      null,
      "",
      window.location.pathname
    );
  } else {
    history.pushState(
      null,
      "",
      `#${sectionId}`
    );
  }
}

sectionTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    const sectionId = trigger.dataset.section;

    if (!sectionId) return;

    event.preventDefault();
    showSection(sectionId);
  });
});

if (originalWorkButton && originalWorkGroup) {
  originalWorkButton.addEventListener(
    "click",
    (event) => {
      event.preventDefault();

      const isOpen =
        originalWorkGroup.classList.toggle(
          "is-open"
        );

      originalWorkButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    }
  );
}

window.addEventListener("popstate", () => {
  const sectionId =
    window.location.hash.replace("#", "") ||
    "home";

  showSection(sectionId, false);
});

/* =========================
   LIGHTBOX / MÍDIA AMPLIADA
========================= */

const lightbox = document.getElementById(
  "image-lightbox"
);

const lightboxImage = document.querySelector(
  ".image-lightbox-image"
);

const lightboxVideo = document.querySelector(
  ".image-lightbox-video"
);

const lightboxContent = document.querySelector(
  ".image-lightbox-content"
);

const lightboxCloseButton = document.querySelector(
  "[data-lightbox-close]"
);

const boundLightboxTriggers = new WeakSet();

let lastFocusedElement = null;

function getMediaType(trigger, mediaSrc) {
  const declaredType =
    trigger.dataset.mediaType;

  if (
    declaredType === "video" ||
    declaredType === "image"
  ) {
    return declaredType;
  }

  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(
    mediaSrc
  )
    ? "video"
    : "image";
}

function resetLightboxMedia() {
  if (lightboxImage) {
    lightboxImage.classList.remove(
      "is-active-media"
    );

    lightboxImage.removeAttribute("src");
    lightboxImage.alt = "";
  }

  if (lightboxVideo) {
    lightboxVideo.pause();

    lightboxVideo.classList.remove(
      "is-active-media"
    );

    lightboxVideo.removeAttribute("src");

    lightboxVideo.removeAttribute(
      "aria-label"
    );

    lightboxVideo.load();
  }
}

function openLightbox(trigger) {
  if (!lightbox) return;

  const previewImage =
    trigger.querySelector("img");

  const previewVideo =
    trigger.querySelector("video");

  const mediaSrc =
    trigger.getAttribute("href") ||
    previewImage?.currentSrc ||
    previewImage?.src ||
    previewVideo?.currentSrc ||
    previewVideo?.querySelector("source")?.src;

  if (!mediaSrc) return;

  const mediaType = getMediaType(
    trigger,
    mediaSrc
  );

  const mediaLabel =
    previewImage?.alt ||
    previewVideo?.getAttribute("aria-label") ||
    trigger.getAttribute("aria-label") ||
    "Mídia ampliada";

  lastFocusedElement =
    document.activeElement;

  resetLightboxMedia();

  if (
    mediaType === "video" &&
    lightboxVideo
  ) {
    lightboxVideo.src = mediaSrc;

    lightboxVideo.setAttribute(
      "aria-label",
      mediaLabel
    );

    lightboxVideo.classList.add(
      "is-active-media"
    );

    lightboxVideo.load();

    const playPromise =
      lightboxVideo.play();

    if (playPromise instanceof Promise) {
      playPromise.catch(() => {
        /*
          O navegador pode bloquear o autoplay.
          Os controles continuam disponíveis.
        */
      });
    }
  } else if (lightboxImage) {
    lightboxImage.src = mediaSrc;
    lightboxImage.alt = mediaLabel;

    lightboxImage.classList.add(
      "is-active-media"
    );
  }

  lightbox.classList.add("is-open");

  lightbox.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "lightbox-open"
  );

  lightboxCloseButton?.focus();
}

function closeLightbox() {
  if (
    !lightbox ||
    !lightbox.classList.contains("is-open")
  ) {
    return;
  }

  lightbox.classList.remove("is-open");

  lightbox.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "lightbox-open"
  );

  resetLightboxMedia();

  if (
    lastFocusedElement instanceof HTMLElement
  ) {
    lastFocusedElement.focus();
  }

  lastFocusedElement = null;
}

function bindLightboxTrigger(trigger) {
  if (
    !trigger ||
    boundLightboxTriggers.has(trigger)
  ) {
    return;
  }

  trigger.setAttribute(
    "aria-haspopup",
    "dialog"
  );

  trigger.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      openLightbox(trigger);
    }
  );

  boundLightboxTriggers.add(trigger);
}

document
  .querySelectorAll("[data-lightbox]")
  .forEach(bindLightboxTrigger);

/* =========================
   SKETCHBOOK / PAGINAÇÃO
========================= */

const sketchbookImages = Array.from(
  { length: 23 },
  (_, index) =>
    `assets/images/sketchbook/sb${index + 1}.jpg`
);

const sketchbookItemsPerPage = 8;

const sketchbookTotalPages = Math.ceil(
  sketchbookImages.length /
    sketchbookItemsPerPage
);

let sketchbookCurrentPage = 1;
let sketchbookIsChangingPage = false;

const sketchbookSection =
  document.getElementById("sketchbook");

const sketchbookGrid =
  document.getElementById(
    "sketchbook-grid"
  );

const sketchbookPreviousButton =
  document.getElementById(
    "sketchbook-previous"
  );

const sketchbookNextButton =
  document.getElementById(
    "sketchbook-next"
  );

const sketchbookCurrentPageLabel =
  document.getElementById(
    "sketchbook-current-page"
  );

const sketchbookTotalPagesLabel =
  document.getElementById(
    "sketchbook-total-pages"
  );

function createSketchbookItem(
  imageSrc,
  imageNumber
) {
  const figure =
    document.createElement("figure");

  const link =
    document.createElement("a");

  const image =
    document.createElement("img");

  figure.className = "gallery-item";

  link.className =
    "gallery-lightbox-link";

  link.href = imageSrc;
  link.dataset.lightbox = "";
  link.dataset.mediaType = "image";

  link.setAttribute(
    "aria-label",
    `Ampliar Sketchbook ${imageNumber}`
  );

  image.className = "gallery-media";
  image.src = imageSrc;
  image.alt = `Sketchbook ${imageNumber}`;
  image.loading = "lazy";
  image.decoding = "async";

  link.appendChild(image);
  figure.appendChild(link);

  bindLightboxTrigger(link);

  return figure;
}

function updateSketchbookPagination() {
  if (sketchbookCurrentPageLabel) {
    sketchbookCurrentPageLabel.textContent =
      String(sketchbookCurrentPage);
  }

  if (sketchbookTotalPagesLabel) {
    sketchbookTotalPagesLabel.textContent =
      String(sketchbookTotalPages);
  }

  if (sketchbookPreviousButton) {
    sketchbookPreviousButton.disabled =
      sketchbookCurrentPage === 1;
  }

  if (sketchbookNextButton) {
    sketchbookNextButton.disabled =
      sketchbookCurrentPage ===
      sketchbookTotalPages;
  }
}

function renderSketchbookPage(pageNumber) {
  if (!sketchbookGrid) return;

  sketchbookCurrentPage = Math.min(
    Math.max(pageNumber, 1),
    sketchbookTotalPages
  );

  const firstImageIndex =
    (sketchbookCurrentPage - 1) *
    sketchbookItemsPerPage;

  const currentPageImages =
    sketchbookImages.slice(
      firstImageIndex,
      firstImageIndex +
        sketchbookItemsPerPage
    );

  const fragment =
    document.createDocumentFragment();

  currentPageImages.forEach(
    (imageSrc, index) => {
      const imageNumber =
        firstImageIndex + index + 1;

      fragment.appendChild(
        createSketchbookItem(
          imageSrc,
          imageNumber
        )
      );
    }
  );

  sketchbookGrid.replaceChildren(
    fragment
  );

  updateSketchbookPagination();
}

function changeSketchbookPage(nextPage) {
  if (
    !sketchbookGrid ||
    sketchbookIsChangingPage ||
    nextPage < 1 ||
    nextPage > sketchbookTotalPages ||
    nextPage === sketchbookCurrentPage
  ) {
    return;
  }

  sketchbookIsChangingPage = true;

  sketchbookGrid.classList.add(
    "is-changing"
  );

  window.setTimeout(() => {
    renderSketchbookPage(nextPage);

    sketchbookGrid.classList.remove(
      "is-changing"
    );

    sketchbookIsChangingPage = false;

    sketchbookSection?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 150);
}

sketchbookPreviousButton?.addEventListener(
  "click",
  () => {
    changeSketchbookPage(
      sketchbookCurrentPage - 1
    );
  }
);

sketchbookNextButton?.addEventListener(
  "click",
  () => {
    changeSketchbookPage(
      sketchbookCurrentPage + 1
    );
  }
);

renderSketchbookPage(1);

/* =========================
   FECHAMENTO DO LIGHTBOX
========================= */

lightboxCloseButton?.addEventListener(
  "click",
  closeLightbox
);

lightbox?.addEventListener(
  "click",
  (event) => {
    const clickedBackdrop =
      event.target === lightbox ||
      event.target === lightboxContent;

    if (clickedBackdrop) {
      closeLightbox();
    }
  }
);

window.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  }
);

/* =========================
   ESTADO INICIAL
========================= */

const initialSection =
  window.location.hash.replace("#", "") ||
  "home";

showSection(initialSection, false);