const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const navLinks = nav.querySelectorAll('a');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const projectButtons = document.querySelectorAll('[data-lightbox]');

function setMenu(open) {
  nav.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  document.body.classList.toggle('menu-open', open);
}

menuButton.addEventListener('click', () => {
  setMenu(!nav.classList.contains('open'));
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMenu(false);
    closeLightbox();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) setMenu(false);
});

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 24);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// El logo y el enlace del footer vuelven siempre al inicio real de la página.
document.querySelectorAll('[data-scroll-top]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    setMenu(false);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  });
});
const revealElements = document.querySelectorAll('.reveal');

if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

function openLightbox(src, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt || '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  if (!lightbox.classList.contains('open')) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lightboxImage.src = '';
}

projectButtons.forEach((button) => {
  button.addEventListener('click', () => {
    openLightbox(button.dataset.lightbox, button.dataset.alt);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.getElementById('year').textContent = new Date().getFullYear();
