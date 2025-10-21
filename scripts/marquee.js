// -----------------------------
// SALE MARQUEE + HEADER SCROLL
// -----------------------------
(function () {
  function initMarquee() {
    const specialDeals = document.getElementById("specialDeals");
    const marqueeContainer = document.getElementById("marqueeContainer");
    const timerElement = document.getElementById("timerInner");
    const pageHeader = document.querySelector(".page-header");

    if (!specialDeals || !marqueeContainer || !timerElement) {
      console.warn("Marquee init: missing DOM elements; skipping marquee setup.");
      return;
    }

    if (pageHeader) {
      pageHeader.style.position = pageHeader.style.position || "fixed";
      pageHeader.style.left = "0";
      pageHeader.style.right = "0";
      pageHeader.style.transition = "top 300ms ease";
    }

    // Set sale end date (update as needed)
    const saleEnd = new Date(2025, 9, 25, 23, 59, 59).getTime();

    let containerWidth = marqueeContainer.offsetWidth;
    let textWidth = timerElement.offsetWidth;
    let pos = containerWidth;
    const speed = 0.9;

    function updateCountdownAndMeasure() {
      const now = Date.now();
      const distance = saleEnd - now;

      if (distance <= 0) {
        timerElement.textContent = "AUTUMN SALE ENDED";
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        timerElement.textContent = `AUTUMN SALE ENDS ${String(days).padStart(2, "0")}:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      }

      textWidth = Math.ceil(timerElement.offsetWidth);
      containerWidth = Math.ceil(marqueeContainer.offsetWidth);
    }

    updateCountdownAndMeasure();
    setInterval(updateCountdownAndMeasure, 1000);

    function moveLeft() {
      pos -= speed;
      timerElement.style.left = pos + "px";
      if (pos < -textWidth) pos = containerWidth;
      requestAnimationFrame(moveLeft);
    }
    requestAnimationFrame(moveLeft);

    // Header hide/show on scroll
    const barHeight = specialDeals.offsetHeight || 36;
    specialDeals.style.top = "0";
    if (pageHeader) pageHeader.style.top = `${barHeight}px`;

    let lastScroll = window.pageYOffset || 0;
    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset || 0;
      if (currentScroll > lastScroll) {
        specialDeals.style.top = `-${barHeight}px`;
        if (pageHeader) pageHeader.style.top = "0";
      } else {
        if (currentScroll === 0) {
          specialDeals.style.top = "0";
          if (pageHeader) pageHeader.style.top = `${barHeight}px`;
        } else {
          specialDeals.style.top = `-${barHeight}px`;
          if (pageHeader) pageHeader.style.top = "0";
        }
      }
      lastScroll = currentScroll;
    });

    window.addEventListener("resize", () => {
      containerWidth = marqueeContainer.offsetWidth;
      textWidth = timerElement.offsetWidth;
      if (pos > containerWidth) {
        pos = containerWidth;
        timerElement.style.left = pos + "px";
      }
    });
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(initMarquee, 50);
  } else {
    window.addEventListener("load", initMarquee);
  }
})();
