// Register Service Worker for Offline Functionality
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Backdrop Service Worker Registered'))
    .catch(err => console.error('SW Registration Failed', err));
}

// 3 Pre-uploaded Minimal Wallpapers
const wallpapers = [
  {
    id: 1,
    title: "Monochrome Steps",
    category: "minimal",
    url: "https://i.pinimg.com/1200x/ce/a7/50/cea750cd3f8310e3e09fad6a91ad9de8.jpg"
  },
  {
    id: 2,
    title: "Granular Flow",
    category: "minimal",
    url: "https://i.pinimg.com/736x/fa/ae/79/faae79d6628bbbdd9b2894eec2b8f03f.jpg"
  },
  {
    id: 3,
    title: "Dark Dunes",
    category: "minimal",
    url: "https://i.pinimg.com/736x/3b/40/1f/3b401f7783072ea2e41234ca3adce9c0.jpg"
  }
];

// DOM Elements
const grid = document.getElementById('wallpaper-grid');
const categoriesNav = document.getElementById('categories-nav');
const themeToggle = document.getElementById('theme-toggle');
const modal = document.getElementById('preview-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalCategory = document.getElementById('modal-category');
const closeModal = document.getElementById('close-modal');
const downloadBtn = document.getElementById('download-btn');

let activeWallpaper = null;

// Render Wallpaper Cards
function renderWallpapers(category = 'all') {
  grid.innerHTML = '';
  const filtered = category === 'all' 
    ? wallpapers 
    : wallpapers.filter(w => w.category === category);

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'wallpaper-card';
    card.innerHTML = `<img src="${item.url}" alt="${item.title}" loading="lazy">`;
    card.addEventListener('click', () => openModal(item));
    grid.appendChild(card);
  });
}

// Category Filter Handling
categoriesNav.addEventListener('click', (e) => {
  if (e.target.classList.contains('cat-btn')) {
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    renderWallpapers(e.target.dataset.category);
  }
});

// Modal Preview
function openModal(item) {
  activeWallpaper = item;
  modalImg.src = item.url;
  modalTitle.textContent = item.title;
  modalCategory.textContent = item.category;
  modal.classList.remove('hidden');
}

closeModal.addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.add('hidden');
});

// Download Function
downloadBtn.addEventListener('click', async () => {
  if (!activeWallpaper) return;
  try {
    const response = await fetch(activeWallpaper.url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${activeWallpaper.title.toLowerCase().replace(/\s+/g, '-')}-wallpaper.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    window.open(activeWallpaper.url, '_blank');
  }
});

// Theme Toggle
themeToggle.addEventListener('change', (e) => {
  if (e.target.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('backdrop-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('backdrop-theme', 'light');
  }
});

// Restore Theme Preference
const savedTheme = localStorage.getItem('backdrop-theme');
if (savedTheme === 'dark') {
  themeToggle.checked = true;
  document.documentElement.setAttribute('data-theme', 'dark');
}

// Initial Render
renderWallpapers();
