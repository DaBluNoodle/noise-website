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
      // If any required marquee element is missing, skip marquee but don't break rest of script
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
    const saleEnd = new Date(2025, 9, 17, 23, 59, 59).getTime();

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

      // Re-measure after text change
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

    // Header hide/show on scroll (non-blocking)
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


// -----------------------------
// FAVORITES + BASKET (Delegated + Robust)
// -----------------------------
(function () {
  // We wrap everything so variables are local
  function initFavoritesAndBasket() {
    const basketCountBadge = document.getElementById("basket-count");
    const favoritesCountBadge = document.getElementById("favorites-count");

    if (!basketCountBadge || !favoritesCountBadge) {
      console.error("Required badges not found: make sure #basket-count and #favorites-count exist in the DOM.");
      return;
    }

    // Utility: safely coerce textContent for badges
    function setBadge(el, n) {
      el.textContent = String(n);
      el.style.display = n > 0 ? "inline-block" : "none";
    }

    // Update counts by scanning the document
    function updateCounts() {
      const favCount = document.querySelectorAll(".hover-buttons .heart.filled").length;
      const basketCount = document.querySelectorAll(".hover-buttons .basket[data-added='true']").length;
      setBadge(favoritesCountBadge, favCount);
      setBadge(basketCountBadge, basketCount);
      console.log(`[counts] favorites=${favCount} basket=${basketCount}`);
    }

    // Initialize: ensure existing basket buttons have data attribute
    function ensureButtonsInitialized() {
      document.querySelectorAll(".hover-buttons .basket").forEach(b => {
        if (!b.hasAttribute("data-added")) b.dataset.added = "false";
      });
    }

    ensureButtonsInitialized();
    updateCounts();

    // Use event delegation for clicks so we don't need per-button listeners
    document.body.addEventListener("click", (event) => {
      // See if a heart or basket button (or something inside them) was clicked
      const heart = event.target.closest(".hover-buttons .heart");
      const basket = event.target.closest(".hover-buttons .basket");

      if (heart) {
        // Prevent parent handlers interfering
        event.stopPropagation();
        // Toggle visual state
        heart.classList.toggle("filled");
        console.log("Heart clicked — toggled filled:", heart.classList.contains("filled"));
        updateCounts();
        return;
      }

      if (basket) {
        event.stopPropagation();
        // Toggle dataset flag
        const currentlyAdded = basket.dataset.added === "true";
        basket.dataset.added = (!currentlyAdded).toString();
        // Update label text (safe, but if you localize, consider using a child <span>)
        basket.textContent = currentlyAdded ? "Add to basket" : "Remove from basket";
        console.log("Basket clicked — now added:", basket.dataset.added);
        updateCounts();
        return;
      }

      // No relevant target found — ignore
    }, { passive: true });

    // Watch for new items added later (optional)
    const observer = new MutationObserver(mutations => {
      let added = false;
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType === 1) {
            if (node.matches && node.matches(".item")) added = true;
            // If someone inserts a container with many items, initialize its basket buttons as well
            node.querySelectorAll && node.querySelectorAll(".hover-buttons .basket").forEach(b => {
              if (!b.hasAttribute("data-added")) b.dataset.added = "false";
            });
          }
        }
      }
      if (added) {
        // If new items added, refresh counts (they should be false by default)
        ensureButtonsInitialized();
        updateCounts();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Expose a small debug API on window for convenience (dev only)
    window.__NOISE_DEBUG = {
      updateCounts,
      ensureButtonsInitialized
    };
  }

  // If DOM already ready, init now; otherwise wait
  if (document.readyState === "complete" || document.readyState === "interactive") {
    initFavoritesAndBasket();
  } else {
    document.addEventListener("DOMContentLoaded", initFavoritesAndBasket);
  }
})();
