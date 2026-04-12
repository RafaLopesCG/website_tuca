document.addEventListener("DOMContentLoaded", () => {
  const visibleCount = 3;
  const intervalTime = 4000;

  const carouselTrack = document.getElementById("carouselTrack");
  const carouselViewport = document.getElementById("carouselViewport");
  const characterDescription = document.getElementById("characterDescription");

  if (!carouselTrack || !carouselViewport || !characterDescription) return;

  const characterItems = [
    {
      src: "assets/images/characters/juular.png",
      alt: "Character design 1",
      description:
        "*(Exemplo) Ghustav Lino is a character created during a D&D session. A warrior who waves his sledgehammer around, displaying no sign of thinking, only sheer force."
    },
    {
      src: "assets/images/characters/bart.gif",
      alt: "Character design 2",
      description:
        "*Descrição do segundo personagem. Aqui você poderá escrever o texto específico dessa arte."
    },
    {
      src: "assets/images/characters/cc_tuca_shhh.png",
      alt: "Character design 3",
      description:
        "*Descrição do terceiro personagem. Aqui você poderá colocar detalhes de pose, conceito ou personalidade."
    },
    {
      src: "assets/images/characters/zoey.png",
      alt: "Character design 4",
      description:
        "*Descrição do quarto personagem. Esta área muda conforme a imagem ativa no carrossel."
    },
    {
      src: "assets/images/characters/ghustavlino.gif",
      alt: "Character design 5",
      description:
        "*Descrição do quinto personagem."
    },
    {
      src: "assets/images/characters/modelsheet1.png",
      alt: "Character design 6",
      description:
        "*Descrição do sexto personagem."
    }
  ];

  let currentIndex = 0;
  let autoRotate = null;
  let isHovered = false;

  function createPlaceholder(label, width, height) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="100%" height="100%" fill="#cfcfcf"/>
        <rect x="12" y="12" width="${width - 24}" height="${height - 24}" fill="none" stroke="#9c9c9c" stroke-width="3" stroke-dasharray="10 8"/>
        <text
          x="50%"
          y="50%"
          dominant-baseline="middle"
          text-anchor="middle"
          font-family="JetBrains Mono, monospace"
          font-size="26"
          font-weight="700"
          fill="#555555"
        >
          ${label}
        </text>
      </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function getSafeImageSrc(item, index) {
    return item.src || createPlaceholder(`CHAR ${String(index + 1).padStart(2, "0")}`, 900, 700);
  }

  function renderCards() {
    carouselTrack.innerHTML = "";

    characterItems.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "character-card";
      button.dataset.index = index;

      button.innerHTML = `
        <div class="character-card-frame">
          <img src="${getSafeImageSrc(item, index)}" alt="${item.alt}">
        </div>
      `;

      button.addEventListener("click", () => {
        currentIndex = index;
        updateCarousel();
      });

      carouselTrack.appendChild(button);
    });
  }

  function updateDescription() {
    characterDescription.textContent = characterItems[currentIndex].description;
  }

  function updateActiveCard() {
    const cards = carouselTrack.querySelectorAll(".character-card");

    cards.forEach((card, index) => {
      card.classList.toggle("is-active", index === currentIndex);
    });
  }

  function updateTrackPosition() {
    const cards = carouselTrack.querySelectorAll(".character-card");
    if (!cards.length) return;

    const cardWidth = cards[0].offsetWidth;
    const trackStyles = window.getComputedStyle(carouselTrack);
    const gap = parseFloat(trackStyles.gap || 0);

    let startIndex = currentIndex;
    const maxStartDesktop = Math.max(0, characterItems.length - visibleCount);
    const maxStartTablet = Math.max(0, characterItems.length - 2);

    if (window.innerWidth <= 640) {
      startIndex = currentIndex;
    } else if (window.innerWidth <= 980) {
      startIndex = Math.min(currentIndex, maxStartTablet);
    } else {
      startIndex = Math.min(currentIndex, maxStartDesktop);
    }

    const offset = startIndex * (cardWidth + gap);
    carouselTrack.style.transform = `translateX(-${offset}px)`;
  }

  function updateCarousel() {
    updateActiveCard();
    updateDescription();
    updateTrackPosition();
  }

  function goToNext() {
    currentIndex = (currentIndex + 1) % characterItems.length;
    updateCarousel();
  }

  function startAutoRotate() {
    stopAutoRotate();
    autoRotate = setInterval(goToNext, intervalTime);
  }

  function stopAutoRotate() {
    if (autoRotate) {
      clearInterval(autoRotate);
      autoRotate = null;
    }
  }

  carouselViewport.addEventListener("mouseenter", () => {
    isHovered = true;
    stopAutoRotate();
  });

  carouselViewport.addEventListener("mouseleave", () => {
    isHovered = false;
    startAutoRotate();
  });

  window.addEventListener("resize", updateTrackPosition);

  renderCards();
  updateCarousel();

  if (!isHovered) {
    startAutoRotate();
  }
});