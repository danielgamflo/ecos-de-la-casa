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

// ===== Contador de entradas =====
const ticketsTotal = 150;
const ticketsSold = 103;
const ticketsLeft = ticketsTotal - ticketsSold;
const pct = Math.round((ticketsSold / ticketsTotal) * 100);

const ticketsFill = document.getElementById('ticketsFill');
const ticketsLabel = document.getElementById('ticketsLabel');

if (ticketsFill) ticketsFill.style.width = `${pct}%`;
if (ticketsLabel) ticketsLabel.textContent = `Entradas disponibles: ${ticketsLeft}/${ticketsTotal}`;

// ===== Botón flotante "Comprar entrada" =====
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
