/* =========================
   CARROSSEL HORIZONTAL
========================= */

const slides = [
   "assets/images/carrosel_no_leaf_clover1.png",
   "assets/images/carrosel_aberto_bar1.png",
   "assets/images/carrosel_estabelecendo_escritorio.png",
   "assets/images/carrosel_mercado_open.png",
   "assets/images/carrosel_montanhas.png",
   "assets/images/carrosel_previa_aberto_predios.png",
   "assets/images/carrosel_sala_chefe.png",
   "assets/images/carrosel_previa_transicao_cidade.png",
   "assets/images/carrosel_preto_branco.png",
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
   DROPDOWN ORIGINAL WORK
========================= */

const originalWorkGroup = document.querySelector(".original-work-group");
const originalWorkButton = document.querySelector(".nav-link-parent");
const navSubLinks = document.querySelectorAll(".nav-sub-link");
const mainNavLinks = document.querySelectorAll(".side-nav > .nav-link");

if (originalWorkButton && originalWorkGroup) {
  originalWorkButton.addEventListener("click", (event) => {
    event.preventDefault();

    const isOpen = originalWorkGroup.classList.toggle("is-open");
    originalWorkButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

navSubLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navSubLinks.forEach((item) => item.classList.remove("is-active"));
    link.classList.add("is-active");

    if (originalWorkGroup && originalWorkButton) {
      originalWorkGroup.classList.add("is-open");
      originalWorkButton.setAttribute("aria-expanded", "true");
    }
  });
});

mainNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (originalWorkGroup && originalWorkButton) {
      originalWorkGroup.classList.remove("is-open");
      originalWorkButton.setAttribute("aria-expanded", "false");
    }

    navSubLinks.forEach((item) => item.classList.remove("is-active"));
  });
});