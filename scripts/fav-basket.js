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
