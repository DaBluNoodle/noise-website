// index.js
import { initSidebar } from './sidebar.js';
import { initBasket } from './basket.js';
import { initItems } from './items.js';
import { initMarquee } from './marquee.js';

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initBasket();
  initItems();
  initMarquee();
});
