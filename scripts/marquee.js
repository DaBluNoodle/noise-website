// marquee.js
export function initMarquee() {
  const specialDeals = document.getElementById("specialDeals");
  const marqueeContainer = document.getElementById("marqueeContainer");
  const timerElement = document.getElementById("timerInner");

  const saleEnd = new Date(2025, 9, 17, 23, 59, 59).getTime();

  function updateCountdown() {
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
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();
}
