const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const dialog = document.querySelector('#gallery-dialog');
const galleryImage = document.querySelector('#gallery-image');
const galleryCaption = document.querySelector('#gallery-caption');
const galleryTitle = document.querySelector('#gallery-title');
const thumbs = document.querySelector('#gallery-thumbs');

let storedTheme = null;
try { storedTheme = localStorage.getItem('rafael-theme'); } catch (_) { storedTheme = null; }
if (storedTheme === 'light' || storedTheme === 'dark') {
  root.dataset.theme = storedTheme;
} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
  root.dataset.theme = 'light';
}

themeToggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('rafael-theme', next); } catch (_) { /* Storage may be unavailable. */ }
});

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  nav.classList.toggle('open', !isOpen);
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
  });
});

const galleries = {
  gid: {
    title: 'GID Industrial ERP & Product Data Platform',
    images: [
      ['assets/gid/1.jpg', 'Lead pipeline and status tracking'],
      ['assets/gid/2.jpg', 'Lead details and line items'],
      ['assets/gid/3.jpg', 'Quote management'],
      ['assets/gid/4.jpg', 'Purchase order details'],
      ['assets/gid/5.jpg', 'Receiving and shipping workflow'],
      ['assets/gid/6.jpg', 'Sales order overview'],
      ['assets/gid/7.jpg', 'Sales order line items and actions'],
      ['assets/gid/8.jpg', 'Sales order purchasing details'],
      ['assets/gid/9.jpg', 'Invoice list and totals'],
      ['assets/gid/10.jpg', 'Invoice details'],
      ['assets/gid/11.jpg', 'Warehouse management'],
      ['assets/gid/12.jpg', 'Warehouse transaction records'],
      ['assets/gid/13.jpg', 'Company records'],
      ['assets/gid/14.jpg', 'Sales order reporting'],
      ['assets/gid/15.jpg', 'Top customer profitability report'],
      ['assets/gid/16.jpg', 'Industry administration'],
      ['assets/gid/gidindustrial.jpg', 'GID Industrial public website']
    ]
  },
  zecar: {
    title: 'Zecar Electric Vehicle Marketplace',
    images: [
      ['assets/zecar/1.jpg', 'EV catalogue and vehicle search'],
      ['assets/zecar/2.jpg', 'Detailed vehicle and variant page'],
      ['assets/zecar/3.jpg', 'Knowledge hub and resources'],
      ['assets/zecar/4.jpg', 'Vehicle reviews'],
      ['assets/zecar/5.jpg', 'EV offers and deals']
    ]
  }
};

let activeGallery = null;
let activeIndex = 0;

function renderGallery(index) {
  if (!activeGallery) return;
  const items = activeGallery.images;
  activeIndex = (index + items.length) % items.length;
  const [src, caption] = items[activeIndex];
  galleryImage.src = src;
  galleryImage.alt = caption;
  galleryCaption.textContent = `${activeIndex + 1} / ${items.length} · ${caption}`;
  thumbs.querySelectorAll('button').forEach((button, i) => {
    button.classList.toggle('active', i === activeIndex);
    button.setAttribute('aria-current', i === activeIndex ? 'true' : 'false');
  });
  thumbs.children[activeIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function openGallery(name) {
  activeGallery = galleries[name];
  activeIndex = 0;
  galleryTitle.textContent = activeGallery.title;
  thumbs.innerHTML = '';
  activeGallery.images.forEach(([src, caption], index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `View ${caption}`);
    button.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
    button.addEventListener('click', () => renderGallery(index));
    thumbs.appendChild(button);
  });
  renderGallery(0);
  dialog.showModal();
}

document.querySelectorAll('.open-gallery').forEach((button) => {
  button.addEventListener('click', () => openGallery(button.dataset.gallery));
});

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('.gallery-nav.previous').addEventListener('click', () => renderGallery(activeIndex - 1));
document.querySelector('.gallery-nav.next').addEventListener('click', () => renderGallery(activeIndex + 1));

dialog.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) dialog.close();
});

dialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') renderGallery(activeIndex - 1);
  if (event.key === 'ArrowRight') renderGallery(activeIndex + 1);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
document.querySelector('#year').textContent = String(new Date().getFullYear());
