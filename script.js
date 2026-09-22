(() => {
  'use strict';

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- off-canvas nav ---------------- */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const navScrim = document.getElementById('navScrim');

  const closeNav = () => {
    mainNav.classList.remove('is-open');
    navScrim.classList.remove('is-open');
    mainNav.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  const openNav = () => {
    mainNav.classList.add('is-open');
    navScrim.classList.add('is-open');
    mainNav.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  menuToggle.addEventListener('click', () => {
    mainNav.classList.contains('is-open') ? closeNav() : openNav();
  });
  navScrim.addEventListener('click', closeNav);
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

  /* ---------------- hero: background crossfade (video/image scenes) ---------------- */
  const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
  let heroSlideIndex = 0;
  if (heroSlides.length > 1) {
    setInterval(() => {
      heroSlides[heroSlideIndex].classList.remove('is-active');
      heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
      heroSlides[heroSlideIndex].classList.add('is-active');
    }, 5000);
  }

  /* ---------------- hero: title cycling (Séjour / Gastronomie / Bien-être) ---------------- */
  const heroTitleLines = Array.from(document.querySelectorAll('.hero-title-line'));
  let heroTitleIndex = 0;
  if (heroTitleLines.length > 1) {
    setInterval(() => {
      heroTitleLines[heroTitleIndex].classList.remove('is-active');
      heroTitleIndex = (heroTitleIndex + 1) % heroTitleLines.length;
      heroTitleLines[heroTitleIndex].classList.add('is-active');
    }, 3600);
  }

  /* ---------------- hero: caption cycling ---------------- */
  const captionLines = Array.from(document.querySelectorAll('.hero-caption-line'));
  let captionIndex = 0;
  if (captionLines.length > 1) {
    setInterval(() => {
      captionLines[captionIndex].classList.remove('is-active');
      captionIndex = (captionIndex + 1) % captionLines.length;
      captionLines[captionIndex].classList.add('is-active');
    }, 4400);
  }

  /* ---------------- chambres & suites: slideshow synchronisé image + légende ----------------
     Un seul emplacement photo, deux calques en crossfade. Un seul interval.
     8 chambres au total ; certains visuels ci-dessous sont des placeholders
     réutilisant des assets existants du projet — voir le résumé livré avec
     cette section pour la liste de ceux à remplacer par de vraies photos. */
  function initRoomsSlideshow() {
    const rooms = [
      { image: 'assets/images/hero-1-suite.jpg', caption: 'Chambre Roseraie' },
      { image: 'assets/images/gallery-lobby.jpg', caption: 'Suite du Parc' },
      { image: 'assets/images/hero-5-garden.jpg', caption: 'Chambre Jardin' },
      { image: 'assets/images/suites-terrace.jpg', caption: 'Appartement Terrasse' },
      { image: 'assets/images/gallery-garden-lounge.jpg', caption: 'Suite Héritage' },
      { image: 'assets/images/spa-hallway.jpg', caption: 'Bain de lumière' },
      { image: 'assets/images/instagram-1.jpg', caption: 'Détails de la Roseraie' },
      { image: 'assets/images/hero-primary-chateau.jpg', caption: 'Suite sur le Parc' }
    ];

    const wrap = document.querySelector('.rooms-visual');
    const layers = document.querySelectorAll('.rooms-slide');
    const captionEl = document.getElementById('roomsCaption');
    if (!wrap || layers.length < 2 || !captionEl) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // préchargement — évite l'écran vide au moment du changement
    rooms.forEach(room => { const img = new Image(); img.src = room.image; });

    let index = 0;
    let active = 0;
    layers[0].src = rooms[0].image;
    layers[0].alt = rooms[0].caption;
    layers[0].classList.add('is-active');
    captionEl.textContent = rooms[0].caption;

    const showRoom = (nextIndex) => {
      const next = 1 - active;
      layers[next].src = rooms[nextIndex].image;
      layers[next].alt = rooms[nextIndex].caption;
      layers[next].classList.add('is-active');
      layers[active].classList.remove('is-active');
      active = next;

      if (reduceMotion) {
        captionEl.textContent = rooms[nextIndex].caption;
      } else {
        captionEl.classList.add('is-fading');
        setTimeout(() => {
          captionEl.textContent = rooms[nextIndex].caption;
          captionEl.classList.remove('is-fading');
        }, 350);
      }
    };

    setInterval(() => {
      index = (index + 1) % rooms.length;
      showRoom(index);
    }, 5000);
  }
  initRoomsSlideshow();

  /* ---------------- scroll-reveal (fade/slide/word appear) ---------------- */
  const revealSelectors = '.reveal-up, .slide-in-left, .slide-in-right, .fade-in, .rise-in, .reveal-word, .transition-photo';
  const revealEls = document.querySelectorAll(revealSelectors);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------- plan 1 → plan 2: title exits upward as it scrolls out ---------------- */
  const exitEls = document.querySelectorAll('#manifestoEyebrow, #manifestoTitles, .manifesto-copy');
  if (exitEls.length && 'IntersectionObserver' in window) {
    const exitIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && entry.boundingClientRect.bottom < 0) {
          entry.target.classList.add('is-left');
        } else if (entry.isIntersecting) {
          entry.target.classList.remove('is-left');
        }
      });
    }, { threshold: 0 });
    exitEls.forEach(el => exitIO.observe(el));
  }

  /* ---------------- scroll-linked background tint (rose / crème / jaune) ---------------- */
  /* one fixed layer paints the whole page behind everything; its color is
     recomputed every scroll frame from where the reader currently is
     relative to each section — the "bois → rose → crème → rose → crème →
     jaune" journey described in the brief. Spa and the newsletter keep
     their own photographic backgrounds, so they're left out on purpose:
     the tint just holds steady underneath them, invisibly, until the
     reader reaches the next section that actually shows it. */
  const bgTint = document.getElementById('bgTint');
  const ROSE = [218, 90, 82];
  const CREAM = [244, 238, 230];
  const YELLOW = [232, 185, 47];

  const tintSections = [
    { el: document.getElementById('manifesto'), c: ROSE },
    { el: document.getElementById('transition'), c: ROSE },
    { el: document.getElementById('suites'), c: CREAM },
    { el: document.getElementById('gastronomie'), c: ROSE },
    { el: document.getElementById('cafe'), c: ROSE },
    { el: document.getElementById('experiences'), c: CREAM },
    { el: document.getElementById('social'), c: YELLOW },
    { el: document.getElementById('cta'), c: CREAM }
  ].filter(s => s.el);

  let tintAnchors = [];

  const pageTop = (el) => {
    const r = el.getBoundingClientRect();
    return r.top + window.scrollY;
  };

  const sameColor = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

  const buildTintAnchors = () => {
    if (!bgTint || tintSections.length === 0) { tintAnchors = []; return; }
    const anchors = [];
    tintSections.forEach((section, i) => {
      const top = pageTop(section.el);
      const height = section.el.offsetHeight;
      const bottom = top + height;
      if (i === 0) {
        anchors.push({ y: top, c: section.c });
      } else if (!sameColor(tintSections[i - 1].c, section.c)) {
        anchors.push({ y: top, c: tintSections[i - 1].c });
        anchors.push({ y: top + height * 0.12, c: section.c });
      }
      anchors.push({ y: bottom, c: section.c });
    });
    tintAnchors = anchors;
  };

  const lerp = (a, b, t) => a + (b - a) * t;

  const updateTint = () => {
    if (!bgTint || tintAnchors.length === 0) return;
    const ref = window.scrollY + window.innerHeight * 0.35;
    let color = tintAnchors[0].c;

    if (ref <= tintAnchors[0].y) {
      color = tintAnchors[0].c;
    } else if (ref >= tintAnchors[tintAnchors.length - 1].y) {
      color = tintAnchors[tintAnchors.length - 1].c;
    } else {
      for (let i = 0; i < tintAnchors.length - 1; i++) {
        const a = tintAnchors[i], b = tintAnchors[i + 1];
        if (ref >= a.y && ref <= b.y) {
          const t = b.y === a.y ? 0 : (ref - a.y) / (b.y - a.y);
          color = [
            Math.round(lerp(a.c[0], b.c[0], t)),
            Math.round(lerp(a.c[1], b.c[1], t)),
            Math.round(lerp(a.c[2], b.c[2], t))
          ];
          break;
        }
      }
    }
    bgTint.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  };

  /* ---------------- continuous scroll-parallax on img[data-parallax-*] ---------------- */
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax-y], [data-parallax-x]'));

  const updateParallax = () => {
    const vh = window.innerHeight;
    parallaxEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const centerOffset = (rect.top + rect.height / 2) - vh / 2;
      const normalized = Math.max(-1, Math.min(1, centerOffset / (vh / 2)));
      const dy = el.dataset.parallaxY ? normalized * parseFloat(el.dataset.parallaxY) : null;
      const dx = el.dataset.parallaxX ? normalized * parseFloat(el.dataset.parallaxX) : null;
      if (dy !== null) el.style.setProperty('--py', dy.toFixed(1) + 'px');
      if (dx !== null) el.style.setProperty('--px', dx.toFixed(1) + 'px');
    });
  };

  /* ---------------- rAF scroll loop ---------------- */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateTint();
      updateParallax();
      ticking = false;
    });
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { buildTintAnchors(); updateTint(); updateParallax(); });

  window.addEventListener('load', () => {
    buildTintAnchors();
    updateTint();
    updateParallax();
  });
  buildTintAnchors();
  updateTint();
  updateParallax();

  /* ---------------- newsletter form (local only, no network) ---------------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterNote = document.getElementById('newsletterNote');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterNote.textContent = 'Merci — vous êtes inscrit(e) aux nouvelles du domaine.';
      newsletterNote.classList.add('is-visible');
      newsletterForm.reset();
    });
  }

  /* ---------------- cookie banner ---------------- */
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const COOKIE_KEY = 'roseraie-cookies-ack';

  try {
    if (!localStorage.getItem(COOKIE_KEY)) {
      setTimeout(() => cookieBanner.classList.add('is-visible'), 1400);
    }
  } catch (err) {
    setTimeout(() => cookieBanner.classList.add('is-visible'), 1400);
  }

  cookieAccept.addEventListener('click', () => {
    cookieBanner.classList.remove('is-visible');
    try { localStorage.setItem(COOKIE_KEY, '1'); } catch (err) { /* ignore */ }
  });

  /* ---------------- subtle custom cursor dot (desktop only) ---------------- */
  const cursorDot = document.querySelector('.cursor-dot');
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
      cursorDot.classList.add('is-active');
    }, { passive: true });
    document.addEventListener('mouseleave', () => cursorDot.classList.remove('is-active'));
  }

})();
