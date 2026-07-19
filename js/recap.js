// ===== Datos de la galería (placeholder — reemplazar por las 20 fotos reales) =====
const placeholderPhotos = [
  'assets/hero-ecos-de-la-casa.jpg',
  'assets/foto-alex-vertical.jpg',
  'assets/foto-footer.jpg',
];

const photos = Array.from({ length: 20 }, (_, i) => ({
  src: placeholderPhotos[i % placeholderPhotos.length],
  caption: `[Placeholder] Leyenda de la foto ${i + 1} — reemplazar con la real`,
}));

// ===== Render de la rueda de fotos =====
const track = document.getElementById('cardTrack');
const viewport = track ? track.parentElement : null;
const captionEl = document.getElementById('cardCaption');
const counterEl = document.getElementById('cardCounter');
const prevBtn = document.getElementById('cardPrev');
const nextBtn = document.getElementById('cardNext');

let currentIndex = 0;

if (track && viewport) {
  photos.forEach((photo, i) => {
    const card = document.createElement('div');
    card.className = 'card-stack__card';
    card.dataset.index = i;

    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.caption;
    img.loading = 'lazy';

    card.appendChild(img);
    track.appendChild(card);
  });

  const cards = track.querySelectorAll('.card-stack__card');

  function render() {
    cards.forEach((card, i) => {
      card.classList.toggle('is-active', i === currentIndex);
    });

    const activeCard = cards[currentIndex];
    const shift = activeCard.offsetLeft - (viewport.clientWidth - activeCard.offsetWidth) / 2;
    track.style.transform = `translateX(${-shift}px)`;

    captionEl.textContent = photos[currentIndex].caption;
    counterEl.textContent = `${currentIndex + 1} / ${photos.length}`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === photos.length - 1;
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(photos.length - 1, index));
    render();
  }

  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));
  window.addEventListener('resize', render);

  // Swipe táctil
  let touchStartX = 0;
  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) {
      goTo(currentIndex + (delta < 0 ? 1 : -1));
    }
  }, { passive: true });

  render();
}
