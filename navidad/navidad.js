// /navidad/: la sala sola, entra el sobre cerrado y, con el scroll, la solapa gira y la carta sube.
// Despues la pagina sigue normal. Sin scroll-jacking: es un sticky comun controlado por el scroll.
(function () {
  var root = document.documentElement;
  var stage = document.getElementById('stage');
  var sobre = document.getElementById('sobre');
  var flap = document.getElementById('flap');
  var carta = document.getElementById('carta');
  var sTapa = document.getElementById('sombraTapa');
  var shades = flap ? flap.querySelectorAll('.nv-flap__shade') : [];
  var ui = document.getElementById('heroUi');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Entrada de las secciones
  var secs = document.querySelectorAll('.nv-in');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    secs.forEach(function (s) { io.observe(s); });
  } else {
    secs.forEach(function (s) { s.classList.add('is-in'); });
  }

  // Boton fijo de compra: aparece al terminar la escena del sobre, se esconde mientras se ve la seccion de entradas
  var buy = document.getElementById('nvBuy');
  var entradas = document.getElementById('entradas');
  if (buy && stage) {
    var passed = false, inEntradas = false;
    var buyUpdate = function () { buy.classList.toggle('is-on', passed && !inEntradas); };
    var onPass = function () {
      passed = stage.getBoundingClientRect().bottom <= window.innerHeight * 0.9;
      buyUpdate();
    };
    window.addEventListener('scroll', onPass, { passive: true });
    window.addEventListener('resize', onPass);
    onPass();
    if ('IntersectionObserver' in window && entradas) {
      new IntersectionObserver(function (es) {
        inEntradas = es[0].isIntersecting; buyUpdate();
      }, { threshold: 0.35 }).observe(entradas);
    }
  }

  // Parallax: el fondo de "Quiénes tocan" y las polaroids se mueven mas lento (o distinto) que el texto
  var pbg = document.getElementById('pbg');
  var drifts = document.querySelectorAll('[data-drift]');
  if (!reduce && (pbg || drifts.length)) {
    var pTick = false;
    var prog = function (r, vh) { return Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height))); };
    var pDraw = function () {
      pTick = false;
      var vh = window.innerHeight, r, t, i;
      if (pbg) {
        r = pbg.parentNode.getBoundingClientRect();
        if (r.bottom > -50 && r.top < vh + 50) {
          t = prog(r, vh);
          pbg.style.transform = 'translateY(' + ((t - 0.5) * 2 * 0.14 * r.height).toFixed(1) + 'px)';
        }
      }
      for (i = 0; i < drifts.length; i++) {
        r = drifts[i].closest('.nv-sec').getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh + 50) continue;
        t = prog(r, vh);
        drifts[i].style.setProperty('--dy', ((t - 0.5) * 2 * parseFloat(drifts[i].getAttribute('data-drift'))).toFixed(1) + 'px');
      }
    };
    var pReq = function () { if (!pTick) { pTick = true; requestAnimationFrame(pDraw); } };
    window.addEventListener('scroll', pReq, { passive: true });
    window.addEventListener('resize', pReq);
    pDraw();
  }

  if (!stage || !sobre || !flap || !carta) return;

  // Medidas en px del lienzo del PSD (1271 x 1483)
  var RISE = 400;          // cuanto sube la carta
  var CAM = 0.193;         // el sobre cerrado queda centrado: la camara baja esta fraccion del alto y sube al abrirse
  var ST = { flapA: 0.06, flapB: 0.46, cardA: 0.46, cardB: 0.86 };

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function seg(p, a, b) { return clamp((p - a) / (b - a), 0, 1); }

  var u = 1, H = 0;
  function measure() { u = sobre.offsetWidth / 1271; H = sobre.offsetHeight; }

  // p = progreso 0..1 del scroll dentro de la escena
  function draw(p) {
    var f = ease(seg(p, ST.flapA, ST.flapB));
    var c = ease(seg(p, ST.cardA, ST.cardB));
    var th = 180 * f, rad = th * Math.PI / 180;
    flap.style.transform = 'rotateX(' + th.toFixed(2) + 'deg)';
    flap.style.zIndex = th < 90 ? 5 : 1;               // cerrada: delante de todo; abierta: detras de la carta
    var shade = (0.34 * Math.sin(rad)).toFixed(3);      // la solapa se oscurece al girar y recupera luz al abrirse
    for (var i = 0; i < shades.length; i++) shades[i].style.opacity = shade;
    if (sTapa) {   // la sombra de la tapa cerrada se aclara y se aleja al levantarse
      var lift = clamp(th / 90, 0, 1);
      sTapa.style.opacity = (0.62 * (1 - lift)).toFixed(3);
      sTapa.style.transform = 'translateY(' + ((18 + 40 * lift) * u).toFixed(2) + 'px)';
    }
    carta.style.transform = 'translateY(' + (-RISE * u * c).toFixed(2) + 'px)';
    sobre.style.transform = 'translateY(' + (-CAM * H * (1 - f)).toFixed(2) + 'px)';
    if (ui) {
      ui.style.opacity = clamp(1 - p / 0.07, 0, 1).toFixed(3);
      ui.style.pointerEvents = p > 0.05 ? 'none' : '';
    }
  }

  if (reduce) {
    // Sin animacion: se ve el sobre ya abierto con la carta arriba
    measure(); draw(1);
    if (ui) ui.style.display = 'none';
    window.addEventListener('resize', function () { measure(); draw(1); });
    return;
  }
  root.classList.add('nv-anim');

  var top = 0, range = 1, target = 0, cur = 0, running = false;
  function layout() {
    measure();
    top = stage.offsetTop;
    range = Math.max(1, stage.offsetHeight - window.innerHeight);
    target = clamp((window.scrollY - top) / range, 0, 1);
  }
  // Un poco de inercia: la rueda del mouse va a saltos y asi el giro se siente continuo
  function tick() {
    var d = target - cur;
    if (Math.abs(d) < 0.0004) { cur = target; draw(cur); running = false; return; }
    cur += d * 0.14;
    draw(cur);
    requestAnimationFrame(tick);
  }
  function onScroll() {
    target = clamp((window.scrollY - top) / range, 0, 1);
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
  function init() { layout(); cur = target; draw(cur); }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', init);
  init();
})();
