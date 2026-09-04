// ===== Galería última sesión + lightbox =====
const sessionGallery = document.getElementById('sessionGallery');
if (sessionGallery) {
  const sessionPhotoNums = ['01', '07', '10', '14', '18', '21', '24', '25', '33', '34'];
  const sessionPhotos = sessionPhotoNums.map((n) => `assets/sesion-01/galeria/foto-${n}.jpg`);

  sessionPhotos.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Sesión 01 — foto ${i + 1}`;
    img.loading = 'lazy';
    img.dataset.index = i;
    sessionGallery.appendChild(img);
  });

  const sessionLightbox = document.getElementById('sessionLightbox');
  const sessionLightboxImg = document.getElementById('sessionLightboxImg');
  const sessionLightboxCounter = document.getElementById('sessionLightboxCounter');
  const sessionLightboxPrev = document.getElementById('sessionLightboxPrev');
  const sessionLightboxNext = document.getElementById('sessionLightboxNext');
  const sessionLightboxClose = document.getElementById('sessionLightboxClose');

  let sessionIndex = 0;

  function updateSessionLightbox() {
    sessionLightboxImg.src = sessionPhotos[sessionIndex];
    sessionLightboxImg.alt = `Sesión 01 — foto ${sessionIndex + 1}`;
    sessionLightboxCounter.textContent = `${sessionIndex + 1} / ${sessionPhotos.length}`;
  }

  function openSessionLightbox(i) {
    sessionIndex = i;
    updateSessionLightbox();
    sessionLightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeSessionLightbox() {
    sessionLightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  sessionGallery.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (img) openSessionLightbox(Number(img.dataset.index));
  });

  sessionLightboxClose.addEventListener('click', closeSessionLightbox);
  sessionLightbox.addEventListener('click', (e) => {
    if (e.target === sessionLightbox) closeSessionLightbox();
  });
  sessionLightboxPrev.addEventListener('click', () => {
    sessionIndex = (sessionIndex - 1 + sessionPhotos.length) % sessionPhotos.length;
    updateSessionLightbox();
  });
  sessionLightboxNext.addEventListener('click', () => {
    sessionIndex = (sessionIndex + 1) % sessionPhotos.length;
    updateSessionLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!sessionLightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeSessionLightbox();
    if (e.key === 'ArrowLeft') {
      sessionIndex = (sessionIndex - 1 + sessionPhotos.length) % sessionPhotos.length;
      updateSessionLightbox();
    }
    if (e.key === 'ArrowRight') {
      sessionIndex = (sessionIndex + 1) % sessionPhotos.length;
      updateSessionLightbox();
    }
  });
}

// ===== Carrusel de fotos del hero =====
const heroSlides = document.querySelectorAll('.hero__bg-slide');
if (heroSlides.length > 1) {
  let heroSlideIndex = 0;
  setInterval(() => {
    heroSlides[heroSlideIndex].classList.remove('is-active');
    heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
    heroSlides[heroSlideIndex].classList.add('is-active');
  }, 5000);
}

// ===== Parallax en hero y CTA =====
const heroBg = document.querySelector('[data-parallax="hero"]');
const ctaBg = document.querySelector('[data-parallax="cta"]');

let parallaxTicking = false;

function updateParallax() {
  if (heroBg) {
    const r = heroBg.parentElement.getBoundingClientRect();
    heroBg.style.transform = `translateY(${r.top * 0.18}px)`;
  }
  if (ctaBg) {
    const r = ctaBg.parentElement.getBoundingClientRect();
    ctaBg.style.transform = `translateY(${r.top * 0.18}px)`;
  }
  parallaxTicking = false;
}

function onScroll() {
  if (!parallaxTicking) {
    requestAnimationFrame(updateParallax);
    parallaxTicking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
updateParallax();

// ===== Reveal al hacer scroll =====
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
}

// ===== FAQ acordeón =====
document.querySelectorAll('.faq-item__question').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const isOpen = item.classList.contains('is-open');

    document.querySelectorAll('.faq-item.is-open').forEach((openItem) => {
      openItem.classList.remove('is-open');
      openItem.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
      openItem.querySelector('.faq-item__mark').textContent = '+';
    });

    if (!isOpen) {
      item.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
      item.querySelector('.faq-item__mark').textContent = '−';
    }
  });
});

// ===== Botón flotante =====
const floatingCta = document.getElementById('floatingCta');
const heroSection = document.getElementById('hero');

if (floatingCta && heroSection && 'IntersectionObserver' in window) {
  const ctaObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      floatingCta.classList.toggle('is-visible', !entry.isIntersecting);
    });
  }, { threshold: 0 });

  ctaObserver.observe(heroSection);
}
