
const searchIcon = document.querySelector('.right-section svg[aria-label="Search"]');
const searchOverlay = document.getElementById('searchbar-overlay');
const searchInput = document.getElementById('searchInput');
const popularResults = document.getElementById('popularResults');

// Open overlay
searchIcon.addEventListener('click', () => {
  searchOverlay.classList.add('active');
  searchInput.focus();
  popularResults.style.display = 'block';
});

// Close overlay when clicking outside the search container
searchOverlay.addEventListener('click', (e) => {
  if (!e.target.closest('.search-container')) {
    searchOverlay.classList.remove('active');
    setTimeout(() => {
      searchInput.value = '';
      popularResults.style.display = 'none';
    }, 400); // match transition duration
  }
});

// Fill input when clicking popular result
popularResults.querySelectorAll('div').forEach(item => {
  item.addEventListener('click', () => {
    searchInput.value = item.textContent;
    popularResults.style.display = 'none';
  });
});
