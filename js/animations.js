// ===== Títulos: animación de entrada palabra por palabra =====
function wrapWords(el) {
  const nodes = Array.from(el.childNodes);
  el.innerHTML = '';
  const words = [];

  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (part === '') return;
        if (/^\s+$/.test(part)) {
          el.appendChild(document.createTextNode(part));
        } else {
          const span = document.createElement('span');
          span.className = 'word-anim';
          span.textContent = part;
          el.appendChild(span);
          words.push(span);
        }
      });
    } else {
      node.classList.add('word-anim');
      el.appendChild(node);
      words.push(node);
    }
  });

  words.forEach((word, i) => {
    word.style.transitionDelay = `${i * 45}ms`;
  });

  return words;
}

const titleEls = document.querySelectorAll('.split-words');
const titleWords = new Map();
titleEls.forEach((el) => titleWords.set(el, wrapWords(el)));

if ('IntersectionObserver' in window) {
  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        (titleWords.get(entry.target) || []).forEach((w) => w.classList.add('is-visible'));
        titleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  titleEls.forEach((el) => titleObserver.observe(el));
} else {
  titleEls.forEach((el) => (titleWords.get(el) || []).forEach((w) => w.classList.add('is-visible')));
}

// ===== Cajas: desplazamiento + opacidad, escalonado =====
if ('IntersectionObserver' in window) {
  const boxObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.stagger-item');
        items.forEach((item, i) => {
          item.style.transitionDelay = `${i * 90}ms`;
          item.classList.add('is-visible');
        });
        boxObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => boxObserver.observe(el));
} else {
  document.querySelectorAll('.stagger-item').forEach((el) => el.classList.add('is-visible'));
}
