document.addEventListener("DOMContentLoaded", () => {
  const buttons = Array.from(document.querySelectorAll(".thumb-button"));
  const mainImage = document.getElementById("mainImage");
  const mainVideo = document.getElementById("mainVideo");
  const track = document.getElementById("thumbTrack");
  const viewport = document.querySelector(".thumb-viewport");

  if (!buttons.length || !mainImage || !mainVideo || !track || !viewport) return;

  const visibleCount = 4;
  const intervalTime = 2000;
  let currentSlideIndex = 0;
  let autoRotate = null;

  function getStepSize() {
    const firstButton = buttons[0];
    if (!firstButton) return 0;

    const trackStyles = window.getComputedStyle(track);
    const gap = parseFloat(trackStyles.rowGap || trackStyles.gap || 0);
    return firstButton.offsetHeight + gap;
  }

  function getMaxIndex() {
    return Math.max(0, buttons.length - visibleCount);
  }

  function updateTrackPosition() {
    const step = getStepSize();
    track.style.transform = `translateY(-${currentSlideIndex * step}px)`;
  }

  function resetMainVideo() {
    mainVideo.pause();
    mainVideo.removeAttribute("src");
    mainVideo.load();
  }

  function showImage(src, altText) {
    resetMainVideo();
    mainVideo.hidden = true;

    mainImage.hidden = false;
    mainImage.src = src;
    mainImage.alt = altText;
  }

  function showVideo(src, altText) {
    mainImage.hidden = true;
    mainImage.removeAttribute("src");
    mainImage.alt = "";

    mainVideo.hidden = false;
    mainVideo.src = src;
    mainVideo.setAttribute("aria-label", altText);
    mainVideo.load();

    const playPromise = mainVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }

  function setMainMedia(button) {
    const fullMedia = button.dataset.full;
    const altText = button.dataset.alt || "Mídia da galeria";
    const mediaType = button.dataset.type || "image";

    if (!fullMedia) return;

    if (mediaType === "video") {
      showVideo(fullMedia, altText);
    } else {
      showImage(fullMedia, altText);
    }

    buttons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
  }

  function goToNextSlide() {
    const maxIndex = getMaxIndex();

    if (maxIndex <= 0) return;

    if (currentSlideIndex >= maxIndex) {
      currentSlideIndex = 0;
    } else {
      currentSlideIndex += 1;
    }

    updateTrackPosition();
  }

  function startAutoRotate() {
    stopAutoRotate();

    if (buttons.length <= visibleCount) return;

    autoRotate = setInterval(goToNextSlide, intervalTime);
  }

  function stopAutoRotate() {
    if (autoRotate) {
      clearInterval(autoRotate);
      autoRotate = null;
    }
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      setMainMedia(button);

      const maxIndex = getMaxIndex();

      if (index < currentSlideIndex) {
        currentSlideIndex = index;
      } else if (index > currentSlideIndex + (visibleCount - 1)) {
        currentSlideIndex = Math.min(index - (visibleCount - 1), maxIndex);
      }

      updateTrackPosition();
    });
  });

  viewport.addEventListener("mouseenter", stopAutoRotate);
  viewport.addEventListener("mouseleave", startAutoRotate);

  window.addEventListener("resize", updateTrackPosition);

  const activeButton = document.querySelector(".thumb-button.is-active") || buttons[0];
  if (activeButton) {
    setMainMedia(activeButton);
  }

  updateTrackPosition();
  startAutoRotate();
});