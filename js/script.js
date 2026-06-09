/* =========================
   CARROSSEL HORIZONTAL
========================= */

const slides = [
   "assets/images/bg/carrosel_no_leaf_clover1.png",
   "assets/images/bg/carrosel_aberto_bar1.png",
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

  heroTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
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

  carouselInterval = setInterval(() => {
    nextSlide();
  }, slideIntervalTime);
}

function stopCarousel() {
  if (carouselInterval) {
    clearInterval(carouselInterval);
    carouselInterval = null;
  }
}

function restartCarousel() {
  stopCarousel();
  startCarousel();
}

createSlides();
showSlide(0);
startCarousel();

if (previousButton) {
  previousButton.addEventListener("click", () => {
    previousSlide();
    restartCarousel();
  });
}

if (nextButton) {
  nextButton.addEventListener("click", () => {
    nextSlide();
    restartCarousel();
  });
}

if (carousel) {
  carousel.addEventListener("mouseenter", () => {
    stopCarousel();
  });

  carousel.addEventListener("mouseleave", () => {
    startCarousel();
  });
}

/* =========================
   NAVEGAÇÃO INTERNA
========================= */

const sections = document.querySelectorAll(".page-section");
const sectionTriggers = document.querySelectorAll("[data-section]");
const originalWorkGroup = document.querySelector(".original-work-group");
const originalWorkButton = document.querySelector(".nav-link-parent");
const navSubLinks = document.querySelectorAll(".nav-sub-link");
const navMainLinks = document.querySelectorAll(".side-nav > .nav-link");

function clearMenuState() {
  navMainLinks.forEach((link) => {
    link.classList.remove("is-active");
  });

  navSubLinks.forEach((link) => {
    link.classList.remove("is-active");
  });
}

function showSection(sectionId, updateUrl = true) {
  const targetSection = document.getElementById(sectionId);

  if (!targetSection) return;

  sections.forEach((section) => {
    section.classList.remove("active");
  });

  targetSection.classList.add("active");
  targetSection.scrollTop = 0;

  clearMenuState();

  const clickedMainLink = document.querySelector(
    `.side-nav > .nav-link[data-section="${sectionId}"]`
  );

  const clickedSubLink = document.querySelector(
    `.nav-sub-link[data-section="${sectionId}"]`
  );

  const isHome = sectionId === "home";

  if (isHome) {
    if (originalWorkGroup && originalWorkButton) {
      originalWorkGroup.classList.remove("is-open");
      originalWorkButton.setAttribute("aria-expanded", "false");
    }

    startCarousel();
  } else {
    stopCarousel();
  }

  if (clickedMainLink) {
    clickedMainLink.classList.add("is-active");

    if (originalWorkGroup && originalWorkButton) {
      originalWorkGroup.classList.remove("is-open");
      originalWorkButton.setAttribute("aria-expanded", "false");
    }
  }

  if (clickedSubLink) {
    clickedSubLink.classList.add("is-active");

    if (originalWorkGroup && originalWorkButton) {
      originalWorkGroup.classList.add("is-open");
      originalWorkButton.setAttribute("aria-expanded", "true");
    }
  }

  if (updateUrl) {
    if (isHome) {
      history.pushState(null, "", window.location.pathname);
    } else {
      history.pushState(null, "", `#${sectionId}`);
    }
  }
}

/* Clique no logo e links com data-section */
sectionTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    const sectionId = trigger.dataset.section;

    if (!sectionId) return;

    event.preventDefault();
    showSection(sectionId);
  });
});

/* Clique em Original Work: abre/fecha dropdown, mas não troca a home */
if (originalWorkButton && originalWorkGroup) {
  originalWorkButton.addEventListener("click", (event) => {
    event.preventDefault();

    const isOpen = originalWorkGroup.classList.toggle("is-open");
    originalWorkButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

/* Botão voltar/avançar do navegador */
window.addEventListener("popstate", () => {
  const sectionId = window.location.hash.replace("#", "") || "home";
  showSection(sectionId, false);
});

/* Estado inicial pela URL */
const initialSection = window.location.hash.replace("#", "") || "home";
showSection(initialSection, false);