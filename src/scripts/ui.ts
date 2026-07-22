// Sticky nav: dodaje tło po przewinięciu.
const nav = document.querySelector('[data-nav]');
const onScroll = () => {
  if (!nav) return;
  nav.classList.toggle('bg-brand-950/90', window.scrollY > 8);
  nav.classList.toggle('backdrop-blur', window.scrollY > 8);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Menu mobilne.
const toggle = document.querySelector('[data-nav-toggle]');
const menu = document.querySelector<HTMLElement>('[data-nav-menu]');
toggle?.addEventListener('click', () => {
  if (!menu) return;
  const open = menu.hasAttribute('hidden');
  if (open) menu.removeAttribute('hidden');
  else menu.setAttribute('hidden', '');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
});
menu?.querySelectorAll('[data-nav-link]').forEach((link) =>
  link.addEventListener('click', () => {
    menu.setAttribute('hidden', '');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Otwórz menu');
  }),
);

// Animacja pojawiania sekcji (z poszanowaniem reduced-motion).
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
}

// Migoczące gwiazdy (kanwy w sekcjach ciemnych: hero, CTA końcowy).
// Przy reduced-motion rysujemy statycznie.
const initStars = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  let stars: { x: number; y: number; r: number; p: number; s: number }[] = [];
  let w = 0;
  let h = 0;
  let raf = 0;
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
    const count = Math.round((w * h) / 4500);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3,
      p: Math.random() * Math.PI * 2,
      s: Math.random() * 0.03 + 0.008,
    }));
  };
  const draw = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    for (const st of stars) {
      if (!reduce) st.p += st.s;
      const a = reduce ? 0.55 : 0.35 + Math.sin(st.p) * 0.35;
      ctx.globalAlpha = Math.max(0, a);
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!reduce) raf = requestAnimationFrame(draw);
  };
  resize();
  draw();
  window.addEventListener(
    'resize',
    () => {
      cancelAnimationFrame(raf);
      resize();
      draw();
    },
    { passive: true },
  );
};
document.querySelectorAll<HTMLCanvasElement>('[data-stars]').forEach(initStars);

// Liczby liczące (np. „Co w pudełku") — nabijają się od zera przy wejściu w kadr.
const counters = document.querySelectorAll<HTMLElement>('[data-count]');
if (counters.length) {
  const countTo = (el: HTMLElement) => {
    const target = Number(el.dataset.count);
    if (reduce || !Number.isFinite(target) || target < 10) {
      el.textContent = el.dataset.count ?? '';
      return;
    }
    const dur = 1100;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = String(Math.round(target * eased));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const cio = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        cio.unobserve(e.target);
        countTo(e.target as HTMLElement);
      }
    },
    { threshold: 0.5 },
  );
  counters.forEach((el) => cio.observe(el));
}

// Sprężyste wejście („Jak grać") — pop kroków przy wejściu w kadr.
const popEls = document.querySelectorAll('[data-pop]');
if (popEls.length) {
  const pio = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-pop');
          pio.unobserve(e.target);
        }
      }
    },
    { threshold: 0.2 },
  );
  popEls.forEach((el) => pio.observe(el));
}

// Galeria: lightbox z podglądem i nawigacją lewo/prawo.
const lightbox = document.querySelector<HTMLElement>('[data-lightbox]');
const galleryItems = [...document.querySelectorAll<HTMLAnchorElement>('[data-gallery-item]')];
if (lightbox && galleryItems.length) {
  const lbImg = lightbox.querySelector<HTMLImageElement>('[data-lb-img]');
  let index = 0;
  const render = (i: number) => {
    index = (i + galleryItems.length) % galleryItems.length;
    const item = galleryItems[index];
    if (lbImg) {
      lbImg.src = item.getAttribute('href') ?? '';
      lbImg.alt = item.dataset.alt ?? '';
    }
  };
  const openLb = (i: number) => {
    render(i);
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };
  const closeLb = () => {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.style.overflow = '';
  };
  galleryItems.forEach((item, i) =>
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLb(i);
    }),
  );
  lightbox.querySelector('[data-lb-close]')?.addEventListener('click', closeLb);
  lightbox.querySelector('[data-lb-prev]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    render(index - 1);
  });
  lightbox.querySelector('[data-lb-next]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    render(index + 1);
  });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLb();
  });
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') render(index - 1);
    else if (e.key === 'ArrowRight') render(index + 1);
  });
}
