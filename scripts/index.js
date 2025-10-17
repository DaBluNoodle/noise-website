(function() {
  // Run after layout/fonts loaded
  function initMarquee() {
    const specialDeals = document.getElementById("specialDeals");
    const marqueeContainer = document.getElementById("marqueeContainer");
    const timerElement = document.getElementById("timerInner");
    const pageHeader = document.querySelector(".page-header");

    // Make sure header is fixed so top changes move it
    if (pageHeader) {
      pageHeader.style.position = pageHeader.style.position || 'fixed';
      pageHeader.style.left = '0';
      pageHeader.style.right = '0';
      pageHeader.style.transition = 'top 300ms ease';
    }

    // Use exact sale end date (update if needed)
    const saleEnd = new Date(2025, 9, 17, 23, 59, 59).getTime();

    // countdown update AND update measured width whenever text changes
    function updateCountdownAndMeasure() {
      const now = Date.now();
      let distance = saleEnd - now;

      if (distance <= 0) {
        timerElement.textContent = "AUTUMN SALE ENDED";
      } else {
        const days = Math.floor(distance / (1000*60*60*24));
        const hours = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
        const minutes = Math.floor((distance % (1000*60*60)) / (1000*60));
        const seconds = Math.floor((distance % (1000*60)) / 1000);
        timerElement.textContent = `AUTUMN SALE ENDS ${String(days).padStart(2,'0')}:${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
      }

      // measure after content set
      textWidth = Math.ceil(timerElement.offsetWidth);
      containerWidth = Math.ceil(marqueeContainer.offsetWidth);
    }

    // initial measurements
    let containerWidth = marqueeContainer.offsetWidth;
    let textWidth = timerElement.offsetWidth;

    // start with timer off-screen to the right (in pixels)
    let pos = containerWidth;
    timerElement.style.left = pos + "px";

    // keep countdown accurate and re-measure widths when it changes
    updateCountdownAndMeasure();
    const countdown = setInterval(updateCountdownAndMeasure, 1000);

    // animation loop
    const speed = 0.9; // pixels per frame — increase for faster
    function moveLeft() {
      pos -= speed;
      timerElement.style.left = pos + "px";

      // reset only after fully left the container
      if (pos < -textWidth) {
        pos = containerWidth;
      }
      requestAnimationFrame(moveLeft);
    }
    requestAnimationFrame(moveLeft);

    // Hide/show header + bar on scroll
    const barHeight = specialDeals.offsetHeight || 36;
    // set initial positions
    specialDeals.style.top = "0";
    if (pageHeader) pageHeader.style.top = `${barHeight}px`;

    let lastScroll = window.pageYOffset || 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset || 0;
      if (currentScroll > lastScroll) {
        // scrolling down — hide bar
        specialDeals.style.top = `-${barHeight}px`;
        if (pageHeader) pageHeader.style.top = "0";
      } else {
        // scrolling up — show bar only at top
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

    // adjust on resize so it remains smooth
    window.addEventListener('resize', () => {
      containerWidth = marqueeContainer.offsetWidth;
      textWidth = timerElement.offsetWidth;
      // if text currently off-screen, snap it to new container width so it doesn't disappear
      if (pos > containerWidth) {
        pos = containerWidth;
        timerElement.style.left = pos + 'px';
      }
    });
  }

  // Wait for DOM + fonts to be applied so offsets are correct
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // small delay helps fonts to load so measurements are correct
    setTimeout(initMarquee, 50);
  } else {
    window.addEventListener('load', initMarquee);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.item');

  // --- Hover / pointer animations ---
  items.forEach(item => {
    const hoverButtons = item.querySelector('.hover-buttons');

    const showButtons = () => hoverButtons.classList.add('visible');
    const hideButtons = () => hoverButtons.classList.remove('visible');

    // Show immediately on touch or mouse hover
    item.addEventListener('pointerenter', showButtons); // desktop hover
    item.addEventListener('pointerdown', showButtons);  // mobile touch start

    // Hide when pointer leaves or ends
    item.addEventListener('pointerup', hideButtons);    
    item.addEventListener('pointerleave', hideButtons); 
    item.addEventListener('pointercancel', hideButtons);
  });

  // --- Favorites logic ---
  const hearts = document.querySelectorAll('.hover-buttons .heart');
  const favoritesCountBadge = document.getElementById('favorites-count');

  function updateFavorites() {
    const totalFavorites = document.querySelectorAll('.hover-buttons .heart.filled').length;
    favoritesCountBadge.textContent = totalFavorites;
    favoritesCountBadge.style.display = totalFavorites > 0 ? 'inline-block' : 'none';
  }

  hearts.forEach(heart => {
    heart.addEventListener('click', () => {
      heart.classList.toggle('filled');
      updateFavorites();
    });
  });

  // --- Basket logic ---
  const baskets = document.querySelectorAll('.hover-buttons .basket');
  const basketCountBadge = document.getElementById('basket-count');

  function updateBasket() {
    const totalInBasket = Array.from(baskets).filter(b => b.textContent === 'Remove from basket').length;
    basketCountBadge.textContent = totalInBasket;
    basketCountBadge.style.display = totalInBasket > 0 ? 'inline-block' : 'none';
  }

  baskets.forEach(basket => {
    basket.addEventListener('click', () => {
      if (basket.textContent === 'Add to basket') {
        basket.textContent = 'Remove from basket';
      } else {
        basket.textContent = 'Add to basket';
      }
      updateBasket();
    });
  });

  // Initialize badges on page load
  updateFavorites();
  updateBasket();

  // --- Optional: click animation for mobile slideshow ---
  items.forEach(item => {
    item.addEventListener('click', () => {
      if (!item.classList.contains('animate')) {
        item.classList.add('animate');
        setTimeout(() => item.classList.remove('animate'), 6000); // match CSS duration
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.item');
  let activeItem = null; // currently "hovered" or touched item

  items.forEach(item => {
    const hoverButtons = item.querySelector('.hover-buttons');

    const showButtons = () => hoverButtons.classList.add('visible');
    const hideButtons = () => hoverButtons.classList.remove('visible');

    // Desktop hover
    item.addEventListener('mouseenter', () => {
      if (activeItem !== item) showButtons();
    });
    item.addEventListener('mouseleave', () => {
      if (activeItem !== item) hideButtons();
    });

    // Touch / mobile
    item.addEventListener('pointerdown', () => {
      // Hide buttons on previous active item
      if (activeItem && activeItem !== item) {
        activeItem.querySelector('.hover-buttons').classList.remove('visible');
      }

      // Set this as active and show buttons
      activeItem = item;
      showButtons();
    });
  });
});