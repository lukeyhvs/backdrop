// Register Service Worker for Offline Functionality
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Backdrop Service Worker Registered'))
    .catch(err => console.error('SW Registration Failed', err));
}

// Pre-uploaded Wallpapers Dataset
const wallpapers = [
  {
    id: 1,
    title: "Mountain Ridge",
    category: "nature",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Neon Flow",
    category: "abstract",
    url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Clean Dunes",
    category: "minimal",
    url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Forest Fog",
    category: "nature",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Cosmic Glow",
    category: "abstract",
    url: "https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "Calm Waves",
    category: "minimal",
    url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80"
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

// Category Filter Click Handling
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
